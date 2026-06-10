<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Staff Login – Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>*,*::before,*::after{box-sizing:border-box;}body{margin:0;font-family:'Inter',system-ui,sans-serif;color:var(--hb-text);background:#fff;-webkit-font-smoothing:antialiased;}a{color:inherit;text-decoration:none;}</style>
</head>
<body data-page="login">
<div id="hb-header"></div>

<div class="hbl-wrap">
  <div class="hbl-card">
    <h1>Staff Login</h1>
    <p class="hbl-sub">Sign in to manage News, Events, and the Media Library.</p>
    <form id="loginForm" novalidate>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" autocomplete="username" placeholder="you@heartlandbioworks.org" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" placeholder="••••••••" required />
      <div class="hbl-err" id="loginErr" role="alert"></div>
      <button type="submit" class="hbl-btn">Sign In</button>
    </form>
    <p class="hbl-note">Staff accounts are managed in Supabase (Authentication → Users). Forgot your password or need an account? Contact the site administrator.</p>
  </div>
</div>

<div id="hb-footer"></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/supabase-config.js"></script>
<script src="assets/auth.js"></script>
<script src="assets/site.js" defer></script>
<script>
(function () {
  // already signed in? go straight to the dashboard
  if (window.HBAuth) HBAuth.getUser().then(function (u) { if (u) window.location.replace("dashboard.html"); });
  var form = document.getElementById("loginForm");
  var err = document.getElementById("loginErr");
  var btn = form.querySelector(".hbl-btn");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    err.classList.remove("show"); err.textContent = "";
    btn.disabled = true; btn.textContent = "Signing in…";
    var res = await HBAuth.login(document.getElementById("email").value, document.getElementById("password").value);
    if (res.ok) { window.location.href = "dashboard.html"; return; }
    btn.disabled = false; btn.textContent = "Sign In";
    err.textContent = res.error; err.classList.add("show");
  });
})();
</script>
</body>
</html>
