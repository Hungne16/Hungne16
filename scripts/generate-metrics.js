import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.github.com';
const GRAPHQL_API = 'https://api.github.com/graphql';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const repositoryOwner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const username = process.env.PROFILE_USERNAME || process.env.GITHUB_REPOSITORY_OWNER || repositoryOwner;
const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/metrics.svg');

const warnings = [];
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'github-profile-metrics-generator',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function compactNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);
}

function formatEvent(type) {
  const labels = {
    CreateEvent: 'Created a repository or branch',
    ForkEvent: 'Forked a repository',
    IssuesEvent: 'Worked on an issue',
    IssueCommentEvent: 'Joined an issue discussion',
    PullRequestEvent: 'Updated a pull request',
    PullRequestReviewEvent: 'Reviewed a pull request',
    PushEvent: 'Pushed new code',
    ReleaseEvent: 'Published a release',
    WatchEvent: 'Starred a repository',
  };
  return labels[type] || type.replace(/Event$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
}

async function requestJson(url, options = {}, fallback = null, label = url) {
  try {
    const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    warnings.push(`${label}: ${error.message}`);
    return fallback;
  }
}

async function getRepositories(login) {
  const repositories = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await requestJson(
      `${API}/users/${encodeURIComponent(login)}/repos?type=owner&sort=updated&per_page=100&page=${page}`,
      {}, [], `repositories page ${page}`,
    );
    repositories.push(...batch.filter((repo) => !repo.fork));
    if (batch.length < 100) break;
  }
  return repositories;
}

async function getLanguages(repositories) {
  const totals = new Map();
  const candidates = repositories
    .filter((repo) => repo.languages_url)
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 50);

  const batches = [];
  for (let index = 0; index < candidates.length; index += 8) {
    const group = candidates.slice(index, index + 8);
    batches.push(await Promise.all(group.map((repo) => requestJson(repo.languages_url, {}, {}, `languages for ${repo.name}`))));
  }
  for (const batch of batches) {
    for (const languages of batch) {
      for (const [language, bytes] of Object.entries(languages)) {
        totals.set(language, (totals.get(language) || 0) + bytes);
      }
    }
  }
  const totalBytes = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0);
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, percent: totalBytes ? (bytes / totalBytes) * 100 : 0 }));
}

