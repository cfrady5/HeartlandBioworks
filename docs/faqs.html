<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FAQs – Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>*,*::before,*::after{box-sizing:border-box;}body{margin:0;font-family:'Inter',system-ui,sans-serif;color:var(--hb-text);background:#fff;-webkit-font-smoothing:antialiased;}a{color:inherit;text-decoration:none;}</style>
</head>
<body data-page="faqs" data-breadcrumb="About > FAQs">
<div id="hb-header"></div>

<section class="hb-pagehero">
  <div class="hb-pagehero-inner">
    <h1>Frequently Asked Questions</h1>
    <p>Answers about Heartland BioWorks, its programs, BioCAN grants, and how to get involved. Don't see your question? <a href="#contact" style="color:#7DD580;text-decoration:underline;">Contact us</a>.</p>
  </div>
</section>

<main class="hb-pagebody">
  <div class="hb-pagebody-inner">
    <input type="search" class="faqp-search" id="faqSearch" placeholder="Search FAQs…" aria-label="Search frequently asked questions" />
    <div id="faqList"></div>
    <div class="hbc-empty" id="faqEmpty" style="display:none;">No FAQs match your search. Try different keywords or <a href="#contact">contact us</a>.</div>
  </div>
</main>

<span id="contact"></span>
<div id="hb-footer"></div>

<script src="assets/site.js" defer></script>
<script>
// FAQ content. Where exact figures aren't confirmed, answers stay general
// and avoid stating unverified specifics.
var FAQS = [
  { cat: "General", q: "What is Heartland BioWorks?", a: "Heartland BioWorks is Indiana's federally designated biomanufacturing Regional Tech Hub, powered by the Applied Research Institute. It connects workforce, innovation, manufacturing, and research assets to accelerate biotechnology and biomanufacturing growth across Indiana." },
  { cat: "General", q: "What does “federally designated Tech Hub” mean?", a: "The U.S. Economic Development Administration designated Heartland BioWorks as one of 31 Regional Technology and Innovation Hubs nationally, and selected it as one of 12 to receive implementation funding — a $51M investment in Indiana's biomanufacturing ecosystem." },
  { cat: "General", q: "Who leads Heartland BioWorks?", a: "The initiative is led by the Applied Research Institute (ARI) in coordination with workforce partners, research institutions, manufacturers, and government stakeholders across Indiana." },
  { cat: "General", q: "Where will Heartland BioWorks be located?", a: "A planned 27,000 sq. ft. headquarters and hands-on training facility is slated for the 16 Tech Innovation District in Indianapolis." },

  { cat: "BioTrain", q: "What is BioTrain?", a: "BioTrain is the workforce development program. It delivers stackable credentials, employer upskilling and reskilling, and statewide training pathways that move Hoosiers into biomanufacturing careers." },
  { cat: "BioTrain", q: "Do I need a four-year degree to start a biomanufacturing career?", a: "No. BioTrain's pathways are designed so a four-year degree is not required — training focuses on the hands-on, job-ready skills Indiana employers need." },
  { cat: "BioTrain", q: "I'm an employer — how do I get involved with BioTrain?", a: "Employers can partner with BioTrain to build talent pipelines and access upskilling programs. Reach out through the contact options on this site to start a conversation." },

  { cat: "BioLaunch", q: "What is BioLaunch?", a: "BioLaunch provides commercialization and innovation support for biotechnology and biomanufacturing solutions — helping move ideas toward market." },
  { cat: "BioLaunch", q: "What is BioStart?", a: "BioStart is the mentorship and peer-to-peer startup support track under BioLaunch, connecting founders with experienced operators and Indiana's innovation network." },

  { cat: "BioCAN Grants", q: "What is BioCAN?", a: "BioCAN — the BioResource Coordination and Access Network — connects innovators with Indiana's CDMOs, labs, and scale-up resources, and helps companies navigate funding." },
  { cat: "BioCAN Grants", q: "What funding does BioCAN help with?", a: "BioCAN helps companies navigate federal and state funding pathways such as SBIR/STTR, BARDA and DoD programs, and Indiana state programs. Specific opportunities and eligibility vary — contact the team for current guidance." },
  { cat: "BioCAN Grants", q: "How do I find CDMO or lab capacity in Indiana?", a: "Explore the interactive ecosystem map on the BioCAN page to browse Indiana's CDMO, lab, and scale-up resources by capability area." },

  { cat: "Partners", q: "Who are Heartland BioWorks' partners?", a: "The ecosystem includes research universities (Purdue, Indiana University), Ivy Tech Community College, EmployIndy, BioCrossroads, the 16 Tech Innovation District, the Applied Research Institute, and a growing network of Indiana CDMOs and labs." },
  { cat: "Partners", q: "How can my organization partner with Heartland BioWorks?", a: "Organizations interested in workforce, manufacturing, research, or funding collaboration can reach out through the contact options on this site." },

  { cat: "Contact", q: "How do I get in touch?", a: "Email info@heartlandbioworks.org or use the contact options in the site footer. For program-specific questions, mention whether you're interested in BioTrain, BioLaunch, or BioCAN." },
  { cat: "Contact", q: "How do I stay updated?", a: "Subscribe to the monthly briefing in the footer for funding opportunities, training programs, ecosystem resources, and BioCAN announcements." }
];

(function () {
  var listEl = document.getElementById("faqList");
  var emptyEl = document.getElementById("faqEmpty");
  var search = document.getElementById("faqSearch");
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}

  function render(q) {
    q = (q || "").trim().toLowerCase();
    var cats = {};
    FAQS.forEach(function (f) {
      if (q && (f.q + " " + f.a + " " + f.cat).toLowerCase().indexOf(q) === -1) return;
      (cats[f.cat] = cats[f.cat] || []).push(f);
    });
    var order = ["General", "BioTrain", "BioLaunch", "BioCAN Grants", "Partners", "Contact"];
    var html = order.filter(function (c) { return cats[c]; }).map(function (c) {
      return '<h2 class="faqp-cat">' + esc(c) + "</h2>" + cats[c].map(function (f, i) {
        var id = "faq-" + c.replace(/\W+/g, "") + "-" + i;
        return '<div class="faqp-item">' +
          '<button class="faqp-q" type="button" aria-expanded="false" aria-controls="' + id + '">' +
            "<span>" + esc(f.q) + "</span>" +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></button>' +
          '<div class="faqp-a" id="' + id + '" role="region"><div><div class="faqp-a-inner">' + esc(f.a) + "</div></div></div>" +
        "</div>";
      }).join("");
    }).join("");
    listEl.innerHTML = html;
    emptyEl.style.display = html ? "none" : "block";
  }

  render("");
  search.addEventListener("input", function () { render(search.value); });
  listEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".faqp-q");
    if (!btn) return;
    var item = btn.closest(".faqp-item");
    var open = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
})();
</script>
</body>
</html>
