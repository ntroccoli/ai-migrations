// Validate case files and the checklist. Rules: AGENTS.md "Case files".
// Usage: node scripts/validate.mjs            (all of cases/ plus checklist.md)
//        node scripts/validate.mjs <file|dir>  (only those cases; no checklist check)
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import {
  CASES_DIR, CHECKLIST, NOTICE, SOURCE_TYPES, KINDS, AI_SHARES, RELATIONS, EVIDENCE, OUTCOMES,
  STATUSES, BASES, REQUIRED, SECTIONS, NUMBERS_HEADER, UNITS, SCALES, parseCase, listCases, sections,
} from './lib.mjs';

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const pad = n => String(n).padStart(2, '0');
const localDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = localDate(new Date()); // local, not UTC: the owner works at UTC-3
// A real calendar date: Date.parse accepts 2025-02-30 and rolls it over, so compare the round trip.
const realDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
const isHttps = u => /^https:\/\/[^\s<>"]+$/.test(u || '');
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
const notice = existsSync(NOTICE) ? readFileSync(NOTICE, 'utf8').replace(/\r\n/g, '\n') : '';

// ---- Units ----------------------------------------------------------------------------------
// A number is a word that starts with a digit (after an optional ~ ≈ $ € £ or opening bracket),
// such as 3,500 or 3.5K or 4.0x or 60–90%. Not numbers: digits inside a word (GPT-5.6, E0425,
// o200k), inline code, link targets, dates (2025-04-01, 2025-04), periods (2023..2024) and list
// markers, ordinals (4th). Exempt: a year (1900-2099) with no unit after it, a small number right
// after a capitalised name that does not start a sentence (Opus 4.8, Java 21, August 21), and a
// number after a label word (part 4, step 2). Every other number needs a unit: a % or x suffix, a
// currency sign, or a word from UNITS within the next three words (scale words such as "million"
// may sit between). In "5 to 10 files" or "120 of 140 files" the first number takes the unit of
// the second. Returns the numbers that lack a unit and the count of numbers that need a source.
const NUM = /^[~≈(]*([$€£]?)(\d+(?:,\d{3})*(?:\.\d+)?(?:[–-]\d+(?:,\d{3})*(?:\.\d+)?)?)([a-zA-Z%]*)\+?[)\]]*[.,;:!?)]*$/;
const CONNECTORS = new Set(['to', 'of', 'and', 'or', 'out', 'in', 'from', 'the', 'by', '–', '-', '/', 'vs']);
const STARTERS = new Set(['The', 'A', 'An', 'In', 'By', 'Over', 'About', 'Only', 'All', 'Each', 'Some',
  'Of', 'For', 'With', 'After', 'Before', 'Its', 'Their', 'These', 'Those', 'At', 'On', 'To', 'From',
  'Up', 'Nearly', 'Around', 'Roughly', 'Just', 'And', 'But', 'Then', 'Within', 'Across', 'Under']);
// Words after which a number is a label, not a quantity: part 4, step 2, version 3.
const LABELS = new Set(['part', 'parts', 'step', 'phase', 'version', 'figure', 'table', 'section', 'chapter', 'round']);
const isUnit = w => { const x = w.toLowerCase().split('-').pop(); return UNITS.has(x) || (x.endsWith('s') && UNITS.has(x.slice(0, -1))); };
const bare = t => t.replace(/^[^\p{L}\p{N}%]+|[^\p{L}\p{N}%]+$/gu, '');

