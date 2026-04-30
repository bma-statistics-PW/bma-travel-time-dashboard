/* ═══════════════════════════════════════════════════════
   i18n.js — Bilingual (Thai / English) support
   BMA Travel Time Dashboard 2017–2025
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'bma-lang';

  /* ── Dictionaries ─────────────────────────────────── */
  const dict = {
    th: {
      skip: 'ข้ามไปยังเนื้อหาหลัก',
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      heroEyebrow: '📋 รายงานการจราจร · กรุงเทพมหานคร',
      heroTitle1: 'รายงานสรุปผลการวิเคราะห์',
      heroTitle2: 'เวลาและอัตราเร็วเฉลี่ยในการเดินทาง',
      heroTitle3: 'ในพื้นที่กรุงเทพมหานคร',
      heroMeta: 'ช่วงเวลาเร่งด่วน · ปี พ.ศ. 2560–2568 · 51 สายถนน · 3 โซนพื้นที่',
      heroMethod: 'วิธีการสำรวจ: <strong>Floating Car Method</strong>',
      heroOrg: 'กลุ่มงานสถิติและวิจัย · กองนโยบายและแผนงาน · สำนักการจราจรและขนส่ง · กรุงเทพมหานคร',
      introHead: 'บทนำ',
      introText: '<strong>สำนักการจราจรและขนส่ง กรุงเทพมหานคร</strong> ได้ดำเนินการสำรวจข้อมูลเวลาในการเดินทางด้วยวิธี <strong>Floating Car Method</strong> เพื่อวิเคราะห์แนวโน้มอัตราเร็วเฉลี่ยบนโครงข่ายถนน <strong>51 สายหลัก</strong> ในช่วงเวลาเร่งด่วน โดยจำแนกตามลักษณะทางกายภาพของพื้นที่ออกเป็น 3 โซน ได้แก่ พื้นที่ชั้นใน ชั้นกลาง และชั้นนอก เพื่อประกอบการกำหนดทิศทางนโยบายการจราจรและพัฒนาระบบขนส่งสาธารณะ',
      methodTitle: 'Floating Car Method',
      methodDesc: 'สำรวจข้อมูลด้วย <strong>Floating Car Method</strong> บนเส้นทางที่กำหนด บันทึกเวลาและระยะทางช่วงต้น–ช่วงปลาย ทุกเที่ยวเดินทาง แล้วคำนวณอัตราเร็วเฉลี่ยในการเดินทาง ในช่วงเร่งด่วนเช้า (07:00–09:00) และเร่งด่วนเย็น (16:00–18:00) แยกขาเข้า–ขาออก',
      mp1: '📍 51 สายถนน', mp2: '🌅 เร่งด่วนเช้า 07:00–09:00',
      mp3: '🌆 เร่งด่วนเย็น 16:00–18:00', mp4: '↔️ ขาเข้า/ขาออก',
      navTomtom: 'TomTom Index', navCompare: 'เปรียบเทียบ',
      navZones: 'รายละเอียดพื้นที่', navTrend: 'กราฟแนวโน้ม',
      navTable: 'ตาราง 51 สาย', navBau: 'คาดการณ์ BAU',
      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'มุมมองระดับโลก: กรุงเทพฯ ในดัชนีการจราจร TomTom',
      tomtomSub: 'ข้อมูลจาก GPS ครอบคลุมระยะทางกว่า 3.65 ล้านล้าน กม. ทั่วโลก ปี ค.ศ. 2025',
      tomtomCity: '🌐 กรุงเทพมหานคร — TomTom Traffic Index 2025',
      tt1l: 'อันดับโลก<br>ด้านความแออัดการจราจร<br>(Congestion)',
      tt2l: 'Congestion Level', tt2s: 'สูงขึ้น +1.3 pp จากปี 2024',
      tt3l: 'นาที / 10 กม. (เฉลี่ย)', tt3s: '+36 วินาที จากปี 2024',
      tt4l: 'นาที / 10 กม.<br>เร่งด่วนเช้า · Congestion 88.4%',
      tt5l: 'นาที / 10 กม.<br>เร่งด่วนเย็น · Congestion 126.5%',
      tt6l: 'ชั่วโมง / ปี', tt6s: 'เวลาสูญเสียช่วงเร่งด่วน (≈ 4 วัน 19 ชม.)',
      tomtomNote: '⚠️ <strong>กรุงเทพฯ ติดอันดับ 10 ของโลกด้าน Congestion</strong> ใช้เวลาเดินทางมากกว่าช่วง freeflow <strong>67.9%</strong> — ข้อมูล TomTom มาจาก GPS Big Data ครอบคลุมถนนทุกสายรวมทางด่วน 24 ชม. 365 วัน จึงไม่สามารถเปรียบเทียบโดยตรงกับข้อมูล สจส. ที่สำรวจเฉพาะ 51 ถนนหลักด้วย Floating Car Method ในช่วงเร่งด่วนเท่านั้น',
      cmpTitle: '📊 เปรียบเทียบเชิงตัวเลข: สจส. ปี 2568 และ TomTom Traffic Index 2025',
      cmpCaption: 'เปรียบเทียบตัวเลขระหว่าง สจส. และ TomTom Traffic Index 2025',
      cmpThIndicator: 'ตัวชี้วัด',
      cmpThInner: 'สจส. ชั้นใน<br><small>28 ถนน</small>',
      cmpThMiddle: 'สจส. ชั้นกลาง<br><small>20 ถนน</small>',
      cmpThOuter: 'สจส. ชั้นนอก<br><small>7 ถนน</small>',
      cmpThTomTom: 'TomTom 2025<br><small>City area</small>',
      rMethod: 'วิธีการสำรวจ',
      rSpeedIn: 'อัตราเร็วเฉลี่ย (กม./ชม.)', rSpeedInSub: 'เร่งด่วน · ขาเข้า (เฉลี่ยเช้า–เย็น)',
      rSpeedOut: 'อัตราเร็วเฉลี่ย (กม./ชม.)', rSpeedOutSub: 'เร่งด่วน · ขาออก (เฉลี่ยเช้า–เย็น)',
      rTtIn: 'เวลาเดินทาง 10 กม.', rTtInSub: 'เร่งด่วน · ขาเข้า',
      rTtOut: 'เวลาเดินทาง 10 กม.', rTtOutSub: 'เร่งด่วน · ขาออก',
      m393: '39.3 นาที', m287: '28.7 นาที', m231: '23.1 นาที',
      m350: '35.0 นาที', m221: '22.1 นาที', m170: '17.0 นาที',
      rCongestion: 'ระดับความแออัด', rCongestionNa: 'ไม่ได้วัดในรูปแบบนี้',
      rScope: 'ขอบเขตการสำรวจ',
      rScope1: '28 ถนน เร่งด่วนเช้า–เย็น', rScope2: '20 ถนน เร่งด่วนเช้า–เย็น',
      rScope3: '7 ถนน เร่งด่วนเช้า–เย็น', rScope4: 'ทุกสาย + ทางด่วน 24 ชม.',
      sourceNote: '<strong>* หมายเหตุ:</strong> ข้อมูล <strong>สจส.</strong> สำรวจเฉพาะ 51 ถนนสายหลักด้วย <strong>Floating Car Method</strong> ในช่วงเร่งด่วนเช้า–เย็น แยกขาเข้า–ขาออก · ตัวเลขในตารางเป็นค่าเฉลี่ยเร่งด่วน (เฉลี่ยเช้า+เย็น) ตามที่ปรากฏใน Report sheet ของรายงานต้นฉบับ · เวลาเดินทาง คำนวณจาก 10÷อัตราเร็วเฉลี่ย×60 นาที<br><strong>** ข้อมูล TomTom</strong> มาจาก GPS Big Data ครอบคลุมถนนทุกสายตลอด 24 ชั่วโมง · (*) อัตราเร็ว TomTom เช้า คำนวณจากเวลาเดินทาง 10 กม. (25:45 นาที) · (**) อัตราเร็ว TomTom เย็น 19.1 กม./ชม. เป็นค่า average speed ช่วง Evening rush hour โดยตรง',
      zdHeader: '🗺️ รายละเอียดพื้นที่ชั้นใน · ชั้นกลาง · ชั้นนอก',
      zdBadge: '3 กลุ่ม · 50 เขต',
      zdInnerTitle: 'พื้นที่ชั้นใน <span class="zd-count inner">15 เขต</span>',
      zdInnerDesc: 'บริเวณรอบเกาะรัตนโกสินทร์',
      zdInnerList: 'คลองสาน, ดินแดง, ดุสิต, ธนบุรี, บางกอกน้อย, บางกอกใหญ่, บางพลัด, บางรัก, ปทุมวัน, ป้อมปราบศัตรูพ่าย, พญาไท, พระนคร, ราชเทวี, สาทร, สัมพันธวงศ์',
      zdMidTitle: 'พื้นที่ชั้นกลาง <span class="zd-count middle">20 เขต</span>',
      zdMidDesc: 'ตั้งแต่รอบเกาะรัตนโกสินทร์ถึงบริเวณถนนวงแหวน',
      zdMidList: 'คลองเตย, คันนายาว, จตุจักร, จอมทอง, บางกะปิ, บางเขน, บางคอแหลม, บางซื่อ, บึงกุ่ม, พระโขนง, ภาษีเจริญ, ยานนาวา, ราษฎร์บูรณะ, ลาดพร้าว, วังทองหลาง, วัฒนา, สะพานสูง, สวนหลวง, หลักสี่, ห้วยขวาง',
      zdOutTitle: 'พื้นที่ชั้นนอก <span class="zd-count outer">15 เขต</span>',
      zdOutDesc: 'รอบนอกถนนวงแหวน',
      zdOutList: 'คลองสามวา, ดอนเมือง, ตลิ่งชัน, ทวีวัฒนา, ทุ่งครุ, บางขุนเทียน, บางนา, บางบอน, บางแค, ประเวศ, มีนบุรี, ลาดกระบัง, สายไหม, หนองจอก, หนองแขม',
      ctrlHead: 'ตัวกรองข้อมูล', ctrlZone: 'กรองตามโซนพื้นที่',
      optAllZones: 'ทุกโซนพื้นที่', optInner: 'พื้นที่ชั้นใน',
      optMiddle: 'พื้นที่ชั้นกลาง', optOuter: 'พื้นที่ชั้นนอก',
      ctrlTrend: 'กรองแนวโน้ม', optAllTrend: 'ทุกแนวโน้ม',
      optTrendDown: 'เฉพาะแนวโน้มลดลง',
      ctrlSearch: 'ค้นหาในตาราง', ctrlSearchPh: 'พิมพ์คำค้นหา เช่น ชั้นกลาง, สุขุมวิท',
      ctrlReset: 'รีเซ็ตตัวกรอง', ctrlPrint: '🖨️ พิมพ์รายงาน',
      filterStatus: 'กำลังแสดงข้อมูลทั้งหมด',
      cardTitleInner: 'พื้นที่ชั้นใน', cardTitleMiddle: 'พื้นที่ชั้นกลาง', cardTitleOuter: 'พื้นที่ชั้นนอก',
      cardYearBadge: 'ข้อมูลปี 2568 · เร่งด่วน (เฉลี่ยเช้า+เย็น)',
      dirIn: '▲ ขาเข้า', dirOut: '▼ ขาออก',
      dirInShort: 'ขาเข้า', dirOutShort: 'ขาออก',
      unitKmh: 'กม./ชม.', unitMin: 'นาที',
      trendTitle: 'กราฟเส้นเปรียบเทียบอัตราเร็วเฉลี่ย ปี 2560–2568',
      trendSub: 'หน่วย: กม./ชม. · เลื่อนเพื่อดูค่า · เปรียบเทียบ 3 โซน',
      legOuter: 'พื้นที่ชั้นนอก', legMiddle: 'พื้นที่ชั้นกลาง', legInner: 'พื้นที่ชั้นใน',
      roadTableTitle: 'ตารางข้อมูลอัตราเร็วรายถนน 51 สาย ปี 2568',
      rtIntro: 'คลิก <span class="rt-icon-hint">▼</span> เพื่อขยายดูรายละเอียดรายถนน · มี mini-chart 4 ทิศ และ heatmap แสดงระดับอัตราเร็ว',
      rtSearchPh: '🔍 ค้นหาชื่อถนน หรือช่วงถนน...',
      rtExpandAll: '📂 เปิดทั้งหมด', rtCollapseAll: '📁 ปิดทั้งหมด',
      zaInner: 'พื้นที่ชั้นใน', zaMiddle: 'พื้นที่ชั้นกลาง', zaOuter: 'พื้นที่ชั้นนอก',
      zaInnerShort: 'ชั้นใน', zaMidShort: 'ชั้นกลาง', zaOutShort: 'ชั้นนอก',
      zaAvgIn: 'เฉลี่ยขาเข้าเช้า', zaRange: 'ช่วง',
      thRoad: 'ชื่อถนน / ช่วง', thLen: 'ระยะทาง<br><small>(กม.)</small>',
      thAmRush: '🌅 เร่งด่วนเช้า', thPmRush: '🌆 เร่งด่วนเย็น',
      thMini: '📊 Mini-chart', thIn: 'ขาเข้า', thOut: 'ขาออก',
      legSpeedLevel: 'ระดับอัตราเร็ว:', legFast: '🟢 ≥ 30 กม./ชม.',
      legMid: '🔵 20–30', legSlow: '🟡 10–20', legJam: '🔴 < 10',
      legMiniLabel: 'Mini-chart:', legAmIn: 'เช้าเข้า', legAmOut: 'เช้าออก',
      legPmIn: 'เย็นเข้า', legPmOut: 'เย็นออก',
      bauTitle: '📉 วิเคราะห์แนวโน้มกรณีไม่มีมาตรการ (Business as Usual)',
      bauSub: 'คาดการณ์ปีถัดไปจากแนวโน้ม 3 ปีล่าสุดของอัตราเร็วเฉลี่ยช่วงเร่งด่วน · ขาเข้า',
      bauInner: 'พื้นที่ชั้นใน', bauMiddle: 'พื้นที่ชั้นกลาง', bauOuter: 'พื้นที่ชั้นนอก',
      bauProj: 'ปี 2569 คาดการณ์', bauTime: 'เวลาเดินทาง 10 กม.',
      bauDelta: 'การเปลี่ยนแปลงต่อปี',
      bauNote: 'หมายเหตุ: เป็นการคาดการณ์เชิงแนวโน้ม (trend projection) เพื่อใช้เตือนความเสี่ยง ไม่ใช่แบบจำลองจราจรเชิงโครงข่ายเต็มรูปแบบ',
      cmpYearsTitle: 'ตารางเปรียบเทียบอัตราเร็วเฉลี่ย ปี 2560 และ 2568 (ขาเข้า)',
      thZoneGroup: 'กลุ่มพื้นที่', th2560: 'ปี 2560 (กม./ชม.)',
      th2568: 'ปี 2568 (กม./ชม.)', thDelta: 'ผลต่าง (กม./ชม.)', thPct: 'ร้อยละการเปลี่ยนแปลง',
      findingsTitle: 'ข้อค้นพบเชิงสถิติที่สำคัญ',
      finding1: '<strong>พื้นที่ชั้นใน:</strong> เผชิญภาวะจราจรหนาแน่นต่อเนื่อง — ขาเข้าเช้า 15.27 กม./ชม. ใช้เวลา 39.3 นาที/10 กม.',
      finding2: '<strong>พื้นที่ชั้นกลาง:</strong> ลดลง 1.92% จากปี 2560 — ถนนเพชรเกษมช่วงราชพฤกษ์–วงเวียนใหญ่ ลดลงรุนแรง',
      finding3: '<strong>พื้นที่ชั้นนอก:</strong> ลดลงมากที่สุด <strong>11.08%</strong> สะท้อนการขยายตัวของชุมชนรอบนอก',
      finding4: '<strong>ปี 2564 (โควิด-19):</strong> อัตราเร็วสูงสุดในรอบ 9 ปีทุกโซน เพราะปริมาณรถลด',
      finding5: '<strong>ขาออกเร็วกว่าขาเข้าทุกโซน:</strong> เช้า +5.8 กม./ชม. · เย็น +2.6 กม./ชม.',
      policyTitle: 'ข้อเสนอแนะเชิงนโยบาย',
      policy1: 'เร่งรัดการพัฒนาโครงข่ายระบบขนส่งสาธารณะสายรอง (Feeder)',
      policy2: 'บูรณาการจุดเชื่อมต่อระบบขนส่งสาธารณะ (Multi-modal)',
      policy3: 'ประยุกต์ใช้ระบบเทคโนโลยี Smart Traffic, AI, ATC',
      policy4: 'ส่งเสริมการพัฒนาพื้นที่จุดจอดแล้วจร (Park &amp; Ride)',
      policy5: 'มาตรการเฉพาะพื้นที่ชั้นนอก: เพิ่มความถี่ขนส่งสาธารณะรอบเมือง',
      footerOrgL1: 'สำนักการจราจรและขนส่ง กรุงเทพมหานคร',
      footerOrgL2: 'กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน',
      footerMethod: 'วิธีการสำรวจ: <strong>Floating Car Method</strong>',
      footerAsOf: 'ข้อมูล ณ วันที่ 31 ธันวาคม 2568',
      footerAuthor: 'วิเคราะห์และจัดทำโดย <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
    },

    en: {
      skip: 'Skip to main content',
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      heroEyebrow: '📋 Traffic Report · Bangkok Metropolitan Administration',
      heroTitle1: 'Summary Analysis Report of',
      heroTitle2: 'Travel Time and Average Speed',
      heroTitle3: 'in Bangkok Metropolitan Area',
      heroMeta: 'Rush Hours · 2017–2025 · 51 Roads · 3 Zone Areas',
      heroMethod: 'Survey Method: <strong>Floating Car Method</strong>',
      heroOrg: 'Statistics &amp; Research Group · Policy &amp; Planning Division · Traffic and Transportation Dept. · BMA',
      introHead: 'Introduction',
      introText: 'The <strong>Traffic and Transportation Department, Bangkok Metropolitan Administration</strong> has conducted travel-time surveys using the <strong>Floating Car Method</strong> to analyse average-speed trends on <strong>51 main roads</strong> during rush hours, classified by area type into 3 zones: inner, middle, and outer, to support traffic policy-making and public-transport development.',
      methodTitle: 'Floating Car Method',
      methodDesc: 'Data collected using the <strong>Floating Car Method</strong> on designated routes — recording start and end time and distance for each trip — to calculate average travel speed during morning (07:00–09:00) and evening (16:00–18:00) rush hours, separated by inbound and outbound direction.',
      mp1: '📍 51 Roads', mp2: '🌅 Morning Rush 07:00–09:00',
      mp3: '🌆 Evening Rush 16:00–18:00', mp4: '↔️ Inbound / Outbound',
      navTomtom: 'TomTom Index', navCompare: 'Comparison',
      navZones: 'Zone Details', navTrend: 'Trend Chart',
      navTable: '51 Roads Table', navBau: 'BAU Forecast',
      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'Global Perspective: Bangkok in the TomTom Traffic Index',
      tomtomSub: 'Data from GPS covering more than 3.65 trillion km worldwide — 2025',
      tomtomCity: '🌐 Bangkok — TomTom Traffic Index 2025',
      tt1l: 'World Rank<br>Traffic Congestion',
      tt2l: 'Congestion Level', tt2s: '+1.3 pp from 2024',
      tt3l: 'min / 10 km (average)', tt3s: '+36 seconds from 2024',
      tt4l: 'min / 10 km<br>Morning Rush · Congestion 88.4%',
      tt5l: 'min / 10 km<br>Evening Rush · Congestion 126.5%',
      tt6l: 'Hours / Year', tt6s: 'Time lost in rush hours (≈ 4 days 19 hrs)',
      tomtomNote: '⚠️ <strong>Bangkok ranks 10th globally in Congestion</strong>, with travel time <strong>67.9%</strong> longer than free-flow — TomTom data comes from GPS Big Data covering all roads including expressways, 24 hrs, 365 days, and cannot be directly compared to BMA data which covers only 51 main roads via Floating Car Method during rush hours.',
      cmpTitle: '📊 Numerical Comparison: BMA 2025 and TomTom Traffic Index 2025',
      cmpCaption: 'Comparison between BMA (สจส.) data and TomTom Traffic Index 2025',
      cmpThIndicator: 'Indicator',
      cmpThInner: 'BMA Inner Zone<br><small>28 roads</small>',
      cmpThMiddle: 'BMA Middle Zone<br><small>20 roads</small>',
      cmpThOuter: 'BMA Outer Zone<br><small>7 roads</small>',
      cmpThTomTom: 'TomTom 2025<br><small>City area</small>',
      rMethod: 'Survey Method',
      rSpeedIn: 'Average Speed (km/h)', rSpeedInSub: 'Rush Hour · Inbound (Morning+Evening avg.)',
      rSpeedOut: 'Average Speed (km/h)', rSpeedOutSub: 'Rush Hour · Outbound (Morning+Evening avg.)',
      rTtIn: 'Travel Time 10 km', rTtInSub: 'Rush Hour · Inbound',
      rTtOut: 'Travel Time 10 km', rTtOutSub: 'Rush Hour · Outbound',
      m393: '39.3 min', m287: '28.7 min', m231: '23.1 min',
      m350: '35.0 min', m221: '22.1 min', m170: '17.0 min',
      rCongestion: 'Congestion Level', rCongestionNa: 'Not measured in this format',
      rScope: 'Survey Scope',
      rScope1: '28 roads, morning–evening rush', rScope2: '20 roads, morning–evening rush',
      rScope3: '7 roads, morning–evening rush', rScope4: 'All roads + expressways, 24 hrs',
      sourceNote: '<strong>* Note:</strong> <strong>BMA (สจส.)</strong> data covers only 51 main roads using <strong>Floating Car Method</strong> during morning–evening rush hours, inbound and outbound. Figures in the table are rush-hour averages (morning + evening) as shown in the original report. Travel time = 10 ÷ avg. speed × 60 minutes.<br><strong>** TomTom data</strong> comes from GPS Big Data covering all roads 24 hours/day. (*) TomTom morning speed calculated from 10 km travel time (25:45 min). (**) TomTom evening speed 19.1 km/h is a direct average speed during the evening rush hour.',
      zdHeader: '🗺️ Zone Details: Inner · Middle · Outer Areas',
      zdBadge: '3 Groups · 50 Districts',
      zdInnerTitle: 'Inner Zone <span class="zd-count inner">15 Districts</span>',
      zdInnerDesc: 'Area surrounding Rattanakosin Island',
      zdInnerList: 'Khlong San, Din Daeng, Dusit, Thon Buri, Bangkok Noi, Bangkok Yai, Bang Phlat, Bang Rak, Pathum Wan, Pom Prap Sattru Phai, Phaya Thai, Phra Nakhon, Ratchathewi, Sathon, Samphanthawong',
      zdMidTitle: 'Middle Zone <span class="zd-count middle">20 Districts</span>',
      zdMidDesc: 'From Rattanakosin Island to the Ring Road area',
      zdMidList: 'Khlong Toei, Khan Na Yao, Chatuchak, Chom Thong, Bang Kapi, Bang Khen, Bang Khlo, Bang Sue, Bueng Kum, Phra Khanong, Phasi Charoen, Yan Nawa, Rat Burana, Lat Phrao, Wang Thong Lang, Watthana, Saphan Sung, Suan Luang, Lak Si, Huai Khwang',
      zdOutTitle: 'Outer Zone <span class="zd-count outer">15 Districts</span>',
      zdOutDesc: 'Outside the Ring Road',
      zdOutList: 'Khlong Sam Wa, Don Mueang, Taling Chan, Thawi Watthana, Thung Khru, Bang Khun Thian, Bang Na, Bang Bon, Bang Khae, Prawet, Min Buri, Lat Krabang, Sai Mai, Nong Chok, Nong Khaem',
      ctrlHead: 'Interactive Controls', ctrlZone: 'Filter by Zone',
      optAllZones: 'All Zones', optInner: 'Inner Zone',
      optMiddle: 'Middle Zone', optOuter: 'Outer Zone',
      ctrlTrend: 'Filter by Trend', optAllTrend: 'All Trends',
      optTrendDown: 'Declining trend only',
      ctrlSearch: 'Search Table', ctrlSearchPh: 'Type to search, e.g. Sukhumvit, inner',
      ctrlReset: 'Reset Filters', ctrlPrint: '🖨️ Print Report',
      filterStatus: 'Showing all data',
      cardTitleInner: 'Inner Zone', cardTitleMiddle: 'Middle Zone', cardTitleOuter: 'Outer Zone',
      cardYearBadge: '2025 Data · Rush Hours (Morning + Evening avg.)',
      dirIn: '▲ Inbound', dirOut: '▼ Outbound',
      dirInShort: 'Inbound', dirOutShort: 'Outbound',
      unitKmh: 'km/h', unitMin: 'min',
      trendTitle: 'Average Speed Trend Comparison 2017–2025',
      trendSub: 'Unit: km/h · Hover to view values · Compare 3 zones',
      legOuter: 'Outer Zone', legMiddle: 'Middle Zone', legInner: 'Inner Zone',
      roadTableTitle: '51 Roads Average Speed Table — 2025',
      rtIntro: 'Click <span class="rt-icon-hint">▼</span> to expand zone details · Includes 4-direction mini-chart and speed heatmap',
      rtSearchPh: '🔍 Search road name or segment...',
      rtExpandAll: '📂 Expand All', rtCollapseAll: '📁 Collapse All',
      zaInner: 'Inner Zone', zaMiddle: 'Middle Zone', zaOuter: 'Outer Zone',
      zaInnerShort: 'Inner', zaMidShort: 'Middle', zaOutShort: 'Outer',
      zaAvgIn: 'Avg. Inbound Morning', zaRange: 'Range',
      thRoad: 'Road / Segment', thLen: 'Length<br><small>(km)</small>',
      thAmRush: '🌅 Morning Rush', thPmRush: '🌆 Evening Rush',
      thMini: '📊 Mini-chart', thIn: 'In', thOut: 'Out',
      legSpeedLevel: 'Speed Level:', legFast: '🟢 ≥ 30 km/h',
      legMid: '🔵 20–30', legSlow: '🟡 10–20', legJam: '🔴 < 10',
      legMiniLabel: 'Mini-chart:', legAmIn: 'AM In', legAmOut: 'AM Out',
      legPmIn: 'PM In', legPmOut: 'PM Out',
      bauTitle: '📉 Business as Usual Trend Analysis',
      bauSub: 'Next-year projection from the last 3 years of average inbound rush-hour speed',
      bauInner: 'Inner Zone', bauMiddle: 'Middle Zone', bauOuter: 'Outer Zone',
      bauProj: '2026 Projection', bauTime: 'Travel Time 10 km',
      bauDelta: 'Annual Change',
      bauNote: 'Note: This is a trend projection for risk-warning purposes only, not a full traffic network simulation model.',
      cmpYearsTitle: 'Average Speed Comparison: 2017 vs 2025 (Inbound)',
      thZoneGroup: 'Zone Group', th2560: '2017 (km/h)',
      th2568: '2025 (km/h)', thDelta: 'Δ (km/h)', thPct: '% Change',
      findingsTitle: 'Key Statistical Findings',
      finding1: '<strong>Inner Zone:</strong> Persistent heavy congestion — inbound morning 15.27 km/h, requiring 39.3 min/10 km.',
      finding2: '<strong>Middle Zone:</strong> Declined 1.92% since 2017 — Phetkasem Road (Ratchaphruek–Wong Wian Yai) shows the sharpest drop.',
      finding3: '<strong>Outer Zone:</strong> Largest decline at <strong>11.08%</strong>, reflecting rapid suburban expansion.',
      finding4: '<strong>2021 (COVID-19):</strong> Highest speeds in 9 years across all zones due to reduced traffic volumes.',
      finding5: '<strong>Outbound faster than inbound in all zones:</strong> Morning +5.8 km/h · Evening +2.6 km/h.',
      policyTitle: 'Policy Recommendations',
      policy1: 'Accelerate development of feeder public transport networks',
      policy2: 'Integrate multi-modal transport connection points',
      policy3: 'Deploy Smart Traffic, AI, and ATC technologies',
      policy4: 'Promote Park &amp; Ride development',
      policy5: 'Outer-zone specific: increase frequency of suburban public transport',
      footerOrgL1: 'Traffic and Transportation Department, Bangkok Metropolitan Administration',
      footerOrgL2: 'Statistics and Research Group, Policy and Planning Division',
      footerMethod: 'Survey Method: <strong>Floating Car Method</strong>',
      footerAsOf: 'Data as of 31 December 2025',
      footerAuthor: 'Analysed and prepared by <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
    }
  };

  /* ── Core functions ──────────────────────────────── */
  function t(key, lang) {
    const l = lang || currentLang;
    return dict[l][key] !== undefined ? dict[l][key] : (dict.th[key] !== undefined ? dict.th[key] : key);
  }

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'th';

  function applyAll(lang) {
    if (lang) currentLang = lang;
    document.documentElement.setAttribute('lang', currentLang === 'th' ? 'th' : 'en');
    document.documentElement.setAttribute('data-lang', currentLang);

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) el.textContent = val;
    });

    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(key);
      if (val !== key) el.innerHTML = val;
    });

    // data-i18n-attr="attr:key[,attr2:key2]"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.trim().split(':');
        const val = t(key);
        if (val !== key) el.setAttribute(attr, val);
      });
    });
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyAll(lang);

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  /* ── Expose globally ─────────────────────────────── */
  window.i18n = { t, setLang, applyAll, get currentLang() { return currentLang; } };

  /* ── Auto-apply on DOMContentLoaded ─────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyAll());
  } else {
    applyAll();
  }
})();
