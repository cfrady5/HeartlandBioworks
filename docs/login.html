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
    <p class="hbl-note"><strong>Demo mode:</strong> this is mock authentication for previewing the staff dashboard — any valid email and any password will sign you in. Connect Wix Members, Supabase, or Firebase in <code>assets/auth.js</code> for real accounts.</p>
  </div>
</div>

<div id="hb-footer"></div>
<script src="assets/auth.js"></script>
<script src="assets/site.js" defer></script>
<script>
(function () {
  // already signed in? go straight to the dashboard
  if (window.HBAuth && HBAuth.isAuthed()) { window.location.replace("dashboard.html"); return; }
  var form = document.getElementById("loginForm");
  var err = document.getElementById("loginErr");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("show"); err.textContent = "";
    var res = HBAuth.login(form.email.value, form.password.value);
    if (res.ok) { window.location.href = "dashboard.html"; }
    else { err.textContent = res.error; err.classList.add("show"); }
  });
})();
</script>
</body>
</html>
