# Maintaining the log and the generated files

Read before opening a `log.md` or `corrections.md` entry, changing `scripts/build.mjs`, adding to what agents read
first (`llms.txt`, `lessons/index.md`), or removing or moving text in any file ("Sizes and format limits" below).
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

## Corrections

`corrections.md` is hand-written and validated. It lists what we published wrong in a way a
reader's project may have acted on, so a project that applied it can find and repair it; every
revisit reads it first (both README routes, checklist step 10, `docs/applying-lessons.md` step 7),
and the record names the entries checked. Under `## Entries` it holds "None yet." or entries,
numbered from COR-1, IDs never reused:

```markdown
### COR-1: <what was wrong, in a few words>

- **What was wrong:** <the item, and why it read stronger than its evidence or misled>.
- **Published:** <first and last date (YYYY-MM-DD) or commit, and the releases between>.
- **How to recognise it:** <what a project that applied it shows: a record row, a check, a file>.
- **How to find what it changed:** <the record first, then the git history of the files it touched>.
- **What to propose:** <the options for the project's owner, each with its trade-off; the owner decides>.
```

Add an entry when a published threshold, hard rule or lesson is found wrong or stronger than its
evidence and a project could have acted on it (cut, capped, deleted, stopped, or skipped work
because of it): a behaviour check that shows the harm, a field report, a sceptic pass. A
wording that read stronger but led to no harm in a behaviour check needs no entry; fix it and say
so in the log. While an entry exists, `llms.txt` and README name it and ask anyone who ran a route
during its span to run the revisit again (`build.mjs` writes both from the entries).

## Generated files

`node scripts/build.mjs` writes `index.md` (one line per case, newest first), `lessons/index.md`
(a short table of contents for people: aspect pages with counts, "May be outdated", "By model",
where cases disagree; no list of every lesson), `lessons/evidence.md` (one line per lesson: tag,
the lesson, oracle, model and strength tags, the "may be outdated" mark, the cases it cites and
those its "Against" cites), `llms.txt` (entry point for agents: how to use, one line per lesson
page, and one line pointing to `index.md` for the cases) and `llms-full.txt` (the single
opt-in file with everything: the corrections, every lesson and case line, the checklist and its guide, its report
formats and the pitfalls) from the case files, lesson pages, `corrections.md`, `checklist.md`, `guide/`,
`docs/report-formats.md` and `pitfalls.md`. It also keeps hand-written files in
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
`index.md` only to choose cases. The checklist route: `checklist.md` whole, then `guide/q<n>.md`
only for a question with a finding to write up (the guide holds the case evidence the questions
once carried, so the checklist stays short). `llms.txt` lists no cases, so it does not grow with each case; its
size, like that of every file an agent may read whole, is in the validator's size report ("Sizes and
format limits" below), never a failure. Only `lessons/evidence.md` and `llms-full.txt` list every
lesson; keep it so (a test checks the index and `llms.txt`).
`lessons/index.md` stays a short table of contents: model families with the same lessons share a
"By model" row, and "Where the cases disagree" lists IDs per page.
`node scripts/build.mjs --check` writes nothing and exits 1 when any of them is out of date; it
must exit 0 before a commit. Never edit these files by hand: change the sources and rebuild.
`GENERATED_FILES` in `scripts/lib.mjs` names the generated files; the build fails when it is out
of step.

## Sizes and format limits

No file has a byte cap. Our caps were budgets we picked (`ours`), never measured: no test showed
that a file at a cap works better for an agent than one above it, and trims to meet
`checklist.md`'s cap dropped five working instructions in sweeps 1 and 2 (the worktree reason, the
`wc -l` fallback, the "Other gaps" slot, now "Other findings", the read-only line of step 9, Q11's
"what must exist before the first release"; the sweep reviews found them and the fix rounds
restored them). So the validator reports sizes and fails on none: each full run prints the bytes
of every file an agent may read whole (`sizeReportFiles` in `scripts/lib.mjs`) and its growth since
the sizes the previous log entry's `changes/` file recorded. Read the report for reading cost: what
an agent reads at the start is paid on every run, and a missing instruction costs a wrong run.

Removing or moving text, in any file:

- Remove a sentence only when it duplicates a live line or is stale, never for a size.
- A moved line keeps a pointer from a file that loads at the start (`AGENTS.md`, `llms.txt`,
  `checklist.md`), so the agent doing that task still finds it.
