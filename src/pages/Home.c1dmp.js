<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Heartland BioWorks – Building America's Biomanufacturing Future</title>
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
    h1,h2,h3,h4,h5,h6{font-family:'Manrope','Inter',system-ui,sans-serif;margin:0;}
    p{margin:0;}a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}
    .container{width:min(calc(100% - 48px),1280px);margin:0 auto;}

    /* ── NAV ── */
    /* NOTE: Remove the default Wix "Business Name" header in the Wix Editor
       under Settings > Header & Footer to eliminate the duplicate navbar. */
    .nav{
      position:fixed;top:0;left:0;right:0;z-index:200;height:90px;
      display:flex;align-items:center;
      transition:background 320ms var(--ease),box-shadow 320ms var(--ease);
    }
    .nav.scrolled{background:rgba(255,255,255,.97);box-shadow:0 1px 0 var(--border),0 2px 8px rgba(13,69,104,.08);backdrop-filter:blur(14px);}
    .nav-inner{width:100%;display:flex;align-items:center;justify-content:space-between;gap:24px;}
    .nav-logo{display:flex;align-items:center;flex-shrink:0;}
    .nav-logo img{height:52px;width:auto;}
    .nav-links{display:flex;align-items:center;gap:4px;list-style:none;margin:0;padding:0;}
    .nav-links>li{position:relative;}
    .nav-link{display:flex;align-items:center;gap:5px;padding:9px 14px;font-size:.9375rem;font-weight:500;color:rgba(255,255,255,.88);border-radius:8px;transition:color 180ms,background 180ms;cursor:pointer;user-select:none;}
    .nav.scrolled .nav-link{color:var(--text);}
    .nav-link:hover{background:rgba(255,255,255,.12);color:#fff;}
    .nav.scrolled .nav-link:hover{background:var(--bg2);color:var(--navy);}
    .nav-link svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.2;transition:transform 200ms var(--ease);}
    .nav-links>li:hover .nav-link svg{transform:rotate(180deg);}
    .nav-drop{position:absolute;top:calc(100% + 10px);left:0;min-width:210px;background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:0 20px 60px rgba(13,69,104,.16);padding:6px;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity 200ms var(--ease),transform 200ms var(--ease);}
    .nav-links>li:hover .nav-drop{opacity:1;transform:translateY(0);pointer-events:auto;}
    .nav-drop a{display:flex;align-items:center;gap:10px;padding:9px 12px;font-size:.88rem;font-weight:500;color:var(--text);border-radius:8px;transition:background 140ms,color 140ms;}
    .nav-drop a:hover{background:var(--bg2);color:var(--navy);}
    .dd-ico{width:28px;height:28px;border-radius:6px;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;}
    .nav-cta{display:inline-flex;align-items:center;padding:10px 22px;background:var(--green);color:#fff;border-radius:8px;font-size:.9rem;font-weight:600;transition:background 200ms,transform 200ms,box-shadow 200ms;flex-shrink:0;}
    .nav-cta:hover{background:var(--green2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(62,178,72,.3);}
    .nav-hamburger{display:none;background:none;border:none;padding:8px;cursor:pointer;color:rgba(255,255,255,.9);}
    .nav.scrolled .nav-hamburger{color:var(--text);}

    /* ── HERO ── */
    .hero{
      position:relative;min-height:100vh;
      display:flex;align-items:center;
      background:var(--dark);overflow:hidden;
    }
    .hero-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1920&q=80');background-size:cover;background-position:center;opacity:.22;}
    .hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(8,45,70,.95) 0%,rgba(13,69,104,.82) 60%,rgba(8,45,70,.7) 100%);}
    .hero-glow{position:absolute;top:-100px;right:-100px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(62,178,72,.12) 0%,transparent 70%);pointer-events:none;}
    .hero-content{position:relative;z-index:2;padding:110px 0 90px;max-width:820px;}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(62,178,72,.15);border:1px solid rgba(62,178,72,.3);border-radius:100px;font-size:.78rem;font-weight:700;color:#7DD580;letter-spacing:.06em;text-transform:uppercase;margin-bottom:24px;}
    .hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green);animation:pulse 2.2s ease-in-out infinite;}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.8)}}
    .hero h1{font-size:clamp(2.6rem,5.2vw,4.6rem);font-weight:800;line-height:1.06;letter-spacing:-.04em;color:#fff;margin-bottom:22px;}
    .hero h1 em{font-style:normal;background:linear-gradient(120deg,#3EB248 0%,#7DD580 60%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .hero-sub{font-size:1.1rem;line-height:1.72;color:rgba(255,255,255,.68);max-width:600px;margin-bottom:36px;}
    .hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:52px;}
    .btn-primary{display:inline-flex;align-items:center;gap:7px;padding:14px 28px;background:var(--green);color:#fff;border-radius:8px;font-size:1rem;font-weight:600;transition:background 200ms,transform 200ms,box-shadow 200ms;}
    .btn-primary:hover{background:var(--green2);transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,178,72,.35);}
    .btn-outline{display:inline-flex;align-items:center;gap:7px;padding:14px 28px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;font-size:1rem;font-weight:500;transition:background 200ms,border-color 200ms,transform 200ms;}
    .btn-outline:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.38);transform:translateY(-2px);}
    /* Trust bar inside hero */
    .hero-trust{display:flex;gap:32px;flex-wrap:wrap;}
    .htrust-item{display:flex;align-items:center;gap:8px;font-size:.82rem;color:rgba(255,255,255,.5);}
    .htrust-item strong{color:rgba(255,255,255,.82);font-weight:600;}
    .htrust-divider{width:1px;height:20px;background:rgba(255,255,255,.15);align-self:center;}
    /* fade-up entries */
    .fu{opacity:0;transform:translateY(22px);animation:fadeUp 800ms var(--ease) forwards;}
    .fu:nth-child(1){animation-delay:0ms}.fu:nth-child(2){animation-delay:120ms}.fu:nth-child(3){animation-delay:220ms}.fu:nth-child(4){animation-delay:320ms}.fu:nth-child(5){animation-delay:400ms}
    @keyframes fadeUp{to{opacity:1;transform:translateY(0);}}

    /* ── SECTION SHARED ── */
    .section{padding:96px 0;}
    .section-dark{background:var(--dark);color:#fff;}
    .section-light{background:var(--bg2);}
    .slabel{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:14px;}
    .slabel::before{content:'';width:20px;height:2px;background:var(--green);border-radius:1px;}
    .section-dark .slabel{color:var(--green);}
    .stitle{font-size:clamp(1.9rem,3.8vw,2.9rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--text);margin-bottom:14px;}
    .section-dark .stitle{color:#fff;}
    .ssub{font-size:1.05rem;line-height:1.72;color:var(--muted);max-width:540px;}
    .section-dark .ssub{color:rgba(255,255,255,.58);}

    /* ── AUDIENCE PATHWAYS ── */
    .audience-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:52px;}
    .aud-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px 24px;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease),border-color 200ms;}
    .aud-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(13,69,104,.12);border-color:var(--navy);}
    .aud-ico{font-size:1.8rem;margin-bottom:14px;}
    .aud-card h3{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:6px;}
    .aud-card p{font-size:.85rem;line-height:1.6;color:var(--muted);margin-bottom:16px;}
    .aud-link{font-size:.85rem;font-weight:600;color:var(--navy);display:inline-flex;align-items:center;gap:4px;transition:gap 140ms;}
    .aud-link:hover{gap:8px;}

    /* ── PARTNERS ── */
    .partners-bar{padding:36px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;}
    .partners-lbl{text-align:center;font-size:.76rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:28px;}
    .marquee-wrap{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);}
    .marquee-track{display:flex;align-items:center;gap:16px;width:max-content;animation:marquee 30s linear infinite;}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .partner-tile{display:flex;align-items:center;gap:10px;padding:10px 18px;border:1px solid var(--border);border-radius:10px;background:#fff;transition:border-color 200ms,box-shadow 200ms;white-space:nowrap;}
    .partner-tile:hover{border-color:var(--navy);box-shadow:0 2px 8px rgba(13,69,104,.08);}
    .partner-mark{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:#fff;flex-shrink:0;}
    .partner-name{font-size:.85rem;font-weight:600;color:var(--muted);}

    /* ── ECOSYSTEM CARDS ── */
    .eco-header{text-align:center;margin-bottom:52px;}
    .eco-header .ssub{margin:8px auto 0;}
    .eco-track{display:flex;gap:10px;height:440px;overflow:hidden;}
    .eco-card{
      flex:1;min-width:0;position:relative;border-radius:16px;
      overflow:hidden;cursor:pointer;
      transition:flex 450ms ease-in-out;
      outline:none;
    }
    .eco-track.has-active .eco-card:not(.active){flex:.38;}
    .eco-card.active{flex:2.6;}
    .eco-card[data-p="biotrain"]{background:linear-gradient(155deg,#0D4568 0%,#082D46 100%);}
    .eco-card[data-p="biolaunch"]{background:linear-gradient(155deg,#00843D 0%,#054A24 100%);}
    .eco-card[data-p="biocan"]{background:linear-gradient(155deg,#0D5A70 0%,#0D4568 100%);}
    .eco-card[data-p="biodefense"]{background:linear-gradient(155deg,#1A1A2E 0%,#0D4568 100%);}
    /* Hover affordance on collapsed cards */
    .eco-card:not(.active):hover{flex:.48 !important;}
    /* Collapsed state */
    .eco-collapsed{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px 20px;transition:opacity 200ms;}
    .eco-card.active .eco-collapsed{opacity:0;pointer-events:none;}
    .eco-ico{width:40px;height:40px;border-radius:9px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;margin-bottom:12px;flex-shrink:0;}
    .eco-ico svg{width:19px;height:19px;stroke:#fff;fill:none;stroke-width:1.8;}
    .eco-collapsed-name{font-family:'Manrope',system-ui,sans-serif;font-size:1rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;}
    .eco-collapsed-sub{font-size:.72rem;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:10px;}
    .eco-expand-hint{display:flex;align-items:center;gap:5px;font-size:.72rem;font-weight:600;color:rgba(255,255,255,.35);transition:color 200ms;}
    .eco-card:hover .eco-expand-hint{color:rgba(255,255,255,.65);}
    .eco-expand-hint svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;}
    /* Expanded state */
    .eco-expanded{position:absolute;inset:0;padding:32px 28px;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity 280ms 160ms;overflow-y:auto;}
    .eco-card.active .eco-expanded{opacity:1;pointer-events:auto;}
    .eco-exp-tag{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:8px;}
    .eco-exp-title{font-family:'Manrope',system-ui,sans-serif;font-size:1.85rem;font-weight:800;color:#fff;line-height:1.05;letter-spacing:-.03em;margin-bottom:10px;}
    .eco-exp-desc{font-size:.9rem;line-height:1.65;color:rgba(255,255,255,.7);margin-bottom:22px;max-width:420px;}
    .eco-links-lbl{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:10px;}
    .eco-links{display:flex;flex-direction:column;gap:0;flex:1;}
    .eco-link{display:flex;align-items:center;gap:8px;padding:9px 0;font-size:.9rem;font-weight:500;color:rgba(255,255,255,.78);border-bottom:1px solid rgba(255,255,255,.08);transition:color 140ms,padding-left 140ms;}
    .eco-link:hover{color:#fff;padding-left:4px;}
    .eco-link::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--green);flex-shrink:0;}
    .eco-learn{display:inline-flex;align-items:center;gap:6px;margin-top:20px;padding:10px 20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;font-size:.88rem;font-weight:600;color:#fff;align-self:flex-start;transition:background 180ms,border-color 180ms;}
    .eco-learn:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.35);}

    /* ── WHY INDIANA ── */
    .indiana-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
    .stats-col{display:flex;flex-direction:column;gap:16px;}
    .stat-card{padding:24px 28px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;transition:background 200ms,border-color 200ms;}
    .stat-card:hover{background:rgba(255,255,255,.09);border-color:rgba(62,178,72,.3);}
    .stat-num{font-family:'Manrope',system-ui,sans-serif;font-size:3rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1;margin-bottom:6px;}
    .stat-num em{font-style:normal;color:var(--green);}
    .stat-lbl{font-size:.97rem;font-weight:700;color:rgba(255,255,255,.88);margin-bottom:3px;}
    .stat-detail{font-size:.82rem;color:rgba(255,255,255,.42);margin-bottom:6px;}
    .stat-source{font-size:.72rem;color:rgba(255,255,255,.28);font-style:italic;}
    .map-col{display:flex;align-items:center;justify-content:center;}
    .map-wrap{position:relative;width:300px;}
    .map-wrap svg{width:100%;height:auto;filter:drop-shadow(0 0 30px rgba(62,178,72,.15));}

    /* ── CARDS SHARED ── */
    .cards-header{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:44px;}
    .view-all-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border:1.5px solid var(--border);border-radius:8px;font-size:.88rem;font-weight:600;color:var(--navy);transition:border-color 180ms,background 180ms;flex-shrink:0;}
    .view-all-btn:hover{border-color:var(--navy);background:var(--bg2);}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}

    /* ── OPPORTUNITIES ── */
    .opp-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:26px;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}
    .opp-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .tag{display:inline-flex;padding:4px 10px;background:rgba(62,178,72,.1);color:var(--green2);border-radius:100px;font-size:.73rem;font-weight:700;margin-bottom:14px;}
    .opp-card h3{font-size:1rem;font-weight:700;line-height:1.42;color:var(--text);margin-bottom:8px;}
    .opp-card p{font-size:.88rem;line-height:1.65;color:var(--muted);margin-bottom:18px;}
    .opp-foot{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border);font-size:.8rem;color:var(--muted);}
    .opp-cta{font-weight:600;color:var(--navy);display:flex;align-items:center;gap:4px;transition:gap 140ms;}
    .opp-cta:hover{gap:8px;}

    /* ── TESTIMONIALS ── */
    .testimonials{padding:96px 0;}
    .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:52px;}
    .testi-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;position:relative;}
    .testi-card::before{content:'\201C';font-family:Georgia,serif;font-size:4rem;line-height:1;color:var(--green);opacity:.3;position:absolute;top:16px;left:22px;}
    .testi-text{font-size:.95rem;line-height:1.72;color:var(--muted);margin-bottom:24px;padding-top:20px;}
    .testi-author{display:flex;align-items:center;gap:12px;}
    .testi-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;background:var(--bg2);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;color:var(--navy);}
    .testi-name{font-size:.88rem;font-weight:700;color:var(--text);}
    .testi-role{font-size:.78rem;color:var(--muted);}

    /* ── NEWS ── */
    .news-card{border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease);}
    .news-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .news-img{aspect-ratio:16/9;overflow:hidden;background:var(--bg2);}
    .news-img img{width:100%;height:100%;object-fit:cover;transition:transform 400ms var(--ease);}
    .news-card:hover .news-img img{transform:scale(1.05);}
    .news-body{padding:22px;}
    .news-cat{display:inline-flex;padding:3px 10px;background:rgba(13,69,104,.08);color:var(--navy);border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;}
    .news-body h3{font-size:.97rem;font-weight:700;line-height:1.45;color:var(--text);margin-bottom:8px;}
    .news-date{font-size:.8rem;color:var(--muted);}
    /* Featured news card */
    .news-featured{grid-column:span 3;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:box-shadow 200ms var(--ease);}
    .news-featured:hover{box-shadow:0 8px 32px rgba(13,69,104,.12);}
    .news-featured .news-img{aspect-ratio:unset;min-height:280px;}
    .news-featured .news-body{padding:36px;display:flex;flex-direction:column;justify-content:center;}
    .news-featured .news-body h3{font-size:1.3rem;line-height:1.35;margin-bottom:12px;}
    .news-featured .news-body p{font-size:.92rem;line-height:1.7;color:var(--muted);margin-bottom:20px;}
    .news-read-more{font-size:.88rem;font-weight:600;color:var(--navy);display:inline-flex;align-items:center;gap:4px;transition:gap 140ms;}
    .news-read-more:hover{gap:8px;}

    /* ── CONNECT ── */
    .connect-inner{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
    .connect-perks{margin-top:28px;display:flex;flex-direction:column;gap:12px;}
    .perk{display:flex;align-items:flex-start;gap:12px;font-size:.9rem;color:rgba(255,255,255,.68);line-height:1.55;}
    .perk-ico{width:22px;height:22px;border-radius:50%;background:rgba(62,178,72,.2);border:1px solid rgba(62,178,72,.3);display:flex;align-items:center;justify-content:center;color:var(--green);font-size:.72rem;font-weight:800;flex-shrink:0;margin-top:1px;}
    .form-box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:34px;}
    .form-box h3{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:6px;}
    .form-box .form-sub{font-size:.83rem;color:rgba(255,255,255,.45);margin-bottom:22px;}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
    .form-row.full{grid-template-columns:1fr;}
    .fg{display:flex;flex-direction:column;gap:5px;}
    label{font-size:.8rem;font-weight:600;color:rgba(255,255,255,.65);}
    input,select{padding:11px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;font-size:.9rem;color:#fff;font-family:inherit;transition:border-color 180ms,background 180ms;}
    input::placeholder{color:rgba(255,255,255,.28);}
    input:focus,select:focus{outline:none;border-color:rgba(62,178,72,.55);background:rgba(255,255,255,.08);}
    select option{background:var(--dark);}
    .btn-sub{width:100%;padding:13px;background:var(--green);color:#fff;border:none;border-radius:8px;font-size:.97rem;font-weight:600;cursor:pointer;font-family:inherit;margin-top:6px;transition:background 200ms,transform 200ms;}
    .btn-sub:hover{background:var(--green2);transform:translateY(-1px);}
    .form-note{font-size:.74rem;color:rgba(255,255,255,.25);text-align:center;margin-top:10px;}

    /* ── FOOTER ── */
    .footer{background:#050E18;padding:64px 0 32px;}
    .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:28px;}
    .f-brand img{height:44px;margin-bottom:16px;}
    .f-brand p{font-size:.88rem;line-height:1.7;color:rgba(255,255,255,.38);max-width:280px;margin-bottom:20px;}
    .f-contact{display:flex;flex-direction:column;gap:8px;}
    .f-contact a{font-size:.85rem;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:6px;transition:color 140ms;}
    .f-contact a:hover{color:rgba(255,255,255,.82);}
    .f-col h4{font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:14px;}
    .f-col ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px;}
    .f-col a{font-size:.88rem;color:rgba(255,255,255,.4);transition:color 140ms;}
    .f-col a:hover{color:rgba(255,255,255,.88);}
    .footer-bot{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:.8rem;color:rgba(255,255,255,.3);}
    .footer-bot-links{display:flex;gap:20px;}
    .footer-bot-links a{color:rgba(255,255,255,.3);transition:color 140ms;}
    .footer-bot-links a:hover{color:rgba(255,255,255,.7);}
    .f-social{display:flex;gap:10px;}
    .f-social a{width:34px;height:34px;border-radius:7px;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;transition:background 180ms,border-color 180ms;}
    .f-social a:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);}
    .f-social svg{width:15px;height:15px;fill:rgba(255,255,255,.55);}

    /* ── SCROLL REVEAL ── */
    .reveal{opacity:0;transform:translateY(22px);transition:opacity 600ms var(--ease),transform 600ms var(--ease);}
    .reveal.vis{opacity:1;transform:translateY(0);}

    /* ── RESPONSIVE ── */
    @media(max-width:1100px){
      .indiana-grid,.connect-inner{grid-template-columns:1fr;gap:48px;}
      .footer-top{grid-template-columns:1fr 1fr;gap:36px;}
      .f-brand{grid-column:1/-1;}
      .audience-grid{grid-template-columns:repeat(2,1fr);}
      .news-featured{grid-template-columns:1fr;grid-column:span 3;}
      .news-featured .news-img{min-height:200px;}
    }
    @media(max-width:860px){
      .nav-links,.nav-cta{display:none;}
      .nav-hamburger{display:flex;}
      .eco-track{flex-direction:column;height:auto;}
      .eco-card{flex:none !important;height:80px;border-radius:12px;transition:height 400ms ease-in-out;}
      .eco-card.active{height:380px;}
      .eco-collapsed{flex-direction:row;align-items:center;padding:0 20px;gap:14px;}
      .eco-ico{margin-bottom:0;width:36px;height:36px;}
      .eco-collapsed-name{font-size:.95rem;}
      .eco-collapsed-sub{display:none;}
      .grid-3{grid-template-columns:1fr;}
      .testi-grid{grid-template-columns:1fr;}
      .news-featured{grid-column:span 1;}
      .stats-col{flex-direction:row;flex-wrap:wrap;}
      .stat-card{flex:1;min-width:180px;}
      .form-row{grid-template-columns:1fr;}
      .footer-top{grid-template-columns:1fr;}
    }
    @media(max-width:540px){
      .hero-btns{flex-direction:column;}
      .btn-primary,.btn-outline{width:100%;justify-content:center;}
      .section{padding:72px 0;}
      .audience-grid{grid-template-columns:1fr;}
      .cards-header{flex-direction:column;align-items:flex-start;}
      .hero-trust{gap:16px;}
      .htrust-divider{display:none;}
    }
  </style>
