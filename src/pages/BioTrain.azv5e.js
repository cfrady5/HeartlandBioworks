<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioTrain – Workforce Development | Heartland BioWorks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --navy:#0D4568;--green:#3EB248;--green2:#00843D;
      --bg:#fff;--bg2:#F7F9FB;--dark:#082D46;
      --border:#E6EAF0;--text:#102A43;--muted:#627D98;
      --ease:cubic-bezier(.2,0,0,1);
    }
    *,*::before,*::after{box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    h1,h2,h3,h4{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}
    p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:90px;display:flex;align-items:center;background:rgba(255,255,255,.97);box-shadow:0 1px 0 var(--border),0 2px 8px rgba(13,69,104,.08);backdrop-filter:blur(14px);}
    .nav-inner{width:100%;display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo img{height:44px;width:auto;}
    .nav-back{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1.5px solid var(--border);border-radius:8px;font-size:.88rem;font-weight:600;color:var(--navy);transition:background 180ms,border-color 180ms;}
    .nav-back:hover{background:var(--bg2);border-color:var(--navy);}
    .nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms;}
    .nav-cta:hover{background:var(--green2);transform:translateY(-1px);}

    /* HERO */
    .prog-hero{position:relative;padding:150px 0 90px;background:linear-gradient(155deg,#082D46 0%,#0D4568 60%,#0a3a58 100%);overflow:hidden;}
    .prog-hero::before{content:'';position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=75');background-size:cover;background-position:center;opacity:.12;}
    .prog-hero::after{content:'';position:absolute;top:-150px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.15) 0%,transparent 70%);pointer-events:none;}
    .hero-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;background:rgba(62,178,72,.15);border:1px solid rgba(62,178,72,.3);border-radius:100px;font-size:.76rem;font-weight:700;color:#7DD580;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
    .hero-tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);}
    .prog-hero h1{font-size:clamp(2.4rem,5vw,4.2rem);font-weight:800;letter-spacing:-.04em;line-height:1.06;color:#fff;margin-bottom:20px;}
    .prog-hero p.lead{font-size:1.1rem;line-height:1.72;color:rgba(255,255,255,.68);max-width:560px;margin-bottom:36px;}
    .hero-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms,box-shadow 200ms;}
    .hero-cta:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,178,72,.35);}
    .hero-metrics{display:flex;gap:40px;margin-top:52px;flex-wrap:wrap;}
    .hm-item{display:flex;flex-direction:column;gap:4px;}
    .hm-num{font-family:'Manrope',system-ui,sans-serif;font-size:2.2rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;}
    .hm-num em{font-style:normal;color:var(--green);}
    .hm-label{font-size:.85rem;color:rgba(255,255,255,.5);}

    /* SECTIONS */
    .section{padding:88px 0;}
    .section-alt{background:var(--bg2);}
    .section-dark{background:var(--dark);color:#fff;}
    .slabel{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}
    .slabel::before{content:'';width:18px;height:2px;background:var(--green);border-radius:1px;}
    .stitle{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}
    .section-dark .stitle{color:#fff;}
    .ssub{font-size:1.02rem;line-height:1.72;color:var(--muted);max-width:540px;}
    .section-dark .ssub{color:rgba(255,255,255,.58);}

    /* OVERVIEW */
    .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
    .overview-copy p{font-size:1.02rem;line-height:1.78;color:var(--muted);margin-bottom:16px;}
    .overview-copy p:last-child{margin-bottom:0;}
    .feature-list{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:12px;}
    .feature-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;line-height:1.6;color:var(--muted);}
    .feature-list li::before{content:'✓';width:22px;height:22px;border-radius:50%;background:rgba(62,178,72,.12);color:var(--green2);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;margin-top:1px;}
    .overview-image{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:var(--bg2);}
    .overview-image img{width:100%;height:100%;object-fit:cover;}

    /* IMPACT METRICS */
    .metrics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;}
    .metric-item{padding:36px 32px;background:rgba(255,255,255,.04);}
    .metric-n{font-family:'Manrope',system-ui,sans-serif;font-size:3rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;margin-bottom:8px;}
    .metric-n em{font-style:normal;color:var(--green);}
    .metric-l{font-size:.95rem;font-weight:600;color:rgba(255,255,255,.82);margin-bottom:4px;}
    .metric-d{font-size:.83rem;color:rgba(255,255,255,.4);}

    /* PROGRAMS */
    .program-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:48px;}
    .prog-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}
    .prog-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .prog-card-ico{width:44px;height:44px;border-radius:10px;background:rgba(13,69,104,.08);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:1.2rem;}
    .prog-card h3{font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:8px;}
    .prog-card p{font-size:.88rem;line-height:1.65;color:var(--muted);margin-bottom:16px;}
    .prog-card-link{font-size:.88rem;font-weight:600;color:var(--navy);display:inline-flex;align-items:center;gap:4px;transition:gap 140ms;}
    .prog-card-link:hover{gap:8px;}

    /* FAQ ACCORDION */
    .faq-list{display:flex;flex-direction:column;gap:8px;margin-top:44px;}
    .faq-item{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff;}
    .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer;font-weight:600;font-size:.97rem;color:var(--text);user-select:none;}
    .faq-q svg{width:18px;height:18px;stroke:var(--muted);fill:none;stroke-width:2;flex-shrink:0;transition:transform 250ms var(--ease);}
    .faq-item.open .faq-q svg{transform:rotate(180deg);}
    .faq-a{max-height:0;overflow:hidden;transition:max-height 300ms var(--ease);}
    .faq-a-inner{padding:0 24px 20px;font-size:.92rem;line-height:1.72;color:var(--muted);}

    /* CTA SECTION */
    .cta-box{background:linear-gradient(135deg,#082D46 0%,#0D4568 100%);border-radius:24px;padding:64px 56px;text-align:center;position:relative;overflow:hidden;}
    .cta-box::before{content:'';position:absolute;top:-80px;left:-80px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.15) 0%,transparent 70%);pointer-events:none;}
    .cta-box h2{font-size:clamp(1.8rem,3.5vw,2.5rem);font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:16px;}
    .cta-box p{font-size:1.02rem;line-height:1.7;color:rgba(255,255,255,.62);max-width:500px;margin:0 auto 32px;}

    /* REVEAL */
    .reveal{opacity:0;transform:translateY(20px);transition:opacity 550ms var(--ease),transform 550ms var(--ease);}
    .reveal.vis{opacity:1;transform:translateY(0);}

    @media(max-width:1024px){.overview-grid{grid-template-columns:1fr;gap:40px;}.metrics-grid{grid-template-columns:1fr;}.program-cards{grid-template-columns:1fr;}}
    @media(max-width:768px){.section{padding:64px 0;}.hero-metrics{gap:24px;}.cta-box{padding:44px 28px;}}
  </style>
