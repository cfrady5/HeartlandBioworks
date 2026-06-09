<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Rapid Acquisition Model (RAM)</title>

  <style>
    :root {
      --bg: #05070c;
      --bg-2: #090d15;
      --bg-3: #0e1421;
      --panel: rgba(14, 20, 33, 0.82);
      --panel-2: rgba(255, 255, 255, 0.03);
      --panel-3: rgba(255, 255, 255, 0.05);
      --line: rgba(255, 255, 255, 0.12);
      --line-strong: rgba(255, 255, 255, 0.22);
      --text: #f5f7fb;
      --text-2: rgba(245, 247, 251, 0.78);
      --text-3: rgba(245, 247, 251, 0.55);
      --text-4: rgba(245, 247, 251, 0.34);
      --accent: #6f7fa8;
      --accent-2: #495879;
      --accent-3: rgba(111, 127, 168, 0.12);
      --glow: rgba(111, 127, 168, 0.28);
      --success: #1bb34a;
      --container: 1280px;
      --radius: 24px;
      --radius-sm: 14px;
      --shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
      --shadow-soft: 0 16px 50px rgba(0, 0, 0, 0.24);
      --ease: 220ms cubic-bezier(0.2, 0, 0, 1);
    }

    * {
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
      background: var(--bg);
    }

    body {
      margin: 0;
      padding: 0;
      color: var(--text);
      font-family:
        Inter,
        "Helvetica Neue",
        Helvetica,
        Arial,
        system-ui,
        sans-serif;
      background:
        radial-gradient(circle at 18% 18%, rgba(111, 127, 168, 0.11), transparent 26%),
        radial-gradient(circle at 85% 35%, rgba(111, 127, 168, 0.09), transparent 24%),
        linear-gradient(180deg, #05070c 0%, #080c14 50%, #05070c 100%);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -3;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 88%);
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.015) 45%, transparent 70%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      display: block;
      max-width: 100%;
    }

    iframe {
      display: block;
      width: 100%;
      border: 0;
    }

    .shell {
      position: relative;
      overflow: hidden;
    }

    .container {
      width: min(calc(100% - 48px), var(--container));
      margin: 0 auto;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: var(--text-3);
      font-size: 0.77rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .eyebrow::before {
      content: "";
      width: 14px;
      height: 14px;
      border: 1px solid var(--line-strong);
      display: inline-block;
      position: relative;
      box-shadow: inset 0 0 0 3px transparent;
    }

    .eyebrow::after {
      content: "";
      width: 72px;
      height: 1px;
      background: linear-gradient(90deg, var(--line-strong), transparent);
      display: inline-block;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1 {
      font-size: clamp(3.25rem, 7vw, 6.8rem);
      line-height: 0.94;
      letter-spacing: -0.07em;
      font-weight: 800;
      max-width: 820px;
    }

    h2 {
      font-size: clamp(2.2rem, 4.6vw, 4.8rem);
      line-height: 0.98;
      letter-spacing: -0.055em;
      font-weight: 760;
      max-width: 900px;
    }

    h3 {
      font-size: clamp(1.15rem, 1.6vw, 1.45rem);
      line-height: 1.2;
      font-weight: 680;
      letter-spacing: -0.03em;
    }

    p {
      color: var(--text-2);
      font-size: 1.03rem;
      line-height: 1.72;
    }

    .muted {
      color: var(--text-3);
    }

    .accent {
      color: #ffffff;
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
    }

    .section {
      position: relative;
      padding: 120px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .section-tight {
      padding: 90px 0;
    }

    .rule {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, var(--line-strong), transparent 85%);
      margin: 18px 0 26px;
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 34px;
    }

    .btn {
      min-height: 54px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      border: 1px solid var(--line);
      border-radius: 999px;
      font-size: 0.94rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      transition:
        transform var(--ease),
        border-color var(--ease),
        background var(--ease),
        box-shadow var(--ease);
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba(111, 127, 168, 0.92), rgba(73, 88, 121, 0.92));
      border-color: rgba(111, 127, 168, 0.55);
      box-shadow: 0 16px 44px rgba(73, 88, 121, 0.32);
      color: white;
    }

    .btn-primary:hover {
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 56px rgba(73, 88, 121, 0.42);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.025);
      color: var(--text);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.055);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background: linear-gradient(180deg, rgba(5, 7, 12, 0.94), rgba(5, 7, 12, 0.78));
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .nav-inner {
      min-height: 78px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }

    .brand-logo {
      width: 116px;
      height: auto;
      object-fit: contain;
      filter: brightness(1.02);
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .brand-kicker {
      color: var(--text-4);
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 22px;
      color: var(--text-3);
      font-size: 0.9rem;
    }

    .nav-links a {
      position: relative;
      transition: color var(--ease);
    }

    .nav-links a:hover {
      color: white;
    }

    .hero {
      position: relative;
      padding: 82px 0 110px;
      min-height: calc(100vh - 78px);
      display: flex;
      align-items: center;
    }

    .hero-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
      align-items: center;
      gap: 48px;
    }

    .hero-copy {
      position: relative;
      z-index: 2;
    }

    .hero-copy p.lead {
      max-width: 700px;
      font-size: 1.12rem;
      margin-top: 22px;
      color: var(--text-2);
    }

    .hero-topline {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: var(--text-3);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .hero-topline .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 16px var(--glow);
    }

    .hero-interface {
      display: grid;
      gap: 18px;
      position: relative;
    }

    .ui-panel {
      position: relative;
      border: 1px solid var(--line);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015)),
        rgba(8, 12, 20, 0.78);
      border-radius: 26px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .ui-panel::before,
    .ui-panel::after {
      content: "";
      position: absolute;
      border: 1px solid rgba(255, 255, 255, 0.24);
      width: 12px;
      height: 12px;
      pointer-events: none;
    }

    .ui-panel::before {
      top: 16px;
      left: 16px;
      border-right: 0;
      border-bottom: 0;
    }

    .ui-panel::after {
      right: 16px;
      bottom: 16px;
      border-left: 0;
      border-top: 0;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      background: rgba(255, 255, 255, 0.02);
    }

    .panel-title {
      color: var(--text-3);
      font-size: 0.76rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
    }

    .panel-controls {
      display: flex;
      gap: 8px;
    }

    .panel-controls span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      display: inline-block;
    }

    .video-shell {
      padding: 0;
    }

    .video-shell iframe {
      aspect-ratio: 16 / 9;
      min-height: 300px;
      background: #000;
    }

    .micro-panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .micro-panel {
      position: relative;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.015));
      border-radius: 18px;
      min-height: 158px;
      overflow: hidden;
      padding: 18px;
      box-shadow: var(--shadow-soft);
    }

    .micro-panel h4 {
      margin: 0 0 12px;
      color: var(--text);
      font-size: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .micro-panel .table-lines {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .micro-panel .table-lines span {
      display: block;
      height: 9px;
      border: 1px solid rgba(255, 255, 255, 0.13);
      background: rgba(255, 255, 255, 0.01);
    }

    .micro-panel .bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 70px;
      margin-top: 18px;
    }

    .micro-panel .bars span {
      flex: 1;
      background: linear-gradient(180deg, rgba(111, 127, 168, 0.9), rgba(111, 127, 168, 0.24));
      border: 1px solid rgba(111, 127, 168, 0.36);
      min-height: 14px;
    }

    .floating-orbit {
      position: absolute;
      left: -20px;
      top: 90px;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        0 0 0 18px rgba(255,255,255,0.015),
        0 0 0 54px rgba(255,255,255,0.01),
        0 0 42px rgba(111, 127, 168, 0.12);
      opacity: 0.45;
      filter: blur(0.2px);
      pointer-events: none;
    }

    .floating-orbit::before {
      content: "";
      position: absolute;
      inset: 38px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      border: 1px solid var(--line);
      border-radius: 28px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
      box-shadow: var(--shadow-soft);
    }

    .metric {
      padding: 34px 28px;
      min-height: 184px;
      border-right: 1px solid rgba(255,255,255,0.07);
      position: relative;
    }

    .metric:last-child {
      border-right: 0;
    }

    .metric::before {
      content: "";
      position: absolute;
      top: 0;
      left: 28px;
      right: 28px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    }

    .metric-number {
      font-size: clamp(2.7rem, 4vw, 4rem);
      line-height: 0.95;
      letter-spacing: -0.065em;
      font-weight: 800;
      color: white;
    }

    .metric-label {
      margin-top: 18px;
      color: var(--text-3);
      font-size: 0.97rem;
      max-width: 220px;
      line-height: 1.45;
    }

    .split-editorial {
      display: grid;
      grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
      gap: 0;
      border: 1px solid var(--line);
      border-radius: 30px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01));
      box-shadow: var(--shadow);
    }

    .split-left,
    .split-right {
      padding: 54px 42px;
      position: relative;
      min-height: 520px;
    }

    .split-left {
      border-right: 1px solid rgba(255,255,255,0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .split-left .issue-row {
      display: flex;
      align-items: center;
      gap: 24px;
      color: var(--text-3);
      font-size: 0.8rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .split-left .issue-row .divider {
      width: 1px;
      height: 24px;
      background: rgba(255,255,255,0.14);
    }

    .split-left h2 {
      max-width: 560px;
      font-size: clamp(2.8rem, 5vw, 5.4rem);
      line-height: 0.96;
    }

    .split-left .foot-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 22px;
      color: var(--text-3);
      font-size: 0.95rem;
    }

    .split-right .label-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-3);
      font-size: 0.95rem;
      margin-bottom: 22px;
    }

    .split-right .diagram-box {
      position: relative;
      border: 1px solid rgba(255,255,255,0.12);
      min-height: 280px;
      margin-top: 22px;
      background:
        repeating-linear-gradient(
          135deg,
          rgba(255,255,255,0.03) 0,
          rgba(255,255,255,0.03) 2px,
          transparent 2px,
          transparent 10px
        );
      overflow: hidden;
    }

    .scatter {
      position: absolute;
      inset: 26px auto auto 28px;
      width: 180px;
      height: 180px;
    }

    .scatter span,
    .grid-chart span {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255,255,255,0.78);
    }

    .grid-chart {
      position: absolute;
      right: 26px;
      bottom: 28px;
      width: 210px;
      height: 130px;
      border: 1px solid rgba(255,255,255,0.24);
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(5, 1fr);
    }

    .grid-chart::before,
    .grid-chart::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .grid-chart::before {
      background-image:
        linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px);
      background-size: calc(100% / 7) calc(100% / 5);
    }

    .principles {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      margin-top: 34px;
    }

    .principle {
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.16);
    }

    .principle .num {
      color: white;
      font-size: 2rem;
      letter-spacing: -0.05em;
      margin-bottom: 8px;
    }

    .principle .title {
      color: var(--text);
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
      margin-top: 42px;
    }

    .card {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)),
        rgba(8, 12, 20, 0.78);
      padding: 28px;
      overflow: hidden;
      box-shadow: var(--shadow-soft);
    }

    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 28px;
      right: 28px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    }

    .card h3 {
      margin: 10px 0 14px;
    }

    .card ul {
      list-style: none;
      padding: 0;
      margin: 16px 0 0;
      display: grid;
      gap: 10px;
    }

    .card li {
      position: relative;
      padding-left: 18px;
      color: var(--text-2);
      line-height: 1.6;
    }

    .card li::before {
      content: "";
      position: absolute;
      top: 0.62em;
      left: 0;
      width: 7px;
      height: 7px;
      border: 1px solid rgba(255,255,255,0.38);
      background: rgba(111, 127, 168, 0.25);
    }

    .icon-chip {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.14);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.03);
    }

    .icon-chip svg {
      width: 22px;
      height: 22px;
      stroke: #ffffff;
      stroke-width: 1.5;
      fill: none;
      opacity: 0.88;
    }

    .organizations {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
      margin-top: 36px;
    }

    .org {
      min-height: 132px;
      border: 1px solid var(--line);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      background: rgba(255,255,255,0.02);
      color: var(--text-2);
      font-size: 0.93rem;
      line-height: 1.45;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .timeline-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
      margin-top: 40px;
    }

    .timeline-card {
      position: relative;
      min-height: 280px;
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 28px 24px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)),
        rgba(8, 12, 20, 0.78);
      box-shadow: var(--shadow-soft);
    }

    .timeline-card .step {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 1px solid rgba(111,127,168,0.36);
      background: linear-gradient(180deg, rgba(111,127,168,0.24), rgba(111,127,168,0.08));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 800;
      color: white;
      box-shadow: 0 0 28px rgba(111, 127, 168, 0.18);
      margin-bottom: 20px;
    }

    .timeline-card p {
      margin-top: 12px;
    }

    .timeline-card ul {
      list-style: none;
      padding: 0;
      margin: 16px 0 0;
      display: grid;
      gap: 8px;
    }

    .timeline-card li {
      color: var(--text-3);
      font-size: 0.96rem;
      line-height: 1.5;
      padding-left: 16px;
      position: relative;
    }

    .timeline-card li::before {
      content: "·";
      position: absolute;
      left: 0;
      top: 0;
      color: var(--accent);
      font-weight: 800;
    }

    .award-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 36px;
    }

    .award {
      border: 1px solid var(--line);
      border-left: 3px solid rgba(255,255,255,0.28);
      border-radius: 18px;
      padding: 24px 24px 24px 22px;
      background: rgba(255,255,255,0.025);
    }

    .award h4 {
      margin: 0 0 8px;
      color: white;
      font-size: 1.05rem;
      font-weight: 700;
    }

    .cta-shell {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 30px;
      background:
        radial-gradient(circle at 20% 20%, rgba(111,127,168,0.14), transparent 28%),
        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
      padding: 56px 36px;
      text-align: center;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .cta-shell::before {
      content: "";
      position: absolute;
      left: -90px;
      top: -90px;
      width: 220px;
      height: 220px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 50%;
      box-shadow: 0 0 0 36px rgba(255,255,255,0.015);
      opacity: 0.6;
    }

    .cta-shell::after {
      content: "";
      position: absolute;
      right: -70px;
      bottom: -70px;
      width: 180px;
      height: 180px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 50%;
      box-shadow: 0 0 0 28px rgba(255,255,255,0.015);
      opacity: 0.4;
    }

    .cta-shell p {
      max-width: 760px;
      margin: 18px auto 0;
    }

    footer {
      padding: 34px 0 50px;
      border-top: 1px solid rgba(255,255,255,0.05);
      color: var(--text-4);
      font-size: 0.88rem;
      text-align: center;
    }

    @media (max-width: 1180px) {
      .hero-layout,
      .split-editorial {
        grid-template-columns: 1fr;
      }

      .split-left {
        border-right: 0;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        min-height: auto;
      }

      .metrics,
      .organizations,
      .timeline-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {
      .container {
        width: min(calc(100% - 32px), var(--container));
      }

      .nav-inner {
        min-height: 72px;
      }

      .brand {
        gap: 12px;
      }

      .brand-logo {
        width: 94px;
      }

      .nav-links {
        display: none;
      }

      .hero {
        padding: 62px 0 80px;
      }

      .micro-panels,
      .grid-2,
      .principles,
      .award-grid {
        grid-template-columns: 1fr;
      }

      .metrics,
      .organizations,
      .timeline-grid {
        grid-template-columns: 1fr;
      }

      .metric {
        border-right: 0;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }

      .metric:last-child {
        border-bottom: 0;
      }

      .split-left,
      .split-right,
      .cta-shell {
        padding: 38px 24px;
      }

      .floating-orbit {
        display: none;
      }
    }

    @media (max-width: 560px) {
      .hero-topline,
      .eyebrow {
        font-size: 0.7rem;
      }

      .button-row {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .panel-header {
        padding: 12px 14px;
      }

      .card,
      .timeline-card,
      .award,
      .org {
        padding-left: 20px;
        padding-right: 20px;
      }

      .section {
        padding: 84px 0;
      }

      .section-tight {
        padding: 74px 0;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <nav class="nav">
      <div class="container nav-inner">
        <a href="#home" class="brand" aria-label="RAM Home">
          <img
            class="brand-logo"
            src="https://static.wixstatic.com/media/fcced6_f19335b6f6ed433b9a5c9a2294f3db1a~mv2.png"
            alt="RAM Powered by ARI logo"
          />
          <div class="brand-copy">
            <span class="brand-kicker">Rapid Acquisition Model</span>
            <span class="brand-kicker">Powered by Applied Research Institute</span>
          </div>
        </a>

        <div class="nav-links">
          <a href="#impact">Impact</a>
          <a href="#model">Model</a>
          <a href="#pathway">Pathway</a>
          <a href="#recognition">Recognition</a>
        </div>

        <a
          href="https://linktr.ee/AppliedResearchInstitute"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
        >
          Explore RAM ↗
        </a>
      </div>
    </nav>

    <header class="hero" id="home">
      <div class="container hero-layout">
        <div class="hero-copy">
          <div class="floating-orbit" aria-hidden="true"></div>

          <div class="hero-topline">
            <span class="dot"></span>
            <span>Operating model for acquisition velocity</span>
          </div>

          <div class="rule"></div>

          <h1>
            Rapid Acquisition
            <span class="accent">Model for the modern mission</span>
          </h1>

          <p class="lead">
            The Rapid Acquisition Model moves technology from initial engagement to awardable outcomes.
            It gives government agencies a more direct, transparent, and accelerated way to identify,
            evaluate, and acquire emerging capabilities across the Department of War.
          </p>

          <div class="button-row">
            <a
              href="https://linktr.ee/AppliedResearchInstitute"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              Explore RAM in Action
            </a>
            <a href="#model" class="btn btn-secondary">See the model</a>
          </div>
        </div>

        <div class="hero-interface">
          <div class="ui-panel video-shell">
            <div class="panel-header">
              <div class="panel-title">Mission Brief | RAM Overview</div>
              <div class="panel-controls" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
            </div>
            <iframe
              src="https://www.youtube.com/embed/e688KErAKjA?rel=0"
              title="Revolutionizing Defense: How ARI's RAM Speeds Technology Transition"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>

          <div class="micro-panels">
            <div class="micro-panel">
              <h4>Transparent Evaluation</h4>
              <div class="table-lines" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="bars" aria-hidden="true">
                <span style="height:26%"></span>
                <span style="height:38%"></span>
                <span style="height:52%"></span>
                <span style="height:71%"></span>
                <span style="height:44%"></span>
              </div>
            </div>

            <div class="micro-panel">
              <h4>Mission Data Signals</h4>
              <div class="table-lines" aria-hidden="true">
                <span style="width:90%"></span>
                <span style="width:76%"></span>
                <span style="width:84%"></span>
                <span style="width:58%"></span>
                <span style="width:66%"></span>
              </div>
              <div class="bars" aria-hidden="true">
                <span style="height:18%"></span>
                <span style="height:28%"></span>
                <span style="height:63%"></span>
                <span style="height:46%"></span>
                <span style="height:80%"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="section-tight" id="impact">
      <div class="container">
        <div class="eyebrow">Proven impact</div>
        <div class="rule"></div>

        <h2>
          A data-driven acquisition model already
          <span class="accent">delivering outcomes</span>
        </h2>

        <div class="metrics" style="margin-top:40px;">
          <div class="metric">
            <div class="metric-number">$3B+</div>
            <div class="metric-label">in contracts awarded</div>
          </div>
          <div class="metric">
            <div class="metric-number">150+</div>
            <div class="metric-label">government activities participating</div>
          </div>
          <div class="metric">
            <div class="metric-number">300%</div>
            <div class="metric-label">faster to award</div>
          </div>
          <div class="metric">
            <div class="metric-number">85%</div>
            <div class="metric-label">non-traditional vendor participation</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="model">
      <div class="container">
        <div class="split-editorial">
          <div class="split-left">
            <div>
              <div class="issue-row">
                <span>RAM briefing</span>
                <span class="divider"></span>
                <span>Issue no. 7</span>
              </div>

              <h2>
                RAM is accelerating acquisition,
                not adding friction.
              </h2>
            </div>

            <div class="foot-meta">
              <span>Competition</span>
              <span>Transparency</span>
              <span>Faster transition</span>
            </div>
          </div>

          <div class="split-right">
            <div class="label-line">
              <span>Specific operational value</span>
              <span class="muted">Data-driven decision environment</span>
            </div>

            <div class="diagram-box">
              <div class="scatter" aria-hidden="true">
                <span style="left:8%; top:54%"></span>
                <span style="left:18%; top:36%"></span>
                <span style="left:24%; top:67%"></span>
                <span style="left:33%; top:24%"></span>
                <span style="left:41%; top:48%"></span>
                <span style="left:47%; top:15%"></span>
                <span style="left:56%; top:58%"></span>
                <span style="left:61%; top:31%"></span>
                <span style="left:73%; top:44%"></span>
                <span style="left:80%; top:22%"></span>
                <span style="left:86%; top:63%"></span>
              </div>

              <div class="grid-chart" aria-hidden="true"></div>
            </div>

            <div class="principles">
              <div class="principle">
                <div class="num">01</div>
                <div class="title">Software-enabled process</div>
                <p>One environment for competition, evaluation, and award.</p>
              </div>
              <div class="principle">
                <div class="num">02</div>
                <div class="title">Privacy and trust</div>
                <p>Criteria-based assessment with transparent workflows.</p>
              </div>
              <div class="principle">
                <div class="num">03</div>
                <div class="title">Operational delivery</div>
                <p>Faster pathways from identification to awardable status.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-top:28px;">
          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <path d="M8 8h8M8 12h8M8 16h5"></path>
              </svg>
            </div>
            <h3>What RAM Does</h3>
            <p>
              RAM demonstrates how competition, evaluation, and award can occur in one transparent,
              data-driven environment that delivers capabilities to the field faster. It brings together
              commercial-first access, measurable performance, and accelerated delivery into a single model.
            </p>
          </div>

          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 19l14-14"></path>
                <path d="M7 7h10v10"></path>
              </svg>
            </div>
            <h3>A Different Starting Point</h3>
            <p>
              Through concise, video-based submissions, innovators present five to seven minute solution
              pitches reviewed against published evaluation criteria. Competition, evaluation, and award
              happen within the same digital environment, replacing lengthy paperwork cycles with a more
              direct and transparent process.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="organizations">
      <div class="container">
        <div class="eyebrow">Applied across government</div>
        <div class="rule"></div>

        <h2>
          RAM is scalable across missions,
          <span class="accent">operational domains, and critical technology areas.</span>
        </h2>

        <div class="organizations">
          <div class="org">Defense Advanced Research Projects Agency</div>
          <div class="org">Chief Digital and Artificial Intelligence Office</div>
          <div class="org">Army Applications Laboratory</div>
          <div class="org">Department of the Air Force</div>
        </div>
      </div>
    </section>

    <section class="section" id="audiences">
      <div class="container">
        <div class="eyebrow">Powering government and innovators</div>
        <div class="rule"></div>

        <h2>
          One model. Two high-value outcomes.
        </h2>

        <div class="grid-2">
          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3v18"></path>
                <path d="M3 12h18"></path>
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
            </div>
            <h3>For Government</h3>
            <ul>
              <li>Mission-speed acquisition</li>
              <li>Higher fidelity, lower burden assessments</li>
              <li>Transparent, data-driven decisions</li>
              <li>Broader access to the innovation base</li>
              <li>Proven transition pathways</li>
              <li>Reduced administrative burden</li>
              <li>Alignment with Secretary of War acquisition priorities</li>
            </ul>
          </div>

          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 12h16"></path>
                <path d="M12 4l8 8-8 8"></path>
              </svg>
            </div>
            <h3>For Vendors</h3>
            <ul>
              <li>Clear, predictable, fair process</li>
              <li>Lower barrier to entry</li>
              <li>Increased visibility to DoW buyers</li>
              <li>Direct pathways to funding</li>
              <li>Actionable feedback</li>
              <li>Awardable status credibility</li>
              <li>A single digital gateway to engage with the Department</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="why">
      <div class="container">
        <div class="eyebrow">Why RAM matters</div>
        <div class="rule"></div>

        <h2>
          Government is operating in an environment that demands
          <span class="accent">faster delivery, broader innovation access, and more adaptable acquisition.</span>
        </h2>

        <div class="grid-2">
          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 19l14-14"></path>
                <path d="M14 5h5v5"></path>
              </svg>
            </div>
            <h3>Technology to the Field</h3>
            <p>Increasing flexibility and maturity in delivering technology to the field.</p>
          </div>

          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 8h16"></path>
                <path d="M4 12h16"></path>
                <path d="M4 16h16"></path>
              </svg>
            </div>
            <h3>Capability Portfolios</h3>
            <p>Enabling acquisition approaches that support portfolios of capabilities.</p>
          </div>

          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="6" cy="12" r="2"></circle>
                <circle cx="12" cy="6" r="2"></circle>
                <circle cx="18" cy="12" r="2"></circle>
                <circle cx="12" cy="18" r="2"></circle>
                <path d="M7.5 10.8l3-3M13.5 7.2l3 3M16.5 13.2l-3 3M10.5 16.2l-3-3"></path>
              </svg>
            </div>
            <h3>Industrial Base Expansion</h3>
            <p>Broadening opportunities for new entrants and expanding the defense industrial base.</p>
          </div>

          <div class="card">
            <div class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 19h16"></path>
                <path d="M7 15l3-3 3 2 4-5"></path>
              </svg>
            </div>
            <h3>Modern Acquisition</h3>
            <p>Advancing innovative program management and acquisition approaches.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="pathway">
      <div class="container">
        <div class="eyebrow">How RAM works</div>
        <div class="rule"></div>

        <h2>
          A continuous pathway from
          <span class="accent">engagement to award</span>
        </h2>

        <div class="timeline-grid">
          <div class="timeline-card">
            <div class="step">1</div>
            <h3>Engagement and Access</h3>
            <p>
              Programs like DARPAConnect and SciTechCONNECT expand access and help identify alignment early.
            </p>
          </div>

          <div class="timeline-card">
            <div class="step">2</div>
            <h3>Capability Alignment</h3>
            <ul>
              <li>Align solutions to mission needs</li>
              <li>Connect with the right offices</li>
              <li>Refine positioning through engagement</li>
            </ul>
          </div>

          <div class="timeline-card">
            <div class="step">3</div>
            <h3>Solution Presentation</h3>
            <ul>
              <li>5 to 7 minute video submissions</li>
              <li>Structured technical framing</li>
              <li>SME-informed assessment</li>
            </ul>
          </div>

          <div class="timeline-card">
            <div class="step">4</div>
            <h3>Marketplace + Award</h3>
            <ul>
              <li>Tradewinds Solutions Marketplace</li>
              <li>DARPA ERIS Marketplace</li>
              <li>Platform One Marketplace</li>
              <li>Discovery, engagement, and award using existing authorities</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="delivering">
      <div class="container">
        <div class="eyebrow">What RAM is delivering</div>
        <div class="rule"></div>

        <h2>
          Reduced friction, improved visibility,
          and <span class="accent">faster transition to awardable outcomes.</span>
        </h2>

        <div class="grid-2">
          <div class="card">
            <h3>Reduced Friction at the Front End</h3>
            <p>RAM lowers the administrative burden of early-stage acquisition and simplifies the pathway from initial engagement to decision.</p>
          </div>

          <div class="card">
            <h3>Improved Capability Visibility</h3>
            <p>Government buyers gain stronger visibility into relevant capabilities and measurable performance in a structured environment.</p>
          </div>

          <div class="card">
            <h3>Shortened Timelines</h3>
            <p>Identification, evaluation, and acquisition decisions move faster without sacrificing rigor or fairness.</p>
          </div>

          <div class="card">
            <h3>Expanded Non-Traditional Access</h3>
            <p>RAM broadens participation and creates more direct entry points for commercial and non-traditional performers.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="recognition">
      <div class="container">
        <div class="eyebrow">Recognition</div>
        <div class="rule"></div>

        <h2>
          External validation for
          <span class="accent">operational impact and innovation.</span>
        </h2>

        <div class="award-grid">
          <div class="award">
            <h4>Gov Forum Impact Award</h4>
            <p>Disruptive Program of the Year | ARI RAM</p>
          </div>

          <div class="award">
            <h4>2025 Forum Innovation Award</h4>
            <p>DARPAConnect &amp; ERIS Marketplace</p>
          </div>

          <div class="award">
            <h4>2026 Forum Innovation Award</h4>
            <p>DARPAConnect &amp; ERIS Marketplace and SciTechCONNECT</p>
          </div>

          <div class="award">
            <h4>2025 IT100</h4>
            <p>Jason Preisser and Jess Resig</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="final-cta">
      <div class="container">
        <div class="cta-shell">
          <div class="eyebrow" style="justify-content:center;">RAM in action</div>
          <h2 style="margin:18px auto 0;">
            RAM is already in use across the Department to move capability faster, broaden participation, and deliver outcomes.
          </h2>
          <p>
            Explore the broader RAM ecosystem and see how programs, platforms, and pathways are connecting mission needs with real acquisition velocity.
          </p>

          <div class="button-row" style="justify-content:center;">
            <a
              href="https://linktr.ee/AppliedResearchInstitute"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              Explore All RAM Programs
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="container">
        © 2026 Rapid Acquisition Model. Powered by Applied Research Institute.
      </div>
    </footer>
  </div>

  <script>
    (function () {
      function postHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );

        window.parent.postMessage(
          {
            type: "resize",
            height: height
          },
          "*"
        );
      }

      if ("ResizeObserver" in window) {
        var observer = new ResizeObserver(function () {
          postHeight();
        });
        observer.observe(document.body);
      }

      window.addEventListener("load", postHeight);
      window.addEventListener("resize", postHeight);

      setTimeout(postHeight, 250);
      setTimeout(postHeight, 800);
      setTimeout(postHeight, 1500);
    })();
  </script>
</body>
</html>