</head>
<body>

<!-- ══ NAV ══ -->
<nav class="nav" id="nav">
  <div class="container nav-inner">
    <a href="#home" class="nav-logo" aria-label="Heartland BioWorks – Home">
      <img src="https://static.wixstatic.com/media/fcced6_f19335b6f6ed433b9a5c9a2294f3db1a~mv2.png" alt="Heartland BioWorks" />
    </a>
    <ul class="nav-links" aria-label="Site navigation">
      <li>
        <div class="nav-link" tabindex="0" role="button" aria-haspopup="true">Programs <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
        <div class="nav-drop" role="menu">
          <a href="#" role="menuitem"><div class="dd-ico">🧬</div> BioTrain</a>
          <a href="#" role="menuitem"><div class="dd-ico">🚀</div> BioLaunch</a>
          <a href="#" role="menuitem"><div class="dd-ico">⚗️</div> BioCAN</a>
          <a href="#" role="menuitem"><div class="dd-ico">🛡️</div> BioDefense</a>
        </div>
      </li>
      <li>
        <div class="nav-link" tabindex="0" role="button" aria-haspopup="true">Resources <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
        <div class="nav-drop" role="menu">
          <a href="#news" role="menuitem"><div class="dd-ico">📰</div> News &amp; Media</a>
          <a href="#" role="menuitem"><div class="dd-ico">📅</div> Upcoming Events</a>
          <a href="#" role="menuitem"><div class="dd-ico">📚</div> Educational Library</a>
        </div>
      </li>
      <li>
        <div class="nav-link" tabindex="0" role="button" aria-haspopup="true">About <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
        <div class="nav-drop" role="menu">
          <a href="#" role="menuitem"><div class="dd-ico">👥</div> Team</a>
          <a href="#" role="menuitem"><div class="dd-ico">❓</div> FAQs</a>
          <a href="#connect" role="menuitem"><div class="dd-ico">✉️</div> Contact Us</a>
        </div>
      </li>
    </ul>
    <a href="#connect" class="nav-cta">Contact Us</a>
    <button class="nav-hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>
