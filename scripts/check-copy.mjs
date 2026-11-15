// SPDX-License-Identifier: MIT
// Find runs of N or more consecutive words (default 5) that a case shares with its source text.
// The source text is not in this repository; pass the files that hold it.
// Usage: node scripts/check-copy.mjs <case.md> <source file or folder>... [--min 5]
// Skipped in the case: the front matter keys, the values of `models:` and `tools:` (named exactly
// as the source names them, by rule), the "In their words" section (the one allowed quote), link
// targets, URLs and inline code. Exit 1 when a run is found.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const mi = args.indexOf('--min');
const MIN = mi >= 0 ? Number(args.splice(mi, 2)[1]) : 5;
const [casePath, ...srcArgs] = args;
if (!casePath || !srcArgs.length || !(MIN >= 2)) {
  console.error('usage: node scripts/check-copy.mjs <case.md> <source file or folder>... [--min 5]');
  process.exit(2);
}
for (const p of [casePath, ...srcArgs]) if (!existsSync(p)) { console.error(`not found: ${p}`); process.exit(2); }

// Lowercase words; curly quotes and dashes folded so formatting does not hide a copy.
const words = text => text
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/\]\([^)]*\)/g, ']')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/`[^`]*`/g, ' ')
  .replace(/[’‘]/g, "'")
  .toLowerCase()
  .match(/[\p{L}\p{N}]+(?:['.,][\p{L}\p{N}]+)*/gu) || [];

// A folder is read recursively, so a folder of source texts can be passed whole; links and
// junctions inside it are not followed.
const listSources = p => (statSync(p).isDirectory()
  ? readdirSync(p, { withFileTypes: true }).filter(e => !e.isSymbolicLink()).flatMap(e => (e.isDirectory()
    ? listSources(join(p, e.name)) : /\.(md|txt)$/.test(e.name) ? [join(p, e.name)] : []))
  : [p]);
const srcFiles = srcArgs.flatMap(listSources);
const grams = new Set();
for (const f of srcFiles) {
  const w = words(readFileSync(f, 'utf8'));
  for (let i = 0; i + MIN <= w.length; i++) grams.add(w.slice(i, i + MIN).join(' '));
}
// Nothing to compare must never pass as "no copy found".
if (!grams.size) { console.error(`no source text read from: ${srcArgs.join(', ')} (.md or .txt files)`); process.exit(2); }

const text = readFileSync(casePath, 'utf8').replace(/\r\n/g, '\n')
  .replace(/^---\n[\s\S]*?\n---\n/, m => m.replace(/^(?:models|tools):.*$/gm, '').replace(/^[a-z_]+:/gm, ''))
  .replace(/^## In their words\n[\s\S]*?(?=^## |(?![\s\S]))/m, '');
const w = words(text);
const hits = [];
for (let i = 0; i + MIN <= w.length; i++) {
  if (!grams.has(w.slice(i, i + MIN).join(' '))) continue;
  let j = i + MIN; // extend the run while the next window still matches
  while (j < w.length && grams.has(w.slice(j - MIN + 1, j + 1).join(' '))) j++;
  hits.push(w.slice(i, j).join(' '));
  i = j - 1;
}
if (hits.length) {
  console.error(`${hits.length} run(s) of ${MIN}+ words shared with the source:\n` + hits.map(h => '  ' + h).join('\n'));
  process.exit(1);
}
console.log(`no run of ${MIN}+ words shared with the source (${w.length} words checked).`);
