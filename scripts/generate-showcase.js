import { readFile, writeFile } from 'node:fs/promises';
const asset = name => new URL('../assets/' + name, import.meta.url);
const png = (await readFile(asset('artist-banner.png'))).toString('base64');
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" viewBox="0 0 1200 650" role="img" aria-labelledby="t d">
<title id="t">POZAN — where human imagination meets code</title><desc id="d">Sculptural hands float toward a pulsing star, with orbital light and a moving scan line. Monochrome digital artwork.</desc>
<defs>
<image id="art" width="1200" height="600" href="data:image/png;base64,${png}"/>
<clipPath id="left"><rect width="599" height="600"/></clipPath><clipPath id="right"><rect x="599" width="601" height="600"/></clipPath>
<radialGradient id="light"><stop stop-color="#e7eeff" stop-opacity=".28"/><stop offset="1" stop-color="#e7eeff" stop-opacity="0"/></radialGradient>
<linearGradient id="fade" x2="0" y2="1"><stop offset=".65" stop-color="#0d1117" stop-opacity="0"/><stop offset="1" stop-color="#0d1117"/></linearGradient>
<linearGradient id="scan" x2="0" y2="1"><stop stop-color="#d6e6ff" stop-opacity="0"/><stop offset=".5" stop-color="#d6e6ff" stop-opacity=".07"/><stop offset="1" stop-color="#d6e6ff" stop-opacity="0"/></linearGradient>
<style>text{fill:#dce4ef;font-family:monospace}.left{animation:left 9s ease-in-out infinite}.right{animation:right 9s ease-in-out infinite}.orbit{transform-origin:612px 320px;animation:orbit 30s linear infinite}.breathe{animation:breathe 4.5s ease-in-out infinite}.scan{animation:scan 10s linear infinite}.signal{stroke-dasharray:3 17;animation:signal 6s linear infinite}
@keyframes left{50%{transform:translate(8px,-5px)}}@keyframes right{50%{transform:translate(-8px,5px)}}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes breathe{50%{opacity:.3}}@keyframes scan{from{transform:translateY(-400px)}to{transform:translateY(350px)}}@keyframes signal{to{stroke-dashoffset:-120}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}.scan{display:none}}
</style></defs>
<rect width="1200" height="650" rx="18" fill="#0d1117"/>
<g class="left"><use href="#art" clip-path="url(#left)"/></g><g class="right"><use href="#art" clip-path="url(#right)"/></g>
<rect width="1200" height="600" fill="url(#fade)"/>
<g opacity=".65"><ellipse cx="612" cy="320" rx="145" ry="42" fill="none" stroke="#8496b2" stroke-width=".7" transform="rotate(-27 612 320)"/><ellipse cx="612" cy="320" rx="105" ry="163" fill="none" stroke="#8496b2" stroke-width=".6" stroke-dasharray="1 9" transform="rotate(35 612 320)"/></g>
<g class="orbit"><circle cx="612" cy="320" r="138" fill="none" stroke="#b9c5d7" stroke-opacity=".2" stroke-dasharray="60 808"/><circle cx="750" cy="320" r="3" fill="#ebf2ff"/></g>
<ellipse class="breathe" cx="612" cy="320" rx="155" ry="125" fill="url(#light)"/>
<path class="breathe" d="M612 296L617 315L636 320L617 325L612 344L607 325L588 320L607 315Z" fill="#edf2fa"/>
<rect class="scan" x="25" y="270" width="1150" height="65" fill="url(#scan)"/>
<path d="M34 75V34H75M1125 34H1166V75M34 558V598H75M1125 598H1166V558" fill="none" stroke="#657082"/>
<text x="52" y="66" font-size="11" letter-spacing="3">POZAN / HUMAN INPUT · DIGITAL OUTPUT</text>
<text x="1148" y="66" text-anchor="end" font-size="10" letter-spacing="2">ART STUDY 001</text>
<text x="600" y="532" text-anchor="middle" font-size="64" style="font-family:Georgia,serif;letter-spacing:13px">POZAN</text>
<text x="600" y="568" text-anchor="middle" font-size="12" letter-spacing="3">SOMEWHERE BETWEEN INSTINCT &amp; INTERFACE</text>
<path class="signal" d="M290 609H910" stroke="#c7d4e9" stroke-width="1"/>
</svg>`;
await writeFile(asset('artist-motion.svg'), hero);

// Actual public repositories; descriptions deliberately avoid unverified features.
const projects = [
 {slug:'portfoliobyPozan',title:'Portfolio by Pozan',tag:'PERSONAL / TYPESCRIPT',desc:'A personal space for design and development.',accent:'#a5b9fa'},
 {slug:'CV-pilot',title:'CV Pilot',tag:'PRODUCT / CV TEMPLATES',desc:'CV templates inspired by universities and companies.',accent:'#b5e6d0'},
 {slug:'vehicle-ocr-data-extractor',title:'Vehicle OCR',tag:'EXPERIMENT / JAVASCRIPT',desc:'Explore the source of this OCR project.',accent:'#edc6a5'}
];
for (const [i,p] of projects.entries()) {
 const graphic = i===0 ? '<rect x="44" y="66" width="248" height="149" rx="8" fill="#1d2633" stroke="#65718a"/><path d="M44 89H292" stroke="#65718a"/><text x="62" y="131" font-size="26" font-family="Georgia">POZAN</text><path d="M63 151H186M63 162H148" stroke="#8c98ac"/><rect x="215" y="114" width="52" height="75" rx="24" fill="none" stroke="'+p.accent+'" stroke-width="9"/>' :
 i===1 ? '<rect x="115" y="40" width="139" height="175" rx="8" fill="#263a37" stroke="#80a79b" transform="rotate(12 185 130)"/><rect x="78" y="45" width="139" height="175" rx="8" fill="#18242b" stroke="#a4b4c4" transform="rotate(-7 147 132)"/><circle cx="112" cy="78" r="12" fill="'+p.accent+'"/><path d="M137 73H193M137 84H181M100 112H192M100 128H184M100 144H193M100 174H161M100 190H177" stroke="#c2d1ce" stroke-width="3"/>' :
 '<path d="M62 101L88 68H231L263 102V168H62Z" fill="#2e3035" stroke="#b9a28e"/><path d="M85 101L104 80H218L239 101Z" fill="#111923"/><circle cx="96" cy="161" r="19" fill="#111923" stroke="#93a0b1"/><circle cx="230" cy="161" r="19" fill="#111923" stroke="#93a0b1"/><rect x="121" y="116" width="84" height="25" rx="4" fill="'+p.accent+'"/><text x="131" y="134" style="fill:#171c25;font-size:14px">OCR / 01</text><path class="scan" d="M42 60H282" stroke="'+p.accent+'" stroke-width="2"/>';
 await writeFile(asset('project-'+(i+1)+'.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="385" viewBox="0 0 340 385" role="img" aria-label="${p.title}: ${p.desc}">
<defs><linearGradient id="bg" x2=".8" y2="1"><stop stop-color="#212b3a"/><stop offset="1" stop-color="#0e141e"/></linearGradient><style>text{fill:#e5eaf3;font-family:Verdana,sans-serif}.art{transform-origin:170px 130px;animation:float 7s ease-in-out infinite}.scan{animation:scan 4s ease-in-out infinite}.edge{stroke-dasharray:90 1350;animation:edge 10s linear infinite}@keyframes float{50%{transform:translateY(-7px) rotate(2deg)}}@keyframes scan{50%{transform:translateY(135px)}}@keyframes edge{to{stroke-dashoffset:-1440}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style></defs>
<rect x="1" y="1" width="338" height="383" rx="18" fill="url(#bg)" stroke="#384457"/><rect class="edge" x="2" y="2" width="336" height="381" rx="18" fill="none" stroke="${p.accent}" stroke-width="2"/>
<text x="22" y="31" font-size="10" letter-spacing="2">0${i+1} / SELECTED REPOSITORY</text><g class="art">${graphic}</g>
<path d="M23 237H317" stroke="#394557"/><text x="23" y="263" font-size="10" letter-spacing="1" style="fill:${p.accent}">${p.tag}</text><text x="23" y="298" font-size="24">${p.title}</text><text x="23" y="327" font-size="11" style="fill:#aab6c8">Explore the project &amp; source code.</text><text x="23" y="361" font-size="12">OPEN REPOSITORY ↗</text>
</svg>`);
}
console.log('Created animated artwork and three repository covers.');
