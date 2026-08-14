/* ============================================================
   Portal — Inquiry inbox + detail workflow.
   Server-side filtered/sorted/paginated queries (RLS-guarded),
   program inboxes, bulk actions, notes, tags, assignment,
   activity timeline. Registers PORTAL.views.inbox / .inquiry.
   ============================================================ */
(function () {
  "use strict";
  var P = window.PORTAL;
  var PAGE = 25;

  // sticky filter state (per session)
  var F = { q: "", status: "", type: "", assigned: "", tag: "", read: "",
            from: "", to: "", source: "", sort: "newest", page: 0 };
  var selected = {};   // id -> row (bulk selection)

  function progName(slug) {
    var p = P.programs.find(function (x) { return x.slug === slug; });
    return p ? p.name : slug;
  }
  function catName(program, slug) {
    var pr = P.programs.find(function (x) { return x.slug === program; });
    var c = pr && P.categories.find(function (x) { return x.program_id === pr.id && x.slug === slug; });
    return c ? c.name : slug;
  }
  function logIq(inquiryId, event, prev, val) {
    return P.sb.from("inquiry_activity").insert({
      inquiry_id: inquiryId, actor_id: P.user.id, event_type: event,
      previous_value: prev || null, new_value: val || null });
  }

  // ---------------- inbox list ----------------
  P.views.inbox = async function (main, program) {
    selected = {};
    var title = program === "all" ? "All Inquiries" : progName(program);
    main.innerHTML = '<div class="pa-head"><div><h1>' + P.esc(title) + '</h1>' +
      '<div class="sub">Loading…</div></div></div>' + P.skel(8);
    render(main, program);
  };

  async function query(program) {
    var q = P.sb.from("inquiries").select("*", { count: "exact" });
    if (program !== "all") q = q.eq("program", program);
    if (F.status) q = q.eq("status", F.status); else q = q.neq("status", "archived");
    if (F.type) q = q.eq("inquiry_type", F.type);
    if (F.assigned === "me") q = q.eq("assigned_to", P.user.id);
    else if (F.assigned === "none") q = q.is("assigned_to", null);
    else if (F.assigned) q = q.eq("assigned_to", F.assigned);
    if (F.read === "unread") q = q.eq("is_read", false);
    else if (F.read === "read") q = q.eq("is_read", true);
    if (F.source) q = q.eq("source_form", F.source);
    if (F.from) q = q.gte("created_at", F.from + "T00:00:00Z");
    if (F.to)   q = q.lte("created_at", F.to + "T23:59:59Z");
    if (F.tag) {
      var tagged = await P.sb.from("inquiry_tags").select("inquiry_id").eq("tag_id", F.tag);
      var ids = (tagged.data || []).map(function (r) { return r.inquiry_id; });
      if (!ids.length) return { data: [], count: 0 };
      q = q.in("id", ids);
    }
    if (F.q) {
      var terms = F.q.trim().split(/\s+/).map(function (t) { return t.replace(/[^\w@.-]/g, ""); })
        .filter(Boolean).map(function (t) { return t + ":*"; }).join(" & ");
      if (terms) q = q.textSearch("search", terms, { config: "simple" });
    }
    var sorts = {
      newest: ["created_at", { ascending: false }],
      oldest: ["created_at", { ascending: true }],
      name_az: ["first_name", { ascending: true }],
      name_za: ["first_name", { ascending: false }],
      updated: ["updated_at", { ascending: false }],
    };
    var s = sorts[F.sort] || sorts.newest;
    q = q.order(s[0], s[1]).range(F.page * PAGE, F.page * PAGE + PAGE - 1);
    var r = await q;
    if (r.error) throw r.error;
    return r;
  }

  async function render(main, program) {
    var r;
    try { r = await query(program); }
    catch (e) { main.innerHTML = P.errBox(e.message || "could not load inquiries"); return; }
    var rows = r.data || [], total = r.count || 0;
    var pages = Math.max(1, Math.ceil(total / PAGE));
    if (F.page >= pages) F.page = pages - 1;

    var pr = P.programs.find(function (x) { return x.slug === program; });
    var cats = pr ? P.categories.filter(function (c) { return c.program_id === pr.id; })
                  : P.categories;
    var activeStaff = P.profiles.filter(function (p) { return p.active; });
    var anyFilter = F.q || F.status || F.type || F.assigned || F.tag || F.read || F.from || F.to || F.source;

    main.innerHTML =
      '<div class="pa-head"><div><h1>' + P.esc(program === "all" ? "All Inquiries" : progName(program)) + "</h1>" +
      '<div class="sub">' + total + " inquir" + (total === 1 ? "y" : "ies") +
      (anyFilter ? " matching filters" : "") + "</div></div></div>" +

      '<div class="fbar" role="search">' +
        '<input type="search" id="f-q" placeholder="Search name, email, organization, subject, message…" value="' + P.esc(F.q) + '">' +
        sel("f-status", "All statuses", P.STATUSES.map(function (s) { return [s, P.STATUS_LABEL[s]]; }), F.status) +
        sel("f-type", "All types", dedupe(cats.map(function (c) { return [c.slug, c.name]; })), F.type) +
        sel("f-assigned", "Anyone", [["me", "Assigned to me"], ["none", "Unassigned"]].concat(
          activeStaff.map(function (p) { return [p.id, (p.first_name + " " + p.last_name).trim() || p.email]; })), F.assigned) +
        sel("f-tag", "Any tag", P.tags.map(function (t) { return [t.id, t.name]; }), F.tag) +
        sel("f-read", "Read + unread", [["unread", "Unread"], ["read", "Read"]], F.read) +
        '<input type="date" id="f-from" value="' + P.esc(F.from) + '" title="From date">' +
        '<input type="date" id="f-to" value="' + P.esc(F.to) + '" title="To date">' +
        sel("f-sort", null, [["newest", "Newest"], ["oldest", "Oldest"], ["name_az", "Name A–Z"],
          ["name_za", "Name Z–A"], ["updated", "Recently updated"]], F.sort) +
        (anyFilter ? '<button class="pb pb-sm pb-sec" id="f-clear">Clear filters</button>' : "") +
      "</div>" +

      '<div class="bulkbar" id="bulkbar"><span id="bulk-n"></span>' +
        '<button class="pb pb-sec" data-bulk="read">Mark read</button>' +
        '<button class="pb pb-sec" data-bulk="unread">Mark unread</button>' +
        '<select id="bulk-assign"><option value="">Assign to…</option>' +
          activeStaff.map(function (p) { return '<option value="' + p.id + '">' + P.esc((p.first_name + " " + p.last_name).trim() || p.email) + "</option>"; }).join("") + "</select>" +
        '<select id="bulk-status"><option value="">Set status…</option>' +
          P.STATUSES.map(function (s) { return '<option value="' + s + '">' + P.STATUS_LABEL[s] + "</option>"; }).join("") + "</select>" +
        '<select id="bulk-tag"><option value="">Add tag…</option>' +
          P.tags.map(function (t) { return '<option value="' + t.id + '">' + P.esc(t.name) + "</option>"; }).join("") + "</select>" +
        '<button class="pb pb-danger" data-bulk="archive">Archive</button>' +
      "</div>" +

      (rows.length ?
        '<div class="ptab-wrap"><table class="ptab"><thead><tr>' +
        '<th><input type="checkbox" id="sel-all" aria-label="Select all on page"></th>' +
        "<th>Name</th><th>Program / Type</th><th>Subject / Message</th><th>Received</th><th>Status</th><th>Assigned</th></tr></thead><tbody>" +
        rows.map(function (r2) {
          return '<tr class="rowlink' + (r2.is_read ? "" : " unread") + '" data-id="' + r2.id + '">' +
            '<td><input type="checkbox" data-sel="' + r2.id + '" aria-label="Select"></td>' +
            '<td class="nm">' + P.esc(r2.first_name + " " + r2.last_name) +
              '<div class="mut">' + P.esc(r2.organization || "") + (r2.organization ? " · " : "") + P.esc(r2.email) + "</div></td>" +
            "<td>" + P.esc(progName(r2.program)) + '<div class="mut">' + P.esc(catName(r2.program, r2.inquiry_type)) + "</div></td>" +
            "<td>" + (r2.subject ? "<b>" + P.esc(r2.subject) + "</b><br>" : "") +
              '<span class="mut">' + P.esc((r2.message || "").slice(0, 90)) + ((r2.message || "").length > 90 ? "…" : "") + "</span></td>" +
            '<td class="mut" style="white-space:nowrap">' + P.fmtDate(r2.created_at) + "</td>" +
            "<td>" + P.statusChip(r2.status) + "</td>" +
            '<td class="mut">' + P.esc(P.profileName(r2.assigned_to) || "Unassigned") + "</td></tr>";
        }).join("") + "</tbody></table></div>" +
        '<div class="pgn"><span>Page ' + (F.page + 1) + " of " + pages + " · " + total + " total</span>" +
        '<span style="display:flex;gap:8px">' +
        '<button class="pb pb-sec" id="pg-prev"' + (F.page === 0 ? " disabled" : "") + ">← Prev</button>" +
        '<button class="pb pb-sec" id="pg-next"' + (F.page >= pages - 1 ? " disabled" : "") + ">Next →</button></span></div>"
      : P.emptyState("No " + (program === "all" ? "" : progName(program) + " ") + "inquiries match these filters.",
          anyFilter ? '<div><button class="pb pb-sec" id="f-clear2">Clear filters</button></div>' : ""));

    // ---- wiring ----
    function rerun() { F.page = 0; render(main, program); }
    var deb;
    P.$("#f-q", main).oninput = function (e) { clearTimeout(deb); deb = setTimeout(function () { F.q = e.target.value; rerun(); }, 350); };
    bind("f-status", "status"); bind("f-type", "type"); bind("f-assigned", "assigned");
    bind("f-tag", "tag"); bind("f-read", "read"); bind("f-sort", "sort");
    P.$("#f-from", main).onchange = function (e) { F.from = e.target.value; rerun(); };
    P.$("#f-to", main).onchange = function (e) { F.to = e.target.value; rerun(); };
    function bind(id, key) {
      var el = P.$("#" + id, main); if (el) el.onchange = function (e) { F[key] = e.target.value; rerun(); };
    }
    ["f-clear", "f-clear2"].forEach(function (id) {
      var b = P.$("#" + id, main);
      if (b) b.onclick = function () { F = { q:"",status:"",type:"",assigned:"",tag:"",read:"",from:"",to:"",source:"",sort:"newest",page:0 }; render(main, program); };
    });
    var pv = P.$("#pg-prev", main), nx = P.$("#pg-next", main);
    if (pv) pv.onclick = function () { F.page--; render(main, program); };
    if (nx) nx.onclick = function () { F.page++; render(main, program); };

    // row click vs checkbox
    main.querySelectorAll("tr.rowlink").forEach(function (tr) {
      tr.onclick = function (e) {
        if (e.target.closest("input")) return;
        location.hash = "#/inquiry/" + tr.dataset.id;
      };
    });
    function refreshBulk() {
      var n = Object.keys(selected).length;
      var bb = P.$("#bulkbar", main);
      bb.classList.toggle("show", n > 0);
      P.$("#bulk-n", main).textContent = n + " selected";
    }
    main.querySelectorAll("[data-sel]").forEach(function (cb) {
      cb.onchange = function () {
        var row = rows.find(function (x) { return x.id === cb.dataset.sel; });
        if (cb.checked) selected[cb.dataset.sel] = row; else delete selected[cb.dataset.sel];
        refreshBulk();
      };
    });
    var sa = P.$("#sel-all", main);
    if (sa) sa.onchange = function () {
      main.querySelectorAll("[data-sel]").forEach(function (cb) {
        cb.checked = sa.checked;
        if (sa.checked) selected[cb.dataset.sel] = rows.find(function (x) { return x.id === cb.dataset.sel; });
        else delete selected[cb.dataset.sel];
      });
      refreshBulk();
    };

    async function bulk(update, event, valLabel) {
      var ids = Object.keys(selected);
      if (!ids.length) return;
      var r2 = await P.sb.from("inquiries").update(update).in("id", ids);
      if (r2.error) return P.toast("Bulk update failed: " + r2.error.message, "err");
      await Promise.all(ids.map(function (id) { return logIq(id, event, null, valLabel || null); }));
      P.toast(ids.length + " inquiries updated");
      selected = {}; P.refreshCounts(); render(main, program);
    }
    main.querySelectorAll("[data-bulk]").forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.bulk;
        if (k === "read")    bulk({ is_read: true }, "read");
        if (k === "unread")  bulk({ is_read: false }, "unread");
        if (k === "archive") { if (confirm("Archive selected inquiries?")) bulk({ status: "archived" }, "status_changed", "archived"); }
      };
    });
    P.$("#bulk-assign", main).onchange = function (e) {
      if (e.target.value) bulk({ assigned_to: e.target.value, is_read: true }, "assigned", P.profileName(e.target.value));
    };
    P.$("#bulk-status", main).onchange = function (e) {
      if (e.target.value) bulk({ status: e.target.value }, "status_changed", e.target.value);
    };
    P.$("#bulk-tag", main).onchange = async function (e) {
      var tagId = e.target.value; if (!tagId) return;
      var ids = Object.keys(selected);
      var rowsIns = ids.map(function (id) { return { inquiry_id: id, tag_id: tagId }; });
      var r2 = await P.sb.from("inquiry_tags").upsert(rowsIns);
      if (r2.error) return P.toast(r2.error.message, "err");
      var tg = P.tags.find(function (t) { return t.id === tagId; });
      await Promise.all(ids.map(function (id) { return logIq(id, "tag_added", null, tg && tg.name); }));
      P.toast("Tag added to " + ids.length);
      selected = {}; render(main, program);
    };

    function sel(id, blank, opts, val) {
      return '<select id="' + id + '">' + (blank !== null ? '<option value="">' + blank + "</option>" : "") +
        opts.map(function (o) { return '<option value="' + P.esc(o[0]) + '"' + (String(val) === String(o[0]) ? " selected" : "") + ">" + P.esc(o[1]) + "</option>"; }).join("") +
        "</select>";
    }
    function dedupe(pairs) {
      var seen = {}, out = [];
      pairs.forEach(function (p2) { if (!seen[p2[0]]) { seen[p2[0]] = 1; out.push(p2); } });
      return out;
    }
  }
  // allow realtime handler to refresh the open inbox
  P.views._inboxRefresh = function () {
    var h = (location.hash || "").split("/");
    if (h[1] === "inbox") P.views.inbox(P.$("#pa-main"), h[2] || "all");
  };

  // ---------------- inquiry detail ----------------
  P.views.inquiry = async function (main, id) {
    main.innerHTML = P.skel(8);
    var res = await Promise.all([
      P.sb.from("inquiries").select("*").eq("id", id).maybeSingle(),
      P.sb.from("inquiry_notes").select("*").eq("inquiry_id", id).order("created_at"),
      P.sb.from("inquiry_tags").select("tag_id").eq("inquiry_id", id),
      P.sb.from("inquiry_activity").select("*").eq("inquiry_id", id).order("created_at", { ascending: false }).limit(40),
    ]);
    var iq = res[0].data;
    if (res[0].error || !iq) { main.innerHTML = P.errBox("Inquiry not found (it may have been deleted)."); return; }
    var notes = res[1].data || [];
    var tagIds = (res[2].data || []).map(function (t) { return t.tag_id; });
    var activity = res[3].data || [];

    // contact history: other inquiries from the same email (lightweight CRM)
    var hist = await P.sb.from("inquiries").select("id,subject,program,created_at,status")
      .ilike("email", iq.email).neq("id", id).order("created_at", { ascending: false }).limit(6);
    var history = hist.data || [];

    // mark read + log view (once per load)
    if (!iq.is_read) {
      await P.sb.from("inquiries").update({ is_read: true }).eq("id", id);
      P.refreshCounts();
    }
    logIq(id, "viewed");

    var activeStaff = P.profiles.filter(function (p) { return p.active; });
    var meta = iq.metadata || {};
    var metaRows = Object.keys(meta).filter(function (k) { return k !== "legacy_id"; }).map(function (k) {
      var v = meta[k];
      return "<dt>" + P.esc(k.replace(/_/g, " ")) + "</dt><dd>" + P.esc(typeof v === "object" ? JSON.stringify(v) : String(v)) + "</dd>";
    }).join("");

    main.innerHTML =
      '<div class="pa-head"><div><h1>' + P.esc(iq.first_name + " " + iq.last_name) + "</h1>" +
      '<div class="sub">' + P.esc(progName(iq.program)) + " · " + P.esc(catName(iq.program, iq.inquiry_type)) +
      " · received " + P.fmtDate(iq.created_at, true) + "</div></div>" +
      '<a class="pb pb-sec" href="#/inbox/' + P.esc(iq.program) + '">← Back to inbox</a></div>' +

      '<div class="iq-grid"><div>' +
        '<div class="pcard"><h3>Message</h3>' +
          (iq.subject ? '<p style="font:700 .95rem var(--p-font);margin:0 0 8px">' + P.esc(iq.subject) + "</p>" : "") +
          '<div class="iq-msg">' + P.esc(iq.message) + "</div></div>" +
        '<div class="pcard"><h3>Contact Information</h3><dl class="iq-meta">' +
          "<dt>Email</dt><dd><a href='mailto:" + P.esc(iq.email) + "' style='color:var(--p-green2);font-weight:600'>" + P.esc(iq.email) + "</a></dd>" +
          (iq.phone ? "<dt>Phone</dt><dd>" + P.esc(iq.phone) + "</dd>" : "") +
          (iq.organization ? "<dt>Organization</dt><dd>" + P.esc(iq.organization) + "</dd>" : "") +
          (iq.job_title ? "<dt>Job title</dt><dd>" + P.esc(iq.job_title) + "</dd>" : "") +
        "</dl></div>" +
        '<div class="pcard"><h3>Submission Details</h3><dl class="iq-meta">' +
          "<dt>Form</dt><dd>" + P.esc(iq.source_form || "—") + "</dd>" +
          "<dt>Page</dt><dd>" + P.esc(iq.source_page || "—") + "</dd>" +
          (iq.utm_source ? "<dt>UTM source</dt><dd>" + P.esc(iq.utm_source) + " / " + P.esc(iq.utm_medium) + " / " + P.esc(iq.utm_campaign) + "</dd>" : "") +
          (iq.referrer ? "<dt>Referrer</dt><dd>" + P.esc(iq.referrer) + "</dd>" : "") +
          metaRows +
        "</dl></div>" +
        (history.length ?
          '<div class="pcard"><h3>Contact History <span class="mut" style="font:400 .78rem var(--p-font)">' + history.length + " previous from this email</span></h3>" +
          '<div class="ptab-wrap" style="border:0"><table class="ptab"><tbody>' + history.map(function (h) {
            return '<tr class="rowlink" onclick="location.hash=\'#/inquiry/' + h.id + '\'"><td>' + P.fmtDate(h.created_at) +
              "</td><td>" + P.esc(progName(h.program)) + "</td><td>" + P.statusChip(h.status) + "</td></tr>";
          }).join("") + "</tbody></table></div></div>" : "") +
        '<div class="pcard"><h3>Internal Notes</h3><div id="notes-list">' +
          (notes.length ? notes.map(noteHtml).join("") : '<p class="mut" style="font:400 .84rem var(--p-font);color:var(--p-muted)">No notes yet.</p>') +
        "</div>" +
        '<textarea class="note-in" id="note-in" placeholder="Add an internal note… (never visible publicly)"></textarea>' +
        '<div style="margin-top:8px"><button class="pb pb-pri" id="note-add">Add note</button></div></div>' +
      "</div>" +

      '<div class="iq-side"><div class="pcard">' +
        "<h3>Workflow</h3>" +
        "<label for='iq-status'>Status</label><select id='iq-status'>" +
          P.STATUSES.map(function (s) { return '<option value="' + s + '"' + (iq.status === s ? " selected" : "") + ">" + P.STATUS_LABEL[s] + "</option>"; }).join("") + "</select>" +
        "<label for='iq-assign'>Assigned to</label><select id='iq-assign'><option value=''>Unassigned</option>" +
          activeStaff.map(function (p2) { return '<option value="' + p2.id + '"' + (iq.assigned_to === p2.id ? " selected" : "") + ">" +
            P.esc((p2.first_name + " " + p2.last_name).trim() || p2.email) + "</option>"; }).join("") + "</select>" +
        '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">' +
          '<button class="pb pb-sm pb-sec" id="iq-assign-me">Assign to me</button>' +
          '<button class="pb pb-sm pb-sec" id="iq-unread">Mark unread</button></div>' +
        "<label for='iq-follow'>Follow-up date</label>" +
        "<input type='date' id='iq-follow' value='" + (iq.follow_up_at ? iq.follow_up_at.slice(0, 10) : "") + "'>" +
        "<label>Tags</label><div id='iq-tags' style='display:flex;flex-wrap:wrap;gap:6px'></div>" +
        "<select id='iq-tag-add' style='margin-top:8px'><option value=''>Add tag…</option>" +
          P.tags.map(function (t) { return '<option value="' + t.id + '">' + P.esc(t.name) + "</option>"; }).join("") + "</select>" +
        "<label>Last updated</label><div class='mut' style='font:400 .82rem var(--p-font);color:var(--p-muted)'>" + P.fmtDate(iq.updated_at, true) + "</div>" +
      "</div>" +
      '<div class="pcard"><h3>Activity</h3><ul class="tl" id="iq-activity">' + activity.map(actHtml).join("") + "</ul></div>" +
      "</div></div>";

    function noteHtml(n) {
      return '<div class="note"><span class="who">' + P.esc(P.profileName(n.author_id) || "Staff") + "</span>" +
        '<span class="when">' + P.fmtDate(n.created_at, true) + "</span><p>" + P.esc(n.note) + "</p></div>";
    }
    function actHtml(a) {
      var who = P.esc(P.profileName(a.actor_id) || "Website visitor");
      var txt = { submitted:"Inquiry submitted", viewed:"Viewed by " + who, read:"Marked read by " + who,
        unread:"Marked unread by " + who, note_added:"Note added by " + who,
        assigned:"Assigned to <b>" + P.esc(a.new_value || "") + "</b> by " + who,
        unassigned:"Assignment removed by " + who,
        status_changed:"Status <b>" + P.esc(P.STATUS_LABEL[a.previous_value] || a.previous_value || "—") + "</b> → <b>" +
          P.esc(P.STATUS_LABEL[a.new_value] || a.new_value || "") + "</b> by " + who,
        tag_added:"Tag <b>" + P.esc(a.new_value || "") + "</b> added by " + who,
        tag_removed:"Tag <b>" + P.esc(a.new_value || "") + "</b> removed by " + who }[a.event_type] ||
        (P.esc(a.event_type) + " by " + who);
      return "<li>" + txt + '<div class="mut">' + P.fmtDate(a.created_at, true) + "</div></li>";
    }
    async function refreshActivity() {
      var r = await P.sb.from("inquiry_activity").select("*").eq("inquiry_id", id)
        .order("created_at", { ascending: false }).limit(40);
      if (!r.error) P.$("#iq-activity", main).innerHTML = (r.data || []).map(actHtml).join("");
    }
    async function save(update, event, prev, val) {
      var r = await P.sb.from("inquiries").update(update).eq("id", id);
      if (r.error) { P.toast("Save failed: " + r.error.message, "err"); return false; }
      if (event) await logIq(id, event, prev, val);
      P.toast("Saved"); refreshActivity(); P.refreshCounts();
      return true;
    }

    P.$("#iq-status", main).onchange = function (e) {
      var v = e.target.value, prev = iq.status;
      var upd = { status: v };
      if (v === "resolved") upd.resolved_at = new Date().toISOString();
      save(upd, "status_changed", prev, v).then(function (ok) { if (ok) iq.status = v; });
    };
    P.$("#iq-assign", main).onchange = function (e) {
      var v = e.target.value || null, prevName = P.profileName(iq.assigned_to);
      save({ assigned_to: v }, v ? "assigned" : "unassigned", prevName, v ? P.profileName(v) : null)
        .then(function (ok) { if (ok) iq.assigned_to = v; });
    };
    P.$("#iq-assign-me", main).onclick = function () {
      P.$("#iq-assign", main).value = P.user.id;
      P.$("#iq-assign", main).dispatchEvent(new Event("change"));
    };
    P.$("#iq-unread", main).onclick = function () {
      save({ is_read: false }, "unread").then(function () { P.toast("Marked unread — it will show as new in the inbox"); });
    };
    P.$("#iq-follow", main).onchange = function (e) {
      save({ follow_up_at: e.target.value ? e.target.value + "T09:00:00Z" : null });
    };
    P.$("#note-add", main).onclick = async function () {
      var txt = P.$("#note-in", main).value.trim();
      if (!txt) return;
      var r = await P.sb.from("inquiry_notes").insert({ inquiry_id: id, author_id: P.user.id, note: txt }).select().single();
      if (r.error) return P.toast("Note failed: " + r.error.message, "err");
      await logIq(id, "note_added");
      P.$("#note-in", main).value = "";
      var list = P.$("#notes-list", main);
      if (list.querySelector("p")) list.innerHTML = "";
      list.insertAdjacentHTML("beforeend", noteHtml(r.data));
      refreshActivity(); P.toast("Note added");
    };

    // tags
    function renderTags() {
      P.$("#iq-tags", main).innerHTML = tagIds.length ? tagIds.map(function (tid) {
        var t = P.tags.find(function (x) { return x.id === tid; });
        return '<span class="tagchip" style="border-color:' + P.esc(t ? t.color : "#ccc") + '">' + P.esc(t ? t.name : "?") +
          '<button data-untag="' + tid + '" aria-label="Remove tag">✕</button></span>';
      }).join("") : '<span class="mut" style="font:400 .8rem var(--p-font);color:var(--p-muted)">None</span>';
      main.querySelectorAll("[data-untag]").forEach(function (b) {
        b.onclick = async function () {
          var tid = b.dataset.untag;
          var r = await P.sb.from("inquiry_tags").delete().eq("inquiry_id", id).eq("tag_id", tid);
          if (r.error) return P.toast(r.error.message, "err");
          tagIds = tagIds.filter(function (x) { return x !== tid; });
          var t = P.tags.find(function (x) { return x.id === tid; });
          await logIq(id, "tag_removed", null, t && t.name);
          renderTags(); refreshActivity();
        };
      });
    }
    renderTags();
    P.$("#iq-tag-add", main).onchange = async function (e) {
      var tid = e.target.value; e.target.value = "";
      if (!tid || tagIds.indexOf(tid) !== -1) return;
      var r = await P.sb.from("inquiry_tags").insert({ inquiry_id: id, tag_id: tid });
      if (r.error) return P.toast(r.error.message, "err");
      tagIds.push(tid);
      var t = P.tags.find(function (x) { return x.id === tid; });
      await logIq(id, "tag_added", null, t && t.name);
      renderTags(); refreshActivity();
    };
  };
})();