- Every cut or move lists, in its commit message or report, each sentence that leaves, where it
  went (or which live line it duplicates, or why it is stale) and whether it still drives
  behaviour. Count by sentence, not by line (**maintainer only**: the private archive's
  `behaviour-checks/rule-diff.mjs` prints each sentence of the old files found in no new file).

The limits still enforced are format rules with a reason other than size. A failing line limit is
never a reason to drop a qualifier: split the line or move detail to a sub-item (the validator's
message says so). `LIMITS` in `scripts/lib.mjs` names each row below with what the validator does
with it (reported, enforced, a warning, or a mark that removes nothing); the validator checks that
the rows and the code agree.

| Name | Limit | Status | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- | --- | --- |
| `SIZE_REPORT` | the bytes of `AGENTS.md`, `llms.txt`, `checklist.md`, `lessons/evidence.md`, `lessons/index.md` and each lesson page, and their growth since the previous log entry | reported | replaced five byte caps on 2026-11-21 (`AGENTS_MAX_BYTES` 8 KB, `CHECKLIST_MAX_BYTES` and `LESSON_MAX_BYTES` 20 KB, `INDEX_MAX_BYTES` 12 KB, `LLMS_MAX_BYTES` 20 KB; picked 2026-11-13 to 2026-11-14, none measured), after the karpathy-ideas coordinator withdrew the advice behind the 8 KB cap and its work setup turned its size gate into a report | ours | reading cost rising with each case unseen | reading the report as a cap again and cutting to keep a number down; remove for a reason only (above) |
| `SUMMARY_MAX_CHARS` | a case's `summary`: one sentence of 160 characters | enforced | picked with the case format (2026-11-13): it is the case's line in `index.md`, which an agent scans to choose cases | ours | index lines that carry the whole case | a failure or a limit left out of the summary to fit; "What went wrong" keeps it, and the message says so |
| `LINE_MAX_CHARS` | a lesson's text and a practice's text: 200 characters | enforced | picked with the lesson and case formats (2026-11-13): one line each in `lessons/evidence.md`, `llms-full.txt` and a case's practices | ours | lesson and practice lines that carry the case detail | a qualifier dropped to fit ("for independent units"), which widens the lesson; the message names the fix: split the line or move detail to a sub-item |
| `QUOTE_MAX_WORDS` | one quote per case, of 15 words | enforced | picked with the case format (2026-11-13) for licence and fair-use care; karpathy-ideas keeps the same rule | ours | copied text in our summaries | none on behaviour; the case loses colour, not facts |
| `SPAN_MAX_WORDS` | a quoted span of more than 4 words counts as a quote (in a lesson, none is allowed) | enforced | the case validator's test for what counts as a quote (2026-11-13), applied to lessons too: lessons are in our own words | ours | copied wording in our summaries | none on behaviour; a paraphrase is checked against the case instead |
| `SUMMARY_WORDS` | a case's summary paragraph: 40 to 150 words | warning | picked with the case format (2026-11-13); a size alone, so a note since 2026-11-21 | ours | summaries that carry the whole case, or say nothing | a failure or a limit left out to fit; as a note it asks for a look, never a cut |
| `QUESTIONS` | checklist questions: 5 to 12 | warning | the first checklist allowed 5 to 10, raised to 12 the same night to fit the 12 it had (2026-11-13): a number bent to the content, not measured; a note since 2026-11-21 | ours | a checklist too long to run in one session | merging questions until a Check is lost; merge only checks that measure the same thing |
| `OUTDATED_MONTHS` | 12 months | mark | picked with the "Depends on model ability" tag (2026-11-14); it marks a lesson and removes nothing | ours | trusting a lesson about model limits that only older models showed | reading the mark as an order to drop the lesson; it asks for a re-check against newer cases |

Why the line limits still fail and the counts only warn (2026-11-21): the line limits serve a
format (one line per lesson or practice in the generated lists, as the summary is one index line),
and their recorded harm comes from the fix chosen at the moment of failure; the failing message is
read exactly then, so it names the safe fix. A note would let lines grow into case detail with
nothing naming that fix. The question count and the paragraph length serve no format: their
numbers were picked or bent to the content, and the harm they risk (merging questions until a
Check is lost, a failure cut from a summary) is what a failing check pushes toward.

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
