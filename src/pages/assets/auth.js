/* ============================================================
   Heartland BioWorks — auth module (MOCK).

   This is a demo/mock auth layer so the dashboard workflow can be
   built and tested on a static host. IT IS NOT SECURITY: anything
   client-side can be bypassed, and the mock accepts any staff
   email + non-empty password. Do not store sensitive data behind it.

   API (used by login.html and dashboard.html):
     HBAuth.login(email, password) -> { ok, error }
     HBAuth.logout()
     HBAuth.isAuthed()             -> boolean
     HBAuth.currentUser()          -> { email } | null
     HBAuth.requireAuth()          -> redirects to login.html if not
                                      authed; returns boolean

   CONNECTING REAL AUTH LATER (only this file changes):
   - Wix Members:  use wix-members-frontend authentication.login();
                   gate the dashboard page to a "Staff" member role.
   - Supabase:     supabase.auth.signInWithPassword(); store session;
                   protect content tables with Row Level Security.
   - Firebase:     firebase.auth().signInWithEmailAndPassword().
   ============================================================ */
(function () {
  "use strict";

  var SESSION_KEY = "hb-auth-session-v1";

  function login(email, password) {
    email = (email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (!password) {
      return { ok: false, error: "Enter your password." };
    }
    // MOCK: accept any well-formed email + non-empty password.
    // Replace with a real credential check (see header comments).
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: email, at: Date.now() }));
    } catch (e) { return { ok: false, error: "Browser storage unavailable." }; }
    return { ok: true };
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function currentUser() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  function isAuthed() { return !!currentUser(); }

  // Protected-route guard: call at the top of any protected page.
  function requireAuth() {
    if (isAuthed()) return true;
    window.location.replace("login.html");
    return false;
  }

  window.HBAuth = {
    login: login,
    logout: logout,
    isAuthed: isAuthed,
    currentUser: currentUser,
    requireAuth: requireAuth
  };
})();
