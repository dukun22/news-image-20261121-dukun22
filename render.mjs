// Render the 21 November news poster: reads stories.json, builds a
// 1024x1024 HTML page and screenshots it with headless Chromium.
// Only Node's standard library is used; the artwork is original SVG.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(root, 'stories.json'), 'utf8'));

// Small original icons, one per story (48x48 viewBox, drawn by hand).
const icons = {
  chart: `<svg viewBox="0 0 64 64" width="52" height="52"><rect x="8" y="36" width="10" height="20" fill="#a41212"/><rect x="24" y="26" width="10" height="30" fill="#14264a"/><rect x="40" y="14" width="10" height="42" fill="#a41212"/><path d="M6 14 L28 8 L58 4" stroke="#14264a" stroke-width="3" fill="none"/><path d="M52 4 L58 4 L56 10" stroke="#14264a" stroke-width="3" fill="none"/></svg>`,
  shield: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M32 6 L54 14 V32 C54 46 44 56 32 60 C20 56 10 46 10 32 V14 Z" fill="#14264a"/><path d="M32 20 L32 44 M22 30 L42 30" stroke="#f8f4ec" stroke-width="4" fill="none"/><circle cx="32" cy="32" r="4" fill="#a41212"/></svg>`,
  gamepad: `<svg viewBox="0 0 64 64" width="52" height="52"><rect x="8" y="20" width="48" height="26" rx="12" fill="#14264a"/><path d="M20 28 v10 M15 33 h10" stroke="#f8f4ec" stroke-width="3" fill="none"/><circle cx="42" cy="30" r="3.5" fill="#a41212"/><circle cx="49" cy="36" r="3.5" fill="#f8f4ec"/></svg>`,
  leaf: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M32 6 C52 14 56 34 40 50 C26 62 10 54 10 38 C10 20 20 10 32 6 Z" fill="#14264a"/><path d="M32 12 C32 26 30 38 20 50" stroke="#f8f4ec" stroke-width="3" fill="none"/><path d="M32 24 L44 20 M32 34 L46 30" stroke="#f8f4ec" stroke-width="2.5" fill="none"/></svg>`,
  target: `<svg viewBox="0 0 64 64" width="52" height="52"><circle cx="32" cy="32" r="26" fill="none" stroke="#14264a" stroke-width="4"/><circle cx="32" cy="32" r="16" fill="none" stroke="#a41212" stroke-width="4"/><circle cx="32" cy="32" r="7" fill="#14264a"/><circle cx="32" cy="32" r="2.5" fill="#f8f4ec"/></svg>`,
};

// Lead illustration: an original night-sky scene — a missile trail arcing
// over a stylised radar sweep, with a shield standing guard below.
const leadArt = `<svg viewBox="0 0 220 190" width="220" height="190">
  <rect x="0" y="0" width="220" height="190" fill="#14264a"/>
  <circle cx="30" cy="26" r="2" fill="#f8f4ec"/><circle cx="70" cy="14" r="1.6" fill="#f8f4ec"/>
  <circle cx="120" cy="30" r="2" fill="#f8f4ec"/><circle cx="170" cy="18" r="1.6" fill="#f8f4ec"/>
  <circle cx="200" cy="44" r="2" fill="#f8f4ec"/><circle cx="95" cy="48" r="1.5" fill="#f8f4ec"/>
  <path d="M12 150 Q60 60 150 34 Q190 22 208 30" stroke="#f8c531" stroke-width="4" fill="none"/>
  <path d="M196 22 L212 30 L196 40 Z" fill="#f8c531"/>
  <circle cx="150" cy="34" r="5" fill="#a41212"/>
  <path d="M20 150 L110 150 L110 168 L20 168 Z" fill="#0b1a33"/>
  <path d="M40 158 L70 158 M85 158 L100 158" stroke="#f8f4ec" stroke-width="2"/>
  <path d="M110 108 L138 118 V140 C138 156 124 166 110 170 C96 166 82 156 82 140 V118 Z" fill="#f8f4ec"/>
  <path d="M110 126 L110 152 M100 136 L120 136" stroke="#a41212" stroke-width="5" fill="none"/>
  <text x="110" y="186" font-size="13" font-weight="700" fill="#f8f4ec" text-anchor="middle" font-family="Arial,sans-serif">POLAND • 21 NOV 2026</text>
</svg>`;

