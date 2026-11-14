// SPDX-License-Identifier: MIT
// Shared helpers for the scripts. No dependencies.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// The public repository, owner/name, newest first. To rename it, put the new owner/name first in
// this one line and run the build: build.mjs writes every URL from the first entry and rewrites the
// older ones in the hand-written files it keeps in step (SYNCED in build.mjs).
export const REPO_SLUGS = ['ntroccoli/ai-migrations'];
export const REPO_SLUG = REPO_SLUGS[0];
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
  'author_relation', 'evidence', 'kind', 'from', 'to', 'from_languages', 'size', 'duration', 'people', 'cost', 'ai_share', 'tools',
  'models', 'period', 'outcome', 'status', 'superseded_by'];
// Sections in order; `optional` ones may be left out.
export const SECTIONS = [
  { name: 'Source' }, { name: 'What was migrated' }, { name: 'Who did what' }, { name: 'How it was checked' },
  { name: 'Numbers' },
  { name: 'What worked' }, { name: 'What went wrong' }, { name: 'Practices to copy' },
  { name: 'In their words', optional: true }, { name: 'Context' },
];
// `from_languages`: the languages the migrated code was written in before the move. Named after
// `from`, not "source_languages": in a case, "source" is the publication (source_url, source_type).
// build.mjs lists the covered ones in llms.txt and names the ones in this list no case starts from.
// Add a language here when a case needs it.
export const LANGUAGES = ['C', 'C++', 'C#', 'Dart', 'Go', 'Java', 'JavaScript', 'Kotlin', 'PHP', 'Python', 'Ruby',
  'Rust', 'Scala', 'SQL', 'Swift', 'TypeScript', 'Zig'];
export const NUMBERS_HEADER = '| Number | What it counts | Basis | Source |';

