import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const asset = (name) => fileURLToPath(new URL('../assets/' + name, import.meta.url));

// Embed real vector artwork: no remote image requests inside GitHub's SVG sandbox.
async function icon(name, x, y, size = 42) {
  let svg = await readFile(asset('icons/' + name + '.svg'), 'utf8');
  svg = svg.replace(/id="([^"]+)"/g, (_, id) => 'id="' + name + '-' + id + '"')
    .replace(/url\(#([^)]+)\)/g, (_, id) => 'url(#' + name + '-' + id + ')');
  svg = svg.replace(/<svg\b([^>]*)>/, (_, attrs) => '<svg ' +
    attrs.replace(/\s(?:width|height)="[^"]*"/g, '') +
    ' x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '">');
  return svg;
}

const figma = await icon('figma', 17, 14);
const framer = await icon('framer', 17, 14);
const react = await icon('react', 17, 14);
const stage = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="650" viewBox="0 0 1100 650" role="img" aria-labelledby="title desc">
<title id="title">POZAN — from imagination to interaction</title>
<desc id="desc">An animated design study: floating interface layers, a rotating sculptural ribbon, a prototype cursor and Figma, Framer and React workflow. Animation is decorative, not an interactive editor.</desc>
<defs>
 <radialGradient id="halo"><stop stop-color="#778496" stop-opacity=".2"/><stop offset="1" stop-color="#0d1117" stop-opacity="0"/></radialGradient>
 <linearGradient id="glass" x2=".8" y2="1"><stop stop-color="#2c3440"/><stop offset=".5" stop-color="#171d26"/><stop offset="1" stop-color="#10151c"/></linearGradient>
 <linearGradient id="chrome" x2="1" y2="1"><stop stop-color="#202936"/><stop offset=".25" stop-color="#e2e8ed"/><stop offset=".48" stop-color="#535e6b"/><stop offset=".65" stop-color="#f5f5f0"/><stop offset="1" stop-color="#424d5b"/></linearGradient>
 <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#c2ccda" opacity=".15"/></pattern>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="20" stdDeviation="14" flood-opacity=".65"/></filter>
 <style>
 text{font-family:Verdana,sans-serif;fill:#e6edf3}.mono{font-family:monospace;fill:#929eae;font-size:12px;letter-spacing:2px}.display{font-family:Georgia,serif;font-size:50px;letter-spacing:-2px}.small{font-size:13px;fill:#a5b0bf}
 .float{animation:float 8s ease-in-out infinite}.back{animation:back 8s ease-in-out infinite}.front{animation:front 8s ease-in-out infinite}
 .spin{transform-origin:835px 180px;animation:spin 22s linear infinite}.cursor{animation:cursor 8s ease-in-out infinite}.selection{animation:select 8s ease-in-out infinite}
 .draw{stroke-dasharray:600;animation:draw 8s ease-in-out infinite}.pulse{animation:pulse 3s ease-in-out infinite}.flow{stroke-dasharray:5 12;animation:flow 4s linear infinite}
 @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
 @keyframes back{0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,-20px)}}
 @keyframes front{0%,100%{transform:translate(0,0)}50%{transform:translate(16px,16px)}}
 @keyframes spin{to{transform:rotate(360deg)}}
 @keyframes cursor{0%,100%{transform:translate(0,0)}25%,45%{transform:translate(-116px,-35px)}65%,85%{transform:translate(-52px,32px)}}
 @keyframes select{0%,18%,90%,100%{opacity:.2}28%,82%{opacity:1}}
 @keyframes draw{0%,10%{stroke-dashoffset:600}55%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:600}}
 @keyframes pulse{50%{opacity:.35}}@keyframes flow{to{stroke-dashoffset:-68}}
 @media(prefers-reduced-motion:reduce){*{animation:none!important}.draw{stroke-dashoffset:0}}
 </style>
</defs>
<rect width="1100" height="650" rx="18" fill="#0d1117"/>
<ellipse cx="640" cy="300" rx="490" ry="300" fill="url(#halo)"/>
<text x="44" y="44" class="mono">POZAN / INTERACTION STUDY — 001</text>
<text x="44" y="104" class="display">Imagination,</text><text x="44" y="160" class="display" font-style="italic">in motion.</text>
<text x="46" y="194" class="small">Visual systems. Thoughtful interactions.</text>
<text x="46" y="217" class="small">Interfaces that feel considered.</text>
<g opacity=".6" stroke="#46505e" fill="none"><ellipse cx="835" cy="180" rx="167" ry="102"/><ellipse cx="835" cy="180" rx="196" ry="119" stroke-dasharray="2 9"/></g>
<g class="spin" fill="none" stroke="url(#chrome)" stroke-width="18">
 <ellipse cx="835" cy="180" rx="101" ry="57" transform="rotate(-40 835 180)"/>
 <ellipse cx="835" cy="180" rx="101" ry="57" transform="rotate(40 835 180)"/>
 <ellipse cx="835" cy="180" rx="101" ry="57" transform="rotate(90 835 180)"/>
