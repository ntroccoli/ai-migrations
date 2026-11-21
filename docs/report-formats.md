# Report and record formats

The two routes report and record alike. A migration review follows the
[checklist](../checklist.md); an AI lessons review follows [applying the lessons](applying-lessons.md).
Both write a report, wait for the owner's choice, then keep a record in the measured project. The
report gives findings and options; the owner decides. Each option carries its trade-off, and the
agent's own reading, when it gives one, is labelled as such.

## Migration review report

```markdown
# Before-you-migrate review: <repository>, <YYYY-MM-DD>

Path: first review — <no docs/migration-review.md in the repository>.
Migration: <from> to <to>. Scope measured: <lines and files by kind, units, change rate>.
Bearing on going ahead: <the findings that bear on it, and the decision the owner faces, as the agent's reading>. The decision is the owner's.

## Weigh first
- Q<n>: <a finding the rest depend on (a project rule against the move, no oracle, no baseline), and who decides>.

## Not run
- Q<n>: `<exact command>` — <why it was not run>.

## Ask the owner
- Q<n>: <question>. Default: <assumed if unanswered>.

## Nothing missing
- Q<n> <question>: <measurement>.

## Not applicable yet
- Q<n> <question>: <why, and what must exist first>.

## Findings and options

<If the owner may stop at Q1, give the other findings one line each under "Other findings" instead.>

1. Q<n> <question>: <the finding in a line>.
   Today: <what the repository does, with the measurement>.
   Guide: <the lesson IDs and the case sections you read; "(ours)" where the collection marks the maintainer's reading, "agent's reading" on yours>.
   Links: <the guide's URL, each lesson's aspect page and each case section you read>.
   Options (the owner chooses; leaving it as it is may be one):
   - 1A: <change>. Trade-off: <what it costs, risks or gives up>. Cost: S | M | L.
   - 1B: <another change, or "leave as it is">. Trade-off: <...; for "leave as it is", what the problem goes on costing>. Cost: S | M | L.
   When not to apply: <the guide's points that fit this project, or "none fit">.
   Depends on: <finding numbers, or none>.
   Agent's reading: <the option the measurements favour, "later" (name the event that would make it "do"), or "no lean">, because:
   - Prevents: <the cost seen, with its source: "seen here: <reverts, fix-after-fix commits, rework, issues, CI failures, session-log counts, a rule the owner wrote twice>" or "seen in cases <X, Y>" (a one-off step only); or "no cost seen">.
   - Costs the owner: <what the option adds each week: prompts, gates, waiting, review hours, tokens; or "once: <what>">.
   Check now: <for each option, a command or count that passes once it is applied; for an option that cuts or moves text, each sentence that leaves, where it goes, and whether it still drives behaviour>.
   Event that proves it: <what later work must show>.
   Owner's choice: <left blank for the owner: do 1A | do 1B | later | skip>.
2. ...

## Other findings
- <A finding not written out in full, in one line; the owner can ask for it in full.>

## Next step
This report is saved at <path outside the project>; step 2 can run in this session or in a fresh one that reads it. Step 2 follows checklist "How to run" step 9 (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/checklist.md) and writes the record in the format of docs/report-formats.md "The record" (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/docs/report-formats.md); a fresh session downloads those files with curl and reads them from disk first.
Reply "Apply what you recommended", "Apply 1A and 3B; 2 later; skip 5" or "Apply none; write the record". I then follow checklist "How to run" step 9: first I name any favoured option whose reason I would not defend and keep it later; the record first, with each chosen proposal's baseline; one proposal at a time, on a branch; I stop at the first failing check, apply nothing after it, and report.
```

Cost: S under a day of agent work, M a few days, L a week or more.

In both reports and the revisit report, every finding under "Findings and options", the last as the
first, carries every line of the form under these labels (Links, the trade-off of each option, the
agent's reading with its two reasons, Owner's choice): the owner chooses from them, and step 2,
revisits and field reports read them by label. A finding you would not write out in full goes under "Other findings", one line each.

## AI lessons review report