function checkUnits(text) {
  const clean = text
    .replace(/`[^`]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\b\d{4}(-\d{2}){1,2}\b/g, ' ')
    .replace(/\b\d{4}(-\d{2})?\.\.\d{4}(-\d{2})?\b/g, ' ')
    .replace(/\*+|_{2,}|\[|\]/g, ' ')
    .replace(/^\s*(\d+\.|[-|>])\s/gm, ' ');
  const toks = clean.split(/\s+/).filter(Boolean);
  const endsClause = t => /[.,;:!?)]$/.test(t);
  // Does the number at toks[i] have a unit? `hops` limits how far "5 to 10 files" may chain.
  const look = (i, hops = 0) => {
    const [, currency, , suffix] = toks[i].match(NUM);
    if (currency || suffix === '%' || /^x$/i.test(suffix) || isUnit(suffix)) return true;
    if (suffix && !SCALES.has(suffix.toLowerCase())) return false;
    if (endsClause(toks[i])) return false;
    for (let j = i + 1, n = 0; j < toks.length && n < 3; j++) {
      if (!SCALES.has(bare(toks[j]).toLowerCase())) n++; // scale words do not use up the three
      if (NUM.test(toks[j])) {
        const between = toks.slice(i + 1, j).map(t => bare(t).toLowerCase());
        return hops < 3 && between.every(b => CONNECTORS.has(b)) && look(j, hops + 1);
      }
      if (toks[j] === '|') return false; // a table cell ends here
      if (isUnit(bare(toks[j]))) return true;
      if (endsClause(toks[j])) return false;
    }
    return false;
  };
  let need = 0;
  const missing = [];
  toks.forEach((t, i) => {
    const m = t.match(NUM);
    if (!m) return;
    const core = m[2];
    if (/^(st|nd|rd|th)$/i.test(m[3])) return; // an ordinal: 4th
    const hasUnit = look(i);
    if (!m[1] && !m[3] && /^(19|20)\d\d$/.test(core) && !hasUnit) return; // a year (1999 files is a quantity)
    const prev = toks[i - 1] || '';
    if (LABELS.has(bare(prev).toLowerCase())) return; // part 4
    // A name before a small number (Opus 4.8), but not a word that starts a sentence.
    const sentenceStart = i < 2 || /[.!?:]$/.test(toks[i - 2]);
    if (/^\d{1,3}(\.\d+)?$/.test(core) && /^[A-Z][\p{L}.-]*$/u.test(prev) && !STARTERS.has(prev) && !sentenceStart) return;
    need++;
    if (!hasUnit) missing.push(t.replace(/[.,;:!?)]+$/, ''));
  });
  return { need, missing };
}

