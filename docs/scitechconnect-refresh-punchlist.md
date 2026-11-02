# SciTechCONNECT — Website Refresh Punch List

Source: `Website_Refresh_Notes_DS_GR.pdf` (DS/GR review).
Scope: live SciTechCONNECT site (theari.us / scitechconnect.us) — 7 pages + footer.
Legend: 🔴 critical · 🟡 should-do · 🟢 polish · 🔗 = needs link/embed wired up.

> Note on approach: most interactive pieces are owned by external systems —
> HubSpot (forms), Bizzabo (events), theari.us (LMS catalog), Outlook 365
> (booking). Keep those as native embeds; do not hardcode them into static HTML.

---

## 1. Home Page
- 🔴 **Sticky nav blocks content on scroll.** Nav bar overlaps/locks the page while scrolling. Consider converting to horizontal tabs, or make the nav non-blocking (reduce height / proper `position:sticky` with scroll offset).
- 🔴 🔗 **"Join the SciTechCONNECT Network" form** must be rebuilt on the new site — it currently still links to the OLD site. Re-embed the HubSpot form (see SciTechCONNECTIQ page for the embed).
- 🟡 **Rename the 4 journey tiles** Identify / Engage / Train / Mentor, as an ordered 01–04 journey:
  | # | Title | Category label | Description | Linked resource 🔗 |
  |---|-------|----------------|-------------|-----------------|
  | 01 | **Identify** | LEARN | Discover where your research, technology, and expertise align with DoW science and technology priorities. | Opportunities in S&T |
  | 02 | **Engage** | BRIDGE | Connect with the DoW S&T community through events, webinars, and conversations that open doors to collaboration. | Event |
  | 03 | **Train** | FUND | Build the knowledge to pursue DoW opportunities through practical, on-demand lessons on funding, research partnerships, and working with the department. | On-Demand Learning |
  | 04 | **Mentor** | SUBMIT | Move forward with one-on-one guidance from experienced coaches who help you refine your approach and plan your next steps. | Discovery Sessions |
- 🟡 **Replace the small blue eyebrow text** above each tile heading with the step **number** (01–04) to signal the ordered journey. If numbering isn't possible, remove the small blue text entirely.
- 🟢 **Remove the excess "SciTechCONNECTIQ" block** (duplicate/leftover section).

## 2. Opportunities in S&T Page
- 🟡 **Rename** "Your Path to Commercialization" → **"Your Path into the DoW"**.
- 🟡 **Remove parentheses** around "(The Agencies)" → **The Agencies**. Add a bit more vertical space between the section description and the three agencies below it.
- 🟡 🔗 **Reorder + link the three agencies** as:
  1. **Army Research Laboratory** → https://arl.devcom.army.mil/collaborate-with-us/opportunity/arl-baa/
  2. **Office of Naval Research** → https://www.onr.navy.mil/
  3. **Air Force Office of Scientific Research** → https://www.afrl.af.mil/AFOSR/
- 🟢 **Icon cleanup** — many icons are repeated for different meanings. Make the "Additional S&T Partners" sub-items all use the **same icon as the section heading**.
- 🟡 **Reorder "Additional S&T Partners"**: DoW HBCU/MI Program **first**, then DoW Office for Small Business Innovation, then DARPAConnect.
- 🟡 🔗 Under **DoW HBCU/MI Program → Current Opportunities**, list:
  - HBCU/MI Research Grants → https://basicresearch.defense.gov/Programs/HBCU-MI-Program/
  - FFRDC & UARC Programs → https://rt.cto.mil/ddre-rt/rtl-labs/ffrdc-uarc/
  - STEM Education & Workforce Development → https://dowstem.us/
  - Keep **"Contact the HBCU/MI Program"**.

## 3. Upcoming Events Page
- 🟡 **Empty-state language** when no webinars: *"No upcoming webinars at this point, please check back later…"*
- 🔗 **Past webinar** to list:
  - *Equipment & Instrumentation NOFO Webinar: Research and Education Program for HBCUs and TCUs* — Tue, Sept 29 · 12:00–1:00 PM EST
  - Watch: https://www.scitechconnect.us/viewdocument/fy-2027-dow-hbcutcu-research-equipment-funding-opportunity-webinar-recording?CommunityKey=2d79ffbd-4e21-4dfb-bd9f-01934f1c5339&tab=librarydocuments
- 🔴 🔗 **Jackson event tiles** — "Register" and "See Event Details" both link back to the Upcoming Events page instead of the registration site. Remove the registration links and keep a single **"See Full Event Details and Register →"**:
  - Link: https://events.bizzabo.com/SciTechConnectJackson
  - Label format: **In Person + Virtual** (capital V)
- 🟡 **"SciTechCONNECT in the Field"** — add placeholder: *"…please check back later…"*

## 4. Lessons on Demand Page
- 🟢 **Remove** the "On-Demand Learning" small blue title above the lessons.
- 🔗 **Check** the "Logging in to the catalog" link.
- **Spotlighted Curriculum** entries:
  - **OASW S&T 101** → https://learning.theari.us/products/oasw-st-101-introduction-to-the-office-of-the-assistant-secretary-of-war-for-science-and-technology
  - **Opportunities to Work with the DoW** — *"Delve into the diverse ways you can align your expertise, interests, and innovations with DoW priorities."* → https://learning.theari.us/products/opportunities-to-work-with-the-department-of-war-dow
  - **Securing DoW & Federal Research Grants** — *"Explore different pathways for securing funding through grants and Cooperative Research and Development Agreements (CRADAs)."* → (confirm link; PDF repeats OASW link)
- 🔴 🔗 **"See the full catalog"** link → https://learning.theari.us/dodscitechconnect-curriculum
- 🟡 **"Experience It On-Demand"** — needs populating with past event content.

## 5. SciTechCONNECTIQ Page
- 🟡 Revert to the **demo page originally created**, if possible.
  - Request access: https://share.hsforms.com/1PJ5ZgwN-SuyMLVcq1FPCKAcgl8t
  - Or embed the HubSpot form (portalId `20929421`, formId `3c9e5983-037e-4aec-8c2d-572ad453c228`, region `na1`) via `js.hsforms.net/forms/embed/v2.js`.

## 6. Live Coaching Page
- 🔗 **Discovery Sessions → Request a Session**: https://outlook.office365.us/book/SciTechConnectOfficeHours@theari.us/?ismsaljsauthenabled=true
- 🔗 **Continued One-on-One Coaching** — confirm link with Cole; should factor in office-hour availability of coaches.
- **Have a Quick Question?** → Email: scitechconnect@theari.us

## 7. Contact Us Page
- 🟡 **Remove** the duplicate "Contact Us" line in blue above the main title.
- Email is **scitechconnect@theari.us**.
- 🟢 **Remove** the line about "typical response time."
- 🔴 🔗 **Embed the same form** used on the old site: https://www.scitechconnect.us/contact-us (pull the language from there too).

## 8. Footer (site-wide)
- 🔴 🔗 **ARI LinkedIn link is broken** — fix it.

---

### Suggested execution order
1. 🔴 Fix broken/wrong links first: Join form, Jackson event registration, catalog link, Contact form, ARI LinkedIn.
2. 🔴 Home sticky-nav scroll bug.
3. 🟡 Content/rename/reorder items (journey tiles, agencies, partners, copy).
4. 🟢 Polish: icon consistency, remove stray small-blue titles, excess blocks.
