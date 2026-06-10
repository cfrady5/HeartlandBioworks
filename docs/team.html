<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meet the Team – Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>*,*::before,*::after{box-sizing:border-box;}body{margin:0;font-family:'Inter',system-ui,sans-serif;color:var(--hb-text);background:#fff;-webkit-font-smoothing:antialiased;}a{color:inherit;text-decoration:none;}img{max-width:100%;}</style>
</head>
<body data-page="team" data-breadcrumb="About > Meet the Team">
<div id="hb-header"></div>

<section class="hb-pagehero">
  <div class="hb-pagehero-inner">
    <h1>Meet the Team</h1>
    <p>The Heartland BioWorks leadership team brings together expertise in biotechnology, workforce development, commercialization, federal funding, and ecosystem growth to advance Indiana's biomanufacturing future.</p>
  </div>
</section>

<main class="hb-pagebody">
  <div class="hb-pagebody-inner">
    <input type="search" class="faqp-search" id="teamSearch" placeholder="Search team members..." aria-label="Search team members" />
    <div class="team-grid" id="teamGrid"></div>
    <div class="hbc-empty" id="teamEmpty" style="display:none;">No team members match your search.</div>
  </div>
</main>

<div id="hb-footer"></div>
<script src="assets/site.js" defer></script>
<script>
// Team data — single source for the page; cards are rendered from this,
// never hand-duplicated. Photos live at assets/team/<file>; if a photo
// file is missing the card falls back to a styled initials avatar.
var TEAM = [
  {
    name: "Michelle Dennis",
    title: "Regional Innovation Officer",
    photo: "assets/team/michelle-dennis.jpg",
    email: "michelle.dennis@theari.us",
    linkedin: "https://www.linkedin.com/in/michelle-dennis-1136858a/",
    shortBio: "Michelle Dennis is the Regional Innovation Officer for Heartland BioWorks, leading strategy and growth for the Tech Hub. She brings a diverse background spanning federal funding strategy, university-industry partnerships, and corporate sustainability.",
    fullBio: "Michelle Dennis is the Regional Innovation Officer for Heartland BioWorks, leading strategy and growth for the Tech Hub. She brings a diverse background spanning federal funding strategy, university-industry partnerships, and corporate sustainability.\n\nPrior to this role, Michelle served as Vice President of Proposal Management at the Applied Research Institute, where she helped secure the EDA Regional Tech Hub grant for Indiana. She also held leadership positions in proposal development and partnerships at Purdue University, Purdue Research Foundation, and Subaru of Indiana Automotive.\n\nMichelle holds an MA in Modernity, Literature, and Culture from University College Dublin and BAs in Management from Purdue University and English from Indiana University Bloomington."
  },
  {
    name: "Dr. Kerri Dugan",
    title: "Senior Vice President, Biotechnology Programs — Applied Research Institute",
    photo: "assets/team/kerri-dugan.jpg",
    email: "kerri.dugan@theari.us",
    linkedin: "https://www.linkedin.com/in/kerri-dugan-2355281b8/",
    shortBio: "Dr. Kerri Dugan is the Senior Vice President for Biotechnology Programs at the Applied Research Institute. Her experience includes transitioning capabilities across broad multi-disciplinary domains including biotechnology, geospatial intelligence, forensic science, and critical technology areas in support of national security.",
    fullBio: "Dr. Kerri Dugan is the Senior Vice President for Biotechnology Programs at the Applied Research Institute. Her experience includes transitioning capabilities across broad multi-disciplinary domains including biotechnology, geospatial intelligence, forensic science, and critical technology areas in support of national security.\n\nShe held leadership positions at the National Science Foundation, DARPA, the National Geospatial-Intelligence Agency, and the Federal Bureau of Investigation Laboratory Division.\n\nShe holds a PhD in molecular biology from Princeton University and BS and Master's degrees in Chemistry from the College of William and Mary."
  },
  {
    name: "Anne Marie Murphy",
    title: "Director of BioTrain",
    photo: "assets/team/anne-marie-murphy.jpg",
    email: "annemarie.murphy@theari.us",
    linkedin: "https://www.linkedin.com/in/annemariemurphy260/",
    shortBio: "Anne Marie Murphy is the Director of BioTrain for the Heartland BioWorks Tech Hub, advancing Indiana's biomanufacturing workforce through training, industry partnerships, and statewide program development. She has led organizations through startup launches, federal program management, and multi-million-dollar regional growth initiatives.",
    fullBio: "Anne Marie Murphy is the Director of BioTrain for the Heartland BioWorks Tech Hub, advancing Indiana's biomanufacturing workforce through training, industry partnerships, and statewide program development. With experience spanning healthcare, entrepreneurship, and economic development, she has led organizations through startup launches, federal program management, and multi-million-dollar regional growth initiatives.\n\nAnne Marie previously held leadership roles with the Indiana Economic Development Corporation, the Northeast Indiana Regional Partnership, and the Northeast Indiana Innovation Center, where she directed statewide small business programs, regional initiatives, and federal entrepreneurial support networks.\n\nShe holds a master's in Nursing and Strategic Management from Western Governors University and Indiana Wesleyan University, a bachelor's in Nursing and Biology from Western Governors University and Pennsylvania State University, and certifications in Project Management and Equity & Inclusion."
  },
  {
    name: "Tyler Yoder",
    title: "Director of BioLaunch",
    photo: "assets/team/tyler-yoder.jpg",
    email: "tyler.yoder@theari.us",
    linkedin: "https://www.linkedin.com/in/tyler-yoder/",
    shortBio: "Tyler Yoder is the Director of BioLaunch for the Heartland BioWorks Tech Hub, facilitating innovator connections to Indiana-based biomanufacturing and drug development resources. A native Hoosier, Tyler brings startup, corporate finance, and product management experience across the life sciences.",
    fullBio: "Tyler Yoder is the Director of BioLaunch for the Heartland BioWorks Tech Hub, facilitating innovator connections to Indiana-based biomanufacturing and drug development resources. A native Hoosier, Tyler brings startup, corporate finance, and product management experience across the life sciences to help innovators reach their next commercialization milestone.\n\nHe completed his BA in Business Finance at Ball State University and his full-time MBA at Indiana University Bloomington with concentrations in Marketing, Entrepreneurship, and Corporate Innovation."
  }
];

(function () {
  var grid = document.getElementById("teamGrid");
  var empty = document.getElementById("teamEmpty");
  var search = document.getElementById("teamSearch");
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function initials(name){return name.replace(/^Dr\.\s*/,"").split(/\s+/).map(function(w){return w[0]||"";}).join("").slice(0,2).toUpperCase();}

  function card(m, i) {
    var avatar = m.photo
      ? '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;team-avatar-fallback&quot;>' + esc(initials(m.name)) + '</div>\'" />'
      : '<div class="team-avatar-fallback">' + esc(initials(m.name)) + "</div>";
    var links = "";
    if (m.email) links += '<a class="team-link" href="mailto:' + esc(m.email) + '">✉ ' + esc(m.email) + "</a>";
    if (m.linkedin) links += '<a class="team-link" href="' + esc(m.linkedin) + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="currentColor" stroke="none"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg> LinkedIn</a>';
    var fullPs = m.fullBio.split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    return '<article class="team-card" data-i="' + i + '">' +
      '<div class="team-avatar">' + avatar + "</div>" +
      '<div class="team-body">' +
        "<h3>" + esc(m.name) + "</h3>" +
        '<div class="team-title">' + esc(m.title) + "</div>" +
        '<div class="team-links">' + links + "</div>" +
        '<p class="team-short">' + esc(m.shortBio) + "</p>" +
        '<div class="team-full" id="team-full-' + i + '" hidden>' + fullPs + "</div>" +
        '<button type="button" class="team-more" data-toggle-bio="' + i + '" aria-expanded="false" aria-controls="team-full-' + i + '">Read Full Bio →</button>' +
      "</div></article>";
  }

  function render(q) {
    q = (q || "").trim().toLowerCase();
    var shown = TEAM.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
      return !q || (x.m.name + " " + x.m.title + " " + x.m.fullBio).toLowerCase().indexOf(q) !== -1;
    });
    grid.innerHTML = shown.map(function (x) { return card(x.m, x.i); }).join("");
    empty.style.display = shown.length ? "none" : "block";
  }

  render("");
  search.addEventListener("input", function () { render(search.value); });
  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-toggle-bio]");
    if (!btn) return;
    var i = btn.getAttribute("data-toggle-bio");
    var full = document.getElementById("team-full-" + i);
    var short_ = btn.closest(".team-body").querySelector(".team-short");
    var open = full.hidden;
    full.hidden = !open;
    short_.hidden = open;
    btn.textContent = open ? "Show Less" : "Read Full Bio →";
    btn.setAttribute("aria-expanded", String(open));
  });
})();
</script>
</body>
</html>
