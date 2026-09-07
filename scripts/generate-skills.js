import { readFile, writeFile } from 'node:fs/promises';

// Edit these groups to match your own skills. No inferred proficiency scores.
const groups = [
  { title: 'Frontend engineering', note: 'Interfaces for the web', color: '#9ec8ff',
    tools: [['react', 'React'], ['nextjs', 'Next.js'], ['ts', 'TypeScript'], ['js', 'JavaScript'], ['html', 'HTML'], ['css', 'CSS'], ['tailwind', 'Tailwind CSS'], ['bootstrap', 'Bootstrap'], ['php', 'PHP']] },
  { title: 'UI / UX & design', note: 'From idea to prototype', color: '#d2bcf5',
    tools: [['figma', 'Figma'], ['framer', 'Framer'], ['canva', 'Canva'], ['photoshop', 'Photoshop'], ['blender', 'Blender'], ['affinity', 'Affinity']] },
  { title: 'Backend & data', note: 'Behind the interface', color: '#b2dfc5',
    tools: [['nodejs', 'Node.js'], ['firebase', 'Firebase'], ['mysql', 'SQL'], ['python', 'Python'], ['mongodb', 'MongoDB'], ['supabase', 'Supabase']] },
  { title: 'Systems & DevOps', note: 'Services, cloud, containers', color: '#efcd8c',
    tools: [['laravel', 'Laravel'], ['golang', 'Go'], ['aws', 'AWS'], ['docker', 'Docker']] },
  { title: 'Version control', note: 'Build, track, collaborate', color: '#edc09d',
    tools: [['git', 'Git'], ['github', 'GitHub'], ['gitlab', 'GitLab']] },
];
const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const asset = name => new URL(`../assets/${name}`, import.meta.url);
async function icon(name) {
  const source = await readFile(asset(`icons/${name}.svg`), 'utf8');
  return source.replace(/id="([^"]+)"/g, (_, id) => `id="skill-${name}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#skill-${name}-${id})`)
    .replace(/<svg\b([^>]*)>/, (_, attributes) => `<svg ${attributes.replace(/\s(?:width|height)="[^"]*"/g, '')} x="12" y="9" width="28" height="28">`);
}
let y = 100;
const rows = [];
for (const [index, group] of groups.entries()) {
  const tiles = await Promise.all(group.tools.map(async ([name, label], i) => {
    const x = 320 + (i % 3) * 198;
    const top = y + 18 + Math.floor(i / 3) * 54;
    return `<g transform="translate(${x} ${top})">
      <rect width="184" height="46" rx="9" fill="#151d27" stroke="#33404f"/>
      ${await icon(name)}<text x="51" y="28" class="tool">${xml(label)}</text>
      <path d="M155 21l4 4 7-7" stroke="${group.color}" fill="none" stroke-width="1.5" opacity=".65"/>
    </g>`;
  }));
  rows.push(`<g><path d="M32 ${y}H928" stroke="#2a3441"/>
    <text x="33" y="${y+32}" class="number" style="fill:${group.color}">0${index+1}</text>
    <text x="66" y="${y+32}" class="heading">${xml(group.title)}</text>
    <text x="66" y="${y+56}" class="note">${xml(group.note)}</text>
    <path d="M66 ${y+74}H262" stroke="${group.color}" stroke-opacity=".14"/>
    <path class="signal" style="animation-delay:-${index*1.4}s" d="M66 ${y+74}H262" stroke="${group.color}" stroke-opacity=".7" stroke-dasharray="22 174"/>
    ${tiles.join('')}</g>`);
  y += Math.max(100, 36 + Math.ceil(group.tools.length / 3) * 54);
}
const height = y + 46;
const description = groups.map(group => `${group.title}: ${group.tools.map(([, label]) => label).join(', ')}.`).join(' ');
await writeFile(asset('skills.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${height}" viewBox="0 0 960 ${height}" role="img" aria-labelledby="title desc">
<title id="title">POZAN — skills by discipline</title>
<desc id="desc">${xml(description)} Decorative animation does not represent proficiency scores.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#141b25"/><stop offset="1" stop-color="#0c1118"/></linearGradient>
<style>text{fill:#e7edf5;font-family:Verdana,sans-serif}.heading{font-size:17px}.note{font-size:11px;fill:#a3b0c1}.number{font:11px monospace;letter-spacing:1px}.tool{font-size:13px}.signal{animation:flow 7s linear infinite}@keyframes flow{to{stroke-dashoffset:-196}}@media(prefers-reduced-motion:reduce){.signal{animation:none}}</style></defs>
<rect x="1" y="1" width="958" height="${height - 2}" rx="18" fill="url(#bg)" stroke="#303b49"/>
<text x="33" y="34" class="number" style="fill:#a5b5c9">POZAN / CAPABILITIES</text>
<text x="32" y="76" style="font:32px Georgia,serif">The skills behind the craft.</text>
<text x="927" y="34" text-anchor="end" class="number" style="fill:#a5b5c9">DESIGN × DEVELOPMENT</text>
${rows.join('')}
<path d="M32 ${y+6}H928" stroke="#2a3441"/><text x="33" y="${y+30}" class="note">From visual ideas to working interfaces.</text>
</svg>`);
console.log('Generated assets/skills.svg');
