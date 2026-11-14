# Applying the lessons outside a migration

For large AI-driven work that is not a migration: compare how a project's agents and sessions
work with the [lessons](../lessons/index.md), propose changes, and keep a record of what held.
The [checklist](../checklist.md) does the same before a migration; this page follows its method,
report and record, so both routes read alike. README "Learning from the lessons" gives the
prompts.

## How to run it

1. Run it in a fresh session on the project, changing nothing there.
2. Read the one-line list of every lesson at the end of [lessons/index.md](../lessons/index.md);
   each line ends with the lesson's oracle tag, its model-ability tag and strength, and "may be
   outdated" on a lesson about model limits whose cases are over a year old: re-check those
   against recent work. Start from lessons tagged oracle `no`, and
   `partly` where the project already has a check that stands in for an old system. The tag is a
   hint, not a filter: judge each lesson by its own words, and drop those whose words are about
   moving code only (porting, an old system to compare with, shelved rewrites).
3. Open the aspect page of each lesson you use: its "Against" line and its cases show where it
   did not hold, and its strength how far to trust it.
4. Measure: answer from the repository, its history, logs or CI, with a number, a file or a
   command's output, not from memory. A check you may not run: write the exact command and mark
   it "not run" with the reason. A fact only the owner knows: mark it "ask the owner".
5. Report as below and wait for the owner's choice.
6. Record: once the owner has chosen, write `docs/ai-lessons-review.md` in the project (format
   below). In a read-only run, write no file; show the record after the report.
7. Revisit: a later run reads that record first, then only the
   [log.md](../log.md) entries newer than the one it names. It re-checks open, waiting and
   stopped-holding items, and lessons a newer entry changed. Date each status change with its
   event; reopen proven or skipped items only if their check now fails.

## Report format

```markdown
# AI lessons review: <project>, <YYYY-MM-DD>

Work measured: <what agents do here: sessions, tasks, reviews, tests, releases>.

## Not run
- <lesson ID>: `<exact command>` — <why it was not run>.

## Ask the owner
- <lesson ID>: <question>.

## Proposals

1. <lesson ID> <the lesson in a few words>.
   Today: <what the project does, with the measurement>.
   Change: <the proposal>.
   Evidence: the lesson's strength, its "Against" line, and links to case sections you read.
   Depends on: <proposal numbers, or none>.
   Cost: S | M | L (S under a day of agent work, M a few days, L a week or more).
   Recommendation: do | later | skip (one word), with a one-line reason.
   Check that proves it: <command, count or event to watch>.
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
```

Baseline: written before any change, how often the proposal's problem happened so far, with the
evidence (a count from the history, logs or incidents); a revisit compares the work since with it.

Status uses the checklist's words: open, proven, waiting for first use, stopped holding,
skipped. A proposal marked "later" is open; one the owner declined is skipped; an applied change
whose check failed stays open, and its event names the failed check. An applied change whose check passed is waiting for first use until an event in later work
shows it held; then it is proven.

## Afterwards

A [field report](field-reports.md) from this route says which lessons held in a project that is
not a migration. It tells the maintainer which lessons and oracle tags to re-check against their
cases; it never changes a lesson by itself.
