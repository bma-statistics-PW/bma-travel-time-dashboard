/* =====================================================
   BMA Travel Time Dashboard — Application Logic
   ===================================================== */

(function () {
  'use strict';

  /* ── State ── */
  let dashData = null;
  let currentLang = 'th';
  let currentDir  = 'in';       // 'in' | 'out'
  let sortState   = {};          // { zone: { col, dir } }
  let activeZoneFilter  = 'all';
  let activeTrendFilter = 'all';
  let searchQuery = '';

  /* ── Speed colour helper ── */
  function speedClass(v) {
    if (v === null || v === undefined) return '';
    if (v >= 30) return 'speed-fast';
    if (v >= 20) return 'speed-mid';
    if (v >= 10) return 'speed-slow';
    return 'speed-jam';
  }

  /* ── Number formatting ── */
  function fmt(v, d) {
    if (v === null || v === undefined) return '—';
    return Number(v).toFixed(d !== undefined ? d : 2);
  }

  /* ── Speed → travel time (min/10km) ── */
  function toTime(speed) {
    if (!speed || speed <= 0) return '—';
    return (600 / speed).toFixed(1);
  }

  /* ── i18n apply ── */
  function applyI18n(lang) {
    const dict = window.I18N && window.I18N[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      raw.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key && dict[key] !== undefined) {
          el.setAttribute(attr.trim(), dict[key]);
        }
      });
    });
    /* Update html lang */
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    /* Update lang button states */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const pressed = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', pressed);
      btn.setAttribute('aria-pressed', String(pressed));
    });
  }

  /* ── Theme ── */
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icon = document.querySelector('#themeToggle .theme-icon');
    if (icon) icon.textContent = dark ? '◑' : '◐';
    try { localStorage.setItem('bma-theme', dark ? 'dark' : 'light'); } catch(e) {}
  }

  function initTheme() {
    let pref = 'light';
    try { pref = localStorage.getItem('bma-theme') || 'light'; } catch(e) {}
    applyTheme(pref === 'dark');
  }

  /* ── Language init ── */
  function initLang() {
    const params = new URLSearchParams(window.location.search);
    let lang = params.get('lang');
    if (!lang) {
      try { lang = localStorage.getItem('bma-lang') || 'th'; } catch(e) { lang = 'th'; }
    }
    currentLang = (lang === 'en') ? 'en' : 'th';
    applyI18n(currentLang);
  }

  /* ── Render Zone Stats (accordion summaries) ── */
  function renderZoneStats(roads) {
    const zones = ['inner', 'middle', 'outer'];
    zones.forEach(zone => {
      const zRoads = roads.filter(r => r.zone === zone);
      if (!zRoads.length) return;

      const avg = (key) => {
        const vals = zRoads.map(r => r[key]).filter(v => v !== null && v !== undefined);
        return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : 0;
      };
      const amIn  = avg('speed_am_in');
      const amOut = avg('speed_am_out');
      const pmIn  = avg('speed_pm_in');
      const pmOut = avg('speed_pm_out');

      const speeds = zRoads.map(r => r.speed_am_in).filter(v => v !== null);
      const minS = Math.min(...speeds);
      const maxS = Math.max(...speeds);

      /* Update summary stats */
      const set = (attr, val) => {
        document.querySelectorAll(`[data-stat="${zone}-${attr}"]`).forEach(el => {
          el.textContent = fmt(val);
        });
      };
      set('am-in',  amIn);
      set('am-out', amOut);
      set('pm-in',  pmIn);
      set('pm-out', pmOut);

      /* Update avg in summary */
      document.querySelectorAll(`[data-avg="${zone}-am-in"]`).forEach(el => {
        el.textContent = fmt(amIn);
      });

      /* Update range */
      document.querySelectorAll(`[data-range="${zone}"]`).forEach(el => {
        el.textContent = `${Math.round(minS)}–${Math.round(maxS)}`;
      });

      /* Update count */
      const countText = currentLang === 'en' ? `${zRoads.length} roads` : `${zRoads.length} ถนน`;
      document.querySelectorAll(`[data-count="${zone}"]`).forEach(el => {
        el.textContent = countText;
      });
    });
  }

  /* ── Mini-chart SVG ── */
  function makeMiniChart(road) {
    const vals = [
      { key: 'am-in',  v: road.speed_am_in,  color: '#0984e3' },
      { key: 'am-out', v: road.speed_am_out, color: '#00b894' },
      { key: 'pm-in',  v: road.speed_pm_in,  color: '#e17055' },
      { key: 'pm-out', v: road.speed_pm_out, color: '#6c5ce7' }
    ];
    const maxV = 60;
    const W = 64, H = 32, barW = 12, gap = 4, padX = 2;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'mini-chart');
    svg.setAttribute('aria-hidden', 'true');

    vals.forEach((d, i) => {
      if (d.v === null || d.v === undefined) return;
      const bh = Math.max(2, (d.v / maxV) * (H - 4));
      const x  = padX + i * (barW + gap);
      const y  = H - bh;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barW);
      rect.setAttribute('height', bh);
      rect.setAttribute('rx', 2);
      rect.setAttribute('fill', d.color);
      rect.setAttribute('opacity', '0.85');
      svg.appendChild(rect);

      /* Value label */
      if (d.v >= 5) {
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', x + barW / 2);
        text.setAttribute('y', y - 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '7');
        text.setAttribute('fill', 'currentColor');
        text.setAttribute('font-family', 'IBM Plex Mono, monospace');
        text.textContent = Math.round(d.v);
        svg.appendChild(text);
      }
    });
    return svg;
  }

  /* ── Render Road Table ── */
  function renderRoadTable(zone, roads, sortCol, sortDir) {
    const tbody = document.querySelector(`[data-tbody="${zone}"]`);
    if (!tbody) return;

    let filtered = roads.filter(r => r.zone === zone);

    /* Apply global zone filter */
    if (activeZoneFilter !== 'all' && activeZoneFilter !== zone) {
      tbody.innerHTML = '';
      return;
    }

    /* Apply search */
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.segment && r.segment.toLowerCase().includes(q)) ||
        r.zone.includes(q)
      );
    }

    /* Sort */
    if (sortCol) {
      filtered = filtered.slice().sort((a, b) => {
        const av = a[sortCol] !== null && a[sortCol] !== undefined ? a[sortCol] : -Infinity;
        const bv = b[sortCol] !== null && b[sortCol] !== undefined ? b[sortCol] : -Infinity;
        return sortDir === 'asc' ? av - bv : bv - av;
      });
    }

    tbody.innerHTML = '';
    filtered.forEach(road => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-road-id', road.seq);
      tr.setAttribute('data-zone', road.zone);

      const noteOut = road.note_am_out || road.note_pm_out;

      tr.innerHTML = `
        <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted)">${road.seq}</td>
        <td class="td-road-name">
          ${road.name}
          <span class="road-segment">${road.segment || ''}</span>
        </td>
        <td style="font-family:var(--font-mono)">${fmt(road.length_km, 2)}</td>
        <td class="${speedClass(road.speed_am_in)}" style="font-family:var(--font-mono)">${fmt(road.speed_am_in)}</td>
        <td class="${speedClass(road.speed_am_out)}" style="font-family:var(--font-mono)">${road.speed_am_out !== null ? fmt(road.speed_am_out) : `<small style="color:var(--text-muted)">${road.note_am_out || '—'}</small>`}</td>
        <td class="${speedClass(road.speed_pm_in)}" style="font-family:var(--font-mono)">${fmt(road.speed_pm_in)}</td>
        <td class="${speedClass(road.speed_pm_out)}" style="font-family:var(--font-mono)">${road.speed_pm_out !== null ? fmt(road.speed_pm_out) : `<small style="color:var(--text-muted)">${road.note_pm_out || '—'}</small>`}</td>
        <td></td>
      `;

      /* Insert mini-chart */
      const miniTd = tr.querySelector('td:last-child');
      miniTd.appendChild(makeMiniChart(road));

      tbody.appendChild(tr);
    });
  }

  /* ── Render all road tables ── */
  function renderAllTables() {
    if (!dashData) return;
    const roads = dashData.roads_2568;
    ['inner', 'middle', 'outer'].forEach(zone => {
      const s = sortState[zone] || {};
      renderRoadTable(zone, roads, s.col, s.dir);
    });
    updateFilterStatus();
  }

  /* ── Filter status ── */
  function updateFilterStatus() {
    if (!dashData) return;
    const roads = dashData.roads_2568;
    let visible = roads.length;
    if (activeZoneFilter !== 'all') visible = roads.filter(r => r.zone === activeZoneFilter).length;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      let src = activeZoneFilter !== 'all' ? roads.filter(r => r.zone === activeZoneFilter) : roads;
      visible = src.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.segment && r.segment.toLowerCase().includes(q))
      ).length;
    }
    const el = document.getElementById('filterStatus');
    if (!el) return;
    const total = roads.length;
    if (currentLang === 'en') {
      el.textContent = visible === total
        ? `Showing all ${total} roads`
        : `Showing ${visible} of ${total} roads`;
    } else {
      el.textContent = visible === total
        ? `กำลังแสดงข้อมูลทั้งหมด ${total} ถนน`
        : `แสดง ${visible} จาก ${total} ถนน`;
    }
  }

  /* ── Trend Line Chart ── */
  function renderTrendChart(dir) {
    const svg = document.getElementById('trend-chart');
    if (!svg || !dashData) return;
    svg.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';
    const W = 860, H = 290;
    const padL = 52, padR = 30, padT = 20, padB = 44;
    const cW = W - padL - padR;
    const cH = H - padT - padB;

    const dataKey = dir === 'out' ? 'report_summary' : null;
    let trendData;
    if (dir === 'in') {
      trendData = dashData.trend_inbound;
    } else {
      /* Build outbound series from report_summary */
      trendData = dashData.report_summary.inner.map((d, i) => ({
        year: d.year,
        inner:  dashData.report_summary.inner[i].out,
        middle: dashData.report_summary.middle[i].out,
        outer:  dashData.report_summary.outer[i].out
      }));
    }

    const years  = trendData.map(d => d.year);
    const minY = 0, maxY = 45;
    const yTicks = [0, 10, 20, 30, 40];

    const xScale = y => padL + ((y - years[0]) / (years[years.length-1] - years[0])) * cW;
    const yScale = v => padT + cH - ((v - minY) / (maxY - minY)) * cH;

    /* Grid lines */
    yTicks.forEach(v => {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', padL); line.setAttribute('x2', W - padR);
      line.setAttribute('y1', yScale(v)); line.setAttribute('y2', yScale(v));
      line.setAttribute('class', 'chart-gridline');
      svg.appendChild(line);

      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', padL - 6);
      text.setAttribute('y', yScale(v) + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', 10);
      text.setAttribute('font-family', 'IBM Plex Mono,monospace');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('opacity', '0.55');
      text.textContent = v;
      svg.appendChild(text);
    });

    /* X-axis ticks */
    years.forEach(yr => {
      const x = xScale(yr);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', x); line.setAttribute('x2', x);
      line.setAttribute('y1', padT + cH); line.setAttribute('y2', padT + cH + 5);
      line.setAttribute('stroke', 'currentColor'); line.setAttribute('opacity', '0.35');
      svg.appendChild(line);

      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', padT + cH + 18);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', 10);
      text.setAttribute('font-family', 'IBM Plex Mono,monospace');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('opacity', '0.6');
      /* Convert BE to CE for English */
      text.textContent = currentLang === 'en' ? (yr - 543) : yr;
      svg.appendChild(text);
    });

    /* Y-axis label */
    const yLabel = document.createElementNS(ns, 'text');
    yLabel.setAttribute('x', 12);
    yLabel.setAttribute('y', padT + cH / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('transform', `rotate(-90, 12, ${padT + cH / 2})`);
    yLabel.setAttribute('font-size', 10);
    yLabel.setAttribute('font-family', 'IBM Plex Mono,monospace');
    yLabel.setAttribute('fill', 'currentColor');
    yLabel.setAttribute('opacity', '0.5');
    yLabel.textContent = 'km/h';
    svg.appendChild(yLabel);

    /* Lines */
    const series = [
      { key: 'outer',  color: '#00b894' },
      { key: 'middle', color: '#e17055' },
      { key: 'inner',  color: '#d63031' }
    ];

    /* Tooltip overlay */
    const tooltipG = document.createElementNS(ns, 'g');
    tooltipG.style.display = 'none';
    const tooltipRect = document.createElementNS(ns, 'rect');
    tooltipRect.setAttribute('rx', 4);
    tooltipRect.setAttribute('fill', 'rgba(0,0,0,0.75)');
    tooltipG.appendChild(tooltipRect);
    const tooltipText = document.createElementNS(ns, 'text');
    tooltipText.setAttribute('fill', '#fff');
    tooltipText.setAttribute('font-size', 11);
    tooltipText.setAttribute('font-family', 'IBM Plex Mono,monospace');
    tooltipG.appendChild(tooltipText);

    series.forEach(s => {
      const points = trendData.filter(d => d[s.key] !== null && d[s.key] !== undefined);
      if (!points.length) return;

      const pathD = points.map((d, i) =>
        `${i === 0 ? 'M' : 'L'}${xScale(d.year)},${yScale(d[s.key])}`
      ).join(' ');

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('class', 'chart-line');
      path.setAttribute('stroke', s.color);
      svg.appendChild(path);

      /* Dots */
      points.forEach(d => {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(d.year));
        circle.setAttribute('cy', yScale(d[s.key]));
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('stroke', s.color);
        circle.setAttribute('class', 'chart-dot');
        circle.style.cursor = 'pointer';

        /* Hover events */
        circle.addEventListener('mouseenter', (e) => {
          const yr = currentLang === 'en' ? (d.year - 543) : d.year;
          const txt = `${yr}: ${d[s.key].toFixed(2)} km/h`;
          const cx = xScale(d.year);
          const cy = yScale(d[s.key]);
          while (tooltipText.firstChild) tooltipText.removeChild(tooltipText.firstChild);
          const tspan = document.createElementNS(ns, 'tspan');
          tspan.textContent = txt;
          tooltipText.appendChild(tspan);
          /* Position tooltip */
          const tx = Math.min(cx + 8, W - 120);
          const ty = Math.max(cy - 24, padT);
          tooltipText.setAttribute('x', tx + 6);
          tooltipText.setAttribute('y', ty + 14);
          tooltipRect.setAttribute('x', tx);
          tooltipRect.setAttribute('y', ty);
          tooltipRect.setAttribute('width', txt.length * 6.5 + 12);
          tooltipRect.setAttribute('height', 22);
          tooltipG.style.display = '';
          circle.setAttribute('r', 6);
        });
        circle.addEventListener('mouseleave', () => {
          tooltipG.style.display = 'none';
          circle.setAttribute('r', 4);
        });
        svg.appendChild(circle);
      });
    });

    svg.appendChild(tooltipG);

    /* Update direction */
    currentDir = dir;
  }

  /* ── Render BAU Scenario ── */
  function renderBAU() {
    if (!dashData) return;
    const summary = dashData.report_summary;

    ['inner', 'middle', 'outer'].forEach(zone => {
      const series = summary[zone];
      if (!series || series.length < 3) return;

      /* Last 3 years inbound */
      const last3 = series.slice(-3);
      const deltas = [];
      for (let i = 1; i < last3.length; i++) {
        deltas.push(last3[i].in - last3[i-1].in);
      }
      const avgDelta = deltas.reduce((a,b) => a+b, 0) / deltas.length;
      const lastSpeed = series[series.length - 1].in;
      const projSpeed = Math.max(1, lastSpeed + avgDelta);
      const projTime  = 600 / projSpeed;

      const container = document.querySelector(`.scenario-item[data-zone="${zone}"]`);
      if (!container) return;

      const speedEl = container.querySelector('[data-bau="speed"]');
      const timeEl  = container.querySelector('[data-bau="time"]');
      const deltaEl = container.querySelector('[data-bau="delta"]');

      if (speedEl) speedEl.textContent = projSpeed.toFixed(2);
      if (timeEl)  timeEl.textContent  = projTime.toFixed(1);
      if (deltaEl) {
        const sign = avgDelta >= 0 ? '+' : '';
        deltaEl.textContent = `${sign}${avgDelta.toFixed(2)}`;
        deltaEl.style.color = avgDelta >= 0 ? 'var(--col-outer)' : 'var(--col-inner)';
      }
    });
  }

  /* ── Sorting ── */
  function initSortHeaders() {
    document.querySelectorAll('.rt-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const zone  = table.getAttribute('data-zone-table');
        const col   = th.getAttribute('data-sort');
        if (!zone || !col) return;

        const current = sortState[zone] || {};
        let dir = 'desc';
        if (current.col === col) dir = current.dir === 'desc' ? 'asc' : 'desc';
        sortState[zone] = { col, dir };

        /* Update header classes */
        table.querySelectorAll('th.sortable').forEach(h => {
          h.classList.remove('asc', 'desc');
        });
        th.classList.add(dir);

        renderRoadTable(zone, dashData.roads_2568, col, dir);
      });
    });
  }

  /* ── Expand / Collapse All ── */
  function initAccordionControls() {
    const expandAll = document.getElementById('rtExpandAll');
    const collapseAll = document.getElementById('rtCollapseAll');

    if (expandAll) {
      expandAll.addEventListener('click', () => {
        document.querySelectorAll('.zone-acc').forEach(d => d.open = true);
      });
    }
    if (collapseAll) {
      collapseAll.addEventListener('click', () => {
        document.querySelectorAll('.zone-acc').forEach(d => d.open = false);
      });
    }
  }

  /* ── Filters ── */
  function initFilters() {
    const zoneFilter  = document.getElementById('zoneFilter');
    const trendFilter = document.getElementById('trendFilter');
    const searchInput = document.getElementById('tableSearch');
    const resetBtn    = document.getElementById('resetFilters');
    const rtSearch    = document.getElementById('rtSearch');

    if (zoneFilter) {
      zoneFilter.addEventListener('change', () => {
        activeZoneFilter = zoneFilter.value;
        renderAllTables();
        /* Show/hide accordion panels */
        document.querySelectorAll('.zone-acc').forEach(acc => {
          const z = acc.getAttribute('data-zone');
          if (activeZoneFilter === 'all' || activeZoneFilter === z) {
            acc.style.display = '';
          } else {
            acc.style.display = 'none';
          }
        });
      });
    }

    if (trendFilter) {
      trendFilter.addEventListener('change', () => {
        activeTrendFilter = trendFilter.value;
        /* trendFilter filters the comparison table rows */
        document.querySelectorAll('.modern-table tbody tr').forEach(tr => {
          if (activeTrendFilter === 'all') {
            tr.style.display = '';
          } else {
            tr.style.display = tr.getAttribute('data-trend') === activeTrendFilter ? '' : 'none';
          }
        });
      });
    }

    const doSearch = (q) => {
      searchQuery = q;
      renderAllTables();
    };

    if (searchInput) {
      searchInput.addEventListener('input', () => doSearch(searchInput.value.trim()));
    }
    if (rtSearch) {
      rtSearch.addEventListener('input', () => doSearch(rtSearch.value.trim()));
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeZoneFilter  = 'all';
        activeTrendFilter = 'all';
        searchQuery = '';
        if (zoneFilter)  zoneFilter.value  = 'all';
        if (trendFilter) trendFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        if (rtSearch)    rtSearch.value    = '';
        document.querySelectorAll('.zone-acc').forEach(acc => { acc.style.display = ''; });
        document.querySelectorAll('.modern-table tbody tr').forEach(tr => { tr.style.display = ''; });
        renderAllTables();
      });
    }
  }

  /* ── Theme Toggle ── */
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(!isDark);
    });
  }

  /* ── Language Switcher ── */
  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (!lang) return;
        currentLang = lang;
        try { localStorage.setItem('bma-lang', lang); } catch(e) {}
        applyI18n(lang);
        /* Re-render dynamic content */
        if (dashData) {
          renderZoneStats(dashData.roads_2568);
          renderAllTables();
          renderTrendChart(currentDir);
          renderBAU();
        }
      });
    });
  }

  /* ── Direction Toggle (trend chart) ── */
  function initDirToggle() {
    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        document.querySelectorAll('.dir-btn').forEach(b => {
          const pressed = b.getAttribute('data-dir') === dir;
          b.classList.toggle('active', pressed);
          b.setAttribute('aria-pressed', String(pressed));
        });
        renderTrendChart(dir);
      });
    });
  }

  /* ── Print ── */
  function initPrint() {
    const btn = document.getElementById('printReport');
    if (btn) btn.addEventListener('click', () => window.print());
  }

  /* ── Scroll-to-top ── */
  function initScrollTop() {
    const btn = document.getElementById('to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Reveal on scroll ── */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ── Main init ── */
  async function init() {
    initTheme();
    initLang();
    initThemeToggle();
    initLangSwitcher();
    initDirToggle();
    initPrint();
    initScrollTop();
    initReveal();

    try {
      const res  = await fetch('data/dashboard-data.json');
      dashData   = await res.json();
      const roads = dashData.roads_2568;

      renderZoneStats(roads);
      renderAllTables();
      initSortHeaders();
      initAccordionControls();
      initFilters();
      renderTrendChart('in');
      renderBAU();
    } catch (err) {
      console.warn('BMA Dashboard: Could not load data/dashboard-data.json', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

