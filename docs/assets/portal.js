/* ============================================================
   Heartland BioWorks Employee Portal — core runtime.
   Auth (Supabase), hash router, shared UI helpers, Dashboard,
   Users admin, Activity log. Inbox lives in portal-inbox.js,
   CMS views in portal-cms.js — they register on PORTAL.views.

   Security model: this file only renders UI. Every read/write is
   enforced by Postgres RLS keyed on the signed-in user's role
   (public.portal_role()). Hidden buttons are convenience, not
   the boundary.
   ============================================================ */
(function () {
  "use strict";

  var P = window.PORTAL = {
    sb: null, user: null, profile: null,
    views: {},               // route key -> render(main, args)
    profiles: [],            // active staff (for assign dropdowns)
    programs: [],            // {id,slug,name}
    categories: [],          // {id,program_id,slug,name}
    tags: [],
    counts: {},              // program slug -> unread count
  };

  var STATUSES = ["new","in_progress","waiting","follow_up","resolved","archived"];
  var STATUS_LABEL = { new:"New", in_progress:"In Progress", waiting:"Waiting",
    follow_up:"Follow Up", resolved:"Resolved", archived:"Archived",
    draft:"Draft", scheduled:"Scheduled", published:"Published" };
  P.STATUSES = STATUSES; P.STATUS_LABEL = STATUS_LABEL;

  // ---------- tiny utils ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); }
  function fmtDate(d, withTime) {
    if (!d) return "—";
    var dt = new Date(d);
    if (isNaN(dt)) return "—";
    var o = { month:"short", day:"numeric", year:"numeric" };
    if (withTime) { o.hour = "numeric"; o.minute = "2-digit"; }
    return dt.toLocaleString("en-US", o);
  }
  function toast(msg, kind) {
    var t = document.createElement("div");
    t.className = "toast " + (kind || "ok");
    t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, 4200);
  }
  function statusChip(s) {
    return '<span class="chip st-' + esc(s) + '">' + esc(STATUS_LABEL[s] || s) + "</span>";
  }
  function profileName(id) {
    var p = P.profiles.find(function (x) { return x.id === id; });
    return p ? (p.first_name + " " + p.last_name).trim() || p.email : null;
  }
  function slugify(s) {
    return String(s || "").toLowerCase().replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  }
  function skel(n) {
    var h = "";
    for (var i = 0; i < (n || 5); i++) h += '<div class="skel" style="width:' + (60 + (i * 13) % 40) + '%"></div>';
    return '<div class="pcard">' + h + "</div>";
  }
  function errBox(msg) {
    return '<div class="perr">Something went wrong: ' + esc(msg) +
      ' <button class="pb pb-sm pb-sec" onclick="location.reload()">Reload</button></div>';
  }
  function emptyState(msg, extra) {
    return '<div class="pstate">' + esc(msg) + (extra || "") + "</div>";
  }
  function logContent(action, type, id, name, meta) {
    P.sb.from("content_activity").insert({
      actor_id: P.user.id, action: action, resource_type: type,
      resource_id: id || null, resource_name: name || "", metadata: meta || {}
    }).then(function () {});
  }
  P.$ = $; P.esc = esc; P.fmtDate = fmtDate; P.toast = toast;
  P.statusChip = statusChip; P.profileName = profileName; P.slugify = slugify;
  P.skel = skel; P.errBox = errBox; P.emptyState = emptyState; P.logContent = logContent;

  // ---------- auth ----------
  function showLogin() { $("#p-login").hidden = false; $("#p-app").hidden = true; }
  function showApp()   { $("#p-login").hidden = true;  $("#p-app").hidden = false; }

  async function boot() {
    P.sb = window.hbSupabaseClient && window.hbSupabaseClient();
    if (!P.sb) {
      document.body.innerHTML = '<div class="pstate" style="padding-top:80px">' +
        "The portal can’t reach its data service (script blocked or offline). Reload to retry.</div>";
      return;
    }
    var s = await P.sb.auth.getSession();
    if (!s.data.session) { showLogin(); wireLogin(); return; }
    await enter();
  }

  async function enter() {
    var u = (await P.sb.auth.getUser()).data.user;
    if (!u) { showLogin(); wireLogin(); return; }
    P.user = u;
    var prof = await P.sb.from("profiles").select("*").eq("id", u.id).maybeSingle();
    if (prof.error || !prof.data || !prof.data.active) {
      showLogin(); wireLogin();
      $("#pl-err").textContent = prof.data && !prof.data.active
        ? "This account has been deactivated. Contact an administrator."
        : "Your account isn’t provisioned for portal access yet. Ask an administrator to add you.";
      $("#pl-err").classList.add("show");
      await P.sb.auth.signOut();
      return;
    }
    P.profile = prof.data;
    showApp();
    $("#pa-user").textContent = (P.profile.first_name + " " + P.profile.last_name).trim() || P.profile.email;
    $("#pa-role").textContent = P.profile.role;
    await loadRefData();
    renderNav();
    wireFrame();
    subscribeRealtime();
    route();
    window.addEventListener("hashchange", route);
  }

  function wireLogin() {
    var form = $("#pl-form");
    if (form.dataset.wired) return;
    form.dataset.wired = "1";
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var err = $("#pl-err"); err.classList.remove("show");
      $("#pl-ok").classList.remove("show");
      $("#pl-submit").disabled = true;
      var r = await P.sb.auth.signInWithPassword({
        email: $("#pl-email").value.trim(), password: $("#pl-pass").value });
      $("#pl-submit").disabled = false;
      if (r.error) {
        err.textContent = "Sign-in failed: " + (r.error.message || "check your email and password.");
        err.classList.add("show");
        return;
      }
      await enter();
    });
    $("#pl-forgot").addEventListener("click", async function () {
      var email = $("#pl-email").value.trim();
      var err = $("#pl-err"); err.classList.remove("show");
      if (!email) { err.textContent = "Enter your email above first, then press Forgot password."; err.classList.add("show"); return; }
      var r = await P.sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
      if (r.error) { err.textContent = r.error.message; err.classList.add("show"); return; }
      $("#pl-ok").textContent = "Password reset email sent — check your inbox.";
      $("#pl-ok").classList.add("show");
    });
  }

  async function loadRefData() {
    var res = await Promise.all([
      P.sb.from("profiles").select("id,first_name,last_name,email,role,active").order("first_name"),
      P.sb.from("programs").select("*").order("display_order"),
      P.sb.from("inquiry_categories").select("*").order("display_order"),
      P.sb.from("tags").select("*").order("name"),
    ]);
    P.profiles  = res[0].data || [];
    P.programs  = res[1].data || [];
    P.categories = res[2].data || [];
    P.tags      = res[3].data || [];
    await refreshCounts();
  }

  P.refreshCounts = refreshCounts;
  async function refreshCounts() {
    var r = await P.sb.from("inquiries").select("program", { count: "exact" }).eq("is_read", false)
      .not("status", "eq", "archived");
    if (r.error) return;
    var c = { all: 0 };
    (r.data || []).forEach(function (row) {
      c[row.program] = (c[row.program] || 0) + 1; c.all++;
    });
    P.counts = c;
    renderNav(); // refresh badges
  }

  // ---------- realtime ----------
  function subscribeRealtime() {
    try {
      P.sb.channel("portal-inquiries")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "inquiries" }, function (payload) {
          toast("New inquiry from " + (payload.new.first_name || "") + " " + (payload.new.last_name || "") +
                " (" + (payload.new.program || "general") + ")");
          refreshCounts();
          if (location.hash.indexOf("#/inbox") === 0 && P.views._inboxRefresh) P.views._inboxRefresh();
          if (location.hash === "" || location.hash === "#/dashboard") route();
        })
        .subscribe();
    } catch (e) { /* realtime unavailable — counts still refresh on navigation */ }
  }

  // ---------- navigation ----------
  var NAV = [
    { group: "Overview" },
    { key: "dashboard", label: "Dashboard", hash: "#/dashboard" },
    { group: "Inbox" },
    { key: "inbox-all",       label: "All Inquiries", hash: "#/inbox/all",       cnt: "all" },
    { key: "inbox-biotrain",  label: "BioTrain",      hash: "#/inbox/biotrain",  cnt: "biotrain",  sub: true },
    { key: "inbox-biolaunch", label: "BioLaunch",     hash: "#/inbox/biolaunch", cnt: "biolaunch", sub: true },
    { key: "inbox-bionatsec", label: "Bio for Nat. Security", hash: "#/inbox/bionatsec", cnt: "bionatsec", sub: true },
    { key: "inbox-general",   label: "General / Contact", hash: "#/inbox/general", cnt: "general", sub: true },
    { group: "Website Content" },
    { key: "news",      label: "News",            hash: "#/content/news" },
    { key: "press",     label: "Press Releases",  hash: "#/content/press" },
    { key: "programs",  label: "Programs",        hash: "#/content/programs" },
    { key: "resources", label: "Resources",       hash: "#/content/resources" },
    { key: "team",      label: "Team",            hash: "#/content/team" },
    { key: "board",     label: "Executive Board", hash: "#/content/board" },
    { key: "faqs",      label: "FAQs",            hash: "#/content/faqs" },
    { key: "site",      label: "Site Content",    hash: "#/content/site" },
    { group: "Administration", admin: true },
    { key: "users",    label: "Users",        hash: "#/users",    admin: true },
    { key: "activity", label: "Activity Log", hash: "#/activity" },
    { key: "settings", label: "Settings",     hash: "#/settings", admin: true },
  ];

  function renderNav() {
    var nav = $("#pa-nav");
    if (!nav) return;
    var isAdmin = P.profile && P.profile.role === "admin";
    var cur = location.hash || "#/dashboard";
    nav.innerHTML = NAV.map(function (n) {
      if (n.group) return (n.admin && !isAdmin) ? "" : '<div class="pa-group">' + esc(n.group) + "</div>";
      if (n.admin && !isAdmin) return "";
      var active = cur === n.hash || (n.key === "inbox-all" && cur.indexOf("#/inquiry/") === 0);
      var cnt = n.cnt && P.counts[n.cnt] ? '<span class="cnt">' + P.counts[n.cnt] + "</span>" : "";
      return '<a class="pa-nav' + (n.sub ? " sub" : "") + (active ? " active" : "") +
        '" href="' + n.hash + '">' + esc(n.label) + cnt + "</a>";
    }).join("");
  }

  function wireFrame() {
    $("#pa-logout").onclick = async function () {
      await P.sb.auth.signOut(); location.hash = ""; location.reload();
    };
    $("#pa-burger").onclick = function () { $("#pa-side").classList.toggle("open"); };
    $("#pa-nav").addEventListener("click", function (e) {
      if (e.target.closest("a")) $("#pa-side").classList.remove("open");
    });
  }

  // ---------- router ----------
  var unsavedGuard = null;   // set by editors: function -> bool (true = dirty)
  P.setUnsavedGuard = function (fn) { unsavedGuard = fn; };
  window.addEventListener("beforeunload", function (e) {
    if (unsavedGuard && unsavedGuard()) { e.preventDefault(); e.returnValue = ""; }
  });

  function route() {
    if (unsavedGuard && unsavedGuard()) {
      if (!confirm("You have unsaved changes. Leave without saving?")) {
        history.back(); return;
      }
    }
    unsavedGuard = null;
    var h = location.hash || "#/dashboard";
    var parts = h.replace(/^#\//, "").split("/");
    renderNav();
    var main = $("#pa-main");
    main.scrollTop = 0;
    var key = parts[0];
    if (key === "inbox")    return P.views.inbox    ? P.views.inbox(main, parts[1] || "all") : main.innerHTML = skel();
    if (key === "inquiry")  return P.views.inquiry  ? P.views.inquiry(main, parts[1]) : main.innerHTML = skel();
    if (key === "content")  {
      var v = "cms_" + (parts[1] || "news");
      return P.views[v] ? P.views[v](main, parts[2]) : main.innerHTML = emptyState("Unknown content section.");
    }
    if (key === "users")    return viewUsers(main);
    if (key === "activity") return viewActivity(main);
    if (key === "settings") return viewSettings(main);
    return viewDashboard(main);
  }
  P.route = route;

  // ---------- Dashboard ----------
  async function viewDashboard(main) {
    main.innerHTML = '<div class="pa-head"><div><h1>Dashboard</h1>' +
      '<div class="sub">Website activity at a glance.</div></div></div>' + skel(6);
    try {
      var now = new Date();
      var monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      var res = await Promise.all([
        P.sb.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        P.sb.from("inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
        P.sb.from("inquiries").select("id", { count: "exact", head: true }).in("status", ["new","in_progress","waiting","follow_up"]),
        P.sb.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
        P.sb.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "resolved"),
        P.sb.from("news_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        P.sb.from("news_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        P.sb.from("inquiries").select("id,first_name,last_name,organization,program,inquiry_type,created_at,status,assigned_to,is_read")
          .order("created_at", { ascending: false }).limit(8),
        P.sb.from("inquiries").select("program,status,created_at").gte("created_at",
          new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()),
        P.sb.from("content_activity").select("*").order("created_at", { ascending: false }).limit(8),
        P.sb.from("press_releases").select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);
      for (var i = 0; i < res.length; i++) if (res[i].error) throw res[i].error;

      var kpi = function (n, l, green) {
        return '<div class="kpi"><div class="n' + (green ? " green" : "") + '">' + n + '</div><div class="l">' + l + "</div></div>";
      };
      var drafts = (res[6].count || 0) + (res[10].count || 0);
      var rows = res[7].data || [];
      var breakdown = res[8].data || [];

      var byProgram = {}, byStatus = {};
      breakdown.forEach(function (r) {
        byProgram[r.program] = (byProgram[r.program] || 0) + 1;
        byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      });
      function bars(map, labelFn) {
        var entries = Object.keys(map).map(function (k) { return [k, map[k]]; })
          .sort(function (a, b) { return b[1] - a[1]; });
        if (!entries.length) return '<div class="pstate">No inquiries yet.</div>';
        var max = entries[0][1];
        return entries.map(function (e) {
          var pct = Math.max(6, Math.round(e[1] / max * 100));
          return '<div style="display:flex;align-items:center;gap:10px;margin:7px 0;font:600 .8rem var(--p-font)">' +
            '<span style="width:130px;color:var(--p-muted)">' + esc(labelFn(e[0])) + "</span>" +
            '<span style="flex:1;background:var(--p-bg);border-radius:6px;overflow:hidden"><span style="display:block;height:12px;width:' +
            pct + '%;background:var(--p-green);border-radius:6px"></span></span>' +
            "<span>" + e[1] + "</span></div>";
        }).join("");
      }
      var progName = function (slug) {
        var p = P.programs.find(function (x) { return x.slug === slug; });
        return p ? p.name : slug;
      };

      main.innerHTML =
        '<div class="pa-head"><div><h1>Dashboard</h1><div class="sub">Website activity at a glance.</div></div>' +
        '<a class="pb pb-pri" href="#/inbox/all">Open Inbox →</a></div>' +
        '<div class="kpis">' +
          kpi(res[0].count || 0, "New inquiries") +
          kpi(res[1].count || 0, "Unread") +
          kpi(res[2].count || 0, "Open") +
          kpi(res[3].count || 0, "This month", true) +
          kpi(res[4].count || 0, "Resolved") +
          kpi(res[5].count || 0, "News published", true) +
          kpi(drafts, "Draft content") +
        "</div>" +
        '<div class="pgrid-2">' +
          '<div class="pcard"><h3>Recent Inquiries</h3><div class="ptab-wrap" style="border:0"><table class="ptab"><tbody>' +
            (rows.length ? rows.map(function (r) {
              return '<tr class="rowlink' + (r.is_read ? "" : " unread") + '" onclick="location.hash=\'#/inquiry/' + r.id + '\'">' +
                '<td class="nm">' + esc(r.first_name + " " + r.last_name) +
                  '<div class="mut">' + esc(r.organization || "—") + "</div></td>" +
                "<td>" + esc(progName(r.program)) + '<div class="mut">' + esc(r.inquiry_type) + "</div></td>" +
                "<td>" + statusChip(r.status) + "</td>" +
                '<td class="mut">' + fmtDate(r.created_at) + "</td>" +
                '<td class="mut">' + esc(profileName(r.assigned_to) || "Unassigned") + "</td></tr>";
            }).join("") : '<tr><td class="pstate">No inquiries yet.</td></tr>') +
          "</tbody></table></div></div>" +
          '<div>' +
            '<div class="pcard"><h3>Inquiries by Program <span class="mut" style="font:400 .75rem var(--p-font)">(last 6 months)</span></h3>' + bars(byProgram, progName) + "</div>" +
            '<div class="pcard"><h3>Inquiries by Status</h3>' + bars(byStatus, function (s) { return STATUS_LABEL[s] || s; }) + "</div>" +
            '<div class="pcard"><h3>Recent Content Activity</h3>' +
              ((res[9].data || []).length ? '<ul class="tl">' + res[9].data.map(function (a) {
                return "<li><b>" + esc(profileName(a.actor_id) || "Someone") + "</b> " + esc(a.action) + " " +
                  esc(a.resource_type.replace(/_/g, " ")) + (a.resource_name ? ": <b>" + esc(a.resource_name) + "</b>" : "") +
                  '<div class="mut">' + fmtDate(a.created_at, true) + "</div></li>";
              }).join("") + "</ul>" : '<div class="pstate">No content activity yet.</div>') +
            "</div>" +
          "</div>" +
        "</div>";
    } catch (e) {
      main.innerHTML = errBox(e.message || "could not load the dashboard");
    }
  }

  // ---------- Users (admin) ----------
  async function viewUsers(main) {
    if (P.profile.role !== "admin") { main.innerHTML = emptyState("Only administrators can manage users."); return; }
    main.innerHTML = '<div class="pa-head"><div><h1>Users</h1><div class="sub">Portal staff accounts and roles.</div></div></div>' + skel();
    var r = await P.sb.from("profiles").select("*").order("created_at");
    if (r.error) { main.innerHTML = errBox(r.error.message); return; }
    var rows = r.data || [];
    main.innerHTML =
      '<div class="pa-head"><div><h1>Users</h1><div class="sub">Roles are enforced by database security, not just the interface.</div></div>' +
      '<button class="pb pb-pri" id="u-invite">Invite employee</button></div>' +
      '<div class="ptab-wrap"><table class="ptab"><thead><tr>' +
      "<th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Added</th><th></th></tr></thead><tbody>" +
      rows.map(function (u) {
        return "<tr><td class='nm'>" + esc((u.first_name + " " + u.last_name).trim() || "—") + "</td>" +
          "<td>" + esc(u.email) + "</td>" +
          "<td><select data-role='" + u.id + "'" + (u.id === P.user.id ? " disabled" : "") + ">" +
            ["admin","editor","staff","contributor"].map(function (ro) {
              return "<option value='" + ro + "'" + (u.role === ro ? " selected" : "") + ">" + ro + "</option>";
            }).join("") + "</select></td>" +
          "<td>" + (u.active ? '<span class="chip st-resolved">Active</span>' : '<span class="chip st-archived">Disabled</span>') + "</td>" +
          '<td class="mut">' + fmtDate(u.created_at) + "</td>" +
          "<td>" + (u.id === P.user.id ? '<span class="mut">you</span>' :
            '<button class="pb pb-sm ' + (u.active ? "pb-danger" : "pb-sec") + '" data-toggle="' + u.id + '">' +
            (u.active ? "Disable" : "Re-enable") + "</button>") + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<p class="mut" style="font:400 .8rem/1.6 var(--p-font);color:var(--p-muted);margin-top:12px">' +
      "Departed employees should be <b>disabled</b>, never deleted — their notes and history stay attributed.</p>";

    $("#u-invite").onclick = function () {
      alert("To invite an employee:\n\n1. Supabase Dashboard → Authentication → Users → Invite user (enter their email).\n" +
        "2. They set a password via the invite email.\n3. Their profile appears here automatically — then set their role.\n\n" +
        "Public self-signup is disabled; only invited accounts can sign in.");
    };
    main.querySelectorAll("[data-role]").forEach(function (sel) {
      sel.onchange = async function () {
        var r2 = await P.sb.from("profiles").update({ role: sel.value }).eq("id", sel.dataset.role);
        if (r2.error) { toast("Role change failed: " + r2.error.message, "err"); return; }
        toast("Role updated"); logContent("updated", "user", sel.dataset.role, sel.value);
      };
    });
    main.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.onclick = async function () {
        var u = rows.find(function (x) { return x.id === b.dataset.toggle; });
        var r2 = await P.sb.from("profiles").update({ active: !u.active }).eq("id", u.id);
        if (r2.error) { toast("Update failed: " + r2.error.message, "err"); return; }
        toast(u.active ? "Access disabled" : "Access restored");
        viewUsers(main);
      };
    });
  }

  // ---------- Activity log ----------
  async function viewActivity(main) {
    main.innerHTML = '<div class="pa-head"><div><h1>Activity Log</h1><div class="sub">Who changed what, across content and inquiries.</div></div></div>' + skel(8);
    var res = await Promise.all([
      P.sb.from("content_activity").select("*").order("created_at", { ascending: false }).limit(60),
      P.sb.from("inquiry_activity").select("*").order("created_at", { ascending: false }).limit(60),
    ]);
    if (res[0].error) { main.innerHTML = errBox(res[0].error.message); return; }
    var items = (res[0].data || []).map(function (a) {
      return { at: a.created_at, html: "<b>" + esc(profileName(a.actor_id) || "System") + "</b> " + esc(a.action) +
        " " + esc(a.resource_type.replace(/_/g, " ")) + (a.resource_name ? ": <b>" + esc(a.resource_name) + "</b>" : "") };
    }).concat((res[1].data || []).map(function (a) {
      var what = { submitted:"submitted an inquiry", viewed:"viewed an inquiry", assigned:"assigned an inquiry",
        unassigned:"removed an assignment", status_changed:"changed status", note_added:"added a note",
        tag_added:"added a tag", tag_removed:"removed a tag", read:"marked read", unread:"marked unread" }[a.event_type] || a.event_type;
      var detail = a.event_type === "status_changed" ? " (" + esc(a.previous_value || "") + " → " + esc(a.new_value || "") + ")" :
                   (a.new_value && a.event_type !== "submitted" ? " (" + esc(a.new_value) + ")" : "");
      return { at: a.created_at, html: "<b>" + esc(profileName(a.actor_id) || "Website visitor") + "</b> " + what + detail +
        ' — <a href="#/inquiry/' + a.inquiry_id + '" style="color:var(--p-green2);font-weight:600">open</a>' };
    }));
    items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    main.innerHTML =
      '<div class="pa-head"><div><h1>Activity Log</h1><div class="sub">Latest 120 events across content and inquiries.</div></div></div>' +
      '<div class="pcard">' + (items.length ? '<ul class="tl">' + items.slice(0, 120).map(function (i) {
        return "<li>" + i.html + '<div class="mut">' + fmtDate(i.at, true) + "</div></li>";
      }).join("") + "</ul>" : emptyState("No activity recorded yet.")) + "</div>";
  }

  // ---------- Settings (admin: inquiry categories) ----------
  async function viewSettings(main) {
    if (P.profile.role !== "admin") { main.innerHTML = emptyState("Only administrators can change settings."); return; }
    var cats = P.categories, progs = P.programs;
    main.innerHTML =
      '<div class="pa-head"><div><h1>Settings</h1><div class="sub">Inquiry routing configuration — forms and inboxes read these live.</div></div></div>' +
      progs.map(function (pr) {
        var list = cats.filter(function (c) { return c.program_id === pr.id; });
        return '<div class="pcard"><h3>' + esc(pr.name) + ' <span class="mut" style="font:400 .75rem var(--p-font)">(' + esc(pr.slug) + ")</span></h3>" +
          '<div class="ptab-wrap" style="border:0"><table class="ptab"><tbody>' +
          list.map(function (c) {
            return "<tr><td>" + esc(c.name) + "</td><td class='mut'>" + esc(c.slug) + "</td>" +
              "<td>" + (c.active ? '<span class="chip st-resolved">Active</span>' : '<span class="chip st-archived">Off</span>') + "</td>" +
              '<td style="text-align:right"><button class="pb pb-sm pb-sec" data-cat-toggle="' + c.id + '">' + (c.active ? "Disable" : "Enable") + "</button></td></tr>";
          }).join("") + "</tbody></table></div>" +
          '<div style="display:flex;gap:8px;margin-top:10px"><input type="text" placeholder="New category name…" data-cat-new="' + pr.id + '" ' +
          'style="flex:1;padding:8px 11px;border:1.5px solid var(--p-border);border-radius:8px;font:400 .85rem var(--p-font)">' +
          '<button class="pb pb-sm pb-pri" data-cat-add="' + pr.id + '">Add</button></div></div>';
      }).join("");
    main.querySelectorAll("[data-cat-toggle]").forEach(function (b) {
      b.onclick = async function () {
        var c = cats.find(function (x) { return x.id === b.dataset.catToggle; });
        var r = await P.sb.from("inquiry_categories").update({ active: !c.active }).eq("id", c.id);
        if (r.error) return toast(r.error.message, "err");
        await loadRefData(); viewSettings(main);
      };
    });
    main.querySelectorAll("[data-cat-add]").forEach(function (b) {
      b.onclick = async function () {
        var input = main.querySelector('[data-cat-new="' + b.dataset.catAdd + '"]');
        var name = input.value.trim(); if (!name) return;
        var r = await P.sb.from("inquiry_categories").insert({
          program_id: b.dataset.catAdd, name: name, slug: slugify(name).replace(/-/g, "_"), display_order: 99 });
        if (r.error) return toast(r.error.message, "err");
        toast("Category added"); await loadRefData(); viewSettings(main);
      };
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
