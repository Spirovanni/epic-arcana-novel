from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parent.parent
SQL_DIR = ROOT / "data" / "career data" / "db_30_0_mysql"
LEGACY_TREE = ROOT / "data" / "career data" / "occupation_data.json"
OUTPUT_JSON = ROOT / "data" / "career data" / "occupation_data_latest.json"


def normalize_group_code(code: str) -> str:
    """Strip trailing .00 so grouping codes are comparable."""
    return code.replace(".00", "").strip()


def derive_groups(onetsoc_code: str) -> Tuple[str, str, str, str]:
    """
    Break an O*NET code into grouping layers:
    major (XX-0000), minor (XX-YY00), broad (XX-YYY0), detail (XX-YYYY).
    """
    clean = onetsoc_code.split(".")[0]
    digits = clean.split("-")[1]
    major = f"{clean[:2]}-0000"
    minor = f"{clean[:2]}-{digits[:2]}00"
    broad = f"{clean[:2]}-{digits[:3]}0"
    detail = f"{clean[:2]}-{digits}"
    return major, minor, broad, detail


def load_group_names(tree_path: Path) -> Dict[str, str]:
    """Map grouping codes (normalized) to names using the legacy tree."""
    data = json.loads(tree_path.read_text())
    name_map: Dict[str, str] = {}

    stack = list(data)
    while stack:
        node = stack.pop()
        if isinstance(node, dict):
            code = node.get("code")
            if code:
                name_map[normalize_group_code(code)] = node.get("name")
            stack.extend(node.get("children", []) or [])
    return name_map


def parse_occupation_sql(sql_path: Path) -> Dict[str, Dict[str, str]]:
    """Pull onetsoc_code, title, description rows from the insert file."""
    text = sql_path.read_text()
    pattern = re.compile(
        r"INSERT INTO occupation_data \(onetsoc_code, title, description\) VALUES \('(.*?)', '(.*?)', '(.*?)'\);"
    )
    data: Dict[str, Dict[str, str]] = {}
    for match in pattern.finditer(text):
        code, title, desc = match.groups()
        data[code] = {
            "title": title.replace("''", "'"),
            "description": desc.replace("''", "'"),
        }
    return data


def parse_alternate_titles(sql_path: Path) -> Dict[str, List[str]]:
    """Alternate titles from @29_alternate_titles.sql."""
    text = sql_path.read_text()
    pattern = re.compile(
        r"INSERT INTO alternate_titles .* VALUES \('(.*?)', '(.*?)', (NULL|'(.*?)'), '(.*?)'\);"
    )
    data: Dict[str, List[str]] = {}
    for match in pattern.finditer(text):
        code, alt, _short_raw, _short, _sources = match.groups()
        data.setdefault(code, []).append(alt.replace("''", "'"))
    return data


def parse_reported_titles(sql_path: Path) -> Dict[str, List[str]]:
    """Sample/reported titles from @30_sample_of_reported_titles.sql."""
    text = sql_path.read_text()
    pattern = re.compile(
        r"INSERT INTO sample_of_reported_titles \(onetsoc_code, reported_job_title\) VALUES \('(.*?)', '(.*?)'\);"
    )
    data: Dict[str, List[str]] = {}
    for match in pattern.finditer(text):
        code, title = match.groups()
        data.setdefault(code, []).append(title.replace("''", "'"))
    return data


def main():
    occupation_sql = SQL_DIR / "03_occupation_data.sql"
    alternate_titles_sql = SQL_DIR / "29_alternate_titles.sql"
    reported_titles_sql = SQL_DIR / "30_sample_of_reported_titles.sql"

    occupations = parse_occupation_sql(occupation_sql)
    alt_titles = parse_alternate_titles(alternate_titles_sql)
    reported_titles = parse_reported_titles(reported_titles_sql)
    group_names = load_group_names(LEGACY_TREE)

    output_rows = []
    for code in sorted(occupations.keys()):
        title = occupations[code]["title"]
        description = occupations[code]["description"]
        major, minor, broad, detail = derive_groups(code)

        entry = {
            "onetsoc_code": code,
            "normalized_code": detail,
            "title": title,
            "description": description,
            "groups": {
                "major": {"code": major, "name": group_names.get(normalize_group_code(major))},
                "minor": {"code": minor, "name": group_names.get(normalize_group_code(minor))},
                "broad": {"code": broad, "name": group_names.get(normalize_group_code(broad))},
            },
            "alternate_titles": sorted(set(alt_titles.get(code, []))),
            "reported_titles": sorted(set(reported_titles.get(code, []))),
        }
        output_rows.append(entry)

    OUTPUT_JSON.write_text(json.dumps(output_rows, indent=2, ensure_ascii=True))

    print(f"Built {len(output_rows)} occupations")
    missing_names = {
        layer: sum(1 for row in output_rows if row["groups"][layer]["name"] is None)
        for layer in ("major", "minor", "broad")
    }
    print(f"Missing group names -> major: {missing_names['major']}, minor: {missing_names['minor']}, broad: {missing_names['broad']}")
    print(f"Wrote {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
