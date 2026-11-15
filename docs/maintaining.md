# Maintaining the log and the generated files

Read before opening a `log.md` entry, changing `scripts/build.mjs`, adding to what agents read
first (`llms.txt`, `lessons/index.md`), or trimming any file to meet a size cap ("Size caps" below).
Moved from `AGENTS.md`, which keeps the commands.

## Update log

`log.md`, newest entry first, prose for the why. `build.mjs` writes `changes/<date>-<title>.md`
for each entry: the lesson IDs and checklist questions it added, changed or removed since the
previous entry, and the fingerprints of the state after it. Only the newest entry's file is
rebuilt (from the previous file's fingerprints); older ones are frozen and must exist. So open a
new log entry (its heading first) before changing lessons for an update, or the changes land in
the previous entry. Every entry but the oldest has a `### Checklist and lessons impact` part with
`- **New lessons:**` and `- **Changed lessons:**` lines (lesson IDs, or "none"; "every lesson"
covers all changed ones) and a `- **Checklist:**` line naming changed questions by number. The
validator fails when the part misses an ID or question its changes file lists. A revisit reads
the changes files newer than its record's entry, never the whole log; it names entries by date
and title, since two can share a date.

## Generated files

`node scripts/build.mjs` writes `index.md` (one line per case, newest first), `lessons/index.md`
(a short table of contents for people: aspect pages with counts, "May be outdated", "By model",
where cases disagree; no list of every lesson), `lessons/evidence.md` (one line per lesson: tag,
the lesson, oracle, model and strength tags, the "may be outdated" mark, the cases it cites and
those its "Against" cites), `llms.txt` (entry point for agents: how to use, one line per lesson
page, and one line pointing to `index.md` for the cases) and `llms-full.txt` (the single
opt-in file with everything: every lesson and case line, the checklist, its report formats and the pitfalls) from the
case files, lesson pages, `checklist.md`, `docs/report-formats.md` and `pitfalls.md`. It also keeps hand-written files in
step: every URL to this repository comes from `REPO_SLUGS` in `scripts/lib.mjs` (to rename the
repository, put the new owner/name first in that line and rebuild; the build rewrites the old
name in `SYNCED` files, `lychee.toml` included), and two blocks in `README.md` (the AI
disclosure and the current counts) are written between their comment markers. The moves the
cases cover, in `index.md`, come from each case's `from_languages`; nothing is kept by hand.
`llms-full.txt` carries each reference definition once (its links are inline). "By model" in
`lessons/index.md` groups the cases' `models` into families with `modelFamily` (`scripts/lib.mjs`;
add a rule there for a new maker) and lists the lessons tagged `yes` or `partly` whose cited cases
name each family.

Reading cost drives this layout: what an agent reads at the start is paid on every run. One agent
route: `llms.txt`, then `lessons/evidence.md`, then an aspect page only for the lessons used;
`index.md` only to choose cases. `llms.txt` lists no cases, so it does not grow with each case, and
stays at or under 20 KB (20,480 bytes, `LLMS_MAX_BYTES`, checked by the validator). Only
`lessons/evidence.md` and `llms-full.txt` list every lesson; keep it so (a test checks the index
and `llms.txt`).
`lessons/index.md` stays at or under 12 KB (12,288 bytes, `INDEX_MAX_BYTES`, checked by the
validator): model families with the same lessons share a "By model" row, and "Where the cases
disagree" lists IDs per page.
`node scripts/build.mjs --check` writes nothing and exits 1 when any of them is out of date; it
must exit 0 before a commit. Never edit these files by hand: change the sources and rebuild.
`GENERATED_FILES` in `scripts/lib.mjs` names the generated files; the build fails when it is out
of step.

## Size caps

Every cap the validator enforces, and the other numbers in these rules, with where it comes from.
None was measured: no test showed that a file at the cap works better for an agent than one above
it. Each is a budget we picked (`ours`), kept because what an agent reads at the start is paid on
every run. So a cap is never a reason to lose a rule: a trim to meet one moves text to a file read
when needed and proves no rule lost (diff the rule sentences before and after, and name where each
moved one now lives); it never drops a rule that changes what an agent does. When nothing can move,
raise the cap in its own reviewed commit and update its row here.

