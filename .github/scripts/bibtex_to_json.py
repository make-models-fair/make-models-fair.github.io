#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "bibtexparser>=2.0.0b9",
# ]
# ///
"""Convert a BibTeX bibliography into deterministic Hugo data JSON."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

import bibtexparser

_FIELD_CLEANUP_RE = re.compile(r"\\([&%_$#])")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a BibTeX bibliography into Hugo data JSON."
    )
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def normalize_value(value: Any) -> str:
    text = str(value).strip()
    if len(text) >= 2 and (
        (text.startswith("{") and text.endswith("}"))
        or (text.startswith('"') and text.endswith('"'))
    ):
        text = text[1:-1].strip()
    text = text.replace("{", "").replace("}", "")
    return _FIELD_CLEANUP_RE.sub(r"\1", text).strip()


def normalize_author(name: str) -> str:
    parts = [part.strip() for part in name.split(",")]
    if len(parts) == 2:
        return f"{parts[1]} {parts[0]}"
    if len(parts) >= 3:
        return f"{parts[2]} {parts[0]}, {parts[1]}"
    return name.strip()


def normalize_entry(entry: Any) -> dict[str, Any]:
    fields = [
        {"name": str(field.key), "value": normalize_value(field.value)}
        for field in entry.fields
    ]
    field_map = {field["name"]: field["value"] for field in fields}
    year_match = re.search(r"\d{4}", field_map.get("year", ""))
    author_list = [
        normalize_author(author)
        for author in re.split(r"\s+and\s+", field_map.get("author", ""))
        if author.strip()
    ]
    result = {
        "key": str(entry.key),
        "type": str(entry.entry_type).lower(),
        "sortYear": int(year_match.group(0)) if year_match else 0,
        "fields": fields,
        "fieldMap": field_map,
    }
    if author_list:
        result["authorList"] = author_list
    return result


def main() -> int:
    args = parse_args()
    if not args.input.exists():
        print(f"BibTeX source not found; skipping: {args.input}", file=sys.stderr)
        return 0

    try:
        library = bibtexparser.parse_string(args.input.read_text(encoding="utf-8"))
        entries = [normalize_entry(entry) for entry in library.entries]
        entries.sort(key=lambda entry: (-entry["sortYear"], entry["key"].lower()))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(
            json.dumps(entries, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
    except Exception as exc:
        print(f"error: failed to convert BibTeX to JSON: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
