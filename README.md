# 🚗 Bangkok Travel Time & Speed Analysis Dashboard
**Bangkok Metropolitan Administration (BMA)**
> Statistics and Research Group · Policy and Planning Division · Traffic and Transportation Department

---

## 🔗 Live Dashboard

| Version | Link | Language |
|---|---|---|
| 🇹🇭 Thai | *https://BMA-Statistics-PW.github.io/BMA-travel-time-dashboard-TH/* | ภาษาไทย |
| 🇬🇧 English | *https://BMA-Statistics-PW.github.io/BMA-travel-time-dashboard-EN/* | English |

---

## 📊 About This Project

This interactive dashboard presents a **9-year longitudinal analysis** of average travel speed and travel time across **50 major road segments** in Bangkok, classified into 3 urban zones, during morning and evening peak hours.

It also benchmarks BMA survey findings against the **TomTom Traffic Index 2025** to provide international context.

### Key Highlights

- 🏙️ **Inner zone** inbound morning speed: **15.27 km/h** (39.3 min per 10 km)
- 🌆 **Middle zone** inbound morning speed: **20.90 km/h**
- 🌳 **Outer zone** inbound morning speed: **25.99 km/h**
- 🌍 Bangkok ranked **10th most congested city globally** (TomTom 2025, Congestion Level 67.9%)
- 📉 All zones show speeds **below 2017 baseline** levels in 2025
- 🦠 **2021 peak** driven by COVID-19 traffic reduction — speeds have since declined

---

## 🗂️ Data Overview

| Parameter | Detail |
|---|---|
| **Survey Years** | 2017–2025 (Thai B.E. 2560–2568) |
| **Road Segments** | 50 major arterial roads |
| **Urban Zones** | Inner (28 roads) · Middle (20 roads) · Outer (7 roads) |
| **Directions** | Inbound (toward CBD) · Outbound (away from CBD) |
| **Morning Peak** | 07:00–09:00 (UTC+7) |
| **Evening Peak** | 16:00–18:00 (UTC+7) |
| **Speed Unit** | km/h (average travel speed) |
| **Travel Time** | Derived: `(10 ÷ speed) × 60` minutes per 10 km |
| **Data Source** | BMA official government field survey (non-GPS) |

> **Note on calendar:** Thai Buddhist Era (B.E.) = Gregorian year + 543
> (e.g., B.E. 2568 = A.D. 2025)

---

## 📋 Dashboard Sections

| # | Section | Description |
|---|---|---|
| 00 | Methodology | Survey scope, data collection framework, definitions |
| 01 | Key Indicators | KPI cards — speed by zone, 2025 vs. 2017 baseline |
| 02 | Annual Trend | Line chart: speed trend 2017–2025 across all zones |
| 03 | Travel Time | Minutes per 10 km by zone and peak period |
| 04 | Road Rankings | Top 5 fastest & slowest road segments |
| 05 | Peak Comparison | Morning vs. Evening peak — inbound vs. outbound |
| 06 | Key Findings | Summary insights and policy implications |
| — | International Benchmark | TomTom Traffic Index 2025 vs. BMA data comparison |

---

## ⚠️ Data Comparability Note

BMA survey data and TomTom Traffic Index **are not directly comparable** due to:

| Dimension | BMA Survey | TomTom Traffic Index |
|---|---|---|
| Road coverage | 50 arterial roads only | All roads + expressways |
| Time window | Peak hours only (4 hrs/day) | 24 hours/day, 365 days/year |
| Method | Field survey (speed measurement) | GPS probe data |
| Direction | Inbound / Outbound separate | City-wide average |
| Calendar | Thai Fiscal Year (B.E.) | Gregorian calendar year |

TomTom data is included **for international context only**.

---

## 🛠️ Tech Stack

```
HTML5 · CSS3 (CSS Variables, Grid, Flexbox)
SVG (inline charts — no external chart library)
Google Fonts: Sarabun (Thai + Latin)
```

> This dashboard is built as a **single self-contained HTML file** with no external JavaScript dependencies, ensuring fast load times and offline compatibility.

---

## 📁 Repository Structure

```
BMA-Travel-Speed-Analysis/
├── index.html              ← Thai version (GitHub Pages entry point)
├── index-en.html           ← English version (international audience)
└── README.md               ← This file
```

---

## 🏛️ Organization

**Bangkok Metropolitan Administration (BMA)**
กรุงเทพมหานคร (กทม.)

**Traffic and Transportation Department**
สำนักการจราจรและขนส่ง (สจส.)

**Statistics and Research Group — Policy and Planning Division**
กลุ่มงานสถิติและวิจัย · กองนโยบายและแผนงาน

**© Prapawadee_W.**

---

## 📜 Data Sources & References

- **Primary:** Average Speed Survey on Major Roads, Traffic and Transportation Department BMA , 2017–2025
- **International Reference:** [TomTom Traffic Index 2025 — Bangkok](https://www.tomtom.com/traffic-index/bangkok-traffic/)

> Road segment boundaries and distances were updated in the 2025 survey edition to reflect current road conditions and infrastructure changes.

---

## 🔗 Related Dashboards

| Project | Description | Link |
|---|---|---|
| EV Passenger Boat | Klong Phadung Krung Kasem electric boat ridership analysis | [View →](https://BMA-Statistics-PW.github.io/BMA-EV_Passenger-boat/) |
| Rail Transit Statistics | MRT / BTS / ARL passenger volume analysis | *(coming soon)* |

---

**© Prapawadee_W.**
*Last updated: 12-04-2026*