```markdown
# AI lessons review: <project>, <YYYY-MM-DD>

Path: first review — <no docs/ai-lessons-review.md in the project>.
Work measured: <what agents do here: sessions, tasks, reviews, tests, releases>.

## Limits of this run
- Session: fresh | not fresh (<why; a session that ran the work is partly judging itself>).
- Figures: measured from the repository now, or recorded (taken from notes or logs, not re-measured); mark each "recorded" figure below.
- Models: <the models this project uses>; any newer than every case, or with no row in "By model", makes its model-dependent lessons things to re-check, not evidence.

## Not run
- <lesson ID>: `<exact command>` — <why it was not run>.

## Ask the owner
- <lesson ID>: <question>. Default if unanswered: <what you will assume>.

## Findings and options

1. <lesson ID> <the lesson in a few words>: <the finding in a line>.
   Today: <what the project does, with the measurement>.
   Evidence: <the lesson's strength and its "Against" line>; "agent's reading" on your own.
   Links: <the lesson's aspect page and each case section you read>.
   Options (the owner chooses; leaving it as it is may be one):
   - 1A: <change>. Trade-off: <what it costs, risks or gives up>. Cost: S | M | L.
   - 1B: <another change, or "leave as it is">. Trade-off: <...; for "leave as it is", what the problem goes on costing>. Cost: S | M | L.
   Depends on: <finding numbers, or none>.
   Agent's reading: <the option the measurements favour, "later" (name the event that would make it "do"), or "no lean">, because:
   - Prevents: <the cost seen, with its source: "seen here: <reverts, fix-after-fix commits, rework, issues, CI failures, session-log counts, a rule the owner wrote twice>" or "seen in cases <X, Y>" (a one-off step only); or "no cost seen">.
   - Costs the owner: <what the option adds each week: prompts, gates, waiting, review hours, tokens; or "once: <what>">.
   Check now: <for each option, a command or count that passes once it is applied; for an option that cuts or moves text, each sentence that leaves, where it goes, and whether it still drives behaviour>.
   Event that proves it: <what later work must show for the change to have held>.
   Owner's choice: <left blank for the owner: do 1A | do 1B | later | skip>.
2. ...

## Other findings
- <A finding not written out in full, in one line; the owner can ask for it in full.>

## Next step
This report is saved at <path outside the project>; step 2 can run in this session or in a fresh one that reads it. Step 2 follows docs/applying-lessons.md step 6 (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/docs/applying-lessons.md) and writes the record in the format of docs/report-formats.md "The record" (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/docs/report-formats.md); a fresh session downloads those files with curl and reads them from disk first.
Reply "Apply what you recommended", "Apply 1A and 3B; 2 later; skip 5" or "Apply none; write the record". I then follow docs/applying-lessons.md step 6: first I name any favoured option whose reason I would not defend and keep it later; the record first, with each chosen proposal's baseline; one proposal at a time, on a branch; I stop at the first failing check, apply nothing after it, and report.
```

## Revisit report

Both routes, when the record exists (checklist step 10, [applying the lessons](applying-lessons.md)
step 7). Each finding takes the first review's finding format, numbered after the record's last row.

```markdown
# <Before-you-migrate | AI lessons> revisit: <project>, <YYYY-MM-DD>

Path: revisit — <the record found>, which names log entry <date and title>.
Corrections: <each entry: applies or not, what was found, the options; or "corrections.md has no entry">.
Newest log entry: <date and title>. Stop: <yes: same entry and nothing due | no: why>.

## Due first
- #<row> <ID>: waiting for first use, check by <YYYY-MM-DD> passed; owner <who>.

## Re-check
- #<row> <ID>: proven | still waiting | stopped holding | not shown — <the "Check now" output and the numbers against the baseline>; triggers since <record date>: <m>, the rule used in <n> (an applied rule; "no trigger yet" when m is 0).

## Still closed
- #<row> <ID>: skipped | owner's choice, <YYYY-MM-DD> — no new or changed lesson bears on it, and its measurement has not changed.

## Lint
- #<row> <ID>: <the newer lesson that contradicts or supersedes it, or the change to its lesson>.

## Findings and options
<Only new or changed lessons and questions, earlier "later" items, items that stopped holding, applied rules used in few of their triggers (options: retire it, or apply it again, each with its trade-off), what the lint found, and closed items reopened (say why: which new lesson, or which measurement changed).>
## Next step
This report is saved at <path outside the project>; step 2 can run in this session or in a fresh one that reads it. Step 2 follows checklist "How to run" step 9 (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/checklist.md) or docs/applying-lessons.md step 6 (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/docs/applying-lessons.md) and writes the record in the format of docs/report-formats.md "The record" (https://raw.githubusercontent.com/ntroccoli/ai-migrations/main/docs/report-formats.md); a fresh session downloads those files with curl and reads them from disk first.
Reply "Apply what you recommended", "Apply 1A and 3B; 2 later; skip 5" or "Apply none; write the record". I then follow checklist "How to run" step 9 or docs/applying-lessons.md step 6: first I name any favoured option whose reason I would not defend and keep it later; the record first, with each chosen proposal's baseline; one proposal at a time, on a branch; I stop at the first failing check, apply nothing after it, and report.
```