</nav>


<!-- ══ HERO ══ -->
<section class="hero" id="home" aria-label="Hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge fu">Indiana's Federally Designated Regional Tech Hub</div>
      <h1 class="fu">Indiana Is Building America's<br><em>Biomanufacturing</em> Future</h1>
      <p class="hero-sub fu">The integrated ecosystem for biotech workforce development, commercialization, CDMO network access, and national biosecurity — all from one hub.</p>
      <div class="hero-btns fu">
        <a href="#ecosystem" class="btn-primary">Find Funding &amp; Programs →</a>
        <a href="#who-we-serve" class="btn-outline">Who We Serve</a>
      </div>
      <div class="hero-trust fu">
        <div class="htrust-item"><strong>#1</strong> Pharma Export State</div>
        <div class="htrust-divider"></div>
        <div class="htrust-item"><strong>$3.2B+</strong> Life Science Exports</div>
        <div class="htrust-divider"></div>
        <div class="htrust-item"><strong>Federally</strong> Designated RTH</div>
        <div class="htrust-divider"></div>
        <div class="htrust-item"><strong>BARDA</strong> Partnership</div>
      </div>
    </div>
  </div>
</section>


<!-- ══ PARTNERS ══ -->
<div class="partners-bar" aria-label="Partners">
  <p class="partners-lbl">Indiana's innovation ecosystem</p>
  <div class="marquee-wrap">
    <div class="marquee-track" aria-hidden="true">
      <div class="partner-tile"><div class="partner-mark" style="background:#0D4568;">ARI</div><span class="partner-name">Applied Research Institute</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#C28B00;">PU</div><span class="partner-name">Purdue University</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#990000;">IU</div><span class="partner-name">Indiana University</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#005695;">IVY</div><span class="partner-name">Ivy Tech Community College</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#3EB248;">BC</div><span class="partner-name">BioCrossroads</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#E85C2B;">16T</div><span class="partner-name">16 Tech Innovation District</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#1A1A2E;">SOC</div><span class="partner-name">USSOCOM</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#00843D;">EDC</div><span class="partner-name">Indiana EDC</span></div>
      <!-- Duplicate for seamless loop -->
      <div class="partner-tile"><div class="partner-mark" style="background:#0D4568;">ARI</div><span class="partner-name">Applied Research Institute</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#C28B00;">PU</div><span class="partner-name">Purdue University</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#990000;">IU</div><span class="partner-name">Indiana University</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#005695;">IVY</div><span class="partner-name">Ivy Tech Community College</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#3EB248;">BC</div><span class="partner-name">BioCrossroads</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#E85C2B;">16T</div><span class="partner-name">16 Tech Innovation District</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#1A1A2E;">SOC</div><span class="partner-name">USSOCOM</span></div>
      <div class="partner-tile"><div class="partner-mark" style="background:#00843D;">EDC</div><span class="partner-name">Indiana EDC</span></div>
    </div>
  </div>
