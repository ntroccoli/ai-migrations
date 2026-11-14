// SPDX-License-Identifier: MIT
// Broken-copy tests for scripts/validate.mjs: copy the repository's cases, checklist and scripts
// into .test-tmp/ (git-ignored), break one thing per test, and check the validator's exit code.
// Usage: node scripts/test-validate.mjs   (exit 1 when a test fails; .test-tmp/ is removed)
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, parseCase, expectedEra, eraText } from './lib.mjs';

const TMP = join(ROOT, '.test-tmp');
const PARTS = ['scripts', 'cases', 'lessons', 'checklist.md', 'pitfalls.md', 'NOTICE.md', 'index.md', 'llms.txt', 'llms-full.txt',
  'README.md', 'CONTRIBUTING.md', 'docs', 'changes', 'LICENSE-CONTENT.md', '.github', 'lychee.toml', 'log.md'];
const ONEPW = '2026-04-20-1password-monolith-refactor.md';
const INTEL = '2026-08-24-intel-ideas-c-to-rust.md';
const BUN = '2026-07-08-bun-zig-to-rust.md';
let n = 0;
const failed = [];

// A fresh copy of the repository; returns its root.
function copy() {
  const dir = join(TMP, String(++n));
  for (const p of PARTS) if (existsSync(join(ROOT, p))) cpSync(join(ROOT, p), join(dir, p), { recursive: true });
  return dir;
}
const edit = (file, from, to) => {
  const t = readFileSync(file, 'utf8').replace(/\r\n/g, '\n'); // a Windows checkout may hold CRLF
  if (!t.includes(from)) throw new Error(`test setup: "${from}" not in ${file}`);
  writeFileSync(file, t.replace(from, to));
};
const node = (dir, script, args) => spawnSync(process.execPath, [join(dir, 'scripts', script), ...args], { cwd: dir, encoding: 'utf8' });
const run = (dir, args = []) => node(dir, 'validate.mjs', args);
// expect: 0 (valid), 1 (problems), 2 (usage); `want` must appear in the output when given.
// `script` runs another script than validate.mjs (build.mjs for the --check tests).
function test(name, expect, setup, args, want, script = 'validate.mjs') {
  const dir = copy();
  let r;
  try { r = node(dir, script, setup(dir) || args || []); } catch (e) { failed.push(`${name}: ${e.message}`); return; }
  const out = r.stdout + r.stderr;
  const ok = r.status === expect && (!want || out.includes(want));
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} (exit ${r.status})`);
  if (!ok) failed.push(`${name}: wanted exit ${expect}${want ? ` with "${want}"` : ''}, got ${r.status}\n${out}`);
}
const caseFile = (dir, f) => join(dir, 'cases', f);
const sourceOf = (dir, f) => readFileSync(caseFile(dir, f), 'utf8').match(/^source_url: (\S+)/m)[1];

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

test('baseline copy is valid', 0, () => {});

// Digit-led names: "1Password" is a name, "1password" is a number with no unit.
test('digit-led name in lower case is a bare number', 1,
  d => edit(caseFile(d, ONEPW), '1Password used AI agents', '1password used AI agents'), null, 'number "1password" has no unit');

// kind: architecture is allowed (baseline); an unknown kind is not.
test('unknown kind is rejected', 1,
  d => edit(caseFile(d, ONEPW), 'kind: architecture', 'kind: restructuring'), null, 'kind must be one of');

// UNITS: each added unit word passes; a word that is not a unit fails.
const added = ['method', 'task', 'rule', 'instruction', 'zone', 'office', 'symbol', 'project', 'library', 'cent'];
test('added units are accepted', 0, d => {
  const url = sourceOf(d, INTEL);
  appendFileSync(caseFile(d, INTEL), `- Units: ${added.map(w => `7 ${w}s,`).join(' ')} 2 libraries ([source](${url})).\n`);
});
test('a number before a non-unit word fails', 1, d => {
  appendFileSync(caseFile(d, INTEL), `- Units: 7 gizmos ([source](${sourceOf(d, INTEL)})).\n`);
}, null, 'number "7" has no unit');

// Names with numbers: inside a bracket, and the second of a pair after a name.
test('a name inside a bracket and a version pair are not quantities', 0, d => {
  appendFileSync(caseFile(d, INTEL), `- Names: moved from JUnit 4 and 5 to Java 17 or 21 with help from (Claude 2.1) ([source](${sourceOf(d, INTEL)})).\n`);
});
test('a pair with no name before it still needs a unit', 1, d => {
  appendFileSync(caseFile(d, INTEL), `- Pair: between them 4 and 5 were moved ([source](${sourceOf(d, INTEL)})).\n`);
}, null, 'number "4" has no unit');

// --cases-dir: a staged case outside cases/ links to published cases.
const stage = d => { mkdirSync(join(d, 'staged')); cpSync(caseFile(d, BUN), join(d, 'staged', BUN)); rmSync(caseFile(d, BUN)); return join(d, 'staged', BUN); };
test('staged case without --cases-dir has broken links', 1, d => [stage(d)], null, 'broken link');
test('staged case with --cases-dir is valid', 0, d => ['--cases-dir', join(d, 'cases'), stage(d)]);
test('staged case with --cases-dir still catches a missing case', 1, d => {
  const p = stage(d);
  edit(p, '(2026-09-16-github-copilot-runtime-rust.md)', '(2026-09-16-no-such-case.md)');
  return ['--cases-dir', join(d, 'cases'), p];
}, null, 'broken link 2026-09-16-no-such-case.md');
test('--cases-dir needs a folder', 2, d => ['--cases-dir', join(d, 'nowhere'), caseFile(d, BUN)]);

// checklist.md: size cap, reference links, every question cites a case.
test('checklist over the size cap fails', 1,
  d => appendFileSync(join(d, 'checklist.md'), `\n${'Padding words for the size test. '.repeat(700)}\n`), null, 'bytes (at most');
test('checklist with CRLF line ends measures as LF', 0, d => {
  const p = join(d, 'checklist.md');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/\r?\n/g, '\r\n'));
});
test('checklist reference to a missing case fails', 1,
  d => edit(join(d, 'checklist.md'), '[Bun]: cases/2026-07-08-bun-zig-to-rust.md', '[Bun]: cases/2026-07-08-bun-missing.md'), null, 'broken link cases/2026-07-08-bun-missing.md');
test('checklist question with no lesson fails', 1,
  d => edit(join(d, 'checklist.md'), '   Lessons: PLN-7, PLN-8, PLN-9, SEC-7.\n', ''), null, 'cites no lesson');
test('checklist citing an unknown lesson fails', 1,
  d => edit(join(d, 'checklist.md'), 'Lessons: PLN-7, PLN-8,', 'Lessons: PLN-7, PLN-99,'), null, 'cites lesson PLN-99, which no lesson page holds');
test('a model name outside "Lessons:" is not a lesson ID', 0,
  d => edit(join(d, 'checklist.md'), 'The rest is ours.\n', 'The rest is ours; GPT-5 is a model name.\n'));
test('a model name on a line after "Lessons:" is not a lesson ID', 0,
  d => edit(join(d, 'checklist.md'), '   Lessons: PLN-7, PLN-8, PLN-9, SEC-7.\n', '   Lessons: PLN-7, PLN-8, PLN-9, SEC-7.\n   Note: GPT-5 and SHA-256 are not lessons.\n'));

// Lessons (AGENTS.md "Lessons"): one broken copy per rule.
const L = (d, page) => join(d, 'lessons', `${page}.md`);
const REV1 = '- **REV-1** [stated] Never let the writing agent review its own change;';
test('lesson with an unknown tag fails', 1,
  d => edit(L(d, 'review'), '- **REV-1** [stated]', '- **REV-1** [maybe]'), null, 'REV-1: tag must be [stated] or [ours]');
test('lesson text over 200 characters fails', 1,
  d => edit(L(d, 'review'), REV1, `${REV1} ${'and then some more words '.repeat(6)}`), null, 'REV-1: lesson text must be one line of 1 to 200 characters');
test('lesson text with a number fails', 1,
  d => edit(L(d, 'review'), REV1, '- **REV-1** [stated] Never let the writing agent review its own 3 changes;'), null, 'REV-1: lesson text holds a number');
test('duplicate lesson ID fails', 1,
  d => edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-1** [stated]'), null, 'REV-1 is used twice');
test('lesson ID with the wrong prefix for its page fails', 1,
  d => edit(L(d, 'review'), '- **REV-2** [stated]', '- **TST-99** [stated]'), null, 'prefix TST already belongs to lessons/testing.md');
test('malformed lesson ID fails', 1,
  d => edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-02** [stated]'), null, 'must be three capital letters');
test('lesson without "Against" fails', 1, d => {
  const p = L(d, 'review');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/\n {2}- Against: [^\n]*/, ''));
}, null, 'REV-1: sub-items must be, in order');
test('lesson sub-items out of order fails', 1, d => {
  const p = L(d, 'review');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/(\n {2}- Cases: [^\n]*)(\n {2}- Against: [^\n]*)/, '$2$1'));
}, null, 'REV-1: sub-items must be, in order');
test('unknown sub-item fails', 1,
  d => edit(L(d, 'review'), '  - Against: None found.\n', '  - Against: None found.\n  - Note: an extra line.\n'), null, 'sub-items must be, in order');
test('bad oracle value fails', 1,
  d => edit(L(d, 'review'), 'Old system as oracle: partly. Depends', 'Old system as oracle: maybe. Depends'), null, 'REV-1: oracle must be one of');
test('bad strength value fails', 1,
  d => edit(L(d, 'review'), 'ability: partly. Strength: medium. Era: 2026;', 'ability: partly. Strength: huge. Era: 2026;'), null, 'REV-1: strength must be one of');
// "Depends on model ability" and the Era (AGENTS.md "Lessons").
test('bad model-ability value fails', 1,
  d => edit(L(d, 'review'), 'Depends on model ability: partly. Strength: medium. Era: 2026;', 'Depends on model ability: maybe. Strength: medium. Era: 2026;'),
  null, 'REV-1: "Depends on model ability" must be one of');
test('lesson without the model-ability tag fails', 1,
  d => edit(L(d, 'review'), 'Old system as oracle: partly. Depends on model ability: partly. Strength', 'Old system as oracle: partly. Strength'),
  null, 'REV-1: write "Old system as oracle:');
test('Era in free form fails', 1, d => {
  const p = L(d, 'review');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/(\*\*REV-1\*\*[^\n]*\n[^\n]*Era: )[^\n]*/, '$1all model eras.'));
}, null, 'REV-1: write the Era as "YYYY" or "YYYY–YYYY"');
test('Era whose years do not match its cases fails', 1,
  d => edit(L(d, 'review'), 'Strength: medium. Era: 2026; models: Claude Fable 5', 'Strength: medium. Era: 2025–2026; models: Claude Fable 5'),
  null, 'REV-1: the Era must give the years and models of the cases in "Cases": "Era: 2026; models: ');
test('Era missing a model its cases name fails', 1,
  d => edit(L(d, 'review'), 'Era: 2026; models: Claude Fable 5 (pre-release version), Claude Opus 4.8,', 'Era: 2026; models: Claude Fable 5 (pre-release version),'),
  null, 'REV-1: the Era must give the years and models');
test('Era with the same models in another order passes', 0, d => {
  const p = L(d, 'review');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/(\*\*REV-1\*\*[^\n]*\n[^\n]*Era: 2026; models: )([^\n]*)\./, (_, a, m) => `${a}${m.split(', ').reverse().join(', ')}.`));
});
test('"Cases" with no link fails', 1, d => {
  const p = L(d, 'review');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/\n {2}- Cases: [^\n]*/, '\n  - Cases: Bun, GitHub.'));
}, null, 'REV-1: "Cases" needs at least one link');
test('lesson link to a missing case fails', 1,
  d => edit(L(d, 'review'), '[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked', '[bun-checked]: ../cases/2026-07-08-bun-gone.md#how-it-was-checked'), null, 'case not found: 2026-07-08-bun-gone.md');
test('lesson link to a missing case section fails', 1,
  d => edit(L(d, 'review'), '[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked', '[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-tested'), null, 'no section #how-it-was-tested');
test('lesson link to a case with no section fails', 1,
  d => edit(L(d, 'review'), '[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked', '[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md'), null, 'link must go to a case section');
test('"Against" link to a missing section fails', 1,
  d => edit(L(d, 'review'), '[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong', '[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-failed'), null, 'Against: no section #what-failed');
test('undefined reference label fails', 1,
  d => edit(L(d, 'review'), '[Bun: how it was checked][bun-checked], [Bun: what worked]', '[Bun: how it was checked][bun-nowhere], [Bun: what worked]'), null, 'has no reference definition');
test('"Related view" to another site fails', 1,
  d => edit(L(d, 'review'), '[k-llm-council-anonymous-peer-review]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/', '[k-llm-council-anonymous-peer-review]: https://example.com/ideas/'), null, '"Related view" links one idea file');
test('"Related view" without agrees or contradicts fails', 1,
  d => edit(L(d, 'review'), '[k-llm-council-anonymous-peer-review], agrees.', '[k-llm-council-anonymous-peer-review], related.'), null, 'ends with ", agrees." or ", contradicts: why."');
test('"Against" with a near-miss "Disagree" fails', 1,
  d => edit(L(d, 'review'), '  - Against: Disagree: at Slack', '  - Against: Disagrees: at Slack'), null, 'start a split with "Against: Disagree: ..."');
test('lesson page without an intro fails', 1,
  d => edit(L(d, 'review'), 'How agent-written changes were reviewed, by agents and by people.\n\n', ''), null, 'needs a one-paragraph intro');
test('lesson page without the evidence note fails', 1,
  d => edit(L(d, 'review'), 'Evidence base: every lesson here comes from', 'Evidence: every lesson here comes from'), null, 'needs the evidence note');
test('lesson page over the size cap fails', 1,
  d => appendFileSync(L(d, 'review'), `\n[pad]: ../index.md${' '.repeat(21000)}\n`), null, 'bytes (at most 20480)');
test('bare number in a lesson sub-item fails', 1,
  d => edit(L(d, 'review'), '  - Against: None found.\n', '  - Against: None found in 7 gizmos.\n'), null, 'number "7" has no unit');
test('long quote in a lesson page fails', 1,
  d => edit(L(d, 'review'), '  - Against: None found.\n', '  - Against: None found; "these words are copied from the source".\n'), null, 'quoted span over four words');
test('stray line in a lesson list fails', 1,
  d => edit(L(d, 'review'), '  - Against: None found.\n', '  - Against: None found.\nA loose paragraph.\n'), null, 'not a lesson, a sub-item or a reference definition');
test('lesson page not in LESSON_PAGES fails', 1,
  d => cpSync(L(d, 'team'), L(d, 'extra')), null, 'lessons/extra.md: not listed in LESSON_PAGES');
test('lesson page in LESSON_PAGES but missing fails', 1,
  d => rmSync(L(d, 'team')), null, 'lessons/team.md: listed in LESSON_PAGES but missing');
test('a case that no lesson and no question cites fails', 1, d => {
  const c = caseFile(d, BUN);
  cpSync(c, caseFile(d, '2026-07-09-bun-copy.md'));
  edit(caseFile(d, '2026-07-09-bun-copy.md'), 'date: 2026-07-08', 'date: 2026-07-09');
}, null, '2026-07-09-bun-copy.md: no lesson and no checklist question cites this case');

// A [stated] lesson that cites only "Practices to copy" rests on a [stated] practice line.
const SPO = '2025-11-06-spotify-honk.md';
const SPO_ASK = '- [stated] Ask the agent after each session what its prompt was missing.';
test('[stated] lesson resting only on an [ours] practice fails', 1,
  d => edit(caseFile(d, SPO), SPO_ASK, SPO_ASK.replace('[stated]', '[ours]')), null,
  'CTX-7: [stated] but "Cases" links only "Practices to copy"');
test('[ours] lesson resting only on an [ours] practice passes', 0, d => {
  edit(caseFile(d, SPO), SPO_ASK, SPO_ASK.replace('[stated]', '[ours]'));
  edit(L(d, 'context'), '- **CTX-7** [stated]', '- **CTX-7** [ours]');
});

// from_languages: an inline list of names from LANGUAGES (scripts/lib.mjs).
test('from_languages missing fails', 1,
  d => edit(caseFile(d, BUN), 'from_languages: [Zig]\n', ''), null, 'missing key "from_languages"');
test('from_languages with an unknown language fails', 1,
  d => edit(caseFile(d, BUN), 'from_languages: [Zig]', 'from_languages: [zig]'), null, 'from_languages: "zig" is not in LANGUAGES');
test('from_languages listing a language twice fails', 1,
  d => edit(caseFile(d, BUN), 'from_languages: [Zig]', 'from_languages: [Zig, Zig]'), null, 'from_languages: a language is listed twice');
test('from_languages mixing unstated and a language fails', 1,
  d => edit(caseFile(d, BUN), 'from_languages: [Zig]', 'from_languages: [Zig, unstated]'), null, 'from_languages: [unstated] stands alone');
test('from_languages: [unstated] passes', 0,
  d => edit(caseFile(d, BUN), 'from_languages: [Zig]', 'from_languages: [unstated]'));

// Strength ceiling: the cases behind a lesson cap its strength. The tests add a fixture lesson
// (TEM-99) citing chosen cases, so they do not hang on the live cases behind real lessons, which
// change as cases arrive.
const FIXTURE_CASES = {
  airbnb: '2025-04-01-airbnb-enzyme-to-rtl.md', // user-of-tool, assertion-only
  bun: BUN, // seller-of-tool, shown-in-source
  github: '2026-09-16-github-copilot-runtime-rust.md', // seller-of-tool, shown-in-source
  slack: '2024-05-22-slack-enzyme-to-rtl.md', // user-of-tool, shown-in-source
  uber: '2026-04-07-uber-junit4-to-junit5.md', // contrast case (ai_share: little), user-of-tool
};
// The fixture's Era is computed from the cases it cites, so these tests test the strength alone.
const fixture = (strength, names, model = 'no') => d => {
  const f = L(d, 'team');
  const t = readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const cites = names.map(k => `[Fixture ${k}][fx-${k}]`).join(', ');
  const era = eraText(expectedEra(names.map(k => parseCase(caseFile(d, FIXTURE_CASES[k])).meta)));
  const lesson = `- **TEM-99** [ours] A fixture lesson for the strength tests.\n`
    + `  - Old system as oracle: no. Depends on model ability: ${model}. Strength: ${strength}. Era: ${era}.\n`
    + `  - Cases: ${cites}.\n  - Against: None found.\n`;
  const refs = names.map(k => `[fx-${k}]: ../cases/${FIXTURE_CASES[k]}#what-went-wrong`).join('\n');
  const i = t.search(/^\[[a-z0-9-]+\]: /m); // the first reference definition; the lessons end before it
  if (i < 0) throw new Error('test setup: lessons/team.md has no reference definitions');
  writeFileSync(f, `${t.slice(0, i).replace(/\n+$/, '\n')}${lesson}\n${t.slice(i).replace(/\n*$/, '\n')}${refs}\n`);
  // The fixture is a new lesson: the newest log entry names it, as the validator asks.
  edit(join(d, 'log.md'), '- **New lessons:** AGF-9, CTX-11, KNW-4, OVS-5.', '- **New lessons:** AGF-9, CTX-11, KNW-4, OVS-5, TEM-99.');
};
test('fixture lesson at its ceiling passes', 0, fixture('weak', ['airbnb']));
test('medium on one assertion-only case fails', 1, fixture('medium', ['airbnb']),
  null, 'TEM-99: strength medium needs more evidence; its cases allow at most weak');
