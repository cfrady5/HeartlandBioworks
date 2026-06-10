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
        { k: "featuredImage", label: "Featured image URL", type: "url" },
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
        { k: "tags", label: "Tags (comma-separated)", type: "tags" },
        { k: "status", label: "Status", type: "select", required: true, options: ["Draft", "Published"] }
      ]
    },
    media: {
      label: "Media Library",
      dateField: "uploadDate",
      columns: [["title", "Title"], ["assetType", "Type"], ["uploadDate", "Date"], ["status", "Status"]],
      fields: [
        { k: "title", label: "Title", type: "text", required: true },
        { k: "assetType", label: "Asset type", type: "select", required: true, options: ["Logo", "Photo", "Report", "One-Pager", "Brand Asset", "Video", "Other"] },
        { k: "description", label: "Description", type: "textarea", required: true },
        { k: "fileUrl", label: "File / link URL (required to publish)", type: "url" },
        { k: "thumbnailUrl", label: "Thumbnail URL", type: "url" },
        { k: "uploadDate", label: "Upload date", type: "date", required: true },
        { k: "tags", label: "Tags (comma-separated)", type: "tags" },
        { k: "status", label: "Status", type: "select", required: true, options: ["Draft", "Published"] }
      ]
    }
  };

  var state = { section: "news", editing: null, notice: null, items: [], loading: false };

  /* ---------- DashboardLayout ---------- */
  function layout(inner) {
    var user = USER;
    return '<div class="hbd">' +
      '<aside class="hbd-side">' +
        '<div class="hbd-side-title">Content</div>' +
        ["news", "events", "media"].map(function (k) {
          return '<button type="button" class="hbd-nav' + (state.section === k ? " active" : "") + '" data-section="' + k + '">' + CONFIG[k].label + "</button>";
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
      (state.notice ? '<div class="hbd-notice ' + state.notice.kind + '">' + esc(state.notice.msg) + "</div>" : "") +
      (items.length
        ? '<div class="hbd-tablewrap"><table class="hbd-table"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>"
        : '<div class="hbc-empty">Nothing here yet — create the first item.</div>') +
      '<p class="hbd-hint">Public pages show <strong>Published</strong> items only. Changes save to Supabase and are visible to all visitors immediately.</p>';
  }

  /* ---------- ContentForm ---------- */
  function fieldHtml(f, val) {
    var req = f.required ? ' <span class="hbd-req" aria-hidden="true">*</span>' : "";
    var common = ' id="f-' + f.k + '" name="' + f.k + '"' + (f.required ? " required" : "") + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "");
    var control;
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
        cfg.fields.map(function (f) { return fieldHtml(f, it[f.k]); }).join("") +
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
      if (state.section === "media" && !String(values.fileUrl || "").trim()) errs.fileUrl = "A file/link URL is required to publish.";
      if (state.section === "news" && !String(values.externalUrl || "").trim() && !String(values.body || "").trim()) errs.body = "Provide a body or an external URL before publishing.";
    }
    return errs;
  }

  /* ---------- paint + async data ---------- */
  function paint() {
    var inner = state.loading
      ? '<div class="hbc-empty" aria-busy="true">Loading ' + CONFIG[state.section].label + "…</div>"
      : (state.editing ? form() : table());
    mount.innerHTML = layout(inner);
  }
  async function refresh() {
    state.loading = true; paint();
    try {
      state.items = await HBStore.getAll(state.section);
    } catch (e) {
      state.items = [];
      state.notice = { kind: "err", msg: e.message || "Could not load content." };
    }
    state.loading = false; paint();
  }
  await refresh();

  mount.addEventListener("click", async function (ev) {
    var t = ev.target;
    var sec = t.closest("[data-section]");
    if (sec) { state.section = sec.getAttribute("data-section"); state.editing = null; state.notice = null; await refresh(); return; }
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

  mount.addEventListener("submit", function (ev) {
    var f = ev.target.closest(".hbd-form");
    if (!f) return;
    ev.preventDefault();
    var cfg = CONFIG[state.section];
    var values = {};
    cfg.fields.forEach(function (fd) {
      var el = f.querySelector('[name="' + fd.k + '"]');
      var v = el ? el.value : "";
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
