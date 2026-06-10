/* ============================================================
   Heartland BioWorks — content store (data abstraction layer).

   Single read/write API used by BOTH the public pages and the
   dashboard, so public pages never hardcode content:

     HBStore.getAll("news" | "events" | "media")      -> all items
     HBStore.getPublished(type)                       -> Published only
     HBStore.create(type, item)                       -> item (id assigned)
     HBStore.update(type, id, patch)                  -> item | null
     HBStore.remove(type, id)                         -> boolean
     HBStore.toggleStatus(type, id)                   -> item | null
     HBStore.reset(type)                              -> restore seeds

   STORAGE MODEL (static-host / mock mode):
   - Seeds ship in /data/news.js, /data/events.js, /data/media.js.
   - Dashboard edits are persisted to localStorage and merged over
     the seeds (edits win; deletions tombstoned).
   - LIMITATION: on a static host, localStorage edits are visible
     only in the browser where they were made. They demonstrate the
     full workflow but are not site-wide publishing.

   CONNECTING A REAL BACKEND LATER:
   - Wix CMS:    replace load()/persist() with wixData.query/insert/
                 update/remove against News/Events/Media collections.
   - Supabase:   replace with supabase.from("news").select()/upsert()/
                 delete(); gate writes with Row Level Security.
   - Firebase:   replace with Firestore collection reads/writes.
   Only this file needs to change — pages and dashboard use HBStore.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "hb-content-v1";

  var SEEDS = {
    news: (window.HB_SEED_NEWS || []),
    events: (window.HB_SEED_EVENTS || []),
    media: (window.HB_SEED_MEDIA || [])
  };

  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function persistOverrides(ov) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(ov)); } catch (e) { /* storage unavailable */ }
  }
  // overrides shape: { news: { edited: {id: item}, deleted: [id], created: [item] }, ... }
  function bucket(ov, type) {
    ov[type] = ov[type] || { edited: {}, deleted: [], created: [] };
    return ov[type];
  }

  function getAll(type) {
    var ov = loadOverrides();
    var b = bucket(ov, type);
    var out = [];
    (SEEDS[type] || []).forEach(function (seed) {
      if (b.deleted.indexOf(seed.id) !== -1) return;
      out.push(b.edited[seed.id] ? b.edited[seed.id] : seed);
    });
    b.created.forEach(function (item) {
      if (b.deleted.indexOf(item.id) !== -1) return;
      out.push(b.edited[item.id] ? b.edited[item.id] : item);
    });
    return out.map(function (i) { return JSON.parse(JSON.stringify(i)); });
  }

  function getPublished(type) {
    return getAll(type).filter(function (i) { return i.status === "Published"; });
  }

  function create(type, item) {
    var ov = loadOverrides();
    var b = bucket(ov, type);
    item = JSON.parse(JSON.stringify(item));
    item.id = item.id || (type + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7));
    b.created.push(item);
    persistOverrides(ov);
    return item;
  }

  function update(type, id, patch) {
    var current = getAll(type).filter(function (i) { return i.id === id; })[0];
    if (!current) return null;
    var next = Object.assign({}, current, patch, { id: id });
    var ov = loadOverrides();
    var b = bucket(ov, type);
    b.edited[id] = next;
    persistOverrides(ov);
    return next;
  }

  function remove(type, id) {
    var ov = loadOverrides();
    var b = bucket(ov, type);
    if (b.deleted.indexOf(id) === -1) b.deleted.push(id);
    delete b.edited[id];
    b.created = b.created.filter(function (i) { return i.id !== id; });
    persistOverrides(ov);
    return true;
  }

  function toggleStatus(type, id) {
    var current = getAll(type).filter(function (i) { return i.id === id; })[0];
    if (!current) return null;
    return update(type, id, { status: current.status === "Published" ? "Draft" : "Published" });
  }

  function reset(type) {
    var ov = loadOverrides();
    if (type) { delete ov[type]; persistOverrides(ov); }
    else { try { localStorage.removeItem(LS_KEY); } catch (e) {} }
  }

  window.HBStore = {
    getAll: getAll,
    getPublished: getPublished,
    create: create,
    update: update,
    remove: remove,
    toggleStatus: toggleStatus,
    reset: reset
  };
})();