</head>
<body>

<nav class="nav">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo" aria-label="Heartland BioWorks Home">
      <img src="https://static.wixstatic.com/media/fcced6_4c68e46b8f1c4c089a46ca9a416c50a2~mv2.png" alt="Heartland BioWorks" />
    </a>
    <a href="programs.html" class="nav-back">← All Programs</a>
    <a href="#cta" class="nav-cta">Join the Workforce Network</a>
  </div>
</nav>

<!-- HERO -->
<section class="prog-hero">
  <div class="container">
    <div class="hero-tag">Workforce Development</div>
    <h1>Building Indiana's<br>Biotech Workforce</h1>
    <p class="lead">BioTrain connects employers, educators, and job seekers to build the skilled biomanufacturing workforce Indiana's growing bioeconomy demands.</p>
    <a href="#cta" class="hero-cta">Join the Workforce Network →</a>
    <div class="hero-metrics">
      <div class="hm-item"><div class="hm-num"><em>2,400+</em></div><div class="hm-label">Workers trained</div></div>
      <div class="hm-item"><div class="hm-num"><em>85+</em></div><div class="hm-label">Employer partners</div></div>
      <div class="hm-item"><div class="hm-num"><em>18</em></div><div class="hm-label">Training programs</div></div>
      <div class="hm-item"><div class="hm-num"><em>94%</em></div><div class="hm-label">Job placement rate</div></div>
    </div>
  </div>
</section>

<!-- OVERVIEW -->
<section class="section" id="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-copy reveal">
        <div class="slabel">Overview</div>
        <h2 class="stitle">The Talent Pipeline Indiana's Bioeconomy Needs</h2>
        <p>Indiana's biomanufacturing sector is growing rapidly — and the workforce must grow with it. BioTrain bridges the gap between industry demand and talent supply through targeted training, stackable credentials, and direct employer partnerships.</p>
        <p>From entry-level technicians to advanced bioprocess engineers, BioTrain's programs are designed with industry to ensure graduates are ready on day one.</p>
        <ul class="feature-list">
          <li>Industry-validated curriculum aligned to real job requirements</li>
          <li>Stackable credentials and recognized certifications</li>
          <li>Employer-sponsored cohort programs</li>
          <li>Pathways from community college through university</li>
          <li>Direct placement partnerships with hiring companies</li>
        </ul>
      </div>
      <div class="reveal">
        <div class="overview-image">
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80" alt="Biomanufacturing training" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- IMPACT METRICS -->
<section class="section section-dark" id="impact">
  <div class="container">
    <div class="slabel">Impact</div>
    <h2 class="stitle" style="margin-bottom:44px;">Measurable Outcomes</h2>
    <div class="metrics-grid reveal">
      <div class="metric-item">
        <div class="metric-n"><em>94%</em></div>
        <div class="metric-l">Job Placement Rate</div>
        <div class="metric-d">Within 6 months of program completion</div>
      </div>
      <div class="metric-item">
        <div class="metric-n"><em>$52K</em></div>
        <div class="metric-l">Average Starting Salary</div>
        <div class="metric-d">For BioTrain program graduates</div>
      </div>
      <div class="metric-item">
        <div class="metric-n"><em>85+</em></div>
        <div class="metric-l">Employer Partners</div>
        <div class="metric-d">Hiring from BioTrain pipelines</div>
      </div>
    </div>
  </div>
