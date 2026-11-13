// Broken-copy tests for scripts/validate.mjs: copy the repository's cases, checklist and scripts
// into .test-tmp/ (git-ignored), break one thing per test, and check the validator's exit code.
// Usage: node scripts/test-validate.mjs   (exit 1 when a test fails; .test-tmp/ is removed)
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './lib.mjs';

const TMP = join(ROOT, '.test-tmp');
const PARTS = ['scripts', 'cases', 'checklist.md', 'pitfalls.md', 'NOTICE.md'];
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
  const t = readFileSync(file, 'utf8');
  if (!t.includes(from)) throw new Error(`test setup: "${from}" not in ${file}`);
  writeFileSync(file, t.replace(from, to));
};
const run = (dir, args = []) => spawnSync(process.execPath, [join(dir, 'scripts', 'validate.mjs'), ...args], { cwd: dir, encoding: 'utf8' });
// expect: 0 (valid), 1 (problems), 2 (usage); `want` must appear in the output when given.
function test(name, expect, setup, args, want) {
  const dir = copy();
  let r;
  try { r = run(dir, setup(dir) || args || []); } catch (e) { failed.push(`${name}: ${e.message}`); return; }
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
test('checklist reference to a missing case fails', 1,
  d => edit(join(d, 'checklist.md'), '[Bun]: cases/2026-07-08-bun-zig-to-rust.md', '[Bun]: cases/2026-07-08-bun-missing.md'), null, 'missing case 2026-07-08-bun-missing.md');
test('checklist question with no case fails', 1,
  d => edit(join(d, 'checklist.md'), '   Cases: [GitHub][], [Bun][], [Slack][], [Google][].\n', ''), null, 'links to no case');

// pitfalls.md: relative links resolve.
test('pitfalls broken link fails', 1,
  d => edit(join(d, 'pitfalls.md'), '[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md', '[Intel]: cases/2026-08-24-intel-gone.md'), null, 'pitfalls.md: broken link');

rmSync(TMP, { recursive: true, force: true });
if (failed.length) { console.error(`\n${failed.length} test(s) failed:\n` + failed.join('\n\n')); process.exit(1); }
console.log(`\nall ${n} tests passed`);
