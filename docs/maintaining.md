# Maintaining the log and the generated files

Read before opening a `log.md` entry, changing `scripts/build.mjs`, or adding to what agents read
first (`llms.txt`, `lessons/index.md`). Moved from `AGENTS.md`, which keeps the commands.

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
opt-in file with everything: every lesson and case line, the checklist and the pitfalls) from the
case files, lesson pages, `checklist.md` and `pitfalls.md`. It also keeps hand-written files in
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