</div>


<!-- ══ WHO WE SERVE ══ -->
<section class="section section-light" id="who-we-serve" aria-label="Who We Serve">
  <div class="container">
    <div class="slabel">Who We Serve</div>
    <h2 class="stitle">Built for Every Corner<br>of the Bioeconomy</h2>
    <p class="ssub">Heartland BioWorks connects four distinct audiences to Indiana's integrated biomanufacturing ecosystem.</p>
    <div class="audience-grid">
      <div class="aud-card reveal">
        <div class="aud-ico">🏭</div>
        <h3>Biotech Companies</h3>
        <p>Access CDMO capacity, federal funding navigation, and commercialization support to scale your Indiana operations.</p>
        <a href="#" class="aud-link">Explore BioCAN &amp; BioLaunch →</a>
      </div>
      <div class="aud-card reveal">
        <div class="aud-ico">🎓</div>
        <h3>Workforce Candidates</h3>
        <p>Launch or advance your biotech career with industry-validated training programs and direct employer connections.</p>
        <a href="#" class="aud-link">Explore BioTrain →</a>
      </div>
      <div class="aud-card reveal">
        <div class="aud-ico">🏢</div>
        <h3>Employers &amp; Industry</h3>
        <p>Build your talent pipeline, access CDMO partners, and connect to Indiana's growing biomanufacturing workforce.</p>
        <a href="#" class="aud-link">Partner With Us →</a>
      </div>
      <div class="aud-card reveal">
        <div class="aud-ico">🏛️</div>
        <h3>Federal &amp; Government</h3>
        <p>Strengthen domestic biodefense, medical countermeasure manufacturing, and supply chain resilience through Indiana.</p>
        <a href="#" class="aud-link">Explore BioDefense →</a>
      </div>
    </div>
  </div>
