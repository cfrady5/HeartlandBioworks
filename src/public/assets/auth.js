/* ============================================================
   Heartland BioWorks — auth module (Supabase Auth).

   Real staff authentication backed by Supabase. Staff accounts are
   created in Supabase Dashboard → Authentication → Users → Add user
   (and public sign-ups should stay disabled so only invited staff
   can log in). Sessions persist in the browser via supabase-js.

   API (all auth-state functions are async because the session is
   verified against Supabase):
     HBAuth.login(email, password) -> Promise<{ ok, error }>
     HBAuth.logout()               -> Promise<void>
     HBAuth.getUser()              -> Promise<{ email } | null>
     HBAuth.requireAuth()          -> Promise<boolean>; redirects to
                                      login.html when signed out
   ============================================================ */
(function () {
  "use strict";

  function client() {
    return window.hbSupabaseClient ? window.hbSupabaseClient() : null;
  }

  async function login(email, password) {
    email = (email || "").trim();
    // Username support: "tyoder" -> "tyoder@heartlandbioworks.test".
    // Full email addresses are used as-is.
    if (email && email.indexOf("@") === -1) {
      email = email.toLowerCase() + "@heartlandbioworks.test";
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { ok: false, error: "Enter a valid email address or username." };
    }
    if (!password) {
      return { ok: false, error: "Enter your password." };
    }
    var sb = client();
    if (!sb) return { ok: false, error: "Authentication service unavailable. Check your connection and reload." };
    try {
      var res = await sb.auth.signInWithPassword({ email: email, password: password });
      if (res.error) {
        var msg = /invalid login credentials/i.test(res.error.message)
          ? "Incorrect email or password."
          : res.error.message;
        return { ok: false, error: msg };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Could not reach the authentication service. Try again." };
    }
  }

  async function logout() {
    var sb = client();
    if (sb) { try { await sb.auth.signOut(); } catch (e) { /* already signed out */ } }
  }

  async function getUser() {
    var sb = client();
    if (!sb) return null;
    try {
      var res = await sb.auth.getSession();
      var session = res.data ? res.data.session : null;
      return session && session.user ? { email: session.user.email } : null;
    } catch (e) { return null; }
  }

  // Protected-route guard: await at the top of any protected page.
  async function requireAuth() {
    var user = await getUser();
    if (user) return true;
    window.location.replace("login.html");
    return false;
  }

  window.HBAuth = {
    login: login,
    logout: logout,
    getUser: getUser,
    requireAuth: requireAuth
  };
})();
