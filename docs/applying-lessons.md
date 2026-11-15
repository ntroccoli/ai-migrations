# Applying the lessons outside a migration

For large AI-driven work that is not a migration: compare how a project's agents and sessions
work with the [lessons](../lessons/index.md), propose changes, and keep a record of what held.
The [checklist](../checklist.md) does the same before a migration; this page follows its method,
report and record ([docs/report-formats.md](report-formats.md)), so both routes read alike. README
"Learning from the lessons" gives the prompts.

## How to run it

1. Run it in a fresh session on the project, changing nothing there (P1). If the session that did the
   work is still running, first ask it to write an events file with counts of what went wrong in
   its coordination (lost messages, reruns, requests outside its scope), each figure labelled
   "recorded"; measure everything else from the repository.
2. Choose lessons from [lessons/evidence.md](../lessons/evidence.md), one line each: the lesson,
   its oracle tag, model-ability tag and strength, "may be outdated" on a lesson about model
   limits whose cases are over a year old (P4) (re-check those against recent work), the cases it
   cites and the cases its "Against" line cites. Start from lessons tagged oracle `no`, and
   `partly` where the project already has a check that stands in for an old system. The tag is a
   hint, not a filter: judge each lesson by its own words, and drop those whose words are about
   moving code only (porting, an old system to compare with, shelved rewrites) (P2).
   With a specific or a new model: process lessons (model ability `no`) apply as they are. Start
   with the `yes` and `partly` lessons whose cases name your model or its family ("By model" in
   [lessons/index.md](../lessons/index.md)); treat those from other models as things to re-check
   on yours, not tips. A model newer than every case has no evidence here yet. The lessons hold
   only what the cases show, no prompting advice.
3. Open the aspect page only for the lessons you use: its full "Against" line and its cases show
   where it did not hold, and its Era the years and the newest model family it rests on (each
   case lists every model).
4. Measure: answer from the repository, its history, logs or CI, with a number, a file or a
   command's output, not from memory. A check you may not run: write the exact command and mark
   it "not run" with the reason. A fact only the owner knows: mark it "ask the owner" and state
   the default you will assume; if the owner does not answer, assume it, write the assumption in
   the record, and go on (the owner can overturn it later).
5. Report in the [AI lessons review format](report-formats.md#ai-lessons-review-report) and wait for
   the owner's choice (P1). One change per proposal: split a proposal
   with several parts, or number its parts 3a, 3b, each with its own checks.
6. Record: once the owner has chosen, write `docs/ai-lessons-review.md` in the project
   ([the record](report-formats.md#the-record)), with an owner and a check-by date on each row
   waiting for first use. In a read-only run, write no file (P1); show the record after the report.
7. Revisit, in a fresh session, when the collection has grown or after a few weeks of work:
   - Start: compare the log entry the record names (date and title) with the newest one
     [llms.txt](../llms.txt) names. If they match and no item is due for re-check (due: waiting
     or open, with commits in the project since the record's date, or past its check-by date), say
     so and stop (P3).
   - Re-check: list first the rows waiting for first use whose check-by date has passed, with
     their owner. Rerun each item's "Check now" unchanged and look for its "Event that proves it"
     in the work since; compare with its baseline. Mark each exactly proven, still waiting,
     stopped holding or not shown (its event cannot be seen yet), with the numbers; in the
     record, still waiting and not shown stay "waiting for first use". Date each change; reopen
     proven or skipped items only if their check now fails.
   - New: for each [log.md](../log.md) entry newer than the record's, read its file in
     `changes/`, named by the entry's date and title (`2026-11-14 — third update` is
     `changes/2026-11-14-third-update.md`): the lesson IDs and checklist questions added, changed
     or removed; open
     only those lessons, and measure them as in step 4.
   - Lint: list the applied lessons that a newer lesson now contradicts or supersedes, and the
     record's items whose lesson changed.
   - Propose only the new or changed lessons, earlier "later" items, applied items that stopped
     holding and what the lint found, each with do, later or skip. Update the record in its
     existing layout and name in it the newest log entry read, by date and title.
   - The too-early rule below holds for the re-check only: new lessons can be proposed before
     anything has met its problem.
8. Share what you learned (optional): a field report, as below.

## Share what you learned (optional)

A [field report](field-reports.md) from this route says which lessons held in a project that is
not a migration. Draft one only once an item has met its problem since its baseline (proven, or
stopped holding); until then, write in the record that nothing has happened yet, with the date,
and revisit later (the too-early rule). It tells the maintainer which lessons and oracle tags to re-check against their
cases; it does not change a lesson by itself.

## Provenance

Each marker above, such as (P1): its source, evidence level (`published case`, `published cases`,
`others' measurement`, `vendor guidance`, `ours`: our inference), what it prevents, and how it
fails applied blindly.

| ID | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- |
| P1 | ours (a session judging its own work: REV-1) | ours | changes the owner did not choose; a session judging its own work | skipping read-only measurements the lessons need, or no record after the owner chose |
| P2 | ours | ours | proposing porting lessons to work that ports nothing | dropping a lesson that names porting but applies, such as an oracle lesson where a check stands in for the old system |
| P3 | ours | ours | a revisit with nothing new to say | stopping when the project changed (a new model, a new kind of work) though the collection did not; the check-by date guards only rows already recorded |
| P4 | ours (`OUTDATED_MONTHS`, [Size caps](maintaining.md#size-caps)) | ours | trusting a lesson about model limits that only older models showed | dropping a marked lesson; the mark asks for a re-check, and a lesson just past a year is no worse than one just under |
