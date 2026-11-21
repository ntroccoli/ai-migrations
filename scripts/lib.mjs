// SPDX-License-Identifier: MIT
// Shared helpers for the scripts. No dependencies.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

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
// Sizes and format limits (docs/maintaining.md "Sizes and format limits"): no file has a byte cap; the
// validator reports the size of each file in sizeReportFiles() and its growth, and never fails on it. The
// limits still checked are format rules with a reason other than size. LIMITS maps each name to what the
// validator does with it; the table there has a row per name with the same Status (validate.mjs checks).
export const LIMITS = {
  SIZE_REPORT: 'reported', SUMMARY_MAX_CHARS: 'enforced', LINE_MAX_CHARS: 'enforced', QUOTE_MAX_WORDS: 'enforced',
  SPAN_MAX_WORDS: 'enforced', SUMMARY_WORDS: 'warning', QUESTIONS: 'warning', OUTDATED_MONTHS: 'mark',
};
export const SUMMARY_MAX_CHARS = 160; // a case's index line
export const LINE_MAX_CHARS = 200; // a lesson's or a practice's one line
export const QUOTE_MAX_WORDS = 15; // the one quote a case may carry
export const SPAN_MAX_WORDS = 4; // a quoted span longer than this counts as a quote
export const SUMMARY_WORDS = [40, 150]; // a case's summary paragraph, a warning outside it
export const QUESTIONS = [5, 12]; // checklist questions, a warning outside it
// The files the size report lists: what an agent may read whole. Bytes with LF line ends, so a Windows
// checkout (CRLF) measures the same as the repository.
export const sizeReportFiles = () => ['AGENTS.md', 'llms.txt', 'checklist.md', 'lessons/index.md', 'lessons/evidence.md',
  ...LESSON_PAGES.map(s => `lessons/${s}.md`)];
export const byteSize = text => Buffer.byteLength(text.replace(/\r\n/g, '\n'), 'utf8');
// Provenance (docs/lesson-rules.md "Provenance"): the published method files whose thresholds and hard
// rules carry a marker such as (P3), read in the file's own "## Provenance" table.
export const PROVENANCE_FILES = ['checklist.md', 'docs/applying-lessons.md', 'docs/report-formats.md', 'corrections.md'];
// The checklist's guide (docs/lesson-rules.md "Checklist"): one file per question, guide/q<n>.md, read
// only for the question in use. Its five parts, in order; its markers use the checklist's Provenance table.
export const GUIDE_DIR = join(ROOT, 'guide');
export const GUIDE_PARTS = ['Lessons behind it', 'What it looks like in a project', 'Questions to ask of this project',
  'Trade-offs', 'When not to apply it'];
// corrections.md (docs/maintaining.md "Corrections"): what we published wrong, read first by every revisit.
export const CORRECTIONS = join(ROOT, 'corrections.md');
export const CORRECTION_FIELDS = ['What was wrong', 'Published', 'How to recognise it', 'How to find what it changed',
  'What to propose'];
