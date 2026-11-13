// Shared helpers for the scripts. No dependencies.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CASES_DIR = join(ROOT, 'cases');
export const CHECKLIST = join(ROOT, 'checklist.md');
export const NOTICE = join(ROOT, 'NOTICE.md');
export const PITFALLS = join(ROOT, 'pitfalls.md');
// Agents read checklist.md whole before a migration: keep it small.
export const CHECKLIST_MAX_BYTES = 20 * 1024;

// Field values. Keep in sync with AGENTS.md "Case files".
export const SOURCE_TYPES = ['engineering-post', 'paper', 'talk', 'repo', 'vendor-marketing'];
export const KINDS = ['language', 'framework', 'test-framework', 'library-upgrade', 'data', 'architecture', 'mixed'];
export const AI_SHARES = ['most', 'part', 'little', 'unstated'];
export const RELATIONS = ['seller-of-tool', 'user-of-tool', 'independent'];
export const EVIDENCE = ['independent-data', 'shown-in-source', 'assertion-only'];
export const OUTCOMES = ['completed', 'partial', 'ongoing', 'abandoned'];
export const STATUSES = ['current', 'superseded'];
export const BASES = ['measured', 'reported', 'estimate', 'self-estimate', 'vendor-claim'];
export const REQUIRED = ['title', 'date', 'company', 'summary', 'source_url', 'also', 'source_type',
  'author_relation', 'evidence', 'kind', 'from', 'to', 'size', 'duration', 'people', 'cost', 'ai_share', 'tools',
  'models', 'period', 'outcome', 'status', 'superseded_by'];
// Sections in order; `optional` ones may be left out.
export const SECTIONS = [
  { name: 'Source' }, { name: 'What was migrated' }, { name: 'Who did what' }, { name: 'How it was checked' },
  { name: 'Numbers' },
  { name: 'What worked' }, { name: 'What went wrong' }, { name: 'Practices to copy' },
  { name: 'In their words', optional: true }, { name: 'Context' },
];
export const NUMBERS_HEADER = '| Number | What it counts | Basis | Source |';

// Units: a number in a case must be followed, within three words, by one of these (a measure or
// a counted noun; a trailing "s" for the plural is accepted). Add a unit here when a case needs it.
export const UNITS = new Set(`
  % x percent usd dollar
  ms s second minute hour day week month year
  kb mb gb tb byte token
  line file pr pull request commit branch worktree repo repository crate package dependency
  dependencie component module function export route block test rebase build run check
  session subagent agent message call prompt turn attempt retry retrie step wave
  release migration pipeline dataset change error diagnostic regression compaction issue bug
  people person engineer developer team user product language sdk
  character word example comment review lifecycle window event
  method task rule instruction zone office symbol project library librarie cent
`.trim().split(/\s+/));
// Words that may sit between a number and its unit without being units themselves.
export const SCALES = new Set(['thousand', 'million', 'billion', 'k', 'm', 'b']);

// Parse the simple front matter: one `key: value` per line, inline lists `[a, b]` (items may not
// contain commas), booleans, values optionally in double quotes. Anything else is an error, so a
// YAML form this parser does not read is reported, never dropped.
export function parseCase(path) {
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const file = basename(path);
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { file, path, error: 'missing front matter', meta: {}, body: text };
  const meta = {};
  const problems = [];
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) { problems.push(`front matter line not understood: "${line.slice(0, 50)}"`); continue; }
    if (kv[1] in meta) problems.push(`duplicate key "${kv[1]}"`);
    let v = kv[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    else if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^".*"$/.test(v)) v = v.slice(1, -1);
    meta[kv[1]] = v;
  }
  const bodyOffset = m[1].split('\n').length + 2; // the two --- lines
  return { file, path, meta, body: m[2], bodyOffset, error: problems.join('; ') || undefined };
}

export function listCases(dir = CASES_DIR) {
  return readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => join(dir, f));
}