## The record

A migration review writes `docs/migration-review.md` in the measured repository; an AI lessons
review writes `docs/ai-lessons-review.md` in the project. Same shape; the first lines and the second
column differ:

```markdown
# Migration review record: <repository>

Checklist: <ai-migrations commit or date>. Migration: <from> to <to>.
Log entry: <date and title of the newest log.md entry when the files were read, the one this review covered>.
Corrections checked: <COR IDs with what was found, or "none listed">, <YYYY-MM-DD>.
Run by: <agent and model>, <the session that built the work | a fresh session | fresh subagents sent by a session | a person>.

| # | Question | Proposal | Baseline | Status | Owner | Check by | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Q<n> | <the option the owner chose, in one line> | <how often, evidence> | <status> | <who looks for the event> | <YYYY-MM-DD> | <commit, test run or number> | <YYYY-MM-DD> |
```

```markdown
# AI lessons review record: <project>

Lessons: <ai-migrations commit or date>.
Log entry: <date and title of the newest log.md entry when the files were read, the one this review covered>.
Corrections checked: <COR IDs with what was found, or "none listed">, <YYYY-MM-DD>.
Run by: <agent and model>, <the session that built the work | a fresh session | fresh subagents sent by a session | a person>.

| # | Lesson | Proposal | Baseline | Status | Owner | Check by | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | <ID> | <the option the owner chose, in one line> | <how often, evidence> | <status> | <who looks for the event> | <YYYY-MM-DD> | <commit, test run, count or incident> | <YYYY-MM-DD> |
| 3a | <ID> | <one part of a bundled proposal> | ... | ... | ... | ... | ... | ... |
```

Proposal: the option the owner chose ("1A"), with what it changes; a finding put off or declined
keeps its finding in that cell. One status per row: a proposal with parts gets a row per part (3a,
3b...), each with its own status and event. Assumed owner answers go under the table, one line each:
"Assumed: <question> — <default>, <date>". An owner's choice that differs from a lesson or a
question's guide goes there too, one line each: "Owner's choice: #<row> <ID> — <what was chosen>;
reason: <why>; words: "<the owner's words>"; <date>". A revisit proposes a skipped row or an owner's
choice again only for a new or changed lesson or a changed measurement, and says which.

Corrections checked: the [corrections.md](../corrections.md) entries the last review or revisit
compared with this project, with what it found and the date; a first review writes "none listed"
when the file has no entry.

Log entry and Run by: the field report's "Log entry the run read" and "Who ran the review"
([field reports](field-reports.md)), so the agent that drafts a report copies them from here. A
revisit updates both; a record written before "Run by:" existed gets it at its next revisit
("unstated" for the earlier runs).

Baseline: written before any change, how often the proposal's problem happened so far, with the
evidence (a count from the history, logs or incidents), marked "(recorded)" when it comes from notes
rather than a fresh count; a revisit compares the work since with it.

Status, one of: open, proven, waiting for first use, stopped holding, skipped, retired. A proposal the owner
marked "later" is open; one the owner declined is skipped; an applied change whose check failed stays
open, and its event names the failed check. A "do" that waits on an owner action, or on work outside
this session, stays open, and its event says what it waits on. An applied change whose "Check now"
passes is waiting for first use; once later work shows its "Event that proves it", it is proven.
An applied rule that its trigger events met and that was used in few of them, which the owner then
removed at a revisit, is retired: its row keeps the trigger count, the uses and the owner's words.
A rule with no trigger yet is not retired: it stays waiting for first use.

Owner and Check by: every row waiting for first use names who looks for its event and the date by
which the event should have shown if the change holds (when the work that would show it is
expected; the owner of the project sets or changes it). Other rows may leave both "—". A revisit
lists first the rows waiting for first use whose Check by date has passed, with their owner, then
the rest. A record written before these columns existed gets them at its next revisit, and a
record without a "Corrections checked:" line gets one.