</section>


<!-- ══ ECOSYSTEM ══ -->
<section class="section" id="ecosystem" aria-label="Explore the Ecosystem">
  <div class="container">
    <div class="eco-header">
      <div class="slabel">Explore the Ecosystem</div>
      <h2 class="stitle" style="max-width:480px;margin:0 auto;">Four Programs. One Mission.</h2>
      <p class="ssub">Click any program to explore. Indiana's integrated biomanufacturing infrastructure — from workforce to national defense.</p>
    </div>
    <div class="eco-track" id="ecoTrack" role="list">

      <div class="eco-card" data-p="biotrain" tabindex="0" role="listitem button" aria-expanded="false" aria-label="BioTrain – Workforce Development">
        <div class="eco-collapsed">
          <div class="eco-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
          <div style="min-width:0">
            <div class="eco-collapsed-name">BioTrain</div>
            <div class="eco-collapsed-sub">Workforce Development</div>
            <div class="eco-expand-hint"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg> Expand</div>
          </div>
        </div>
        <div class="eco-expanded" aria-hidden="true">
          <div class="eco-exp-tag">Workforce Development</div>
          <div class="eco-exp-title">BioTrain</div>
          <p class="eco-exp-desc">Building Indiana's biotech workforce pipeline through training, employer partnerships, and talent development programs.</p>
          <div class="eco-links-lbl">Explore</div>
          <div class="eco-links">
            <a class="eco-link" href="#">Training Programs</a>
            <a class="eco-link" href="#">Employer Partnerships</a>
            <a class="eco-link" href="#">Student Opportunities</a>
            <a class="eco-link" href="#">Workforce Resources</a>
          </div>
          <a class="eco-learn" href="#">Learn More →</a>
        </div>
      </div>

      <div class="eco-card" data-p="biolaunch" tabindex="0" role="listitem button" aria-expanded="false" aria-label="BioLaunch – Commercialization">
        <div class="eco-collapsed">
          <div class="eco-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg></div>
          <div style="min-width:0">
            <div class="eco-collapsed-name">BioLaunch</div>
            <div class="eco-collapsed-sub">Commercialization</div>
            <div class="eco-expand-hint"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg> Expand</div>
          </div>
        </div>
        <div class="eco-expanded" aria-hidden="true">
          <div class="eco-exp-tag">Commercialization &amp; Startups</div>
          <div class="eco-exp-title">BioLaunch</div>
          <p class="eco-exp-desc">Accelerating biotech startups from concept to market through mentorship, funding connections, and innovation support.</p>
          <div class="eco-links-lbl">Explore</div>
          <div class="eco-links">
            <a class="eco-link" href="#">Startup Accelerator</a>
            <a class="eco-link" href="#">Mentorship Network</a>
            <a class="eco-link" href="#">Innovation Lab</a>
            <a class="eco-link" href="#">Investor Connections</a>
          </div>
          <a class="eco-learn" href="#">Learn More →</a>
        </div>
      </div>

      <div class="eco-card" data-p="biocan" tabindex="0" role="listitem button" aria-expanded="false" aria-label="BioCAN – CDMO Network and Funding">
        <div class="eco-collapsed">
          <div class="eco-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
          <div style="min-width:0">
            <div class="eco-collapsed-name">BioCAN</div>
            <div class="eco-collapsed-sub">CDMO Network &amp; Funding</div>
            <div class="eco-expand-hint"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg> Expand</div>
          </div>
        </div>
        <div class="eco-expanded" aria-hidden="true">
          <div class="eco-exp-tag">CDMO Network &amp; Funding</div>
          <div class="eco-exp-title">BioCAN</div>
          <p class="eco-exp-desc">Connecting companies to CDMO capabilities, grant opportunities, and the funding network that powers Indiana's bioeconomy.</p>
          <div class="eco-links-lbl">Explore</div>
          <div class="eco-links">
            <a class="eco-link" href="#">Funding Opportunities</a>
            <a class="eco-link" href="#">CDMO Network</a>
            <a class="eco-link" href="#">Grant Applications</a>
            <a class="eco-link" href="#">Industry Partners</a>
          </div>
          <a class="eco-learn" href="#">Learn More →</a>
        </div>
      </div>

      <div class="eco-card" data-p="biodefense" tabindex="0" role="listitem button" aria-expanded="false" aria-label="BioDefense – National Security">
        <div class="eco-collapsed">
          <div class="eco-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <div style="min-width:0">
            <div class="eco-collapsed-name">BioDefense</div>
            <div class="eco-collapsed-sub">National Security</div>
            <div class="eco-expand-hint"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg> Expand</div>
          </div>
        </div>
        <div class="eco-expanded" aria-hidden="true">
          <div class="eco-exp-tag">National Security &amp; Defense</div>
          <div class="eco-exp-title">BioDefense</div>
          <p class="eco-exp-desc">Strengthening America's biodefense capabilities through strategic partnerships, supply chain resilience, and defense biotechnology.</p>
          <div class="eco-links-lbl">Explore</div>
          <div class="eco-links">
            <a class="eco-link" href="#">Defense Partnerships</a>
            <a class="eco-link" href="#">Supply Chain Resilience</a>
            <a class="eco-link" href="#">Strategic Biotechnology</a>
            <a class="eco-link" href="#">National Security</a>
          </div>
          <a class="eco-learn" href="#">Learn More →</a>
        </div>
      </div>

    </div>
  </div>
