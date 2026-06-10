/* ============================================================
   Heartland BioWorks — public content listing pages.
   Renders News & Media, Upcoming Events, and the Media Library from
   HBStore (never hardcoded): a page declares
       <div id="hb-content" data-content="news|events|media"></div>
   and this module renders FilterBar + ContentCards + EmptyState.

   Reusable pieces (component equivalents):
     filterBar()   -> "FilterBar"
     card*()       -> "ContentCard"
     emptyState()  -> "EmptyState"
   ============================================================ */
(function () {
  "use strict";
  var mount = document.getElementById("hb-content");
  if (!mount || !window.HBStore) return;
  var TYPE = mount.getAttribute("data-content");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  function isExternal(u) { return /^https?:\/\//i.test(u || ""); }
  function today() { var d = new Date(); return d.toISOString().slice(0, 10); }

  function emptyState(msg) {
    return '<div class="hbc-empty">' + esc(msg) + "</div>";
  }

  function filterBar(options, active) {
    return '<div class="hbc-filters" role="group" aria-label="Filter">' +
      options.map(function (o) {
        return '<button type="button" class="eco-chip' + (o === active ? " active" : "") +
          '" data-filter="' + esc(o) + '" aria-pressed="' + (o === active) + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
  }

  /* ---------- NEWS ---------- */
  var NEWS_TYPES = ["All", "Press Release", "Announcement", "Media Mention", "Update"];
  function newsCard(n) {
    var external = isExternal(n.externalUrl);
    var cta = external
      ? '<a class="hbc-cta" href="' + esc(n.externalUrl) + '" target="_blank" rel="noopener noreferrer">Read More <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg></a>'
      : '<button class="hbc-cta" type="button" data-open="' + esc(n.id) + '">Read More <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>';
    return '<article class="hbc-card">' +
      '<div class="hbc-meta"><span class="hbc-tag">' + esc(n.type) + '</span><span class="hbc-date">' + esc(fmtDate(n.publishDate)) + "</span></div>" +
      "<h3>" + esc(n.title) + "</h3>" +
      "<p>" + esc(n.excerpt) + "</p>" +
      (n.tags && n.tags.length ? '<div class="hbc-tags">' + n.tags.map(function (t) { return '<span class="hbc-minitag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      cta + "</article>";
  }
  function renderNews(activeType) {
    var items = CACHE
      .slice()
      .sort(function (a, b) { return (b.publishDate || "").localeCompare(a.publishDate || ""); })
      .filter(function (n) { return activeType === "All" || n.type === activeType; });
    return filterBar(NEWS_TYPES, activeType) +
      (items.length ? '<div class="hbc-grid">' + items.map(newsCard).join("") + "</div>"
                    : emptyState("No news in this category yet — check back soon."));
  }
  function newsModal(n) {
    return '<div class="hbc-modal-back" data-close>' +
      '<div class="hbc-modal" role="dialog" aria-modal="true" aria-label="' + esc(n.title) + '">' +
        '<button class="hbc-modal-x" type="button" data-close aria-label="Close">✕</button>' +
        '<div class="hbc-meta"><span class="hbc-tag">' + esc(n.type) + '</span><span class="hbc-date">' + esc(fmtDate(n.publishDate)) + "</span></div>" +
        "<h3>" + esc(n.title) + "</h3>" +
        (n.body || "").split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        (n.author ? '<p class="hbc-author">— ' + esc(n.author) + "</p>" : "") +
      "</div></div>";
  }

  /* ---------- EVENTS ---------- */
  var EVENT_TYPES = ["All", "Workshop", "Webinar", "Deadline", "Info Session", "Partner Event"];
  function eventCard(e) {
    var when = fmtDate(e.eventDate) + (e.startTime ? " · " + e.startTime + (e.endTime ? "–" + e.endTime : "") : "");
    var cta = e.registrationUrl
      ? '<a class="hbc-cta" href="' + esc(e.registrationUrl) + '"' + (isExternal(e.registrationUrl) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">Register / Learn More <svg viewBox=\"0 0 24 24\"><path d=\"M7 17L17 7M17 7H8M17 7v9\"/></svg></a>"
      : "";
    return '<article class="hbc-card">' +
      '<div class="hbc-meta"><span class="hbc-tag">' + esc(e.eventType) + '</span><span class="hbc-date">' + esc(when) + "</span></div>" +
      "<h3>" + esc(e.title) + "</h3>" +
      '<div class="hbc-loc">📍 ' + esc(e.location || "Location TBA") + "</div>" +
      "<p>" + esc(e.description) + "</p>" +
      (e.hostOrganization ? '<div class="hbc-host">Hosted by ' + esc(e.hostOrganization) + "</div>" : "") +
      cta + "</article>";
  }
  function renderEvents(activeType) {
    var t = today();
    var items = CACHE
      .filter(function (e) { return (e.eventDate || "") >= t; })             // upcoming only
      .sort(function (a, b) { return (a.eventDate || "").localeCompare(b.eventDate || ""); }) // soonest first
      .filter(function (e) { return activeType === "All" || e.eventType === activeType; });
    return filterBar(EVENT_TYPES, activeType) +
      (items.length ? '<div class="hbc-grid">' + items.map(eventCard).join("") + "</div>"
                    : emptyState("No upcoming events are currently listed. Check back soon."));
  }

  /* ---------- MEDIA LIBRARY ---------- */
  var MEDIA_TYPES = ["All", "Logo", "Photo", "Report", "One-Pager", "Brand Asset", "Video", "Other"];
  var TYPE_ICON = { Logo: "🅻", Photo: "🖼️", Report: "📄", "One-Pager": "📃", "Brand Asset": "🎨", Video: "🎬", Other: "📦" };
  function mediaCard(m) {
    var thumb = m.thumbnailUrl
      ? '<div class="hbc-thumb"><img src="' + esc(m.thumbnailUrl) + '" alt="" loading="lazy" /></div>'
      : '<div class="hbc-thumb hbc-thumb-ico" aria-hidden="true">' + (TYPE_ICON[m.assetType] || "📦") + "</div>";
    var cta = m.fileUrl
      ? '<a class="hbc-cta" href="' + esc(m.fileUrl) + '"' + (isExternal(m.fileUrl) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">Download / View <svg viewBox=\"0 0 24 24\"><path d=\"M12 5v11M6 12l6 6 6-6M5 21h14\"/></svg></a>"
      : "";
    return '<article class="hbc-card hbc-media">' + thumb +
      '<div class="hbc-meta"><span class="hbc-tag">' + esc(m.assetType) + "</span></div>" +
      "<h3>" + esc(m.title) + "</h3>" +
      "<p>" + esc(m.description) + "</p>" + cta + "</article>";
  }
  function renderMedia(activeType) {
    var items = CACHE
      .filter(function (m) { return activeType === "All" || m.assetType === activeType; });
    return filterBar(MEDIA_TYPES, activeType) +
      (items.length ? '<div class="hbc-grid">' + items.map(mediaCard).join("") + "</div>"
                    : emptyState("No assets in this category yet — check back soon."));
  }

  /* ---------- mount + interactions ---------- */
  var renderers = { news: renderNews, events: renderEvents, media: renderMedia };
  var active = "All";
  var CACHE = [];
  function paint() { mount.innerHTML = renderers[TYPE](active); }

  // Published content comes from the shared store (Supabase; falls back
  // to the /data seeds if the service is unreachable).
  mount.innerHTML = '<div class="hbc-empty" aria-busy="true">Loading…</div>';
  HBStore.getPublished(TYPE).then(function (items) {
    CACHE = items || [];
    paint();
  }).catch(function () {
    mount.innerHTML = '<div class="hbc-empty">Content is temporarily unavailable. Please refresh, or check back soon.</div>';
  });

  mount.addEventListener("click", function (ev) {
    var chip = ev.target.closest("[data-filter]");
    if (chip) { active = chip.getAttribute("data-filter"); paint(); return; }
    var open = ev.target.closest("[data-open]");
    if (open) {
      var id = open.getAttribute("data-open");
      var item = CACHE.filter(function (n) { return String(n.id) === String(id); })[0];
      if (!item) return;
      var wrap = document.createElement("div");
      wrap.innerHTML = newsModal(item);
      document.body.appendChild(wrap.firstChild);
      var back = document.querySelector(".hbc-modal-back");
      back.addEventListener("click", function (e) { if (e.target.closest("[data-close]") || e.target === back) back.remove(); });
      document.addEventListener("keydown", function onEsc(e) { if (e.key === "Escape") { back.remove(); document.removeEventListener("keydown", onEsc); } });
    }
  });
})();