const story = (s) => `
  <div class="story">
    <div class="num">${s.n}</div>
    <div class="sbody">
      <div class="kicker">${s.kicker}</div>
      <div class="shead">${s.headline}</div>
      <div class="ssum">${s.summary}</div>
    </div>
    <div class="sicon">${icons[s.icon]}</div>
  </div>`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1024px;height:1024px;background:#f8f4ec;color:#141414;font-family:"Noto Sans",Arial,sans-serif;overflow:hidden}
.page{width:1024px;height:1024px;padding:14px 36px 10px;display:flex;flex-direction:column}
.mast{text-align:center;border-bottom:4px solid #141414;padding-bottom:6px}
.mast h1{font-size:50px;font-weight:900;letter-spacing:5px;line-height:1}
.dateline{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #141414;padding:5px 2px 6px}
.dateline .date{font-size:27px;font-weight:900;color:#a41212;letter-spacing:1px}
.dateline .tag{font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
.lead{display:flex;gap:24px;padding:10px 0 8px;border-bottom:2px solid #141414}
.lead-text{flex:1}
.kicker{font-size:16px;font-weight:900;letter-spacing:2px;color:#a41212;text-transform:uppercase}
.lead-text h2{font-size:33px;line-height:1.13;font-weight:900;margin:7px 0 8px}
.lead-text p{font-size:18px;line-height:1.32}
.lead-art{flex:0 0 220px;display:flex;align-items:center;justify-content:center}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 24px}
.story{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid #b9b2a4}
.num{flex:0 0 30px;height:30px;border-radius:50%;background:#a41212;color:#f8f4ec;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:2px}
.sbody{flex:1}
.shead{font-size:19px;line-height:1.16;font-weight:900;margin:4px 0 5px}
.ssum{font-size:15px;line-height:1.3}
.sicon{flex:0 0 44px;padding-top:4px}
.sicon svg{width:44px;height:44px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:6px 0;border-bottom:2px solid #141414}
.stat{text-align:center}
.stat .n{font-size:26px;font-weight:900;color:#a41212;line-height:1}
.stat .l{font-size:13px;line-height:1.25;margin-top:4px;font-weight:700}
.foot{border-top:4px solid #141414;margin-top:6px;padding-top:5px;text-align:center}
.foot .f1{font-size:18px;font-weight:700}
.foot .f2{font-size:15px;color:#555;margin-top:2px}
</style></head><body><div class="page">
  <div class="mast"><h1>${data.masthead}</h1></div>
  <div class="dateline"><span class="date">${data.date}</span><span class="tag">${data.tagline}</span></div>
  <div class="lead">
    <div class="lead-text">
      <div class="kicker">${data.lead.kicker}</div>
      <h2>${data.lead.headline}</h2>
      <p><b>${data.lead.dateline} —</b> ${data.lead.summary}</p>
    </div>
    <div class="lead-art">${leadArt}</div>
  </div>
  <div class="grid2">
    ${data.stories.slice(0, 2).map((s) => story(s)).join('\n')}
  </div>
  <div class="grid3">
    ${data.stories.slice(2).map((s) => story(s)).join('\n')}
  </div>
  <div class="stats">
    <div class="stat"><div class="n">6,910</div><div class="l">S&amp;P 500 close, down 3.7% on Friday</div></div>
    <div class="stat"><div class="n">−5.3%</div><div class="l">Nasdaq's fall, worst week since 2020</div></div>
    <div class="stat"><div class="n">$3.79bn</div><div class="l">GTA 6 day-one sales, a record</div></div>
    <div class="stat"><div class="n">3</div><div class="l">Missiles shot down over Riyadh</div></div>
  </div>
  <div class="foot">
    <div class="f1">${data.footer}</div>
    <div class="f2">${data.judge_note}</div>
  </div>
</div></body></html>`;

const outHtml = '/tmp/poster21.html';
writeFileSync(outHtml, html);
const chrome = join(homedir(), '.cache/ms-playwright/chromium-1148/chrome-linux/chrome');
const outPng = join(root, 'entry.png');
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1024,1024',
  `--screenshot=${outPng}`, `file://${outHtml}`,
], { stdio: 'inherit' });
console.log('wrote', outPng);
