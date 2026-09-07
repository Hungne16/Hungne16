const xml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const number = n => n == null ? '—' : new Intl.NumberFormat('en', {notation:'compact',maximumFractionDigits:1}).format(n);
export function renderMetrics({login,profile,repositories,languages,contributions,events,totalCommits}) {
 const weeks = contributions?.contributionCalendar?.weeks || [];
 const days = weeks.flatMap(w=>w.contributionDays);
 const stats = [
  ['PUBLIC COMMITS',number(totalCommits ?? contributions?.totalCommitContributions),totalCommits == null ? (contributions ? 'Last 12 months' : 'Currently unavailable') : 'GitHub commit search'],
  ['REPOSITORIES',number(profile.public_repos),'Public repositories'],
  ['STARS EARNED',profile.login ? number(repositories.reduce((n,r)=>n+r.stargazers_count,0)) : '—','Owned non-fork repositories'],
  ['FOLLOWERS',number(profile.followers),'GitHub community']
 ];
 const cards = stats.map(([label,val,note],i)=>{
  const x=42+i*283;
  return `<g><rect x="${x}" y="142" width="267" height="150" rx="16" fill="url(#panel)" stroke="#3c485b"/><circle cx="${x+213}" cy="187" r="24" fill="none" stroke="#303e53" stroke-width="3"/><circle class="orbit" style="transform-origin:${x+213}px 187px;animation-delay:-${i*2}s" cx="${x+213}" cy="187" r="24" fill="none" stroke="#a8bfff" stroke-width="2" stroke-dasharray="25 126"/><text x="${x+19}" y="171" class="mono">${label}</text><text x="${x+18}" y="232" class="value">${val}</text><text x="${x+19}" y="268" class="small">${note}</text></g>`;
 }).join('');
 const lang = languages.length ? languages.map((l,i)=>`<text x="665" y="${375+i*35}" class="small">${xml(l.name)}</text><text x="1130" y="${375+i*35}" text-anchor="end" class="small">${l.percent.toFixed(1)}%</text><rect x="665" y="${385+i*35}" width="466" height="5" rx="2" fill="#283347"/><rect class="bar" style="animation-delay:${i*.12}s" x="665" y="${385+i*35}" width="${Math.max(1,l.percent*4.66)}" height="5" rx="2" fill="${['#b9caff','#d0c3ed','#b3d9d0','#cbbda5','#b6bdc8'][i]}"/>`).join('') : '<text x="665" y="395" class="small">Language data unavailable</text>';
 const activity = events.slice(0,3).map((e,i)=>{
  const name=e.repo?.name || 'GitHub';
  const label=({PushEvent:'Pushed code',CreateEvent:'Created repository / branch',WatchEvent:'Starred a repository',PullRequestEvent:'Pull request activity'})[e.type] || e.type.replace(/Event$/,'');
  return `<circle class="pulse" cx="67" cy="${377+i*61}" r="3" fill="#b9caff"/><text x="83" y="${380+i*61}" class="small" style="fill:#e5eaf5">${xml(label)}</text><text x="83" y="${403+i*61}" class="small">${xml(name.length>53 ? name.slice(0,50)+'…' : name)}</text>`;
 }).join('') || '<text x="65" y="395" class="small">No recent public activity available</text>';
 const max=Math.max(1,...days.map(d=>d.contributionCount));
 const grid=weeks.slice(-54).map((w,c)=>w.contributionDays.map(d=>{
  const row=new Date(d.date+'T00:00:00Z').getUTCDay();
  const level=d.contributionCount ? Math.max(1,Math.ceil(d.contributionCount/max*4)) : 0;
  return `<rect x="${59+c*19.9}" y="${624+row*16}" width="13" height="11" rx="2" fill="${['#1c2634','#384963','#617ba5','#98afda','#d8e4ff'][level]}"><title>${xml(d.date)}: ${d.contributionCount} contributions</title></rect>`;
 }).join('')).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="780" viewBox="0 0 1200 780" role="img" aria-labelledby="title desc">
<title id="title">GitHub observatory — ${xml(login)}</title><desc id="desc">Public GitHub statistics. Dashed rings are decorative. Languages are percentages of fetched code bytes. Contribution cells show actual daily activity.</desc>
<defs><linearGradient id="panel" x2=".5" y2="1"><stop stop-color="#202c3e"/><stop offset="1" stop-color="#111923"/></linearGradient><linearGradient id="silver"><stop stop-color="#414f67"/><stop offset=".5" stop-color="#dee8f8"/><stop offset="1" stop-color="#414f67"/></linearGradient>
<style>text{fill:#e4ebf6;font-family:Verdana,sans-serif}.mono{font:11px monospace;letter-spacing:1.6px;fill:#a5b9d8}.small{font-size:12px;fill:#a6b3c7}.value{font-size:49px;letter-spacing:-2px}.orbit{animation:rotate 12s linear infinite}.pulse{animation:pulse 3s ease-in-out infinite}.bar{transform-box:fill-box;transform-origin:left;animation:grow 1.5s ease-out both}.trace{stroke-dasharray:140 2200;animation:trace 12s linear infinite}@keyframes rotate{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.3}}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes trace{to{stroke-dashoffset:-2340}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style></defs>
<rect width="1200" height="780" rx="22" fill="#0d1117"/><rect class="trace" x="14" y="14" width="1172" height="752" rx="17" fill="none" stroke="url(#silver)" stroke-width="1.5"/>
<text x="43" y="52" class="mono">POZAN / GITHUB OBSERVATORY</text><text x="41" y="105" style="font:43px Georgia,serif">The work leaves a trace.</text><circle class="pulse" cx="978" cy="53" r="4" fill="#c1d3f2"/><text x="995" y="58" class="mono">PUBLIC SIGNAL</text><text x="1158" y="97" text-anchor="end" class="small">${xml(login)} · ${new Date().toISOString().slice(0,10)}</text>
${cards}
<rect x="42" y="315" width="550" height="241" rx="16" fill="#111923" stroke="#303d50"/><text x="64" y="347" class="mono">RECENT TRANSMISSIONS</text>${activity}
<rect x="620" y="315" width="538" height="241" rx="16" fill="#111923" stroke="#303d50"/><text x="665" y="347" class="mono">LANGUAGE COMPOSITION / CODE BYTES</text>${lang}
<text x="44" y="599" class="mono">CONTRIBUTION CONSTELLATION / LAST 12 MONTHS</text><text x="1156" y="599" text-anchor="end" class="small">${number(contributions?.contributionCalendar?.totalContributions)} contributions</text>
${grid || '<text x="59" y="656" class="small">Contribution history is currently unavailable. It will return on a successful authenticated sync.</text>'}
<text x="44" y="753" class="small">GitHub API · updated daily · decorative motion does not represent additional activity</text>
</svg>`;
}