| Cap | Limit | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- | --- |
| `AGENTS_MAX_BYTES` (`AGENTS.md`) | 8,192 bytes | the karpathy-ideas coordinator's advice (2026-11-14), from its own file of 7.5 KB, not a measurement | ours | every session paying for rules only some tasks need (`AGENTS.md` loads into each) | a rule cut to fit, or moved where the agent doing that task never looks |
| `CHECKLIST_MAX_BYTES` (`checklist.md`) | 20,480 bytes | picked with the first validator cap (2026-11-13) | ours | a checklist that grows with each case until agents skim it | seen here: trims to fit dropped working instructions twice (the worktree reason, the `wc -l` fallback, the "Other gaps" slot, the read-only line of step 9, Q11's "what must exist before the first release"); the sweep 1 and 2 reviews found them and the fix rounds restored them |
| `LESSON_MAX_BYTES` (each lesson page) | 20,480 bytes | picked with the lesson pages (2026-11-13): an agent reads a page whole | ours | a page too long to read whole | a page split by size instead of by aspect, or "Against" lines shortened past their meaning |
| `INDEX_MAX_BYTES` (`lessons/index.md`) | 12,288 bytes | picked one commit after the index stopped listing every lesson (2026-11-14; it had reached 46,128 bytes) | ours | the table of contents for people turning back into a list of every lesson | a build change that drops "May be outdated" or "Disagree" entries to fit |
| `LLMS_MAX_BYTES` (`llms.txt`) | 20,480 bytes | picked when `llms.txt` stopped listing cases (2026-11-14; it had reached 23,385 bytes) | ours | an entry point that grows with each case | cutting a how-to-use line an agent needs |
| `OUTDATED_MONTHS` | 12 months | picked with the "Depends on model ability" tag (2026-11-14) | ours | trusting a lesson about model limits that only older models showed | reading the mark as an order to drop the lesson; it asks for a re-check against newer cases |
| Lesson text | 200 characters | picked with the lesson format (2026-11-13) | ours | lesson lines that carry the case detail | a qualifier dropped to fit ("for independent units"), which widens the lesson |
| Checklist questions | 5 to 12 questions | the first checklist allowed 5 to 10 questions; raised to 12 the same night to fit the 12 it had (2026-11-13): a number bent to the content, not measured | ours | a checklist too long to run in one session | merging questions until a Check is lost; merge only checks that measure the same thing |
| Quoted span in a lesson | 4 words | the case validator's test for what counts as a quote (2026-11-13), applied to lessons too | ours | copied wording in our summaries | none on behaviour; a paraphrase is checked against the case instead |
| Quote in a case | one quote, 15 words | picked with the case format (2026-11-13), for copyright care | ours | copied text in our summaries | none on behaviour; the case loses colour, not facts |
| Case summary | 160 characters, and a summary paragraph of 40 to 150 words | picked with the case format (2026-11-13) | ours | index lines and summaries that carry the whole case | a failure or a limit left out of the summary to fit; "What went wrong" keeps it |
| Practice text | 200 characters | picked with the case format (2026-11-13) | ours | practices that carry the case detail | a qualifier dropped to fit, which widens the practice |

## One line per case

`index.md` (and `llms-full.txt`) list each case on one line, so an agent can pick cases without
opening them; `llms.txt` points to `index.md` instead of repeating the lines. The line is built
from the front matter only:

```markdown
- [<title>](cases/<file>) — <kind>, <from> to <to>; AI share: <ai_share>; evidence: <evidence>; author: <author_relation>; cost: <cost>. <summary>
```

Example:

```markdown
- [Airbnb moves 3.5K React test files off Enzyme onto React Testing Library](cases/2025-04-01-airbnb-enzyme-to-rtl.md) — test-framework, Enzyme (React component tests) to React Testing Library; AI share: most; evidence: assertion-only; author: user-of-tool; cost: unstated. An LLM pipeline with per-file validation steps and retries migrated 97% of about 3,500 React test files; people finished the rest by hand.
```
