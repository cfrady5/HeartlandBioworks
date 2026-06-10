/* ============================================================
   Heartland BioWorks — interactive Indiana ecosystem map.
   Mounts into #ecosystem-map. Pins are projected from real
   lat/long onto a vector Indiana outline so they stay aligned
   at any size. Out-of-state resources (Cenetron, TX) appear in
   the resource panel only — never as an Indiana pin.
   ============================================================ */
(function () {
  "use strict";
  var mount = document.getElementById("ecosystem-map");
  if (!mount) return;

  // ---- filter categories (order = chip order) ----
  var CATS = [
    "All Resources",
    "Drug Product Manufacturing",
    "Gene & Cell Therapy",
    "Precision Fermentation",
    "Radiopharmaceuticals",
    "Lab & Clinical Services",
    "Workforce & Training",
    "Commercialization & Innovation"
  ];

  // ---- dataset (real organizations + locations) ----
  var DATA = [
    // Drug Product Development & Manufacturing
    { name: "INCOG BioPharma Services", city: "Fishers", state: "IN", category: "Drug Product Manufacturing", lat: 39.9568, lon: -86.0134, description: "Sterile injectable drug product development and fill-finish manufacturing." },
    { name: "KP Pharmaceutical Technology", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Oral solid dose formulation, development, and manufacturing." },
    { name: "Labyrinth BioPharma", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Drug product development and manufacturing services." },
    { name: "MilliporeSigma", city: "Indianapolis", state: "IN", category: "Drug Product Manufacturing", lat: 39.7684, lon: -86.1581, description: "Life science products and contract manufacturing services." },
    { name: "Simtra BioPharma Solutions", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Sterile contract manufacturing of injectable and specialty drug products." },
    { name: "Singota Solutions", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Aseptic fill-finish and pharmaceutical development services." },

    // Gene & Cell Therapy
    { name: "Genezen", city: "Indianapolis", state: "IN", category: "Gene & Cell Therapy", lat: 39.7684, lon: -86.1581, description: "Viral vector and cell therapy contract development and manufacturing." },

    // Precision Fermentation & Bioprocessing
    { name: "EKF Diagnostics", city: "South Bend", state: "IN", category: "Precision Fermentation", lat: 41.6764, lon: -86.2520, description: "Precision fermentation and enzyme applications." },
    { name: "Evonik Lipid Innovation Center", city: "Lafayette", state: "IN", category: "Precision Fermentation", lat: 40.4167, lon: -86.8753, description: "Lipid and bioprocessing innovation and manufacturing." },
    { name: "Liberation Bioindustries", city: "Richmond", state: "IN", category: "Precision Fermentation", lat: 39.8289, lon: -84.8902, description: "Precision fermentation — facility coming soon." },
    { name: "MilliporeSigma Lipid Nanoparticle Manufacturing", city: "Indianapolis", state: "IN", category: "Precision Fermentation", lat: 39.7684, lon: -86.1581, description: "Lipid nanoparticle manufacturing for advanced therapeutics." },

    // Radiopharmaceuticals & Nuclear Medicine
    { name: "SpectronRx", city: "Indianapolis", state: "IN", category: "Radiopharmaceuticals", lat: 39.7684, lon: -86.1581, description: "Radiopharmaceutical development and manufacturing." },
    { name: "SpectronRx", city: "South Bend", state: "IN", category: "Radiopharmaceuticals", lat: 41.6764, lon: -86.2520, description: "Radiopharmaceutical development and manufacturing." },

    // Laboratory, Analytical & Clinical Services
    { name: "B2S Life Sciences", city: "Franklin", state: "IN", category: "Lab & Clinical Services", lat: 39.4806, lon: -86.0547, description: "Lab solutions, data analytics, and drug development consulting." },
    { name: "Labcorp", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "Biopharma nonclinical development and central lab services." },
    { name: "Pearl Pathways", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "Clinical, regulatory, and quality compliance services." },
    { name: "Quantigen", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "CRO offering sample-to-answer method development and validation." },
    { name: "Cenetron", city: "Austin", state: "TX", category: "Lab & Clinical Services", lat: 30.2672, lon: -97.7431, outOfState: true, description: "Complete central laboratory services (out-of-state partner)." },

    // Workforce & Training
    { name: "Purdue University", city: "West Lafayette", state: "IN", category: "Workforce & Training", lat: 40.4259, lon: -86.9081, description: "Research university and biomanufacturing workforce training partner." },
    { name: "Indiana University", city: "Bloomington", state: "IN", category: "Workforce & Training", lat: 39.1653, lon: -86.5264, description: "Research university and life sciences workforce partner." },
    { name: "Ivy Tech Community College", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Statewide community college delivering biomanufacturing credentials." },
    { name: "EmployIndy", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Workforce development board connecting talent to careers." },
    { name: "Heartland BioWorks HQ (planned)", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Planned 27,000 sq. ft. headquarters and hands-on training facility at 16 Tech." },

    // Commercialization & Innovation
    { name: "Applied Research Institute", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Lead organization powering Heartland BioWorks." },
    { name: "BioCrossroads", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Indiana life sciences initiative advancing the bioeconomy." },
    { name: "16 Tech Innovation District", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7843, lon: -86.1760, description: "Innovation district and home of the planned Heartland BioWorks HQ." },
    { name: "Heartland BioWorks BioLaunch", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Commercialization and innovation support for biotech solutions." },
    { name: "Heartland BioWorks BioCAN", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "BioResource Coordination and Access Network connecting innovators with Indiana CDMOs, labs, and scale-up resources." }
  ];

  // ---- projection (lat/long -> SVG); same transform for outline & pins ----
  var VB_W = 255, VB_H = 400;
  var LON_MIN = -88.10, LON_MAX = -84.78, LAT_MIN = 37.77, LAT_MAX = 41.77;
  function px(lon) { return (lon - LON_MIN) / (LON_MAX - LON_MIN) * VB_W; }
  function py(lat) { return (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * VB_H; }

  // Indiana outline as geo vertices (lon,lat), projected through the same fn.
  var OUTLINE = [
    [-87.53, 41.76], [-84.81, 41.76], [-84.81, 39.10], [-84.84, 39.08],
    [-85.20, 38.73], [-85.62, 38.74], [-85.90, 38.30], [-86.32, 38.17],
    [-86.62, 38.04], [-87.06, 37.80], [-87.62, 37.92], [-87.98, 38.27],
    [-87.66, 38.51], [-87.55, 39.00], [-87.53, 39.35], [-87.53, 40.48]
  ];
  var outlinePath = OUTLINE.map(function (p, i) {
    return (i === 0 ? "M" : "L") + px(p[0]).toFixed(1) + " " + py(p[1]).toFixed(1);
  }).join(" ") + " Z";

  // city labels to anchor the map
  var CITY_LABELS = [
    { name: "Indianapolis", lat: 39.7684, lon: -86.1581, dx: 6, dy: -6 },
    { name: "Bloomington", lat: 39.1653, lon: -86.5264, dx: 6, dy: 4 },
    { name: "South Bend", lat: 41.6764, lon: -86.2520, dx: 6, dy: -4 },
    { name: "Lafayette", lat: 40.4167, lon: -86.8753, dx: -52, dy: 0 },
    { name: "Fishers", lat: 39.9568, lon: -86.0134, dx: 7, dy: 0 },
    { name: "Richmond", lat: 39.8289, lon: -84.8902, dx: -48, dy: 0 }
  ];

  var SVGNS = "http://www.w3.org/2000/svg";
  var activeCat = "All Resources";

  // ---- build DOM shell ----
  mount.innerHTML =
    '<div class="eco-map">' +
      '<div class="eco-filters" role="group" aria-label="Filter resources by capability"></div>' +
      '<div class="eco-grid">' +
        '<div class="eco-mapwrap"><div class="eco-tip" role="status" aria-live="polite"></div></div>' +
        '<div class="eco-panel">' +
          '<div class="eco-panel-head"><h3 class="eco-panel-title">All Resources</h3><span class="eco-count"></span></div>' +
          '<div class="eco-list"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var filtersEl = mount.querySelector(".eco-filters");
  var mapWrap = mount.querySelector(".eco-mapwrap");
  var tip = mount.querySelector(".eco-tip");
  var listEl = mount.querySelector(".eco-list");
  var countEl = mount.querySelector(".eco-count");
  var titleEl = mount.querySelector(".eco-panel-title");

  // ---- filter chips ----
  function countFor(cat) {
    return cat === "All Resources" ? DATA.length : DATA.filter(function (d) { return d.category === cat; }).length;
  }
  CATS.forEach(function (cat) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "eco-chip" + (cat === activeCat ? " active" : "");
    b.setAttribute("aria-pressed", String(cat === activeCat));
    b.innerHTML = cat + ' <span class="eco-chip-n">' + countFor(cat) + "</span>";
    b.addEventListener("click", function () { setCat(cat); });
    filtersEl.appendChild(b);
  });

  // ---- SVG map ----
  var svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 " + VB_W + " " + VB_H);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Map of Indiana showing biomanufacturing ecosystem resources");
  var statePath = document.createElementNS(SVGNS, "path");
  statePath.setAttribute("d", outlinePath);
  statePath.setAttribute("class", "eco-state");
  svg.appendChild(statePath);
  var labelLayer = document.createElementNS(SVGNS, "g");
  CITY_LABELS.forEach(function (c) {
    var t = document.createElementNS(SVGNS, "text");
    t.setAttribute("x", (px(c.lon) + c.dx).toFixed(1));
    t.setAttribute("y", (py(c.lat) + c.dy).toFixed(1));
    t.setAttribute("class", "eco-citylabel");
    t.textContent = c.name;
    labelLayer.appendChild(t);
  });
  svg.appendChild(labelLayer);
  var pinLayer = document.createElementNS(SVGNS, "g");
  svg.appendChild(pinLayer);
  mapWrap.appendChild(svg);

  function showTip(html, cx, cy) {
    tip.innerHTML = html;
    tip.classList.add("show");
    // position within wrapper using fractional coords
    var wrapRect = mapWrap.getBoundingClientRect();
    var x = (cx / VB_W) * wrapRect.width;
    var y = (cy / VB_H) * wrapRect.height;
    tip.style.left = Math.min(Math.max(x + 14, 8), wrapRect.width - 8) + "px";
    tip.style.top = Math.max(y - 10, 8) + "px";
  }
  function hideTip() { tip.classList.remove("show"); }

  // ---- render pins for current category (in-state, clustered by city) ----
  function visibleData() {
    return DATA.filter(function (d) {
      return activeCat === "All Resources" || d.category === activeCat;
    });
  }
  function renderPins() {
    pinLayer.innerHTML = "";
    var inState = visibleData().filter(function (d) { return !d.outOfState; });
    // cluster by city (rounded coords)
    var groups = {};
    inState.forEach(function (d) {
      var key = d.lat.toFixed(2) + "," + d.lon.toFixed(2);
      (groups[key] = groups[key] || { lat: d.lat, lon: d.lon, city: d.city, items: [] }).items.push(d);
    });
    Object.keys(groups).forEach(function (key) {
      var g = groups[key];
      var cx = px(g.lon), cy = py(g.lat);
      var n = g.items.length;
      var pin = document.createElementNS(SVGNS, "g");
      pin.setAttribute("class", "eco-pin");
      pin.setAttribute("tabindex", "0");
      pin.setAttribute("role", "button");
      pin.setAttribute("aria-label", g.city + ": " + n + " resource" + (n > 1 ? "s" : ""));
      var ring = document.createElementNS(SVGNS, "circle");
      ring.setAttribute("class", "eco-pin-ring");
      ring.setAttribute("cx", cx); ring.setAttribute("cy", cy); ring.setAttribute("r", n > 1 ? 13 : 9);
      var dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("class", "eco-pin-dot");
      dot.setAttribute("cx", cx); dot.setAttribute("cy", cy); dot.setAttribute("r", n > 1 ? 11 : 6);
      pin.appendChild(ring); pin.appendChild(dot);
      if (n > 1) {
        var t = document.createElementNS(SVGNS, "text");
        t.setAttribute("class", "eco-pin-count");
        t.setAttribute("x", cx); t.setAttribute("y", cy);
        t.textContent = n;
        pin.appendChild(t);
      }
      function tipHtml() {
        if (n === 1) {
          var d = g.items[0];
          return "<h5>" + d.name + "</h5><div class='eco-tip-meta'>" + d.category + "</div><p>" + d.city + ", " + d.state + " — " + d.description + "</p>";
        }
        return "<h5>" + g.city + ", IN</h5><div class='eco-tip-meta'>" + n + " resources</div><p>" +
          g.items.map(function (d) { return d.name; }).join(" · ") + "</p>";
      }
      function activate() { showTip(tipHtml(), cx, cy); highlightCity(g.city); }
      pin.addEventListener("mouseenter", activate);
      pin.addEventListener("mouseleave", hideTip);
      pin.addEventListener("focus", activate);
      pin.addEventListener("blur", hideTip);
      pin.addEventListener("click", function () { activate(); scrollToCity(g.city); });
      pin.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); scrollToCity(g.city); } });
      pinLayer.appendChild(pin);
    });
  }

  // ---- resource panel ----
  function renderList() {
    var data = visibleData();
    listEl.innerHTML = "";
    titleEl.textContent = activeCat;
    countEl.textContent = "Showing " + data.length + " resource" + (data.length === 1 ? "" : "s");
    if (!data.length) { listEl.innerHTML = '<div class="eco-empty">No resources in this category yet — check back soon.</div>'; return; }
    // in-state first, out-of-state notes last
    data.sort(function (a, b) { return (a.outOfState ? 1 : 0) - (b.outOfState ? 1 : 0); });
    data.forEach(function (d) {
      var item = document.createElement("div");
      item.className = "eco-item" + (d.outOfState ? " out-of-state" : "");
      item.setAttribute("data-city", d.city);
      item.tabIndex = 0;
      item.innerHTML =
        '<span class="eco-cat">' + d.category + "</span>" +
        "<h4>" + d.name + "</h4>" +
        '<div class="eco-loc">📍 ' + d.city + ", " + d.state +
          (d.outOfState ? ' &nbsp;<span class="eco-oos">Out of state</span>' : "") + "</div>" +
        "<p>" + d.description + "</p>";
      listEl.appendChild(item);
    });
  }

  function highlightCity(city) {
    listEl.querySelectorAll(".eco-item").forEach(function (it) {
      it.classList.toggle("hl", it.getAttribute("data-city") === city);
    });
  }
  function scrollToCity(city) {
    var first = listEl.querySelector('.eco-item[data-city="' + city + '"]');
    if (first) first.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function setCat(cat) {
    activeCat = cat;
    Array.prototype.forEach.call(filtersEl.children, function (b) {
      var on = b.textContent.indexOf(cat) === 0;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    hideTip();
    renderPins();
    renderList();
  }

  // initial paint
  renderPins();
  renderList();

  // expose for tests
  window.__ecoMap = { DATA: DATA, CATS: CATS, setCat: setCat, countFor: countFor, get activeCat() { return activeCat; } };
})();
