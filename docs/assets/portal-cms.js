/* ============================================================
   Portal — CMS views.
   News + Press Releases (Quill rich text, slugs, scheduling,
   SEO, preview, publish), Media Library (Supabase Storage),
   and a generic CRUD factory for Team / Board / Resources /
   FAQs / Site Content / Programs.
   All writes flow through RLS (role-checked in Postgres).
   ============================================================ */
(function () {
  "use strict";
  var P = window.PORTAL;

  function canPublish() { return ["admin", "editor"].indexOf(P.profile.role) !== -1; }
  function canEdit()    { return ["admin", "editor", "contributor"].indexOf(P.profile.role) !== -1; }
  function clean(html)  { return window.DOMPurify ? DOMPurify.sanitize(html || "") : (html || ""); }

  async function uploadTo(bucket, file) {
    var safe = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7) + "-" +
      file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
    var r = await P.sb.storage.from(bucket).upload(safe, file, { upsert: false });
    if (r.error) throw r.error;
    return P.sb.storage.from(bucket).getPublicUrl(safe).data.publicUrl;
  }

  /* ---------------------------------------------------------
     Rich-content editors (News + Press Releases)
     --------------------------------------------------------- */
  var RICH = {
    news: {
      table: "news_posts", label: "News", one: "article", hash: "#/content/news",
      titleField: "title", bucket: "news-media",
      listCols: function (r) {
        return "<td class='nm'>" + P.esc(r.title) + "<div class='mut'>/" + P.esc(r.slug) + "</div></td>" +
          "<td>" + P.statusChip(r.status) + (r.featured ? ' <span class="tagchip">Featured</span>' : "") + "</td>" +
          "<td class='mut'>" + P.esc(r.author_name || P.profileName(r.author_id) || "—") + "</td>" +
          "<td class='mut'>" + P.fmtDate(r.published_at || r.created_at) + "</td>";
      },
      listHead: "<th>Title</th><th>Status</th><th>Author</th><th>Date</th>",
      blank: { title: "", slug: "", excerpt: "", body_html: "", featured_image: "",
               status: "draft", featured: false, published_at: null, seo_title: "", seo_description: "" },
      fields: function (r) {
        return [
          ["excerpt", "Excerpt", "textarea", "Short summary shown on cards (1–2 sentences)."],
          ["featured_image", "Featured image", "image"],
          ["featured", "Featured article", "checkbox"],
          ["seo_title", "SEO title", "text"],
          ["seo_description", "SEO description", "textarea"],
        ];
      },
      beforeSave: function (rec) { rec.author_id = rec.author_id || P.user.id;
        rec.author_name = rec.author_name || (P.profile.first_name + " " + P.profile.last_name).trim(); },
      previewHtml: function (r) {
        return "<h1 style='font:800 1.9rem/1.2 var(--p-head);margin:0 0 6px'>" + P.esc(r.title) + "</h1>" +
          "<div style='color:var(--p-muted);font:600 .82rem var(--p-font);margin-bottom:18px'>" +
          P.esc(r.author_name || "") + " · " + P.fmtDate(r.published_at || new Date()) + "</div>" +
          (r.featured_image ? "<img src='" + P.esc(r.featured_image) + "' style='max-width:100%;border-radius:12px;margin-bottom:18px'>" : "") +
          "<div class='prev-body'>" + clean(r.body_html) + "</div>";
      },
    },
    press: {
      table: "press_releases", label: "Press Releases", one: "press release", hash: "#/content/press",
      titleField: "headline", bucket: "media-library",
      listCols: function (r) {
        return "<td class='nm'>" + P.esc(r.headline) + "<div class='mut'>/" + P.esc(r.slug) + "</div></td>" +
          "<td>" + P.statusChip(r.status) + "</td>" +
          "<td class='mut'>" + P.esc(r.dateline || "—") + "</td>" +
          "<td class='mut'>" + P.esc(r.release_date || "") + "</td>";
      },
      listHead: "<th>Headline</th><th>Status</th><th>Dateline</th><th>Release date</th>",
      blank: { headline: "", slug: "", release_date: "", dateline: "", summary: "", body_html: "",
               featured_image: "", pdf_url: "", external_url: "", media_contact: "",
               status: "draft", published_at: null, seo_title: "", seo_description: "" },
      fields: function () {
        return [
          ["release_date", "Release date", "date"],
          ["dateline", "Location / dateline", "text", "e.g. INDIANAPOLIS, Ind."],
          ["summary", "Summary", "textarea"],
          ["featured_image", "Featured image", "image"],
          ["pdf_url", "PDF attachment", "file"],
          ["external_url", "External URL", "text"],
          ["media_contact", "Media contact", "textarea", "Name, email, phone shown at the end of the release."],
          ["seo_title", "SEO title", "text"],
          ["seo_description", "SEO description", "textarea"],
        ];
      },
      beforeSave: function () {},
      previewHtml: function (r) {
        return "<div style='font:700 .72rem/1 var(--p-font);letter-spacing:.1em;color:var(--p-green2);text-transform:uppercase;margin-bottom:10px'>Press Release</div>" +
          "<h1 style='font:800 1.8rem/1.25 var(--p-head);margin:0 0 8px'>" + P.esc(r.headline) + "</h1>" +
          "<div style='color:var(--p-muted);font:600 .84rem var(--p-font);margin-bottom:18px'>" +
          P.esc(r.dateline || "") + (r.release_date ? " — " + P.esc(r.release_date) : "") + "</div>" +
          (r.summary ? "<p style='font:600 1rem/1.6 var(--p-font)'>" + P.esc(r.summary) + "</p>" : "") +
          "<div class='prev-body'>" + clean(r.body_html) + "</div>" +
          (r.media_contact ? "<hr><p style='white-space:pre-wrap;font:400 .85rem/1.6 var(--p-font);color:var(--p-muted)'>" + P.esc(r.media_contact) + "</p>" : "");
      },
    },
  };

  P.views.cms_news  = function (main, id) { id === undefined ? richList(main, RICH.news)  : richEdit(main, RICH.news, id); };
  P.views.cms_press = function (main, id) { id === undefined ? richList(main, RICH.press) : richEdit(main, RICH.press, id); };

  async function richList(main, cfg) {
    main.innerHTML = '<div class="pa-head"><h1>' + cfg.label + "</h1></div>" + P.skel(6);
    var r = await P.sb.from(cfg.table).select("*").order("created_at", { ascending: false });
    if (r.error) { main.innerHTML = P.errBox(r.error.message); return; }
    var rows = r.data || [];
    main.innerHTML =
      '<div class="pa-head"><div><h1>' + cfg.label + '</h1><div class="sub">Published entries appear automatically on the public website.</div></div>' +
      (canEdit() ? '<a class="pb pb-pri" href="' + cfg.hash + '/new">+ New ' + cfg.one + "</a>" : "") + "</div>" +
      (rows.length ?
        '<div class="ptab-wrap"><table class="ptab"><thead><tr>' + cfg.listHead + "<th></th></tr></thead><tbody>" +
        rows.map(function (row) {
          return '<tr class="rowlink" onclick="location.hash=\'' + cfg.hash + "/" + row.id + '\'">' + cfg.listCols(row) +
            '<td style="text-align:right"><span class="mut">edit →</span></td></tr>';
        }).join("") + "</tbody></table></div>"
      : P.emptyState("Nothing here yet." + (canEdit() ? " Create the first " + cfg.one + " to get started." : "")));
  }

  async function richEdit(main, cfg, id) {
    var isNew = id === "new";
    var rec = Object.assign({}, cfg.blank);
    if (!isNew) {
      var r = await P.sb.from(cfg.table).select("*").eq("id", id).maybeSingle();
      if (r.error || !r.data) { main.innerHTML = P.errBox("Not found."); return; }
      rec = r.data;
    }
    var dirty = false, slugTouched = !isNew;
    P.setUnsavedGuard(function () { return dirty; });

    var extraFields = cfg.fields(rec).map(function (f) {
      var key = f[0], label = f[1], kind = f[2], hint = f[3];
      var v = rec[key];
      var inner;
      if (kind === "textarea") inner = '<textarea rows="3" data-f="' + key + '">' + P.esc(v || "") + "</textarea>";
      else if (kind === "checkbox") inner = '<label style="display:flex;gap:8px;align-items:center;font:500 .88rem var(--p-font);text-transform:none;letter-spacing:0"><input type="checkbox" data-f="' + key + '"' + (v ? " checked" : "") + " style='width:16px;height:16px'> Yes</label>";
      else if (kind === "date") inner = '<input type="date" data-f="' + key + '" value="' + P.esc(v || "") + '">';
      else if (kind === "image" || kind === "file")
        inner = '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<input type="text" data-f="' + key + '" value="' + P.esc(v || "") + '" placeholder="URL — or upload →" style="flex:1;min-width:180px">' +
          '<label class="pb pb-sm pb-sec" style="margin:0">Upload<input type="file" data-up="' + key + '" ' +
          (kind === "image" ? 'accept="image/*"' : 'accept="application/pdf,image/*"') + ' hidden></label></div>' +
          (kind === "image" && v ? '<img src="' + P.esc(v) + '" style="max-height:90px;border-radius:8px;margin-top:8px">' : "");
      else inner = '<input type="text" data-f="' + key + '" value="' + P.esc(v || "") + '">';
      return '<div class="ed-field"><label>' + label + "</label>" + inner +
        (hint ? '<div class="mut" style="font:400 .74rem var(--p-font);color:var(--p-muted);margin-top:4px">' + hint + "</div>" : "") + "</div>";
    }).join("");

    main.innerHTML =
      '<div class="pa-head"><div><h1>' + (isNew ? "New " + cfg.one : "Edit " + cfg.one) + "</h1>" +
      '<div class="sub"><a href="' + cfg.hash + '" style="color:var(--p-green2);font-weight:600">← All ' + cfg.label.toLowerCase() + "</a></div></div>" +
      '<div class="ed-savebar">' +
        '<span id="ed-flag" class="ed-saved">Saved</span>' +
        '<button class="pb pb-sec" id="ed-preview">Preview</button>' +
        '<button class="pb pb-pri" id="ed-save">Save</button>' +
      "</div></div>" +

      '<div class="ed-grid"><div>' +
        '<div class="ed-field ed-title"><label>' + (cfg.titleField === "headline" ? "Headline" : "Title") + '</label>' +
        '<input type="text" id="ed-titlein" value="' + P.esc(rec[cfg.titleField] || "") + '"></div>' +
        '<div class="ed-field"><label>Slug</label><input type="text" id="ed-slug" value="' + P.esc(rec.slug || "") + '">' +
        '<div class="mut" style="font:400 .74rem var(--p-font);color:var(--p-muted);margin-top:4px">Public URL path. Auto-generated from the title; edit to override.</div></div>' +
        '<div class="ed-field"><label>Body</label><div id="ed-body"></div></div>' +
      "</div><div>" +
        '<div class="pcard"><h3>Publishing</h3>' +
          '<div class="ed-field"><label>Status</label><select id="ed-status">' +
            ["draft", "scheduled", "published", "archived"].map(function (s) {
              var dis = !canPublish() && s !== "draft" ? " disabled" : "";
              return '<option value="' + s + '"' + (rec.status === s ? " selected" : "") + dis + ">" + P.STATUS_LABEL[s] + "</option>";
            }).join("") + "</select>" +
            (!canPublish() ? '<div class="mut" style="font:400 .74rem var(--p-font);color:var(--p-muted);margin-top:4px">Your role can prepare drafts; an editor or admin publishes.</div>' : "") + "</div>" +
          '<div class="ed-field"><label>Publish date/time</label>' +
          '<input type="datetime-local" id="ed-pubat" value="' + (rec.published_at ? new Date(rec.published_at).toISOString().slice(0, 16) : "") + '" style="width:100%;padding:10px 12px;border:1.5px solid var(--p-border);border-radius:9px;font:400 .9rem var(--p-font)">' +
          '<div class="mut" style="font:400 .74rem var(--p-font);color:var(--p-muted);margin-top:4px">Future date + status “Scheduled” = goes live automatically at that time.</div></div>' +
        "</div>" +
        '<div class="pcard"><h3>Details</h3>' + extraFields + "</div>" +
      "</div></div>" +
      '<div id="prev-back" style="display:none;position:fixed;inset:0;background:rgba(8,24,40,.6);z-index:200;padding:30px" role="dialog" aria-label="Preview">' +
        '<div style="max-width:760px;margin:0 auto;background:#fff;border-radius:16px;max-height:88vh;overflow-y:auto;padding:38px" id="prev-body-wrap"></div></div>';

    // Quill
    var quill = new Quill("#ed-body", {
      theme: "snow",
      modules: { toolbar: [
        [{ header: [2, 3, false] }], ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote", "image"], ["clean"],
      ]},
    });
    quill.root.innerHTML = clean(rec.body_html || "");
    quill.on("text-change", markDirty);

    // Quill image → storage
    quill.getModule("toolbar").addHandler("image", function () {
      var inp = document.createElement("input");
      inp.type = "file"; inp.accept = "image/*";
      inp.onchange = async function () {
        if (!inp.files[0]) return;
        try {
          var url = await uploadTo(cfg.bucket, inp.files[0]);
          var range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
        } catch (e) { P.toast("Image upload failed: " + e.message, "err"); }
      };
      inp.click();
    });

    function markDirty() { dirty = true; flag(); }
    function flag() {
      var f = P.$("#ed-flag", main);
      f.className = dirty ? "ed-dirty" : "ed-saved";
      f.textContent = dirty ? "Unsaved changes" : "Saved";
    }
    main.querySelectorAll("input,select,textarea").forEach(function (el) {
      if (el.id === "ed-slug") return;
      el.addEventListener("input", markDirty);
    });
    P.$("#ed-titlein", main).addEventListener("input", function (e) {
      if (!slugTouched) P.$("#ed-slug", main).value = P.slugify(e.target.value);
    });
    P.$("#ed-slug", main).addEventListener("input", function () { slugTouched = true; markDirty(); });

    // uploads for image/file fields
    main.querySelectorAll("[data-up]").forEach(function (inp) {
      inp.addEventListener("change", async function () {
        if (!inp.files[0]) return;
        try {
          var url = await uploadTo(cfg.bucket, inp.files[0]);
          main.querySelector('[data-f="' + inp.dataset.up + '"]').value = url;
          markDirty(); P.toast("Uploaded");
        } catch (e) { P.toast("Upload failed: " + e.message, "err"); }
      });
    });

    function collect() {
      var out = Object.assign({}, rec);
      out[cfg.titleField] = P.$("#ed-titlein", main).value.trim();
      out.slug = P.slugify(P.$("#ed-slug", main).value) || P.slugify(out[cfg.titleField]);
      out.body_html = clean(quill.root.innerHTML);
      out.status = P.$("#ed-status", main).value;
      var pubat = P.$("#ed-pubat", main).value;
      out.published_at = pubat ? new Date(pubat).toISOString() : null;
      main.querySelectorAll("[data-f]").forEach(function (el) {
        out[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value;
      });
      if (out.release_date === "") out.release_date = null;
      return out;
    }

    P.$("#ed-preview", main).onclick = function () {
      var wrap = P.$("#prev-body-wrap", main);
      wrap.innerHTML = '<button class="pb pb-sec pb-sm" style="float:right" id="prev-x">Close ✕</button>' + cfg.previewHtml(collect());
      P.$("#prev-back", main).style.display = "block";
      P.$("#prev-x", main).onclick = function () { P.$("#prev-back", main).style.display = "none"; };
    };
    P.$("#prev-back", main).onclick = function (e) {
      if (e.target.id === "prev-back") e.target.style.display = "none";
    };

    P.$("#ed-save", main).onclick = async function () {
      var out = collect();
      if (!out[cfg.titleField]) return P.toast("A " + (cfg.titleField === "headline" ? "headline" : "title") + " is required.", "err");
      if (out.status === "published" && !out.published_at) out.published_at = new Date().toISOString();
      if (out.status === "scheduled" && !out.published_at) return P.toast("Scheduled posts need a publish date/time.", "err");

      // duplicate slug guard (live entries only)
      var dup = await P.sb.from(cfg.table).select("id").eq("slug", out.slug).neq("status", "archived");
      if ((dup.data || []).some(function (d) { return d.id !== rec.id; }))
        return P.toast("That slug is already in use — pick another.", "err");

      cfg.beforeSave(out);
      delete out.search;
      var res;
      if (isNew) { delete out.id; delete out.created_at; delete out.updated_at;
        res = await P.sb.from(cfg.table).insert(out).select().single(); }
      else res = await P.sb.from(cfg.table).update(out).eq("id", rec.id).select().single();
      if (res.error) return P.toast("Save failed: " + res.error.message, "err");

      P.logContent(isNew ? "created" : (out.status !== rec.status && out.status === "published" ? "published" : "updated"),
        cfg.table === "news_posts" ? "news" : "press_release", res.data.id, out[cfg.titleField]);
      dirty = false; flag();
      P.toast(isNew ? "Created" : "Saved");
      if (isNew) location.hash = cfg.hash + "/" + res.data.id;
      else { rec = res.data; }
    };
  }

  /* ---------------------------------------------------------
     Media Library
     --------------------------------------------------------- */
  P.views.cms_media = async function (main) {
    var BUCKET = "media-library";
    main.innerHTML = '<div class="pa-head"><h1>Media Library</h1></div>' + P.skel(4);
    var r = await P.sb.storage.from(BUCKET).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (r.error) { main.innerHTML = P.errBox(r.error.message); return; }
    var files = (r.data || []).filter(function (f) { return f.name !== ".emptyFolderPlaceholder"; });
    main.innerHTML =
      '<div class="pa-head"><div><h1>Media Library</h1><div class="sub">Images and PDFs stored in Supabase Storage (bucket: ' + BUCKET + ').</div></div>' +
      '<label class="pb pb-pri" style="margin:0">Upload file<input type="file" id="mu" accept="image/jpeg,image/png,image/webp,application/pdf" hidden></label></div>' +
      (files.length ? '<div class="media-grid">' + files.map(function (f) {
        var url = P.sb.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl;
        var isImg = /\.(jpe?g|png|webp|gif)$/i.test(f.name);
        var kb = f.metadata && f.metadata.size ? Math.round(f.metadata.size / 1024) + " KB" : "";
        return '<div class="media-item"><div class="th">' + (isImg ? '<img src="' + P.esc(url) + '" loading="lazy" alt="">' : "📄") + "</div>" +
          '<div class="mi"><div class="fn" title="' + P.esc(f.name) + '">' + P.esc(f.name) + '</div>' +
          '<div class="mut">' + P.fmtDate(f.created_at) + (kb ? " · " + kb : "") + "</div></div>" +
          '<div class="acts"><button data-copy="' + P.esc(url) + '">Copy URL</button>' +
          (canPublish() ? '<button data-del="' + P.esc(f.name) + '">Delete</button>' : "") + "</div></div>";
      }).join("") + "</div>"
      : P.emptyState("No media yet — upload images or PDFs to reuse across News and Press Releases."));

    P.$("#mu", main).onchange = async function (e) {
      if (!e.target.files[0]) return;
      try { await uploadTo(BUCKET, e.target.files[0]); P.toast("Uploaded"); P.views.cms_media(main); }
      catch (err) { P.toast("Upload failed: " + err.message, "err"); }
    };
    main.querySelectorAll("[data-copy]").forEach(function (b) {
      b.onclick = function () { navigator.clipboard.writeText(b.dataset.copy).then(function () { P.toast("URL copied"); }); };
    });
    main.querySelectorAll("[data-del]").forEach(function (b) {
      b.onclick = async function () {
        if (!confirm("Delete " + b.dataset.del + "? Pages using it will lose the file.")) return;
        var r2 = await P.sb.storage.from(BUCKET).remove([b.dataset.del]);
        if (r2.error) return P.toast(r2.error.message, "err");
        P.toast("Deleted"); P.views.cms_media(main);
      };
    });
  };

  /* ---------------------------------------------------------
     Generic CRUD factory (Team, Board, Resources, FAQs, Site)
     --------------------------------------------------------- */
  function makeCrud(cfg) {
    return async function view(main) {
      main.innerHTML = '<div class="pa-head"><h1>' + cfg.label + "</h1></div>" + P.skel(5);
      var q = P.sb.from(cfg.table).select("*");
      (cfg.order || ["display_order"]).forEach(function (o) { q = q.order(o); });
      var r = await q;
      if (r.error) { main.innerHTML = P.errBox(r.error.message); return; }
      var rows = r.data || [];

      main.innerHTML =
        '<div class="pa-head"><div><h1>' + cfg.label + '</h1><div class="sub">' + (cfg.sub || "") + "</div></div>" +
        (canEdit() ? '<button class="pb pb-pri" id="g-new">+ Add</button>' : "") + "</div>" +
        '<div id="g-form"></div>' +
        (rows.length ?
          '<div class="ptab-wrap"><table class="ptab"><thead><tr>' +
          cfg.cols.map(function (c) { return "<th>" + c.label + "</th>"; }).join("") +
          "<th></th></tr></thead><tbody>" +
          rows.map(function (row, i) {
            return "<tr>" + cfg.cols.map(function (c) {
              return "<td" + (c.mut ? " class='mut'" : "") + ">" + (c.render ? c.render(row) : P.esc(String(row[c.key] == null ? "" : row[c.key]))) + "</td>";
            }).join("") +
            '<td style="text-align:right;white-space:nowrap">' +
            (cfg.orderable && canEdit() ?
              '<button class="pb pb-sm pb-sec" data-mv="-1" data-i="' + i + '"' + (i === 0 ? " disabled" : "") + '>↑</button> ' +
              '<button class="pb pb-sm pb-sec" data-mv="1" data-i="' + i + '"' + (i === rows.length - 1 ? " disabled" : "") + ">↓</button> " : "") +
            (canEdit() ? '<button class="pb pb-sm pb-sec" data-edit="' + row.id + '">Edit</button> ' : "") +
            (canPublish() ? '<button class="pb pb-sm pb-danger" data-del="' + row.id + '">Delete</button>' : "") +
            "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : P.emptyState(cfg.empty || "Nothing here yet."));

      function openForm(row) {
        var isNew = !row;
        row = row || cfg.blank();
        P.$("#g-form", main).innerHTML =
          '<div class="pcard"><h3>' + (isNew ? "Add" : "Edit") + "</h3>" +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">' +
          cfg.fields.map(function (f) {
            var v = row[f.key];
            var inner;
            if (f.kind === "textarea") inner = '<textarea rows="' + (f.rows || 3) + '" data-g="' + f.key + '">' + P.esc(v || "") + "</textarea>";
            else if (f.kind === "checkbox") inner = '<label style="display:flex;gap:8px;align-items:center;font:500 .88rem var(--p-font);text-transform:none;letter-spacing:0"><input type="checkbox" data-g="' + f.key + '"' + (v ? " checked" : "") + ' style="width:16px;height:16px"> Yes</label>';
            else if (f.kind === "select") inner = '<select data-g="' + f.key + '">' + f.options.map(function (o) {
              return '<option value="' + P.esc(o[0]) + '"' + (v === o[0] ? " selected" : "") + ">" + P.esc(o[1]) + "</option>"; }).join("") + "</select>";
            else if (f.kind === "number") inner = '<input type="number" data-g="' + f.key + '" value="' + P.esc(v == null ? "" : v) + '">';
            else inner = '<input type="text" data-g="' + f.key + '" value="' + P.esc(v || "") + '">';
            return '<div class="ed-field" style="margin:0' + (f.wide ? ";grid-column:1/-1" : "") + '"><label>' + f.label + "</label>" + inner + "</div>";
          }).join("") + "</div>" +
          '<div style="display:flex;gap:8px;margin-top:14px">' +
          '<button class="pb pb-pri" id="g-save">Save</button>' +
          '<button class="pb pb-sec" id="g-cancel">Cancel</button></div></div>';
        P.$("#g-cancel", main).onclick = function () { P.$("#g-form", main).innerHTML = ""; };
        P.$("#g-save", main).onclick = async function () {
          var out = Object.assign({}, row);
          main.querySelectorAll("[data-g]").forEach(function (el) {
            out[el.dataset.g] = el.type === "checkbox" ? el.checked :
              el.type === "number" ? (el.value === "" ? 0 : Number(el.value)) : el.value;
          });
          if (cfg.required && !out[cfg.required]) return P.toast("“" + cfg.required + "” is required.", "err");
          var res;
          if (isNew) { delete out.id; delete out.created_at; delete out.updated_at;
            res = await P.sb.from(cfg.table).insert(out).select().single(); }
          else res = await P.sb.from(cfg.table).update(out).eq("id", row.id).select().single();
          if (res.error) return P.toast("Save failed: " + res.error.message, "err");
          P.logContent(isNew ? "created" : "updated", cfg.logType, res.data.id, out[cfg.required] || "");
          P.toast("Saved"); view(main);
        };
      }

      var nb = P.$("#g-new", main);
      if (nb) nb.onclick = function () { openForm(null); };
      main.querySelectorAll("[data-edit]").forEach(function (b) {
        b.onclick = function () { openForm(rows.find(function (x) { return x.id === b.dataset.edit; })); window.scrollTo(0, 0); };
      });
      main.querySelectorAll("[data-del]").forEach(function (b) {
        b.onclick = async function () {
          if (!confirm("Delete this entry? This can’t be undone.")) return;
          var row = rows.find(function (x) { return x.id === b.dataset.del; });
          var r2 = await P.sb.from(cfg.table).delete().eq("id", b.dataset.del);
          if (r2.error) return P.toast(r2.error.message, "err");
          P.logContent("deleted", cfg.logType, b.dataset.del, row && (row[cfg.required] || ""));
          P.toast("Deleted"); view(main);
        };
      });
      main.querySelectorAll("[data-mv]").forEach(function (b) {
        b.onclick = async function () {
          var i = Number(b.dataset.i), j = i + Number(b.dataset.mv);
          var a = rows[i], c = rows[j];
          await P.sb.from(cfg.table).update({ display_order: j }).eq("id", a.id);
          await P.sb.from(cfg.table).update({ display_order: i }).eq("id", c.id);
          view(main);
        };
      });
    };
  }

  var onOff = function (v) { return v ? '<span class="chip st-resolved">Yes</span>' : '<span class="chip st-archived">No</span>'; };

  P.views.cms_team = makeCrud({
    table: "team_members", label: "Team", logType: "team_member",
    sub: "Meet the Team page — edits appear on the public site immediately.",
    required: "name", orderable: true, order: ["display_order", "created_at"],
    cols: [
      { key: "name", label: "Name" }, { key: "title", label: "Title", mut: true },
      { key: "email", label: "Email", mut: true },
      { key: "active", label: "Active", render: function (r) { return onOff(r.active); } },
    ],
    blank: function () { return { name: "", title: "", organization: "", bio_short: "", bio_full: "",
      headshot_url: "", linkedin_url: "", email: "", display_order: 99, active: true }; },
    fields: [
      { key: "name", label: "Name" }, { key: "title", label: "Title" },
      { key: "organization", label: "Organization" }, { key: "email", label: "Email" },
      { key: "linkedin_url", label: "LinkedIn URL" }, { key: "headshot_url", label: "Headshot URL (upload via Media Library)" },
      { key: "bio_short", label: "Short bio", kind: "textarea", wide: true },
      { key: "bio_full", label: "Full bio (blank paragraphs separate)", kind: "textarea", rows: 6, wide: true },
      { key: "active", label: "Active", kind: "checkbox" },
    ],
    empty: "No team members yet.",
  });

  P.views.cms_board = makeCrud({
    table: "board_members", label: "Executive Board", logType: "board_member",
    sub: "Board roster on the Meet the Team page. No biographies required.",
    required: "name", orderable: true, order: ["display_order", "created_at"],
    cols: [
      { key: "name", label: "Name" }, { key: "title", label: "Title", mut: true },
      { key: "organization", label: "Organization", mut: true },
      { key: "board_type", label: "Board", mut: true },
      { key: "active", label: "Active", render: function (r) { return onOff(r.active); } },
    ],
    blank: function () { return { name: "", title: "", organization: "", board_type: "executive", display_order: 99, active: true }; },
    fields: [
      { key: "name", label: "Name" }, { key: "title", label: "Title" },
      { key: "organization", label: "Organization" },
      { key: "board_type", label: "Board", kind: "select",
        options: [["executive", "Executive Board"], ["scientific", "Scientific Advisory"], ["community", "Community Impact Advisory"]] },
      { key: "active", label: "Active", kind: "checkbox" },
    ],
    empty: "No board members yet — add the roster when it’s finalized.",
  });

  P.views.cms_resources = makeCrud({
    table: "resources", label: "Resources", logType: "resource",
    sub: "Downloadable and linked resources shown on the public site.",
    required: "title", orderable: true, order: ["display_order", "created_at"],
    cols: [
      { key: "title", label: "Title" }, { key: "category", label: "Category", mut: true },
      { key: "program", label: "Program", mut: true },
      { key: "published", label: "Published", render: function (r) { return onOff(r.published); } },
    ],
    blank: function () { return { title: "", description: "", category: "", url: "", file_url: "",
      program: "", featured: false, display_order: 99, published: false }; },
    fields: [
      { key: "title", label: "Title" }, { key: "category", label: "Category" },
      { key: "program", label: "Program", kind: "select",
        options: [["", "—"], ["biotrain", "BioTrain"], ["biolaunch", "BioLaunch"], ["bionatsec", "Bio for National Security"]] },
      { key: "url", label: "Link URL" }, { key: "file_url", label: "File URL (upload via Media Library)" },
      { key: "description", label: "Description", kind: "textarea", wide: true },
      { key: "featured", label: "Featured", kind: "checkbox" },
      { key: "published", label: "Published", kind: "checkbox" },
    ],
    empty: "No resources yet.",
  });

  P.views.cms_faqs = makeCrud({
    table: "faqs", label: "FAQs", logType: "faq",
    sub: "Questions grouped by page. Published FAQs render on the public site.",
    required: "question", orderable: true, order: ["page", "display_order"],
    cols: [
      { key: "question", label: "Question" }, { key: "page", label: "Page", mut: true },
      { key: "published", label: "Published", render: function (r) { return onOff(r.published); } },
    ],
    blank: function () { return { question: "", answer_html: "", page: "faqs", display_order: 99, published: false }; },
    fields: [
      { key: "question", label: "Question", wide: true },
      { key: "answer_html", label: "Answer", kind: "textarea", rows: 4, wide: true },
      { key: "page", label: "Page", kind: "select",
        options: [["faqs", "FAQs page"], ["biotrain", "BioTrain"], ["biolaunch", "BioLaunch"], ["bionatsec", "Bio for National Security"], ["home", "Home"]] },
      { key: "published", label: "Published", kind: "checkbox" },
    ],
    empty: "No FAQs yet.",
  });

  P.views.cms_site = makeCrud({
    table: "site_content", label: "Site Content", logType: "site_content",
    sub: "Small editable text blocks used across the site (use sparingly — structured content has its own sections).",
    required: "key", order: ["page", "key"],
    cols: [
      { key: "key", label: "Key" }, { key: "label", label: "Label", mut: true },
      { key: "page", label: "Page", mut: true },
      { key: "content", label: "Content", render: function (r) { return P.esc((r.content || "").slice(0, 60)) + ((r.content || "").length > 60 ? "…" : ""); }, mut: true },
    ],
    blank: function () { return { key: "", page: "", section: "", label: "", content: "", content_type: "text" }; },
    fields: [
      { key: "key", label: "Key (e.g. home.hero.title)" }, { key: "label", label: "Label" },
      { key: "page", label: "Page" }, { key: "section", label: "Section" },
      { key: "content_type", label: "Type", kind: "select", options: [["text", "Text"], ["html", "HTML"], ["url", "URL"]] },
      { key: "content", label: "Content", kind: "textarea", rows: 4, wide: true },
    ],
    empty: "No content blocks yet.",
  });

  /* ---------------------------------------------------------
     Programs (program_pages + sections)
     --------------------------------------------------------- */
  P.views.cms_programs = async function (main, id) {
    if (id) return programEdit(main, id);
    main.innerHTML = '<div class="pa-head"><h1>Programs</h1></div>' + P.skel(4);
    var r = await P.sb.from("program_pages").select("*").order("slug");
    if (r.error) { main.innerHTML = P.errBox(r.error.message); return; }
    main.innerHTML =
      '<div class="pa-head"><div><h1>Programs</h1><div class="sub">Structured program page content. BioCAN lives inside BioLaunch, matching the site architecture.</div></div></div>' +
      '<div class="ptab-wrap"><table class="ptab"><thead><tr><th>Program</th><th>Hero headline</th><th>Published</th><th></th></tr></thead><tbody>' +
      (r.data || []).map(function (p2) {
        return '<tr class="rowlink" onclick="location.hash=\'#/content/programs/' + p2.id + '\'">' +
          "<td class='nm'>" + P.esc(p2.title) + "<div class='mut'>" + P.esc(p2.slug) + "</div></td>" +
          "<td class='mut'>" + P.esc(p2.hero_headline || "—") + "</td>" +
          "<td>" + onOff(p2.published) + '</td><td style="text-align:right"><span class="mut">edit →</span></td></tr>';
      }).join("") + "</tbody></table></div>";
  };

  async function programEdit(main, id) {
    var res = await Promise.all([
      P.sb.from("program_pages").select("*").eq("id", id).maybeSingle(),
      P.sb.from("program_sections").select("*").eq("program_id", id).order("display_order"),
    ]);
    var pg = res[0].data;
    if (!pg) { main.innerHTML = P.errBox("Program not found."); return; }
    var secs = res[1].data || [];
    var F = [["title","Program title"],["eyebrow","Eyebrow"],["hero_headline","Hero headline"],
      ["hero_subhead","Hero subheading"],["cta_label","CTA label"],["cta_url","CTA destination"],
      ["hero_image","Hero image URL"],["seo_title","SEO title"],["seo_description","SEO description"]];
    main.innerHTML =
      '<div class="pa-head"><div><h1>' + P.esc(pg.title) + '</h1><div class="sub"><a href="#/content/programs" style="color:var(--p-green2);font-weight:600">← All programs</a></div></div>' +
      '<button class="pb pb-pri" id="pg-save">Save</button></div>' +
      '<div class="pcard"><h3>Page fields</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">' +
      F.map(function (f) {
        return '<div class="ed-field" style="margin:0"><label>' + f[1] + '</label><input type="text" data-pf="' + f[0] + '" value="' + P.esc(pg[f[0]] || "") + '"></div>';
      }).join("") +
      '<div class="ed-field" style="margin:0;grid-column:1/-1"><label>Overview</label><textarea rows="4" data-pf="overview_html">' + P.esc(pg.overview_html || "") + "</textarea></div>" +
      '<div class="ed-field" style="margin:0"><label>Published</label><label style="display:flex;gap:8px;align-items:center;font:500 .88rem var(--p-font);text-transform:none"><input type="checkbox" data-pf="published"' + (pg.published ? " checked" : "") + ' style="width:16px;height:16px"> Visible on site</label></div>' +
      "</div></div>" +
      '<div class="pcard"><h3>Sections <span class="mut" style="font:400 .78rem var(--p-font)">(repeatable content areas — e.g. BioStart, CDMO & Lab Network, BioCAN Grants under BioLaunch)</span></h3>' +
      '<div id="sec-list">' + secs.map(function (s, i) {
        return '<div class="ed-field" style="border:1px solid var(--p-border);border-radius:10px;padding:12px" data-sec="' + s.id + '">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
          '<input type="text" data-sk="section_key" placeholder="key (e.g. biostart)" value="' + P.esc(s.section_key) + '">' +
          '<input type="text" data-sk="heading" placeholder="Heading" value="' + P.esc(s.heading) + '">' +
          '</div><textarea rows="3" data-sk="body_html" placeholder="Body…" style="margin-top:8px">' + P.esc(s.body_html) + "</textarea>" +
          '<div style="display:flex;gap:8px;margin-top:8px;align-items:center">' +
          '<label style="display:flex;gap:6px;align-items:center;font:500 .8rem var(--p-font)"><input type="checkbox" data-sk="published"' + (s.published ? " checked" : "") + "> Published</label>" +
          '<button class="pb pb-sm pb-danger" data-sec-del="' + s.id + '" style="margin-left:auto">Remove</button></div></div>';
      }).join("") + "</div>" +
      '<button class="pb pb-sec" id="sec-add" style="margin-top:10px">+ Add section</button></div>';

    P.$("#pg-save", main).onclick = async function () {
      var out = {};
      main.querySelectorAll("[data-pf]").forEach(function (el) {
        out[el.dataset.pf] = el.type === "checkbox" ? el.checked : el.value;
      });
      out.updated_by = P.user.id;
      var r2 = await P.sb.from("program_pages").update(out).eq("id", id);
      if (r2.error) return P.toast(r2.error.message, "err");
      // save sections
      var boxes = main.querySelectorAll("[data-sec]");
      for (var i = 0; i < boxes.length; i++) {
        var bx = boxes[i], upd = { display_order: i };
        bx.querySelectorAll("[data-sk]").forEach(function (el) {
          upd[el.dataset.sk] = el.type === "checkbox" ? el.checked : el.value;
        });
        await P.sb.from("program_sections").update(upd).eq("id", bx.dataset.sec);
      }
      P.logContent("updated", "program", id, pg.title);
      P.toast("Program saved");
    };
    P.$("#sec-add", main).onclick = async function () {
      var r2 = await P.sb.from("program_sections").insert({ program_id: id, display_order: secs.length }).select().single();
      if (r2.error) return P.toast(r2.error.message, "err");
      programEdit(main, id);
    };
    main.querySelectorAll("[data-sec-del]").forEach(function (b) {
      b.onclick = async function () {
        if (!confirm("Remove this section?")) return;
        await P.sb.from("program_sections").delete().eq("id", b.dataset.secDel);
        programEdit(main, id);
      };
    });
  }
})();
