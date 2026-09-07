import { readFile, writeFile } from 'node:fs/promises';

// A deliberately small, recruiter-friendly set. Keep this list honest and focused.
const disciplines = [
  {
    eyebrow: 'PRIMARY DISCIPLINE', title: 'Product Frontend',
    note: 'Turning visual systems into responsive, maintainable interfaces.', color: '#aebfff',
    tools: [['react', 'React'], ['nextjs', 'Next.js'], ['ts', 'TypeScript'], ['js', 'JavaScript'], ['tailwind', 'Tailwind'], ['html', 'HTML'], ['css', 'CSS']],
  },
  {
    eyebrow: 'DESIGN PRACTICE', title: 'UI / UX',
    note: 'Researching, composing and prototyping the experience.', color: '#d4b9f3',
    tools: [['figma', 'Figma'], ['framer', 'Framer'], ['photoshop', 'Photoshop']],
  },
  {
    eyebrow: 'SHIPPING FOUNDATION', title: 'Backend & workflow',
    note: 'The practical layer that helps ideas reach production.', color: '#a9ddc2',
    tools: [['nodejs', 'Node.js'], ['firebase', 'Firebase'], ['mysql', 'SQL'], ['git', 'Git'], ['github', 'GitHub']],
  },
];

const asset = name => new URL(`../assets/${name}`, import.meta.url);
const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[char]));

async function icon(name, x, y, size) {
  let source = await readFile(asset(`icons/${name}.svg`), 'utf8');
  source = source
    .replace(/id="([^"]+)"/g, (_, id) => `id="core-${name}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#core-${name}-${id})`)
    .replace(/<svg\b([^>]*)>/, (_, attributes) =>
      `<svg ${attributes.replace(/\s(?:width|height)="[^"]*"/g, '')} x="${x}" y="${y}" width="${size}" height="${size}">`);
  return source;
}

async function chip([name, label], x, y, width, delay) {
  return `<g transform="translate(${x} ${y})"><g class="tech" style="animation-delay:${delay}s">
    <rect width="${width}" height="47" rx="23.5" fill="#111821" stroke="#354150"/>
    ${await icon(name, 8, 7, 33)}
    <text x="50" y="29" class="tool">${escapeXml(label)}</text>
  </g></g>`;
}

const primaryWidths = [112, 122, 144, 142, 128, 104, 96];
let primaryX = 55;
const primaryChips = [];
for (let index = 0; index < disciplines[0].tools.length; index += 1) {
  if (index === 6) primaryX = 55;
  const width = primaryWidths[index];
  primaryChips.push(await chip(disciplines[0].tools[index], primaryX, index < 6 ? 214 : 265, width, -index * 0.45));
  primaryX += width + 11;
}

async function compactChips(discipline, startX, startY, widths) {
  const output = [];
  let x = startX;
  let y = startY;
  for (let index = 0; index < discipline.tools.length; index += 1) {
    const width = widths[index];
    if (x + width > startX + 365) { x = startX; y += 57; }
    output.push(await chip(discipline.tools[index], x, y, width, -index * 0.55));
    x += width + 10;
  }
  return output.join('');
}

const designChips = await compactChips(disciplines[1], 55, 444, [112, 118, 144]);
const supportChips = await compactChips(disciplines[2], 517, 444, [126, 132, 92, 88, 112]);
const description = disciplines.map(item => `${item.title}: ${item.tools.map(([, label]) => label).join(', ')}.`).join(' ');

await writeFile(asset('skills.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="590" viewBox="0 0 960 590" role="img" aria-labelledby="title desc">
<title id="title">POZAN — core skills</title><desc id="desc">${escapeXml(description)} No proficiency scores are implied.</desc>
<defs>
  <linearGradient id="background" x2="1" y2="1"><stop stop-color="#141a23"/><stop offset="1" stop-color="#090e14"/></linearGradient>
  <linearGradient id="primary" x2="1"><stop stop-color="#202a3a"/><stop offset="1" stop-color="#101620"/></linearGradient>
  <radialGradient id="glow"><stop stop-color="#9dafef" stop-opacity=".15"/><stop offset="1" stop-color="#9dafef" stop-opacity="0"/></radialGradient>
  <pattern id="grain" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#c8d2df" opacity=".09"/></pattern>
  <clipPath id="frame"><rect x="1" y="1" width="958" height="588" rx="18"/></clipPath>
  <style>text{fill:#edf1f7;font-family:Verdana,sans-serif}.display{font-family:Georgia,serif}.eyebrow{font:9px monospace;letter-spacing:2px}.note{font-size:11px;fill:#9eaaba}.tool{font-size:12px}.tech{animation:float 6s ease-in-out infinite}.trace{stroke-dasharray:90 1850;animation:trace 12s linear infinite}.pulse{animation:pulse 4s ease-in-out infinite}@keyframes float{50%{transform:translateY(-3px)}}@keyframes trace{to{stroke-dashoffset:-1940}}@keyframes pulse{50%{opacity:.3}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>
</defs>
<rect x="1" y="1" width="958" height="588" rx="18" fill="url(#background)" stroke="#313b48"/>
<g clip-path="url(#frame)"><rect width="960" height="590" fill="url(#grain)"/><ellipse cx="700" cy="75" rx="380" ry="210" fill="url(#glow)"/></g>
<text x="30" y="35" class="eyebrow" fill="#9eabc0">POZAN / CORE PRACTICE</text><text x="930" y="35" text-anchor="end" class="eyebrow" fill="#9eabc0">DEPTH OVER NOISE</text>
<text x="29" y="78" class="display" font-size="30">What I bring to the product.</text>
<rect x="29" y="104" width="902" height="213" rx="16" fill="url(#primary)" stroke="#3a4658"/><rect class="trace" x="30" y="105" width="900" height="211" rx="15" fill="none" stroke="${disciplines[0].color}"/>
<text x="55" y="137" class="eyebrow" style="fill:${disciplines[0].color}">01 / ${escapeXml(disciplines[0].eyebrow)}</text><text x="54" y="183" class="display" font-size="39">${escapeXml(disciplines[0].title)}</text>
<text x="905" y="140" text-anchor="end" class="note">${escapeXml(disciplines[0].note)}</text><circle class="pulse" cx="905" cy="173" r="4" fill="${disciplines[0].color}"/><path d="M749 173H894" stroke="${disciplines[0].color}" stroke-opacity=".28"/>
${primaryChips.join('')}
<rect x="29" y="337" width="440" height="220" rx="16" fill="#111720" stroke="#343e4b"/><text x="55" y="370" class="eyebrow" style="fill:${disciplines[1].color}">02 / ${escapeXml(disciplines[1].eyebrow)}</text><text x="54" y="405" class="display" font-size="29">${escapeXml(disciplines[1].title)}</text><text x="55" y="426" class="note">${escapeXml(disciplines[1].note)}</text>${designChips}
<rect x="491" y="337" width="440" height="220" rx="16" fill="#111720" stroke="#343e4b"/><text x="517" y="370" class="eyebrow" style="fill:${disciplines[2].color}">03 / ${escapeXml(disciplines[2].eyebrow)}</text><text x="516" y="405" class="display" font-size="29">${escapeXml(disciplines[2].title)}</text><text x="517" y="426" class="note">${escapeXml(disciplines[2].note)}</text>${supportChips}
</svg>`);

console.log('Generated a focused 15-skill profile at assets/skills.svg');
