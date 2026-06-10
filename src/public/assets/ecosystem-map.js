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
    { name: "INCOG BioPharma Services", city: "Fishers", state: "IN", category: "Drug Product Manufacturing", lat: 39.9568, lon: -86.0134, description: "Sterile injectable drug product development and fill-finish manufacturing.", url: "https://www.incogbiopharma.com/" },
    { name: "KP Pharmaceutical Technology", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Oral solid dose formulation, development, and manufacturing.", url: "https://kppt.com/" },
    { name: "Labyrinth BioPharma", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Drug product development and manufacturing services.", url: "https://lab-bp.com/" },
    { name: "MilliporeSigma", city: "Indianapolis", state: "IN", category: "Drug Product Manufacturing", lat: 39.7684, lon: -86.1581, description: "Life science products and contract manufacturing services.", url: "https://www.sigmaaldrich.com/US/en/services/contract-manufacturing/mrna-and-lnp-formulation-ctdmo-services/lipid-nanoparticle-cdmo-services" },
    { name: "Simtra BioPharma Solutions", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Sterile contract manufacturing of injectable and specialty drug products.", url: "https://simtra.com/" },
    { name: "Singota Solutions", city: "Bloomington", state: "IN", category: "Drug Product Manufacturing", lat: 39.1653, lon: -86.5264, description: "Aseptic fill-finish and pharmaceutical development services.", url: "https://singota.com/" },

    // Gene & Cell Therapy
    { name: "Genezen", city: "Indianapolis", state: "IN", category: "Gene & Cell Therapy", lat: 39.7684, lon: -86.1581, description: "Viral vector and cell therapy contract development and manufacturing.", url: "https://www.genezen.com/" },

    // Precision Fermentation & Bioprocessing
    { name: "EKF Diagnostics", city: "South Bend", state: "IN", category: "Precision Fermentation", lat: 41.6764, lon: -86.2520, description: "Precision fermentation and enzyme applications.", url: "https://www.ekfdiagnostics.com/" },
    { name: "Evonik Lipid Innovation Center", city: "Lafayette", state: "IN", category: "Precision Fermentation", lat: 40.4167, lon: -86.8753, description: "Lipid and bioprocessing innovation and manufacturing.", url: "https://healthcare.evonik.com/en/evonik-breaks-ground-on-220-million-lipid-innovation-center-in-lafayette-indiana-197660.html" },
    { name: "Liberation Bioindustries", city: "Richmond", state: "IN", category: "Precision Fermentation", lat: 39.8289, lon: -84.8902, description: "Precision fermentation — facility coming soon.", url: "https://liberation.bio/" },
    { name: "MilliporeSigma Lipid Nanoparticle Manufacturing", city: "Indianapolis", state: "IN", category: "Precision Fermentation", lat: 39.7684, lon: -86.1581, description: "Lipid nanoparticle manufacturing for advanced therapeutics.", url: "https://www.sigmaaldrich.com/US/en/services/contract-manufacturing/mrna-and-lnp-formulation-ctdmo-services/lipid-nanoparticle-cdmo-services" },

    // Radiopharmaceuticals & Nuclear Medicine
    { name: "SpectronRx", city: "Indianapolis", state: "IN", category: "Radiopharmaceuticals", lat: 39.7684, lon: -86.1581, description: "Radiopharmaceutical development and manufacturing.", url: "https://www.spectronrx.com/" },
    { name: "SpectronRx", city: "South Bend", state: "IN", category: "Radiopharmaceuticals", lat: 41.6764, lon: -86.2520, description: "Radiopharmaceutical development and manufacturing.", url: "https://www.spectronrx.com/" },

    // Laboratory, Analytical & Clinical Services
    { name: "B2S Life Sciences", city: "Franklin", state: "IN", category: "Lab & Clinical Services", lat: 39.4806, lon: -86.0547, description: "Lab solutions, data analytics, and drug development consulting.", url: "https://b2slifesciences.com/" },
    { name: "Labcorp", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "Biopharma nonclinical development and central lab services.", url: "https://www.labcorp.com/biopharma" },
    { name: "Pearl Pathways", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "Clinical, regulatory, and quality compliance services.", url: "https://www.pearlpathways.com/" },
    { name: "Quantigen", city: "Indianapolis", state: "IN", category: "Lab & Clinical Services", lat: 39.7684, lon: -86.1581, description: "CRO offering sample-to-answer method development and validation.", url: "https://www.quantigen.com/" },
    { name: "Cenetron", city: "Austin", state: "TX", category: "Lab & Clinical Services", lat: 30.2672, lon: -97.7431, outOfState: true, description: "Complete central laboratory services (out-of-state partner).", url: "https://versiticlinicaltrials.org/about-us/our-brands/cenetron" },

    // Workforce & Training
    { name: "Purdue University", city: "West Lafayette", state: "IN", category: "Workforce & Training", lat: 40.4259, lon: -86.9081, description: "Research university and biomanufacturing workforce training partner.", url: "https://www.purdue.edu/" },
    { name: "Indiana University", city: "Bloomington", state: "IN", category: "Workforce & Training", lat: 39.1653, lon: -86.5264, description: "Research university and life sciences workforce partner.", url: "https://www.iu.edu/" },
    { name: "Ivy Tech Community College", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Statewide community college delivering biomanufacturing credentials.", url: "https://www.ivytech.edu/" },
    { name: "EmployIndy", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Workforce development board connecting talent to careers.", url: "https://employindy.org/" },
    { name: "Heartland BioWorks HQ (planned)", city: "Indianapolis", state: "IN", category: "Workforce & Training", lat: 39.7684, lon: -86.1581, description: "Planned 27,000 sq. ft. headquarters and hands-on training facility at 16 Tech.", url: "https://www.heartlandbioworks.com/" },

    // Commercialization & Innovation
    { name: "Applied Research Institute", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Lead organization powering Heartland BioWorks.", url: "https://theari.us/" },
    { name: "BioCrossroads", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Indiana life sciences initiative advancing the bioeconomy.", url: "https://biocrossroads.com/" },
    { name: "16 Tech Innovation District", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7843, lon: -86.1760, description: "Innovation district and home of the planned Heartland BioWorks HQ.", url: "https://16tech.com/" },
    { name: "Heartland BioWorks BioLaunch", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "Commercialization and innovation support for biotech solutions.", url: "https://www.heartlandbioworks.com/" },
    { name: "Heartland BioWorks BioCAN", city: "Indianapolis", state: "IN", category: "Commercialization & Innovation", lat: 39.7684, lon: -86.1581, description: "BioResource Coordination and Access Network connecting innovators with Indiana CDMOs, labs, and scale-up resources.", url: "https://www.heartlandbioworks.com/" }
  ];

  // ---- real Indiana vector (county paths) + lat/long projection ----
  // County geometry from the MapSVG Lite "usa-in" vector, scaled into a
  // 255 x 440.5 viewBox. Pins project from Indiana's true geographic
  // bounding box into the same space, so they land on the right cities.
  var VB_W = 255.0000, VB_H = 440.5400;
  var STATE_TRANSFORM = "translate(-16.2851,-14.3100) scale(8.102183)";
  var LON_MIN = -88.0976, LON_MAX = -84.7846, LAT_MIN = 37.7717, LAT_MAX = 41.7613;
  function px(lon) { return (lon - LON_MIN) / (LON_MAX - LON_MIN) * VB_W; }
  function py(lat) { return (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * VB_H; }
  var INDIANA_PATHS = [
    "m 8.7109666,4.5461878 0.615,6.1210002 -0.082,0.108 -0.276,0.154 -0.085,-0.024 -0.744,-0.472 -0.522,-0.181 -0.194,-0.049 -0.108,0.022 -0.545,0.316 -0.226,0.324 -0.492,-4.9350002 2.659,-1.384",
    "m 3.0739666,5.1001878 2.978,0.83 0.492,4.9350002 -0.519,0.352 -2.348,0.896 -0.153,-1.708 -0.45,-5.3050002",
    "m 15.512967,48.900188 1.09,-0.153 1.177,0.662 0.163,1.426 -0.199,0.679 -0.059,0.008 -0.207,0.038 -0.054,0.031 -0.041,0.058 -0.017,0.141 0.076,0.77 -0.658,1.5 -0.28,0.217 -0.134,0.045 -0.077,-0.005 -1.793,-1.86 -0.033,-2.7 -0.062,-0.568 1.136,-0.095 -0.028,-0.194",
    "m 14.466967,49.757188 0.033,2.7 -1.569,1.04 -0.627,0.587 -0.753,1.36 -1.473,-0.982 -0.049,-0.622 0.017,-0.049 1.708,-2.579 0.451,-1.216 2.262,-0.239",
    "m 9.1579666,49.726188 2.4570004,-0.055 0.59,0.325 -0.451,1.216 -1.708,2.579 -0.017,0.049 0.049,0.622 -0.3610004,-0.252 -1.546,-0.415 -0.099,-1.217 -0.235,0.023 -0.089,-1.127 -0.005,-0.568 -0.032,-0.464 1.498,-0.144 -0.051,-0.572",
    "m 5.5249666,51.063188 2.218,-0.157 0.005,0.568 0.089,1.127 0.235,-0.023 0.099,1.217 -2.465,0.744 -0.181,-3.476",
    "m 2.7809666,50.496188 2.744,0.567 0.181,3.476 -2.286,0.181 -0.901,1.419 -0.509,-1.141 0.483,-0.018 0.017,-0.003 0.022,-0.015 0.006,-0.009 0.027,-0.055 0.144,-2.987 0.058,-1.352 0.014,-0.063",
    "m 4.7229666,47.917188 2.637,-1.779 0.077,0.878 0.22,0.365 0.591,0.713 0.14,-0.05 0.531,-0.09 0.085,0.036 0.205,2.308 -1.498,0.144 0.032,0.464 -2.218,0.157 -2.744,-0.567 1.942,-2.579",
    "m 9.5499666,45.786188 1.7270004,0.234 0.338,3.651 -2.4570004,0.055 -0.154,-1.736 -0.085,-0.036 -0.531,0.09 -0.14,0.05 -0.591,-0.713 -0.22,-0.365 -0.077,-0.878 0.365,-0.131 0.663,-0.104 0.067,0.019 0.546,0.368 0.129,-0.035 0.172,-0.153 0.131,-0.131 0.117,-0.185",
    "m 15.151967,45.497188 0.176,1.698 0.185,1.705 0.028,0.194 -1.136,0.095 0.062,0.568 -2.262,0.239 -0.59,-0.325 -0.338,-3.651 1.491,-0.008 2.384,-0.515",
    "m 19.014967,46.458188 0.536,-0.051 0.226,3.801 -2.033,1.306 0.199,-0.679 -0.163,-1.426 -1.177,-0.662 -1.09,0.153 -0.185,-1.705 2.29,-0.251 1.433,-0.112 -0.036,-0.374",
    "m 21.772967,46.236188 0.122,1.127 0.221,0.356 0.032,0 0.41,0.302 0.207,0.171 0.645,0.907 0.013,0.099 -0.248,2.267 -0.487,0.166 -0.301,0.099 -1.456,-0.072 -0.072,-0.009 -0.438,-0.172 -0.455,-0.301 -0.049,-0.031 -0.023,-0.036 -0.059,-0.09 -0.072,-0.252 -0.009,-0.023 -0.004,-0.059 -0.004,-0.09 0,-0.023 0.031,-0.364 -0.226,-3.801 2.222,-0.171",
    "m 22.151967,46.192188 0.01,0.094 0.288,0.067 1.582,-0.179 0.55,0.649 -0.221,0.829 -0.938,1.546 -0.013,-0.099 -0.645,-0.907 -0.207,-0.171 -0.41,-0.302 -0.032,0 -0.221,-0.356 -0.122,-1.127 0.379,-0.044",
    "m 26.117967,43.308188 1.452,0.097 0.031,0.813 -1.839,2.082 -1.401,1.352 0.221,-0.829 -0.55,-0.649 -1.582,0.179 -0.288,-0.067 -0.01,-0.094 -0.081,-0.911 0.437,-0.221 0.622,-0.084 0.167,-0.213 0.144,-0.393 -0.023,-0.179 2.7,-0.883",
    "m 29.961967,38.403188 2.39,-1.356 0.995,1.586 -3.388,0.013 0.003,-0.243",
    "m 29.958967,38.646188 3.388,-0.013 0.136,0.563 -2.182,1.475 -1.64,1.122 -0.347,-2.866 0.645,-0.281",
    "m 26.919967,39.205188 2.394,-0.278 0.347,2.866 -1.393,-0.483 -0.698,2.095 -1.452,-0.097 -0.113,-0.938 -0.387,-0.144 -0.298,-0.163 -0.323,-0.343 -0.222,-0.284 -0.081,-0.708 0.712,-0.193 0.315,-0.505 0.1,-0.305 0.18,-0.408 0.919,-0.112",
    "m 24.693967,40.728188 0.081,0.708 0.222,0.284 0.323,0.343 0.298,0.163 0.387,0.144 0.113,0.938 -2.7,0.883 -0.644,-2.196 0.825,-1.045 1.095,-0.222",
    "m 18.893967,42.019188 3.88,-0.024 0.644,2.196 0.023,0.179 -0.144,0.393 -0.167,0.213 -0.622,0.084 -0.437,0.221 0.081,0.911 -0.379,0.044 -2.222,0.171 -0.536,0.051 -0.351,-3.431 0.23,-1.008",
    "m 18.663967,43.027188 0.351,3.431 0.036,0.374 -1.433,0.112 -2.29,0.251 -0.176,-1.698 -0.211,-2.073 3.723,-0.397",
    "m 12.470967,40.818188 2.195,-0.219 0.275,2.825 0.211,2.073 -2.384,0.515 -0.297,-5.194",
    "m 10.541967,41.004188 1.929,-0.186 0.297,5.194 -1.491,0.008 -1.7270004,-0.234 -0.45,-1.975 0.135,-1.058 0.176,-0.348 0.8430004,-1.171 0.288,-0.23",
    "m 9.1269666,41.085188 1.4150004,-0.081 -0.288,0.23 -0.8430004,1.171 -0.176,0.348 -0.135,1.058 0.45,1.975 -0.117,0.185 -0.131,0.131 -0.172,0.153 -0.129,0.035 -0.546,-0.368 -0.067,-0.019 -0.663,0.104 -0.365,0.131 -2.637,1.779 0.717,-2.064 0.194,-0.528 0.789,-1.009 0.08,-0.067 0.099,-0.181 0.141,-0.82 0.004,-0.315 -0.384,-0.825 -0.022,-0.036 -0.041,-0.005 -0.081,-0.643 2.908,-0.339",
    "m 8.7109666,36.542188 0.1,1.127 0.316,3.416 -2.908,0.339 0.059,-0.081 0.072,-0.204 0.027,-0.411 -0.716,-1.279 -0.469,-0.551 -0.203,-0.693 0.131,-1.343 3.591,-0.32",
    "m 10.654967,37.547188 3.678,-0.324 0.225,2.24 0.108,1.136 -2.195,0.219 -1.929,0.186 -1.4150004,0.081 -0.316,-3.416 1.8440004,-0.122",
    "m 14.557967,39.463188 3.614,-0.343 0.722,2.899 -0.23,1.008 -3.723,0.397 -0.275,-2.825 -0.108,-1.136",
    "m 20.443967,38.110188 2.754,-0.526 0.401,3.366 -0.825,1.045 -3.88,0.024 -0.722,-2.899 -0.081,-0.748 2.353,-0.262",
    "m 26.564967,35.550188 0.355,3.655 -0.919,0.112 -0.18,0.408 -0.1,0.305 -0.315,0.505 -0.712,0.193 -1.095,0.222 -0.401,-3.366 1.022,-0.929 2.345,-1.105",
    "m 30.087967,33.689188 -0.126,4.714 -0.003,0.243 -0.645,0.281 -2.394,0.278 -0.355,-3.655 1.307,-1.1 2.216,-0.761",
    "m 30.087967,33.689188 2.426,-0.257 0.297,2.579 -0.459,1.036 -2.39,1.356 0.126,-4.714",
    "m 32.225967,30.628188 0.288,2.804 -2.426,0.257 -2.216,0.761 -0.28,-2.388 -0.113,-0.928 2.573,-0.307 2.174,-0.199",
    "m 24.328967,32.432188 3.263,-0.37 0.28,2.388 -1.307,1.1 -2.345,1.105 -0.288,-2.835 0.397,-1.388",
    "m 23.931967,33.820188 0.288,2.835 -1.022,0.929 -2.754,0.526 -0.45,-3.795 1.311,-0.175 2.627,-0.32",
    "m 18.356967,34.519188 1.637,-0.204 0.45,3.795 -2.353,0.262 -1.009,-3.696 1.275,-0.157",
    "m 14.616967,34.815188 2.465,-0.139 1.009,3.696 0.081,0.748 -3.614,0.343 -0.225,-2.24 0.284,-2.408",
    "m 11.411967,33.490188 2.492,-0.202 0.713,1.527 -0.284,2.408 -3.678,0.324 -0.203,-2.262 1.094,-0.095 -0.134,-1.7",
    "m 8.6989666,31.999188 1.8330004,-0.145 0.88,1.636 0.134,1.7 -1.094,0.095 0.203,2.262 -1.8440004,0.122 -0.1,-1.127 -0.296,-3.39 0.378,-0.022 -0.094,-1.131",
    "m 8.6989666,31.999188 0.094,1.131 -0.378,0.022 0.296,3.39 -3.591,0.32 0.46,-2.885 -0.154,-1.685 1.47,-0.14 1.803,-0.153",
    "m 6.0479666,25.449188 0.072,2.277 0.451,0.59 0.127,0.167 0.179,0.356 -0.085,2.307 0.104,1.006 -1.47,0.14 -0.329,-3.569 -0.288,-3.43 1.239,0.156",
    "m 9.3429666,27.424188 0.9020004,1.042 0.287,3.388 -1.8330004,0.145 -1.803,0.153 -0.104,-1.006 0.085,-2.307 -0.179,-0.356 -0.127,-0.167 -0.451,-0.59 3.223,-0.302",
    "m 10.244967,28.466188 3.078,-0.276 0.081,-0.009 0.171,1.771 0.294,1.249 0.166,0.365 -0.131,1.722 -2.492,0.202 -0.88,-1.636 -0.287,-3.388",
    "m 17.987967,30.741188 0.369,3.778 -1.275,0.157 -2.465,0.139 -0.713,-1.527 0.131,-1.722 1.88,-0.185 -0.041,-0.378 1.271,-0.153 0.095,-0.009 0.748,-0.1",
    "m 20.903967,30.377188 0.401,3.763 -1.311,0.175 -1.637,0.204 -0.369,-3.778 2.916,-0.364",
    "m 20.826967,29.614188 3.119,-0.355 0.383,3.173 -0.397,1.388 -2.627,0.32 -0.401,-3.763 -0.077,-0.763",
    "m 24.174967,28.082188 2.89,-0.334 0.527,4.314 -3.263,0.37 -0.383,-3.173 0.229,-1.177",
    "m 27.064967,27.748188 0.784,-0.099 0.37,-0.04 0.094,0.942 1.474,-0.157 0.265,2.433 -2.573,0.307 -0.414,-3.386",
    "m 29.786967,28.394188 2.136,-0.407 0.235,2.056 0.068,0.585 -2.174,0.199 -0.265,-2.433",
    "m 31.531967,24.386188 0.117,1.141 0.274,2.46 -2.136,0.407 -1.474,0.157 -0.094,-0.942 -0.37,0.04 -0.127,-2.812 3.81,-0.451",
    "m 23.963967,24.310188 3.53,-0.393 0.228,0.92 0.127,2.812 -0.784,0.099 -2.89,0.334 -0.026,-2.078 -0.185,-1.694",
    "m 24.148967,26.004188 0.026,2.078 -0.229,1.177 -3.119,0.355 -0.18,-2.987 0.712,-0.289 2.79,-0.334",
    "m 20.646967,26.627188 0.18,2.987 0.077,0.763 -2.916,0.364 -0.748,0.1 -0.384,-3.778 0.835,-0.107 2.956,-0.329",
    "m 16.855967,27.063188 0.384,3.778 -0.095,0.009 -1.271,0.153 0.041,0.378 -1.88,0.185 -0.166,-0.365 -0.294,-1.249 -0.171,-1.771 -0.081,0.009 -0.072,-0.748 3.605,-0.379",
    "m 17.333967,23.661188 0.357,3.295 -0.835,0.107 -3.605,0.379 -0.334,-3.308 4.417,-0.473",
    "m 17.283967,23.205188 3.701,-0.427 0.374,3.56 -0.712,0.289 -2.956,0.329 -0.357,-3.295 -0.05,-0.456",
    "m 27.109967,20.951188 4.024,-0.509 0.398,3.944 -3.81,0.451 -0.228,-0.92 -0.384,-2.966",
    "m 26.992967,20.019188 0.117,0.932 0.384,2.966 -3.53,0.393 -0.45,-3.904 1.302,-0.139 2.177,-0.248",
    "m 23.513967,20.406188 0.45,3.904 0.185,1.694 -2.79,0.334 -0.374,-3.56 -0.226,-2.061 2.755,-0.311",
    "m 20.758967,20.717188 0.226,2.061 -3.701,0.427 -0.216,-2.042 3.655,-0.811 0.036,0.365",
    "m 12.605967,20.852188 3.096,-0.306 0.645,-0.063 0.059,0.559 0.297,0.162 0.365,-0.041 0.216,2.042 0.05,0.456 -4.417,0.473 -0.045,-0.464 -0.266,-2.818",
    "m 12.871967,23.670188 0.045,0.464 0.334,3.308 0.072,0.748 -3.078,0.276 -0.9020004,-1.042 -0.334,-3.389 3.8630004,-0.365",
    "m 9.0089666,24.035188 0.334,3.389 -3.223,0.302 -0.072,-2.277 -0.306,-0.329 -0.05,-0.121 0.009,-0.068 0.132,-0.251 1.554,-1.632 0.239,-0.198 1.203,-0.776 0.18,1.961",
    "m 30.747967,17.058188 0.319,2.836 0.067,0.548 -4.024,0.509 -0.117,-0.932 -0.095,-2.448 1.281,-0.162 2.569,-0.351",
    "m 24.517967,17.847188 2.38,-0.276 0.095,2.448 -2.177,0.248 -0.298,-2.42",
    "m 22.544967,16.936188 1.833,-0.211 0.14,1.122 0.298,2.42 -1.302,0.139 -2.755,0.311 -0.036,-0.365 -0.239,-2.05 -0.125,-1.114 2.186,-0.252",
    "m 17.572967,18.644188 2.911,-0.342 0.239,2.05 -3.655,0.811 -0.365,0.041 -0.297,-0.162 -0.059,-0.559 -0.645,0.063 -0.153,-1.672 2.024,-0.23",
    "m 15.548967,18.874188 0.153,1.672 -3.096,0.306 -0.1986,-1.67168 -0.7064,0.0627 -0.122,-1.076 0.049,-1.068 0.037,-0.091 0.04,-0.053 1.609,-0.137 0.549,-0.049 1.519,0.406 0.167,1.699",
    "m 8.5579666,19.537188 3.1430004,-0.294 0.70702,-0.0628 0.19798,1.67176 0.266,2.818 -3.8630004,0.365 -0.18,-1.961 -0.149,-1.411 -0.122,-1.126",
    "m 4.4759666,21.028188 4.204,-0.365 0.149,1.411 -1.203,0.776 -0.239,0.198 -1.554,1.632 -0.132,0.251 -0.009,0.068 0.05,0.121 0.306,0.329 -1.239,-0.156 -0.333,-4.265",
    "m 6.6829666,17.445188 1.632,-0.152 0.365,3.37 -4.204,0.365 -0.015,-0.184 -0.283,-3.178 2.505,-0.221",
    "m 30.207967,12.542188 0.304,2.506 0.236,2.01 -2.569,0.351 -0.573,-4.502 2.602,-0.365",
    "m 25.085967,13.204188 2.52,-0.297 0.573,4.502 -1.281,0.162 -2.38,0.276 -0.14,-1.122 1.105,-0.132 -0.397,-3.389",
    "m 21.998967,12.434188 2.965,-0.371 0.122,1.141 0.397,3.389 -1.105,0.132 -1.833,0.211 -0.546,-4.502",
    "m 21.547967,11.902188 0.451,0.532 0.546,4.502 -2.186,0.252 -0.727,0.086 -0.54,-4.488 -0.054,-0.563 2.51,-0.321",
    "m 19.091967,12.786188 0.54,4.488 0.727,-0.086 0.125,1.114 -2.911,0.342 -0.505,-4.475 2.024,-1.383",
    "m 14.182967,14.462188 2.885,-0.293 0.505,4.475 -2.024,0.23 -0.167,-1.699 -1.519,-0.406 -0.549,0.049 -0.226,-2.262 1.095,-0.094",
    "m 13.087967,14.556188 0.226,2.262 -1.609,0.137 -0.04,0.053 -0.037,0.091 -0.049,1.068 0.122,1.076 -3.1430004,0.294 -0.243,-2.244 1.406,-2.43 3.3670004,-0.307",
    "m 29.696967,8.2821878 0.406,3.3990002 0.105,0.861 -2.602,0.365 -2.52,0.297 -0.122,-1.141 -0.112,-3.3700002 1.104,-0.127 3.713,-0.522 0.028,0.238",
    "m 21.506967,8.6661878 1.109,-0.127 0.032,0.3740001 2.204,-0.2200001 0.112,3.3700002 -2.965,0.371 -0.451,-0.532 -0.208,-1.699 0.326,-0.037 -0.091,-0.9730001 -0.068,-0.5270001",
    "m 13.853967,11.077188 3.741,-0.401 1.443,1.547 0.054,0.563 -2.024,1.383 -2.885,0.293 -0.329,-3.385",
    "m 13.853967,11.077188 0.329,3.385 -1.095,0.094 -3.3670004,0.307 -0.319,-3.358 4.4520004,-0.428",
    "m 25.553967,5.1821878 3.71,-0.478 0.162,1.343 0.243,1.997 -3.713,0.522 -0.402,-3.384",
    "m 25.553967,5.1821878 0.402,3.384 -1.104,0.127 -2.204,0.2200001 -0.032,-0.3740001 -1.109,0.127 -0.215,-1.835 -0.135,-1.113 4.397,-0.536",
    "m 17.415967,7.2591878 3.876,-0.428 0.215,1.835 0.068,0.5270001 0.091,0.9730001 -0.326,0.037 0.208,1.699 -2.51,0.321 -1.443,-1.547 -0.179,-3.4170002",
    "m 17.415967,7.2591878 0.179,3.4170002 -3.741,0.401 -0.338,-3.3810002 -0.057,-0.558 1.72,-0.203 2.174,-0.23 0.063,0.554",
    "m 13.515967,7.6961878 0.338,3.3810002 -4.4520004,0.428 -0.076,-0.838 1.0580004,-0.577 0.284,-0.1850001 0.22,-0.347 0.168,-0.316 0.064,-0.171 0.197,-0.7580001 0.518,-0.446 1.126,-0.112 0.555,-0.059",
    "m 9.3259666,10.667188 0.076,0.838 0.319,3.358 -1.406,2.43 -1.632,0.152 -0.224,-2.262 -0.054,-0.022 -0.028,-0.055 -0.352,-3.889 0.519,-0.352 0.226,-0.324 0.545,-0.316 0.108,-0.022 0.194,0.049 0.522,0.181 0.744,0.472 0.085,0.024 0.276,-0.154 0.082,-0.108",
    "m 3.6769666,12.113188 2.348,-0.896 0.352,3.889 0.028,0.055 0.054,0.022 0.224,2.262 -2.505,0.221 -0.316,-3.538 -0.185,-2.015",
    "m 28.718967,1.7661878 0.279,0.801 0.266,2.137 -3.71,0.478 -0.369,-3.001 3.534,-0.415",
    "m 24.274967,2.2791878 0.91,-0.098 0.369,3.001 -4.397,0.536 -0.38,-3.037 3.498,-0.402",
    "m 20.776967,2.6811878 0.38,3.037 0.135,1.113 -3.876,0.428 -0.474,-4.182 2.582,-0.262 1.253,-0.134",
    "m 16.941967,3.0771878 0.411,3.628 -2.174,0.23 -1.72,0.203 0.057,0.558 -0.555,0.059 -0.414,-4.219 2.84,-0.293 1.555,-0.166",
    "m 9.6809666,3.8111878 2.8660004,-0.275 0.414,4.219 -1.126,0.112 -0.518,0.446 -0.197,0.7580001 -0.064,0.171 -0.168,0.316 -0.22,0.347 -0.284,0.1850001 -1.0580004,0.577 -0.615,-6.1210002 0.97,-0.735"
  ];

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
  var stateG = document.createElementNS(SVGNS, "g");
  stateG.setAttribute("class", "eco-state-g");
  stateG.setAttribute("transform", STATE_TRANSFORM);
  INDIANA_PATHS.forEach(function (dStr) {
    var cp = document.createElementNS(SVGNS, "path");
    cp.setAttribute("d", dStr);
    cp.setAttribute("class", "eco-county");
    stateG.appendChild(cp);
  });
  svg.appendChild(stateG);
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
    var svgRect = svg.getBoundingClientRect();
    var x = (cx / VB_W) * svgRect.width + (svgRect.left - wrapRect.left);
    var y = (cy / VB_H) * svgRect.height + (svgRect.top - wrapRect.top);
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
      var item = document.createElement(d.url ? "a" : "div");
      item.className = "eco-item" + (d.outOfState ? " out-of-state" : "");
      item.setAttribute("data-city", d.city);
      if (d.url) {
        item.href = d.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      } else {
        item.tabIndex = 0;
      }
      item.innerHTML =
        '<span class="eco-cat">' + d.category + "</span>" +
        "<h4>" + d.name + "</h4>" +
        '<div class="eco-loc">📍 ' + d.city + ", " + d.state +
          (d.outOfState ? ' &nbsp;<span class="eco-oos">Out of state</span>' : "") + "</div>" +
        "<p>" + d.description + "</p>" +
        (d.url ? '<span class="eco-visit">Visit site <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg></span>' : "");
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
