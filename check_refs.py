import re
from pathlib import Path

root = Path(__file__).resolve().parent
html = (root / "index.html").read_text(encoding="utf-8", errors="ignore")
pattern = r'(?:src|href)=["\']((?!https?://|data:|#|mailto:|tel:)[^"\'#?]+)["\']'
refs = set(re.findall(pattern, html))
missing = []
for ref in sorted(refs):
    p = root / ref.lstrip("/")
    if not p.exists():
        missing.append(ref)
print("Total refs:", len(refs))
print("Missing:", len(missing))
for m in missing:
    print(m)
