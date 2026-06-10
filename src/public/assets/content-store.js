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
      fields: { title: "title", slug: "slug", type: "type", publishDate: "publish_date", author: "author", excerpt: "excerpt", body: "body", featuredImageUrl: "featured_image_url", featuredImagePath: "featured_image_path", attachmentUrl: "attachment_url", attachmentPath: "attachment_path", attachmentName: "attachment_name", attachmentType: "attachment_type", externalUrl: "external_url", tags: "tags", status: "status" }
    },
    events: {
      table: "events",
      seed: function () { return window.HB_SEED_EVENTS || []; },
      fields: { title: "title", eventDate: "event_date", startTime: "start_time", endTime: "end_time", location: "location", eventType: "event_type", description: "description", registrationUrl: "registration_url", hostOrganization: "host_organization", thumbnailUrl: "thumbnail_url", thumbnailPath: "thumbnail_path", attachmentUrl: "attachment_url", attachmentPath: "attachment_path", attachmentName: "attachment_name", attachmentType: "attachment_type", tags: "tags", status: "status" }
    },
    media: {
      table: "media_assets",
      seed: function () { return window.HB_SEED_MEDIA || []; },
      fields: { title: "title", assetType: "asset_type", description: "description", fileUrl: "file_url", filePath: "file_path", fileName: "file_name", fileType: "file_type", fileSize: "file_size", thumbnailUrl: "thumbnail_url", thumbnailPath: "thumbnail_path", embedUrl: "embed_url", duration: "duration", isVideo: "is_video", uploadDate: "upload_date", tags: "tags", status: "status" }
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
      out[k] = v == null ? (k === "tags" ? [] : (k === "isVideo" ? false : "")) : v;
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

  /* ---------- contact submissions + newsletter (Supabase only) ----------
     Public visitors may INSERT (with consent) but never read; staff
     read/manage via RLS. No seed fallback — these are private records. */
  var CONTACT_FIELDS = { firstName: "first_name", lastName: "last_name", jobTitle: "job_title", email: "email", country: "country", phone: "phone", organizationName: "organization_name", organizationType: "organization_type", interests: "interests", message: "message", consent: "consent", status: "status", internalNotes: "internal_notes", createdAt: "created_at" };
  var SUB_FIELDS = { firstName: "first_name", lastName: "last_name", email: "email", organization: "organization", jobTitle: "job_title", source: "source", consent: "consent", status: "status", createdAt: "created_at" };

  function mapFrom(fields, row) {
    var out = { id: row.id };
    Object.keys(fields).forEach(function (k) {
      var v = row[fields[k]];
      out[k] = v == null ? (k === "interests" ? [] : (k === "consent" ? false : "")) : v;
    });
    return out;
  }
  function mapTo(fields, item) {
    var out = {};
    Object.keys(fields).forEach(function (k) {
      if (k !== "createdAt" && item[k] !== undefined) out[fields[k]] = item[k];
    });
    return out;
  }

  async function submitContact(payload) {
    var sb = client();
    if (!sb) throw new Error("The contact service is unavailable right now. Please email heartlandbioworks@theari.us instead.");
    var res = await sb.from("contact_submissions").insert(mapTo(CONTACT_FIELDS, payload));
    if (res.error) throw fail("send your message", res.error);
    return true;
  }
  async function getContacts() {
    var sb = client();
    if (!sb) throw new Error("Contact service unavailable. Check your connection and reload.");
    var res = await sb.from("contact_submissions").select("*");
    if (res.error) throw fail("load contact requests", res.error);
    return (res.data || []).map(function (r) { return mapFrom(CONTACT_FIELDS, r); });
  }
  async function updateContact(id, patch) {
    var sb = client();
    if (!sb) throw new Error("Contact service unavailable — nothing was saved.");
    var res = await sb.from("contact_submissions").update(mapTo(CONTACT_FIELDS, patch)).eq("id", id).select().single();
    if (res.error) throw fail("save contact changes", res.error);
    return mapFrom(CONTACT_FIELDS, res.data);
  }
  async function addSubscriber(payload) {
    var sb = client();
    if (!sb) throw new Error("Subscription service unavailable. Please email heartlandbioworks@theari.us to subscribe.");
    var res = await sb.from("newsletter_subscribers").insert(mapTo(SUB_FIELDS, payload));
    if (res.error) throw fail("subscribe", res.error);
    return true;
  }
  async function getSubscribers() {
    var sb = client();
    if (!sb) throw new Error("Subscriber service unavailable. Check your connection and reload.");
    var res = await sb.from("newsletter_subscribers").select("*");
    if (res.error) throw fail("load subscribers", res.error);
    return (res.data || []).map(function (r) { return mapFrom(SUB_FIELDS, r); });
  }
  async function updateSubscriber(id, patch) {
    var sb = client();
    if (!sb) throw new Error("Subscriber service unavailable — nothing was saved.");
    var res = await sb.from("newsletter_subscribers").update(mapTo(SUB_FIELDS, patch)).eq("id", id).select().single();
    if (res.error) throw fail("save subscriber changes", res.error);
    return mapFrom(SUB_FIELDS, res.data);
  }

  window.HBStore = {
    getPublished: getPublished,
    getAll: getAll,
    create: create,
    update: update,
    remove: remove,
    toggleStatus: toggleStatus,
    submitContact: submitContact,
    getContacts: getContacts,
    updateContact: updateContact,
    addSubscriber: addSubscriber,
    getSubscribers: getSubscribers,
    updateSubscriber: updateSubscriber
  };
})();
