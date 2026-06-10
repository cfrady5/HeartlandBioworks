<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Programs – Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    :root{--navy:#0D4568;--green:#3EB248;--green2:#00843D;--bg:#fff;--bg2:#F7F9FB;--dark:#082D46;--border:#E6EAF0;--text:#102A43;--muted:#627D98;--ease:cubic-bezier(.2,0,0,1);}
    *,*::before,*::after{box-sizing:border-box;}html{scroll-behavior:smooth;}
    body{margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    h1,h2,h3,h4{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:90px;display:flex;align-items:center;background:var(--dark);box-shadow:0 1px 0 rgba(255,255,255,.08),0 2px 12px rgba(8,24,40,.3);}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo img{height:44px;}.nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms;}.nav-cta:hover{background:var(--green2);transform:translateY(-1px);}
    .hero{padding:56px 0 72px;background:linear-gradient(155deg,#082D46 0%,#0D4568 60%,#0a3a58 100%);text-align:center;position:relative;overflow:hidden;}
    .hero::before{content:'';position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.12) 0%,transparent 70%);pointer-events:none;}
    .hero-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;background:rgba(62,178,72,.15);border:1px solid rgba(62,178,72,.3);border-radius:100px;font-size:.76rem;font-weight:700;color:#7DD580;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
    .hero h1{font-size:clamp(2.4rem,5vw,4rem);font-weight:800;letter-spacing:-.04em;line-height:1.06;color:#fff;margin-bottom:20px;}
    .hero h1 em{font-style:normal;background:linear-gradient(120deg,#3EB248,#7DD580);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .hero p{font-size:1.08rem;line-height:1.72;color:rgba(255,255,255,.65);max-width:560px;margin:0 auto;}
    .section{padding:88px 0;}.section-alt{background:var(--bg2);}
    .slabel{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}.slabel::before{content:'';width:18px;height:2px;background:var(--green);border-radius:1px;}
    .stitle{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}
    .prog-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:56px;}
    .prog-card{position:relative;border-radius:20px;overflow:hidden;min-height:380px;display:flex;flex-direction:column;justify-content:flex-end;transition:transform 220ms var(--ease),box-shadow 220ms var(--ease);cursor:pointer;}
    .prog-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(13,69,104,.2);}
    .prog-card[data-p="biotrain"]{background:linear-gradient(155deg,#0D4568 0%,#082D46 100%);}
    .prog-card[data-p="biolaunch"]{background:linear-gradient(155deg,#00843D 0%,#054A24 100%);}
    .prog-card[data-p="biocan"]{background:linear-gradient(155deg,#0D5A70 0%,#0D4568 100%);}
    .prog-card[data-p="biodefense"]{background:linear-gradient(155deg,#1A1A2E 0%,#0D4568 100%);}
    .prog-card-bg{position:absolute;inset:0;opacity:.1;background-size:cover;background-position:center;}
    .prog-card[data-p="biotrain"] .prog-card-bg{background-image:url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=60');}
    .prog-card[data-p="biolaunch"] .prog-card-bg{background-image:url('https://images.unsplash.com/photo-1559839697-5d2f7af76e3c?w=800&q=60');}
    .prog-card[data-p="biocan"] .prog-card-bg{background-image:url('https://images.unsplash.com/photo-1606206873764-fd15e242f4c8?w=800&q=60');}
    .prog-card[data-p="biodefense"] .prog-card-bg{background-image:url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=60');}
    .prog-card-content{position:relative;z-index:2;padding:36px;}
    .prog-ico{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:1.4rem;}
    .prog-tag{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px;}
    .prog-card-content h2{font-size:1.8rem;font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:10px;}
    .prog-card-content p{font-size:.92rem;line-height:1.65;color:rgba(255,255,255,.68);margin-bottom:24px;max-width:380px;}
    .prog-link{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:7px;font-size:.88rem;font-weight:600;color:#fff;transition:background 180ms,border-color 180ms;}
    .prog-link:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.35);}
    .ecosystem-intro{text-align:center;max-width:640px;margin:0 auto 56px;}
    .how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:48px;}
    .how-item{text-align:center;padding:24px;}
    .how-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.4rem;font-weight:800;letter-spacing:-.04em;color:var(--border);margin-bottom:14px;}
    .how-item h3{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:8px;}
    .how-item p{font-size:.88rem;line-height:1.65;color:var(--muted);}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity 550ms var(--ease),transform 550ms var(--ease);}.reveal.vis{opacity:1;transform:translateY(0);}
    /* filled, higher-contrast card CTA */
    .prog-link{background:#fff;color:var(--navy);border:0;font-weight:700;}
    .prog-link:hover{background:#eef3f8;}
    /* connector arrows between How It Works steps */
    .how-grid{position:relative;}
    .how-item{position:relative;}
    .how-item:not(:last-child)::after{content:"";position:absolute;top:38px;right:-10px;width:20px;height:20px;border-top:2px solid var(--green);border-right:2px solid var(--green);transform:rotate(45deg);opacity:.55;}
    @media(max-width:900px){.prog-grid{grid-template-columns:1fr;}.how-grid{grid-template-columns:repeat(2,1fr);}
      .how-item:nth-child(2n)::after{display:none;}
      .how-item::after{top:auto;bottom:-22px;right:50%;transform:translateX(50%) rotate(135deg);}}
    @media(max-width:540px){.section{padding:64px 0;}.how-grid{grid-template-columns:1fr;}.how-item::after{display:none;}}
  </style>
</head>
<body data-page="programs" data-breadcrumb="Programs">
<div id="hb-header"></div>

<section class="hero">
  <div class="container">
    <div class="hero-badge">Indiana's Biomanufacturing Ecosystem</div>
    <h1>Train. Innovate. <em>Scale.</em></h1>
    <p>Heartland BioWorks brings together workforce development, startup support, commercialization resources, and Indiana's biomanufacturing infrastructure to help biotech solutions move from idea to impact.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div style="text-align:center;margin-bottom:0;">
      <div class="slabel" style="justify-content:center;">Our Programs</div>
      <h2 class="stitle" style="max-width:560px;margin:0 auto 14px;">One Ecosystem, Working Together</h2>
      <p style="font-size:1.02rem;line-height:1.72;color:var(--muted);max-width:560px;margin:0 auto;">Heartland BioWorks is built on workforce development, commercialization, and resource coordination — anchored by a planned training facility and tied together through shared governance.</p>
    </div>
    <div class="prog-grid">
      <a href="biotrain.html" class="prog-card reveal" data-p="biotrain">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">🧬</div>
          <div class="prog-tag">Workforce Development</div>
          <h2>BioTrain</h2>
          <p>Workforce development through stackable credentials, employer upskilling and reskilling, and statewide training pathways.</p>
          <div class="prog-link">Explore BioTrain →</div>
        </div>
      </a>
      <a href="biolaunch.html" class="prog-card reveal" data-p="biolaunch">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">🚀</div>
          <div class="prog-tag">Commercialization &amp; Innovation</div>
          <h2>BioLaunch</h2>
          <p>Commercialization and innovation support for biotech solutions — including BioStart, peer-to-peer mentorship and startup support for founders.</p>
          <div class="prog-link">Explore BioLaunch →</div>
        </div>
      </a>
      <a href="biocan.html" class="prog-card reveal" data-p="biocan">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">⚗️</div>
          <div class="prog-tag">Resource Coordination &amp; Access</div>
          <h2>BioCAN</h2>
          <p>The BioResource Coordination and Access Network connects innovators with Indiana's CDMOs, labs, and scale-up resources.</p>
          <div class="prog-link">Explore BioCAN →</div>
        </div>
      </a>
      <a href="biocan.html#ecosystem-map" class="prog-card reveal" data-p="biocan">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">🏛️</div>
          <div class="prog-tag">Facility</div>
          <h2>Heartland BioWorks HQ</h2>
          <p>A planned 27,000 sq. ft. headquarters and hands-on biomanufacturing training facility in the 16 Tech Innovation District.</p>
          <div class="prog-link">See It on the Map →</div>
        </div>
      </a>
      <a href="#contact" class="prog-card reveal" data-p="biotrain">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">🧭</div>
          <div class="prog-tag">Ecosystem Coordination</div>
          <h2>Governance</h2>
          <p>Project oversight and stakeholder alignment across workforce partners, research institutions, manufacturers, and government.</p>
          <div class="prog-link">Partner With Us →</div>
        </div>
      </a>
      <a href="biodefense.html" class="prog-card reveal" data-p="biodefense">
        <div class="prog-card-bg"></div>
        <div class="prog-card-content">
          <div class="prog-ico">🛡️</div>
          <div class="prog-tag">Ecosystem Initiative</div>
          <h2>BioDefense</h2>
          <p>A future-facing ecosystem initiative exploring how Indiana's biomanufacturing base can support national biosecurity — not one of the four core EDA-funded projects.</p>
          <div class="prog-link">Explore BioDefense →</div>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="ecosystem-intro">
      <div class="slabel" style="justify-content:center;">How It Works</div>
      <h2 class="stitle" style="text-align:center;">An Integrated Ecosystem</h2>
      <p style="font-size:1.02rem;line-height:1.72;color:var(--muted);">The programs aren't siloed — they reinforce each other. BioTrain builds the workforce that BioLaunch companies hire. BioStart mentors founders. BioCAN connects them to Indiana's manufacturing and lab capacity. Governance and the planned HQ tie it all together.</p>
    </div>
    <div class="how-grid">
      <div class="how-item reveal"><div class="how-num">01</div><h3>Build the Workforce</h3><p>BioTrain creates the trained, credentialed talent pool Indiana companies need to grow and operate.</p></div>
      <div class="how-item reveal"><div class="how-num">02</div><h3>Launch &amp; Mentor</h3><p>BioLaunch and BioStart provide commercialization support and peer mentorship to turn science into companies.</p></div>
      <div class="how-item reveal"><div class="how-num">03</div><h3>Connect to Capacity</h3><p>BioCAN connects growing companies to Indiana's CDMOs, labs, and scale-up resources.</p></div>
      <div class="how-item reveal"><div class="how-num">04</div><h3>Coordinate &amp; Scale</h3><p>Shared governance and the planned 16 Tech HQ align stakeholders and anchor the ecosystem.</p></div>
    </div>
  </div>
</section>

<span id="contact"></span>
<div id="hb-footer"></div>
<script>
const obs=new IntersectionObserver(e=>e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('vis');obs.unobserve(en.target);}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
function postH(){window.parent.postMessage({type:'resize',height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');}
if('ResizeObserver' in window) new ResizeObserver(postH).observe(document.body);
window.addEventListener('load',postH);window.addEventListener('resize',postH);setTimeout(postH,300);setTimeout(postH,900);
</script>
<script src="assets/site.js" defer></script>
</body>
</html>