</section>


<!-- ══ WHY INDIANA ══ -->
<section class="section section-dark" id="why-indiana" aria-label="Why Indiana">
  <div class="container">
    <div class="slabel">Why Indiana</div>
    <h2 class="stitle" style="margin-bottom:52px;">The Numbers Tell<br>the Story</h2>
    <div class="indiana-grid">
      <div class="stats-col">
        <div class="stat-card reveal">
          <div class="stat-num"><em>#</em><span class="cnt" data-t="1">1</span></div>
          <div class="stat-lbl">Pharmaceutical Exports State</div>
          <div class="stat-detail">Leading the nation in pharmaceutical manufacturing output</div>
          <div class="stat-source">Source: U.S. International Trade Administration, 2024</div>
        </div>
        <div class="stat-card reveal">
          <div class="stat-num">Top <em><span class="cnt" data-t="3">3</span></em></div>
          <div class="stat-lbl">Life Science Export State</div>
          <div class="stat-detail">Among America's top three states for life science exports</div>
          <div class="stat-source">Source: Indiana Economic Development Corporation, 2024</div>
        </div>
        <div class="stat-card reveal">
          <div class="stat-num"><span class="cnt" data-t="31">0</span></div>
          <div class="stat-lbl">Regional Tech Hubs</div>
          <div class="stat-detail">Federally designated technology hubs — including Heartland BioWorks</div>
          <div class="stat-source">Source: U.S. Economic Development Administration, 2024</div>
        </div>
      </div>
      <div class="map-col">
        <div class="map-wrap">
          <svg viewBox="0 0 240 360" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Indiana state map with biomanufacturing network nodes">
            <path d="M42 22 L52 15 L80 12 L120 10 L160 12 L188 15 L200 22 L204 42 L205 65 L207 90 L207 115 L207 140 L207 165 L205 188 L204 208 L202 225 L198 242 L192 258 L183 270 L170 280 L156 288 L145 295 L136 306 L130 318 L125 330 L120 340 L115 330 L110 318 L104 306 L94 295 L82 285 L68 272 L56 256 L46 238 L38 218 L34 196 L32 172 L33 148 L34 124 L34 100 L36 76 L38 52 L42 22 Z" fill="rgba(62,178,72,0.09)" stroke="rgba(62,178,72,0.45)" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M42 22 L38 10 L52 8 L52 15 L42 22Z" fill="rgba(62,178,72,0.05)" stroke="rgba(62,178,72,0.35)" stroke-width="1"/>
            <circle cx="120" cy="155" r="5" fill="#3EB248" opacity=".95"><animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".95;.6;.95" dur="3s" repeatCount="indefinite"/></circle>
            <circle cx="80" cy="120" r="3.5" fill="#3EB248" opacity=".75"/>
            <circle cx="160" cy="120" r="3.5" fill="#3EB248" opacity=".75"/>
            <circle cx="95" cy="190" r="3.5" fill="#3EB248" opacity=".7"/>
            <circle cx="148" cy="195" r="3.5" fill="#3EB248" opacity=".7"/>
            <circle cx="60" cy="165" r="3" fill="#3EB248" opacity=".55"/>
            <circle cx="178" cy="162" r="3" fill="#3EB248" opacity=".55"/>
            <circle cx="120" cy="235" r="3.5" fill="#3EB248" opacity=".65"/>
            <line x1="120" y1="155" x2="80" y2="120" stroke="rgba(62,178,72,.22)" stroke-width="1"/>
            <line x1="120" y1="155" x2="160" y2="120" stroke="rgba(62,178,72,.22)" stroke-width="1"/>
            <line x1="120" y1="155" x2="95" y2="190" stroke="rgba(62,178,72,.22)" stroke-width="1"/>
            <line x1="120" y1="155" x2="148" y2="195" stroke="rgba(62,178,72,.22)" stroke-width="1"/>
            <line x1="80" y1="120" x2="60" y2="165" stroke="rgba(62,178,72,.14)" stroke-width="1"/>
            <line x1="160" y1="120" x2="178" y2="162" stroke="rgba(62,178,72,.14)" stroke-width="1"/>
            <line x1="95" y1="190" x2="120" y2="235" stroke="rgba(62,178,72,.16)" stroke-width="1"/>
            <line x1="148" y1="195" x2="120" y2="235" stroke="rgba(62,178,72,.16)" stroke-width="1"/>
            <text x="128" y="152" fill="rgba(255,255,255,.65)" font-size="8.5" font-family="Inter,sans-serif" font-weight="600">Indianapolis</text>
            <text x="38" y="118" fill="rgba(255,255,255,.4)" font-size="7.5" font-family="Inter,sans-serif">Lafayette</text>
            <text x="163" y="118" fill="rgba(255,255,255,.4)" font-size="7.5" font-family="Inter,sans-serif">Muncie</text>
            <text x="30" y="162" fill="rgba(255,255,255,.35)" font-size="7" font-family="Inter,sans-serif">Terre Haute</text>
            <text x="138" y="240" fill="rgba(255,255,255,.38)" font-size="7.5" font-family="Inter,sans-serif">Bloomington</text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ══ OPPORTUNITIES ══ -->
