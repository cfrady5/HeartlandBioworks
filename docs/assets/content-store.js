/* ============================================================
   Heartland BioWorks — content store (Supabase-backed).

   Single async read/write API used by BOTH the public pages and
   the dashboard:

     HBStore.getPublished(type) -> Promise<items>   (public pages)
     HBStore.getAll(type)       -> Promise<items>   (dashboard; RLS
                                   returns drafts only when signed in)
     HBStore.create(type, item) -> Promise<item>
     HBStore.update(type, id, patch) -> Promise<item>
     HBStore.remove(type, id)   -> Promise<true>
     HBStore.toggleStatus(type, id) -> Promise<item>

   type is "news" | "events" | "media".

   Access control lives in Postgres Row Level Security:
   anonymous visitors can SELECT Published rows only; writes and
   draft reads require a signed-in staff session (Supabase Auth).

   RESILIENCE: if Supabase is unreachable (offline, CDN blocked),
   public reads fall back to the version-controlled seeds in
   /data/*.js so the public site never renders empty. Writes never
   fall back — they fail loudly so staff know nothing was saved.
   ============================================================ */
(function () {
  "use strict";

  // table + camelCase<->snake_case field maps per content type
  var TYPES = {
    news: {
      table: "news_items",
      seed: function () { return window.HB_SEED_NEWS || []; },
      fields: { title: "title", slug: "slug", type: "type", publishDate: "publish_date", author: "author", excerpt: "excerpt", body: "body", featuredImage: "featured_image", externalUrl: "external_url", tags: "tags", status: "status" }
    },
    events: {
      table: "events",
      seed: function () { return window.HB_SEED_EVENTS || []; },
      fields: { title: "title", eventDate: "event_date", startTime: "start_time", endTime: "end_time", location: "location", eventType: "event_type", description: "description", registrationUrl: "registration_url", hostOrganization: "host_organization", tags: "tags", status: "status" }
    },
    media: {
      table: "media_assets",
      seed: function () { return window.HB_SEED_MEDIA || []; },
      fields: { title: "title", assetType: "asset_type", description: "description", fileUrl: "file_url", thumbnailUrl: "thumbnail_url", uploadDate: "upload_date", tags: "tags", status: "status" }
    }
  };

  function client() {
    return window.hbSupabaseClient ? window.hbSupabaseClient() : null;
  }
  function cfg(type) {
    var c = TYPES[type];
    if (!c) throw new Error("Unknown content type: " + type);
    return c;
  }
  function fromDb(type, row) {
    var c = cfg(type), out = { id: row.id };
    Object.keys(c.fields).forEach(function (k) {
      var v = row[c.fields[k]];
      out[k] = v == null ? (k === "tags" ? [] : "") : v;
    });
    return out;
  }
  function toDb(type, item) {
    var c = cfg(type), out = {};
    Object.keys(c.fields).forEach(function (k) {
      if (item[k] !== undefined) out[c.fields[k]] = item[k];
    });
    return out;
  }
  function fail(action, error) {
    var msg = error && error.message ? error.message : "Unknown error";
    var e = new Error("Could not " + action + ": " + msg);
    e.cause = error;
    return e;
  }

  async function getPublished(type) {
    var c = cfg(type);
    var sb = client();
    if (sb) {
      try {
        var res = await sb.from(c.table).select("*").eq("status", "Published");
        if (!res.error) return (res.data || []).map(function (r) { return fromDb(type, r); });
      } catch (e) { /* fall through to seeds */ }
    }
    // Fallback: version-controlled seeds keep the public site rendering
    // even if Supabase is unreachable. (Read-only — no writes here.)
    return c.seed().filter(function (i) { return i.status === "Published"; })
      .map(function (i) { return JSON.parse(JSON.stringify(i)); });
  }

  async function getAll(type) {
    var c = cfg(type);
    var sb = client();
    if (!sb) throw new Error("Content service unavailable. Check your connection and reload.");
    var res = await sb.from(c.table).select("*");
    if (res.error) throw fail("load " + type, res.error);
    return (res.data || []).map(function (r) { return fromDb(type, r); });
  }

  async function create(type, item) {
    var sb = client();
    if (!sb) throw new Error("Content service unavailable — nothing was saved.");
    var res = await sb.from(cfg(type).table).insert(toDb(type, item)).select().single();
    if (res.error) throw fail("create item", res.error);
    return fromDb(type, res.data);
  }

  async function update(type, id, patch) {
    var sb = client();
    if (!sb) throw new Error("Content service unavailable — nothing was saved.");
    var res = await sb.from(cfg(type).table).update(toDb(type, patch)).eq("id", id).select().single();
    if (res.error) throw fail("save changes", res.error);
    return fromDb(type, res.data);
  }

  async function remove(type, id) {
    var sb = client();
    if (!sb) throw new Error("Content service unavailable — nothing was deleted.");
    var res = await sb.from(cfg(type).table).delete().eq("id", id);
    if (res.error) throw fail("delete item", res.error);
    return true;
  }

  async function toggleStatus(type, id) {
    var items = await getAll(type);
    var current = items.filter(function (i) { return i.id === id; })[0];
    if (!current) throw new Error("Item not found.");
    return update(type, id, { status: current.status === "Published" ? "Draft" : "Published" });
  }

  window.HBStore = {
    getPublished: getPublished,
    getAll: getAll,
    create: create,
    update: update,
    remove: remove,
    toggleStatus: toggleStatus
  };
})();
