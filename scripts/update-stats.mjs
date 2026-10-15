// ============================================================
//  Fetch live GitHub stats -> data/stats.json -> regenerate SVG
//  Usage:  node scripts/update-stats.mjs
//  Env:    GITHUB_TOKEN (optional, provided by Actions),
//          GH_USER (defaults to beingDurgesh)
// ============================================================
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const USER = process.env.GH_USER || "beingDurgesh";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const H = {
  "User-Agent": "beingDurgesh-readme-stats",
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const LANG_COLORS = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", "C++": "#f34b7d",
  C: "#8a8a8a", Rust: "#dea584", Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B", Shell: "#89e051", Go: "#00ADD8", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", "C#": "#178600", Dart: "#00B4AB", PHP: "#4F5D95",
  Lua: "#000080", Makefile: "#427819", Batchfile: "#C1F12E",
};

async function jget(url) {
  const res = await fetch(url, { headers: H });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function warn(msg) { console.log(`::warning::${msg}`); }

async function fetchUser() {
  const u = await jget(`https://api.github.com/users/${USER}`);
  return { repos: u.public_repos ?? 0, followers: u.followers ?? 0, following: u.following ?? 0 };
}

async function fetchCommits() {
  const s = await jget(`https://api.github.com/search/commits?q=author:${USER}&per_page=1`);
  return typeof s.total_count === "number" ? s.total_count : null;
}

async function fetchLanguages() {
  const repos = await jget(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`);
  const usable = repos.filter((r) => !r.fork && !r.archived).slice(0, 20);
  const totals = {};
  for (const r of usable) {
    try {
      const langs = await jget(`https://api.github.com/repos/${USER}/${r.name}/languages`);
      for (const [k, v] of Object.entries(langs)) totals[k] = (totals[k] || 0) + v;
    } catch { /* skip repo */ }
  }
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const grand = entries.reduce((a, [, v]) => a + v, 0);
  if (!grand) return null;
  const top = entries.slice(0, 5).map(([name, v]) => ({
    name,
    color: LANG_COLORS[name] || "#6b7899",
    pct: Math.round((v / grand) * 1000) / 10,
  }));
  const restPct = Math.round((100 - top.reduce((a, b) => a + b.pct, 0)) * 10) / 10;
  if (restPct > 1) top.push({ name: "Other", color: "#6b7899", pct: restPct });
  return top;
}

async function fetchStreak() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": "beingDurgesh-readme-stats", Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for contributions page`);
  const html = await res.text();
  const days = [];
  for (const chunk of html.split("<td")) {
    const d = chunk.match(/data-date="(\d{4}-\d{2}-\d{2})"/);
    const l = chunk.match(/data-level="(\d)"/);
    if (d && l) days.push({ d: d[1], l: parseInt(l[1], 10) });
  }
  if (!days.length) throw new Error("no contribution cells parsed");
  const year = days[days.length - 1].d.slice(0, 4);
  return days.filter((x) => x.d.startsWith(year));
}

// ---------- main ----------
const prev = existsSync(join(ROOT, "data", "stats.json"))
  ? JSON.parse(readFileSync(join(ROOT, "data", "stats.json"), "utf8"))
  : {};

const stats = { user: USER, updated: prev.updated || "", ...prev };

try {
  const u = await fetchUser();
  stats.repos = u.repos; stats.followers = u.followers; stats.following = u.following;
  console.log(`user: repos=${u.repos} followers=${u.followers} following=${u.following}`);
} catch (e) { warn(`user fetch failed: ${e.message}`); }

try {
  const c = await fetchCommits();
  if (c !== null) { stats.commits = c; console.log(`commits: ${c}`); }
} catch (e) { warn(`commit search failed: ${e.message}`); }

try {
  const langs = await fetchLanguages();
  if (langs) { stats.languages = langs; console.log(`languages: ${langs.map((l) => `${l.name} ${l.pct}%`).join(", ")}`); }
} catch (e) { warn(`languages failed: ${e.message}`); }

try {
  const streak = await fetchStreak();
  stats.streak = streak;
  console.log(`streak: ${streak.length} days, ${streak.reduce((a, b) => a + (b.l > 0 ? 1 : 0), 0)} active`);
} catch (e) { warn(`streak failed: ${e.message}`); }

stats.updated = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, "data", "stats.json"), JSON.stringify(stats, null, 2) + "\n");
console.log("wrote data/stats.json");

const gen = spawnSync(process.execPath, [join(ROOT, "scripts", "generate.mjs")], { stdio: "inherit" });
process.exit(gen.status ?? 0);
