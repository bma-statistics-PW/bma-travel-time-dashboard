/* ═══════════════════════════════════════════════════════
   app.js — Dashboard interactivity
   BMA Travel Time Dashboard 2017–2025
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── State ───────────────────────────────────────── */
  let dashData = null;
  let chartDir = 'in';
  const sortState = {};   // { [zone]: { col, dir } }

  /* ════════════════════════════════════════════════════
     DATA LOADING
     ════════════════════════════════════════════════════ */
  async function loadData() {
    try {
      const resp = await fetch('data/dashboard-data.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      dashData = await resp.json();
      onDataReady();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }

  function onDataReady() {
    renderTrendChart(chartDir);
    renderRoadTables();
    renderBAU();
    setupFilters();
    setupAccordions();
  }

  /* ════════════════════════════════════════════════════
     TREND CHART  (SVG)
     ════════════════════════════════════════════════════ */
  function renderTrendChart(dir) {
    const svg = document.getElementById('trend-chart');
    if (!svg || !dashData) return;

    // Clear previous content
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 860, H = 290;
    const pad = { top: 32, right: 44, bottom: 48, left: 56 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    const ns = 'http://www.w3.org/2000/svg';

    const summary = dashData.report_summary;
    const years = summary.inner.map(d => d.year);
    const n = years.length;

    const allVals = ['inner', 'middle', 'outer'].flatMap(z => summary[z].map(d => d[dir]));
    const minV = Math.max(0, Math.floor(Math.min(...allVals) / 5) * 5);
    const maxV = Math.ceil(Math.max(...allVals) / 5) * 5;

    function xOf(i) { return pad.left + (i / (n - 1)) * cW; }
    function yOf(v) { return pad.top + (1 - (v - minV) / (maxV - minV)) * cH; }

    function el(tag, attrs) {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    }

    // ── Background ──────────────────────────────────
    svg.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }));

    // ── Grid & Y-axis ───────────────────────────────
    const ySteps = (maxV - minV) / 5;
    for (let i = 0; i <= ySteps; i++) {
      const yv = minV + i * 5;
      const y = yOf(yv);
      svg.appendChild(el('line', {
        x1: pad.left, x2: W - pad.right, y1: y, y2: y,
        stroke: 'var(--chart-grid)', 'stroke-width': '1'
      }));
      const lbl = el('text', {
        x: pad.left - 8, y: y + 4,
        'text-anchor': 'end', 'font-size': '11', fill: 'var(--chart-label)'
      });
      lbl.textContent = yv;
      svg.appendChild(lbl);
    }

    // Y-axis unit label
    const yUnit = el('text', {
      x: pad.left - 42, y: pad.top + cH / 2,
      'text-anchor': 'middle', 'font-size': '10', fill: 'var(--chart-label)',
      transform: `rotate(-90 ${pad.left - 42} ${pad.top + cH / 2})`
    });
    yUnit.textContent = 'กม./ชม.';
    svg.appendChild(yUnit);

    // ── X-axis ──────────────────────────────────────
    years.forEach((yr, i) => {
      const x = xOf(i);
      svg.appendChild(el('line', {
        x1: x, x2: x, y1: H - pad.bottom, y2: H - pad.bottom + 5,
        stroke: 'var(--chart-label)', 'stroke-width': '1'
      }));
      const lbl = el('text', {
        x, y: H - pad.bottom + 18,
        'text-anchor': 'middle', 'font-size': '11', fill: 'var(--chart-label)'
      });
      lbl.textContent = yr;
      svg.appendChild(lbl);
    });

    // X-axis baseline
    svg.appendChild(el('line', {
      x1: pad.left, x2: W - pad.right,
      y1: H - pad.bottom, y2: H - pad.bottom,
      stroke: 'var(--chart-label)', 'stroke-width': '1', opacity: '0.4'
    }));

    // ── COVID-19 marker ──────────────────────────────
    const covidIdx = years.indexOf(2564);
    if (covidIdx >= 0) {
      const cx = xOf(covidIdx);
      svg.appendChild(el('line', {
        x1: cx, x2: cx, y1: pad.top, y2: H - pad.bottom,
        stroke: '#fdcb6e', 'stroke-width': '1.5', 'stroke-dasharray': '5 3', opacity: '0.8'
      }));
      const cTxt = el('text', {
        x: cx + 4, y: pad.top + 14,
        'font-size': '10', fill: '#fdcb6e', 'font-style': 'italic'
      });
      cTxt.textContent = 'COVID-19';
      svg.appendChild(cTxt);
    }

    // ── Zone lines ───────────────────────────────────
    const zones = [
      { key: 'outer',  color: '#00b894', label: 'ชั้นนอก' },
      { key: 'middle', color: '#e17055', label: 'ชั้นกลาง' },
      { key: 'inner',  color: '#d63031', label: 'ชั้นใน'  },
    ];

    zones.forEach(z => {
      const zData = summary[z.key];
      const pts = zData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d[dir]).toFixed(1)}`).join(' ');

      // Shadow
      const shadow = el('polyline', {
        points: pts, fill: 'none',
        stroke: 'rgba(0,0,0,0.15)', 'stroke-width': '5',
        'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      });
      svg.appendChild(shadow);

      // Line
      const line = el('polyline', {
        points: pts, fill: 'none',
        stroke: z.color, 'stroke-width': '2.5',
        'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      });
      svg.appendChild(line);

      // Dots
      zData.forEach((d, i) => {
        const dot = el('circle', {
          cx: xOf(i).toFixed(1), cy: yOf(d[dir]).toFixed(1),
          r: '5', fill: z.color,
          'data-zone': z.key, 'data-year': d.year, 'data-speed': d[dir],
          'data-label': z.label,
          style: 'cursor:pointer',
          tabindex: '0',
          role: 'img',
          'aria-label': `${z.label} ปี ${d.year}: ${d[dir]} กม./ชม.`
        });
        svg.appendChild(dot);
      });
    });

    // ── Tooltip group ────────────────────────────────
    const ttGroup = el('g', { id: 'chart-tooltip', display: 'none', 'pointer-events': 'none' });
    const ttBg = el('rect', { rx: '6', fill: 'rgba(0,0,0,0.82)', width: '140', height: '54' });
    ttGroup.appendChild(ttBg);
    for (let i = 0; i < 2; i++) {
      const line = el('text', {
        x: '10', y: String(i === 0 ? 18 : 36),
        fill: 'white', 'font-size': '12',
        class: `tt${i}`
      });
      ttGroup.appendChild(line);
    }
    svg.appendChild(ttGroup);

    // ── Hover events ─────────────────────────────────
    svg.querySelectorAll('circle').forEach(dot => {
      const showTip = () => {
        const spd = parseFloat(dot.getAttribute('data-speed'));
        const yr = dot.getAttribute('data-year');
        const lbl = dot.getAttribute('data-label');
        const tt = svg.querySelector('#chart-tooltip');
        tt.querySelector('.tt0').textContent = `${yr} · ${lbl}`;
        tt.querySelector('.tt1').textContent = `${spd.toFixed(2)} กม./ชม.`;
        let tx = parseFloat(dot.getAttribute('cx')) + 10;
        let ty = parseFloat(dot.getAttribute('cy')) - 60;
        if (tx + 150 > W - pad.right) tx -= 155;
        if (ty < pad.top) ty = parseFloat(dot.getAttribute('cy')) + 12;
        tt.setAttribute('transform', `translate(${tx},${ty})`);
        tt.setAttribute('display', '');
        dot.setAttribute('r', '7');
      };
      const hideTip = () => {
        svg.querySelector('#chart-tooltip').setAttribute('display', 'none');
        dot.setAttribute('r', '5');
      };
      dot.addEventListener('mouseenter', showTip);
      dot.addEventListener('mouseleave', hideTip);
      dot.addEventListener('focus', showTip);
      dot.addEventListener('blur', hideTip);
    });
  }

  /* ════════════════════════════════════════════════════
     ROAD TABLES
     ════════════════════════════════════════════════════ */
  function renderRoadTables() {
    if (!dashData) return;
    ['inner', 'middle', 'outer'].forEach(zone => renderZoneTable(zone));

    // Sortable headers
    document.querySelectorAll('.rt-table .sortable').forEach(th => {
      th.style.cursor = 'pointer';
      th.title = 'Click to sort';
      th.addEventListener('click', function () {
        const zone = this.closest('[data-zone-table]').getAttribute('data-zone-table');
        const col  = this.getAttribute('data-sort');
        if (col) handleSort(zone, col);
      });
    });
  }

  function renderZoneTable(zone) {
    const tbody = document.querySelector(`[data-tbody="${zone}"]`);
    if (!tbody || !dashData) return;

    let roads = dashData.roads_2568.filter(r => r.zone === zone);
    const state = sortState[zone];
    if (state) {
      roads = [...roads].sort((a, b) => {
        let av = a[state.col], bv = b[state.col];
        if (av === null || av === undefined) av = state.dir === 'asc' ? Infinity : -Infinity;
        if (bv === null || bv === undefined) bv = state.dir === 'asc' ? Infinity : -Infinity;
        if (typeof av === 'string') return state.dir === 'asc' ? av.localeCompare(bv, 'th') : bv.localeCompare(av, 'th');
        return state.dir === 'asc' ? av - bv : bv - av;
      });
    }

    tbody.innerHTML = roads.map(r => roadRowHTML(r)).join('');
  }

  function speedClass(v) {
    if (v === null || v === undefined) return 'spd-na';
    if (v >= 30) return 'spd-fast';
    if (v >= 20) return 'spd-mid';
    if (v >= 10) return 'spd-slow';
    return 'spd-jam';
  }

  function fmtSpd(v, note) {
    if (v === null || v === undefined) {
      const t = note ? ` title="${note}"` : '';
      return `<span class="spd-na"${t}>—</span>`;
    }
    return `<span class="${speedClass(v)}">${v.toFixed(2)}</span>`;
  }

  function miniChartSVG(r) {
    const vals   = [r.speed_am_in, r.speed_am_out, r.speed_pm_in, r.speed_pm_out];
    const colors = ['#0984e3', '#00b894', '#e17055', '#fdcb6e'];
    const labels = ['AM↑', 'AM↓', 'PM↑', 'PM↓'];
    const maxV   = Math.max(...vals.filter(v => v !== null && v !== undefined), 1);
    const W = 56, H = 26, bw = 10, gap = 3;
    const startX = (W - (vals.length * (bw + gap) - gap)) / 2;

    let bars = '';
    vals.forEach((v, i) => {
      if (v === null || v === undefined) return;
      const bh = Math.max(2, (v / maxV) * (H - 4));
      const x  = startX + i * (bw + gap);
      bars += `<rect x="${x.toFixed(1)}" y="${(H - bh).toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}"
        fill="${colors[i]}" opacity="0.88" rx="1">
        <title>${labels[i]}: ${v.toFixed(2)} km/h</title></rect>`;
    });
    return `<svg width="${W}" height="${H}" class="mini-chart" aria-hidden="true" focusable="false">${bars}</svg>`;
  }

  function roadRowHTML(r) {
    return `<tr data-zone="${r.zone}" data-seq="${r.seq}">
      <td class="td-seq">${r.seq}</td>
      <td class="td-name">
        <div class="road-name">${r.name}</div>
        <div class="road-seg">${r.segment}</div>
      </td>
      <td class="td-num">${r.length_km.toFixed(2)}</td>
      <td class="td-spd">${fmtSpd(r.speed_am_in,  null)}</td>
      <td class="td-spd">${fmtSpd(r.speed_am_out, r.note_am_out)}</td>
      <td class="td-spd">${fmtSpd(r.speed_pm_in,  null)}</td>
      <td class="td-spd">${fmtSpd(r.speed_pm_out, r.note_pm_out)}</td>
      <td class="td-mini">${miniChartSVG(r)}</td>
    </tr>`;
  }

  function handleSort(zone, col) {
    const prev = sortState[zone];
    sortState[zone] = {
      col,
      dir: prev && prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
    };

    // Update header indicators
    const tbl = document.querySelector(`[data-zone-table="${zone}"]`);
    tbl && tbl.querySelectorAll('.sortable').forEach(th => {
      th.removeAttribute('aria-sort');
      const indicator = th.querySelector('.sort-indicator');
      if (indicator) indicator.remove();
    });
    const active = tbl && tbl.querySelector(`.sortable[data-sort="${col}"]`);
    if (active) {
      active.setAttribute('aria-sort', sortState[zone].dir === 'asc' ? 'ascending' : 'descending');
      const ind = document.createElement('span');
      ind.className = 'sort-indicator';
      ind.setAttribute('aria-hidden', 'true');
      ind.textContent = sortState[zone].dir === 'asc' ? ' ▲' : ' ▼';
      active.appendChild(ind);
    }

    renderZoneTable(zone);
  }

  /* ════════════════════════════════════════════════════
     BAU (Business as Usual) PROJECTION
     ════════════════════════════════════════════════════ */
  function renderBAU() {
    if (!dashData) return;
    ['inner', 'middle', 'outer'].forEach(zone => {
      const data  = dashData.report_summary[zone];
      const last3 = data.slice(-3);

      // Least-squares linear regression
      const ys = last3.map(d => d.year);
      const vs = last3.map(d => d.in);
      const npt = last3.length;
      const sumX  = ys.reduce((a, b) => a + b, 0);
      const sumY  = vs.reduce((a, b) => a + b, 0);
      const sumXY = ys.reduce((s, x, i) => s + x * vs[i], 0);
      const sumX2 = ys.reduce((s, x) => s + x * x, 0);
      const denom = npt * sumX2 - sumX * sumX;
      const slope     = denom !== 0 ? (npt * sumXY - sumX * sumY) / denom : 0;
      const intercept = (sumY - slope * sumX) / npt;
      const proj      = slope * 2569 + intercept;
      const tTime     = proj > 0 ? (10 / proj * 60).toFixed(1) : '—';

      const container = document.querySelector(`#scenarioGrid [data-zone="${zone}"]`);
      if (!container) return;
      container.querySelector('[data-bau="speed"]').textContent = Math.max(0, proj).toFixed(2);
      container.querySelector('[data-bau="time"]').textContent  = tTime;
      container.querySelector('[data-bau="delta"]').textContent = (slope >= 0 ? '+' : '') + slope.toFixed(2);
    });
  }

  /* ════════════════════════════════════════════════════
     FILTERS  (zone, trend, search)
     ════════════════════════════════════════════════════ */
  function setupFilters() {
    const zoneFilter  = document.getElementById('zoneFilter');
    const trendFilter = document.getElementById('trendFilter');
    const tableSearch = document.getElementById('tableSearch');
    const resetBtn    = document.getElementById('resetFilters');
    const printBtn    = document.getElementById('printReport');

    function applyFilters() {
      const zoneVal  = (zoneFilter  && zoneFilter.value)  || 'all';
      const trendVal = (trendFilter && trendFilter.value) || 'all';
      const query    = ((tableSearch && tableSearch.value) || '').toLowerCase().trim();

      let visible = 0;

      // ── Zone accordion visibility ──────────────────
      document.querySelectorAll('.zone-acc').forEach(acc => {
        const az = acc.getAttribute('data-zone');
        const zoneMatch = zoneVal === 'all' || zoneVal === az;
        acc.style.display = zoneMatch ? '' : 'none';
        if (!zoneMatch) return;

        // ── Row filtering ──────────────────────────
        acc.querySelectorAll('tbody tr').forEach(row => {
          const name = (row.querySelector('.road-name')?.textContent || '').toLowerCase();
          const seg  = (row.querySelector('.road-seg')?.textContent  || '').toLowerCase();
          const searchMatch = !query || name.includes(query) || seg.includes(query);
          row.style.display = searchMatch ? '' : 'none';
          if (searchMatch) visible++;
        });
      });

      // ── Comparison table filtering ─────────────────
      document.querySelectorAll('.modern-table tbody tr').forEach(row => {
        const rz = row.getAttribute('data-zone') || '';
        const rt = row.getAttribute('data-trend') || '';
        const zMatch = zoneVal === 'all' || zoneVal === rz;
        const tMatch = trendVal === 'all' || rt === trendVal;
        row.style.display = (zMatch && tMatch) ? '' : 'none';
      });

      // ── Status text ────────────────────────────────
      const status = document.getElementById('filterStatus');
      if (status) {
        const lang = document.documentElement.getAttribute('data-lang') || 'th';
        const total = dashData ? dashData.roads_2568.length : 51;
        if (visible === total || (zoneVal === 'all' && !query)) {
          status.textContent = lang === 'th' ? 'กำลังแสดงข้อมูลทั้งหมด' : 'Showing all data';
        } else {
          status.textContent = lang === 'th' ? `กำลังแสดง ${visible} ถนน` : `Showing ${visible} roads`;
        }
      }
    }

    zoneFilter  && zoneFilter.addEventListener('change', applyFilters);
    trendFilter && trendFilter.addEventListener('change', applyFilters);
    tableSearch && tableSearch.addEventListener('input',  applyFilters);

    resetBtn && resetBtn.addEventListener('click', () => {
      if (zoneFilter)  zoneFilter.value  = 'all';
      if (trendFilter) trendFilter.value = 'all';
      if (tableSearch) tableSearch.value = '';
      applyFilters();
    });

    printBtn && printBtn.addEventListener('click', () => window.print());

    // RT (road table) search
    const rtSearch = document.getElementById('rtSearch');
    rtSearch && rtSearch.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.rt-table tbody tr').forEach(row => {
        const name = (row.querySelector('.road-name')?.textContent || '').toLowerCase();
        const seg  = (row.querySelector('.road-seg')?.textContent  || '').toLowerCase();
        row.style.display = (!q || name.includes(q) || seg.includes(q)) ? '' : 'none';
      });
    });

    // Expand / Collapse all
    document.getElementById('rtExpandAll')?.addEventListener('click', () => {
      document.querySelectorAll('.zone-acc').forEach(acc => acc.setAttribute('open', ''));
    });
    document.getElementById('rtCollapseAll')?.addEventListener('click', () => {
      document.querySelectorAll('.zone-acc').forEach(acc => acc.removeAttribute('open'));
    });
  }

  /* ════════════════════════════════════════════════════
     ACCORDION
     ════════════════════════════════════════════════════ */
  function setupAccordions() {
    document.querySelectorAll('.zone-acc').forEach(acc => {
      const chevron = acc.querySelector('.zone-chevron');
      acc.addEventListener('toggle', function () {
        if (chevron) chevron.textContent = this.open ? '▲' : '▼';
      });
    });
  }

  /* ════════════════════════════════════════════════════
     THEME  (dark / light)
     ════════════════════════════════════════════════════ */
  function setupTheme() {
    const btn   = document.getElementById('themeToggle');
    const saved = localStorage.getItem('bma-theme');

    // Respect system preference if no stored preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    btn && btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('bma-theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', theme);
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '◐';
  }

  /* ════════════════════════════════════════════════════
     DIRECTION TOGGLE  (trend chart)
     ════════════════════════════════════════════════════ */
  function setupDirectionToggle() {
    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.dir-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        chartDir = this.getAttribute('data-dir');

        // Update subtitle
        const sub = document.querySelector('.line-sub');
        if (sub) {
          const lang = document.documentElement.getAttribute('data-lang') || 'th';
          const inout = chartDir === 'in'
            ? (lang === 'th' ? 'ขาเข้า' : 'Inbound')
            : (lang === 'th' ? 'ขาออก' : 'Outbound');
          const unit = lang === 'th' ? 'กม./ชม.' : 'km/h';
          sub.textContent = `หน่วย: ${unit} · ${inout} · เลื่อนเพื่อดูค่า · เปรียบเทียบ 3 โซน`;
        }

        if (dashData) renderTrendChart(chartDir);
      });
    });
  }

  /* ════════════════════════════════════════════════════
     LANGUAGE BUTTONS
     ════════════════════════════════════════════════════ */
  function setupLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const lang = this.getAttribute('data-lang');
        if (window.i18n) {
          window.i18n.setLang(lang);
          // Re-render chart subtitles etc.
          if (dashData) renderTrendChart(chartDir);
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════
     TO-TOP BUTTON
     ════════════════════════════════════════════════════ */
  function setupToTop() {
    const btn = document.getElementById('to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ════════════════════════════════════════════════════
     SCROLL REVEAL
     ════════════════════════════════════════════════════ */
  function setupReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ════════════════════════════════════════════════════
     BOOT
     ════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupDirectionToggle();
    setupLangButtons();
    setupToTop();
    setupReveal();
    loadData();
  });
})();
