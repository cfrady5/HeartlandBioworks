/* ============================================================
   Heartland BioWorks — seed data: Media Library.
   Baseline data; dashboard edits overlay these via content-store.js.
   Replace with a real backend read (Wix CMS / Supabase / Firebase)
   in content-store.js when available.

   Fields: id, title, assetType (Logo | Photo | Report | One-Pager |
   Brand Asset | Video | Other), description, fileUrl, thumbnailUrl,
   uploadDate (YYYY-MM-DD), tags[], status (Draft | Published)
   ============================================================ */
window.HB_SEED_MEDIA = [
  {
    id: "media-logo-primary",
    title: "Heartland BioWorks Logo (PNG)",
    assetType: "Logo",
    description: "Primary Heartland BioWorks logo on transparent background. For partner and press use.",
    fileUrl: "https://static.wixstatic.com/media/fcced6_4c68e46b8f1c4c089a46ca9a416c50a2~mv2.png",
    thumbnailUrl: "https://static.wixstatic.com/media/fcced6_4c68e46b8f1c4c089a46ca9a416c50a2~mv2.png",
    uploadDate: "2026-01-15",
    tags: ["Brand", "Logo"],
    status: "Published"
  },
  {
    id: "media-eda-program-overview",
    title: "EDA Tech Hubs Program Overview",
    assetType: "Report",
    description: "Official U.S. Economic Development Administration overview of the Regional Technology and Innovation Hubs program that designated and funded Heartland BioWorks.",
    fileUrl: "https://www.eda.gov/funding/programs/regional-technology-and-innovation-hubs",
    thumbnailUrl: "",
    uploadDate: "2026-01-15",
    tags: ["EDA", "Tech Hubs"],
    status: "Published"
  },
  {
    id: "media-ecosystem-map",
    title: "Interactive Indiana Ecosystem Map",
    assetType: "Other",
    description: "Explore Indiana's CDMO, lab, workforce, and innovation resources by capability area on the interactive ecosystem map.",
    fileUrl: "biocan.html#ecosystem-map",
    thumbnailUrl: "",
    uploadDate: "2026-06-10",
    tags: ["BioCAN", "Ecosystem"],
    status: "Published"
  },
  {
    id: "media-draft-brand-guide",
    title: "Draft: Brand Guidelines",
    assetType: "Brand Asset",
    description: "Brand guidelines document — upload final file before publishing.",
    fileUrl: "",
    thumbnailUrl: "",
    uploadDate: "2026-06-01",
    tags: ["Brand"],
    status: "Draft"
  }
];