test('strong on cases only from sellers of the tool fails', 1, fixture('strong', ['bun', 'github']),
  null, 'TEM-99: strength strong needs more evidence; its cases allow at most medium');
test('strong on two cases, one not from a seller, passes', 0, fixture('strong', ['bun', 'airbnb']));
test('a contrast case does not raise a lesson to strong', 1, fixture('strong', ['bun', 'github', 'uber']),
  null, 'TEM-99: strength strong needs more evidence; its cases allow at most medium');
test('one case that shows its data, not from a seller, allows strong', 0, fixture('strong', ['slack']));
test('fixture Era years that miss a cited case fail', 1, d => {
  fixture('strong', ['bun', 'slack'])(d);
  const p = L(d, 'team');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/(\*\*TEM-99\*\*[^\n]*\n[^\n]*Era: )2024–2026;/, '$12026;'));
}, null, 'TEM-99: the Era must give the years and models of the cases in "Cases": "Era: 2024–2026; models: Claude 2.1,');

// "May be outdated" (build.mjs): a lesson tagged yes for model ability whose most recent case is more than
// OUTDATED_MONTHS old at the reference date. Bun is dated 2026-07-08 (work 2026-05); --today fixes the date.
const outdatedRun = (model, today) => d => {
  fixture('medium', ['bun'], model)(d);
  const r = node(d, 'build.mjs', ['--today', today]);
  if (r.status !== 0) throw new Error(r.stdout + r.stderr);
  return { index: readFileSync(join(d, 'lessons', 'index.md'), 'utf8'), llms: readFileSync(join(d, 'llms.txt'), 'utf8') };
};
const marked = o => /\*\*TEM-99\*\*[^\n]*may be outdated\)/.test(o.index) && /Marked now: [^\n]*TEM-99/.test(o.llms)
  && /^## May be outdated\n(?:(?!## )[^\n]*\n)*- \*\*TEM-99\*\*/m.test(o.index);
