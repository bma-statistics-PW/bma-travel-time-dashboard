/* ════════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — App Logic (v2)
   Loads data/dashboard-data.json and wires up:
     - Filters (zone, trend, search)
     - Trend line chart (in/out toggle)
     - Road table 51 roads (filter + search + sort)
     - BAU scenario cards
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const ZONE_LABEL = { inner: 'พื้นที่ชั้นใน', middle: 'พื้นที่ชั้นกลาง', outer: 'พื้นที่ชั้นนอก' };
  const ZONE_EMOJI = { inner: '🏙️', middle: '🌆', outer: '🌳' };

  let DATA = null;     // dashboard-data.json
  let TC_DIR = 'in';   // current line-chart direction

  function fmt(n, d = 2) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toFixed(d).replace(/\.00$/, '.00');
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  // ────────────────────────────────────────────────────────────────
  // Filter system — KPI cards + 2560/2568 modern table
  // ────────────────────────────────────────────────────────────────
  const filterEls = {
    zone:    $('#zoneFilter'),
    trend:   $('#trendFilter'),
    search:  $('#tableSearch'),
    reset:   $('#resetFilters'),
    print:   $('#printReport'),
    status:  $('#filterStatus'),
  };
  const cards = $$('.data-card');
  const modernRows = $$('.modern-table tbody tr');
  const scenarioItems = $$('.scenario-item');

  function applyFilters() {
    const z = filterEls.zone.value;
    const t = filterEls.trend.value;
    const q = filterEls.search.value.trim().toLowerCase();

    cards.forEach(c => {
      const m = (z === 'all' || c.dataset.zone === z);
      c.classList.toggle('is-hidden', !m);
    });
    let visible = 0;
    modernRows.forEach(r => {
      const zoneMatch = z === 'all' || r.dataset.zone === z;
      const trendMatch = t === 'all' || r.dataset.trend === t;
      const textMatch = q === '' || r.textContent.toLowerCase().includes(q);
      const show = zoneMatch && trendMatch && textMatch;
      r.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    scenarioItems.forEach(s => {
      const m = (z === 'all' || s.dataset.zone === z);
      s.classList.toggle('is-hidden', !m);
    });
    const zText = (z === 'all') ? 'ทุกโซน' :
      filterEls.zone.options[filterEls.zone.selectedIndex].text;
    filterEls.status.textContent = `แสดงผล ${visible} รายการในตาราง · โซน: ${zText}`;
  }
  if (filterEls.zone)   filterEls.zone.addEventListener('change', applyFilters);
  if (filterEls.trend)  filterEls.trend.addEventListener('change', applyFilters);
  if (filterEls.search) filterEls.search.addEventListener('input', applyFilters);
  if (filterEls.reset)  filterEls.reset.addEventListener('click', () => {
    filterEls.zone.value = 'all';
    filterEls.trend.value = 'all';
    filterEls.search.value = '';
    applyFilters();
  });
  if (filterEls.print)  filterEls.print.addEventListener('click', () => window.print());

  // ────────────────────────────────────────────────────────────────
  // Bind zones JSON to KPI + modern-table
  // ────────────────────────────────────────────────────────────────
  function bindZones(zones) {
    Object.keys(zones).forEach(zk => {
      const z = zones[zk];

      // KPI speed values
      $$(`.kpi-speed[data-zone="${zk}"]`).forEach(el => {
        const dir = el.dataset.direction;
        el.textContent = fmt(dir === 'out' ? z.speed_2568_out : z.speed_2568_in);
      });

      // Min/max labels in cards
      const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
      set(`[data-extreme-label="min"][data-zone="${zk}"][data-direction="in"]`,
          `ต่ำสุด (${z.min_road_2568_in})`);
      set(`[data-extreme-speed="min"][data-zone="${zk}"][data-direction="in"]`,
          fmt(z.min_speed_2568_in));
      set(`[data-extreme-label="max"][data-zone="${zk}"][data-direction="in"]`,
          `สูงสุด (${z.max_road_2568_in})`);
      set(`[data-extreme-speed="max"][data-zone="${zk}"][data-direction="in"]`,
          fmt(z.max_speed_2568_in));
      set(`[data-extreme-label="min"][data-zone="${zk}"][data-direction="out"]`,
          `ต่ำสุด (${z.min_road_2568_out})`);
      set(`[data-extreme-speed="min"][data-zone="${zk}"][data-direction="out"]`,
          fmt(z.min_speed_2568_out));
      set(`[data-extreme-label="max"][data-zone="${zk}"][data-direction="out"]`,
          `สูงสุด (${z.max_road_2568_out})`);
      set(`[data-extreme-speed="max"][data-zone="${zk}"][data-direction="out"]`,
          fmt(z.max_speed_2568_out));

      // Modern-table row
      const row = $(`.modern-table tbody tr[data-zone="${zk}"]`);
      if (row) {
        const c2560 = row.querySelector('[data-field="speed_2560_in"]');
        const c2568 = row.querySelector('[data-field="speed_2568_in"]');
        const cdel = row.querySelector('[data-field="delta_in"]');
        const cpct = row.querySelector('[data-field="pct_in"]');
        if (c2560) c2560.textContent = fmt(z.speed_2560_in);
        if (c2568) c2568.textContent = fmt(z.speed_2568_in);
        if (cdel) cdel.textContent = (z.delta_in < 0 ? '▼ ' : '▲ ') + fmt(z.delta_in);
        if (cpct) cpct.textContent = fmt(z.pct_in) + '%';
        const trend = z.delta_in < 0 ? 'down' : 'up';
        row.dataset.trend = trend;
        if (cdel) cdel.classList.toggle('text-trend-down', trend === 'down');
        if (cdel) cdel.classList.toggle('text-trend-up', trend === 'up');
        if (cpct) cpct.classList.toggle('text-trend-down', trend === 'down');
        if (cpct) cpct.classList.toggle('text-trend-up', trend === 'up');
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // Trend line chart (built dynamically from JSON)
  // ────────────────────────────────────────────────────────────────
  const TC = {
    el: $('#trend-chart'),
    W: 860, H: 290,
    margin: { l: 56, r: 24, t: 18, b: 50 },
  };
  const NS = 'http://www.w3.org/2000/svg';

  function buildTrendChart() {
    if (!TC.el || !DATA) return;
    const svg = TC.el;
    svg.setAttribute('viewBox', `0 0 ${TC.W} ${TC.H}`);
    svg.innerHTML = '';

    const years = DATA.trend_inbound.map(d => d.year);
    const xL = TC.margin.l, xR = TC.W - TC.margin.r;
    const yT = TC.margin.t, yB = TC.H - TC.margin.b;
    const cw = xR - xL, ch = yB - yT;
    const xStep = cw / (years.length - 1);
    const x = i => xL + i * xStep;
    const yMin = 5, yMax = 65;
    const y = v => yB - ((v - yMin) / (yMax - yMin)) * ch;

    // bg
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('x', xL); bg.setAttribute('y', yT);
    bg.setAttribute('width', cw); bg.setAttribute('height', ch);
    bg.setAttribute('fill', '#f8fafc'); bg.setAttribute('rx', 8);
    svg.appendChild(bg);

    // grid
    [10, 20, 30, 40, 50, 60].forEach(v => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', xL); ln.setAttribute('x2', xR);
      ln.setAttribute('y1', y(v)); ln.setAttribute('y2', y(v));
      ln.setAttribute('stroke', '#e2e8f0');
      ln.setAttribute('stroke-dasharray', '4,4');
      svg.appendChild(ln);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', xL - 8); t.setAttribute('y', y(v) + 4);
      t.setAttribute('text-anchor', 'end'); t.setAttribute('fill', '#94a3b8');
      t.setAttribute('font-size', '11'); t.setAttribute('font-family', 'Sarabun');
      t.textContent = v;
      svg.appendChild(t);
    });
    const baseLn = document.createElementNS(NS, 'line');
    baseLn.setAttribute('x1', xL); baseLn.setAttribute('x2', xR);
    baseLn.setAttribute('y1', yB); baseLn.setAttribute('y2', yB);
    baseLn.setAttribute('stroke', '#cbd5e1'); baseLn.setAttribute('stroke-width', 1);
    svg.appendChild(baseLn);

    // x labels
    years.forEach((yr, i) => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x(i)); t.setAttribute('y', yB + 22);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', '#64748b'); t.setAttribute('font-size', '11');
      t.setAttribute('font-family', 'Sarabun');
      t.textContent = yr;
      svg.appendChild(t);
    });

    // get values for current direction
    const direction = TC_DIR;
    const data = DATA.report_summary;
    const series = ['outer', 'middle', 'inner'].map(z => ({
      key: z,
      color: { outer: '#00b894', middle: '#e17055', inner: '#d63031' }[z],
      values: data[z].map(d => d[direction])
    }));

    // lines
    series.forEach(s => {
      const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      const pl = document.createElementNS(NS, 'polyline');
      pl.setAttribute('points', pts);
      pl.setAttribute('fill', 'none');
      pl.setAttribute('stroke', s.color);
      pl.setAttribute('stroke-width', '2.5');
      pl.setAttribute('stroke-linejoin', 'round');
      pl.setAttribute('stroke-linecap', 'round');
      svg.appendChild(pl);
    });

    // dots
    const dotMap = {};
    series.forEach(s => {
      dotMap[s.key] = s.values.map((v, i) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', x(i)); c.setAttribute('cy', y(v));
        c.setAttribute('r', i === 4 ? 6 : 4);
        c.setAttribute('fill', s.color);
        c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '1.5');
        svg.appendChild(c);
        return c;
      });
    });

    // COVID marker
    const covX = x(4);
    const cl = document.createElementNS(NS, 'line');
    cl.setAttribute('x1', covX); cl.setAttribute('x2', covX);
    cl.setAttribute('y1', yT); cl.setAttribute('y2', yB);
    cl.setAttribute('stroke', '#f59e0b'); cl.setAttribute('stroke-width', '1.2');
    cl.setAttribute('stroke-dasharray', '5,3'); cl.setAttribute('opacity', '.85');
    svg.appendChild(cl);
    const cr = document.createElementNS(NS, 'rect');
    cr.setAttribute('x', covX - 30); cr.setAttribute('y', yT - 4);
    cr.setAttribute('width', 60); cr.setAttribute('height', 18);
    cr.setAttribute('rx', 4); cr.setAttribute('fill', '#fef3c7');
    svg.appendChild(cr);
    const ct = document.createElementNS(NS, 'text');
    ct.setAttribute('x', covX); ct.setAttribute('y', yT + 9);
    ct.setAttribute('text-anchor', 'middle');
    ct.setAttribute('fill', '#92400e'); ct.setAttribute('font-size', '10');
    ct.setAttribute('font-weight', '700'); ct.setAttribute('font-family', 'Sarabun');
    ct.textContent = 'COVID-19';
    svg.appendChild(ct);

    // hover hits
    years.forEach((yr, i) => {
      const wL = i === 0 ? xL : (x(i) + x(i - 1)) / 2;
      const wR = i === years.length - 1 ? xR : (x(i) + x(i + 1)) / 2;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', wL); r.setAttribute('y', yT);
      r.setAttribute('width', wR - wL); r.setAttribute('height', ch);
      r.setAttribute('fill', 'transparent');
      r.classList.add('line-hit');
      r.dataset.idx = i;
      svg.appendChild(r);
    });

    // crosshair
    const xline = document.createElementNS(NS, 'line');
    xline.setAttribute('id', 'line-guide');
    xline.setAttribute('y1', yT); xline.setAttribute('y2', yB);
    xline.setAttribute('stroke', '#94a3b8'); xline.setAttribute('stroke-width', 1);
    xline.setAttribute('stroke-dasharray', '3,3');
    xline.setAttribute('opacity', '0'); xline.setAttribute('pointer-events', 'none');
    svg.appendChild(xline);

    // tooltip
    const TIP_W = 158, TIP_H = 92;
    const tip = document.createElementNS(NS, 'g');
    tip.setAttribute('id', 'line-tip');
    tip.setAttribute('opacity', 0);
    tip.setAttribute('pointer-events', 'none');
    tip.innerHTML = `
      <rect x="0" y="0" width="${TIP_W}" height="${TIP_H}" rx="8" fill="#0f2942"/>
      <text id="tip-year" x="10" y="18" font-size="11" font-weight="700" fill="#f0c060" font-family="Sarabun"></text>
      <line x1="10" y1="24" x2="${TIP_W - 14}" y2="24" stroke="rgba(255,255,255,.25)"/>
      <circle cx="18" cy="40" r="4" fill="#00b894"/>
      <text x="28" y="44" font-size="10" fill="rgba(255,255,255,.75)" font-family="Sarabun">ชั้นนอก</text>
      <text id="tip-outer" x="${TIP_W - 14}" y="44" text-anchor="end" font-size="11" font-weight="700" fill="#00b894" font-family="Sarabun"></text>
      <circle cx="18" cy="58" r="4" fill="#e17055"/>
      <text x="28" y="62" font-size="10" fill="rgba(255,255,255,.75)" font-family="Sarabun">ชั้นกลาง</text>
      <text id="tip-mid" x="${TIP_W - 14}" y="62" text-anchor="end" font-size="11" font-weight="700" fill="#e17055" font-family="Sarabun"></text>
      <circle cx="18" cy="76" r="4" fill="#d63031"/>
      <text x="28" y="80" font-size="10" fill="rgba(255,255,255,.75)" font-family="Sarabun">ชั้นใน</text>
      <text id="tip-inn" x="${TIP_W - 14}" y="80" text-anchor="end" font-size="11" font-weight="700" fill="#d63031" font-family="Sarabun"></text>`;
    svg.appendChild(tip);

    // wire events
    function showTip(idx) {
      const xx = x(idx);
      $('#line-guide').setAttribute('x1', xx);
      $('#line-guide').setAttribute('x2', xx);
      $('#line-guide').setAttribute('opacity', 1);
      $('#tip-year').textContent = `ปี พ.ศ. ${years[idx]}`;
      $('#tip-outer').textContent = fmt(data.outer[idx][direction]) + ' กม./ชม.';
      $('#tip-mid').textContent   = fmt(data.middle[idx][direction]) + ' กม./ชม.';
      $('#tip-inn').textContent   = fmt(data.inner[idx][direction]) + ' กม./ชม.';
      let tx = xx + 14;
      if (tx + TIP_W > TC.W - 10) tx = xx - TIP_W - 14;
      tip.setAttribute('transform', `translate(${tx},${yT + 20})`);
      tip.setAttribute('opacity', 1);
      ['outer', 'middle', 'inner'].forEach(z => {
        dotMap[z].forEach((c, i) => c.setAttribute('r', i === idx ? 7 : (i === 4 ? 6 : 4)));
      });
    }
    function hideTip() {
      tip.setAttribute('opacity', 0);
      $('#line-guide').setAttribute('opacity', 0);
      ['outer', 'middle', 'inner'].forEach(z => {
        dotMap[z].forEach((c, i) => c.setAttribute('r', i === 4 ? 6 : 4));
      });
    }
    $$('.line-hit', svg).forEach(rect => {
      const idx = +rect.dataset.idx;
      rect.addEventListener('mouseenter', () => showTip(idx));
      rect.addEventListener('mouseleave', hideTip);
      rect.addEventListener('touchstart', e => { e.preventDefault(); showTip(idx); }, { passive: false });
      rect.addEventListener('touchend', hideTip);
    });
  }

  // direction toggle for trend chart
  $$('.dir-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.dir-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      TC_DIR = b.dataset.dir;
      buildTrendChart();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // BAU Scenario projection
  // ────────────────────────────────────────────────────────────────
  function projectBAU() {
    if (!DATA) return;
    const sum = DATA.report_summary;
    const items = $$('.scenario-item');
    let weakest = null;
    items.forEach(item => {
      const z = item.dataset.zone;
      const arr = sum[z];
      if (!arr || arr.length < 3) return;
      const latest = arr[arr.length - 1].in;
      const back2 = arr[arr.length - 3].in;
      const dPerYear = (latest - back2) / 2;
      const proj = Math.max(5, latest + dPerYear);
      const tt10 = 600 / proj;
      item.querySelector('[data-bau="speed"]').textContent = fmt(proj);
      item.querySelector('[data-bau="time"]').textContent = fmt(tt10);
      item.querySelector('[data-bau="delta"]').textContent = (dPerYear >= 0 ? '+' : '') + fmt(dPerYear);
      if (!weakest || dPerYear < weakest.delta) weakest = { zone: z, delta: dPerYear };
    });
    if (weakest) {
      $('#scenarioNote').textContent =
        `หมายเหตุ: แนวโน้ม BAU (Business as Usual) ชี้ว่าพื้นที่เสี่ยงทรุดตัวเร็วสุดคือ ${ZONE_LABEL[weakest.zone]} ` +
        `(${fmt(weakest.delta)} กม./ชม. ต่อปี) หากไม่มีมาตรการเพิ่มเติม — เป็นการคาดการณ์เชิงแนวโน้ม ไม่ใช่แบบจำลองจราจรเต็มรูปแบบ`;
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Road table — 51 roads
  // ────────────────────────────────────────────────────────────────
  const RT = {
    body: $('#road-tbody'),
    rowCnt: $('#rtRowCount'),
    zone: 'all',
    q: '',
    sort: { key: 'seq', dir: 'asc' },
  };
  function speedClass(v) {
    if (typeof v !== 'number') return 'na';
    if (v >= 30) return 'fast';
    if (v >= 20) return 'mid';
    if (v >= 10) return 'slow';
    return 'jam';
  }
  function speedCell(val, note) {
    if (typeof val === 'number') {
      return `<span class="speed-cell ${speedClass(val)}">${val.toFixed(2)}</span>`;
    }
    return `<span class="speed-cell na">${escapeHtml(note || '—')}</span>`;
  }
  function renderRoadTable() {
    if (!DATA || !RT.body) return;
    let rows = DATA.roads_2568.slice();
    if (RT.zone !== 'all') rows = rows.filter(r => r.zone === RT.zone);
    if (RT.q) {
      const q = RT.q.toLowerCase();
      rows = rows.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.segment || '').toLowerCase().includes(q));
    }
    const k = RT.sort.key, dir = RT.sort.dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      let av = a[k], bv = b[k];
      if (typeof av !== 'number' && typeof bv !== 'number') {
        return String(av || '').localeCompare(String(bv || '')) * dir;
      }
      if (typeof av !== 'number') return 1;
      if (typeof bv !== 'number') return -1;
      return (av - bv) * dir;
    });

    let html = '';
    rows.forEach(r => {
      const note_am = r.note_am_out;
      const note_pm = r.note_pm_out;
      html += `
        <tr>
          <td>${r.seq}</td>
          <td class="td-left">
            <span class="rd-name">${escapeHtml(r.name)}</span>
            <span class="rd-seg">${escapeHtml(r.segment)}</span>
          </td>
          <td><span class="zone-pill ${r.zone}">${ZONE_EMOJI[r.zone]} ${ZONE_LABEL[r.zone].replace('พื้นที่','')}</span></td>
          <td class="td-num">${r.length_km != null ? r.length_km.toFixed(2) : '—'}</td>
          <td>${speedCell(r.speed_am_in)}</td>
          <td>${speedCell(r.speed_am_out, note_am)}</td>
          <td>${speedCell(r.speed_pm_in)}</td>
          <td>${speedCell(r.speed_pm_out, note_pm)}</td>
        </tr>`;
    });
    RT.body.innerHTML = html || `<tr><td colspan="8" style="padding:24px;text-align:center;color:#94a3b8">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
    RT.rowCnt.textContent = `แสดง ${rows.length} จาก ${DATA.roads_2568.length} ถนน`;

    $$('#road-table thead th.sortable').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === RT.sort.key) {
        th.classList.add(RT.sort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }
  $$('.rt-filter-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.rt-filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      RT.zone = b.dataset.zone;
      renderRoadTable();
    });
  });
  const rtSearch = $('#rtSearch');
  if (rtSearch) rtSearch.addEventListener('input', e => { RT.q = e.target.value; renderRoadTable(); });
  $$('#road-table thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (RT.sort.key === k) RT.sort.dir = (RT.sort.dir === 'asc' ? 'desc' : 'asc');
      else { RT.sort.key = k; RT.sort.dir = 'asc'; }
      renderRoadTable();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // Back to top
  // ────────────────────────────────────────────────────────────────
  const toTop = $('#to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) toTop.classList.add('visible');
      else toTop.classList.remove('visible');
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ────────────────────────────────────────────────────────────────
  // Init: load data, then render
  // ────────────────────────────────────────────────────────────────
  function init() {
    fetch('data/dashboard-data.json', { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(json => {
        DATA = json;
        if (DATA.zones) bindZones(DATA.zones);
        buildTrendChart();
        renderRoadTable();
        projectBAU();
        applyFilters();
      })
      .catch(err => {
        console.error('[BMA] failed to load data:', err);
        // Even without JSON, run filter setup so static HTML still works
        applyFilters();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