</section>

<!-- PROGRAMS -->
<section class="section section-alt" id="programs">
  <div class="container">
    <div class="slabel">Programs</div>
    <h2 class="stitle">Training Pathways</h2>
    <p class="ssub">Structured programs designed for every stage of a biotech career — from first step to advancement.</p>
    <div class="program-cards">
      <div class="prog-card reveal">
        <div class="prog-card-ico">🔬</div>
        <h3>Biomanufacturing Technician Certification</h3>
        <p>16-week intensive training for entry-level biomanufacturing roles. Developed with Ivy Tech Community College and leading Indiana pharma employers.</p>
        <a href="#" class="prog-card-link">Learn More →</a>
      </div>
      <div class="prog-card reveal">
        <div class="prog-card-ico">🎓</div>
        <h3>Advanced Bioprocess Operations</h3>
        <p>Continuing education for experienced technicians moving into senior process roles. Covers upstream/downstream processing, QA/QC, and GMP compliance.</p>
        <a href="#" class="prog-card-link">Learn More →</a>
      </div>
      <div class="prog-card reveal">
        <div class="prog-card-ico">🤝</div>
        <h3>Employer Partnership Program</h3>
        <p>Design a custom training cohort for your company's workforce. Heartland BioWorks coordinates curriculum development, instructor placement, and graduate pipeline.</p>
        <a href="#" class="prog-card-link">Partner With Us →</a>
      </div>
      <div class="prog-card reveal">
        <div class="prog-card-ico">🧪</div>
        <h3>Student Internship Network</h3>
        <p>Connecting university students with paid internships at Indiana biomanufacturing facilities. Program spans Purdue, Indiana University, and IUPUI.</p>
        <a href="#" class="prog-card-link">Apply Now →</a>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section" id="faq">
  <div class="container">
    <div class="slabel">FAQs</div>
    <h2 class="stitle">Common Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
          Who is BioTrain for?
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-a"><div class="faq-a-inner">BioTrain serves three audiences: job seekers looking to enter biomanufacturing, current biomanufacturing workers seeking advancement, and employers looking to build or upskill their workforce. Programs are available at multiple entry points.</div></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
          Are programs free for participants?
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-a"><div class="faq-a-inner">Many BioTrain programs offer subsidized or fully funded enrollment through employer sponsorships, state workforce development grants, and federal partnerships. Contact us to discuss funding options for your specific situation.</div></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
          How do I connect my company to BioTrain?
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-a"><div class="faq-a-inner">Employers can join the BioTrain network by reaching out through the contact form below. We'll schedule a needs assessment to understand your hiring pipeline and connect you with appropriate training cohorts or build a custom program.</div></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
          What credentials do participants earn?
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-a"><div class="faq-a-inner">Credentials vary by program and include industry-recognized certifications, stackable community college credits, OSHA and GMP compliance certifications, and in some cases direct pathway credits toward associate or bachelor's degrees.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section" id="cta">
  <div class="container">
    <div class="cta-box reveal">
      <h2>Join the Workforce Network</h2>
      <p>Whether you're an employer seeking talent or a job seeker ready to launch a biotech career — BioTrain connects you to Indiana's biomanufacturing ecosystem.</p>
      <a href="#" class="hero-cta">Get Started Today →</a>
    </div>
  </div>
</section>

<footer style="background:#050E18;padding:32px 0;text-align:center;font-size:.82rem;color:rgba(255,255,255,.3);">
  <div class="container">
    <a href="index.html" style="display:inline-block;margin-bottom:14px;">
      <img src="https://static.wixstatic.com/media/fcced6_4c68e46b8f1c4c089a46ca9a416c50a2~mv2.png" alt="Heartland BioWorks" style="height:34px;opacity:.65;margin:0 auto;" />
    </a>
    <p>© 2026 Heartland BioWorks. All rights reserved.</p>
  </div>
</footer>

<script>
// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q => {
  function toggle() {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
      i.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a-inner').scrollHeight + 'px';
      q.setAttribute('aria-expanded','true');
    }
  }
  q.addEventListener('click', toggle);
  q.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} });
});

// Scroll reveal
const obs = new IntersectionObserver(e => e.forEach(en => { if(en.isIntersecting){en.target.classList.add('vis');obs.unobserve(en.target);} }), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Iframe height
function postH(){window.parent.postMessage({type:'resize',height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');}
if('ResizeObserver' in window) new ResizeObserver(postH).observe(document.body);
window.addEventListener('load',postH); window.addEventListener('resize',postH);
setTimeout(postH,300); setTimeout(postH,900);
</script>
</body>
</html>
