/* ════════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — App Logic (v4 · i18n-aware)
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function t(key) {
    return (window.BMA_I18N && window.BMA_I18N.t)
      ? window.BMA_I18N.t(key)
      : key;
  }
  function lang() {
    return (window.BMA_I18N && window.BMA_I18N.current) ? window.BMA_I18N.current() : 'th';
  }

  let DATA = null;
  let TC_DIR = 'in';

  function fmt(n, d = 2) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toFixed(d);
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
  function speedClass(v) {
    if (typeof v !== 'number') return 'na';
    if (v >= 30) return 'fast';
    if (v >= 20) return 'mid';
    if (v >= 10) return 'slow';
    return 'jam';
  }
  function speedEmoji(v) {
    if (typeof v !== 'number') return '';
    if (v >= 30) return '🟢';
    if (v >= 20) return '🔵';
    if (v >= 10) return '🟡';
    return '🔴';
  }
  function speedCell(val, note) {
    if (typeof val === 'number') {
      const unit = lang() === 'th' ? 'กม./ชม.' : 'km/h';
      return `<span class="speed-cell ${speedClass(val)}" title="${val.toFixed(2)} ${unit}">
        <span class="se">${speedEmoji(val)}</span>${val.toFixed(2)}
      </span>`;
    }
    return `<span class="speed-cell na">${escapeHtml(note || '—')}</span>`;
  }

  // Mini-chart (translated tooltips)
  function miniChart(r) {
    const vals = [r.speed_am_in, r.speed_am_out, r.speed_pm_in, r.speed_pm_out];
    const colors = ['#d63031', '#e17055', '#6c5ce7', '#0984e3'];
    const titlesTh = ['เช้าเข้า','เช้าออก','เย็นเข้า','เย็นออก'];
    const titlesEn = ['AM-In','AM-Out','PM-In','PM-Out'];
    const titles = lang() === 'th' ? titlesTh : titlesEn;
    const unit = lang() === 'th' ? 'กม./ชม.' : 'km/h';
    const maxV = 70;
    const W = 88, H = 32, gap = 4, barW = (W - gap * 5) / 4;
    let svg = `<svg class="mini-chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Speed mini-chart">`;
    svg += `<line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="#e2e8f0" stroke-width="1"/>`;
    vals.forEach((v, i) => {
      const x = gap + i * (barW + gap);
      let h, opacity = 1;
      if (typeof v === 'number') h = Math.max(2, Math.min(H - 2, (v / maxV) * (H - 2)));
      else { h = 1; opacity = .25; }
      const y = H - 1 - h;
      svg += `<rect class="mc-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="1.5"
                fill="${colors[i]}" opacity="${opacity}">
                <title>${titles[i]}: ${typeof v === 'number' ? v.toFixed(2) + ' ' + unit : '—'}</title>
              </rect>`;
    });
    svg += `</svg>`;
    return svg;
  }

  // ────────────────────────────────────────────────────────────────
  // Filters (top control panel)
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
    if (!filterEls.zone) return;
    const z = filterEls.zone.value;
    const tr = filterEls.trend.value;
    const q = filterEls.search.value.trim().toLowerCase();
    cards.forEach(c => c.classList.toggle('is-hidden', !(z === 'all' || c.dataset.zone === z)));
    let visible = 0;
    modernRows.forEach(r => {
      const zoneMatch = z === 'all' || r.dataset.zone === z;
      const trendMatch = tr === 'all' || r.dataset.trend === tr;
      const textMatch = q === '' || r.textContent.toLowerCase().includes(q);
      const show = zoneMatch && trendMatch && textMatch;
      r.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    scenarioItems.forEach(s => s.classList.toggle('is-hidden', !(z === 'all' || s.dataset.zone === z)));
    const zText = (z === 'all') ? t('optAllZones') : filterEls.zone.options[filterEls.zone.selectedIndex].text;
    const lbl = lang() === 'th' ? `แสดงผล ${visible} รายการในตาราง · โซน: ${zText}` :
                                  `Showing ${visible} rows · Zone: ${zText}`;
    filterEls.status.textContent = lbl;
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
  // Bind zones → KPI + 2560 vs 2568 table
  // ────────────────────────────────────────────────────────────────
  function getZoneRoadName(zk, dir, kind) {
    // kind = min/max ; dir = in/out
    if (!DATA || !DATA.zones || !DATA.zones[zk]) return '';
    const z = DATA.zones[zk];
    return z[`${kind}_road_2568_${dir}`] || '';
  }
  function localizedExtreme(label, name) {
    const prefix = lang() === 'th'
      ? (label === 'min' ? 'ต่ำสุด' : 'สูงสุด')
      : (label === 'min' ? 'Min' : 'Max');
    return `${prefix} (${name})`;
  }

  function bindZones(zones) {
    Object.keys(zones).forEach(zk => {
      const z = zones[zk];
      $$(`.kpi-speed[data-zone="${zk}"]`).forEach(el => {
        const dir = el.dataset.direction;
        el.textContent = fmt(dir === 'out' ? z.speed_2568_out : z.speed_2568_in);
      });
      const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
      ['in','out'].forEach(dir => {
        ['min','max'].forEach(kind => {
          set(`[data-extreme-label="${kind}"][data-zone="${zk}"][data-direction="${dir}"]`,
              localizedExtreme(kind, z[`${kind}_road_2568_${dir}`]));
          set(`[data-extreme-speed="${kind}"][data-zone="${zk}"][data-direction="${dir}"]`,
              fmt(z[`${kind}_speed_2568_${dir}`]));
        });
      });

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
        row.dataset.trend = z.delta_in < 0 ? 'down' : 'up';
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // Trend line chart
  // ────────────────────────────────────────────────────────────────
  const TC = { el: $('#trend-chart'), W: 860, H: 290, margin: { l: 56, r: 24, t: 18, b: 50 } };
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

    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('x', xL); bg.setAttribute('y', yT);
    bg.setAttribute('width', cw); bg.setAttribute('height', ch);
    bg.setAttribute('fill', '#f8fafc'); bg.setAttribute('rx', 8);
    svg.appendChild(bg);

    [10, 20, 30, 40, 50, 60].forEach(v => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', xL); ln.setAttribute('x2', xR);
      ln.setAttribute('y1', y(v)); ln.setAttribute('y2', y(v));
      ln.setAttribute('stroke', '#e2e8f0'); ln.setAttribute('stroke-dasharray', '4,4');
      svg.appendChild(ln);
      const tt = document.createElementNS(NS, 'text');
      tt.setAttribute('x', xL - 8); tt.setAttribute('y', y(v) + 4);
      tt.setAttribute('text-anchor', 'end'); tt.setAttribute('fill', '#94a3b8');
      tt.setAttribute('font-size', '11'); tt.setAttribute('font-family', 'IBM Plex Mono');
      tt.textContent = v;
      svg.appendChild(tt);
    });
    const baseLn = document.createElementNS(NS, 'line');
    baseLn.setAttribute('x1', xL); baseLn.setAttribute('x2', xR);
    baseLn.setAttribute('y1', yB); baseLn.setAttribute('y2', yB);
    baseLn.setAttribute('stroke', '#cbd5e1'); baseLn.setAttribute('stroke-width', 1);
    svg.appendChild(baseLn);

    // year labels — show TH BE or EN CE based on lang
    years.forEach((yr, i) => {
      const tt = document.createElementNS(NS, 'text');
      tt.setAttribute('x', x(i)); tt.setAttribute('y', yB + 22);
      tt.setAttribute('text-anchor', 'middle');
      tt.setAttribute('fill', '#64748b'); tt.setAttribute('font-size', '11');
      tt.setAttribute('font-family', 'IBM Plex Sans Thai');
      tt.textContent = lang() === 'th' ? yr : (yr - 543);
      svg.appendChild(tt);
    });

    const direction = TC_DIR;
    const data = DATA.report_summary;
    const series = ['outer', 'middle', 'inner'].map(z => ({
      key: z, color: { outer: '#00b894', middle: '#e17055', inner: '#d63031' }[z],
      values: data[z].map(d => d[direction])
    }));

    series.forEach(s => {
      const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      const pl = document.createElementNS(NS, 'polyline');
      pl.setAttribute('points', pts);
      pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', s.color);
      pl.setAttribute('stroke-width', '2.5');
      pl.setAttribute('stroke-linejoin', 'round'); pl.setAttribute('stroke-linecap', 'round');
      svg.appendChild(pl);
    });

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

    // COVID
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
    ct.setAttribute('font-weight', '700'); ct.setAttribute('font-family', 'IBM Plex Sans Thai');
    ct.textContent = 'COVID-19';
    svg.appendChild(ct);

    years.forEach((yr, i) => {
      const wL = i === 0 ? xL : (x(i) + x(i - 1)) / 2;
      const wR = i === years.length - 1 ? xR : (x(i) + x(i + 1)) / 2;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', wL); r.setAttribute('y', yT);
      r.setAttribute('width', wR - wL); r.setAttribute('height', ch);
      r.setAttribute('fill', 'transparent');
      r.classList.add('line-hit'); r.dataset.idx = i;
      svg.appendChild(r);
    });

    const xline = document.createElementNS(NS, 'line');
    xline.setAttribute('id', 'line-guide');
    xline.setAttribute('y1', yT); xline.setAttribute('y2', yB);
    xline.setAttribute('stroke', '#94a3b8'); xline.setAttribute('stroke-width', 1);
    xline.setAttribute('stroke-dasharray', '3,3');
    xline.setAttribute('opacity', '0'); xline.setAttribute('pointer-events', 'none');
    svg.appendChild(xline);

    const TIP_W = 168, TIP_H = 92;
    const labelOuter = lang() === 'th' ? 'ชั้นนอก' : 'Outer';
    const labelMid = lang() === 'th' ? 'ชั้นกลาง' : 'Middle';
    const labelInner = lang() === 'th' ? 'ชั้นใน' : 'Inner';
    const yearPrefix = lang() === 'th' ? 'ปี พ.ศ. ' : 'Year ';
    const unit = lang() === 'th' ? 'กม./ชม.' : 'km/h';

    const tip = document.createElementNS(NS, 'g');
    tip.setAttribute('id', 'line-tip');
    tip.setAttribute('opacity', 0);
    tip.setAttribute('pointer-events', 'none');
    tip.innerHTML = `
      <rect x="0" y="0" width="${TIP_W}" height="${TIP_H}" rx="8" fill="#0f2942"/>
      <text id="tip-year" x="10" y="18" font-size="11" font-weight="700" fill="#f0c060" font-family="IBM Plex Sans Thai"></text>
      <line x1="10" y1="24" x2="${TIP_W - 14}" y2="24" stroke="rgba(255,255,255,.25)"/>
      <circle cx="18" cy="40" r="4" fill="#00b894"/>
      <text x="28" y="44" font-size="10" fill="rgba(255,255,255,.75)" font-family="IBM Plex Sans Thai">${labelOuter}</text>
      <text id="tip-outer" x="${TIP_W - 14}" y="44" text-anchor="end" font-size="11" font-weight="700" fill="#00b894" font-family="IBM Plex Mono"></text>
      <circle cx="18" cy="58" r="4" fill="#e17055"/>
      <text x="28" y="62" font-size="10" fill="rgba(255,255,255,.75)" font-family="IBM Plex Sans Thai">${labelMid}</text>
      <text id="tip-mid" x="${TIP_W - 14}" y="62" text-anchor="end" font-size="11" font-weight="700" fill="#e17055" font-family="IBM Plex Mono"></text>
      <circle cx="18" cy="76" r="4" fill="#d63031"/>
      <text x="28" y="80" font-size="10" fill="rgba(255,255,255,.75)" font-family="IBM Plex Sans Thai">${labelInner}</text>
      <text id="tip-inn" x="${TIP_W - 14}" y="80" text-anchor="end" font-size="11" font-weight="700" fill="#d63031" font-family="IBM Plex Mono"></text>`;
    svg.appendChild(tip);

    function showTip(idx) {
      const xx = x(idx);
      $('#line-guide').setAttribute('x1', xx);
      $('#line-guide').setAttribute('x2', xx);
      $('#line-guide').setAttribute('opacity', 1);
      const ydisp = lang() === 'th' ? years[idx] : (years[idx] - 543);
      $('#tip-year').textContent = `${yearPrefix}${ydisp}`;
      $('#tip-outer').textContent = fmt(data.outer[idx][direction]) + ' ' + unit;
      $('#tip-mid').textContent   = fmt(data.middle[idx][direction]) + ' ' + unit;
      $('#tip-inn').textContent   = fmt(data.inner[idx][direction]) + ' ' + unit;
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

  $$('.dir-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.dir-btn').forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      TC_DIR = b.dataset.dir;
      buildTrendChart();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // BAU
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
    const note = $('#scenarioNote');
    if (weakest && note) {
      const labelMap = lang() === 'th'
        ? { inner: 'พื้นที่ชั้นใน', middle: 'พื้นที่ชั้นกลาง', outer: 'พื้นที่ชั้นนอก' }
        : { inner: 'Inner Zone', middle: 'Middle Zone', outer: 'Outer Zone' };
      const unit = lang() === 'th' ? 'กม./ชม.' : 'km/h';
      const txt = lang() === 'th'
        ? `หมายเหตุ: แนวโน้ม BAU (Business as Usual) ชี้ว่าพื้นที่เสี่ยงทรุดตัวเร็วสุดคือ ${labelMap[weakest.zone]} (${fmt(weakest.delta)} ${unit} ต่อปี) หากไม่มีมาตรการเพิ่มเติม — เป็นการคาดการณ์เชิงแนวโน้ม ไม่ใช่แบบจำลองจราจรเต็มรูปแบบ`
        : `Note: BAU trend indicates the fastest-deteriorating zone is ${labelMap[weakest.zone]} (${fmt(weakest.delta)} ${unit}/year) without intervention — this is a trend projection, not a full network simulation.`;
      note.textContent = txt;
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Road table — accordion
  // ────────────────────────────────────────────────────────────────
  const RT = {
    q: '',
    sortByZone: { inner: { key: 'seq', dir: 'asc' }, middle: { key: 'seq', dir: 'asc' }, outer: { key: 'seq', dir: 'asc' } },
  };

  function avg(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0) / arr.length : null; }

  function calcZoneStats() {
    if (!DATA) return {};
    const out = {};
    ['inner', 'middle', 'outer'].forEach(z => {
      const rs = DATA.roads_2568.filter(r => r.zone === z);
      const num = (key) => rs.map(r => r[key]).filter(v => typeof v === 'number');
      const ai = num('speed_am_in');
      out[z] = {
        count: rs.length,
        am_in:  avg(ai),
        am_out: avg(num('speed_am_out')),
        pm_in:  avg(num('speed_pm_in')),
        pm_out: avg(num('speed_pm_out')),
        range_in_min: ai.length ? Math.min(...ai) : null,
        range_in_max: ai.length ? Math.max(...ai) : null,
      };
    });
    return out;
  }

  function bindZoneAccordionStats(stats) {
    Object.keys(stats).forEach(z => {
      const s = stats[z];
      const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
      const wordRoads = lang() === 'th' ? 'ถนน' : 'roads';
      set(`[data-count="${z}"]`, `${s.count} ${wordRoads}`);
      set(`[data-avg="${z}-am-in"]`, fmt(s.am_in, 2));
      set(`[data-stat="${z}-am-in"]`, fmt(s.am_in, 1));
      set(`[data-stat="${z}-am-out"]`, fmt(s.am_out, 1));
      set(`[data-stat="${z}-pm-in"]`, fmt(s.pm_in, 1));
      set(`[data-stat="${z}-pm-out"]`, fmt(s.pm_out, 1));
      if (s.range_in_min != null) {
        set(`[data-range="${z}"]`, `${s.range_in_min.toFixed(1)}–${s.range_in_max.toFixed(1)}`);
      }
    });
  }

  function renderZoneTable(zoneKey) {
    const tbody = $(`tbody[data-tbody="${zoneKey}"]`);
    if (!tbody || !DATA) return;
    let rows = DATA.roads_2568.filter(r => r.zone === zoneKey);
    const q = RT.q.toLowerCase();
    if (q) rows = rows.filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.segment || '').toLowerCase().includes(q));

    const sortCfg = RT.sortByZone[zoneKey];
    const k = sortCfg.key, dir = sortCfg.dir === 'asc' ? 1 : -1;
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
      html += `
        <tr>
          <td>${r.seq}</td>
          <td class="td-left">
            <span class="rd-name">${escapeHtml(r.name)}</span>
            <span class="rd-seg">${escapeHtml(r.segment)}</span>
          </td>
          <td class="td-num">${r.length_km != null ? r.length_km.toFixed(2) : '—'}</td>
          <td>${speedCell(r.speed_am_in)}</td>
          <td>${speedCell(r.speed_am_out, r.note_am_out)}</td>
          <td>${speedCell(r.speed_pm_in)}</td>
          <td>${speedCell(r.speed_pm_out, r.note_pm_out)}</td>
          <td>${miniChart(r)}</td>
        </tr>`;
    });
    tbody.innerHTML = html || `<tr><td colspan="8" style="padding:24px;text-align:center;color:#94a3b8">${lang() === 'th' ? 'ไม่พบข้อมูลที่ค้นหา' : 'No matching results'}</td></tr>`;

    const tableEl = $(`table[data-zone-table="${zoneKey}"]`);
    if (tableEl) {
      $$('thead th.sortable', tableEl).forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === sortCfg.key) {
          th.classList.add(sortCfg.dir === 'asc' ? 'sort-asc' : 'sort-desc');
        }
      });
    }
  }

  function renderAllZoneTables() {
    ['inner', 'middle', 'outer'].forEach(renderZoneTable);
  }

  $$('.zone-acc table thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const tbl = th.closest('table');
      const zoneKey = tbl.dataset.zoneTable;
      const k = th.dataset.sort;
      const cfg = RT.sortByZone[zoneKey];
      if (cfg.key === k) cfg.dir = cfg.dir === 'asc' ? 'desc' : 'asc';
      else { cfg.key = k; cfg.dir = 'asc'; }
      renderZoneTable(zoneKey);
    });
  });

  const rtSearch = $('#rtSearch');
  if (rtSearch) {
    rtSearch.addEventListener('input', e => {
      RT.q = e.target.value;
      renderAllZoneTables();
      if (RT.q.trim()) {
        ['inner', 'middle', 'outer'].forEach(z => {
          const acc = $(`details.zone-acc[data-zone="${z}"]`);
          const tbody = $(`tbody[data-tbody="${z}"]`);
          if (acc && tbody) {
            const hasResults = !!tbody.querySelector('tr td.td-left');
            acc.open = hasResults;
          }
        });
      }
    });
  }
  const expandBtn = $('#rtExpandAll');
  const collapseBtn = $('#rtCollapseAll');
  if (expandBtn) expandBtn.addEventListener('click', () => $$('.zone-acc').forEach(a => a.open = true));
  if (collapseBtn) collapseBtn.addEventListener('click', () => $$('.zone-acc').forEach(a => a.open = false));

  // ────────────────────────────────────────────────────────────────
  // Reveal on scroll
  // ────────────────────────────────────────────────────────────────
  function setupReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

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
  // Re-render when language changes
  // ────────────────────────────────────────────────────────────────
  document.addEventListener('i18n:change', () => {
    if (!DATA) return;
    bindZones(DATA.zones);
    const stats = calcZoneStats();
    bindZoneAccordionStats(stats);
    buildTrendChart();
    renderAllZoneTables();
    projectBAU();
    applyFilters();
  });

  // ────────────────────────────────────────────────────────────────
  // Init
  // ────────────────────────────────────────────────────────────────
  function init() {
    setupReveal();
    fetch('data/dashboard-data.json', { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(json => {
        DATA = json;
        if (DATA.zones) bindZones(DATA.zones);
        const stats = calcZoneStats();
        bindZoneAccordionStats(stats);
        buildTrendChart();
        renderAllZoneTables();
        projectBAU();
        applyFilters();
      })
      .catch(err => {
        console.error('[BMA] failed to load data:', err);
        applyFilters();
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
