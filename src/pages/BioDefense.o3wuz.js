<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioDefense – National Security | Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    :root{--navy:#0D4568;--green:#3EB248;--green2:#00843D;--bg:#fff;--bg2:#F7F9FB;--dark:#082D46;--darker:#050E18;--border:#E6EAF0;--text:#102A43;--muted:#627D98;--ease:cubic-bezier(.2,0,0,1);}
    *,*::before,*::after{box-sizing:border-box;}html{scroll-behavior:smooth;}
    body{margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    h1,h2,h3,h4{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:90px;display:flex;align-items:center;background:var(--dark);box-shadow:0 1px 0 rgba(255,255,255,.08),0 2px 12px rgba(8,24,40,.3);}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo img{height:44px;}.nav-back{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1.5px solid rgba(255,255,255,.35);border-radius:8px;font-size:.88rem;font-weight:600;color:#fff;transition:background 180ms,border-color 180ms;}.nav-back:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.6);}
    .nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms;}.nav-cta:hover{background:var(--green2);transform:translateY(-1px);}
    .prog-hero{position:relative;padding:56px 0 80px;background:linear-gradient(155deg,#050E18 0%,#0D1F35 50%,#082D46 100%);overflow:hidden;}
    .prog-hero::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=75');background-size:cover;background-position:center;opacity:.08;}
    .prog-hero::after{content:'';position:absolute;top:-100px;right:-80px;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.1) 0%,transparent 70%);pointer-events:none;}
    .hero-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(62,178,72,.12);border:1px solid rgba(62,178,72,.28);border-radius:100px;font-size:.76rem;font-weight:700;color:#7DD580;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
    .prog-hero h1{font-size:clamp(2.4rem,5vw,4.2rem);font-weight:800;letter-spacing:-.04em;line-height:1.06;color:#fff;margin-bottom:20px;}
    .prog-hero p.lead{font-size:1.1rem;line-height:1.72;color:rgba(255,255,255,.65);max-width:580px;margin-bottom:36px;}
    .hero-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms,box-shadow 200ms;}.hero-cta:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,178,72,.35);}
    .hero-metrics{display:flex;gap:40px;margin-top:52px;flex-wrap:wrap;}
    .hm-item{display:flex;flex-direction:column;gap:4px;}.hm-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.2rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;}.hm-num em{font-style:normal;color:var(--green);}.hm-label{font-size:.85rem;color:rgba(255,255,255,.48);}
    .section{padding:88px 0;}.section-alt{background:var(--bg2);}.section-dark{background:var(--dark);color:#fff;}.section-darker{background:var(--darker);color:#fff;}
    .slabel{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}.slabel::before{content:'';width:18px;height:2px;background:var(--green);border-radius:1px;}
    .stitle{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}.section-dark .stitle,.section-darker .stitle{color:#fff;}
    .ssub{font-size:1.02rem;line-height:1.72;color:var(--muted);max-width:540px;}.section-dark .ssub,.section-darker .ssub{color:rgba(255,255,255,.55);}
    .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
    .overview-copy p{font-size:1.02rem;line-height:1.78;color:var(--muted);margin-bottom:16px;}
    .feature-list{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:12px;}
    .feature-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;line-height:1.6;color:var(--muted);}
    .feature-list li::before{content:'✓';width:22px;height:22px;border-radius:50%;background:rgba(62,178,72,.12);color:var(--green2);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;margin-top:1px;}
    .overview-image{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:var(--bg2);}.overview-image img{width:100%;height:100%;object-fit:cover;}
    .pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:44px;}
    .pillar{padding:30px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;transition:background 200ms,border-color 200ms;}.pillar:hover{background:rgba(255,255,255,.09);border-color:rgba(62,178,72,.28);}
    .pillar-ico{font-size:1.8rem;margin-bottom:14px;}
    .pillar h3{font-size:1.02rem;font-weight:700;color:#fff;margin-bottom:8px;}
    .pillar p{font-size:.88rem;line-height:1.65;color:rgba(255,255,255,.55);}
    .metrics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;}
    .metric-item{padding:36px 32px;background:rgba(255,255,255,.04);}
    .metric-n{font-family:'Manrope',system-ui,sans-serif;font-size:3rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;margin-bottom:8px;}.metric-n em{font-style:normal;color:var(--green);}
    .metric-l{font-size:.95rem;font-weight:600;color:rgba(255,255,255,.82);margin-bottom:4px;}.metric-d{font-size:.83rem;color:rgba(255,255,255,.4);}
    .partners-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px;}
    .partner-card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:24px;text-align:center;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}.partner-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .partner-card h3{font-size:.95rem;font-weight:700;color:var(--text);margin-bottom:6px;}
    .partner-card p{font-size:.82rem;line-height:1.6;color:var(--muted);}
    .faq-list{display:flex;flex-direction:column;gap:8px;margin-top:44px;}
    .faq-item{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff;}
    .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer;font-weight:600;font-size:.97rem;color:var(--text);user-select:none;}
    .faq-q svg{width:18px;height:18px;stroke:var(--muted);fill:none;stroke-width:2;flex-shrink:0;transition:transform 250ms var(--ease);}
    .faq-item.open .faq-q svg{transform:rotate(180deg);}
    .faq-a{max-height:0;overflow:hidden;transition:max-height 300ms var(--ease);}
    .faq-a-inner{padding:0 24px 20px;font-size:.92rem;line-height:1.72;color:var(--muted);}
    .cta-box{background:linear-gradient(135deg,#050E18 0%,#0D2640 100%);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:64px 56px;text-align:center;position:relative;overflow:hidden;}
    .cta-box::after{content:'';position:absolute;bottom:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.12) 0%,transparent 70%);pointer-events:none;}
    .cta-box h2{font-size:clamp(1.8rem,3.5vw,2.5rem);font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:16px;}
    .cta-box p{font-size:1.02rem;line-height:1.7;color:rgba(255,255,255,.58);max-width:500px;margin:0 auto 32px;}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity 550ms var(--ease),transform 550ms var(--ease);}.reveal.vis{opacity:1;transform:translateY(0);}
    @media(max-width:1024px){.overview-grid{grid-template-columns:1fr;gap:40px;}.pillars{grid-template-columns:1fr;}.metrics-grid{grid-template-columns:1fr;}.partners-grid{grid-template-columns:1fr;}}
    @media(max-width:768px){.section{padding:64px 0;}.cta-box{padding:44px 28px;}}
  </style>
