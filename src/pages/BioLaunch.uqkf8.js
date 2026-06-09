<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioLaunch – Commercialization | Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root{--navy:#0D4568;--green:#3EB248;--green2:#00843D;--bg:#fff;--bg2:#F7F9FB;--dark:#082D46;--border:#E6EAF0;--text:#102A43;--muted:#627D98;--ease:cubic-bezier(.2,0,0,1);}
    *,*::before,*::after{box-sizing:border-box;}html{scroll-behavior:smooth;}
    body{margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    h1,h2,h3,h4{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:90px;display:flex;align-items:center;background:rgba(255,255,255,.97);box-shadow:0 1px 0 var(--border),0 2px 8px rgba(13,69,104,.08);backdrop-filter:blur(14px);}
    .nav-inner{width:100%;display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo img{height:44px;}
    .nav-back{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1.5px solid var(--border);border-radius:8px;font-size:.88rem;font-weight:600;color:var(--navy);transition:background 180ms,border-color 180ms;}
    .nav-back:hover{background:var(--bg2);border-color:var(--navy);}
    .nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms;}
    .nav-cta:hover{background:var(--green2);transform:translateY(-1px);}
    .prog-hero{position:relative;padding:150px 0 90px;background:linear-gradient(155deg,#054A24 0%,#00843D 50%,#065A2E 100%);overflow:hidden;}
    .prog-hero::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1559839697-5d2f7af76e3c?w=1600&q=75');background-size:cover;background-position:center;opacity:.1;}
    .prog-hero::after{content:'';position:absolute;top:-100px;right:-80px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.08) 0%,transparent 70%);pointer-events:none;}
    .hero-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:100px;font-size:.76rem;font-weight:700;color:rgba(255,255,255,.9);letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
    .prog-hero h1{font-size:clamp(2.4rem,5vw,4.2rem);font-weight:800;letter-spacing:-.04em;line-height:1.06;color:#fff;margin-bottom:20px;}
    .prog-hero p.lead{font-size:1.1rem;line-height:1.72;color:rgba(255,255,255,.7);max-width:560px;margin-bottom:36px;}
    .hero-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:#fff;color:var(--green2);border-radius:8px;font-size:1rem;font-weight:700;transition:background 200ms,transform 200ms,box-shadow 200ms;}
    .hero-cta:hover{background:rgba(255,255,255,.92);transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.2);}
    .hero-metrics{display:flex;gap:40px;margin-top:52px;flex-wrap:wrap;}
    .hm-item{display:flex;flex-direction:column;gap:4px;}
    .hm-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.2rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;}
    .hm-label{font-size:.85rem;color:rgba(255,255,255,.55);}
    .section{padding:88px 0;}.section-alt{background:var(--bg2);}.section-dark{background:var(--dark);color:#fff;}
    .slabel{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}
    .slabel::before{content:'';width:18px;height:2px;background:var(--green);border-radius:1px;}
    .stitle{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}
    .section-dark .stitle{color:#fff;}
    .ssub{font-size:1.02rem;line-height:1.72;color:var(--muted);max-width:540px;}
    .section-dark .ssub{color:rgba(255,255,255,.58);}
    .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
    .overview-copy p{font-size:1.02rem;line-height:1.78;color:var(--muted);margin-bottom:16px;}
    .feature-list{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:12px;}
    .feature-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;line-height:1.6;color:var(--muted);}
    .feature-list li::before{content:'✓';width:22px;height:22px;border-radius:50%;background:rgba(62,178,72,.12);color:var(--green2);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;margin-top:1px;}
    .overview-image{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:var(--bg2);}
    .overview-image img{width:100%;height:100%;object-fit:cover;}
    /* Stages timeline */
    .stages{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--border);border-radius:20px;overflow:hidden;margin-top:44px;}
    .stage{padding:32px 26px;border-right:1px solid var(--border);position:relative;}
    .stage:last-child{border-right:0;}
    .stage-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.4rem;font-weight:800;letter-spacing:-.04em;color:var(--border);line-height:1;margin-bottom:16px;}
    .stage h3{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:8px;}
    .stage p{font-size:.85rem;line-height:1.65;color:var(--muted);}
    .metrics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;}
    .metric-item{padding:36px 32px;background:rgba(255,255,255,.04);}
    .metric-n{font-family:'Manrope',system-ui,sans-serif;font-size:3rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;margin-bottom:8px;}
    .metric-n em{font-style:normal;color:var(--green);}
    .metric-l{font-size:.95rem;font-weight:600;color:rgba(255,255,255,.82);margin-bottom:4px;}
    .metric-d{font-size:.83rem;color:rgba(255,255,255,.4);}
    .program-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:48px;}
    .prog-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}
    .prog-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .prog-card-ico{width:44px;height:44px;border-radius:10px;background:rgba(0,132,61,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:1.2rem;}
    .prog-card h3{font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:8px;}
    .prog-card p{font-size:.88rem;line-height:1.65;color:var(--muted);margin-bottom:16px;}
    .prog-card-link{font-size:.88rem;font-weight:600;color:var(--green2);display:inline-flex;align-items:center;gap:4px;transition:gap 140ms;}
    .prog-card-link:hover{gap:8px;}
    .faq-list{display:flex;flex-direction:column;gap:8px;margin-top:44px;}
    .faq-item{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff;}
    .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer;font-weight:600;font-size:.97rem;color:var(--text);user-select:none;}
    .faq-q svg{width:18px;height:18px;stroke:var(--muted);fill:none;stroke-width:2;flex-shrink:0;transition:transform 250ms var(--ease);}
    .faq-item.open .faq-q svg{transform:rotate(180deg);}
    .faq-a{max-height:0;overflow:hidden;transition:max-height 300ms var(--ease);}
    .faq-a-inner{padding:0 24px 20px;font-size:.92rem;line-height:1.72;color:var(--muted);}
    .cta-box{background:linear-gradient(135deg,#054A24 0%,#00843D 100%);border-radius:24px;padding:64px 56px;text-align:center;position:relative;overflow:hidden;}
    .cta-box h2{font-size:clamp(1.8rem,3.5vw,2.5rem);font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:16px;}
    .cta-box p{font-size:1.02rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:500px;margin:0 auto 32px;}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity 550ms var(--ease),transform 550ms var(--ease);}
    .reveal.vis{opacity:1;transform:translateY(0);}
    @media(max-width:1024px){.overview-grid,.stages{grid-template-columns:1fr;}.metrics-grid{grid-template-columns:1fr;}.program-cards{grid-template-columns:1fr;}.stage{border-right:0;border-bottom:1px solid var(--border);}}
    @media(max-width:768px){.section{padding:64px 0;}.cta-box{padding:44px 28px;}}
  </style>
</head>
<body>
<nav class="nav">
  <div class="container nav-inner">
    <a href="/" class="nav-logo"><img src="https://static.wixstatic.com/media/fcced6_f19335b6f6ed433b9a5c9a2294f3db1a~mv2.png" alt="Heartland BioWorks" /></a>
    <a href="/" class="nav-back">← All Programs</a>
    <a href="#cta" class="nav-cta">Connect with a Mentor</a>
  </div>
</nav>

<section class="prog-hero">
  <div class="container">
    <div class="hero-tag">Commercialization &amp; Startups</div>
    <h1>From Breakthrough to<br>Market</h1>
    <p class="lead">BioLaunch accelerates biotech startups from lab to market through mentorship, strategic funding connections, CDMO introductions, and Indiana's innovation network.</p>
    <a href="#cta" class="hero-cta">Connect with a Mentor →</a>
    <div class="hero-metrics">
      <div class="hm-item"><div class="hm-num">42+</div><div class="hm-label">Companies supported</div></div>
      <div class="hm-item"><div class="hm-num">$38M</div><div class="hm-label">Capital facilitated</div></div>
      <div class="hm-item"><div class="hm-num">120+</div><div class="hm-label">Expert mentors</div></div>
      <div class="hm-item"><div class="hm-num">78%</div><div class="hm-label">Survival rate at 3 years</div></div>
    </div>
  </div>
</section>

<section class="section" id="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-copy reveal">
        <div class="slabel">Overview</div>
        <h2 class="stitle">Indiana's Biotech Commercialization Engine</h2>
        <p>BioLaunch exists to close the "valley of death" between biotech discovery and commercial success. We connect early-stage companies to the resources, relationships, and capital they need to build durable businesses.</p>
        <p>From regulatory strategy to investor introductions to CDMO network access, BioLaunch provides the support structure that transforms promising science into scalable companies.</p>
        <ul class="feature-list">
          <li>Expert mentorship from serial biotech founders and executives</li>
          <li>CDMO network access through the BioCAN partnership</li>
          <li>Investor introductions and pitch preparation</li>
          <li>Regulatory strategy and IP guidance</li>
          <li>Co-working and lab space through 16 Tech</li>
        </ul>
      </div>
      <div class="reveal">
        <div class="overview-image">
          <img src="https://images.unsplash.com/photo-1559839697-5d2f7af76e3c?w=900&q=80" alt="Biotech startup" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="pathway">
  <div class="container">
    <div class="slabel">The Pathway</div>
    <h2 class="stitle">From Idea to Market</h2>
    <p class="ssub">BioLaunch walks companies through four distinct stages, with targeted support at each step.</p>
    <div class="stages reveal">
      <div class="stage"><div class="stage-num">01</div><h3>Discovery &amp; Validation</h3><p>Assess market opportunity, IP landscape, and commercial viability with expert guidance from industry veterans.</p></div>
      <div class="stage"><div class="stage-num">02</div><h3>Development &amp; Scale</h3><p>Access CDMO partnerships, GMP manufacturing support, and process development expertise through BioCAN.</p></div>
      <div class="stage"><div class="stage-num">03</div><h3>Funding &amp; Partnerships</h3><p>Investor introductions, SBIR/STTR navigation, and strategic partnership facilitation with Indiana's industry network.</p></div>
      <div class="stage"><div class="stage-num">04</div><h3>Market Entry</h3><p>Go-to-market strategy, distribution partnerships, and ongoing support through the Heartland BioWorks ecosystem.</p></div>
    </div>
  </div>
</section>

<section class="section section-dark" id="impact">
  <div class="container">
    <div class="slabel">Impact</div>
    <h2 class="stitle" style="margin-bottom:44px;">By the Numbers</h2>
    <div class="metrics-grid reveal">
      <div class="metric-item"><div class="metric-n"><em>$38M</em></div><div class="metric-l">Capital Facilitated</div><div class="metric-d">For BioLaunch portfolio companies</div></div>
      <div class="metric-item"><div class="metric-n"><em>42+</em></div><div class="metric-l">Companies Supported</div><div class="metric-d">Active and graduated portfolio</div></div>
      <div class="metric-item"><div class="metric-n"><em>78%</em></div><div class="metric-l">3-Year Survival Rate</div><div class="metric-d">vs. 50% national biotech average</div></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="programs">
  <div class="container">
    <div class="slabel">Programs</div>
    <h2 class="stitle">How We Support Companies</h2>
    <div class="program-cards">
      <div class="prog-card reveal"><div class="prog-card-ico">🧠</div><h3>Mentorship Network</h3><p>Access 120+ mentors — serial founders, pharma executives, regulatory experts, and investors — matched to your company's specific needs.</p><a href="#cta" class="prog-card-link">Connect with a Mentor →</a></div>
      <div class="prog-card reveal"><div class="prog-card-ico">💰</div><h3>Funding Navigation</h3><p>Expert guidance on SBIR/STTR applications, state and federal grant programs, venture capital introductions, and strategic investor outreach.</p><a href="#cta" class="prog-card-link">Explore Funding →</a></div>
      <div class="prog-card reveal"><div class="prog-card-ico">🏭</div><h3>CDMO Access</h3><p>Pre-negotiated access to Indiana's CDMO network through BioCAN, enabling faster process development and scale-up without the usual barriers.</p><a href="#" class="prog-card-link">View CDMOs →</a></div>
      <div class="prog-card reveal"><div class="prog-card-ico">🚀</div><h3>Accelerator Program</h3><p>12-week cohort-based program for early-stage companies. Includes curriculum, dedicated mentorship, demo day, and investor introductions.</p><a href="#cta" class="prog-card-link">Apply Now →</a></div>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <div class="slabel">FAQs</div>
    <h2 class="stitle">Common Questions</h2>
    <div class="faq-list">
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">What stage companies does BioLaunch support?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">BioLaunch works with companies from pre-seed through Series A. The sweet spot is companies that have validated technology and are building toward their first financing round or commercial partnership.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">Does my company need to be based in Indiana?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Companies must have a meaningful operational presence in Indiana or be committed to establishing one. BioLaunch prioritizes companies that will contribute to Indiana's bioeconomy through jobs, partnerships, and long-term presence.</div></div></div>
      <div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">Is there an equity component to BioLaunch support?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">No — Heartland BioWorks does not take equity in supported companies. BioLaunch is a mission-driven support program, not a venture fund. Funding connections we facilitate are with external investors who set their own terms.</div></div></div>
    </div>
  </div>
</section>

<section class="section" id="cta">
  <div class="container">
    <div class="cta-box reveal">
      <h2>Ready to Launch?</h2>
      <p>Connect with a BioLaunch mentor and take the first step toward building your biotech company in Indiana's innovation ecosystem.</p>
      <a href="#" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:#fff;color:var(--green2);border-radius:8px;font-size:1rem;font-weight:700;transition:background 200ms,transform 200ms;" onmouseover="this.style.background='rgba(255,255,255,.9)'" onmouseout="this.style.background='#fff'">Connect with a Mentor →</a>
    </div>
  </div>
</section>

<footer style="background:#050E18;padding:32px 0;text-align:center;font-size:.82rem;color:rgba(255,255,255,.3);">
  <div class="container"><a href="/" style="display:inline-block;margin-bottom:14px;"><img src="https://static.wixstatic.com/media/fcced6_f19335b6f6ed433b9a5c9a2294f3db1a~mv2.png" alt="Heartland BioWorks" style="height:34px;opacity:.65;margin:0 auto;" /></a><p>© 2026 Heartland BioWorks. All rights reserved.</p></div>
</footer>

<script>
document.querySelectorAll('.faq-q').forEach(q=>{function t(){const i=q.parentElement,o=i.classList.contains('open');document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open');x.querySelector('.faq-a').style.maxHeight='0';x.querySelector('.faq-q').setAttribute('aria-expanded','false');});if(!o){i.classList.add('open');i.querySelector('.faq-a').style.maxHeight=i.querySelector('.faq-a-inner').scrollHeight+'px';q.setAttribute('aria-expanded','true');}}q.addEventListener('click',t);q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});});
const obs=new IntersectionObserver(e=>e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('vis');obs.unobserve(en.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
function postH(){window.parent.postMessage({type:'resize',height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');}
if('ResizeObserver' in window) new ResizeObserver(postH).observe(document.body);
window.addEventListener('load',postH);window.addEventListener('resize',postH);setTimeout(postH,300);setTimeout(postH,900);
</script>
</body>
</html>
