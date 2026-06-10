/* ============================================================
   Heartland BioWorks — seed data: News & Media.
   This file is the version-controlled baseline. Staff edits made
   in the dashboard are stored as overrides (see assets/content-store.js)
   and merged on top of these seeds. When a real backend is connected
   (Wix CMS collection, Supabase table, Firebase collection), replace
   the seed read in content-store.js with a fetch and delete this file.

   Fields: id, title, slug, type (Press Release | Announcement |
   Media Mention | Update), publishDate (YYYY-MM-DD), author, excerpt,
   body, featuredImage, externalUrl, tags[], status (Draft | Published)
   ============================================================ */
window.HB_SEED_NEWS = [
  {
    id: "news-eda-implementation-award",
    title: "Heartland BioWorks Awarded $51M in Federal Tech Hubs Implementation Funding",
    slug: "eda-implementation-award",
    type: "Press Release",
    publishDate: "2024-07-02",
    author: "Heartland BioWorks",
    excerpt: "The U.S. Economic Development Administration selected Heartland BioWorks as one of just 12 Tech Hubs nationally to receive implementation funding — a $51 million investment in Indiana's biomanufacturing future.",
    body: "The U.S. Economic Development Administration selected Heartland BioWorks as one of 12 Tech Hubs nationally to receive implementation funding under the federal Tech Hubs program.\n\nThe $51 million award funds the Hub's core projects — BioTrain workforce development, BioLaunch commercialization support, the BioCAN resource coordination network, and a planned 27,000 sq. ft. headquarters and hands-on training facility in the 16 Tech Innovation District in Indianapolis.",
    featuredImage: "",
    externalUrl: "https://www.eda.gov/funding/programs/regional-technology-and-innovation-hubs",
    tags: ["EDA", "Funding", "Tech Hubs"],
    status: "Published"
  },
  {
    id: "news-tech-hub-designation",
    title: "Heartland BioWorks Named One of 31 Federally Designated Regional Tech Hubs",
    slug: "tech-hub-designation",
    type: "Announcement",
    publishDate: "2023-10-23",
    author: "Heartland BioWorks",
    excerpt: "Indiana's biomanufacturing consortium, led by the Applied Research Institute, earned federal designation as a Regional Technology and Innovation Hub — one of 31 nationwide.",
    body: "The U.S. Economic Development Administration designated Heartland BioWorks as a Regional Technology and Innovation Hub — one of 31 designees selected from nearly 400 applications nationwide.\n\nThe designation recognizes Indiana's unique concentration of biomanufacturing assets: the nation's leading pharmaceutical export base, top-three life sciences exports, and the only state that manufactures all three COVID-19 vaccines.",
    featuredImage: "",
    externalUrl: "https://www.eda.gov/funding/programs/regional-technology-and-innovation-hubs",
    tags: ["EDA", "Designation", "Tech Hubs"],
    status: "Published"
  },
  {
    id: "news-hq-16tech",
    title: "Heartland BioWorks Plans 27,000 Sq. Ft. Headquarters and Training Facility at 16 Tech",
    slug: "hq-16tech",
    type: "Update",
    publishDate: "2024-09-15",
    author: "Heartland BioWorks",
    excerpt: "The planned headquarters in the 16 Tech Innovation District will anchor the Hub with hands-on biomanufacturing training space alongside industry and research partners.",
    body: "Heartland BioWorks plans a 27,000 sq. ft. headquarters and hands-on biomanufacturing training facility in the 16 Tech Innovation District in Indianapolis.\n\nThe facility will anchor the Hub's BioTrain workforce programming — putting classrooms, training labs, and employer partners in one place — and serve as the front door to Indiana's biomanufacturing ecosystem.",
    featuredImage: "",
    externalUrl: "",
    tags: ["16 Tech", "HQ", "BioTrain"],
    status: "Published"
  },
  {
    id: "news-draft-example",
    title: "Draft: Quarterly Ecosystem Update",
    slug: "quarterly-ecosystem-update",
    type: "Update",
    publishDate: "2026-06-01",
    author: "Heartland BioWorks",
    excerpt: "Working draft of the quarterly ecosystem update. Not yet published.",
    body: "Draft content — edit and publish from the dashboard.",
    featuredImage: "",
    externalUrl: "",
    tags: ["Internal"],
    status: "Draft"
  }
];
