/* ============================================================
   Heartland BioWorks — file upload module (Supabase Storage).

     HBUploads.uploadFile(file, bucketName)
       -> Promise<{ url, path, fileName, fileType, size }>

   Buckets (public read; authenticated write — enforced by storage
   RLS in supabase/migrations/0002_file_uploads.sql):
     news-media | event-media | media-library

   NO FAKE UPLOADS: if Supabase is unreachable the promise rejects
   with a clear error instead of pretending a file was stored. There
   is intentionally no localStorage/dev fallback for uploads — a
   "saved" file that only exists in one browser would be worse than
   an honest failure.
   ============================================================ */
(function () {
  "use strict";

  var BUCKETS = ["news-media", "event-media", "media-library"];
  var MAX_BYTES = 50 * 1024 * 1024; // Supabase free-tier per-file ceiling

  function client() {
    return window.hbSupabaseClient ? window.hbSupabaseClient() : null;
  }

  function safeName(name) {
    var dot = name.lastIndexOf(".");
    var base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
    var ext = dot > 0 ? name.slice(dot).toLowerCase().replace(/[^.a-z0-9]/g, "") : "";
    return base + ext;
  }

  async function uploadFile(file, bucketName) {
    if (!file) throw new Error("Choose a file first.");
    if (BUCKETS.indexOf(bucketName) === -1) throw new Error("Unknown upload bucket: " + bucketName);
    if (file.size > MAX_BYTES) throw new Error("File is too large (max 50 MB). Compress it or host it externally and paste the URL.");
    var sb = client();
    if (!sb) throw new Error("Upload service unavailable — the file was NOT uploaded. Check your connection and reload.");

    var path = new Date().toISOString().slice(0, 10) + "-" +
      Math.random().toString(36).slice(2, 8) + "/" + safeName(file.name);

    var res = await sb.storage.from(bucketName).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined
    });
    if (res.error) throw new Error("Upload failed: " + (res.error.message || "unknown error") + " — the file was NOT uploaded.");

    var pub = sb.storage.from(bucketName).getPublicUrl(path);
    var url = pub && pub.data ? pub.data.publicUrl : "";
    if (!url) throw new Error("Upload stored but no public URL was returned. Try again.");

    return { url: url, path: path, fileName: file.name, fileType: file.type || "", size: file.size };
  }

  window.HBUploads = { uploadFile: uploadFile };
})();