test('a model-dependent lesson with an old newest case is marked may be outdated', 0, d => {
  if (!marked(outdatedRun('yes', '2027-07-09')(d))) throw new Error('TEM-99 not marked in lessons/index.md and llms.txt');
  return ['--check', '--today', '2027-07-09'];
}, null, null, 'build.mjs');
test('a model-dependent lesson with a recent case is not marked', 0, d => {
  if (marked(outdatedRun('yes', '2027-07-07')(d))) throw new Error('TEM-99 marked although its case is under a year old');
});
test('a lesson tagged partly is never marked', 0, d => {
  if (marked(outdatedRun('partly', '2030-01-01')(d))) throw new Error('TEM-99 marked although not tagged yes');
});
// Without --today the reference date is the newest log.md entry, never the clock.
const newLogEntry = (d, date) => edit(join(d, 'log.md'), '\n## ', `\n## ${date} — a test update\n\n- A test entry.\n\n## `);
test('the reference date is the newest log entry', 0, d => {
  fixture('medium', ['bun'], 'yes')(d);
  newLogEntry(d, '2027-07-09');
  node(d, 'build.mjs', []);
  const o = { index: readFileSync(join(d, 'lessons', 'index.md'), 'utf8'), llms: readFileSync(join(d, 'llms.txt'), 'utf8') };
  if (!marked(o)) throw new Error('TEM-99 not marked at the log date 2027-07-09');
  return ['--check'];
}, null, null, 'build.mjs');
test('build --check fails after a new log entry moves a lesson past the line, until rebuilt', 1, d => {
  fixture('medium', ['bun'], 'yes')(d);
  newLogEntry(d, '2027-07-07');
  node(d, 'build.mjs', []);
  newLogEntry(d, '2027-07-09');
  return ['--check'];
}, null, 'lessons/index.md', 'build.mjs');
test('build refuses a log.md without a dated entry', 1,
  d => { writeFileSync(join(d, 'log.md'), '# Update log\n'); return []; }, null, 'log.md needs an entry', 'build.mjs');
