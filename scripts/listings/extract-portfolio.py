"""
Builds the public-safe portfolio dataset for the website from Red Brick's own
records on D: (run on the office machine only; the output JSON is what gets
committed):

  python scripts/listings/extract-portfolio.py

Sources (read-only):
  - D:\1. RB Properties\<Address>_P_<id>\Property_P_<id>\Certificate\EPC Certificate\*.pdf
      → postcode, property type, floor area, EPC rating and validity (public GOV.UK register data)
  - D:\2. RB Business Docs\11 Trackers & Spreadsheets\ONE PAGE PLAN RED BRICK.xlsx  ('1 page plan')
      → whether the property is currently let or vacant, and rent for vacant homes only

Deliberately NOT extracted: house numbers/flat letters, owner or tenant names, contacts, rent of
occupied homes, tenancy dates, notes, licences, or anything else identifying. The output carries
street + postcode district only.
"""
import glob, json, os, re, sys, unicodedata
from datetime import datetime

import openpyxl
from pypdf import PdfReader

PROPS = r"D:\1. RB Properties"
PLAN = r"D:\2. RB Business Docs\11 Trackers & Spreadsheets\ONE PAGE PLAN RED BRICK.xlsx"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "lib", "listings", "portfolio.json")

TYPE_MAP = [
    (r"mid-terrace|end-terrace|enclosed end-terrace|enclosed mid-terrace|terrace", "terraced-house"),
    (r"semi-detached house|semi-detached bungalow", "semi-detached-house"),
    (r"detached house", "detached-house"),
    (r"bungalow", "bungalow"),
    (r"flat|maisonette|apartment", "apartment"),
]

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

LOCALITIES = r"West Town|Bretton|Walton|Werrington|Paston|Dogsthorpe|Fletton|Woodston|Stanground|Orton \w+|Hampton \w+|New England|Eastfield|Millfield|Netherton|Longthorpe|Ravensthorpe|Westwood|Gunthorpe|Parnwell|Eastgate|Newark"

def title_case_street(s):
    words = []
    for w in s.split(" "):
        if w.lower() in ("st", "st."):
            words.append("St")
        else:
            words.append("-".join(part[:1].upper() + part[1:].lower() for part in w.split("-")))
    out = " ".join(words)
    return re.sub(r"\bSt Pauls\b", "St Paul's", out)

def parse_epc(pdf):
    try:
        raw = "\n".join((p.extract_text() or "") for p in PdfReader(pdf).pages[:2])
    except Exception:
        return None
    raw = raw.replace("ﬁ", "fi").replace("ﬂ", "fl")
    flat = re.sub(r"\s+", " ", raw)  # whitespace-collapsed: every certificate layout matches the same way
    m_pc = re.search(r"\b(PE\d{1,2}) ?(\d[A-Z]{2})\b", flat)
    m_rating = (re.search(r"Energy rating ([A-G])(?=[ V]|$)", flat)
                or re.search(r"current energy rating is ([A-G])\b", flat))
    m_valid = re.search(r"Valid until:? (\d{1,2} \w+ \d{4})", flat)
    m_expired = re.search(r"expired on:? (\d{1,2} \w+ \d{4})", flat)
    m_type = (re.search(r"Property type ([A-Za-z\- ]+?) Total floor area", flat)
              or re.search(r"Dwelling type: ([A-Za-z\- ]+?) (?:Reference|Date)", flat))
    m_area = re.search(r"Total floor area:? (\d+) (?:square metres|m)", flat)
    m_cert = re.search(r"Certificate number:? ([\d-]+)", flat) or re.search(r"Reference number:? ([\d-]+)", flat)
    # Street from the certificate's own address block: the FIRST address line, number/flat prefix removed.
    street = None
    candidates = re.findall(r"Energy performance certificate \(EPC\) (.+?) PETERBOROUGH", flat, re.I) \
        or re.findall(r"Energy Performance Certificate (?:Page \d of \d+ )?(.+?),? PETERBOROUGH", flat, re.I)
    for seg in candidates:  # print-to-PDF copies carry a GOV.UK header before the real address block — try each
        seg = seg.strip(" ,")
        seg = re.split(r"Energy performance certificate \(EPC\)", seg, flags=re.I)[-1].strip(" ,")
        first = re.split(r",", seg)[0].strip()
        first = re.sub(r"\s+(?:" + LOCALITIES + r")\b.*$", "", first, flags=re.I)  # "15 ORME ROAD WEST TOWN" → street only
        first = re.sub(r"^(?:Flat ?\w+,? ?)?\d+ ?[A-Za-z]?,? ", "", first, flags=re.I).strip(" ,")
        if first and not re.search(r"\d", first) and len(first) < 40:
            street = title_case_street(first)
            break
    valid = None
    for m in (m_valid, m_expired):
        if m:
            try:
                valid = datetime.strptime(m.group(1), "%d %B %Y").date().isoformat()
                break
            except ValueError:
                pass
    return {
        "outward": m_pc.group(1) if m_pc else None,
        "rating": m_rating.group(1) if m_rating else None,
        "validUntil": valid,
        "propertyType": m_type.group(1).strip() if m_type else None,
        "floorArea": int(m_area.group(1)) if m_area else None,
        "certificate": m_cert.group(1) if m_cert else None,
        "street": street,
        "file": os.path.basename(pdf),
    }

