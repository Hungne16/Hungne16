// Self-contained SVG scenes: no scripts, remote images or font downloads.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

const scenes = [
  `<ellipse cx="727" cy="267" rx="180" ry="18" fill="#000" opacity=".45"/>
  <g transform="translate(542 74) rotate(-8 150 85)"><g class="rear">
    <rect width="292" height="164" rx="10" fill="#121624" stroke="#555b81"/>
    <path d="M18 28H272M18 45H95V140H18ZM113 45H272V89H113ZM113 104H272V140H113Z" fill="none" stroke="#353c59"/>
    <text x="18" y="18" class="micro">01 / STRUCTURE</text>
  </g></g>
  <g transform="translate(565 87) rotate(5 148 90)"><g class="float">
    <rect x="0" y="7" width="299" height="174" rx="11" fill="#05070c"/>
    <rect width="299" height="174" rx="11" fill="url(#panel)" stroke="#929ac0"/>
    <path d="M0 25H299" stroke="#414760"/><g fill="#7f86a8"><circle cx="14" cy="13" r="2.5"/><circle cx="24" cy="13" r="2.5"/><circle cx="34" cy="13" r="2.5"/></g>
    <text x="48" y="17" class="micro">POZAN / DESIGN CANVAS</text>
    <text x="19" y="57" class="micro">DESIGN × CODE</text>
    <text x="17" y="91" class="serif" font-size="27">Make it</text><text x="17" y="124" class="serif" font-size="27" font-style="italic">memorable.</text>
    <path d="M20 144H119M20 152H87" stroke="#737c9a" stroke-width="2"/>
    <g transform="translate(220 96)"><g class="rotate"><ellipse rx="40" ry="50" fill="none" stroke="url(#metal)" stroke-width="13" transform="rotate(35)"/><ellipse rx="40" ry="50" fill="none" stroke="#cad0ff" stroke-width="1" transform="rotate(-40)"/></g></g>
    <g class="selection" stroke="#bcc3ff" fill="none"><rect x="13" y="65" width="169" height="68"/><path d="M10 62h6v6h-6zM179 62h6v6h-6zM10 130h6v6h-6zM179 130h6v6h-6z" fill="#cbd0ff"/></g>
  </g></g>
  <g transform="translate(769 229)"><g class="cursor"><path d="M0 0L6 25L12 16L22 12Z" fill="#e0e2ff" stroke="#0b0d18"/><rect x="17" y="20" width="69" height="24" rx="6" fill="#bbc2ff"/><text x="27" y="36" font-size="10" fill="#121626">POZAN</text></g></g>
  <g transform="translate(522 237)"><g class="rear"><rect width="132" height="38" rx="8" fill="#181b2b" stroke="#565e85"/><circle cx="17" cy="19" r="5" fill="#c4c9ff"/><text x="31" y="23" class="micro">IDEA → INTERFACE</text></g></g>`,
  `<ellipse cx="738" cy="271" rx="159" ry="17" fill="#000" opacity=".4"/>
  <g transform="translate(718 62) rotate(13 66 97)"><g class="rear"><rect width="133" height="189" rx="8" fill="#18352f" stroke="#4d8d7e"/><path d="M18 33H109M18 45H92M18 73H108M18 87H100M18 101H110M18 133H108M18 147H94" stroke="#5e8f80" stroke-width="3"/></g></g>
  <g transform="translate(611 61) rotate(-9 70 96)"><g class="float"><rect width="143" height="199" rx="8" fill="#142722" stroke="#8cc7b0"/><circle cx="29" cy="29" r="11" fill="#a9d8c2"/><path d="M49 23H120M49 35H94M22 62H120M22 74H106M22 104H120M22 117H112M22 130H94M22 159H120M22 172H109" stroke="#80a697" stroke-width="3"/></g></g>
  <g transform="translate(673 88)"><g class="paper">
    <rect x="5" y="7" width="141" height="187" rx="7" fill="#030b09" opacity=".7"/>
    <rect width="141" height="187" rx="7" fill="#e6eee7" stroke="#fff"/>
    <rect width="37" height="187" rx="7" fill="#b6d5c5"/><rect x="31" width="6" height="187" fill="#b6d5c5"/>
    <circle cx="18" cy="26" r="9" fill="#42695b"/><path d="M9 53H28M9 63H25M9 91H28M9 101H24M9 127H28M9 137H26" stroke="#608776" stroke-width="2"/>
    <text x="48" y="26" style="fill:#1e3c31;font:14px Georgia,serif">Your story.</text>
    <path d="M49 38H120" stroke="#839d8e" stroke-width="2"/>
    <g class="write" stroke="#597367" stroke-width="3"><path d="M49 60H124M49 72H110M49 84H120M49 112H124M49 124H115M49 136H121M49 163H110"/></g>
  </g></g>
  <g transform="translate(534 153)"><g class="rear"><rect width="98" height="76" rx="10" fill="#10251e" stroke="#528b72"/><text x="13" y="22" class="micro">TYPE / SPACE</text><text x="13" y="49" font-size="24" class="serif">Aa</text><circle cx="67" cy="43" r="7" fill="#9ec7b3"/><circle cx="83" cy="43" r="7" fill="#e6eee7"/><path d="M13 61H83" stroke="#568771"/></g></g>
  <g transform="translate(799 241)"><g class="float"><rect width="108" height="32" rx="16" fill="#203e31" stroke="#92c4a4"/><path d="M13 15l4 4 7-8" fill="none" stroke="#c6f5cd" stroke-width="2"/><text x="33" y="20" class="micro">COMPOSED</text></g></g>`,
  `<path d="M527 265H906M551 248H881M577 233H855M600 220H832M620 209H812M648 194L570 280M690 194L669 280M735 194L768 280M777 194L868 280" fill="none" stroke="#8a6242" opacity=".22"/>
  <g transform="translate(572 67)"><g class="float">
    <path d="M16 108L49 52Q53 46 65 46H225Q237 46 242 55L269 108L278 121V174H7V121Z" fill="url(#panel)" stroke="#be9673"/>
    <path d="M48 103L71 57H216L239 103Z" fill="#070e15" stroke="#63727a"/><path d="M147 59V100" stroke="#35404a"/>
    <path d="M29 116H81L87 132H24ZM208 116H253L259 132H202Z" fill="#ecd8ae"/>
    <path d="M86 156H202M92 162H196" stroke="#776e66" stroke-width="3"/>
    <rect x="17" y="170" width="39" height="25" rx="8" fill="#05080c" stroke="#4e5158"/><rect x="231" y="170" width="39" height="25" rx="8" fill="#05080c" stroke="#4e5158"/>
    <rect x="102" y="130" width="83" height="24" rx="3" fill="#f3dcc0"/><text x="143" y="147" text-anchor="middle" style="fill:#252523;font:13px monospace;letter-spacing:2px">POZAN</text>
    <path class="target" d="M96 137V125H110M178 125H191V137M96 148V159H110M178 159H191V148" fill="none" stroke="#ffc890" stroke-width="2"/>
  </g></g>
  <g clip-path="url(#scan-clip)"><g class="scanner"><rect x="553" y="64" width="324" height="30" fill="url(#scan)"/><path d="M553 94H877" stroke="#ffd2a0" stroke-width="1.5"/></g></g>
  <g transform="translate(795 58)"><g class="rear"><rect width="112" height="59" rx="8" fill="#231b17" stroke="#98704e"/><text x="12" y="21" class="micro">OCR / PREVIEW</text><text x="12" y="43" font-size="16" style="font-family:monospace;letter-spacing:2px">POZAN</text></g></g>
  <path class="data" d="M765 204H892V126" fill="none" stroke="#d9a878" stroke-dasharray="3 6"/>
  <text x="533" y="289" class="micro">FRAME 001</text><text x="908" y="289" text-anchor="end" class="micro">SCAN → EXTRACT</text>`
];

