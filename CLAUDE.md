# Heartland BioWorks — project notes

Static site in `docs/` (served by GitHub Pages, embedded in Wix iframes).
Shared navbar/footer are injected by `docs/assets/site.js`; shared styles in
`docs/assets/site.css`; per-page styles inline in each page's `<head>`.

## Style rules

- **Never put a dash/line before section header labels.** Section eyebrow
  labels (`.slabel`, `.hero-cred`, and any similar uppercase green label)
  must be plain text — do not add `::before` dash/bar pseudo-elements
  (e.g. `content:'';width:18px;height:2px;background:var(--green)`).
  These were removed site-wide on purpose; do not reintroduce them on new
  or existing sections.
- House style: "Biomanufacturing", never "biotech" in public copy.
- The BioDefense program is branded "Bio for National Security"
  (the federal document "National Biodefense Strategy" keeps its real name).