async function getContributionData(login) {
  if (!token) return null;
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){totalCommitContributions contributionCalendar{totalContributions weeks{contributionDays{contributionCount date}}}}}}`;
  const result = await requestJson(GRAPHQL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login, from: from.toISOString(), to: to.toISOString() } }),
  }, null, 'contribution calendar');
  if (result?.errors?.length) {
    warnings.push(`contribution calendar: ${result.errors[0].message}`);
    return null;
  }
  return result?.data?.user?.contributionsCollection || null;
}

function contributionGrid(weeks) {
  if (!weeks.length) {
    return '<text class="muted" x="60" y="500" font-size="14">Contribution calendar becomes available when GITHUB_TOKEN is present.</text>';
  }
  const days = weeks.flatMap((week) => week.contributionDays);
  const max = Math.max(...days.map((day) => day.contributionCount), 1);
  return weeks.slice(-54).map((week, column) => week.contributionDays.map((day) => {
    const row = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    const level = day.contributionCount === 0 ? 0 : Math.max(1, Math.ceil((day.contributionCount / max) * 4));
    return `<rect class="level-${level}" x="${60 + column * 19}" y="${478 + row * 19}" width="13" height="13" rx="3"><title>${escapeXml(day.date)}: ${day.contributionCount} contributions</title></rect>`;
  }).join('')).join('');
}

function languageBars(languages) {
  if (!languages.length) return '<text class="muted" x="654" y="335" font-size="14">Language data will appear after the first update.</text>';
  const colors = ['#67e8f9', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];
  return languages.map((language, index) => {
    const y = 315 + index * 27;
    const width = Math.max(4, Math.round(language.percent * 4.5));
    return `<g><text class="label" x="654" y="${y}" font-size="13">${escapeXml(language.name)}</text><text class="muted" x="1110" y="${y}" font-size="12" text-anchor="end">${language.percent.toFixed(1)}%</text><rect class="track" x="654" y="${y + 7}" width="456" height="5" rx="2.5"/><rect x="654" y="${y + 7}" width="${width}" height="5" rx="2.5" fill="${colors[index]}"><animate attributeName="width" from="0" to="${width}" dur=".8s" fill="freeze"/></rect></g>`;
  }).join('');
}

function recentActivity(events) {
  if (!events.length) return '<text class="muted" x="60" y="335" font-size="14">Recent public activity will appear here.</text>';
  return events.slice(0, 3).map((event, index) => {
    const y = 328 + index * 48;
    const repo = event.repo?.name || 'GitHub';
    const date = event.created_at ? new Date(event.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '';
    return `<circle cx="66" cy="${y - 5}" r="4" fill="#8b5cf6"/><text class="label" x="82" y="${y}" font-size="14">${escapeXml(formatEvent(event.type))}</text><text class="muted" x="82" y="${y + 19}" font-size="12">${escapeXml(repo)}</text><text class="muted" x="572" y="${y}" font-size="12" text-anchor="end">${escapeXml(date)}</text>`;
  }).join('');
}

function buildSvg(data) {
  const { login, profile, repositories, languages, contributions, events, totalCommits } = data;
  const stars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalContributions = contributions?.contributionCalendar?.totalContributions ?? 0;
  const commitCount = totalCommits ?? contributions?.totalCommitContributions ?? 0;
  const weeks = contributions?.contributionCalendar?.weeks || [];
  const cards = [
    ['COMMITS', compactNumber(commitCount), totalCommits === null ? 'last 12 months' : 'public history'],
    ['REPOSITORIES', compactNumber(profile.public_repos || repositories.length), 'public work'],
    ['STARS EARNED', compactNumber(stars), 'across repositories'],
    ['FOLLOWERS', compactNumber(profile.followers), 'GitHub community'],
  ];
  const cardMarkup = cards.map(([label, value, note], index) => {
    const x = 48 + index * 282;
    return `<g><rect class="card" x="${x}" y="115" width="258" height="112" rx="15"/><text class="eyebrow" x="${x + 20}" y="145">${label}</text><text class="value" x="${x + 20}" y="184">${value}</text><text class="muted" x="${x + 20}" y="207" font-size="12">${note}</text></g>`;
  }).join('');
  const updated = new Date().toISOString().slice(0, 10);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" viewBox="0 0 1200 650" role="img" aria-labelledby="title desc">
  <title id="title">GitHub metrics for ${escapeXml(login)}</title><desc id="desc">Repository, star, follower, language, recent activity, and contribution statistics generated from the GitHub API.</desc>
  <defs><linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="#67e8f9"/><stop offset=".52" stop-color="#a78bfa"/><stop offset="1" stop-color="#f472b6"/><animate attributeName="x1" values="-.3;.2;-.3" dur="10s" repeatCount="indefinite"/><animate attributeName="x2" values=".7;1.2;.7" dur="10s" repeatCount="indefinite"/></linearGradient><linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1020"/><stop offset="1" stop-color="#10182b"/></linearGradient><style>text{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}.bg{fill:url(#surface)}.card{fill:#111a2d;stroke:#27334c}.panel{fill:#0e1628;stroke:#27334c}.title,.value,.label{fill:#f1f5f9}.muted{fill:#91a0b8}.eyebrow{fill:#9ca9be;font-size:11px;letter-spacing:1.4px}.value{font-size:30px;font-weight:700}.track{fill:#202c43}.level-0{fill:#172136}.level-1{fill:#263b67}.level-2{fill:#4f46a5}.level-3{fill:#7c5ce0}.level-4{fill:#a78bfa}@media(prefers-color-scheme:light){.bg{fill:#f8fafc}.card,.panel{fill:#fff;stroke:#d8e0eb}.title,.value,.label{fill:#152033}.muted,.eyebrow{fill:#5c6b80}.track,.level-0{fill:#e7ecf3}.level-1{fill:#ddd6fe}.level-2{fill:#c4b5fd}.level-3{fill:#a78bfa}.level-4{fill:#7c3aed}}</style></defs>
  <rect class="bg" width="1200" height="650" rx="20"/><rect x="0" y="0" width="1200" height="4" rx="2" fill="url(#accent)"/>
  <text class="title" x="48" y="58" font-size="23" font-weight="700">GITHUB SIGNAL</text><text class="muted" x="48" y="82" font-size="13">@${escapeXml(login)} / public activity</text><text class="muted" x="1152" y="64" font-size="12" text-anchor="end">UPDATED ${updated}</text>
  ${cardMarkup}
  <rect class="panel" x="48" y="251" width="548" height="187" rx="15"/><text class="eyebrow" x="66" y="282">RECENT ACTIVITY</text>${recentActivity(events)}
  <rect class="panel" x="620" y="251" width="532" height="187" rx="15"/><text class="eyebrow" x="654" y="282">TOP LANGUAGES BY CODE SIZE</text>${languageBars(languages)}
  <text class="eyebrow" x="48" y="466">CONTRIBUTIONS · LAST 12 MONTHS</text><text class="muted" x="1152" y="466" font-size="12" text-anchor="end">${compactNumber(totalContributions)} TOTAL</text>${contributionGrid(weeks)}
</svg>\n`;
}

async function main() {
  if (!username) {
    warnings.push('No username detected; using preview data. Set PROFILE_USERNAME locally or run in GitHub Actions.');
  }
  const login = username || 'your-username';
  const profile = username ? await requestJson(`${API}/users/${encodeURIComponent(login)}`, {}, {}, 'profile') : {};
  const repositories = username ? await getRepositories(login) : [];
  const [languages, contributions, events, commitSearch] = await Promise.all([
    username ? getLanguages(repositories) : [],
    username ? getContributionData(login) : null,
    username ? requestJson(`${API}/users/${encodeURIComponent(login)}/events/public?per_page=10`, {}, [], 'recent activity') : [],
    username && token ? requestJson(`${API}/search/commits?q=author:${encodeURIComponent(login)}&per_page=1`, {}, null, 'commit search') : null,
  ]);
  const svg = buildSvg({ login, profile, repositories, languages, contributions, events, totalCommits: commitSearch?.total_count ?? null });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, svg, 'utf8');
  console.log(`Generated ${outputPath} for @${login}`);
  if (warnings.length) console.warn(`Completed with ${warnings.length} non-fatal warning(s):\n- ${warnings.join('\n- ')}`);
}

main().catch((error) => {
  console.error(`Unable to generate metrics: ${error.stack || error.message}`);
  process.exitCode = 1;
});