// Split a markdown body into `## ` sections: { name, text, line }.
export function sections(body) {
  const out = [];
  let cur = null;
  body.split('\n').forEach((l, i) => {
    const h = l.match(/^## (.+?)\s*$/);
    if (h) { cur = { name: h[1], lines: [], line: i + 1 }; out.push(cur); } else if (cur) cur.lines.push(l);
  });
  return out.map(s => ({ name: s.name, line: s.line, text: s.lines.join('\n').trim() }));
}

// ---- Lessons ----------------------------------------------------------------------------------
// One page per aspect in lessons/, in this order (the order of the index and llms.txt). The pages
// are the source of truth; lessons/index.md is generated by scripts/build.mjs.
export const LESSONS_DIR = join(ROOT, 'lessons');
export const LESSON_PAGES = ['planning', 'testing', 'verification', 'review', 'rollout', 'operations', 'security',
  'cost', 'team', 'tooling', 'context', 'orchestration', 'agent-failures', 'oversight', 'knowledge', 'measurement'];
export const LESSON_MAX_BYTES = 20 * 1024; // an agent reads a page whole
// Every lesson page opens with this sentence (after its title and intro); validate.mjs matches it.
export const LESSON_NOTE = 'Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.';
export const KARPATHY_IDEAS = 'https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/';
export const ORACLES = ['yes', 'partly', 'no'];
export const STRENGTHS = ['strong', 'medium', 'weak'];

// GitHub's heading anchor: lower case, punctuation dropped, spaces to hyphens.
export const anchor = h => h.trim().toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-');
// Reference definitions `[label]: target`, label in lower case.
export const refDefs = lines => new Map(lines.map(l => l.match(/^\[([^\]]+)\]:\s*(\S+)/)).filter(Boolean)
  .map(m => [m[1].toLowerCase(), m[2]]));
// Links in a line, inline or by reference: [{ text, target }] (target undefined when the label is not defined).
export const linksIn = (text, refs) => [
  ...[...text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map(m => ({ text: m[1], target: m[2] })),
  ...[...text.matchAll(/\[([^\]]+)\]\[([^\]]*)\]/g)].map(m => ({ text: m[1], target: refs.get((m[2] || m[1]).toLowerCase()) })),
];

// Parse a lesson page. A lesson is a top-level item `- **ID** [tag] text` followed by sub-items
// `  - Label: text`. Returns { slug, file, path, text, title, intro, refs, lessons, stray } where
// each lesson is { id, tag, text, line, subs: [{ label, text, line }] } and `stray` lists lines
// inside the lesson list that are neither lessons, sub-items, blank lines nor reference definitions.
export function parseLessonPage(path) {
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const slug = basename(path, '.md');
  const page = { slug, file: `lessons/${slug}.md`, path, text, lines, title: '', intro: '', refs: refDefs(lines), lessons: [], stray: [] };
  const h1 = lines.findIndex(l => /^# /.test(l));
  if (h1 >= 0) {
    page.title = lines[h1].slice(2).trim();
    const para = [];
    for (let i = h1 + 1; i < lines.length; i++) { if (lines[i].trim()) para.push(lines[i].trim()); else if (para.length) break; }
    page.intro = para.join(' ');
  }
  let cur = null;
  lines.forEach((l, i) => {
    const line = i + 1;
    const m = l.match(/^- \*\*([^*]+)\*\* \[([^\]]*)\] (.*)$/);
    if (m) { cur = { id: m[1], tag: m[2], text: m[3].trim(), line, subs: [] }; page.lessons.push(cur); return; }
    if (!cur) { if (/^[-*] /.test(l)) page.stray.push({ line, text: l }); return; }
    const s = l.match(/^ {2}- ([^:]+?)(?: \([^)]*\))?: (.*)$/);
    if (s) { cur.subs.push({ label: s[1], text: s[2].trim(), line, raw: l }); return; }
    if (!l.trim() || /^\[[^\]]+\]:\s*\S/.test(l)) return;
    page.stray.push({ line, text: l });
  });
  return page;
}

// All lesson pages in LESSON_PAGES order (missing files are skipped; validate.mjs reports them).
export function loadLessons(dir = LESSONS_DIR) {
  return LESSON_PAGES.map(s => join(dir, `${s}.md`)).filter(p => existsSync(p)).map(parseLessonPage);
}
// The value of one sub-item of a lesson, by label.
export const sub = (lesson, label) => lesson.subs.find(s => s.label === label)?.text;
// Oracle and strength from the first sub-item.
export function lessonMeta(lesson) {
  const m = (sub(lesson, 'Old system as oracle') || '').match(/^(\w+)\. Strength: (\w+)\. Era: (.+)\.$/);
  return m ? { oracle: m[1], strength: m[2], era: m[3] } : {};
}