// Units: a number in a case must be followed, within three words, by one of these (a measure or
// a counted noun; the plural is accepted: "-s", and "-ies" for a unit ending in "y"). Add a unit
// here, in the singular, when a case needs it.
export const UNITS = new Set(`
  % x percent usd dollar
  ms s second minute hour day week month year
  kb mb gb tb byte token
  line file pr pull request commit branch worktree repo repository crate package dependency
  component module function export route block test rebase build run check
  session subagent agent message call prompt turn attempt retry step wave
  release migration pipeline dataset change error diagnostic regression compaction issue bug
  people person engineer developer team user product language sdk app application screen
  character word example comment review lifecycle window event
  method task rule instruction zone office symbol project library cent
  seed battle thread
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

// The lines of "Practices to copy": [{ tag, text }] (lines that do not parse are left out; validate.mjs
// reports them).
export const practices = body => (sections(body).find(s => s.name === 'Practices to copy')?.text ?? '').split('\n')
  .map(l => l.match(/^- \[(stated|ours)\] (.+) \(\[[^\]]+\]\([^)\s]+\)\)\s*$/)).filter(Boolean)
  .map(m => ({ tag: m[1], text: m[2] }));
// Content words of a line, for matching a lesson to the practice it rests on: lower case, four
// letters or more, a final "s" dropped and "ie" read as "y" (dependencies, dependency; cookies, cookie).
const STOP = new Set(['that', 'this', 'with', 'from', 'when', 'then', 'than', 'each', 'into', 'only', 'have', 'they',
  'their', 'them', 'what', 'which', 'before', 'after', 'every', 'more', 'most', 'some', 'there', 'where', 'while']);
export const contentWords = s => new Set(s.toLowerCase().split(/[^\p{L}]+/u).filter(w => w.length >= 4 && !STOP.has(w))
  .map(w => w.replace(/s$/, '').replace(/ie$/, 'y')));
// The practice lines closest to a lesson's text (most content words shared); [] when none shares one.
export function closestPractices(text, lines) {
  const want = contentWords(text);
  const scored = lines.map(p => ({ ...p, score: [...contentWords(p.text)].filter(w => want.has(w)).length }));
  const top = Math.max(0, ...scored.map(p => p.score));
  return top ? scored.filter(p => p.score === top) : [];
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
// Every lesson page holds this legend as its own paragraph, after the evidence note; validate.mjs
// matches it, and build.mjs repeats it in lessons/index.md and llms-full.txt.
export const LESSON_LEGEND = "`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. \"Old system as oracle\" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. \"Depends on model ability\" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. \"Era\": the years the cited cases ran (their publication year when they give no period) and the models they name, `unstated` when one names none. \"Strength\", capped by the cases in \"Cases\" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.";
export const KARPATHY_IDEAS = 'https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/';
export const ORACLES = ['yes', 'partly', 'no'];
// "Depends on model ability": the lesson states what models or agents can or cannot do (yes), is a
// process whose need comes from such a behaviour (partly), or holds whatever the model (no).
export const MODEL_DEPENDENCE = ['yes', 'partly', 'no'];
// A lesson tagged `yes` whose newest case in "Cases" was published more than this many months before
// the date of the newest log.md entry is marked "may be outdated" in lessons/index.md and llms.txt.
export const OUTDATED_MONTHS = 12;
export const STRENGTHS = ['strong', 'medium', 'weak'];
// The highest strength the cases in a lesson's "Cases" line allow (AGENTS.md "Lessons"): `strong`
// needs two or more cases, or one whose source shows its data (`evidence` other than
// `assertion-only`), and at least one case whose author does not sell the tool; `medium` needs the
// same without the seller condition; anything else is `weak`. Contrast cases (`ai_share: little`)
// do not count. `metas` are the cases' front matter.
export function strengthCeiling(metas) {
  // A contrast case (ai_share: little) never raises a lesson about what models do.
  metas = metas.filter(m => m.ai_share !== 'little');
  if (!metas.length) return 'weak';
  const shown = metas.some(m => m.evidence && m.evidence !== 'assertion-only');
  if (metas.length < 2 && !shown) return 'weak';
  return metas.every(m => m.author_relation === 'seller-of-tool') ? 'medium' : 'strong';
}

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
// The first sub-item: "Old system as oracle: no. Depends on model ability: yes. Strength: medium.
// Era: 2025–2026; models: Claude Opus 4.6, unstated."
export const META_LINE = /^(\w+)\. Depends on model ability: (\w+)\. Strength: (\w+)\. Era: (.+)\.$/;
export function lessonMeta(lesson) {
  const m = (sub(lesson, 'Old system as oracle') || '').match(META_LINE);
  return m ? { oracle: m[1], model: m[2], strength: m[3], era: m[4] } : {};
}
// The case files a lesson's "Cases" line links (`refs` resolves reference links).
export const casesOf = (lesson, refs) => [...new Set(linksIn(sub(lesson, 'Cases') || '', refs)
  .map(x => x.target?.match(/^\.\.\/cases\/([^#/\s]+\.md)#/)?.[1]).filter(Boolean))];
// The Era a lesson must carry, from the front matter of the cases in its "Cases" line: the years
// from each case's `period` (its `date` when the period is unstated), as `YYYY` or `YYYY–YYYY`,
// then the models exactly as the cases name them, oldest case first, with `unstated` last when any
// case names none. Returns { years, models } (models: an array).
export function expectedEra(metas) {
  metas = [...metas].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const ys = metas.flatMap(m => String(m.period && m.period !== 'unstated' ? m.period : m.date).match(/\d{4}/g) || []).map(Number);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  const names = metas.flatMap(m => [m.models].flat()).filter(Boolean);
  const models = [...new Set(names.filter(x => x !== 'unstated'))];
  if (!models.length || names.includes('unstated')) models.push('unstated');
  return { years: lo === hi ? String(lo) : `${lo}–${hi}`, models };
}
export const eraText = e => `${e.years}; models: ${e.models.join(', ')}`;
// An Era value as { years, models }; undefined when it is not "YYYY[–YYYY]; models: a, b".
export function parseEra(text) {
  const m = (text || '').match(/^(\d{4}(?:–\d{4})?); models: (\S.*)$/);
  return m ? { years: m[1], models: m[2].split(', ') } : undefined;
}
// How recent a case is: the later of its publication `date` and the end of its `period` (a series is
// dated by its first part, so its work can run past that date). Partial dates compare as prefixes:
// "2026-04" sorts after "2025-11-14" and before "2026-04-01".
export const caseRecency = m => [String(m.date), m.period && m.period !== 'unstated' ? String(m.period).split('..').at(-1) : '']
  .sort().at(-1);
// "May be outdated": tagged `yes` for model ability, and the most recent case in "Cases"
// (caseRecency) is more than OUTDATED_MONTHS months before `today` (YYYY-MM-DD). `metas`: those
// cases' front matter.
export function mayBeOutdated(lesson, metas, today) {
  if (lessonMeta(lesson).model !== 'yes' || !metas.length) return false;
  const newest = metas.map(caseRecency).sort().at(-1);
  const t = new Date(`${today}T00:00:00Z`);
  t.setUTCMonth(t.getUTCMonth() - OUTDATED_MONTHS);
  return newest < t.toISOString().slice(0, 10);
}