// Split a body into blocks: headings, paragraphs, list items, table rows, quote lines.
// `offset` is the number of file lines before the body, so reported lines match the file.
function blocks(body, offset = 0) {
  const out = [];
  let cur = null;
  let inCode = false;
  body.split('\n').forEach((l, i) => {
    if (/^```/.test(l)) { inCode = !inCode; cur = null; return; }
    if (inCode) return;
    const start = { text: l, line: offset + i + 1 };
    if (!l.trim()) cur = null;
    else if (/^#{1,6} /.test(l)) { out.push({ ...start, heading: true }); cur = null; }
    else if (/^\|/.test(l) || /^>/.test(l)) { out.push({ ...start, quote: /^>/.test(l) }); cur = null; }
    else if (/^\s*([-*]|\d+\.)\s/.test(l) && !/^\s{2,}/.test(l)) { cur = { ...start }; out.push(cur); }
    else if (cur) cur.text += '\n' + l;
    else { cur = { ...start }; out.push(cur); }
  });
  return out;
}

// ---- Cases ----------------------------------------------------------------------------------
function validateCase(c) {
  const { file, path, meta, body, error } = c;
  if (error) return err(file, error);
  for (const k of REQUIRED) if (!(k in meta)) err(file, `missing key "${k}"`);
  for (const k of Object.keys(meta)) if (!REQUIRED.includes(k)) err(file, `unknown key "${k}"`);

  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file)) err(file, 'file name must be YYYY-MM-DD-company-what.md');
  if (!realDate(meta.date)) err(file, 'date must be a real date, YYYY-MM-DD');
  else {
    if (!file.startsWith(meta.date)) err(file, 'file name must start with the date');
    if (meta.date > today) err(file, `date ${meta.date} is in the future`);
  }
  if (!meta.title) err(file, 'title is empty');
  if (!meta.company) err(file, 'company is empty');
  if (!meta.summary || meta.summary.length > 160) err(file, 'summary: one sentence, at most 160 characters');
  if (!isHttps(meta.source_url)) err(file, 'source_url must be an https URL');
  if (!Array.isArray(meta.also)) err(file, 'also must be an inline list, e.g. []');
  else for (const u of meta.also) if (!isHttps(u)) err(file, `also: bad URL ${u}`);
  const enums = { source_type: SOURCE_TYPES, author_relation: RELATIONS, evidence: EVIDENCE, kind: KINDS,
    ai_share: AI_SHARES, outcome: OUTCOMES, status: STATUSES };
  for (const [k, vals] of Object.entries(enums)) if (k in meta && !vals.includes(meta[k])) err(file, `${k} must be one of ${vals.join(', ')}`);
  for (const k of ['from', 'to', 'size', 'duration', 'people']) {
    if (typeof meta[k] !== 'string' || !meta[k]) { err(file, `${k}: short text, or "unstated"`); continue; }
    for (const n of checkUnits(meta[k]).missing) err(file, `${k}: number "${n}" has no unit`);
  }
  // cost: the spend with its unit (money, tokens, compute), or "unstated".
  if (typeof meta.cost !== 'string' || !meta.cost) err(file, 'cost: the spend with its unit, or "unstated"');
  else if (meta.cost !== 'unstated') {
    const { need, missing } = checkUnits(meta.cost);
    if (!need) err(file, 'cost: give an amount with its unit (for example ~$120,000), or "unstated"');
    for (const n of missing) err(file, `cost: number "${n}" has no unit`);
  }
  for (const k of ['tools', 'models']) if (!Array.isArray(meta[k]) || !meta[k].length) err(file, `${k}: an inline list, or [unstated]`);
  if (!/^(unstated|\d{4}(-\d{2})?(\.\.\d{4}(-\d{2})?)?)$/.test(meta.period || '')) err(file, 'period: YYYY, YYYY-MM, a range A..B, or unstated');
  if (meta.status === 'superseded') {
    if (!meta.superseded_by) err(file, 'superseded needs superseded_by');
    else if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(meta.superseded_by) || meta.superseded_by === file) err(file, `superseded_by must name another case file`);
    else if (!existsSync(join(dirname(path), meta.superseded_by))) err(file, `superseded_by "${meta.superseded_by}" not found`);
    else if (statusOf.has(meta.superseded_by) && statusOf.get(meta.superseded_by) !== 'current') err(file, `superseded_by "${meta.superseded_by}" is itself superseded; point to the current case`);
    // Only a later account of the same migration by the same company supersedes a case.
    else if (companyOf.has(meta.superseded_by) && companyOf.get(meta.superseded_by) !== meta.company) err(file, `superseded_by "${meta.superseded_by}" is another company's case; only the same company's later account of the same migration supersedes`);
  } else if (meta.superseded_by) err(file, 'superseded_by set but status is current');

  // Title, summary paragraph, sections in order.
  const lines = body.split('\n');
  const h1 = lines.findIndex(l => /^# /.test(l));
  if (h1 < 0 || lines[h1].slice(2).trim() !== meta.title) err(file, 'first heading must equal the title');
  const firstH2 = lines.findIndex(l => /^## /.test(l));
  const summaryWords = words(lines.slice(h1 + 1, firstH2 < 0 ? undefined : firstH2).join(' '));
  if (summaryWords < 40 || summaryWords > 150) err(file, `summary paragraph has ${summaryWords} words (40 to 150)`);
  const secs = sections(body);
  const names = secs.map(s => s.name);
  const expected = SECTIONS.filter(s => !s.optional || names.includes(s.name)).map(s => s.name);
  if (names.join('|') !== expected.join('|')) err(file, `sections must be, in order: ${expected.join(', ')} (found: ${names.join(', ')})`);
  const sec = n => secs.find(s => s.name === n)?.text ?? '';
  for (const s of secs) if (!s.text) err(file, `section "${s.name}" is empty`);

  // The case's own source URLs: links to them count as source links.
  const sources = [meta.source_url, ...(Array.isArray(meta.also) ? meta.also : [])]
    .filter(u => typeof u === 'string' && u).map(u => u.replace(/\/$/, ''));
  const isSource = u => sources.some(s => u.split('#')[0].replace(/\/$/, '') === s);

  // Who did what: the three bullets.
  for (const who of ['AI', 'Rule-based tools', 'People']) {
    if (!new RegExp(`^- \\*\\*${who}:\\*\\*\\s+\\S`, 'm').test(sec('Who did what'))) err(file, `"Who did what" needs "- **${who}:** ..."`);
  }
  // What went wrong: never empty, and it names what the source leaves out.
  const wrong = sec('What went wrong');
  if (!wrong) err(file, '"What went wrong" is empty; write "The source reports none." when it does');
  if (!/^- \*\*Not reported:\*\*\s+\S/m.test(wrong)) err(file, '"What went wrong" needs "- **Not reported:** ..." (what the source leaves out)');
  // Practices: one line each.
  const prac = sec('Practices to copy').split('\n').filter(l => l.trim());
  if (!prac.length) err(file, '"Practices to copy" needs at least one item');
  // Each: `- [stated] text ([Section](source-url#anchor))` or `- [ours] ...`, one line.
  for (const l of prac) {
    const p = l.trimEnd().match(/^- \[(stated|ours)\] (.+) \(\[[^\]]+\]\((https:[^)\s]+)\)\)$/);
    if (!p) { err(file, `practice must be one line: "- [stated] or [ours] text ([Section](source link))": "${l.slice(0, 50)}"`); continue; }
    if (p[2].length > 200) err(file, `practice text longer than 200 characters: "${p[2].slice(0, 50)}..."`);
    if (checkUnits(p[2]).need) err(file, `practice holds a number (keep numbers in the Numbers table): "${p[2].slice(0, 50)}"`);
    if (!isSource(p[3])) err(file, `practice must link a section of this case's source: "${p[2].slice(0, 50)}"`);
  }

  // Links: well-formed external links, relative links that resolve.
  const noCode = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  for (const [, target] of noCode.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (/^https?:/.test(target)) { if (!isHttps(target)) err(file, `link must be https: ${target}`); continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // mailto: and other schemes are not files
    const t = target.split('#')[0];
    if (t && !existsSync(resolve(dirname(path), t))) err(file, `broken link ${target}`);
  }

  // Numbers table.
  const tbl = sec('Numbers').split('\n').filter(l => l.startsWith('|'));
  if (tbl[0] !== NUMBERS_HEADER) err(file, `"Numbers" table header must be: ${NUMBERS_HEADER}`);
  if (!/^\|(\s*:?-{3,}:?\s*\|){4}$/.test(tbl[1] || '')) err(file, '"Numbers" table needs a | --- | separator row under the header');
  const rows = tbl.slice(2); // a cell must not contain "|": write it out instead
  if (!rows.length) err(file, '"Numbers" table has no rows');
  for (const r of rows) {
    const cells = r.split('|').slice(1, -1).map(x => x.trim());
    if (cells.length !== 4) { err(file, `Numbers row needs 4 cells: ${r.slice(0, 60)}`); continue; }
    if (!cells[0]) err(file, `Numbers row has an empty Number: ${r.slice(0, 60)}`);
    if (!BASES.includes(cells[2])) err(file, `Numbers row Basis "${cells[2]}" must be one of ${BASES.join(', ')}`);
    if (![...cells[3].matchAll(/\]\((https:[^)\s]+)\)/g)].some(m => isSource(m[1]))) err(file, `Numbers row needs a source link: ${r.slice(0, 60)}`);
  }

  // Every number has a unit; every block with a number links to the source.
  for (const b of blocks(body, c.bodyOffset)) {
    if (b.quote) continue; // quoted words are kept as written
    const { need, missing } = checkUnits(b.text);
    for (const n of missing) err(file, `line ${b.line}: number "${n}" has no unit`);
    if (need && !b.heading && ![...b.text.matchAll(/\]\((https:[^)\s]+)\)/g)].some(m => isSource(m[1]))) {
      err(file, `line ${b.line}: a block with a number needs a link to the source`);
    }
  }

  // Quotes: at most one, 15 words or fewer, in "In their words", linked, listed in NOTICE.md.
  // A quote is a run of "> " lines (the "> —" attribution line excepted), joined, whatever its marks.
  const quoteLines = [];
  let run = null;
  for (const l of noCode.split('\n')) {
    if (/^>/.test(l) && !/^>\s*—/.test(l)) { if (run === null) { run = quoteLines.length; quoteLines.push(''); } quoteLines[run] += ' ' + l.replace(/^>\s*/, ''); }
    else run = null;
  }
  const prose = noCode.split('\n').filter(l => !/^>/.test(l)).join('\n');
  const spans = [/"([^"\n]+)"/g, /“([^”\n]+)”/g, /‘([^’\n]+)’/g].flatMap(re => [...prose.matchAll(re)].map(m => m[1]));
  const inline = spans.filter(q => words(q) > 4);
  const nQuotes = quoteLines.length + inline.length;
  if (nQuotes > 1) err(file, `${nQuotes} quotes (at most one; a quoted span over four words counts)`);
  for (const q of inline) err(file, `quote outside "In their words": "${q.slice(0, 50)}"`);
  for (const l of quoteLines) {
    const q = l.trim().replace(/^["“]/, '').replace(/["”]$/, '').trim();
    if (words(q) > 15) err(file, `quote has ${words(q)} words (max 15)`);
    if (!sec('In their words').includes(q)) err(file, 'the quote belongs in "In their words"');
    if (!notice.includes(q)) err(file, 'the quote is not listed in NOTICE.md');
  }
  if (quoteLines.length) {
    const attr = sec('In their words').split('\n').find(l => /^>\s*—/.test(l)) || '';
    if (![...attr.matchAll(/\]\((https:[^)\s]+)\)/g)].some(m => isSource(m[1]))) err(file, 'quote needs "> — Name, role, date" with a source link');
  }
}