test('build refuses a bad --today', 2, () => ['--today', 'tomorrow'], null, '--today takes a date', 'build.mjs');

// build.mjs --check: generated files must match the sources.
test('build --check passes on the repository', 0, () => ['--check'], null, null, 'build.mjs');
test('build --check fails after hand-editing llms.txt', 1,
  d => { appendFileSync(join(d, 'llms.txt'), '\nA hand edit.\n'); return ['--check']; }, null, 'out of date: llms.txt', 'build.mjs');
test('build --check fails after a lesson change without a rebuild', 1,
  d => { edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-2** [ours]'); return ['--check']; }, null, 'lessons/index.md', 'build.mjs');
test('build refuses a case that does not parse', 1,
  d => { edit(caseFile(d, BUN), 'kind: language\n', 'kind language\n'); return []; }, null, 'cannot build', 'build.mjs');
test('build refuses a lesson without its oracle line', 1,
  d => {
    const p = L(d, 'review');
    writeFileSync(p, readFileSync(p, 'utf8').replace(/\n {2}- Old system as oracle: [^\n]*(?=\n {2}- Cases: \[GitHub: who did what\])/, ''));
    return [];
  }, null, 'REV-2: no "Old system as oracle" line', 'build.mjs');
test('build --check fails after a from_languages change (llms.txt "Moves covered")', 1,
  d => { edit(caseFile(d, INTEL), 'from_languages: [C]', 'from_languages: [C, Python]'); return ['--check']; }, null, 'out of date: llms.txt', 'build.mjs');
test('llms-full.txt carries each reference definition once', 0, d => {
  node(d, 'build.mjs', []);
  const defs = readFileSync(join(d, 'llms-full.txt'), 'utf8').match(/^\[[^\]]+\]:/gm) || [];
  const dup = defs.filter((x, i) => defs.indexOf(x) !== i);
  if (!defs.length || dup.length) throw new Error(`definitions: ${defs.length}, repeated: ${dup.join(' ')}`);
  return ['--check'];
}, null, null, 'build.mjs');
test('build --check fails after hand-editing lessons/index.md', 1,
  d => { appendFileSync(join(d, 'lessons', 'index.md'), '\nA hand edit.\n'); return ['--check']; }, null, 'out of date: lessons/index.md', 'build.mjs');

// lessons/evidence.md: one line per lesson, with tags, strength, cases and the cases its Against cites.
const evidenceOf = d => { node(d, 'build.mjs', []); return readFileSync(join(d, 'lessons', 'evidence.md'), 'utf8'); };
test('evidence.md has one line per lesson', 0, d => {
  const lessons = readdirSync(join(d, 'lessons')).filter(f => !['index.md', 'evidence.md'].includes(f))
    .reduce((s, f) => s + (readFileSync(join(d, 'lessons', f), 'utf8').match(/^- \*\*[A-Z]{3}-\d+\*\*/gm) || []).length, 0);
  const lines = (evidenceOf(d).match(/^- \*\*[A-Z]{3}-\d+\*\*/gm) || []).length;
  if (!lessons || lines !== lessons) throw new Error(`evidence.md: ${lines} lines for ${lessons} lessons`);
  return ['--check'];
}, null, null, 'build.mjs');
test('evidence.md gives a lesson its tags, cases and "none found"', 0, d => {
  fixture('strong', ['bun', 'slack'])(d);
  const line = evidenceOf(d).match(/^- \*\*TEM-99\*\*.*$/m)?.[0] || '';
  if (!line.endsWith('Oracle no; model no; strong. Cases: Bun, Slack. Against: none found.')) throw new Error(`line: ${line}`);
  return ['--check'];
}, null, null, 'build.mjs');
test('evidence.md shortens a Disagree line to its case names', 0, d => {
  fixture('strong', ['bun', 'slack'])(d);
  edit(L(d, 'team'), '[fx-slack].\n  - Against: None found.\n', '[fx-slack].\n  - Against: Disagree: Airbnb saw otherwise ([Fixture airbnb][fx-airbnb]).\n');
  appendFileSync(L(d, 'team'), `[fx-airbnb]: ../cases/${FIXTURE_CASES.airbnb}#what-went-wrong\n`);
  const line = evidenceOf(d).match(/^- \*\*TEM-99\*\*.*$/m)?.[0] || '';
  if (!line.endsWith('Against: disagree: Airbnb.')) throw new Error(`line: ${line}`);
  return ['--check'];
}, null, null, 'build.mjs');
test('build --check fails after hand-editing lessons/evidence.md', 1,
  d => { appendFileSync(join(d, 'lessons', 'evidence.md'), '\nA hand edit.\n'); return ['--check']; }, null, 'out of date: lessons/evidence.md', 'build.mjs');
test('a stray page in lessons/ still fails although evidence.md is skipped', 1,
  d => writeFileSync(join(d, 'lessons', 'stray.md'), '# Stray\n'), null, 'lessons/stray.md: not listed in LESSON_PAGES');

// Synced hand-written files: one repository slug, README's generated blocks.
const rename = d => edit(join(d, 'scripts', 'lib.mjs'), 'export const REPO_SLUGS = [', "export const REPO_SLUGS = ['someone/new-name', ");
test('build --check fails after a repository rename until rebuilt', 1,
  d => { rename(d); return ['--check']; }, null, 'lychee.toml', 'build.mjs');
test('a rebuild after a rename rewrites the old name and leaves other URLs', 0, d => {
  rename(d);
  edit(join(d, 'CONTRIBUTING.md'), 'Thanks for helping', 'See https://github.com/other/repo. Thanks for helping');
  node(d, 'build.mjs', []);
  const t = readFileSync(join(d, 'CONTRIBUTING.md'), 'utf8');
  if (t.includes('ntroccoli/ai-migrations') || !t.includes('someone/new-name/issues') || !t.includes('github.com/other/repo')) {
    throw new Error('rename not applied as expected');
  }
  return ['--check'];
}, null, null, 'build.mjs');
test('build --check fails after hand-editing the README disclosure', 1,
  d => { edit(join(d, 'README.md'), 'Disclosure: the cases', 'Disclosure: some cases'); return ['--check']; }, null, 'out of date: README.md', 'build.mjs');
test('build refuses a README without its block markers', 1,
  d => { edit(join(d, 'README.md'), '<!-- /contents -->', ''); return []; }, null, 'needs the markers', 'build.mjs');

// log.md: every entry but the oldest lists its new and changed lesson IDs, so a revisit can read only those.
const LOG_NEW = '- **New lessons:** AGF-9, CTX-11, KNW-4, OVS-5.';
test('a log entry without its impact part fails', 1,
  d => newLogEntry(d, '2026-11-15'), null, '2026-11-15 — a test update: needs a "### Checklist and lessons impact" part');
test('a log entry whose impact part lacks "New lessons" fails', 1,
  d => edit(join(d, 'log.md'), LOG_NEW, '- **Fresh lessons:** AGF-9.'), null, 'needs a "- **New lessons:**" line');
test('a log entry naming a lesson that does not exist fails', 1,
  d => edit(join(d, 'log.md'), LOG_NEW, '- **New lessons:** AGF-99.'), null, '"New lessons" names AGF-99, which no lesson page has');
test('a log entry with an empty "New lessons" line fails', 1,
  d => edit(join(d, 'log.md'), LOG_NEW, '- **New lessons:** to come.'), null, '"New lessons" names no lesson ID; write none');
test('a log entry that leaves out a lesson its changes file adds fails', 1,
  d => edit(join(d, 'log.md'), LOG_NEW, '- **New lessons:** AGF-9, CTX-11, KNW-4.'), null, 'the impact part misses OVS-5 (listed in changes/2026-11-14-second-update.md)');

// changes/<entry>.md: generated for the newest log entry from the previous entry's frozen state.
const SLUG = '2027-01-10-a-test-update';
const changes = (d, slug = SLUG) => readFileSync(join(d, 'changes', `${slug}.md`), 'utf8');
const impactEntry = (d, { checklist = 'no question changed', added = 'none', changed = 'none' } = {}) =>
  edit(join(d, 'log.md'), '\n## ', `\n## 2027-01-10 — a test update\n\n- A test entry.\n\n### Checklist and lessons impact\n\n` +
    `- **Checklist:** ${checklist}.\n- **New lessons:** ${added}.\n- **Changed lessons:** ${changed}.\n\n## `);
test('a new log entry with nothing changed gets an empty changes file and passes', 0, d => {
  impactEntry(d); node(d, 'build.mjs', []);
  if (!/- Added lessons: none\n- Changed lessons: none\n/.test(changes(d))) throw new Error(changes(d).slice(0, 600));
});
test('a lesson changed after the newest entry is listed, and the entry must name it', 1, d => {
  impactEntry(d); edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-2** [ours]'); node(d, 'build.mjs', []);
  if (!/^- Changed lessons: REV-2$/m.test(changes(d))) throw new Error(changes(d).slice(0, 600));
}, null, 'a test update: the impact part misses REV-2');
test('naming the changed lesson in the entry passes', 0, d => {
  impactEntry(d, { changed: 'REV-2 (tag)' }); edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-2** [ours]'); node(d, 'build.mjs', []);
});
test('a changed question must be named by number in the Checklist line', 1, d => {
  impactEntry(d); edit(join(d, 'checklist.md'), '5. **Can the work ship in small units', '5. **Can the work ship in tiny units');
  node(d, 'build.mjs', []);
  if (!/^- Changed questions: Q5$/m.test(changes(d))) throw new Error(changes(d).slice(0, 600));
}, null, 'its "- **Checklist:**" line misses question Q5');
test('build --check fails after hand-editing the newest changes file', 1,
  d => { appendFileSync(join(d, 'changes', '2026-11-14-second-update.md'), '\nA hand edit.\n'); return ['--check']; },
  null, 'out of date: changes/2026-11-14-second-update.md', 'build.mjs');
test('build refuses a missing changes file of an older entry', 1,
  d => { rmSync(join(d, 'changes', '2026-11-13-first-update.md')); return []; }, null, 'changes/2026-11-13-first-update.md is missing', 'build.mjs');
test('an older changes file is frozen: build leaves it as it is', 0, d => {
  impactEntry(d, { changed: 'REV-2' }); edit(L(d, 'review'), '- **REV-2** [stated]', '- **REV-2** [ours]'); node(d, 'build.mjs', []);
  if (/- Changed lessons: REV-2\b/.test(changes(d, '2026-11-14-second-update'))) throw new Error('the older file was rebuilt');
  return ['--check'];
}, null, null, 'build.mjs');

// pitfalls.md: relative links resolve.
test('pitfalls broken link fails', 1,
  d => edit(join(d, 'pitfalls.md'), '[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md', '[Intel]: cases/2026-08-24-intel-gone.md'), null, 'pitfalls.md: broken link');

rmSync(TMP, { recursive: true, force: true });
if (failed.length) { console.error(`\n${failed.length} test(s) failed:\n` + failed.join('\n\n')); process.exit(1); }
console.log(`\nall ${n} tests passed`);
