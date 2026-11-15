# Report and record formats

The two routes report and record alike. A migration review follows the
[checklist](../checklist.md); an AI lessons review follows [applying the lessons](applying-lessons.md).
Both write a report, wait for the owner's choice, then keep a record in the measured project.

## Migration review report

```markdown
# Before-you-migrate review: <repository>, <YYYY-MM-DD>

Migration: <from> to <to>. Scope measured: <lines and files by kind, units, change rate>.
Go / no-go: go | go after the blockers | no-go — <one line why>.

## Blockers
- Q<n>: <what must happen first, and who decides>.

## Not run
- Q<n>: `<exact command>` — <why it was not run>.

## Ask the owner
- Q<n>: <question>. Default: <assumed if unanswered>.

## No gap
- Q<n> <question>: <measurement>.

## Not applicable yet
- Q<n> <question>: <why, and what must exist first>.

## Proposals

<After a no-go on Q1, replace this section with "Other gaps": one line per gap.>

1. Q<n> <question> — gap | partial gap.
   Today: <what the repository does, with the measurement>.
   Change: <the proposal>.
   Evidence: Q<n>, its lesson IDs, and links to case sections you read.
   Depends on: <proposal numbers, or none>.
   Cost: S | M | L (S under a day of agent work, M a few days, L a week or more).
   Recommendation: do | later | skip (one word), with a one-line reason.
   Check now: <command or count that passes once applied>.
   Event that proves it: <what later work must show>.
2. ...
```

## AI lessons review report

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

A migration review writes `docs/migration-review.md` in the measured repository; an AI lessons
review writes `docs/ai-lessons-review.md` in the project. Same shape; the first lines and the second
column differ:

```markdown
# Migration review record: <repository>

Checklist: <ai-migrations commit or date>. Migration: <from> to <to>.
Log entry: <date and title of the newest log.md entry this review covered>.

| # | Question | Proposal | Baseline | Status | Owner | Check by | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Q<n> | <one line> | <how often, evidence> | <status> | <who looks for the event> | <YYYY-MM-DD> | <commit, test run or number> | <YYYY-MM-DD> |
```

```markdown
# AI lessons review record: <project>

Lessons: <ai-migrations commit or date>.
Log entry: <date and title of the newest log.md entry this review covered>.

| # | Lesson | Proposal | Baseline | Status | Owner | Check by | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | <ID> | <one line> | <how often, evidence> | <status> | <who looks for the event> | <YYYY-MM-DD> | <commit, test run, count or incident> | <YYYY-MM-DD> |
| 3a | <ID> | <one part of a bundled proposal> | ... | ... | ... | ... | ... | ... |
```

One status per row: a proposal with parts gets a row per part (3a, 3b...), each with its own status
and event. Assumed owner answers go under the table, one line each: "Assumed: <question> —
<default>, <date>".

Baseline: written before any change, how often the proposal's problem happened so far, with the
evidence (a count from the history, logs or incidents), marked "(recorded)" when it comes from notes
rather than a fresh count; a revisit compares the work since with it.

Status, one of: open, proven, waiting for first use, stopped holding, skipped. A proposal marked
"later" is open; one the owner declined is skipped; an applied change whose check failed stays
open, and its event names the failed check. A "do" that waits on an owner action, or on work outside
this session, stays open, and its event says what it waits on. An applied change whose "Check now"
passes is waiting for first use; once later work shows its "Event that proves it", it is proven.

Owner and Check by: every row waiting for first use names who looks for its event and the date by
which the event should have shown if the change holds (when the work that would show it is
expected; the owner of the project sets or changes it). Other rows may leave both "—". A revisit
lists first the rows waiting for first use whose Check by date has passed, with their owner, then
the rest. A record written before these columns existed gets them at its next revisit.
