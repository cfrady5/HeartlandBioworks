/* ============================================================
   Heartland BioWorks — shared chrome injector.
   One definition of the navbar + footer, mounted into every page
   via <div id="hb-header"></div> and <div id="hb-footer"></div>.

   Per-page config comes from <body> data attributes:
     data-page="home|programs|biotrain|biolaunch|biocan|biodefense
                |resources|about|contact"   -> active nav highlight
     data-breadcrumb="Programs > BioTrain"   -> deep-page breadcrumb
   ============================================================ */
(function () {
  "use strict";

  var LOGO = "https://static.wixstatic.com/media/fcced6_4c68e46b8f1c4c089a46ca9a416c50a2~mv2.png";

  // Top-level nav model. `key` matches body[data-page] for active state.
  var NAV = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "programs", label: "Programs", href: "programs.html", children: [
      { label: "All Programs", href: "programs.html", ico: "🗂️" },
      { label: "BioTrain", href: "biotrain.html", ico: "🧬" },
      { label: "BioLaunch", href: "biolaunch.html", ico: "🚀" },
      { label: "BioCAN", href: "biocan.html", ico: "⚗️" },
      { label: "BioDefense", href: "biodefense.html", ico: "🛡️" }
    ]},
    { key: "resources", label: "Resources", href: "news.html", children: [
      { key: "news", label: "News & Media", href: "news.html", ico: "📰" },
      { key: "events", label: "Upcoming Events", href: "events.html", ico: "📅" },
      { key: "media", label: "Media Library", href: "media-library.html", ico: "📚" }
    ]},
    { key: "about", label: "About", href: "about.html", children: [
      { key: "about", label: "About Us", href: "about.html", ico: "🏛️" },
      { key: "team", label: "Meet the Team", href: "team.html", ico: "👥" },
      { key: "faqs", label: "FAQs", href: "faqs.html", ico: "❓" }
    ]}
  ];

  var page = document.body.getAttribute("data-page") || "";

  var caret = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

  function navItemHtml(item) {
    var childActive = (item.children || []).some(function (c) { return c.key === page; });
    var activeCls = (item.key === page || childActive) ? " is-active" : "";
    if (!item.children) {
      return '<li><a class="hb-link' + activeCls + '" href="' + item.href + '"' +
        (item.key === page ? ' aria-current="page"' : '') + '>' + item.label + '</a></li>';
    }
    var drop = item.children.map(function (c) {
      var on = c.key === page;
      return '<li><a href="' + c.href + '"' + (on ? ' class="is-active" aria-current="page"' : '') +
        '><span class="hb-dd-ico" aria-hidden="true">' + c.ico + '</span>' + c.label + '</a></li>';
    }).join("");
    return '<li class="hb-has-drop">' +
      '<button class="hb-link' + activeCls + '" type="button" aria-haspopup="true" aria-expanded="false">' +
        item.label + " " + caret + '</button>' +
      '<ul class="hb-drop" role="menu">' + drop + '</ul></li>';
  }

  function mobileHtml() {
    var out = '<a href="index.html"' + (page === "home" ? ' aria-current="page"' : '') + '>Home</a>';
    NAV.forEach(function (item) {
      if (item.key === "home") return;
      if (!item.children) { out += '<a href="' + item.href + '">' + item.label + '</a>'; return; }
      out += '<div class="hb-mgroup">' + item.label + '</div>';
      item.children.forEach(function (c) {
        out += '<a class="hb-sub" href="' + c.href + '"' + (c.key === page ? ' aria-current="page"' : '') + '>' + c.label + '</a>';
      });
    });
    out += '<a href="contact.html"' + (page === "contact" ? ' aria-current="page"' : '') + '>Contact Us</a>';
    return out;
  }

  function headerHtml() {
    return '<nav class="hb-nav" aria-label="Primary">' +
      '<div class="hb-nav-inner">' +
        '<a class="hb-logo" href="index.html" aria-label="Heartland BioWorks — Home">' +
          '<img src="' + LOGO + '" alt="Heartland BioWorks" /></a>' +
        '<ul class="hb-links">' + NAV.map(navItemHtml).join("") + '</ul>' +
        '<a class="hb-cta" href="contact.html">Contact Us</a>' +
        '<button class="hb-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="hb-mobile">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="hb-mobile" id="hb-mobile">' + mobileHtml() + '</div>' +
    '</nav>';
  }

  function breadcrumbHtml(spec) {
    // spec like "Programs > BioTrain"; we prepend Home and link known crumbs.
    var hrefByLabel = { "Programs": "programs.html", "Home": "index.html" };
    var parts = spec.split(">").map(function (s) { return s.trim(); }).filter(Boolean);
    var crumbs = [{ label: "Home", href: "index.html" }];
    parts.forEach(function (p) { crumbs.push({ label: p, href: hrefByLabel[p] || null }); });
    var items = crumbs.map(function (c, i) {
      var last = i === crumbs.length - 1;
      var sep = i > 0 ? '<li class="hb-sep" aria-hidden="true">/</li>' : "";
      if (last || !c.href) return sep + '<li aria-current="page">' + c.label + "</li>";
      return sep + '<li><a href="' + c.href + '">' + c.label + "</a></li>";
    }).join("");
    return '<nav class="hb-breadcrumb" aria-label="Breadcrumb"><ol>' + items + "</ol></nav>";
  }

  function footerHtml() {
    return '<footer class="hb-footer" aria-label="Site footer"><div class="hb-footer-inner">' +
      '<div class="hb-footer-top">' +
        '<div class="hb-fbrand">' +
          '<a href="index.html" aria-label="Heartland BioWorks — home"><img src="' + LOGO + '" alt="Heartland BioWorks" /></a>' +
          '<p>Indiana’s federally designated biomanufacturing Regional Tech Hub, powered by the Applied Research Institute — connecting workforce, research, industry, and government to grow the state’s bioeconomy.</p>' +
          '<div class="hb-fcontact">' +
            '<a href="mailto:heartlandbioworks@theari.us">✉ heartlandbioworks@theari.us</a>' +
            '<a href="contact.html">📍 16 Tech Innovation District, Indianapolis, IN</a>' +
          '</div>' +
        '</div>' +
        '<div class="hb-fcol"><h4>Programs</h4><ul>' +
          '<li><a href="programs.html">All Programs</a></li>' +
          '<li><a href="biotrain.html">BioTrain</a></li>' +
          '<li><a href="biolaunch.html">BioLaunch</a></li>' +
          '<li><a href="biocan.html">BioCAN</a></li>' +
          '<li><a href="biodefense.html">BioDefense</a></li>' +
        '</ul></div>' +
        '<div class="hb-fcol"><h4>Resources</h4><ul>' +
          '<li><a href="news.html">News &amp; Media</a></li>' +
          '<li><a href="events.html">Upcoming Events</a></li>' +
          '<li><a href="media-library.html">Media Library</a></li>' +
          '<li><a href="biocan.html#ecosystem-map">Ecosystem Map</a></li>' +
        '</ul></div>' +
        '<div class="hb-fcol"><h4>About</h4><ul>' +
          '<li><a href="about.html">About Us</a></li>' +
          '<li><a href="team.html">Meet the Team</a></li>' +
          '<li><a href="faqs.html">FAQs</a></li>' +
          '<li><a href="contact.html">Contact Us</a></li>' +
          '<div class="hb-fnews">' +
            '<p>Monthly funding, training, and BioCAN updates. No spam.</p>' +
            '<form class="hb-fnews-row" data-hb-news novalidate>' +
              '<input type="email" name="email" placeholder="you@org.com" aria-label="Email address" required />' +
              '<button type="submit">Subscribe</button>' +
            '</form>' +
          '</div>' +
        '</ul></div>' +
      '</div>' +
      '<div class="hb-footer-bot">' +
        '<span>© 2026 Heartland BioWorks — a project of the Applied Research Institute. Indiana’s federally designated biomanufacturing Regional Tech Hub.</span>' +
        '<div class="hb-fbot-links"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="login.html">Staff Login</a></div>' +
        '<div class="hb-fsocial">' +
          '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>' +
          '<a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg></a>' +
          '<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div></footer>';
  }

  // ---- mount ----
  var headerMount = document.getElementById("hb-header");
  if (headerMount) {
    var bc = document.body.getAttribute("data-breadcrumb");
    headerMount.innerHTML = headerHtml() + (bc ? breadcrumbHtml(bc) : "");
  }
  var footerMount = document.getElementById("hb-footer");
  if (footerMount) footerMount.innerHTML = footerHtml();

  // ---- behaviour ----
  var burger = document.querySelector(".hb-burger");
  var mobile = document.getElementById("hb-mobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // keyboard-accessible dropdowns
  var dropItems = document.querySelectorAll(".hb-has-drop");
  dropItems.forEach(function (li) {
    var btn = li.querySelector(".hb-link");
    var menu = li.querySelector(".hb-drop");
    if (!btn || !menu) return;
    var closeTimeout;
    function close() { clearTimeout(closeTimeout); li.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    function open() {
      clearTimeout(closeTimeout);
      dropItems.forEach(function (o) { if (o !== li) { o.classList.remove("open"); var b = o.querySelector(".hb-link"); if (b) b.setAttribute("aria-expanded", "false"); } });
      li.classList.add("open"); btn.setAttribute("aria-expanded", "true");
    }
    // No open delay; add a 300ms close delay so the cursor can travel from
    // the trigger into the menu without it snapping shut.
    function closeDelayed() { clearTimeout(closeTimeout); closeTimeout = setTimeout(close, 300); }
    li.addEventListener("mouseenter", open);
    li.addEventListener("mouseleave", closeDelayed);
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      li.classList.contains("open") ? close() : open();
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(); var f = menu.querySelector("a"); if (f) f.focus(); }
      else if (e.key === "Escape") { close(); }
    });
    menu.addEventListener("keydown", function (e) {
      var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
      var i = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (links[i + 1] || links[0]).focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); (links[i - 1] || links[links.length - 1]).focus(); }
      else if (e.key === "Escape") { close(); btn.focus(); }
    });
    li.addEventListener("focusout", function (e) {
      if (!li.contains(e.relatedTarget)) close();
    });
  });
  document.addEventListener("click", function (e) {
    dropItems.forEach(function (li) {
      if (!li.contains(e.target)) { li.classList.remove("open"); var b = li.querySelector(".hb-link"); if (b) b.setAttribute("aria-expanded", "false"); }
    });
  });

  // footer newsletter -> hand off to the Wix parent like the main form
  document.querySelectorAll("[data-hb-news]").forEach(function (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var input = form.querySelector("input[name=email]");
      var btn = form.querySelector("button");
      var email = input ? input.value.trim() : "";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (btn) { btn.textContent = "Enter a valid email"; setTimeout(function () { btn.textContent = "Subscribe"; }, 2200); }
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = "Subscribing…"; }
      try {
        if (window.HBStore && HBStore.addSubscriber) {
          await HBStore.addSubscriber({ email: email, source: "Newsletter", consent: true, status: "Active" });
        } else if (window.parent) {
          window.parent.postMessage({ type: "formSubmit", formType: "newsletter", data: { email: email } }, "*");
        }
        if (btn) btn.textContent = "Subscribed ✓";
      } catch (err) {
        if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
      }
    });
  });

  // iframe auto-resize for the Wix embed (covers every page)
  function postH() {
    var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (window.parent) window.parent.postMessage({ type: "resize", height: h }, "*");
  }
  if ("ResizeObserver" in window) new ResizeObserver(postH).observe(document.body);
  window.addEventListener("load", postH);
  window.addEventListener("resize", postH);
  setTimeout(postH, 300); setTimeout(postH, 900);
})();
