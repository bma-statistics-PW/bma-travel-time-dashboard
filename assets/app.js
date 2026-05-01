/* BMA Travel Time Dashboard — main application */
(async function () {
  'use strict';

  // ── 1. Load data ──────────────────────────────────────────────────────────
  let DATA;
  try {
    DATA = await fetch('data/dashboard-data.json').then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} fetching data/dashboard-data.json`);
      return r.json();
    });
  } catch (e) {
    console.error('Failed to load dashboard data:', e);
    return;
  }

  const roads = DATA.roads_2568;
  const reportSummary = DATA.report_summary;
  const zones = ['inner', 'middle', 'outer'];

  // ── 2. Speed classification ───────────────────────────────────────────────
  function speedClass(v) {
    if (v === null || v === undefined) return '';
    if (v >= 30) return 'spd-fast';
    if (v >= 20) return 'spd-mid';
    if (v >= 10) return 'spd-slow';
    return 'spd-jam';
  }

  function fmtSpeed(v, note) {
    if (v === null || v === undefined) {
      const noteText = note ? ` <small class="one-way">(${note})</small>` : '';
      return `<span class="one-way">—</span>${noteText}`;
    }
    return v.toFixed(2);
  }

  // ── 3. Mini-chart SVG ─────────────────────────────────────────────────────
  function miniChart(road) {
    const vals = [road.speed_am_in, road.speed_am_out, road.speed_pm_in, road.speed_pm_out];
    const colors = ['#3182ce', '#63b3ed', '#fc8181', '#feb2b2'];
    const W = 64, H = 24, barW = 10, gap = 6, maxSpd = 60;
    const bars = vals.map((v, i) => {
      const h = v !== null ? Math.max(2, Math.round((v / maxSpd) * H)) : 2;
      const x = i * (barW + gap);
      const y = H - h;
      const cls = v !== null ? speedClass(v) : 'spd-slow';
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${colors[i]}" rx="1" class="${cls}" title="${v !== null ? v.toFixed(1) + ' km/h' : '—'}"/>`;
    }).join('');
    return `<svg class="mini-spd-chart" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${bars}</svg>`;
  }

  // ── 4. Build table rows ───────────────────────────────────────────────────
  function buildTableRows(filteredRoads) {
    if (!filteredRoads.length) {
      const lang = typeof I18N !== 'undefined' ? I18N.getCurrentLang() : 'th';
      const msg = lang === 'th' ? 'ไม่พบข้อมูล' : 'No data found';
      return `<tr><td colspan="8" style="text-align:center;padding:1rem;color:var(--clr-muted)">${msg}</td></tr>`;
    }
    return filteredRoads.map(r => {
      const sc = field => speedClass(r[field]);
      const sf = (field, noteField) => fmtSpeed(r[field], r[noteField]);
      return `<tr data-road-name="${r.name}" data-road-segment="${r.segment || ''}">
        <td class="td-seq">${r.seq}</td>
        <td class="th-left td-name"><strong>${r.name}</strong><br><small>${r.segment || ''}</small></td>
        <td class="td-len">${r.length_km.toFixed(2)}</td>
        <td class="${sc('speed_am_in')}">${sf('speed_am_in', null)}</td>
        <td class="${sc('speed_am_out')}">${sf('speed_am_out', 'note_am_out')}</td>
        <td class="${sc('speed_pm_in')}">${sf('speed_pm_in', null)}</td>
        <td class="${sc('speed_pm_out')}">${sf('speed_pm_out', 'note_pm_out')}</td>
        <td class="td-mini">${miniChart(r)}</td>
      </tr>`;
    }).join('');
  }

  // ── 5. Populate all zone tbodies ──────────────────────────────────────────
  function populateTbodies(filterZone, searchText) {
    zones.forEach(zone => {
      const tbody = document.querySelector(`[data-tbody="${zone}"]`);
      if (!tbody) return;
      let zoneRoads = roads.filter(r => r.zone === zone);
      if (searchText) {
        const q = searchText.toLowerCase();
        zoneRoads = zoneRoads.filter(r =>
          r.name.toLowerCase().includes(q) ||
          (r.segment && r.segment.toLowerCase().includes(q))
        );
      }
      tbody.innerHTML = buildTableRows(zoneRoads);
    });
  }

  // ── 6. Update zone summary stats ──────────────────────────────────────────
  function updateZoneStats() {
    zones.forEach(zone => {
      const zoneRoads = roads.filter(r => r.zone === zone);
      const fields = ['speed_am_in', 'speed_am_out', 'speed_pm_in', 'speed_pm_out'];
      const avgs = {};
      fields.forEach(f => {
        const valid = zoneRoads.map(r => r[f]).filter(v => v !== null && v !== undefined);
        avgs[f] = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
      });

      const setEl = (sel, val) => {
        document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
      };

      setEl(`[data-stat="${zone}-am-in"]`, avgs.speed_am_in.toFixed(2));
      setEl(`[data-stat="${zone}-am-out"]`, avgs.speed_am_out.toFixed(2));
      setEl(`[data-stat="${zone}-pm-in"]`, avgs.speed_pm_in.toFixed(2));
      setEl(`[data-stat="${zone}-pm-out"]`, avgs.speed_pm_out.toFixed(2));
      setEl(`[data-avg="${zone}-am-in"]`, avgs.speed_am_in.toFixed(2));

      const allSpeeds = zoneRoads.flatMap(r =>
        [r.speed_am_in, r.speed_am_out, r.speed_pm_in, r.speed_pm_out].filter(v => v !== null && v !== undefined)
      );
      if (allSpeeds.length) {
        const mn = Math.min(...allSpeeds).toFixed(1);
        const mx = Math.max(...allSpeeds).toFixed(1);
        setEl(`[data-range="${zone}"]`, `${mn}–${mx}`);
      }

      const lang = typeof I18N !== 'undefined' ? I18N.getCurrentLang() : 'th';
      setEl(`[data-count="${zone}"]`, lang === 'th' ? `${zoneRoads.length} ถนน` : `${zoneRoads.length} roads`);
    });
  }

  // ── 7. Draw trend chart ───────────────────────────────────────────────────
  const CHART_COLORS = { inner: '#d63031', middle: '#e17055', outer: '#00b894' };
  let currentChartDir = 'in';

  function ensureTrendTooltip() {
    const wrap = document.querySelector('.line-wrap');
    if (!wrap) return null;
    let tip = wrap.querySelector('.trend-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'trend-tooltip';
      tip.setAttribute('aria-hidden', 'true');
      wrap.appendChild(tip);
    }
    return tip;
  }

  function getTrendTooltipHtml(yearIndex, direction) {
    const year = reportSummary.inner[yearIndex]?.year;
    if (year === undefined) return '';

    const lang = typeof I18N !== 'undefined' ? I18N.getCurrentLang() : 'th';
    const zoneLabels = {
      th: { outer: 'พื้นที่ชั้นนอก', middle: 'พื้นที่ชั้นกลาง', inner: 'พื้นที่ชั้นใน', direction: direction === 'in' ? 'ขาเข้า' : 'ขาออก' },
      en: { outer: 'Outer zone', middle: 'Middle zone', inner: 'Inner zone', direction: direction === 'in' ? 'Inbound' : 'Outbound' }
    };
    const labels = zoneLabels[lang] || zoneLabels.th;
    const rows = ['outer', 'middle', 'inner'].map(zone => {
      const value = Number(reportSummary[zone][yearIndex][direction]).toFixed(2);
      return `<div class="trend-tooltip-row"><span class="trend-tooltip-key"><span class="trend-tooltip-dot" style="background:${CHART_COLORS[zone]}"></span>${labels[zone]}</span><strong>${value} km/h</strong></div>`;
    }).join('');

    return `<div class="trend-tooltip-year">${lang === 'th' ? `ปี ${year}` : `Year ${year}`}</div><div class="trend-tooltip-dir">${labels.direction}</div>${rows}`;
  }

  function bindTrendChartInteractions(pointsByYear, direction, pad, chartH) {
    const svg = document.getElementById('trend-chart');
    const wrap = document.querySelector('.line-wrap');
    const tooltip = ensureTrendTooltip();
    if (!svg || !wrap || !tooltip || !pointsByYear.length) return;

    const hideTooltip = () => {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
      svg.querySelectorAll('.trend-hit').forEach(el => el.classList.remove('is-active'));
    };

    const showTooltip = (yearIndex, clientX) => {
      const point = pointsByYear[yearIndex];
      if (!point) return;

      tooltip.innerHTML = getTrendTooltipHtml(yearIndex, direction);
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');

      svg.querySelectorAll('.trend-hit').forEach(el => {
        el.classList.toggle('is-active', Number(el.dataset.idx) === yearIndex);
      });

      const wrapRect = wrap.getBoundingClientRect();
      const leftFromPoint = point.x * (wrapRect.width / 860);
      const tooltipWidth = tooltip.offsetWidth || 170;
      let left = leftFromPoint + 14;
      if (left + tooltipWidth > wrapRect.width - 8) {
        left = leftFromPoint - tooltipWidth - 14;
      }
      left = Math.max(8, left);

      const top = Math.max(8, (pad.top + 8) * (wrapRect.height / 360));
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    svg.querySelectorAll('.trend-hit').forEach(hit => {
      const idx = Number(hit.dataset.idx);
      hit.addEventListener('mouseenter', event => showTooltip(idx, event.clientX));
      hit.addEventListener('mousemove', event => showTooltip(idx, event.clientX));
      hit.addEventListener('mouseleave', hideTooltip);
      hit.addEventListener('focus', event => showTooltip(idx, event.clientX || 0));
      hit.addEventListener('blur', hideTooltip);
      hit.addEventListener('touchstart', () => showTooltip(idx, 0), { passive: true });
      hit.addEventListener('touchend', hideTooltip, { passive: true });
    });

    svg.addEventListener('mouseleave', hideTooltip);
  }

  function drawTrendChart(direction) {
    const svg = document.getElementById('trend-chart');
    if (!svg) return;
    currentChartDir = direction;
    const vW = 860, vH = 360;
    const pad = { left: 65, right: 30, top: 25, bottom: 45 };
    const chartW = vW - pad.left - pad.right;
    const chartH = vH - pad.top - pad.bottom;

    const years = reportSummary.inner.map(d => d.year);
    const allVals = zones.flatMap(z => reportSummary[z].map(d => d[direction]));
    const minV = Math.floor(Math.min(...allVals) - 2);
    const maxV = Math.ceil(Math.max(...allVals) + 2);

    const xScale = i => pad.left + (i / (years.length - 1)) * chartW;
    const yScale = v => pad.top + chartH - ((v - minV) / (maxV - minV)) * chartH;
    const pointsByYear = years.map((year, index) => ({ year, x: xScale(index) }));

    let out = '';

    // Grid lines
    const yTicks = 6;
    for (let i = 0; i <= yTicks; i++) {
      const v = minV + ((maxV - minV) / yTicks) * i;
      const y = yScale(v);
      out += `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${vW - pad.right}" y2="${y.toFixed(1)}" stroke="var(--clr-grid,#e2e8f0)" stroke-width="1"/>`;
      out += `<text x="${pad.left - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--clr-axis,#718096)">${v.toFixed(0)}</text>`;
    }

    // X-axis labels
    years.forEach((yr, i) => {
      const x = xScale(i);
      out += `<line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${(pad.top + chartH).toFixed(1)}" stroke="var(--clr-grid,#e2e8f0)" stroke-width="0.5" stroke-dasharray="3,3"/>`;
      out += `<text x="${x.toFixed(1)}" y="${(vH - 8).toFixed(1)}" text-anchor="middle" font-size="11" fill="var(--clr-axis,#718096)">${yr}</text>`;
    });

    // COVID-19 annotation on year 2564
    const covidIndex = years.indexOf(2564);
    if (covidIndex !== -1) {
      const covidX = xScale(covidIndex);
      out += `<line x1="${covidX.toFixed(1)}" y1="${pad.top}" x2="${covidX.toFixed(1)}" y2="${(pad.top + chartH).toFixed(1)}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,5" opacity="0.95"/>`;
      out += `<rect x="${(covidX - 34).toFixed(1)}" y="${(pad.top + 6).toFixed(1)}" width="68" height="20" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="1"/>`;
      out += `<text x="${covidX.toFixed(1)}" y="${(pad.top + 20).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">COVID-19</text>`;
    }

    // Zone lines and dots
    zones.forEach(zone => {
      const color = CHART_COLORS[zone];
      const pts = reportSummary[zone].map((d, i) => `${xScale(i).toFixed(1)},${yScale(d[direction]).toFixed(1)}`).join(' ');
      out += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;

      reportSummary[zone].forEach((d, i) => {
        const cx = xScale(i).toFixed(1);
        const cy = yScale(d[direction]).toFixed(1);
        const val = d[direction].toFixed(1);
        out += `<circle cx="${cx}" cy="${cy}" r="4" fill="${color}" stroke="#fff" stroke-width="1.5">
          <title>${d.year}: ${val} km/h</title>
        </circle>`;
        // Label last point
        if (i === years.length - 1) {
          const lx = (parseFloat(cx) + 6).toFixed(1);
          out += `<text x="${lx}" y="${(parseFloat(cy) + 4).toFixed(1)}" font-size="10" fill="${color}" font-weight="600">${val}</text>`;
        }
      });
    });

    // Hover targets per year column
    years.forEach((yr, i) => {
      const currentX = xScale(i);
      const prevX = i === 0 ? pad.left : xScale(i - 1);
      const nextX = i === years.length - 1 ? pad.left + chartW : xScale(i + 1);
      const width = ((nextX - prevX) / 2);
      const x = i === 0 ? pad.left - 8 : currentX - width / 2;
      out += `<rect class="trend-hit" data-idx="${i}" x="${x.toFixed(1)}" y="${pad.top}" width="${(i === 0 || i === years.length - 1 ? width + 8 : width).toFixed(1)}" height="${chartH.toFixed(1)}" fill="transparent" tabindex="0" aria-label="${yr}"/>`;
    });

    svg.innerHTML = out;
    bindTrendChartInteractions(pointsByYear, direction, pad, chartH);
  }

  // ── 8. Compute BAU projections ────────────────────────────────────────────
  function computeBAU() {
    zones.forEach(zone => {
      const summary = reportSummary[zone];
      const last3 = summary.slice(-3);
      const deltas = [];
      for (let i = 1; i < last3.length; i++) {
        deltas.push(last3[i].in - last3[i - 1].in);
      }
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const lastSpeed = last3[last3.length - 1].in;
      const projSpeed = Math.max(0.1, lastSpeed + avgDelta);
      const projTime = (10 / projSpeed * 60).toFixed(1);
      const deltaStr = (avgDelta >= 0 ? '+' : '') + avgDelta.toFixed(2);

      const container = document.querySelector(`.scenario-item[data-zone="${zone}"]`);
      if (!container) return;
      const speedEl = container.querySelector('[data-bau="speed"]');
      const timeEl = container.querySelector('[data-bau="time"]');
      const deltaEl = container.querySelector('[data-bau="delta"]');
      if (speedEl) speedEl.textContent = projSpeed.toFixed(2);
      if (timeEl) timeEl.textContent = projTime;
      if (deltaEl) deltaEl.textContent = deltaStr;
    });
  }

  // ── 9. Sort state ─────────────────────────────────────────────────────────
  const sortState = { inner: { col: 'seq', asc: true }, middle: { col: 'seq', asc: true }, outer: { col: 'seq', asc: true } };

  function sortRoads(zone, col) {
    if (sortState[zone].col === col) {
      sortState[zone].asc = !sortState[zone].asc;
    } else {
      sortState[zone].col = col;
      sortState[zone].asc = true;
    }
  }

  function getSortedRoads(zone, searchText) {
    let zoneRoads = roads.filter(r => r.zone === zone);
    if (searchText) {
      const q = searchText.toLowerCase();
      zoneRoads = zoneRoads.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.segment && r.segment.toLowerCase().includes(q))
      );
    }
    const { col, asc } = sortState[zone];
    zoneRoads.sort((a, b) => {
      const av = a[col] ?? '';
      const bv = b[col] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return asc ? av - bv : bv - av;
      return asc ? String(av).localeCompare(String(bv), 'th') : String(bv).localeCompare(String(av), 'th');
    });
    return zoneRoads;
  }

  function renderSortedZone(zone) {
    const tbody = document.querySelector(`[data-tbody="${zone}"]`);
    if (!tbody) return;
    const searchText = document.getElementById('rtSearch')?.value || document.getElementById('tableSearch')?.value || '';
    tbody.innerHTML = buildTableRows(getSortedRoads(zone, searchText));
    // Update header indicators
    document.querySelectorAll(`[data-zone-table="${zone}"] .sortable`).forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === sortState[zone].col) {
        th.classList.add(sortState[zone].asc ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  // ── 10. Filter / search ───────────────────────────────────────────────────
  let activeZoneFilter = 'all';
  let activeTrendFilter = 'all';

  function applyFilters() {
    const searchText = document.getElementById('tableSearch')?.value.trim() || '';
    const rtSearch = document.getElementById('rtSearch')?.value.trim() || '';
    const combinedSearch = searchText || rtSearch;

    let visibleCards = 0;
    let visibleRoads = 0;

    // Cards
    document.querySelectorAll('.data-card[data-zone]').forEach(card => {
      const zone = card.dataset.zone;
      let show = activeZoneFilter === 'all' || activeZoneFilter === zone;
      if (activeTrendFilter === 'down') {
        // Hide zones whose inbound speed delta is non-negative (not declining)
        const zoneData = DATA.zones[zone];
        if (zoneData && zoneData.delta_in >= 0) show = false;
      }
      card.style.display = show ? '' : 'none';
      if (show) visibleCards++;
    });

    // Accordion zones
    document.querySelectorAll('.zone-acc[data-zone]').forEach(acc => {
      const zone = acc.dataset.zone;
      const show = activeZoneFilter === 'all' || activeZoneFilter === zone;
      acc.style.display = show ? '' : 'none';
      if (show) {
        const zoneRoads = getSortedRoads(zone, combinedSearch);
        const tbody = acc.querySelector(`[data-tbody="${zone}"]`);
        if (tbody) tbody.innerHTML = buildTableRows(zoneRoads);
        visibleRoads += zoneRoads.length;
      }
    });

    // Modern table rows
    document.querySelectorAll('.modern-table tbody tr[data-zone]').forEach(row => {
      const zone = row.dataset.zone;
      let show = activeZoneFilter === 'all' || activeZoneFilter === zone;
      if (activeTrendFilter === 'down') show = show && row.dataset.trend === 'down';
      row.style.display = show ? '' : 'none';
    });

    // Update filter status
    const statusEl = document.getElementById('filterStatus');
    if (statusEl) {
      const lang = typeof I18N !== 'undefined' ? I18N.getCurrentLang() : 'th';
      if (activeZoneFilter === 'all' && activeTrendFilter === 'all' && !combinedSearch) {
        statusEl.textContent = lang === 'th' ? 'กำลังแสดงข้อมูลทั้งหมด' : 'Showing all data';
      } else {
        const roadStr = lang === 'th' ? `${visibleRoads} ถนน` : `${visibleRoads} roads`;
        statusEl.textContent = lang === 'th'
          ? `กรองแล้ว — แสดง ${visibleCards} การ์ด · ${roadStr}`
          : `Filtered — showing ${visibleCards} cards · ${roadStr}`;
      }
    }
  }

  // ── 11. Theme toggle ──────────────────────────────────────────────────────
  function initTheme() {
    let theme = 'light';
    try { theme = localStorage.getItem('bma-theme') || 'light'; } catch (_) {}
    if (theme === 'dark') document.body.setAttribute('data-theme', 'dark');
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.body.removeAttribute('data-theme');
          try { localStorage.setItem('bma-theme', 'light'); } catch (_) {}
        } else {
          document.body.setAttribute('data-theme', 'dark');
          try { localStorage.setItem('bma-theme', 'dark'); } catch (_) {}
        }
        // Redraw chart for new theme colors
        drawTrendChart(currentChartDir);
      });
    }
  }

  // ── 12. Scroll reveal ─────────────────────────────────────────────────────
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── 13. Sortable table headers ────────────────────────────────────────────
  function initSortHeaders() {
    document.querySelectorAll('.sortable[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.setAttribute('tabindex', '0');
      th.setAttribute('role', 'columnheader');
      const handler = () => {
        const table = th.closest('[data-zone-table]');
        if (!table) return;
        const zone = table.dataset.zoneTable;
        sortRoads(zone, th.dataset.sort);
        renderSortedZone(zone);
      };
      th.addEventListener('click', handler);
      th.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
  }

  // ── 14. Main init — fire now if DOM already ready, else wait ─────────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(() => {
    // Populate zone tables
    zones.forEach(zone => renderSortedZone(zone));

    // Update live stats
    updateZoneStats();

    // Draw chart
    drawTrendChart('in');

    // BAU projection
    computeBAU();

    // Init theme
    initTheme();

    // Init reveal
    initReveal();

    // Init sortable headers
    initSortHeaders();

    // Zone filter
    const zoneFilter = document.getElementById('zoneFilter');
    if (zoneFilter) {
      zoneFilter.addEventListener('change', () => {
        activeZoneFilter = zoneFilter.value;
        applyFilters();
      });
    }

    // Trend filter
    const trendFilter = document.getElementById('trendFilter');
    if (trendFilter) {
      trendFilter.addEventListener('change', () => {
        activeTrendFilter = trendFilter.value;
        applyFilters();
      });
    }

    // Control panel search
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
      tableSearch.addEventListener('input', () => applyFilters());
    }

    // Road table search
    const rtSearch = document.getElementById('rtSearch');
    if (rtSearch) {
      rtSearch.addEventListener('input', () => {
        zones.forEach(zone => renderSortedZone(zone));
        applyFilters();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeZoneFilter = 'all';
        activeTrendFilter = 'all';
        if (zoneFilter) zoneFilter.value = 'all';
        if (trendFilter) trendFilter.value = 'all';
        if (tableSearch) tableSearch.value = '';
        if (rtSearch) rtSearch.value = '';
        zones.forEach(zone => { sortState[zone] = { col: 'seq', asc: true }; renderSortedZone(zone); });
        applyFilters();
      });
    }

    // Print
    const printBtn = document.getElementById('printReport');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // Expand / Collapse all
    document.getElementById('rtExpandAll')?.addEventListener('click', () => {
      document.querySelectorAll('.zone-acc').forEach(d => { d.open = true; });
    });
    document.getElementById('rtCollapseAll')?.addEventListener('click', () => {
      document.querySelectorAll('.zone-acc').forEach(d => { d.open = false; });
    });

    // Direction toggle for chart
    document.querySelectorAll('.dir-btn[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dir-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        drawTrendChart(btn.dataset.dir);
      });
    });

    // Language buttons
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof I18N !== 'undefined') I18N.setLang(btn.dataset.lang);
      });
    });

    // Back to top
    const toTop = document.getElementById('to-top');
    if (toTop) {
      window.addEventListener('scroll', () => {
        toTop.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Chevron rotation on accordion open/close
    document.querySelectorAll('.zone-acc').forEach(details => {
      const chevron = details.querySelector('.zone-chevron');
      if (!chevron) return;
      const update = () => chevron.classList.toggle('open', details.open);
      details.addEventListener('toggle', update);
      update();
    });

    // Initial filter status
    applyFilters();
  });
})();