</g>
<circle cx="835" cy="180" r="7" fill="#e9ecf0"/>
<text x="1014" y="307" text-anchor="end" class="mono">FORM × FUNCTION</text>
<g transform="translate(310 251) matrix(.91 .12 -.27 .83 0 0)">
 <g class="back"><rect x="40" y="-22" width="510" height="240" rx="14" fill="#121922" stroke="#536170"/><rect x="40" y="-22" width="510" height="240" rx="14" fill="url(#dots)"/><text x="65" y="11" class="mono">01 / WIREFRAME</text><path d="M65 42H264V178H65ZM290 42H514M290 74H465M290 110H500M290 143H450" stroke="#536170" fill="none"/></g>
 <g class="float" filter="url(#shadow)">
  <rect width="510" height="248" rx="14" fill="url(#glass)" stroke="#82909e"/>
  <path d="M0 35H510" stroke="#46505d"/><circle cx="18" cy="18" r="3" fill="#84909e"/><circle cx="31" cy="18" r="3" fill="#84909e"/><text x="54" y="23" class="mono">UNTITLED / DESIGN CANVAS</text>
  <rect x="24" y="55" width="182" height="170" rx="8" fill="#0e141b"/>
  <ellipse cx="115" cy="137" rx="59" ry="58" fill="none" stroke="url(#chrome)" stroke-width="24"/><path d="M82 171L148 100" stroke="#e6edf3" stroke-width="3"/>
  <text x="233" y="87" class="mono">PORTFOLIO / 2026</text><text x="232" y="124" font-family="Georgia,serif" font-size="29">Less, but better.</text>
  <path d="M234 146H470M234 158H441" stroke="#687585" stroke-width="3"/>
  <rect x="233" y="181" width="142" height="31" rx="15" fill="#e7e9ed"/><text x="254" y="201" style="fill:#151a23;font-size:11px">Explore the work ↗</text>
  <g class="selection" stroke="#a6b9f9" fill="none"><rect x="223" y="102" width="263" height="37"/><path d="M220 99h6v6h-6zM483 99h6v6h-6zM220 136h6v6h-6zM483 136h6v6h-6z" fill="#d8e1ff"/></g>
 </g>
 <g class="front" filter="url(#shadow)"><rect x="333" y="202" width="244" height="66" rx="9" fill="#202a36" stroke="#8c99ab"/><text x="352" y="225" class="mono">PROTOTYPE / EASE OUT</text><path d="M353 249C390 249 400 231 420 231H556" fill="none" stroke="#b4c4f7" stroke-width="2" class="draw"/></g>
 <g class="cursor" transform="translate(0 0)"><path d="M441 165l7 30 7-11 13-4z" fill="#e3eaff" stroke="#0d1117" stroke-width="2"/><rect x="460" y="192" width="66" height="22" rx="5" fill="#a6b9f9"/><text x="472" y="207" style="fill:#111827;font-size:11px">POZAN</text></g>
</g>
<path d="M221 408C260 408 244 372 304 372M758 480C861 480 841 393 914 393" fill="none" stroke="#7c8798" class="flow"/>
<g transform="translate(45 328)" class="unused"><g class="float"><rect width="204" height="75" rx="14" fill="#181f29" stroke="#3e4858"/>${figma}<text x="72" y="34" font-size="17">Figma</text><text x="72" y="54" class="small">Design systems</text></g></g>
<g transform="translate(865 353)"><g class="back"><rect width="199" height="75" rx="14" fill="#181f29" stroke="#3e4858"/>${framer}<text x="71" y="34" font-size="17">Framer</text><text x="71" y="54" class="small">Interactive ideas</text></g></g>
<g transform="translate(812 461)"><g class="float"><rect width="218" height="75" rx="14" fill="#181f29" stroke="#3e4858"/>${react}<text x="72" y="34" font-size="17">React</text><text x="72" y="54" class="small">Built for the browser</text></g></g>
<path d="M44 568H1056" stroke="#303946"/>
<text x="44" y="603" class="mono">01 / COMPOSE</text><text x="395" y="603" class="mono">02 / PROTOTYPE</text><text x="790" y="603" class="mono">03 / SHIP</text>
<circle class="pulse" cx="1038" cy="599" r="4" fill="#d6dfed"/>
</svg>`;
await writeFile(asset('design-motion.svg'), stage);

const names = ['html', 'css', 'js', 'ts', 'react', 'nextjs', 'figma', 'framer', 'nodejs', 'firebase', 'mysql', 'git', 'github'];
const labels = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Figma', 'Framer', 'Node.js', 'Firebase', 'SQL', 'Git', 'GitHub'];
const tiles = await Promise.all(names.map(async (name, i) => {
  const row = i < 6 ? 0 : 1;
  const col = row ? i - 6 : i;
  const x = (row ? 66 : 136) + col * 140;
  const y = row ? 174 : 37;
  return '<g transform="translate(' + x + ' ' + y + ')"><g class="tile" style="animation-delay:-' + (i * .43) + 's">' +
    '<rect x="3" y="7" width="119" height="103" rx="19" fill="#05080d"/><rect width="119" height="103" rx="19" fill="url(#tile)" stroke="#394454"/>' +
    await icon(name, 34, 13, 51) + '<text x="59.5" y="86" text-anchor="middle">' + labels[i] + '</text></g></g>';
}));
await writeFile(asset('tools-motion.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="320" viewBox="0 0 1100 320" role="img" aria-label="Technology toolkit: ${labels.join(', ')}">
<defs><linearGradient id="tile" x2=".3" y2="1"><stop stop-color="#252e3b"/><stop offset="1" stop-color="#121923"/></linearGradient>
<style>text{font:13px Verdana,sans-serif;fill:#c7d1df}.tile{animation:lift 6s ease-in-out infinite;transform-origin:60px 50px}@keyframes lift{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-9px) rotate(1deg)}}@media(prefers-reduced-motion:reduce){.tile{animation:none}}</style></defs>
<rect width="1100" height="320" rx="16" fill="#0d1117"/>${tiles.join('')}</svg>`);
console.log('Generated design-motion.svg and tools-motion.svg with embedded vector logos.');