export function renderProject(project, index) {
  const subtitle = ['A little art. A lot of code.', 'A new frame for your story.', 'Finding meaning in pixels.'][index];
  const description = ['A personal space for design and development.', 'CV templates. Carefully composed.', 'A vehicle OCR data extraction experiment.'][index];
  const large = ['PORTFOLIO', 'CV PILOT', 'VEHICLE OCR'][index];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="330" viewBox="0 0 960 330" role="img" aria-labelledby="title desc">
<title id="title">${escape(project.title)}</title><desc id="desc">${escape(description)} Animated illustration; open the repository using the surrounding link.</desc>
<defs>
  <linearGradient id="background" x2="1" y2=".6"><stop stop-color="#10151d"/><stop offset="1" stop-color="#090e14"/></linearGradient>
  <radialGradient id="halo"><stop stop-color="${project.accent}" stop-opacity=".15"/><stop offset="1" stop-color="${project.accent}" stop-opacity="0"/></radialGradient>
  <linearGradient id="panel" x2=".5" y2="1"><stop stop-color="#313844"/><stop offset="1" stop-color="#121922"/></linearGradient>
  <linearGradient id="metal" x2="1" y2="1"><stop stop-color="#545984"/><stop offset=".3" stop-color="#e2e4ff"/><stop offset=".55" stop-color="#727aab"/><stop offset=".8" stop-color="#d9ddff"/><stop offset="1" stop-color="#474c70"/></linearGradient>
  <linearGradient id="scan" x2="0" y2="1"><stop stop-color="#ffd2a0" stop-opacity="0"/><stop offset="1" stop-color="#ffd2a0" stop-opacity=".18"/></linearGradient>
  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${project.accent}" stroke-opacity=".05"/></pattern>
  <clipPath id="frame"><rect x="1" y="1" width="958" height="328" rx="18"/></clipPath>
  <clipPath id="scan-clip"><rect x="553" y="90" width="324" height="163"/></clipPath>
  <style>
    text{fill:#edf0f5;font-family:Verdana,sans-serif}.micro{font:9px monospace;letter-spacing:1px;fill:${project.accent}}.serif{font-family:Georgia,serif}
    .float{animation:float 7s ease-in-out infinite}.rear{animation:rear 7s ease-in-out infinite}.paper{animation:paper 8s ease-in-out infinite}.rotate{animation:rotate 22s linear infinite}.cursor{animation:cursor 7s ease-in-out infinite}.selection{animation:select 7s ease-in-out infinite}.scanner{animation:scan 5s ease-in-out infinite}.write{stroke-dasharray:80;animation:write 8s ease-in-out infinite}.target{animation:select 5s ease-in-out infinite}.data{animation:data 3s linear infinite}.edge{stroke-dasharray:100 2500;animation:edge 14s linear infinite}
    @keyframes float{50%{transform:translate(0,-8px)}}@keyframes rear{50%{transform:translate(-5px,6px)}}@keyframes paper{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-11px)}}@keyframes rotate{to{transform:rotate(360deg)}}@keyframes cursor{0%,100%{transform:translate(0,0)}35%,65%{transform:translate(-67px,-47px)}}@keyframes select{0%,100%{opacity:.25}40%,70%{opacity:1}}@keyframes scan{0%,100%{transform:translateY(0)}50%{transform:translateY(152px)}}@keyframes write{0%,10%{stroke-dashoffset:80}55%,100%{stroke-dashoffset:0}}@keyframes data{to{stroke-dashoffset:-54}}@keyframes edge{to{stroke-dashoffset:-2600}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important}.scanner{transform:translateY(95px)}}
  </style>
