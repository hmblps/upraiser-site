#!/usr/bin/env python3
"""Normalize partner logos for monochrome carousel — tight viewBox, single fill."""
from __future__ import annotations

import io
import re
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTNERS = ROOT / "public" / "partners"

# viewBox overrides, optional (tx, ty) translate for path groups, scale hint for partners.ts
SPECS: dict[str, dict] = {
    "apple": {"viewBox": "0 0 814 1000", "scale": 1.22},
    "google": {"viewBox": "4 14 116 42", "scale": 1.0},
    "meta": {"viewBox": "0 0 948 191", "scale": 1.0, "strip_gradients": True},
    "tiktok": {"viewBox": "0 0 32 32", "scale": 1.22},
    "snapchat": {"viewBox": "0 0 24 24", "scale": 1.24},
    "x": {"viewBox": "-2 0 302 271", "scale": 1.18},
    "reddit": {"viewBox": "0 0 1460 660", "translate": (-1040, -165), "scale": 1.0},
    "unity": {"viewBox": "0 0 275 100", "scale": 1.0},
    "bing": {"viewBox": "0 0 1020 380", "scale": 1.0},
    "taboola": {"viewBox": "0 0 723 178", "scale": 1.0},
    "singular": {"viewBox": "15 43 165 38", "scale": 1.0},
    "discord": {"viewBox": "0 0 512 100", "scale": 1.0},
    "applovin": {"viewBox": "0 0 360 65", "scale": 1.0},
    "ironsource": {"viewBox": "0 0 177.53 35.4", "scale": 1.0},
    "appsflyer": {"viewBox": "0 0 156.575 45.873", "scale": 1.0},
    "lenovo": {"viewBox": "0 0 500 105", "scale": 1.0},
    "outbrain": {"viewBox": "-0.02 0 120.57 22.67", "scale": 1.0},
    "kochava": {"scale": 1.0},  # raster — already cropped
}


def strip_svg_noise(text: str) -> str:
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"<metadata[^>]*>.*?</metadata>", "", text, flags=re.S)
    text = re.sub(r"<sodipodi:[^>]+/>", "", text)
    text = re.sub(r"<inkscape:[^>]+/>", "", text)
    text = re.sub(r"\s(sodipodi|inkscape):[^=]+=\"[^\"]*\"", "", text)
    return text


def monochrome_paths(text: str, strip_gradients: bool = False) -> str:
    if strip_gradients:
        text = re.sub(r"<defs>.*?</defs>", "", text, flags=re.S)
        text = re.sub(r"<linearGradient[^>]*>.*?</linearGradient>", "", text, flags=re.S)
    text = re.sub(r'\sstyle="[^"]*"', "", text)
    text = re.sub(r'\sclass="[^"]*"', "", text)
    text = re.sub(r"\sfill=\"#[^\"]+\"", "", text)
    text = re.sub(r'\sfill="url\([^"]+\)"', "", text)
    text = re.sub(r"<path", '<path fill="#000000"', text)
    text = re.sub(r'fill="#000000"\s+fill="#000000"', 'fill="#000000"', text)
    return text


def set_viewbox(text: str, viewbox: str) -> str:
    if re.search(r'\sviewBox="', text):
        text = re.sub(r'viewBox="[^"]+"', f'viewBox="{viewbox}"', text, count=1)
    else:
        text = re.sub(r"(<svg\b)", rf'\1 viewBox="{viewbox}"', text, count=1)
    text = re.sub(r'\swidth="[^"]+"', "", text, count=1)
    text = re.sub(r'\sheight="[^"]+"', "", text, count=1)
    return text


def apply_translate(text: str, tx: float, ty: float) -> str:
    inner = re.search(r"<svg[^>]*>(.*)</svg>", text, re.S)
    if not inner:
        return text
    body = inner.group(1).strip()
    wrapped = f'<g transform="translate({tx},{ty})">{body}</g>'
    return re.sub(r"<svg([^>]*)>.*</svg>", rf"<svg\1>{wrapped}</svg>", text, flags=re.S)


def normalize_file(slug: str, spec: dict) -> None:
    path = PARTNERS / f"{slug}.svg"
    if not path.exists():
        return
    text = path.read_text()
    if "<image" in text and slug == "kochava":
        return  # keep cropped raster

    text = strip_svg_noise(text)
    text = monochrome_paths(text, spec.get("strip_gradients", False))

    if "viewBox" in spec:
        text = set_viewbox(text, spec["viewBox"])

    if "translate" in spec:
        tx, ty = spec["translate"]
        text = apply_translate(text, tx, ty)

    # minimal svg header cleanup
    if 'xmlns="http://www.w3.org/2000/svg"' not in text:
        text = text.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)

    path.write_text(text)


def main() -> None:
    for slug, spec in SPECS.items():
        normalize_file(slug, spec)
        print(f"normalized {slug} scale={spec.get('scale', 1)}")


if __name__ == "__main__":
    main()
