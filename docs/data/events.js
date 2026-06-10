/* ============================================================
   Heartland BioWorks — seed data: Upcoming Events.
   FALLBACK ONLY: live content is served from Supabase (see
   assets/content-store.js and supabase/README.md). These seeds render
   on the public pages only if Supabase is unreachable.

   NOTE FOR STAFF: these seed events are general examples — replace
   them with real dates and registration links from the dashboard.

   Fields: id, title, eventDate (YYYY-MM-DD), startTime, endTime,
   location, eventType (Workshop | Webinar | Deadline | Info Session |
   Partner Event), description, registrationUrl, hostOrganization,
   tags[], status (Draft | Published)
   ============================================================ */
window.HB_SEED_EVENTS = [
  {
    id: "event-biotrain-info-session",
    title: "BioTrain Information Session (Virtual)",
    eventDate: "2026-07-09",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    location: "Virtual — link provided on registration",
    eventType: "Info Session",
    description: "Learn how BioTrain's stackable credentials and statewide training pathways can move you into a biomanufacturing career — no four-year degree required. For job seekers and career changers.",
    registrationUrl: "https://www.heartlandbioworks.com/",
    hostOrganization: "Heartland BioWorks",
    tags: ["BioTrain", "Workforce"],
    status: "Published"
  },
  {
    id: "event-biocan-office-hours",
    title: "BioCAN Office Hours at 16 Tech",
    eventDate: "2026-07-22",
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    location: "16 Tech Innovation District, Indianapolis, IN",
    eventType: "Info Session",
    description: "Drop-in office hours for companies seeking Indiana CDMO capacity, lab resources, or funding navigation through the BioResource Coordination and Access Network.",
    registrationUrl: "https://www.heartlandbioworks.com/",
    hostOrganization: "Heartland BioWorks",
    tags: ["BioCAN", "CDMO"],
    status: "Published"
  },
  {
    id: "event-draft-career-fair",
    title: "Draft: Biomanufacturing Career Fair",
    eventDate: "2026-09-10",
    startTime: "",
    endTime: "",
    location: "TBD",
    eventType: "Partner Event",
    description: "Draft event — confirm date, venue, and partners before publishing.",
    registrationUrl: "",
    hostOrganization: "Heartland BioWorks",
    tags: ["Workforce"],
    status: "Draft"
  }
];