// ---- Checklist ------------------------------------------------------------------------------
function validateChecklist(caseFiles) {
  const f = 'checklist.md';
  if (!existsSync(CHECKLIST)) return err(f, 'missing');
  const lines = readFileSync(CHECKLIST, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const qs = [];
  let cur = null;
  for (const l of lines) {
    const q = l.match(/^(\d+)\. \*\*(.+?)\*\*/);
    if (q) { cur = { title: q[2], text: l }; qs.push(cur); } else if (/^#/.test(l)) cur = null; else if (cur) cur.text += '\n' + l;
  }
  if (qs.length < 5 || qs.length > 12) err(f, `${qs.length} questions (5 to 12)`);
  for (const q of qs) {
    if (!/\bCheck:/.test(q.text)) err(f, `"${q.title}" has no "Check:" step`);
    if (!/\bEvidence:\s+\S/.test(q.text)) err(f, `"${q.title}" has no "Evidence:" line (what the cases show, in our words)`);
    const links = [...q.text.matchAll(/\]\((?:\.\/)?cases\/([^)#\s]+\.md)[^)]*\)/g)].map(m => m[1]);
    if (!links.length) err(f, `"${q.title}" links to no case`);
    for (const l of links) if (!caseFiles.has(l)) err(f, `"${q.title}" links to missing case ${l}`);
  }
  if (!lines.some(l => /^## Report format/.test(l))) err(f, 'needs a "## Report format" section');
  return qs.length;
}

// ---- Run ------------------------------------------------------------------------------------
const args = process.argv.slice(2);
const paths = [];
for (const a of args.length ? args : [CASES_DIR]) {
  if (!existsSync(a)) { console.error(`not found: ${a}`); process.exit(2); }
  if (statSync(a).isDirectory()) paths.push(...listCases(a));
  else if (a.endsWith('.md')) paths.push(resolve(a));
  else { console.error(`not a case file (.md): ${a}`); process.exit(2); }
}
const cases = paths.map(parseCase);
const statusOf = new Map(cases.map(c => [c.file, c.meta.status]));
const companyOf = new Map(cases.map(c => [c.file, c.meta.company]));
cases.forEach(validateCase);
const nq = args.length ? null : validateChecklist(new Set(cases.map(c => c.file)));

if (errors.length) {
  console.error(`${errors.length} problem(s):\n` + errors.map(e => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`${cases.length} case file(s) valid.` + (nq === null ? '' : ` checklist.md valid: ${nq} questions, each linked to a case.`));