</head>
<body data-page="programs" data-breadcrumb="Programs > BioDefense">
<div id="hb-header"></div>

<section class="prog-hero">
  <div class="container">
    <div class="hero-tag">Ecosystem Initiative · Future-Facing</div>
    <h1>Biosecurity for<br>America's Bioeconomy</h1>
    <p class="lead">BioDefense is a future-facing ecosystem initiative — exploring how Indiana's biomanufacturing base can strengthen domestic production of critical medicines and countermeasures and support national biosecurity. It is an ecosystem initiative, not one of the four core EDA-funded Heartland BioWorks projects (BioTrain, BioLaunch, BioCAN, and the planned HQ).</p>
    <a href="#cta" class="hero-cta">Get Involved →</a>
    <div class="hero-metrics">
      <div class="hm-item"><div class="hm-num"><em>#1</em></div><div class="hm-label">U.S. state for pharmaceutical exports</div></div>
      <div class="hm-item"><div class="hm-num"><em>All 3</em></div><div class="hm-label">COVID-19 vaccines made in Indiana</div></div>
      <div class="hm-item"><div class="hm-num"><em>Future</em></div><div class="hm-label">Ecosystem initiative</div></div>
    </div>
  </div>
</section>

<section class="section" id="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-copy reveal">
        <div class="slabel">Overview</div>
        <h2 class="stitle">Biotechnology as a Strategic National Asset</h2>
        <p>The National Biodefense Strategy identifies domestic biomanufacturing as critical to national security. BioDefense positions Indiana as the nucleus of America's biodefense industrial base — connecting federal agencies to the manufacturing capacity and technical capabilities needed to respond to biological threats.</p>
        <p>From medical countermeasure manufacturing to biosurveillance networks, BioDefense bridges Indiana's life sciences ecosystem with the nation's defense and security missions.</p>
        <ul class="feature-list">
          <li>BARDA and DoD manufacturing partnerships</li>
          <li>Supply chain resilience and domestic sourcing programs</li>
          <li>Medical countermeasure development and scale-up</li>
          <li>Dual-use technology commercialization</li>
          <li>Biosurveillance and detection system support</li>
        </ul>
      </div>
      <div class="reveal">
        <div class="overview-image">
          <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80" alt="Defense technology" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-dark" id="pillars">
  <div class="container">
    <div class="slabel">Strategic Pillars</div>
    <h2 class="stitle" style="margin-bottom:12px;">The BioDefense Framework</h2>
    <p class="ssub" style="margin-bottom:0;">Three interconnected areas of focus that form Indiana's biodefense strategy.</p>
    <div class="pillars reveal">
      <div class="pillar"><div class="pillar-ico">🛡️</div><h3>Supply Chain Resilience</h3><p>Reducing dependence on foreign sources for critical biologics, APIs, and biomanufacturing inputs through domestic production expansion and strategic stockpiling programs.</p></div>
      <div class="pillar"><div class="pillar-ico">⚗️</div><h3>Medical Countermeasures</h3><p>Supporting rapid development and scalable domestic manufacturing of vaccines, therapeutics, and diagnostics against CBRN threats and emerging pathogens.</p></div>
      <div class="pillar"><div class="pillar-ico">🔬</div><h3>Dual-Use Technology</h3><p>Accelerating biotechnologies that serve both commercial and national security applications, from biosensors to synthetic biology platforms for defense missions.</p></div>
    </div>
  </div>