</defs>
<rect x="1" y="1" width="958" height="328" rx="18" fill="url(#background)" stroke="#303943"/>
<g clip-path="url(#frame)"><rect x="477" width="483" height="330" fill="url(#grid)"/><ellipse cx="727" cy="165" rx="269" ry="209" fill="url(#halo)"/>
<text x="890" y="88" font-size="91" class="serif" fill="${project.accent}" opacity=".06">${index+1}</text>
${scenes[index]}</g>
<path d="M484 39V291" stroke="#333d49" stroke-dasharray="2 7"/>
<text x="35" y="39" class="micro" style="letter-spacing:2px">0${index+1} / SELECTED WORK</text>
<text x="35" y="103" font-size="42" class="serif" style="letter-spacing:-1px">${large}</text>
<text x="36" y="141" font-size="22" class="serif" font-style="italic" style="fill:${project.accent}">${subtitle}</text>
<text x="37" y="183" font-size="12" style="fill:#a5afbd">${description}</text>
<text x="37" y="215" class="micro">${escape(project.tag)}</text>
<rect x="35" y="253" width="169" height="40" rx="20" fill="${project.accent}" fill-opacity=".08" stroke="${project.accent}" stroke-opacity=".45"/>
<text x="53" y="278" font-size="11" style="letter-spacing:1px">EXPLORE SOURCE</text><path d="M178 278l8-8m-8 0h8v8" fill="none" stroke="${project.accent}" stroke-width="1.5"/>
<text x="445" y="278" text-anchor="end" class="micro">POZAN ↗</text>
<rect class="edge" x="2" y="2" width="956" height="326" rx="17" fill="none" stroke="${project.accent}" stroke-opacity=".5"/>
</svg>`;
}
