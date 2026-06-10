<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioCAN – CDMO Network & Funding | Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    :root{--navy:#0D4568;--green:#3EB248;--green2:#00843D;--bg:#fff;--bg2:#F7F9FB;--dark:#082D46;--border:#E6EAF0;--text:#102A43;--muted:#627D98;--teal:#0D5A70;--ease:cubic-bezier(.2,0,0,1);}
    *,*::before,*::after{box-sizing:border-box;}html{scroll-behavior:smooth;}
    body{margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    h1,h2,h3,h4{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:90px;display:flex;align-items:center;background:var(--dark);box-shadow:0 1px 0 rgba(255,255,255,.08),0 2px 12px rgba(8,24,40,.3);}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo img{height:44px;}.nav-back{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1.5px solid rgba(255,255,255,.35);border-radius:8px;font-size:.88rem;font-weight:600;color:#fff;transition:background 180ms,border-color 180ms;}.nav-back:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.6);}
    .nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms;}.nav-cta:hover{background:var(--green2);transform:translateY(-1px);}
    .prog-hero{position:relative;padding:56px 0 80px;background:linear-gradient(155deg,#0a3a50 0%,#0D5A70 50%,#0D4568 100%);overflow:hidden;}
    .prog-hero::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1606206873764-fd15e242f4c8?w=1600&q=75');background-size:cover;background-position:center;opacity:.1;}
    .hero-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(62,178,72,.15);border:1px solid rgba(62,178,72,.3);border-radius:100px;font-size:.76rem;font-weight:700;color:#7DD580;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
    .prog-hero h1{font-size:clamp(2.4rem,5vw,4.2rem);font-weight:800;letter-spacing:-.04em;line-height:1.06;color:#fff;margin-bottom:20px;}
    .prog-hero p.lead{font-size:1.1rem;line-height:1.72;color:rgba(255,255,255,.7);max-width:560px;margin-bottom:36px;}
    .hero-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms,box-shadow 200ms;}.hero-cta:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,178,72,.35);}
    .hero-metrics{display:flex;gap:40px;margin-top:52px;flex-wrap:wrap;}
    .hm-item{display:flex;flex-direction:column;gap:4px;}.hm-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.2rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;}.hm-num em{font-style:normal;color:var(--green);}.hm-label{font-size:.85rem;color:rgba(255,255,255,.52);}
    .section{padding:88px 0;}.section-alt{background:var(--bg2);}.section-dark{background:var(--dark);color:#fff;}
    .slabel{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}.slabel::before{content:'';width:18px;height:2px;background:var(--green);border-radius:1px;}
    .stitle{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}.section-dark .stitle{color:#fff;}
    .ssub{font-size:1.02rem;line-height:1.72;color:var(--muted);max-width:540px;}.section-dark .ssub{color:rgba(255,255,255,.58);}
    .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
    .overview-copy p{font-size:1.02rem;line-height:1.78;color:var(--muted);margin-bottom:16px;}
    .feature-list{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:12px;}
    .feature-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;line-height:1.6;color:var(--muted);}
    .feature-list li::before{content:'✓';width:22px;height:22px;border-radius:50%;background:rgba(62,178,72,.12);color:var(--green2);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;margin-top:1px;}
    .overview-image{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:var(--bg2);}.overview-image img{width:100%;height:100%;object-fit:cover;}
    .cdmo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:44px;}
    .cdmo-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:26px;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}.cdmo-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .cdmo-card h3{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:8px;}
    .cdmo-cap{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px;}
    .cdmo-tag{display:inline-flex;padding:3px 9px;background:rgba(13,69,104,.07);color:var(--navy);border-radius:100px;font-size:.72rem;font-weight:600;}
    .cdmo-card p{font-size:.87rem;line-height:1.62;color:var(--muted);}
    .funding-types{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:44px;}
    .fund-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:28px;}
    .fund-card h3{font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:8px;}
    .fund-card p{font-size:.9rem;line-height:1.68;color:rgba(255,255,255,.58);}
    .fund-range{font-family:'Manrope',system-ui,sans-serif;font-size:1.7rem;font-weight:800;color:var(--green);letter-spacing:-.03em;margin-bottom:8px;}
    .metrics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;}
    .metric-item{padding:36px 32px;background:rgba(255,255,255,.04);}
    .metric-n{font-family:'Manrope',system-ui,sans-serif;font-size:3rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;margin-bottom:8px;}.metric-n em{font-style:normal;color:var(--green);}
    .metric-l{font-size:.95rem;font-weight:600;color:rgba(255,255,255,.82);margin-bottom:4px;}.metric-d{font-size:.83rem;color:rgba(255,255,255,.4);}
    .faq-list{display:flex;flex-direction:column;gap:8px;margin-top:44px;}
    .faq-item{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff;}
    .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer;font-weight:600;font-size:.97rem;color:var(--text);user-select:none;}
    .faq-q svg{width:18px;height:18px;stroke:var(--muted);fill:none;stroke-width:2;flex-shrink:0;transition:transform 250ms var(--ease);}
    .faq-item.open .faq-q svg{transform:rotate(180deg);}
    .faq-a{max-height:0;overflow:hidden;transition:max-height 300ms var(--ease);}
    .faq-a-inner{padding:0 24px 20px;font-size:.92rem;line-height:1.72;color:var(--muted);}
    .cta-box{background:linear-gradient(135deg,#0a3a50 0%,#0D5A70 100%);border-radius:24px;padding:64px 56px;text-align:center;}
    .cta-box h2{font-size:clamp(1.8rem,3.5vw,2.5rem);font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:16px;}
    .cta-box p{font-size:1.02rem;line-height:1.7;color:rgba(255,255,255,.62);max-width:500px;margin:0 auto 32px;}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity 550ms var(--ease),transform 550ms var(--ease);}.reveal.vis{opacity:1;transform:translateY(0);}
    @media(max-width:1024px){.overview-grid{grid-template-columns:1fr;gap:40px;}.cdmo-grid{grid-template-columns:1fr;}.funding-types{grid-template-columns:1fr;}.metrics-grid{grid-template-columns:1fr;}}
    @media(max-width:768px){.section{padding:64px 0;}.cta-box{padding:44px 28px;}}
  </style>
</head>
<body data-page="programs" data-breadcrumb="Programs > BioCAN">
<div id="hb-header"></div>

<section class="prog-hero">
  <div class="container">
    <div class="hero-tag">CDMO Network &amp; Funding</div>
    <h1>The Network That<br>Powers the Bioeconomy</h1>
    <p class="lead">BioCAN connects Indiana biotech companies to contract development and manufacturing organizations, federal funding programs, and the capital network needed to scale.</p>
    <a href="#cta" class="hero-cta">Apply for Funding →</a>
    <div class="hero-metrics">
      <div class="hm-item"><div class="hm-num"><em>25+</em></div><div class="hm-label">Indiana CDMO &amp; lab resources</div></div>
      <div class="hm-item"><div class="hm-num"><em>7</em></div><div class="hm-label">Capability areas mapped</div></div>
      <div class="hm-item"><div class="hm-num"><em>#1</em></div><div class="hm-label">U.S. pharmaceutical exports</div></div>
      <div class="hm-item"><div class="hm-num"><em>All 3</em></div><div class="hm-label">COVID-19 vaccines made in IN</div></div>
    </div>
  </div>
</section>

<section class="section" id="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-copy reveal">
        <div class="slabel">Overview</div>
        <h2 class="stitle">Connecting Companies to Capital and Capacity</h2>
        <p>BioCAN serves as Indiana's central hub for biomanufacturing network access and funding navigation. Whether a company needs a CDMO partner, a federal grant, or a strategic investor introduction, BioCAN provides the connections.</p>
        <p>The BioCAN network spans Indiana's full CDMO ecosystem — from drug substance to drug product, biologics to small molecules, Phase I to commercial scale.</p>
        <ul class="feature-list">
          <li>Pre-vetted CDMO network with negotiated access terms</li>
          <li>Federal funding navigation — BARDA, NIH, DoD, USDA</li>
          <li>State grant programs and Indiana-specific incentives</li>
          <li>Strategic partner introductions and deal structuring</li>
          <li>Due diligence support for inbound investors</li>
        </ul>
      </div>
      <div class="reveal">
        <div class="overview-image">
          <img src="https://images.unsplash.com/photo-1606206873764-fd15e242f4c8?w=900&q=80" alt="Biomanufacturing facility" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="cdmos">
  <div class="container">
    <div class="slabel">CDMO Network</div>
    <h2 class="stitle">Manufacturing Partners</h2>
    <p class="ssub">Indiana's BioCAN CDMO network offers full-spectrum manufacturing capabilities — from early development through commercial scale.</p>
    <div class="cdmo-grid">
      <div class="cdmo-card reveal"><h3>Biologics &amp; Large Molecule</h3><p>Upstream cell culture, downstream purification, fill/finish capabilities across multiple biologic modalities.</p><div class="cdmo-cap"><span class="cdmo-tag">Monoclonal Antibodies</span><span class="cdmo-tag">Proteins</span><span class="cdmo-tag">Cell Therapy</span><span class="cdmo-tag">Gene Therapy</span></div></div>
      <div class="cdmo-card reveal"><h3>Small Molecule</h3><p>API synthesis, formulation development, and solid dosage form manufacturing with full GMP compliance.</p><div class="cdmo-cap"><span class="cdmo-tag">API Synthesis</span><span class="cdmo-tag">Formulation</span><span class="cdmo-tag">Tablets</span><span class="cdmo-tag">Injectables</span></div></div>
      <div class="cdmo-card reveal"><h3>Fermentation &amp; Bioprocessing</h3><p>Microbial fermentation, industrial bioprocessing, and specialty ingredient manufacturing at scale.</p><div class="cdmo-cap"><span class="cdmo-tag">Fermentation</span><span class="cdmo-tag">Extraction</span><span class="cdmo-tag">Purification</span><span class="cdmo-tag">Specialty Ingredients</span></div></div>
    </div>
  </div>
</section>

<section class="section section-dark" id="funding">
  <div class="container">
    <div class="slabel">Funding Programs</div>
    <h2 class="stitle" style="margin-bottom:12px;">Capital Access</h2>
    <p class="ssub" style="margin-bottom:44px;">BioCAN navigates the complex federal and state funding landscape so Indiana companies can focus on their science.</p>
    <div class="funding-types reveal">
      <div class="fund-card"><div class="fund-range">$150K – $2M</div><h3>SBIR / STTR Programs</h3><p>NIH, NSF, USDA, and DoD SBIR/STTR programs. BioCAN provides application coaching, technical writing support, and review preparation.</p></div>
      <div class="fund-card"><div class="fund-range">$1M – $50M+</div><h3>BARDA &amp; DoD Programs</h3><p>Large-scale biodefense and medical countermeasure funding. BioCAN connects Indiana companies to BARDA EZ-BAA and DoD manufacturing programs.</p></div>
      <div class="fund-card"><div class="fund-range">$50K – $500K</div><h3>Indiana State Programs</h3><p>IEDC biosciences grants, Elevate Ventures co-investment programs, and Indiana-specific life sciences commercialization funding.</p></div>
      <div class="fund-card"><div class="fund-range">Rolling</div><h3>Strategic Investment</h3><p>Direct introductions to Indiana-focused healthcare investors, life sciences venture capital, and strategic corporate partners.</p></div>
    </div>
  </div>
</section>

<section class="section" id="impact">
  <div class="container">
    <div class="slabel">Network</div>
    <h2 class="stitle" style="margin-bottom:44px;">A Growing Resource Network</h2>
    <div class="metrics-grid reveal">
      <div class="metric-item"><div class="metric-n"><em>25+</em></div><div class="metric-l">Indiana Resources Mapped</div><div class="metric-d">CDMOs, labs, and scale-up partners across the state — and growing</div></div>
      <div class="metric-item"><div class="metric-n"><em>7</em></div><div class="metric-l">Capability Areas</div><div class="metric-d">From drug product and gene therapy to fermentation and clinical labs</div></div>
      <div class="metric-item"><div class="metric-n"><em>#1</em></div><div class="metric-l">Pharmaceutical Exports</div><div class="metric-d">Indiana leads the nation in pharmaceutical exports</div></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="faq">
  <div class="container">
    <div class="slabel">FAQs</div><h2 class="stitle">Common Questions</h2>
    <div class="faq-list">
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">How does CDMO matching work?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">BioCAN conducts a needs assessment to understand your manufacturing requirements — modality, scale, timeline, regulatory status — and then identifies the best-fit CDMO partners within the network. We facilitate introductions and can support term negotiation.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">Does BioCAN charge companies for funding navigation?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Core navigation services are available at no cost to Indiana-based companies. More intensive engagements — such as full SBIR application development or regulatory strategy — may involve a cost-share arrangement.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">What federal agencies does BioCAN work with?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">BioCAN has active relationships with NIH, BARDA, NSF, USDA, DARPA, and multiple DoD programs. We stay current on open funding opportunities and match Indiana companies to the most relevant programs.</div></div></div>
    </div>
  </div>
</section>

<span id="contact"></span><section class="section" id="cta">
  <div class="container">
    <div class="cta-box reveal">
      <h2>Apply for Funding or CDMO Access</h2>
      <p>Connect with the BioCAN team to discuss your manufacturing needs, funding opportunities, or strategic partnership interests.</p>
      <a href="#" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms;" onmouseover="this.style.background=var(--green2)" onmouseout="this.style.background=var(--green)">Apply Now →</a>
    </div>
  </div>
</section>

<div id="hb-footer"></div>
<script>
document.querySelectorAll('.faq-q').forEach(q=>{function t(){const i=q.parentElement,o=i.classList.contains('open');document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open');x.querySelector('.faq-a').style.maxHeight='0';x.querySelector('.faq-q').setAttribute('aria-expanded','false');});if(!o){i.classList.add('open');i.querySelector('.faq-a').style.maxHeight=i.querySelector('.faq-a-inner').scrollHeight+'px';q.setAttribute('aria-expanded','true');}}q.addEventListener('click',t);q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});});
const obs=new IntersectionObserver(e=>e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('vis');obs.unobserve(en.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
function postH(){window.parent.postMessage({type:'resize',height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');}
if('ResizeObserver' in window) new ResizeObserver(postH).observe(document.body);
window.addEventListener('load',postH);window.addEventListener('resize',postH);setTimeout(postH,300);setTimeout(postH,900);
</script>
<script src="assets/site.js" defer></script>
</body>
</html>