def street_from_folder(name):
    # "1005_Lincoln_Road_P_183" -> "Lincoln Road", "33_A_Lincoln_Road_P_345" -> "Lincoln Road", "107a_Francis_Gardens_P_359"
    m = re.match(r"^(.*)_P_(\d+)$", name)
    addr, pid = m.group(1), int(m.group(2))
    parts = addr.split("_")
    while parts and re.match(r"^\d+[A-Za-z]?$|^[A-Za-z]$", parts[0]):
        parts.pop(0)
    return " ".join(parts), pid

def load_plan_status():
    wb = openpyxl.load_workbook(PLAN, read_only=True, data_only=True)
    ws = wb["1 page plan"]
    rows = list(ws.iter_rows(values_only=True))
    hdr = [str(c or "").strip() for c in rows[0]]
    i_addr = hdr.index("Property Address")
    i_tenant = hdr.index("Tenant Name")
    i_amount = hdr.index("Rent - Amount")
    i_period = hdr.index("Rent - Weekly/Monthly")
    status = {}
    for r in rows[1:]:
        addr = (r[i_addr] or "") if isinstance(r[i_addr], str) else ""
        if not addr.strip():
            continue
        tenant = str(r[i_tenant] or "").strip()
        vacant = "VACANT" in tenant.upper() or tenant == ""
        rent_pcm = None
        if vacant:
            amt = str(r[i_amount] or "")
            m = re.search(r"£\s?([\d,]+(?:\.\d+)?)", amt)
            if m:
                v = float(m.group(1).replace(",", ""))
                per = (str(r[i_period] or "") + " " + amt).lower()
                rent_pcm = round(v * 52 / 12) if "week" in per else round(v)
        key = re.sub(r"[^a-z0-9]", "", addr.lower())
        status[key] = {"vacant": vacant, "rentPcm": rent_pcm, "address": addr}
    return status

def match_status(status, folder_addr):
    key = re.sub(r"[^a-z0-9]", "", folder_addr.lower())
    for k, v in status.items():
        if k.startswith(key[:12]) or key.startswith(k[:12]):
            return v
    return None

def main():
    plan = load_plan_status()
    out = []
    for folder in sorted(os.listdir(PROPS)):
        if not re.match(r"^.+_P_\d+$", folder):
            continue
        street, pid = street_from_folder(folder)
        epcs = glob.glob(os.path.join(PROPS, folder, "Property_P_*", "Certificate", "EPC*", "*.pdf")) + \
               glob.glob(os.path.join(PROPS, folder, "Property_P_*", "Certificates", "EPC*", "*.pdf"))
        parsed = [p for p in (parse_epc(f) for f in epcs) if p]
        parsed.sort(key=lambda p: p["validUntil"] or "", reverse=True)
        epc = dict(parsed[0]) if parsed else {}
        for other in parsed[1:]:  # some copies of the same certificate extract poorly — fill gaps from the others
            for k, v in other.items():
                if epc.get(k) is None and v is not None and k != "file":
                    epc[k] = v
        folder_addr = folder.rsplit("_P_", 1)[0].replace("_", " ")
        st = match_status(plan, folder_addr) or {"vacant": None, "rentPcm": None}
        ptype = None
        for pat, key in TYPE_MAP:
            if epc.get("propertyType") and re.search(pat, epc["propertyType"], re.I):
                ptype = key
                break
        FOLDER_FIX = {"Belsize Ave": "Belsize Avenue", "Fulham": "Fulham Road", "Fellowes Garden": "Fellowes Gardens",
                      "Francis Garden": "Francis Gardens", "Sanford": "Sandford", "ST Pauls Road": "St Paul's Road",
                      "Eastfield": "Eastfield Road", "Elmfield": "Elmfield Road"}
        street = epc.get("street") or FOLDER_FIX.get(street, street)  # the certificate's spelling wins over folder names
        if street in FOLDER_FIX:
            street = FOLDER_FIX[street]
        status_value = "available" if st.get("vacant") else "let"
        out.append({
            "id": f"RB-{pid}",
            "slug": f"{slugify(street)}-{(epc.get('outward') or 'pe').lower()}-{pid}",
            "street": street,
            "outwardPostcode": epc.get("outward"),
            "propertyType": ptype,
            "epcPropertyType": epc.get("propertyType"),
            "floorAreaSqM": epc.get("floorArea"),
            "epcRating": epc.get("rating"),
            "epcValidUntil": epc.get("validUntil"),
            "epcCertificate": epc.get("certificate"),
            "epcSource": epc.get("file"),
            "status": status_value,
            "statusSource": "one-page-plan" if st.get("vacant") is not None else "assumed-let (no plan row) — confirm",
            "rentPcm": st.get("rentPcm"),
        })
    generated = datetime.now().date().isoformat()
    public_keys = ("id", "slug", "street", "outwardPostcode", "propertyType", "epcPropertyType", "floorAreaSqM", "epcRating", "epcValidUntil", "status", "rentPcm")
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"generatedOn": generated,
                   "note": "Public-safe portfolio facts only: street + postcode district, EPC register data, availability. No numbers, owners, tenants or contacts.",
                   "properties": [{k: p[k] for k in public_keys} for p in out]}, f, indent=2, ensure_ascii=False)
    audit = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio-audit.json")
    with open(audit, "w", encoding="utf-8") as f:
        json.dump({"generatedOn": generated, "properties": out}, f, indent=2, ensure_ascii=False)
    print(f"wrote {len(out)} properties -> {OUT} (audit: {audit})")
    for p in out:
        print(f"{p['id']:8} {p['street']:24} {str(p['outwardPostcode']):5} {str(p['propertyType']):20} {str(p['floorAreaSqM']):4} EPC {p['epcRating']} {p['epcValidUntil']} {p['status']:9} {p['rentPcm']}")

if __name__ == "__main__":
    main()