</section>

<section class="section" id="impact">
  <div class="container">
    <div class="slabel">Why It Matters</div>
    <h2 class="stitle" style="margin-bottom:44px;">Why Indiana for Biosecurity</h2>
    <div class="metrics-grid reveal">
      <div class="metric-item"><div class="metric-n"><em>#1</em></div><div class="metric-l">Pharmaceutical Exports</div><div class="metric-d">Indiana leads the nation — a foundation for domestic medicine production</div></div>
      <div class="metric-item"><div class="metric-n"><em>All 3</em></div><div class="metric-l">COVID-19 Vaccines</div><div class="metric-d">The only state that manufactures all three COVID-19 vaccines</div></div>
      <div class="metric-item"><div class="metric-n"><em>Top 3</em></div><div class="metric-l">Life Sciences Exports</div><div class="metric-d">Among the top three U.S. states for life sciences exports</div></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="partners">
  <div class="container">
    <div class="slabel">Federal Partners</div>
    <h2 class="stitle">Agency Partnerships</h2>
    <p class="ssub">BioDefense maintains active relationships with the federal agencies driving America's biodefense strategy.</p>
    <div class="partners-grid">
      <div class="partner-card reveal"><h3>BARDA</h3><p>Biomedical Advanced Research and Development Authority — medical countermeasure development and manufacturing</p></div>
      <div class="partner-card reveal"><h3>DARPA</h3><p>Defense Advanced Research Projects Agency — biotechnology for national defense applications</p></div>
      <div class="partner-card reveal"><h3>USSOCOM</h3><p>Special Operations Command — advanced biomedical capabilities for special operations forces</p></div>
      <div class="partner-card reveal"><h3>DHS S&amp;T</h3><p>Department of Homeland Security — biosurveillance, detection, and consequence management</p></div>
      <div class="partner-card reveal"><h3>DoD JPEO CBRND</h3><p>Joint Program Executive Office — chemical, biological, radiological, and nuclear defense programs</p></div>
      <div class="partner-card reveal"><h3>NIH/NIAID</h3><p>National Institute of Allergy and Infectious Diseases — infectious disease and emerging pathogen programs</p></div>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <div class="slabel">FAQs</div><h2 class="stitle">Common Questions</h2>
    <div class="faq-list">
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">What types of companies does BioDefense work with?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">BioDefense works with biomanufacturers, biotech companies with dual-use technologies, defense contractors with biomedical programs, and research institutions developing relevant capabilities. Companies do not need to be exclusively defense-focused — commercial companies with relevant manufacturing capacity are often valuable partners.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">Do I need security clearances to participate?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Most BioDefense programs do not require security clearances. Some advanced programs with classified requirements will specify clearance needs. We can help companies understand the clearance process if a specific opportunity requires it.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">How does BioDefense relate to the National Biodefense Strategy?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">The National Biodefense Strategy calls for strengthening domestic biomanufacturing and reducing supply chain vulnerabilities. Heartland BioWorks' BioDefense program directly implements those priorities at the state and regional level by building Indiana's capacity to produce critical biodefense materials domestically.</div></div></div>
    </div>
  </div>
</section>

<span id="contact"></span><section class="section" id="cta">
  <div class="container">
    <div class="cta-box reveal">
      <h2>Explore BioDefense Initiatives</h2>
      <p>Connect with the BioDefense team to discuss partnerships, manufacturing capabilities, or federal program opportunities in Indiana's biodefense ecosystem.</p>
      <a href="#" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms;" onmouseover="this.style.background='#00843D'" onmouseout="this.style.background=''">Get In Touch →</a>
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