<section class="section section-light" id="opportunities" aria-label="Latest Opportunities">
  <div class="container">
    <div class="cards-header">
      <div>
        <div class="slabel">Latest Opportunities</div>
        <h2 class="stitle">Funding. Training.<br>Partnerships.</h2>
      </div>
      <a href="#" class="view-all-btn">View All Opportunities →</a>
    </div>
    <div class="grid-3">
      <div class="opp-card reveal">
        <div class="tag">Grant Opportunity</div>
        <h3>BARDA BioIndustrial Manufacturing Initiative</h3>
        <p>Federal funding for scaling domestic biomanufacturing capacity for medical countermeasures and critical biodefense applications.</p>
        <div class="opp-foot">
          <span>Deadline: Rolling</span>
          <a href="#" class="opp-cta">Apply Now →</a>
        </div>
      </div>
      <div class="opp-card reveal">
        <div class="tag">Training Program</div>
        <h3>Biomanufacturing Technician Certification</h3>
        <p>Ivy Tech and Purdue partnered program providing hands-on training for biomanufacturing technician roles at Indiana facilities.</p>
        <div class="opp-foot">
          <span>Next cohort: Fall 2026</span>
          <a href="#" class="opp-cta">Register →</a>
        </div>
      </div>
      <div class="opp-card reveal">
        <div class="tag">Industry Partnership</div>
        <h3>CDMO Network Expansion Partner</h3>
        <p>Join the BioCAN network of contract development and manufacturing organizations supporting Indiana's biotech ecosystem.</p>
        <div class="opp-foot">
          <span>Applications open</span>
          <a href="#" class="opp-cta">Learn More →</a>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ══ TESTIMONIALS ══ -->
<section class="testimonials" id="testimonials" aria-label="Testimonials">
  <div class="container">
    <div class="slabel">What People Are Saying</div>
    <h2 class="stitle">Outcomes from Indiana's<br>Biomanufacturing Ecosystem</h2>
    <div class="testi-grid">
      <div class="testi-card reveal">
        <p class="testi-text">"BioLaunch connected us to our first CDMO partner and helped us secure a Phase II SBIR within six months. Without the Heartland BioWorks network, we'd still be knocking on doors."</p>
        <div class="testi-author">
          <div class="testi-avatar">SK</div>
          <div>
            <div class="testi-name">Sarah K.</div>
            <div class="testi-role">Founder &amp; CEO, Indiana Biotech Startup</div>
          </div>
        </div>
      </div>
      <div class="testi-card reveal">
        <p class="testi-text">"BioTrain gave us a pipeline of job-ready technicians when we were scaling our facility. These aren't just trained workers — they're day-one contributors. We've hired 14 BioTrain graduates this year."</p>
        <div class="testi-author">
          <div class="testi-avatar">MR</div>
          <div>
            <div class="testi-name">Michael R.</div>
            <div class="testi-role">VP Operations, Indiana Biomanufacturing Company</div>
          </div>
        </div>
      </div>
      <div class="testi-card reveal">
        <p class="testi-text">"Indiana's biomanufacturing infrastructure — anchored by Heartland BioWorks — represents exactly the kind of regional capability the federal government needs for domestic supply chain resilience."</p>
        <div class="testi-author">
          <div class="testi-avatar">JL</div>
          <div>
            <div class="testi-name">J. L.</div>
            <div class="testi-role">Program Officer, Federal Agency Partner</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ══ NEWS ══ -->
<section class="section section-light" id="news" aria-label="News and Media">
  <div class="container">
    <div class="cards-header">
      <div>
        <div class="slabel">News &amp; Media</div>
        <h2 class="stitle">Latest from Heartland BioWorks</h2>
      </div>
      <a href="#" class="view-all-btn">View All News →</a>
    </div>
    <div class="grid-3">
      <!-- Featured story -->
      <div class="news-featured reveal">
        <div class="news-img">
          <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=75" alt="Biotech lab research" loading="lazy" />
        </div>
        <div class="news-body">
          <div class="news-cat">Announcement</div>
          <h3>Heartland BioWorks Launches Phase II BARDA Partnership for Domestic Biomanufacturing</h3>
          <p>Indiana's Regional Tech Hub secures major federal partnership to expand domestic medical countermeasure manufacturing capacity and workforce training infrastructure.</p>
          <a href="#" class="news-read-more">Read Full Story →</a>
          <p class="news-date" style="margin-top:12px;">June 3, 2026</p>
        </div>
      </div>
      <!-- Smaller cards -->
      <div class="news-card reveal">
        <div class="news-img">
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&q=70" alt="Life science research" loading="lazy" />
        </div>
        <div class="news-body">
          <div class="news-cat">News</div>
          <h3>Indiana Named Top State for Biotech Workforce Development by National Life Sciences Council</h3>
          <p class="news-date">May 20, 2026</p>
        </div>
      </div>
      <div class="news-card reveal">
        <div class="news-img">
          <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=70" alt="Collaboration" loading="lazy" />
        </div>
        <div class="news-body">
          <div class="news-cat">Press Release</div>
          <h3>BioCAN Network Announces $12M in Commercialization Funding for Indiana Biotech Startups</h3>
          <p class="news-date">May 8, 2026</p>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ══ STAY CONNECTED ══ -->
