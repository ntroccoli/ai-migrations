# Applying the lessons outside a migration

For large AI-driven work that is not a migration: compare how a project's agents and sessions
work with the [lessons](../lessons/index.md), propose changes, and keep a record of what held.
The [checklist](../checklist.md) does the same before a migration; this page follows its method,
report and record, so both routes read alike. README "Learning from the lessons" gives the
prompts.

## How to run it

1. Run it in a fresh session on the project, changing nothing there. If the session that did the
   work is still running, first ask it to write an events file with counts of what went wrong in
   its coordination (lost messages, reruns, requests outside its scope), each figure labelled
   "recorded"; measure everything else from the repository.
2. Choose lessons from [lessons/evidence.md](../lessons/evidence.md), one line each: the lesson,
   its oracle tag, model-ability tag and strength, "may be outdated" on a lesson about model
   limits whose cases are over a year old (re-check those against recent work), the cases it
   cites and the cases its "Against" line cites. Start from lessons tagged oracle `no`, and
   `partly` where the project already has a check that stands in for an old system. The tag is a
   hint, not a filter: judge each lesson by its own words, and drop those whose words are about
   moving code only (porting, an old system to compare with, shelved rewrites).
   With a specific or a new model: process lessons (model ability `no`) apply as they are. Start
   with the `yes` and `partly` lessons whose Era names your model or its family ("By model" in
   [lessons/index.md](../lessons/index.md)); treat those from other models as things to re-check
   on yours, not tips. A model newer than every case has no evidence here yet. The lessons hold
   only what the cases show, never prompting advice.
3. Open the aspect page only for the lessons you use: its full "Against" line and its cases show
   where it did not hold, and its Era which models and years it rests on.
4. Measure: answer from the repository, its history, logs or CI, with a number, a file or a
   command's output, not from memory. A check you may not run: write the exact command and mark
   it "not run" with the reason. A fact only the owner knows: mark it "ask the owner" and state
   the default you will assume; if the owner does not answer, assume it, write the assumption in
   the record, and go on (the owner can overturn it later).
5. Report as below and wait for the owner's choice. One change per proposal: split a proposal
   with several parts, or number its parts 3a, 3b, each with its own checks.
6. Record: once the owner has chosen, write `docs/ai-lessons-review.md` in the project (format
   below). In a read-only run, write no file; show the record after the report.
7. Revisit, in a fresh session, when the collection has grown or after a few weeks of work:
   - Start: compare the log entry the record names (date and title) with the newest one
     [llms.txt](../llms.txt) names. If they match and no item is due for re-check (nothing
     waiting, nothing open that later work could show), say so and stop.
   - Re-check: rerun each item's "Check now" unchanged and look for its "Event that proves it"
     in the work since; compare with its baseline. Mark each exactly proven, still waiting,
     stopped holding or not shown (its event cannot be seen yet), with the numbers; in the
     record, still waiting and not shown stay "waiting for first use". Date each change; reopen
     proven or skipped items only if their check now fails.
   - New: for each [log.md](../log.md) entry newer than the record's, read its file in
     [changes/](../changes/) (lesson IDs and checklist questions added, changed or removed); open
     only those lessons, and measure them as in step 4.
   - Lint: list the applied lessons that a newer lesson now contradicts or supersedes, and the
     record's items whose lesson changed.
   - Propose only the new or changed lessons, earlier "later" items, applied items that stopped
     holding and what the lint found, each with do, later or skip. Update the record in its
     existing layout and name in it the newest log entry read, by date and title.
   - The too-early rule below holds for the re-check only: new lessons can be proposed before
     anything has met its problem.
8. Share what you learned (optional): a field report, as below.

## Report format

```markdown
# AI lessons review: <project>, <YYYY-MM-DD>

Work measured: <what agents do here: sessions, tasks, reviews, tests, releases>.

## Limits of this run
- Session: fresh | not fresh (<why; a session that ran the work is partly judging itself>).
- Figures: measured from the repository now, or recorded (taken from notes or logs, not re-measured); mark each "recorded" figure below.
- Models: <the models this project uses>; any newer than every case, or with no row in "By model", makes its model-dependent lessons things to re-check, not evidence.

## Not run
- <lesson ID>: `<exact command>` — <why it was not run>.

## Ask the owner
- <lesson ID>: <question>. Default if unanswered: <what you will assume>.

## Proposals

1. <lesson ID> <the lesson in a few words>.
   Today: <what the project does, with the measurement>.
   Change: <the proposal>.
   Evidence: the lesson's strength, its "Against" line, and links to case sections you read.
   Depends on: <proposal numbers, or none>.
   Cost: S | M | L (S under a day of agent work, M a few days, L a week or more).
   Recommendation: do | later | skip (one word), with a one-line reason.
   Check now: <a command or count that passes once the change is applied>.
   Event that proves it: <what later work must show for the change to have held>.
2. ...
```

## The record

`docs/ai-lessons-review.md` in the project:

```markdown
# AI lessons review record: <project>

Lessons: <ai-migrations commit or date>.
Log entry: <date and title of the newest log.md entry this review covered>.

| # | Lesson | Proposal | Baseline | Status | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | <ID> | <one line> | <how often, evidence> | <status> | <commit, test run, count or incident> | <YYYY-MM-DD> |
| 3a | <ID> | <one part of a bundled proposal> | ... | ... | ... | ... |
```

One status per row: a proposal with parts gets a row per part (3a, 3b...), each with its own status
and event. Assumed owner answers go under the table, one line each: "Assumed: <question> —
<default>, <date>".

Baseline: written before any change, how often the proposal's problem happened so far, with the
evidence (a count from the history, logs or incidents), marked "(recorded)" when it comes from notes
rather than a fresh count; a revisit compares the work since with it.

Status uses the checklist's words: open, proven, waiting for first use, stopped holding,
skipped. A proposal marked "later" is open; one the owner declined is skipped; an applied change
whose check failed stays open, and its event names the failed check. A "do" that waits on an owner
action, or on work outside this session, stays open, and its event says what it waits on. An
applied change whose "Check now" passes is waiting for first use; once later work shows its
"Event that proves it", it is proven.

## Share what you learned (optional)

A [field report](field-reports.md) from this route says which lessons held in a project that is
not a migration. Draft one only once an item has met its problem since its baseline (proven, or
stopped holding); until then, write in the record that nothing has happened yet, with the date,
and revisit later (the too-early rule). It tells the maintainer which lessons and oracle tags to re-check against their
cases; it never changes a lesson by itself.
