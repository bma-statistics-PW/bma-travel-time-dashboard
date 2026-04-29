/* ════════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — i18n (TH/EN)
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'bma-dashboard-lang';

  const TRANSLATIONS = {
    th: {
      // utility bar
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      skip: 'ข้ามไปยังเนื้อหาหลัก',

      // hero
      heroEyebrow: '📋 รายงานการจราจร · กรุงเทพมหานคร',
      heroTitle1: 'รายงานสรุปผลการวิเคราะห์',
      heroTitle2: 'เวลาและความเร็วเฉลี่ยในการเดินทาง',
      heroTitle3: 'ในพื้นที่กรุงเทพมหานคร',
      heroMeta: 'ช่วงเวลาเร่งด่วน · ปี พ.ศ. 2560–2568 · 51 สายถนน · 3 โซนพื้นที่',
      heroMethod: 'วิธีการสำรวจ: <strong>Floating Car Method</strong> (รถสำรวจวิ่งจริงตามกระแสจราจร)',
      heroOrg: 'กลุ่มงานสถิติและวิจัย · กองนโยบายและแผนงาน · สำนักการจราจรและขนส่ง · กรุงเทพมหานคร',

      // intro & method
      introHead: 'บทนำ',
      introText: '<strong>สำนักการจราจรและขนส่ง กรุงเทพมหานคร</strong> ได้ดำเนินการสำรวจข้อมูลเวลาในการเดินทางด้วยวิธี <strong>Floating Car Method</strong> เพื่อวิเคราะห์แนวโน้มอัตราเร็วเฉลี่ยบนโครงข่ายถนน <strong>51 สายหลัก</strong> ในช่วงเวลาเร่งด่วน โดยจำแนกตามลักษณะทางกายภาพของพื้นที่ออกเป็น 3 โซน ได้แก่ พื้นที่ชั้นใน ชั้นกลาง และชั้นนอก เพื่อประกอบการกำหนดทิศทางนโยบายการจราจรและพัฒนาระบบขนส่งสาธารณะ',
      methodTitle: 'Floating Car Method — วิธีรถสำรวจลอย',
      methodDesc: 'เก็บข้อมูลโดยให้รถสำรวจวิ่งตามกระแสจราจรบนเส้นทางที่กำหนด บันทึกเวลาและระยะทางช่วงต้น–ช่วงปลาย ทุกเที่ยวเดินทาง แล้วคำนวณความเร็วเฉลี่ย ทำซ้ำหลายเที่ยวในช่วงเร่งด่วนเช้า (07:00–09:00) และเร่งด่วนเย็น (16:00–18:00) แยกขาเข้า–ขาออก ทำให้ได้ค่าที่สะท้อนสภาพจราจรจริงของผู้ใช้รถบนถนนสายหลัก',
      mp1: '📍 51 สายถนน',
      mp2: '🌅 เร่งด่วนเช้า 07:00–09:00',
      mp3: '🌆 เร่งด่วนเย็น 16:00–18:00',
      mp4: '↔️ ขาเข้า/ขาออก',

      // nav
      navTomtom: 'TomTom Index',
      navCompare: 'เปรียบเทียบ',
      navZones: 'รายละเอียดพื้นที่',
      navTrend: 'กราฟแนวโน้ม',
      navTable: 'ตาราง 51 สาย',
      navBau: 'คาดการณ์ BAU',

      // tomtom
      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'มุมมองระดับโลก: กรุงเทพฯ ในดัชนีการจราจร TomTom',
      tomtomSub: 'ข้อมูลจาก GPS ครอบคลุมระยะทางกว่า 3.65 ล้านล้าน กม. ทั่วโลก ปี ค.ศ. 2025',
      tomtomCity: '🌐 กรุงเทพมหานคร — TomTom Traffic Index 2025',
      tt1l: 'อันดับโลก<br>ด้านความแออัดการจราจร<br>(Congestion)',
      tt2l: 'Congestion Level',
      tt2s: 'สูงขึ้น +1.3 pp จากปี 2024',
      tt3l: 'นาที / 10 กม. (เฉลี่ย)',
      tt3s: '+36 วินาที จากปี 2024',
      tt4l: 'นาที / 10 กม.<br>เร่งด่วนเช้า · Congestion 88.4%',
      tt5l: 'นาที / 10 กม.<br>เร่งด่วนเย็น · Congestion 126.5%',
      tt6l: 'ชั่วโมง / ปี',
      tt6s: 'เวลาสูญเสียช่วงเร่งด่วน (≈ 4 วัน 19 ชม.)',
      tomtomNote: '⚠️ <strong>กรุงเทพฯ ติดอันดับ 10 ของโลกด้าน Congestion</strong> ใช้เวลาเดินทางมากกว่าสภาพไหลลื่นถึง <strong>67.9%</strong> — ข้อมูล TomTom มาจาก GPS Big Data ครอบคลุมถนนทุกสายรวมทางด่วน 24 ชม. 365 วัน จึงไม่สามารถเปรียบเทียบโดยตรงกับข้อมูล สจส. ที่สำรวจเฉพาะ 51 ถนนหลักด้วย Floating Car Method ในช่วงเร่งด่วนเท่านั้น',

      // comparison
      cmpTitle: '📊 เปรียบเทียบเชิงตัวเลข: สจส. ปี 2568 และ TomTom Traffic Index 2025',
      cmpCaption: 'เปรียบเทียบตัวเลขระหว่าง สจส. และ TomTom Traffic Index 2025',
      cmpThIndicator: 'ตัวชี้วัด',
      cmpThInner: 'สจส. ชั้นใน<br><small>28 ถนน</small>',
      cmpThMiddle: 'สจส. ชั้นกลาง<br><small>20 ถนน</small>',
      cmpThOuter: 'สจส. ชั้นนอก<br><small>7 ถนน</small>',
      cmpThTomTom: 'TomTom 2025<br><small>City area</small>',
      rMethod: 'วิธีการสำรวจ',
      rSpeedIn: 'ความเร็วเฉลี่ย (กม./ชม.)',
      rSpeedInSub: 'เร่งด่วน · ขาเข้า (เฉลี่ยเช้า–เย็น)',
      rSpeedOut: 'ความเร็วเฉลี่ย (กม./ชม.)',
      rSpeedOutSub: 'เร่งด่วน · ขาออก (เฉลี่ยเช้า–เย็น)',
      rTtIn: 'เวลาเดินทาง 10 กม.',
      rTtInSub: 'เร่งด่วน · ขาเข้า',
      rTtOut: 'เวลาเดินทาง 10 กม.',
      rTtOutSub: 'เร่งด่วน · ขาออก',
      rCongestion: 'ระดับความแออัด',
      rCongestionNa: 'ไม่ได้วัดในรูปแบบนี้',
      rScope: 'ขอบเขตการสำรวจ',
      rScope1: '28 ถนน เร่งด่วนเช้า–เย็น',
      rScope2: '20 ถนน เร่งด่วนเช้า–เย็น',
      rScope3: '7 ถนน เร่งด่วนเช้า–เย็น',
      rScope4: 'ทุกสาย + ทางด่วน 24 ชม.',
      m393: '39.3 นาที', m287: '28.7 นาที', m231: '23.1 นาที',
      m350: '35.0 นาที', m221: '22.1 นาที', m170: '17.0 นาที',
      sourceNote: '<strong>* หมายเหตุ:</strong> ข้อมูล <strong>สจส.</strong> สำรวจเฉพาะ 51 ถนนสายหลักด้วย <strong>Floating Car Method</strong> ในช่วงเร่งด่วนเช้า–เย็น แยกขาเข้า–ขาออก · ตัวเลขในตารางเป็นค่าเฉลี่ยเร่งด่วน (เฉลี่ยเช้า+เย็น) ตามที่ปรากฏใน Report sheet ของรายงานต้นฉบับ · เวลาเดินทาง คำนวณจาก 10÷ความเร็วเฉลี่ย×60 นาที<br><strong>** ข้อมูล TomTom</strong> มาจาก GPS Big Data ครอบคลุมถนนทุกสายตลอด 24 ชั่วโมง · (*) ความเร็ว TomTom เช้า คำนวณจากเวลาเดินทาง 10 กม. (25:45 นาที) · (**) ความเร็ว TomTom เย็น 19.1 กม./ชม. เป็นค่า Average speed ช่วง Evening rush hour โดยตรง',

      // zone-district
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

      // controls
      ctrlHead: 'Interactive controls',
      ctrlZone: 'กรองตามโซนพื้นที่',
      ctrlTrend: 'กรองแนวโน้ม',
      ctrlSearch: 'ค้นหาในตาราง',
      ctrlSearchPh: 'พิมพ์คำค้นหา เช่น ชั้นกลาง, สุขุมวิท',
      ctrlReset: 'รีเซ็ตตัวกรอง',
      ctrlPrint: '🖨️ พิมพ์รายงาน',
      filterStatus: 'กำลังแสดงข้อมูลทั้งหมด',
      optAllZones: 'ทุกโซนพื้นที่',
      optInner: 'พื้นที่ชั้นใน',
      optMiddle: 'พื้นที่ชั้นกลาง',
      optOuter: 'พื้นที่ชั้นนอก',
      optAllTrend: 'ทุกแนวโน้ม',
      optTrendDown: 'เฉพาะแนวโน้มลดลง',

      // KPI cards
      cardTitleInner: 'พื้นที่ชั้นใน',
      cardTitleMiddle: 'พื้นที่ชั้นกลาง',
      cardTitleOuter: 'พื้นที่ชั้นนอก',
      cardYearBadge: 'ข้อมูลปี 2568 · เร่งด่วน (เฉลี่ยเช้า+เย็น)',
      dirIn: '▲ ขาเข้า',
      dirOut: '▼ ขาออก',
      dirInShort: 'ขาเข้า',
      dirOutShort: 'ขาออก',
      unitKmh: 'กม./ชม.',
      unitMin: 'นาที',

      // trend chart
      trendTitle: 'กราฟเส้นเปรียบเทียบความเร็วเฉลี่ย ปี 2560–2568',
      trendSub: 'หน่วย: กม./ชม. · ขาเข้า · ขยับเคอร์เซอร์ที่ปีเพื่อดูค่า · เปรียบเทียบ 3 โซน',
      legOuter: 'พื้นที่ชั้นนอก',
      legMiddle: 'พื้นที่ชั้นกลาง',
      legInner: 'พื้นที่ชั้นใน',

      // road table
      roadTableTitle: 'ตารางข้อมูลความเร็วรายถนน 51 สาย ปี 2568',
      rtIntro: 'คลิกที่หัวโซน <span class="rt-icon-hint">▼</span> เพื่อขยายดูรายละเอียดรายถนน · มี mini-chart 4 ทิศ และ heatmap แสดงระดับความเร็ว',
      rtSearchPh: '🔍 ค้นหาชื่อถนน หรือช่วงถนน...',
      rtExpandAll: '📂 เปิดทั้งหมด',
      rtCollapseAll: '📁 ปิดทั้งหมด',
      zaInner: 'พื้นที่ชั้นใน',
      zaMiddle: 'พื้นที่ชั้นกลาง',
      zaOuter: 'พื้นที่ชั้นนอก',
      zaAvgIn: 'เฉลี่ยขาเข้าเช้า',
      zaRange: 'ช่วง',
      thRoad: 'ชื่อถนน / ช่วง',
      thLen: 'ระยะทาง<br><small>(กม.)</small>',
      thAmRush: '🌅 เร่งด่วนเช้า',
      thPmRush: '🌆 เร่งด่วนเย็น',
      thMini: '📊 Mini-chart',
      thIn: 'ขาเข้า',
      thOut: 'ขาออก',
      legSpeedLevel: 'ระดับความเร็ว:',
      legFast: '🟢 ≥ 30 กม./ชม.',
      legMid: '🔵 20–30',
      legSlow: '🟡 10–20',
      legJam: '🔴 < 10',
      legMiniLabel: 'Mini-chart:',
      legAmIn: 'เช้าเข้า',
      legAmOut: 'เช้าออก',
      legPmIn: 'เย็นเข้า',
      legPmOut: 'เย็นออก',

      // BAU
      bauTitle: '📉 วิเคราะห์แนวโน้มกรณีไม่มีมาตรการ (Business as Usual)',
      bauSub: 'คาดการณ์ปีถัดไปจากแนวโน้ม 3 ปีล่าสุดของความเร็วเฉลี่ยช่วงเร่งด่วน · ขาเข้า',
      bauInner: 'พื้นที่ชั้นใน',
      bauMiddle: 'พื้นที่ชั้นกลาง',
      bauOuter: 'พื้นที่ชั้นนอก',
      bauProj: 'ปี 2569 คาดการณ์',
      bauTime: 'เวลาเดินทาง 10 กม.',
      bauDelta: 'การเปลี่ยนแปลงต่อปี',
      bauNote: 'หมายเหตุ: เป็นการคาดการณ์เชิงแนวโน้ม (trend projection) เพื่อใช้เตือนความเสี่ยง ไม่ใช่แบบจำลองจราจรเชิงโครงข่ายเต็มรูปแบบ',

      // 2560 vs 2568
      cmpYearsTitle: 'ตารางเปรียบเทียบความเร็วเฉลี่ย ปี 2560 และ 2568 (ขาเข้า)',
      thZoneGroup: 'กลุ่มพื้นที่',
      th2560: 'ปี 2560 (กม./ชม.)',
      th2568: 'ปี 2568 (กม./ชม.)',
      thDelta: 'ผลต่าง (กม./ชม.)',
      thPct: 'ร้อยละการเปลี่ยนแปลง',
      zaInnerShort: 'ชั้นใน',
      zaMidShort: 'ชั้นกลาง',
      zaOutShort: 'ชั้นนอก',

      // findings & policy
      findingsTitle: 'ข้อค้นพบเชิงสถิติที่สำคัญ',
      finding1: '<strong>พื้นที่ชั้นใน:</strong> เผชิญภาวะจราจรหนาแน่นต่อเนื่อง — ขาเข้าเช้า 15.27 กม./ชม. ใช้เวลา 39.3 นาที/10 กม.',
      finding2: '<strong>พื้นที่ชั้นกลาง:</strong> ลดลง 1.92% จากปี 2560 — ถนนเพชรเกษมช่วงราชพฤกษ์–วงเวียนใหญ่ ลดลงรุนแรง',
      finding3: '<strong>พื้นที่ชั้นนอก:</strong> ลดลงมากที่สุด <strong>11.08%</strong> สะท้อนการขยายตัวของชุมชนรอบนอก',
      finding4: '<strong>ปี 2564 (โควิด-19):</strong> ความเร็วสูงสุดในรอบ 9 ปีทุกโซน เพราะปริมาณรถลด',
      finding5: '<strong>ขาออกเร็วกว่าขาเข้าทุกโซน:</strong> เช้า +5.8 กม./ชม. · เย็น +2.6 กม./ชม.',
      policyTitle: 'ข้อเสนอแนะเชิงนโยบาย',
      policy1: 'เร่งรัดการพัฒนาโครงข่ายระบบขนส่งสาธารณะสายรอง (Feeder)',
      policy2: 'บูรณาการจุดเชื่อมต่อระบบขนส่งสาธารณะ (Multi-modal)',
      policy3: 'ประยุกต์ใช้ระบบเทคโนโลยี Smart Traffic, AI, ATC',
      policy4: 'ส่งเสริมการพัฒนาพื้นที่จุดจอดแล้วจร (Park &amp; Ride)',
      policy5: 'มาตรการเฉพาะพื้นที่ชั้นนอก: เพิ่มความถี่ขนส่งสาธารณะรอบเมือง',

      // footer
      footerOrgL1: 'สำนักการจราจรและขนส่ง กรุงเทพมหานคร',
      footerOrgL2: 'กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน',
      footerMethod: 'วิธีการสำรวจ: <strong>Floating Car Method</strong>',
      footerAsOf: 'ข้อมูล ณ วันที่ 31 ธันวาคม 2568',
      footerAuthor: 'วิเคราะห์และจัดทำโดย <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
    },

    en: {
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      skip: 'Skip to main content',

      heroEyebrow: '📋 Traffic Report · Bangkok Metropolitan',
      heroTitle1: 'Analysis Report on',
      heroTitle2: 'Travel Time and Average Speed',
      heroTitle3: 'in the Bangkok Metropolitan Area',
      heroMeta: 'Rush hour periods · 2017–2025 · 51 main roads · 3 zones',
      heroMethod: 'Method: <strong>Floating Car Method</strong> (probe vehicle survey along traffic flow)',
      heroOrg: 'Statistics and Research Group · Policy and Planning Division · Traffic and Transportation Department · BMA',

      introHead: 'Introduction',
      introText: 'The <strong>Traffic and Transportation Department, Bangkok Metropolitan Administration</strong> conducted travel-time surveys using the <strong>Floating Car Method</strong> to analyse trends in average vehicle speeds across <strong>51 main roads</strong> during rush hours. Roads are classified by physical location into three zones — inner, middle, and outer — to inform traffic-management policy and public-transport development.',
      methodTitle: 'Floating Car Method',
      methodDesc: 'Probe vehicles travel along designated routes following the prevailing traffic flow. Each trip records start/end time and distance, from which average speed is computed. Multiple trips are repeated during morning rush (07:00–09:00) and evening rush (16:00–18:00), separated by inbound/outbound directions, producing measurements that reflect actual driving conditions on main roads.',
      mp1: '📍 51 main roads',
      mp2: '🌅 AM rush 07:00–09:00',
      mp3: '🌆 PM rush 16:00–18:00',
      mp4: '↔️ Inbound/Outbound',

      navTomtom: 'TomTom Index',
      navCompare: 'Comparison',
      navZones: 'Zones',
      navTrend: 'Trend',
      navTable: '51 Roads',
      navBau: 'BAU forecast',

      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'Global perspective: Bangkok in TomTom Traffic Index',
      tomtomSub: 'GPS data covering over 3.65 trillion km worldwide, 2025',
      tomtomCity: '🌐 Bangkok — TomTom Traffic Index 2025',
      tt1l: 'World Rank<br>Traffic Congestion',
      tt2l: 'Congestion Level',
      tt2s: 'Up +1.3 pp from 2024',
      tt3l: 'min / 10 km (avg)',
      tt3s: '+36 sec from 2024',
      tt4l: 'min / 10 km<br>AM rush · Congestion 88.4%',
      tt5l: 'min / 10 km<br>PM rush · Congestion 126.5%',
      tt6l: 'hours / year',
      tt6s: 'Time lost in rush hours (≈ 4 days 19 hr)',
      tomtomNote: '⚠️ <strong>Bangkok ranks 10th globally for congestion</strong> — drivers spend <strong>67.9%</strong> more time travelling than under free-flow conditions. TomTom data covers all road types including expressways, 24/7, and is therefore not directly comparable to the BMA survey, which covers only 51 main roads using Floating Car Method during rush hours.',

      cmpTitle: '📊 Side-by-side: BMA 2025 vs. TomTom Traffic Index 2025',
      cmpCaption: 'Comparison of figures between BMA and TomTom Traffic Index 2025',
      cmpThIndicator: 'Indicator',
      cmpThInner: 'BMA Inner<br><small>28 roads</small>',
      cmpThMiddle: 'BMA Middle<br><small>20 roads</small>',
      cmpThOuter: 'BMA Outer<br><small>7 roads</small>',
      cmpThTomTom: 'TomTom 2025<br><small>City area</small>',
      rMethod: 'Survey method',
      rSpeedIn: 'Avg speed (km/h)',
      rSpeedInSub: 'Rush · Inbound (AM–PM avg)',
      rSpeedOut: 'Avg speed (km/h)',
      rSpeedOutSub: 'Rush · Outbound (AM–PM avg)',
      rTtIn: 'Travel time / 10 km',
      rTtInSub: 'Rush · Inbound',
      rTtOut: 'Travel time / 10 km',
      rTtOutSub: 'Rush · Outbound',
      rCongestion: 'Congestion level',
      rCongestionNa: 'Not measured this way',
      rScope: 'Scope',
      rScope1: '28 roads · AM/PM rush',
      rScope2: '20 roads · AM/PM rush',
      rScope3: '7 roads · AM/PM rush',
      rScope4: 'All roads + expressways · 24/7',
      m393: '39.3 min', m287: '28.7 min', m231: '23.1 min',
      m350: '35.0 min', m221: '22.1 min', m170: '17.0 min',
      sourceNote: '<strong>* Notes:</strong> <strong>BMA</strong> data covers only 51 main roads, surveyed by <strong>Floating Car Method</strong> during AM/PM rush hours, separated by direction. Rush-hour figures shown are the AM+PM average from the original Report sheet. Travel time = 10 ÷ avg speed × 60 (min).<br><strong>** TomTom</strong> data is from GPS Big Data covering all roads 24/7 · (*) AM speed derived from 25:45 min per 10 km · (**) PM 19.1 km/h is the direct evening-rush average from TomTom 2025.',

      zdHeader: '🗺️ Inner / Middle / Outer Zone Districts',
      zdBadge: '3 groups · 50 districts',
      zdInnerTitle: 'Inner Zone <span class="zd-count inner">15 districts</span>',
      zdInnerDesc: 'Around Rattanakosin Island',
      zdInnerList: 'Khlong San, Din Daeng, Dusit, Thon Buri, Bangkok Noi, Bangkok Yai, Bang Phlat, Bang Rak, Pathum Wan, Pom Prap Sattru Phai, Phaya Thai, Phra Nakhon, Ratchathewi, Sathon, Samphanthawong',
      zdMidTitle: 'Middle Zone <span class="zd-count middle">20 districts</span>',
      zdMidDesc: 'From Rattanakosin out to the inner ring road',
      zdMidList: 'Khlong Toei, Khan Na Yao, Chatuchak, Chom Thong, Bang Kapi, Bang Khen, Bang Kho Laem, Bang Sue, Bueng Kum, Phra Khanong, Phasi Charoen, Yan Nawa, Rat Burana, Lat Phrao, Wang Thonglang, Watthana, Saphan Sung, Suan Luang, Lak Si, Huai Khwang',
      zdOutTitle: 'Outer Zone <span class="zd-count outer">15 districts</span>',
      zdOutDesc: 'Beyond the inner ring road',
      zdOutList: 'Khlong Sam Wa, Don Mueang, Taling Chan, Thawi Watthana, Thung Khru, Bang Khun Thian, Bang Na, Bang Bon, Bang Khae, Prawet, Min Buri, Lat Krabang, Sai Mai, Nong Chok, Nong Khaem',

      ctrlHead: 'Interactive controls',
      ctrlZone: 'Filter by zone',
      ctrlTrend: 'Filter by trend',
      ctrlSearch: 'Search in table',
      ctrlSearchPh: 'Type to search, e.g. Middle, Sukhumvit',
      ctrlReset: 'Reset filters',
      ctrlPrint: '🖨️ Print report',
      filterStatus: 'Showing all data',
      optAllZones: 'All zones',
      optInner: 'Inner',
      optMiddle: 'Middle',
      optOuter: 'Outer',
      optAllTrend: 'All trends',
      optTrendDown: 'Declining only',

      cardTitleInner: 'Inner Zone',
      cardTitleMiddle: 'Middle Zone',
      cardTitleOuter: 'Outer Zone',
      cardYearBadge: '2025 data · Rush hours (AM+PM avg)',
      dirIn: '▲ Inbound',
      dirOut: '▼ Outbound',
      dirInShort: 'Inbound',
      dirOutShort: 'Outbound',
      unitKmh: 'km/h',
      unitMin: 'min',

      trendTitle: 'Average speed trend, 2017–2025',
      trendSub: 'Unit: km/h · Inbound · Hover over a year to see values · Compare 3 zones',
      legOuter: 'Outer Zone',
      legMiddle: 'Middle Zone',
      legInner: 'Inner Zone',

      roadTableTitle: 'Speed by road · 51 roads · 2025',
      rtIntro: 'Click a zone header <span class="rt-icon-hint">▼</span> to expand · Each row shows a 4-direction mini-chart and color-coded speed heatmap',
      rtSearchPh: '🔍 Search road name or segment...',
      rtExpandAll: '📂 Expand all',
      rtCollapseAll: '📁 Collapse all',
      zaInner: 'Inner Zone',
      zaMiddle: 'Middle Zone',
      zaOuter: 'Outer Zone',
      zaAvgIn: 'Avg AM inbound',
      zaRange: 'Range',
      thRoad: 'Road / Segment',
      thLen: 'Length<br><small>(km)</small>',
      thAmRush: '🌅 AM rush',
      thPmRush: '🌆 PM rush',
      thMini: '📊 Mini-chart',
      thIn: 'Inbound',
      thOut: 'Outbound',
      legSpeedLevel: 'Speed level:',
      legFast: '🟢 ≥ 30 km/h',
      legMid: '🔵 20–30',
      legSlow: '🟡 10–20',
      legJam: '🔴 < 10',
      legMiniLabel: 'Mini-chart:',
      legAmIn: 'AM-In',
      legAmOut: 'AM-Out',
      legPmIn: 'PM-In',
      legPmOut: 'PM-Out',

      bauTitle: '📉 Business-as-Usual Trend Projection',
      bauSub: 'Projection for the next year, based on the most recent 3-year trend of inbound rush-hour average speed',
      bauInner: 'Inner Zone',
      bauMiddle: 'Middle Zone',
      bauOuter: 'Outer Zone',
      bauProj: '2026 projection',
      bauTime: 'Travel time / 10 km',
      bauDelta: 'Annual change',
      bauNote: 'Note: This is a trend projection used as a risk indicator, not a full network traffic simulation.',

      cmpYearsTitle: 'Average speed comparison · 2017 vs. 2025 (Inbound)',
      thZoneGroup: 'Zone',
      th2560: '2017 (km/h)',
      th2568: '2025 (km/h)',
      thDelta: 'Change (km/h)',
      thPct: '% Change',
      zaInnerShort: 'Inner',
      zaMidShort: 'Middle',
      zaOutShort: 'Outer',

      findingsTitle: 'Key statistical findings',
      finding1: '<strong>Inner Zone:</strong> Continues to face severe congestion — AM inbound 15.27 km/h, requiring 39.3 min per 10 km.',
      finding2: '<strong>Middle Zone:</strong> Down 1.92% from 2017 — Phetkasem (Ratchaphruek to Wong Wian Yai) declined sharply.',
      finding3: '<strong>Outer Zone:</strong> Largest decline of <strong>11.08%</strong>, reflecting urban sprawl into the outer city.',
      finding4: '<strong>2021 (COVID-19):</strong> Highest speeds in 9 years across all zones due to reduced traffic volume.',
      finding5: '<strong>Outbound is faster than inbound</strong> across all zones: AM +5.8 km/h · PM +2.6 km/h.',
      policyTitle: 'Policy recommendations',
      policy1: 'Accelerate development of feeder public-transport networks',
      policy2: 'Integrate multi-modal public transport interchanges',
      policy3: 'Apply smart-traffic technology, AI, and adaptive traffic control',
      policy4: 'Promote Park &amp; Ride facilities',
      policy5: 'Outer-zone-specific measure: increase frequency of public transport',

      footerOrgL1: 'Traffic and Transportation Department, BMA',
      footerOrgL2: 'Statistics and Research Group, Policy and Planning Division',
      footerMethod: 'Method: <strong>Floating Car Method</strong>',
      footerAsOf: 'Data as of 31 December 2025',
      footerAuthor: 'Analysed and prepared by <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
    }
  };

  function detectInitialLang() {
    // 1) URL param ?lang=en
    const url = new URLSearchParams(window.location.search);
    const fromUrl = url.get('lang');
    if (fromUrl && TRANSLATIONS[fromUrl]) return fromUrl;
    // 2) localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch (e) {}
    // 3) default Thai
    return 'th';
  }

  function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.th;
    document.documentElement.lang = (lang === 'th') ? 'th' : 'en';
    document.documentElement.setAttribute('data-lang', lang);

    // text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // attributes (data-i18n-attr="placeholder:keyName")
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // Update lang button states
    document.querySelectorAll('.lang-btn').forEach(b => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    // Persist
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    // Notify other modules (so app.js can re-render dynamic content)
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  // Public API
  window.BMA_I18N = {
    apply: applyLang,
    current: () => document.documentElement.getAttribute('data-lang') || 'th',
    dict: () => TRANSLATIONS[window.BMA_I18N.current()] || TRANSLATIONS.th,
    t: (key) => {
      const d = window.BMA_I18N.dict();
      return d[key] != null ? d[key] : key;
    },
  };

  // Wire toggle buttons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.addEventListener('click', () => applyLang(b.dataset.lang));
    });
    // Theme toggle (light/dark)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const stored = (() => { try { return localStorage.getItem('bma-theme'); } catch (e) { return null; } })();
      if (stored === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('bma-theme', next); } catch (e) {}
      });
    }
    applyLang(detectInitialLang());
  });
})();
