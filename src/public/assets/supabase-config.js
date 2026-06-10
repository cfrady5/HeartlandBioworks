/* ============================================================
   Heartland BioWorks — Supabase configuration.

   These values are SAFE to ship in client code: the publishable
   key only grants what Row Level Security allows (public visitors
   can read Published content; writes require a signed-in staff
   session). Keep the service_role key OUT of this repo — it is
   never needed in the browser.

   Project: heartland-bioworks (rxuqpprzmccaeeayweyd, us-east-2)
   Rotate the key in Supabase Dashboard → Settings → API if needed,
   then update it here.
   ============================================================ */
window.HB_SUPABASE = {
  url: "https://rxuqpprzmccaeeayweyd.supabase.co",
  key: "sb_publishable_ecfIod1MsqRyvw2FHXTeVA_gGyK7WwY"
};

/* Single shared client for all modules (auth + content). Returns null
   if the supabase-js CDN script failed to load — callers fall back. */
window.hbSupabaseClient = function () {
  if (window.__hbSupabase) return window.__hbSupabase;
  if (!window.supabase || !window.supabase.createClient) return null;
  window.__hbSupabase = window.supabase.createClient(window.HB_SUPABASE.url, window.HB_SUPABASE.key);
  return window.__hbSupabase;
};
