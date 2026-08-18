/* ============================================================
   Heartland BioWorks — staff dashboard (mounts into #hb-dashboard).
   Protected: HBAuth.requireAuth() redirects to login.html.
   All reads/writes go through HBStore — the same source the public
   pages read — so publishing here is what makes content public.

   Component equivalents:
     layout()       -> "DashboardLayout" (sidebar + main panel)
     table()        -> "DashboardTable"
     form()         -> "ContentForm" (validated create/edit)
   ============================================================ */
(async function () {
  "use strict";
  if (!window.HBAuth) return;
  var mount = document.getElementById("hb-dashboard");
  if (!mount || !window.HBStore) return;
  mount.innerHTML = '<div class="hbc-empty" aria-busy="true" style="margin:40px;">Checking sign-in…</div>';
  if (!(await HBAuth.requireAuth())) return;   // redirects to login.html
  var USER = await HBAuth.getUser();

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function slugify(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

  /* ---------- per-type config: columns + form fields ---------- */
  var CONFIG = {
    news: {
      label: "News & Media",
      dateField: "publishDate",
      columns: [["title", "Title"], ["type", "Type"], ["publishDate", "Date"], ["status", "Status"]],
      fields: [
        { k: "title", label: "Title", type: "text", required: true },
        { k: "type", label: "Type", type: "select", required: true, options: ["Press Release", "Announcement", "Media Mention", "Update"] },
        { k: "publishDate", label: "Publish date", type: "date", required: true },
        { k: "author", label: "Author", type: "text" },
        { k: "excerpt", label: "Excerpt (shown on cards)", type: "textarea", required: true },
        { k: "body", label: "Body (used when there is no external link)", type: "textarea", rows: 6 },
        { k: "externalUrl", label: "External URL (optional — card links out if set)", type: "url" },
        { k: "featuredImageUrl", label: "Featured image (news graphic, screenshot)", type: "file", bucket: "news-media", accept: "image/*", imgPreview: true, pathKey: "featuredImagePath" },
        { k: "featuredImagePath", type: "hidden" },
        { k: "attachmentUrl", label: "Attachment (press release PDF, report)", type: "file", bucket: "news-media", pathKey: "attachmentPath", nameKey: "attachmentName", typeKey: "attachmentType" },
        { k: "attachmentPath", type: "hidden" },
        { k: "attachmentName", type: "hidden" },
        { k: "attachmentType", type: "hidden" },
        { k: "tags", label: "Tags (comma-separated)", type: "tags" },
        { k: "status", label: "Status", type: "select", required: true, options: ["Draft", "Published"] }
      ]
    },
    events: {
      label: "Upcoming Events",
      dateField: "eventDate",
      columns: [["title", "Title"], ["eventType", "Type"], ["eventDate", "Date"], ["status", "Status"]],
      fields: [
        { k: "title", label: "Title", type: "text", required: true },
        { k: "eventDate", label: "Event date", type: "date", required: true },
        { k: "startTime", label: "Start time", type: "text", placeholder: "9:00 AM" },
        { k: "endTime", label: "End time", type: "text", placeholder: "12:00 PM" },
        { k: "location", label: "Location", type: "text", required: true },
        { k: "eventType", label: "Event type", type: "select", required: true, options: ["Workshop", "Webinar", "Deadline", "Info Session", "Partner Event"] },
        { k: "description", label: "Description", type: "textarea", required: true },
        { k: "registrationUrl", label: "Registration URL", type: "url" },
        { k: "hostOrganization", label: "Host organization", type: "text" },
        { k: "thumbnailUrl", label: "Event graphic / thumbnail (flyer image)", type: "file", bucket: "event-media", accept: "image/*", imgPreview: true, pathKey: "thumbnailPath" },
        { k: "thumbnailPath", type: "hidden" },
        { k: "attachmentUrl", label: "Attachment (agenda or flyer PDF)", type: "file", bucket: "event-media", pathKey: "attachmentPath", nameKey: "attachmentName", typeKey: "attachmentType" },
        { k: "attachmentPath", type: "hidden" },
        { k: "attachmentName", type: "hidden" },
        { k: "attachmentType", type: "hidden" },
        { k: "tags", label: "Tags (comma-separated)", type: "tags" },
        { k: "status", label: "Status", type: "select", required: true, options: ["Draft", "Published"] }
      ]
    },
    media: {
      label: "Media Library",
      dateField: "uploadDate",
      hint: "Use this section to upload and publish educational videos, webinar recordings, training content, reports, one-pagers, brand assets, and other resources for the public media library.",
      columns: [["title", "Title"], ["assetType", "Type"], ["uploadDate", "Date"], ["status", "Status"]],
      fields: [
        { k: "title", label: "Title", type: "text", required: true },
        { k: "assetType", label: "Asset type", type: "select", required: true, options: ["Educational Video", "Webinar Recording", "Training Resource", "Report", "One-Pager", "Brand Asset", "Photo", "Logo", "External Video", "Other"] },
        { k: "description", label: "Description", type: "textarea", required: true },
        { k: "fileUrl", label: "Primary media file (video, PDF, image — required to publish unless an embed URL is set)", type: "file", bucket: "media-library", pathKey: "filePath", nameKey: "fileName", typeKey: "fileType", sizeKey: "fileSize" },
        { k: "filePath", type: "hidden" },
        { k: "fileName", type: "hidden" },
        { k: "fileType", type: "hidden" },
        { k: "fileSize", type: "hidden" },
        { k: "embedUrl", label: "External video / embed URL (YouTube, Vimeo — alternative to uploading)", type: "url" },
        { k: "thumbnailUrl", label: "Thumbnail image", type: "file", bucket: "media-library", accept: "image/*", imgPreview: true, pathKey: "thumbnailPath" },
        { k: "thumbnailPath", type: "hidden" },
        { k: "duration", label: "Duration (videos — e.g. 12:45)", type: "text", placeholder: "12:45" },
        { k: "isVideo", label: "This is a video (shows a player on the public page)", type: "checkbox" },
        { k: "uploadDate", label: "Upload date", type: "date", required: true },
        { k: "tags", label: "Tags (comma-separated)", type: "tags" },
        { k: "status", label: "Status", type: "select", required: true, options: ["Draft", "Published"] }
      ]
    }
  };

  var SECTIONS = ["news", "events", "media", "contacts", "users"];
  var SECTION_LABELS = { contacts: "Contact Requests", users: "Users / Email List" };
  var initial = (window.location.hash || "").replace("#", "");
  var state = { section: SECTIONS.indexOf(initial) !== -1 ? initial : "news",
    editing: null, notice: null, items: [], loading: false,
    q: "", statusFilter: "All", sourceFilter: "All", contactOpen: null,
    selected: {} };

  /* ---------- DashboardLayout ---------- */
  function layout(inner) {
    var user = USER;
    return '<div class="hbd">' +
      '<aside class="hbd-side">' +
        '<div class="hbd-side-title">Content</div>' +
        SECTIONS.map(function (k) {
          var lbl = CONFIG[k] ? CONFIG[k].label : SECTION_LABELS[k];
          return '<button type="button" class="hbd-nav' + (state.section === k ? " active" : "") + '" data-section="' + k + '">' + lbl + "</button>";
        }).join("") +
        '<div class="hbd-side-foot">' +
          '<div class="hbd-user" title="' + esc(user ? user.email : "") + '">' + esc(user ? user.email : "") + "</div>" +
          '<button type="button" class="hbd-logout" data-logout>Log out</button>' +
        "</div>" +
      "</aside>" +
      '<main class="hbd-main">' + inner + "</main></div>";
  }

  /* ---------- DashboardTable ---------- */
  function table() {
    var cfg = CONFIG[state.section];
    var items = state.items
      .slice()
      .sort(function (a, b) { return (b[cfg.dateField] || "").localeCompare(a[cfg.dateField] || ""); });
    var head = "<tr>" + cfg.columns.map(function (c) { return "<th>" + esc(c[1]) + "</th>"; }).join("") + '<th class="hbd-actions-col">Actions</th></tr>';
    var rows = items.map(function (it) {
      return "<tr>" + cfg.columns.map(function (c) {
        var v = it[c[0]];
        if (c[0] === "status") {
          return '<td><span class="hbd-status ' + (v === "Published" ? "pub" : "draft") + '">' + esc(v) + "</span></td>";
        }
        return "<td>" + esc(v) + "</td>";
      }).join("") +
      '<td class="hbd-actions">' +
        '<button type="button" data-edit="' + esc(it.id) + '">Edit</button>' +
        '<button type="button" data-toggle="' + esc(it.id) + '">' + (it.status === "Published" ? "Unpublish" : "Publish") + "</button>" +
        '<button type="button" class="danger" data-delete="' + esc(it.id) + '">Delete</button>' +
      "</td></tr>";
    }).join("");
    return '<div class="hbd-head"><h2>' + esc(cfg.label) + '</h2>' +
      '<button type="button" class="hbd-create" data-create>+ Create New</button></div>' +
      (cfg.hint ? '<p class="hbd-sectionhint">' + esc(cfg.hint) + "</p>" : "") +
      (state.notice ? '<div class="hbd-notice ' + state.notice.kind + '">' + esc(state.notice.msg) + "</div>" : "") +
      (items.length
        ? '<div class="hbd-tablewrap"><table class="hbd-table"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>"
        : '<div class="hbc-empty">Nothing here yet — create the first item.</div>') +
      '<p class="hbd-hint">Public pages show <strong>Published</strong> items only. Changes save to Supabase and are visible to all visitors immediately.</p>';
  }

  /* ---------- ContentForm ---------- */
  function fieldHtml(f, val, it) {
    var req = f.required ? ' <span class="hbd-req" aria-hidden="true">*</span>' : "";
    var common = ' id="f-' + f.k + '" name="' + f.k + '"' + (f.required ? " required" : "") + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "");
    var control;
    if (f.type === "hidden") {
      return '<input type="hidden" name="' + f.k + '" value="' + esc(val) + '" />';
    }
    if (f.type === "checkbox") {
      return '<div class="hbd-field hbd-check"><label><input type="checkbox" name="' + f.k + '" id="f-' + f.k + '"' +
        (val ? " checked" : "") + ' /> ' + esc(f.label) + "</label>" +
        '<div class="hbd-field-err" data-err="' + f.k + '"></div></div>';
    }
    if (f.type === "file") {
      // Upload component: pick a file (uploads to Supabase Storage) OR paste a URL.
      var existingName = f.nameKey && it && it[f.nameKey] ? it[f.nameKey] : "";
      var preview = "";
      if (val && f.imgPreview) preview = '<img src="' + esc(val) + '" alt="Current file preview" />';
      else if (val) preview = '<span class="hbd-upfile">📎 ' + esc(existingName || val.split("/").pop()) + "</span>";
      return '<div class="hbd-field hbd-upfield"><label for="file-' + f.k + '">' + esc(f.label) + req + "</label>" +
        '<div class="hbd-upload" data-upload data-bucket="' + f.bucket + '" data-urlkey="' + f.k + '"' +
          (f.pathKey ? ' data-pathkey="' + f.pathKey + '"' : "") +
          (f.nameKey ? ' data-namekey="' + f.nameKey + '"' : "") +
          (f.typeKey ? ' data-typekey="' + f.typeKey + '"' : "") +
          (f.sizeKey ? ' data-sizekey="' + f.sizeKey + '"' : "") +
          (f.imgPreview ? ' data-imgpreview="1"' : "") + ">" +
          '<input type="file" id="file-' + f.k + '"' + (f.accept ? ' accept="' + f.accept + '"' : "") + " />" +
          '<span class="hbd-upstatus" data-upstatus role="status"></span>' +
        "</div>" +
        '<div class="hbd-uppreview" data-uppreview>' + preview + "</div>" +
        '<label class="hbd-orurl" for="f-' + f.k + '">…or paste a URL</label>' +
        '<input type="url"' + common + ' value="' + esc(val) + '" />' +
        '<div class="hbd-field-err" data-err="' + f.k + '"></div></div>';
    }
    if (f.type === "select") {
      control = "<select" + common + ">" + f.options.map(function (o) {
        return '<option value="' + esc(o) + '"' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>";
      }).join("") + "</select>";
    } else if (f.type === "textarea") {
      control = "<textarea" + common + ' rows="' + (f.rows || 3) + '">' + esc(val) + "</textarea>";
    } else {
      var t = f.type === "tags" ? "text" : f.type;
      var v = f.type === "tags" ? (Array.isArray(val) ? val.join(", ") : (val || "")) : (val || "");
      control = '<input type="' + t + '"' + common + ' value="' + esc(v) + '" />';
    }
    return '<div class="hbd-field"><label for="f-' + f.k + '">' + esc(f.label) + req + "</label>" + control +
      '<div class="hbd-field-err" data-err="' + f.k + '"></div></div>';
  }
  function form() {
    var cfg = CONFIG[state.section];
    var it = state.editing === "new" ? {} :
      state.items.filter(function (x) { return String(x.id) === String(state.editing); })[0] || {};
    return '<div class="hbd-head"><h2>' + (state.editing === "new" ? "Create" : "Edit") + " — " + esc(cfg.label) + "</h2>" +
      '<button type="button" class="hbd-back" data-back>← Back to list</button></div>' +
      '<form class="hbd-form" novalidate>' +
        '<p class="hbd-reqnote"><span class="hbd-req">*</span> Required — items can\'t be Published with required fields missing.</p>' +
        cfg.fields.map(function (f) { return fieldHtml(f, it[f.k], it); }).join("") +
        '<div class="hbd-form-actions"><button type="submit" class="hbd-create">Save</button>' +
        '<button type="button" class="hbd-back" data-back>Cancel</button></div>' +
      "</form>";
  }

  function validate(cfg, values) {
    var errs = {};
    cfg.fields.forEach(function (f) {
      if (f.required && !String(values[f.k] || "").trim()) errs[f.k] = "Required.";
      if ((f.type === "url") && values[f.k] && !/^(https?:\/\/|[\w.-]+\.html)/i.test(values[f.k])) errs[f.k] = "Enter a valid URL.";
    });
    // publishing gates: cannot publish without required fields
    if (values.status === "Published") {
      if (state.section === "media" && !String(values.fileUrl || "").trim() && !String(values.embedUrl || "").trim()) errs.fileUrl = "Upload a file or provide an external video/embed URL before publishing.";
      if (state.section === "news" && !String(values.externalUrl || "").trim() && !String(values.body || "").trim()) errs.body = "Provide a body or an external URL before publishing.";
    }
    return errs;
  }

  /* ---------- contacts + users (email list) ---------- */
  function fmtDT(iso) { return iso ? String(iso).slice(0, 10) : ""; }
  var CONTACT_CSV_HEADER = ["first_name", "last_name", "email", "job_title", "country", "phone", "organization_name", "organization_type", "interests", "message", "status", "created_at"];
  function contactCsvRow(c) { return [c.firstName, c.lastName, c.email, c.jobTitle, c.country, c.phone, c.organizationName, c.organizationType, (c.interests || []).join("; "), c.message, c.status, c.createdAt]; }
  var USER_CSV_HEADER = ["first_name", "last_name", "email", "organization", "job_title", "source", "consent_status", "created_at"];
  function userCsvRow(r) { return [r.firstName, r.lastName, r.email, r.organization, r.jobTitle, r.source, r.consentStatus, r.createdAt]; }
  function exportableUser(r) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email || "") && r.consentStatus !== "No Consent"; }
  function csvCell(v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function downloadCsv(filename, header, rows) {
    var csv = header.join(",") + "\n" + rows.map(function (r) { return r.map(csvCell).join(","); }).join("\n");
    try {
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { state.notice = { kind: "err", msg: "CSV download is not supported in this browser." }; paint(); }
  }
  function searchBox(placeholder) {
    return '<input type="search" class="hbd-search" data-search placeholder="' + placeholder + '" value="' + esc(state.q) + '" aria-label="Search" />';
  }
  function filterSelect(attr, label, options, current) {
    return '<label class="hbd-filter">' + label + ' <select data-' + attr + '>' +
      options.map(function (o) { return '<option' + (o === current ? " selected" : "") + ">" + o + "</option>"; }).join("") +
      "</select></label>";
  }

  function filteredContacts() {
    var q = state.q.toLowerCase();
    return state.items.filter(function (c) {
      if (state.statusFilter !== "All" && c.status !== state.statusFilter) return false;
      if (!q) return true;
      return (c.firstName + " " + c.lastName + " " + c.email + " " + c.organizationName + " " + c.jobTitle + " " + c.message)
        .toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
  }
  function selectedContacts() {
    return filteredContacts().filter(function (c) { return state.selected[c.id]; });
  }
  function contactsView() {
    if (state.contactOpen) return contactDetail();
    var rows = filteredContacts();
    var sel = selectedContacts();
    var allChecked = rows.length > 0 && sel.length === rows.length;
    return '<div class="hbd-head"><h2>Contact Requests</h2>' +
      '<button type="button" class="hbd-back" data-export-contacts>Export CSV</button></div>' +
      (state.notice ? '<div class="hbd-notice ' + state.notice.kind + '">' + esc(state.notice.msg) + "</div>" : "") +
      '<div class="hbd-toolbar">' + searchBox("Search contact requests…") +
        filterSelect("status-filter", "Status", ["All", "New", "Contacted", "Closed"], state.statusFilter) + "</div>" +
      (sel.length
        ? '<div class="hbd-bulkbar" role="toolbar" aria-label="Bulk actions">' +
            '<strong>' + sel.length + " selected</strong>" +
            '<button type="button" class="hbd-back" data-download-selected>Download CSV</button>' +
            '<button type="button" class="hbd-back hbd-bulk-danger" data-delete-selected>Delete</button>' +
            '<button type="button" class="hbd-back" data-clear-selected>Clear selection</button>' +
          "</div>"
        : "") +
      (rows.length
        ? '<div class="hbd-tablewrap"><table class="hbd-table"><thead><tr>' +
          '<th class="hbd-selcol"><input type="checkbox" data-select-all aria-label="Select all shown requests"' + (allChecked ? " checked" : "") + " /></th>" +
          "<th>Name</th><th>Email</th><th>Organization</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>" +
          rows.map(function (c) {
            var on = !!state.selected[c.id];
            return "<tr" + (on ? ' class="hbd-selrow"' : "") + '><td class="hbd-selcol"><input type="checkbox" data-select-contact="' + esc(c.id) + '" aria-label="Select ' + esc(c.firstName + " " + c.lastName) + '"' + (on ? " checked" : "") + " /></td>" +
              "<td>" + esc(c.firstName + " " + c.lastName) + "</td><td>" + esc(c.email) + "</td><td>" + esc(c.organizationName) + "</td>" +
              '<td><span class="hbd-status ' + (c.status === "New" ? "pub" : "draft") + '">' + esc(c.status) + "</span></td>" +
              "<td>" + esc(fmtDT(c.createdAt)) + "</td>" +
              '<td class="hbd-actions"><button type="button" data-open-contact="' + esc(c.id) + '">Open</button></td></tr>';
          }).join("") + "</tbody></table></div>"
        : '<div class="hbc-empty">No contact requests' + (state.q || state.statusFilter !== "All" ? " match your search." : " yet.") + "</div>");
  }
  function contactDetail() {
    var c = state.items.filter(function (x) { return String(x.id) === String(state.contactOpen); })[0];
    if (!c) { state.contactOpen = null; return contactsView(); }
    function row(l, v) { return v ? '<div class="hbd-crow"><span>' + l + "</span><div>" + esc(v) + "</div></div>" : ""; }
    return '<div class="hbd-head"><h2>' + esc(c.firstName + " " + c.lastName) + '</h2>' +
      '<button type="button" class="hbd-back" data-back-contacts>← All requests</button></div>' +
      (state.notice ? '<div class="hbd-notice ' + state.notice.kind + '">' + esc(state.notice.msg) + "</div>" : "") +
      '<div class="hbd-form" style="max-width:760px;">' +
        row("Email", c.email) + row("Job title", c.jobTitle) + row("Phone", c.phone) + row("Country", c.country) +
        row("Organization", c.organizationName + (c.organizationType ? " (" + c.organizationType + ")" : "")) +
        row("Interests", (c.interests || []).join(", ")) +
        row("Received", fmtDT(c.createdAt)) +
        '<div class="hbd-crow"><span>Message</span><div>' + esc(c.message) + "</div></div>" +
        '<div class="hbd-field" style="margin-top:18px;"><label for="c-status">Status</label>' +
          '<select id="c-status" name="contactStatus">' + ["New", "Contacted", "Closed"].map(function (o) {
            return '<option' + (o === c.status ? " selected" : "") + ">" + o + "</option>";
          }).join("") + "</select></div>" +
        '<div class="hbd-field"><label for="c-notes">Internal notes (never exported)</label>' +
          '<textarea id="c-notes" name="contactNotes" rows="4">' + esc(c.internalNotes) + "</textarea></div>" +
        '<div class="hbd-form-actions"><button type="button" class="hbd-create" data-save-contact="' + esc(c.id) + '">Save</button></div>' +
      "</div>";
  }

  function userRows() {
    // merged opt-in contact database: contact submissions + newsletter signups.
    // key encodes the origin table so bulk delete knows where each row lives.
    var rows = [];
    (state.items.contacts || []).forEach(function (c) {
      rows.push({ key: "c:" + c.id, kind: "contact", id: c.id,
        firstName: c.firstName, lastName: c.lastName, email: c.email, organization: c.organizationName,
        jobTitle: c.jobTitle, source: "Contact Form", consentStatus: c.consent ? "Active" : "No Consent", createdAt: c.createdAt });
    });
    (state.items.subscribers || []).forEach(function (u) {
      rows.push({ key: "s:" + u.id, kind: "subscriber", id: u.id,
        firstName: u.firstName, lastName: u.lastName, email: u.email, organization: u.organization,
        jobTitle: u.jobTitle, source: u.source || "Newsletter", consentStatus: u.consent ? (u.status || "Active") : "No Consent", createdAt: u.createdAt });
    });
    return rows.sort(function (a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
  }
  function filteredUsers() {
    var q = state.q.toLowerCase();
    return userRows().filter(function (r) {
      if (state.sourceFilter !== "All" && r.source !== state.sourceFilter) return false;
      if (state.statusFilter !== "All" && r.consentStatus !== state.statusFilter) return false;
      if (!q) return true;
      return ((r.firstName || "") + " " + (r.lastName || "") + " " + (r.email || "") + " " + (r.organization || "") + " " + (r.jobTitle || ""))
        .toLowerCase().indexOf(q) !== -1;
    });
  }
  function selectedUsers() {
    return filteredUsers().filter(function (r) { return state.selected[r.key]; });
  }
  function usersView() {
    var rows = filteredUsers();
    var sel = selectedUsers();
    var allChecked = rows.length > 0 && sel.length === rows.length;
    return '<div class="hbd-head"><h2>Users / Email List</h2>' +
      '<button type="button" class="hbd-create" data-export-users>Export Email List CSV</button></div>' +
      '<p class="hbd-sectionhint">The Heartland BioWorks contact database — contact form submissions and newsletter signups, with consent status. Exports include only valid, consenting email records and never include internal notes.</p>' +
      (state.notice ? '<div class="hbd-notice ' + state.notice.kind + '">' + esc(state.notice.msg) + "</div>" : "") +
      '<div class="hbd-toolbar">' + searchBox("Search name, email, organization…") +
        filterSelect("source-filter", "Source", ["All", "Contact Form", "Newsletter", "Event Signup", "Other"], state.sourceFilter) +
        filterSelect("status-filter", "Status", ["All", "Active", "Unsubscribed", "Bounced", "No Consent"], state.statusFilter) + "</div>" +
      (sel.length
        ? '<div class="hbd-bulkbar" role="toolbar" aria-label="Bulk actions">' +
            '<strong>' + sel.length + " selected</strong>" +
            '<button type="button" class="hbd-back" data-download-selected-users>Download CSV</button>' +
            '<button type="button" class="hbd-back hbd-bulk-danger" data-delete-selected-users>Delete</button>' +
            '<button type="button" class="hbd-back" data-clear-selected>Clear selection</button>' +
          "</div>"
        : "") +
      (rows.length
        ? '<div class="hbd-tablewrap"><table class="hbd-table"><thead><tr>' +
          '<th class="hbd-selcol"><input type="checkbox" data-select-all-users aria-label="Select all shown records"' + (allChecked ? " checked" : "") + " /></th>" +
          "<th>First Name</th><th>Last Name</th><th>Email</th><th>Organization</th><th>Job Title</th><th>Source</th><th>Consent Status</th><th>Created</th></tr></thead><tbody>" +
          rows.map(function (r) {
            var on = !!state.selected[r.key];
            return "<tr" + (on ? ' class="hbd-selrow"' : "") + '><td class="hbd-selcol"><input type="checkbox" data-select-user="' + esc(r.key) + '" aria-label="Select ' + esc((r.firstName || "") + " " + (r.lastName || "")) + '"' + (on ? " checked" : "") + " /></td>" +
              "<td>" + esc(r.firstName) + "</td><td>" + esc(r.lastName) + "</td><td>" + esc(r.email) + "</td><td>" + esc(r.organization) + "</td><td>" + esc(r.jobTitle) + "</td><td>" + esc(r.source) + "</td>" +
              '<td><span class="hbd-status ' + (r.consentStatus === "Active" ? "pub" : "draft") + '">' + esc(r.consentStatus) + "</span></td>" +
              "<td>" + esc(fmtDT(r.createdAt)) + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<div class="hbc-empty">No contacts match the current search/filters.</div>');
  }

  /* ---------- paint + async data ---------- */
  function paint() {
    var label = CONFIG[state.section] ? CONFIG[state.section].label : SECTION_LABELS[state.section];
    var inner;
    if (state.loading) inner = '<div class="hbc-empty" aria-busy="true">Loading ' + label + "…</div>";
    else if (state.section === "contacts") inner = contactsView();
    else if (state.section === "users") inner = usersView();
    else inner = state.editing ? form() : table();
    mount.innerHTML = layout(inner);
  }
  async function refresh() {
    state.loading = true; state.selected = {}; paint();
    try {
      if (state.section === "contacts") state.items = await HBStore.getContacts();
      else if (state.section === "users") {
        var pair = await Promise.all([HBStore.getContacts(), HBStore.getSubscribers()]);
        state.items = { contacts: pair[0], subscribers: pair[1] };
      } else state.items = await HBStore.getAll(state.section);
    } catch (e) {
      state.items = state.section === "users" ? { contacts: [], subscribers: [] } : [];
      state.notice = { kind: "err", msg: e.message || "Could not load content." };
    }
    state.loading = false; paint();
  }
  await refresh();

  mount.addEventListener("click", async function (ev) {
    var t = ev.target;
    var sec = t.closest("[data-section]");
    if (sec) {
      state.section = sec.getAttribute("data-section");
      state.editing = null; state.notice = null; state.contactOpen = null;
      state.q = ""; state.statusFilter = "All"; state.sourceFilter = "All";
      try { history.replaceState(null, "", "#" + state.section); } catch (e) {}
      await refresh(); return;
    }
    if (t.closest("[data-open-contact]")) { state.contactOpen = t.closest("[data-open-contact]").getAttribute("data-open-contact"); state.notice = null; paint(); return; }
    if (t.closest("[data-back-contacts]")) { state.contactOpen = null; state.notice = null; paint(); return; }
    if (t.closest("[data-save-contact]")) {
      var cid = t.closest("[data-save-contact]").getAttribute("data-save-contact");
      var st = mount.querySelector('[name="contactStatus"]').value;
      var notes = mount.querySelector('[name="contactNotes"]').value;
      t.closest("[data-save-contact]").disabled = true;
      try {
        var updated = await HBStore.updateContact(cid, { status: st, internalNotes: notes });
        state.items = state.items.map(function (x) { return String(x.id) === String(cid) ? updated : x; });
        state.notice = { kind: "ok", msg: "Contact request updated." };
      } catch (e2) { state.notice = { kind: "err", msg: e2.message || "Save failed." }; }
      paint(); return;
    }
    if (t.matches && t.matches("[data-select-contact]")) {
      var sid = t.getAttribute("data-select-contact");
      if (t.checked) state.selected[sid] = true; else delete state.selected[sid];
      paint(); return;
    }
    if (t.matches && t.matches("[data-select-all]")) {
      var on = t.checked;
      filteredContacts().forEach(function (c) {
        if (on) state.selected[c.id] = true; else delete state.selected[c.id];
      });
      paint(); return;
    }
    if (t.closest("[data-clear-selected]")) { state.selected = {}; paint(); return; }
    if (t.closest("[data-download-selected]")) {
      // internal notes intentionally excluded from exports
      var selRows = selectedContacts();
      if (!selRows.length) return;
      downloadCsv("heartland-bioworks-contact-requests-selected-" + new Date().toISOString().slice(0, 10) + ".csv",
        CONTACT_CSV_HEADER, selRows.map(contactCsvRow));
      return;
    }
    if (t.closest("[data-delete-selected]")) {
      var toDelete = selectedContacts().map(function (c) { return c.id; });
      if (!toDelete.length) return;
      if (!window.confirm("Delete " + toDelete.length + " contact request" + (toDelete.length === 1 ? "" : "s") + "? This cannot be undone.")) return;
      t.closest("[data-delete-selected]").disabled = true;
      try {
        var deleted = await HBStore.deleteContacts(toDelete);
        var gone = {};
        deleted.forEach(function (id) { gone[id] = true; delete state.selected[id]; });
        state.items = state.items.filter(function (x) { return !gone[x.id]; });
        state.notice = deleted.length === toDelete.length
          ? { kind: "ok", msg: deleted.length + " contact request" + (deleted.length === 1 ? "" : "s") + " deleted." }
          : { kind: "err", msg: deleted.length + " of " + toDelete.length + " deleted — removing the rest requires an admin account." };
      } catch (e3) { state.notice = { kind: "err", msg: e3.message || "Delete failed." }; }
      paint(); return;
    }
    if (t.closest("[data-export-contacts]")) {
      // internal notes intentionally excluded from exports
      var cs = filteredContacts();
      downloadCsv("heartland-bioworks-contact-requests-" + new Date().toISOString().slice(0, 10) + ".csv",
        CONTACT_CSV_HEADER, cs.map(contactCsvRow));
      return;
    }
    if (t.matches && t.matches("[data-select-user]")) {
      var uk = t.getAttribute("data-select-user");
      if (t.checked) state.selected[uk] = true; else delete state.selected[uk];
      paint(); return;
    }
    if (t.matches && t.matches("[data-select-all-users]")) {
      var uon = t.checked;
      filteredUsers().forEach(function (r) {
        if (uon) state.selected[r.key] = true; else delete state.selected[r.key];
      });
      paint(); return;
    }
    if (t.closest("[data-download-selected-users]")) {
      // same consent/validity rule as the full email-list export
      var selU = selectedUsers().filter(exportableUser);
      if (!selU.length) { state.notice = { kind: "err", msg: "None of the selected records are exportable (valid, consenting emails only)." }; paint(); return; }
      downloadCsv("heartland-bioworks-email-list-selected-" + new Date().toISOString().slice(0, 10) + ".csv",
        USER_CSV_HEADER, selU.map(userCsvRow));
      return;
    }
    if (t.closest("[data-delete-selected-users]")) {
      var selRows2 = selectedUsers();
      if (!selRows2.length) return;
      if (!window.confirm("Delete " + selRows2.length + " record" + (selRows2.length === 1 ? "" : "s") + "? Contact-form rows delete the underlying contact request too. This cannot be undone.")) return;
      t.closest("[data-delete-selected-users]").disabled = true;
      var cIds = selRows2.filter(function (r) { return r.kind === "contact"; }).map(function (r) { return r.id; });
      var sIds = selRows2.filter(function (r) { return r.kind === "subscriber"; }).map(function (r) { return r.id; });
      try {
        var dC = cIds.length ? await HBStore.deleteContacts(cIds) : [];
        var dS = sIds.length ? await HBStore.deleteSubscribers(sIds) : [];
        var goneC = {}, goneS = {};
        dC.forEach(function (id) { goneC[id] = true; delete state.selected["c:" + id]; });
        dS.forEach(function (id) { goneS[id] = true; delete state.selected["s:" + id]; });
        state.items.contacts = (state.items.contacts || []).filter(function (x) { return !goneC[x.id]; });
        state.items.subscribers = (state.items.subscribers || []).filter(function (x) { return !goneS[x.id]; });
        var total = dC.length + dS.length;
        state.notice = total === selRows2.length
          ? { kind: "ok", msg: total + " record" + (total === 1 ? "" : "s") + " deleted." }
          : { kind: "err", msg: total + " of " + selRows2.length + " deleted — contact-form records require an admin account to delete." };
      } catch (e4) { state.notice = { kind: "err", msg: e4.message || "Delete failed." }; }
      paint(); return;
    }
    if (t.closest("[data-export-users]")) {
      var us = filteredUsers().filter(exportableUser);
      downloadCsv("heartland-bioworks-email-list-" + new Date().toISOString().slice(0, 10) + ".csv",
        USER_CSV_HEADER, us.map(userCsvRow));
      return;
    }
    if (t.closest("[data-logout]")) { await HBAuth.logout(); window.location.replace("login.html"); return; }
    if (t.closest("[data-create]") && !t.closest("form")) { state.editing = "new"; state.notice = null; paint(); return; }
    if (t.closest("[data-back]")) { state.editing = null; paint(); return; }
    var btn = t.closest("[data-edit],[data-toggle],[data-delete]");
    if (!btn) return;
    if (btn.hasAttribute("data-edit")) { state.editing = btn.getAttribute("data-edit"); state.notice = null; paint(); return; }
    try {
      if (btn.hasAttribute("data-toggle")) {
        btn.disabled = true;
        var it = await HBStore.toggleStatus(state.section, btn.getAttribute("data-toggle"));
        state.notice = { kind: "ok", msg: '"' + it.title + '" is now ' + it.status + "." };
      } else if (btn.hasAttribute("data-delete")) {
        if (!window.confirm("Delete this item? This cannot be undone.")) return;
        btn.disabled = true;
        await HBStore.remove(state.section, btn.getAttribute("data-delete"));
        state.notice = { kind: "ok", msg: "Item deleted." };
      }
    } catch (e) {
      state.notice = { kind: "err", msg: e.message || "The change was not saved." };
    }
    await refresh();
  });

  // ---- file uploads (Supabase Storage via HBUploads) ----
  mount.addEventListener("change", async function (ev) {
    var input = ev.target;
    if (input.type !== "file" || !input.closest("[data-upload]")) return;
    var box = input.closest("[data-upload]");
    var formEl = input.closest("form");
    var status = box.querySelector("[data-upstatus]");
    var field = box.closest(".hbd-upfield");
    var preview = field.querySelector("[data-uppreview]");
    var file = input.files && input.files[0];
    if (!file) return;
    function setVal(key, v) {
      if (!key) return;
      var el = formEl.querySelector('[name="' + key + '"]');
      if (el) el.value = v;
    }
    var saveBtn = formEl.querySelector('button[type="submit"]');
    status.className = "hbd-upstatus busy"; status.textContent = "Uploading " + file.name + "…";
    if (saveBtn) saveBtn.disabled = true;
    input.disabled = true;
    try {
      var up = await HBUploads.uploadFile(file, box.getAttribute("data-bucket"));
      setVal(box.getAttribute("data-urlkey"), up.url);
      setVal(box.getAttribute("data-pathkey"), up.path);
      setVal(box.getAttribute("data-namekey"), up.fileName);
      setVal(box.getAttribute("data-typekey"), up.fileType);
      setVal(box.getAttribute("data-sizekey"), String(up.size));
      status.className = "hbd-upstatus ok"; status.textContent = "Uploaded ✓ (" + Math.round(up.size / 1024) + " KB)";
      if (box.hasAttribute("data-imgpreview") && /^image\//.test(up.fileType)) {
        preview.innerHTML = '<img src="' + up.url.replace(/"/g, "&quot;") + '" alt="Uploaded image preview" />';
      } else {
        preview.innerHTML = '<span class="hbd-upfile">📎 ' + esc(up.fileName) + (up.fileType ? " · " + esc(up.fileType) : "") + "</span>";
      }
      // uploading a video into the media library auto-marks it as a video
      if (/^video\//.test(up.fileType)) {
        var vid = formEl.querySelector('[name="isVideo"]');
        if (vid) vid.checked = true;
      }
    } catch (e) {
      status.className = "hbd-upstatus err"; status.textContent = e.message || "Upload failed — nothing was stored.";
    }
    input.disabled = false;
    if (saveBtn) saveBtn.disabled = false;
  });

  mount.addEventListener("input", function (ev) {
    var sb = ev.target.closest("[data-search]");
    if (!sb) return;
    state.q = sb.value;
    paint();
    var nb = mount.querySelector("[data-search]");
    if (nb) { nb.focus(); nb.setSelectionRange(nb.value.length, nb.value.length); }
  });
  mount.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.closest("[data-status-filter]")) { state.statusFilter = t.value; paint(); return; }
    if (t.closest("[data-source-filter]")) { state.sourceFilter = t.value; paint(); return; }
  });

  mount.addEventListener("submit", function (ev) {
    var f = ev.target.closest(".hbd-form");
    if (!f) return;
    ev.preventDefault();
    var cfg = CONFIG[state.section];
    var values = {};
    cfg.fields.forEach(function (fd) {
      var el = f.querySelector('[name="' + fd.k + '"]');
      if (fd.type === "checkbox") { values[fd.k] = !!(el && el.checked); return; }
      var v = el ? el.value : "";
      if (fd.k === "fileSize") { values[fd.k] = v ? parseInt(v, 10) || null : null; return; }
      values[fd.k] = fd.type === "tags"
        ? v.split(",").map(function (s) { return s.trim(); }).filter(Boolean)
        : v;
    });
    var errs = validate(cfg, values);
    f.querySelectorAll(".hbd-field-err").forEach(function (e) { e.textContent = ""; });
    f.querySelectorAll(".invalid").forEach(function (e) { e.classList.remove("invalid"); });
    var keys = Object.keys(errs);
    if (keys.length) {
      keys.forEach(function (k) {
        var e = f.querySelector('[data-err="' + k + '"]'); if (e) e.textContent = errs[k];
        var inp = f.querySelector('[name="' + k + '"]'); if (inp) inp.classList.add("invalid");
      });
      return;
    }
    if (state.section === "news") values.slug = values.slug || slugify(values.title);
    var submitBtn = f.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Saving…"; }
    (state.editing === "new"
      ? HBStore.create(state.section, values)
      : HBStore.update(state.section, state.editing, values)
    ).then(function (saved) {
      state.editing = null;
      state.notice = { kind: "ok", msg: '"' + saved.title + '" saved.' };
      return refresh();
    }).catch(function (e) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Save"; }
      state.notice = { kind: "err", msg: e.message || "Save failed — nothing was stored." };
      var n = document.createElement("div");
      n.className = "hbd-notice err";
      n.textContent = state.notice.msg;
      f.parentNode.insertBefore(n, f);
    });
  });
})();