// Entries of corrections.md: [{ id, n, title, line, fields: { name: text } }]; `none` when it says "None yet.".
export function parseCorrections(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const at = lines.findIndex(l => /^## Entries\s*$/.test(l));
  if (at < 0) return null;
  const body = [];
  for (let i = at + 1; i < lines.length && !/^## /.test(lines[i]); i++) body.push({ l: lines[i], line: i + 1 });
  const entries = [];
  let cur = null, field = null;
  for (const { l, line } of body) {
    const h = l.match(/^### (COR-(\d+)): (.+)$/);
    if (h) { cur = { id: h[1], n: Number(h[2]), title: h[3], line, fields: {}, stray: [] }; entries.push(cur); field = null; continue; }
    if (/^### /.test(l)) { entries.push({ id: null, title: l, line, fields: {}, stray: [] }); cur = null; continue; }
    const f = l.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (cur && f) { field = f[1]; cur.fields[field] = f[2]; continue; }
    if (cur && field && /^\s+\S/.test(l)) { cur.fields[field] += ' ' + l.trim(); continue; }
    if (cur && l.trim()) cur.stray.push(line);
  }
  const prose = body.filter(b => b.l.trim()).map(b => b.l.trim());
  return { entries, none: !entries.length && prose.length === 1 && prose[0] === 'None yet.', prose };
}
export const PROVENANCE_LEVELS = ['published case', 'published cases', "others' measurement", 'vendor guidance', 'ours'];
export const PROVENANCE_HEADER = '| ID | Source | Level | Prevents | Blind failure |';
// A hard rule tells the reader or its agent to cut, cap, delete, forbid or stop. "limits" is left out: it
// names a property (model limits); "a retry limit" is a rule.
export const HARD_RULE = /\b(cut|cuts|cap|caps|capped|trim|trims|delete|deletes|remove|removes|drop|drops|forbid|forbids|never|stop|stops|limit|do not|must not|no more than|at most|at or under|wait for|(chang|writ|touch)(e|es|ing) (nothing|no))\b/i;

// Field values. Keep in sync with docs/case-format.md "Case files".
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
// build.mjs lists the covered ones in index.md and names the ones in this list no case starts from.
// Add a language here when a case needs it.
export const LANGUAGES = ['C', 'C++', 'C#', 'Dart', 'Go', 'Groovy', 'Java', 'JavaScript', 'Kotlin', 'PHP', 'Python', 'Ruby',
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
  service microservice target value edge cron webhook api queue vcpu
  key spec cohort shard connection
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
// The files scripts/build.mjs generates (besides changes/<entry>.md), relative to the repo root. The
// build fails when its outputs and this list differ; the private gate skips them in its copy check.
export const GENERATED_FILES = ['index.md', 'lessons/index.md', 'lessons/evidence.md', 'llms.txt', 'llms-full.txt'];
export const LESSON_PAGES = ['planning', 'testing', 'verification', 'review', 'rollout', 'operations', 'security',
  'cost', 'team', 'tooling', 'context', 'orchestration', 'agent-failures', 'oversight', 'knowledge', 'measurement'];
// llms.txt (generated) is what an agent reads first on every run; it lists no cases (index.md does), so it
// does not grow with each case. Its size is reported, never capped (LIMITS above).
// Every lesson page opens with this sentence (after its title and intro); validate.mjs matches it.
export const LESSON_NOTE = 'Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.';
// Every lesson page holds this legend as its own paragraph, after the evidence note; validate.mjs
// matches it, and build.mjs repeats it in lessons/index.md and llms-full.txt.
export const LESSON_LEGEND = "`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. \"Old system as oracle\" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. \"Depends on model ability\" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. \"Era\": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. \"Strength\", capped by the cases in \"Cases\" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.";
export const KARPATHY_IDEAS = 'https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/';
export const ORACLES = ['yes', 'partly', 'no'];
// "Depends on model ability": the lesson states what models or agents can or cannot do (yes), is a
// process whose need comes from such a behaviour (partly), or holds whatever the model (no).
export const MODEL_DEPENDENCE = ['yes', 'partly', 'no'];
// A lesson tagged `yes` whose newest case in "Cases" was published more than this many months before
// the date of the newest log.md entry is marked "may be outdated" in lessons/index.md and llms.txt.
export const OUTDATED_MONTHS = 12;
export const STRENGTHS = ['strong', 'medium', 'weak'];
// The highest strength the cases in a lesson's "Cases" line allow (docs/lesson-rules.md "Lessons"): `strong`
// needs two or more cases, or one whose source shows its data (`evidence` other than
// `assertion-only`), and at least one case whose author does not sell the tool; `medium` needs the
// same without the seller condition; anything else is `weak`. Contrast cases (`ai_share: little`)
// do not count. `metas` are the cases' front matter.
export function strengthCeiling(metas) {
  // A contrast case (ai_share: little) counts toward no lesson's cap, whatever the lesson is about.
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
  return parseLessonText(readFileSync(path, 'utf8'), path);
}
// The same from text in memory (the private archive's apply-proposals.mjs parses edited pages).
export function parseLessonText(raw, path) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
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
// Era: 2025–2026; newest: Claude Opus 4.x."
export const META_LINE = /^(\w+)\. Depends on model ability: (\w+)\. Strength: (\w+)\. Era: (.+)\.$/;
export function lessonMeta(lesson) {
  const m = (sub(lesson, 'Old system as oracle') || '').match(META_LINE);
  return m ? { oracle: m[1], model: m[2], strength: m[3], era: m[4] } : {};
}
// The case files a lesson's "Cases" line links (`refs` resolves reference links).
export const casesOf = (lesson, refs) => [...new Set(linksIn(sub(lesson, 'Cases') || '', refs)
  .map(x => x.target?.match(/^\.\.\/cases\/([^#/\s]+\.md)#/)?.[1]).filter(Boolean))];
// The models a case names (`unstated` left out).
export const namedModels = m => [m.models].flat().filter(x => x && x !== 'unstated');
// The Era a lesson must carry, from the front matter of the cases in its "Cases" line: the years
// from each case's `period` (its `date` when the period is unstated), as `YYYY` or `YYYY–YYYY`,
// and the newest model family: the family (modelFamily) of the most recent case (caseRecency, then
// date) that names a model; when it names several, the one with the highest version number, the
// first listed on a tie; `unstated` when no case names a model. The full model lists stay in the
// cases. Returns { years, newest }.
export function expectedEra(metas) {
  const ys = metas.flatMap(m => String(m.period && m.period !== 'unstated' ? m.period : m.date).match(/\d{4}/g) || []).map(Number);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  const named = metas.filter(m => namedModels(m).length)
    .sort((a, b) => caseRecency(b).localeCompare(caseRecency(a)) || String(b.date).localeCompare(String(a.date)));
  let newest = 'unstated';
  if (named.length) {
    const version = f => Number(f.match(/(\d+)(?:\.x|o)?$/)?.[1] ?? -1);
    newest = namedModels(named[0]).map(n => modelFamily(n) ?? n).reduce((best, f) => (version(f) > version(best) ? f : best));
  }
  return { years: lo === hi ? String(lo) : `${lo}–${hi}`, newest };
}
// The model family of a model name as a case (or a field report) writes it, for "By model" in
// lessons/index.md: only obvious families, by maker, line and major version ("Claude Opus 4.6" and
// "Opus 4.8" are "Claude Opus 4.x"; "gpt-5.5" and "GPT-5.6 Sol" are "GPT-5.x"). A name with a line
// but no version is "<line> (version unstated)"; an internal model is "<maker> (internal)".
// `unstated` stays `unstated`. A name whose maker is not in MODEL_FAMILIES returns undefined:
// build.mjs then keeps the name as its own family, and the field-report collector asks for a fix.
// Add a rule here when a case or a report names a new maker.
export const MODEL_FAMILIES = [
  // Claude: the line (Opus, Sonnet, Haiku, Fable, Mythos), with or without "Claude" before it.
  [/\b(?:Claude\s+)?(Opus|Sonnet|Haiku|Fable|Mythos)\b(?:\s+(\d+))?/i, m => `Claude ${cap(m[1])} ${m[2] ? `${m[2]}.x` : '(version unstated)'}`],
  [/\bClaude\s+(\d+)/i, m => `Claude ${m[1]}.x`],
  [/\bClaude\b/i, () => 'Claude (version unstated)'],
  // "GPT-5.3 Codex" is the Codex line ("Codex 5.3" in the same source), not the GPT chat line.
  [/\bGPT[- ]?(\d+)(?:\.\d+)?[- ]Codex\b/i, m => `OpenAI Codex ${m[1]}.x`],
  [/\bGPT[- ]?(\d+)o\b/i, m => `GPT-${m[1]}o`],
  [/\bGPT[- ]?(\d+)/i, m => `GPT-${m[1]}.x`],
  [/\bGPT\b/i, () => 'GPT (version unstated)'],
  [/\bo(\d)(?:-mini|-pro)?\b/, m => `OpenAI o${m[1]}`],
  [/\bCodex[- ]?(\d+)/i, m => `OpenAI Codex ${m[1]}.x`],
  [/\bCodex\b/i, () => 'OpenAI Codex (version unstated)'],
  [/\binternal\b.*\bGemini\b|\bGemini\b.*\binternal\b/i, () => 'Gemini (internal)'],
  [/\bGemini\s+(\d+)/i, m => `Gemini ${m[1]}.x`],
  [/\bGemini\b/i, () => 'Gemini (version unstated)'],
  [/\bGrok[- ]?(\d+)/i, m => `Grok ${m[1]}.x`],
  [/\bGrok\b/i, () => 'Grok (version unstated)'],
  // Kimi writes its version after a K ("Kimi K2.6" is Kimi K2.x); Gemma after a space ("Gemma 4").
  [/\bKimi[\s-]+K(\d+)/i, m => `Kimi K${m[1]}.x`],
  [/\bGemma[\s-]+(\d+)/i, m => `Gemma ${m[1]}.x`],
  [/\bGemma\b/i, () => 'Gemma (version unstated)'],
  // (?![a-z]) rather than \b, so a version written flush ("Qwen2.5") still counts.
  [/\b(Llama|Mistral|Codestral|Devstral|DeepSeek|Qwen|Kimi|GLM|Hunyuan|Doubao|Seed)(?![a-z])[- ]?[Vv]?(\d+)?/i,
    m => `${OPEN_NAMES.find(x => x.toLowerCase() === m[1].toLowerCase())} ${m[2] ? `${m[2]}.x` : '(version unstated)'}`],
];
const OPEN_NAMES = ['Llama', 'Mistral', 'Codestral', 'Devstral', 'DeepSeek', 'Qwen', 'Kimi', 'GLM', 'Hunyuan', 'Doubao', 'Seed'];
const cap = s => s[0].toUpperCase() + s.slice(1).toLowerCase();
export function modelFamily(name) {
  const n = String(name ?? '').trim();
  if (/^unstated$/i.test(n)) return 'unstated';
  for (const [re, f] of MODEL_FAMILIES) { const m = n.match(re); if (m) return f(m); }
  return undefined;
}
export const eraText = e => `${e.years}; newest: ${e.newest}`;
// An Era value as { years, newest }; undefined when it is not "YYYY[–YYYY]; newest: <family>".
export function parseEra(text) {
  const m = (text || '').match(/^(\d{4}(?:–\d{4})?); newest: (\S.*)$/);
  return m ? { years: m[1], newest: m[2] } : undefined;
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

// Update log entries and what each added or changed (docs/maintaining.md "Update log"). Each entry of log.md
// has a generated changes/<slug>.md: the lesson IDs and checklist questions added, changed or gone
// since the previous entry, the fingerprints of the state after it and the sizes of the files in
// sizeReportFiles() (the size report's baseline for the next entry). The newest entry's file is
// rebuilt from the sources; an older one is frozen, since its state can no longer be rebuilt.
export const LOG = join(ROOT, 'log.md');
export const CHANGES_DIR = join(ROOT, 'changes');
export function logEntries(text) {
  return text.replace(/\r\n/g, '\n').split(/^(?=## \d{4}-\d{2}-\d{2})/m).slice(1).map(body => {
    const head = body.split('\n')[0].slice(3).trim();
    const date = head.slice(0, 10);
    const title = head.replace(/^\d{4}-\d{2}-\d{2}\s*—\s*/, '');
    const slug = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    return { head, date, title, slug, body };
  });
}
// The part of a lesson a revisit cares about: its tag and words, oracle, model and strength tags, the
// cases it cites and its Against line (not the Era, which follows the cases, nor Related view).
const print = s => createHash('sha256').update(s.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 8);
export function lessonPrints(pages) {
  const out = new Map();
  for (const p of pages) for (const l of p.lessons) {
    const m = lessonMeta(l);
    out.set(l.id, print([l.tag, l.text, m.oracle, m.model, m.strength, casesOf(l, p.refs).sort().join(' '), sub(l, 'Against') || ''].join('\n')));
  }
  return out;
}
// The checklist's questions, Q1..Qn, each with its whole text (title, Check, Lessons, Guide) and, when
// `guides` (Map "Q<n>" -> text of guide/q<n>.md) is given, its guide: a changed guide changes the question.
export function questionPrints(text, guides = new Map()) {
  const out = new Map();
  let cur = null;
  for (const l of text.replace(/\r\n/g, '\n').split('\n')) {
    const q = l.match(/^(\d+)\. \*\*/);
    if (q) { cur = `Q${q[1]}`; out.set(cur, l); } else if (/^#/.test(l)) cur = null; else if (cur) out.set(cur, `${out.get(cur)}\n${l}`);
  }
  for (const [k, v] of out) out.set(k, print(`${v}\n${guides.get(k) || ''}`));
  return out;
}
// guide/q<n>.md texts by question, "Q<n>" -> text (LF line ends).
export function loadGuides(dir = GUIDE_DIR) {
  const out = new Map();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const m = f.match(/^q(\d+)\.md$/);
    if (m) out.set(`Q${m[1]}`, readFileSync(join(dir, f), 'utf8').replace(/\r\n/g, '\n'));
  }
  return out;
}
// Compare two states (Map id -> fingerprint); `before` empty for the oldest entry.
export function diffPrints(before, after) {
  const ids = m => [...m.keys()];
  return {
    added: ids(after).filter(k => !before.has(k)),
    changed: ids(after).filter(k => before.has(k) && before.get(k) !== after.get(k)),
    gone: ids(before).filter(k => !after.has(k)),
  };
}
export const CHANGE_LINES = { 'Added lessons': 'lessons.added', 'Changed lessons': 'lessons.changed', 'Lessons gone': 'lessons.gone',
  'Added questions': 'questions.added', 'Changed questions': 'questions.changed', 'Questions gone': 'questions.gone' };
// Read a changes file: its lists and its fingerprints (the state after its entry).
export function parseChanges(text) {
  const t = text.replace(/\r\n/g, '\n');
  const lists = {};
  for (const label of Object.keys(CHANGE_LINES)) {
    const m = t.match(new RegExp(`^- ${label}: (.*)$`, 'm'));
    lists[label] = !m || m[1] === 'none' ? [] : m[1].split(', ').map(s => s.trim());
  }
  const state = new Map((t.split(/^## State after this entry$/m)[1] || '').split('\n')
    .map(l => l.match(/^((?:[A-Z]{3}-|Q)\d+) ([0-9a-f]{8})$/)).filter(Boolean).map(m => [m[1], m[2]]));
  // Older entries' files have no sizes: the report then says so.
  const sizes = new Map((t.split(/^## Sizes after this entry$/m)[1] || '').split('\n')
    .map(l => l.match(/^(\S+\.(?:md|txt)) (\d+)$/)).filter(Boolean).map(m => [m[1], Number(m[2])]));
  return { lists, state, sizes };
}
// Write a changes file. `prev` is the previous entry ({ head, state }) or null for the oldest.
export function renderChanges(entry, prev, lessons, questions, generated, sizes = new Map()) {
  const before = prev?.state ?? new Map();
  const pick = re => new Map([...before].filter(([k]) => re.test(k)));
  const l = diffPrints(pick(/^[A-Z]{3}-/), lessons), q = diffPrints(pick(/^Q/), questions);
  const list = xs => xs.length ? xs.join(', ') : 'none';
  return [
    generated, '',
    `# Changes: ${entry.head}`, '',
    `What this [log.md](../log.md) entry added, changed or removed, ${prev ? `since "${prev.head}"` : 'from nothing (the first entry)'}: ` +
      'lesson IDs and checklist questions (Q1 is question 1). A revisit reads these lines for every entry newer than ' +
      'the one its record names, then only the lessons and questions they list.', '',
    `- Added lessons: ${list(l.added)}`,
    `- Changed lessons: ${list(l.changed)}`,
    `- Lessons gone: ${list(l.gone)}`,
    `- Added questions: ${list(q.added)}`,
    `- Changed questions: ${list(q.changed)}`,
    `- Questions gone: ${list(q.gone)}`, '',
    'A lesson counts as changed when its tag, words, oracle, model or strength tag, cited cases or Against line ' +
      'changed; a question, when any of its text or its guide (guide/q<n>.md) did.', '',
    '## State after this entry', '',
    'Fingerprints (a short hash of each lesson and question) the next entry is compared with.', '',
    '```text', ...[...lessons, ...questions].map(([k, v]) => `${k} ${v}`), '```', '',
    '## Sizes after this entry', '',
    'Bytes of each file an agent may read whole (LF line ends). The validator reports each file\'s growth since ' +
      'the previous entry\'s sizes; a size is never a failure.', '',
    '```text', ...[...sizes].map(([k, v]) => `${k} ${v}`), '```', '',
  ].join('\n');
}
