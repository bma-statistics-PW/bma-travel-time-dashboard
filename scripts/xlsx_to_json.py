import argparse
import json
from pathlib import Path

import pandas as pd


ZONE_ROWS = {
    "inner": 3,
    "middle": 4,
    "outer": 5,
}

ZONE_SHEETS = {
    "inner": "urban_2560-2568",
    "middle": "suburban_2560-2568",
    "outer": "rural_2560-2568",
}

LATEST_INBOUND_COL = 19


def to_float(value):
    if pd.isna(value):
        return None
    if isinstance(value, str):
        value = value.strip().replace(",", "")
        if value == "-" or value == "":
            return None
    return float(value)


def build_zone_extremes(xlsx_path: Path, sheet_name: str):
    sheet = pd.read_excel(xlsx_path, sheet_name=sheet_name, header=None)
    rows = sheet.iloc[3:, [1, LATEST_INBOUND_COL]].copy()
    rows.columns = ["road", "speed_2568_in"]
    rows["speed_2568_in"] = pd.to_numeric(rows["speed_2568_in"], errors="coerce")
    rows = rows.dropna(subset=["road", "speed_2568_in"])

    slowest = rows.loc[rows["speed_2568_in"].idxmin()]
    fastest = rows.loc[rows["speed_2568_in"].idxmax()]

    return {
        "min_road_2568_in": str(slowest["road"]).strip(),
        "min_speed_2568_in": round(float(slowest["speed_2568_in"]), 2),
        "max_road_2568_in": str(fastest["road"]).strip(),
        "max_speed_2568_in": round(float(fastest["speed_2568_in"]), 2),
    }


def build_dashboard_json(xlsx_path: Path):
    report = pd.read_excel(xlsx_path, sheet_name="Report", header=None)

    years = list(range(2560, 2569))
    zones = {}
    trend_inbound = []

    for zone, row_idx in ZONE_ROWS.items():
        inbound_by_year = {}
        outbound_by_year = {}
        zone_extremes = build_zone_extremes(xlsx_path, ZONE_SHEETS[zone])

        col = 1
        for year in years:
            inbound_by_year[str(year)] = to_float(report.iloc[row_idx, col])
            outbound_by_year[str(year)] = to_float(report.iloc[row_idx, col + 1])
            col += 2

        speed_2560_in = inbound_by_year["2560"]
        speed_2568_in = inbound_by_year["2568"]
        speed_2568_out = outbound_by_year["2568"]

        delta_in = speed_2568_in - speed_2560_in
        pct_in = (delta_in / speed_2560_in) * 100 if speed_2560_in else 0

        zones[zone] = {
            "speed_2560_in": round(speed_2560_in, 2),
            "speed_2568_in": round(speed_2568_in, 2),
            "speed_2568_out": round(speed_2568_out, 2),
            "delta_in": round(delta_in, 2),
            "pct_in": round(pct_in, 2),
            "travel_time_10km_2568_in": round((10 / speed_2568_in) * 60, 1),
            "travel_time_10km_2568_out": round((10 / speed_2568_out) * 60, 1),
            "inbound_by_year": {k: round(v, 2) if v is not None else None for k, v in inbound_by_year.items()},
            "outbound_by_year": {k: round(v, 2) if v is not None else None for k, v in outbound_by_year.items()},
            **zone_extremes,
        }

    for year in years:
        trend_inbound.append(
            {
                "year": year,
                "inner": zones["inner"]["inbound_by_year"][str(year)],
                "middle": zones["middle"]["inbound_by_year"][str(year)],
                "outer": zones["outer"]["inbound_by_year"][str(year)],
            }
        )

    return {
        "meta": {
            "source_file": xlsx_path.name,
            "sheet": "Report",
            "years": years,
            "version": "1.0",
        },
        "zones": zones,
        "trend_inbound": trend_inbound,
    }


def main():
    parser = argparse.ArgumentParser(description="Convert dashboard XLSX summary into JSON")
    parser.add_argument("--input", required=True, help="Path to source .xlsx file")
    parser.add_argument("--output", required=True, help="Path to output .json file")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    payload = build_dashboard_json(input_path)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Generated {output_path} from {input_path}")


if __name__ == "__main__":
    main()
