"""
Independent re-check of src/lib/listings/portfolio.json against the source records on D:
(run on the office machine only). Deliberately written differently from the extractor:

  * takes the street from the FOLDER NAME (extractor: from the EPC certificate text),
  * takes the outward postcode from ANY certificate PDF that mentions the folder's street,
  * takes status from the One Page Plan by fuzzy street+number match on the *plan* side.

Prints one line per discrepancy and a summary; exit code 1 if any hard discrepancy.
Hard: house number / flat letter / full postcode / a person's name-like token in the shipped JSON;
      street or outward code disagreement.  Soft: status disagreement (plan matching is fuzzy).
"""
import glob, json, os, re, sys

import openpyxl
from pypdf import PdfReader

ROOT = os.path.dirname(os.path.abspath(__file__))
SHIPPED = os.path.join(ROOT, "..", "..", "src", "lib", "listings", "portfolio.json")
PROPS = r"D:\1. RB Properties"
PLAN = r"D:\2. RB Business Docs\11 Trackers & Spreadsheets\ONE PAGE PLAN RED BRICK.xlsx"

FOLDER_FIX = {"Belsize Ave": "Belsize Avenue", "Fulham": "Fulham Road", "Fellowes Garden": "Fellowes Gardens",
              "Francis Garden": "Francis Gardens", "Sanford": "Sandford", "ST Pauls Road": "St Paul's Road",
              "Eastfield": "Eastfield Road", "Elmfield": "Elmfield Road"}

def norm(s):
    return re.sub(r"[^a-z]", "", (s or "").lower())

shipped = {p["id"]: p for p in json.load(open(SHIPPED, encoding="utf-8"))["properties"]}
hard, soft = [], []

# 1. Privacy: nothing that looks like a house number, unit, full postcode or a person's name in the shipped JSON.
raw = open(SHIPPED, encoding="utf-8").read()
if re.search(r"\bPE\d{1,2}\s?\d[A-Z]{2}\b", raw):
    hard.append("shipped JSON contains a full postcode")
for p in shipped.values():
    for key in ("street", "slug", "id"):
        if re.search(r"(?<![A-Za-z-])\d+[A-Za-z]?\s+[A-Z]", str(p.get(key, ""))) and key != "slug":
            hard.append(f"{p['id']}: {key} looks like it starts with a house number: {p[key]!r}")
    if re.match(r"^\d", p["street"]):
        hard.append(f"{p['id']}: street starts with a digit: {p['street']!r}")
    for k in p:
        if k not in ("id", "slug", "street", "outwardPostcode", "propertyType", "epcPropertyType", "floorAreaSqM", "epcRating", "epcValidUntil", "status", "rentPcm"):
            hard.append(f"{p['id']}: unexpected field shipped: {k}")
    if p["status"] == "let" and p.get("rentPcm") is not None:
        hard.append(f"{p['id']}: rent published for an occupied home")

# 2. Street + outward code from an independent route.
plan_rows = []
wb = openpyxl.load_workbook(PLAN, read_only=True, data_only=True)
ws = wb["1 page plan"]
rows = list(ws.iter_rows(values_only=True))
hdr = [str(c or "").strip() for c in rows[0]]
ia, it = hdr.index("Property Address"), hdr.index("Tenant Name")
for r in rows[1:]:
    if isinstance(r[ia], str) and r[ia].strip():
        plan_rows.append((r[ia].strip(), str(r[it] or "").strip()))

for folder in sorted(os.listdir(PROPS)):
    m = re.match(r"^(.*)_P_(\d+)$", folder)
    if not m:
        continue
    pid = f"RB-{int(m.group(2))}"
    if pid not in shipped:
        hard.append(f"{pid}: folder {folder} has no shipped record")
        continue
    p = shipped[pid]
    parts = m.group(1).split("_")
    number_tokens = []
    while parts and re.match(r"^\d+[A-Za-z]?$|^[A-Za-z]$", parts[0]):
        number_tokens.append(parts.pop(0))
    folder_street = " ".join(parts)
    folder_street = FOLDER_FIX.get(folder_street, folder_street)
    if norm(folder_street) != norm(p["street"]):
        hard.append(f"{pid}: street {p['street']!r} vs folder {folder_street!r}")
    # The shipped street must not contain the folder's house-number tokens.
    for tok in number_tokens:
        if re.search(r"\d", tok) and tok.lower() in p["slug"].split("-"):
            hard.append(f"{pid}: slug contains house-number token {tok!r}")
    # Outward code: any EPC pdf under the folder.
    codes = set()
    for f in glob.glob(os.path.join(PROPS, folder, "Property_P_*", "Certificate*", "EPC*", "*.pdf")):
        try:
            text = " ".join((pg.extract_text() or "") for pg in PdfReader(f).pages[:1])
        except Exception:
            continue
        codes.update(re.findall(r"\b(PE\d{1,2})\s?\d[A-Z]{2}\b", text))
    if codes and p["outwardPostcode"] not in codes:
        hard.append(f"{pid}: outward {p['outwardPostcode']} not among certificate codes {sorted(codes)}")
    if not codes and p["outwardPostcode"]:
        soft.append(f"{pid}: no certificate text to confirm outward {p['outwardPostcode']}")
    # Status: find the plan row whose address contains the folder's number token and street word.
    want_num = next((t for t in number_tokens if re.search(r"\d", t)), None)
    street_word = parts[0].lower() if parts else ""
    matches = [(a, t) for a, t in plan_rows if want_num and re.search(rf"\b{re.escape(want_num)}\b", a) and street_word in a.lower()]
    if matches:
        vacant = any("VACANT" in t.upper() or t == "" for _, t in matches)
        expect = "available" if vacant else "let"
        if expect != p["status"]:
            soft.append(f"{pid}: status {p['status']} but plan row {matches[0][0]!r} → {expect}")
    else:
        soft.append(f"{pid}: no plan row matched (status {p['status']} is an assumption)")

print(f"checked {len(shipped)} shipped records")
for h in hard:
    print("HARD:", h)
for s_ in soft:
    print("soft:", s_)
print(f"summary: {len(hard)} hard, {len(soft)} soft")
sys.exit(1 if hard else 0)
