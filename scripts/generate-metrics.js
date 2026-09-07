import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMetrics } from './render-metrics.js';

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
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000), headers: { ...headers, ...options.headers } });
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
    username ? requestJson(`${API}/search/commits?q=author:${encodeURIComponent(login)}&per_page=1`, {}, null, 'commit search') : null,
  ]);
  const svg = renderMetrics({ login, profile, repositories, languages, contributions, events, totalCommits: commitSearch?.total_count ?? null });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, svg, 'utf8');
  console.log(`Generated ${outputPath} for @${login}`);
  if (warnings.length) console.warn(`Completed with ${warnings.length} non-fatal warning(s):\n- ${warnings.join('\n- ')}`);
}

main().catch((error) => {
  console.error(`Unable to generate metrics: ${error.stack || error.message}`);
  process.exitCode = 1;
});