<section class="section section-dark" id="connect" aria-label="Stay Connected">
  <div class="container connect-inner">
    <div>
      <div class="slabel">Stay Connected</div>
      <h2 class="stitle" style="margin-bottom:14px;">Be Part of Indiana's Bioeconomy</h2>
      <p class="ssub">Join 2,400+ biotech leaders, researchers, and government partners receiving Indiana's biomanufacturing briefing — delivered monthly.</p>
      <div class="connect-perks">
        <div class="perk"><div class="perk-ico" aria-hidden="true">✓</div> New funding announcements and grant deadlines</div>
        <div class="perk"><div class="perk-ico" aria-hidden="true">✓</div> Upcoming training cohorts and industry events</div>
        <div class="perk"><div class="perk-ico" aria-hidden="true">✓</div> CDMO capacity alerts and partnership opportunities</div>
        <div class="perk"><div class="perk-ico" aria-hidden="true">✓</div> Federal program updates and policy news</div>
      </div>
    </div>
    <div class="form-box">
      <h3>Subscribe to the Briefing</h3>
      <p class="form-sub">Monthly. No spam. Unsubscribe anytime.</p>
      <form id="subscribeForm" novalidate>
        <div class="form-row full">
          <div class="fg">
            <label for="fn">Full Name</label>
            <input type="text" id="fn" name="fullName" placeholder="Jane Smith" required />
          </div>
        </div>
        <div class="form-row full">
          <div class="fg">
            <label for="em">Work Email</label>
            <input type="email" id="em" name="email" placeholder="jane@company.com" required />
          </div>
        </div>
        <div class="form-row full">
          <div class="fg">
            <label for="org">Organization</label>
            <input type="text" id="org" name="organization" placeholder="Your company or institution" />
          </div>
        </div>
        <button type="submit" class="btn-sub" id="subBtn">Subscribe →</button>
        <p class="form-note">Joining 2,400+ biotech and government leaders.</p>
      </form>
    </div>
  </div>
</section>


<!-- ══ FOOTER ══ -->
<footer class="footer" aria-label="Site footer">
  <div class="container">
    <div class="footer-top">
      <div class="f-brand">
        <a href="#home" aria-label="Heartland BioWorks – return to homepage">
          <img src="https://static.wixstatic.com/media/fcced6_f19335b6f6ed433b9a5c9a2294f3db1a~mv2.png" alt="Heartland BioWorks" />
        </a>
        <p>Indiana's Federally Designated Regional Tech Hub powering the future of biomanufacturing — from workforce development to national security.</p>
        <div class="f-contact">
          <a href="mailto:info@heartlandbioworks.org">✉ info@heartlandbioworks.org</a>
          <a href="#">📍 Indianapolis, Indiana</a>
        </div>
      </div>
      <div class="f-col">
        <h4>Programs</h4>
        <ul>
          <li><a href="#">BioTrain</a></li>
          <li><a href="#">BioLaunch</a></li>
          <li><a href="#">BioCAN</a></li>
          <li><a href="#">BioDefense</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">News &amp; Media</a></li>
          <li><a href="#">Upcoming Events</a></li>
          <li><a href="#">Educational Library</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h4>About</h4>
        <ul>
          <li><a href="#">Team</a></li>
          <li><a href="#">FAQs</a></li>
          <li><a href="#connect">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bot">
      <span>© 2026 Heartland BioWorks. All rights reserved. Federally Designated Regional Tech Hub.</span>
      <div class="f-social">
        <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
        <a href="#" aria-label="X / Twitter"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg></a>
        <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>
      </div>
    </div>
  </div>
</footer>


<script>
// ── NAVBAR SCROLL ──
const nav = document.getElementById('nav');
function onScroll(){nav.classList.toggle('scrolled',window.scrollY>100);}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

// ── ECOSYSTEM EXPAND ──
const track = document.getElementById('ecoTrack');
const cards = track.querySelectorAll('.eco-card');
cards.forEach(card=>{
  function toggle(){
    const wasActive=card.classList.contains('active');
    cards.forEach(c=>{c.classList.remove('active');c.setAttribute('aria-expanded','false');c.querySelector('.eco-expanded').setAttribute('aria-hidden','true');});
    if(!wasActive){card.classList.add('active');card.setAttribute('aria-expanded','true');card.querySelector('.eco-expanded').setAttribute('aria-hidden','false');track.classList.add('has-active');}
    else{track.classList.remove('has-active');}
  }
  card.addEventListener('click',toggle);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
});

// ── COUNTER ANIMATION ──
function animateCount(el,target,duration){
  const n=parseInt(target,10);if(isNaN(n))return;
  const t0=performance.now();
  (function tick(now){
    const p=Math.min((now-t0)/duration,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(n*eased);
    if(p<1)requestAnimationFrame(tick);
  })(t0);
}

// ── SCROLL REVEAL ──
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('vis');revObs.unobserve(e.target);});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('.cnt').forEach(el=>animateCount(el,el.dataset.t,1600));
    cntObs.unobserve(e.target);
  });
},{threshold:.5});
document.querySelectorAll('.stat-card').forEach(el=>cntObs.observe(el));

// ── FORM ──
document.getElementById('subscribeForm').addEventListener('submit',function(e){
  e.preventDefault();
  const btn=document.getElementById('subBtn');
  btn.textContent='Subscribed! ✓';btn.style.background='#00843D';btn.disabled=true;
  window.parent.postMessage({type:'formSubmit',formType:'newsletter',data:{fullName:fn.value,email:em.value,organization:org.value}},'*');
});

// ── IFRAME RESIZE ──
function postH(){window.parent.postMessage({type:'resize',height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');}
if('ResizeObserver' in window) new ResizeObserver(postH).observe(document.body);
window.addEventListener('load',postH);window.addEventListener('resize',postH);
setTimeout(postH,300);setTimeout(postH,900);
</script>
</body>
</html>
