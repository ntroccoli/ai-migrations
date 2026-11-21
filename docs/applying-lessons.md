# Applying the lessons outside a migration

For large AI-driven work that is not a migration: compare how a project's agents and sessions
work with the [lessons](../lessons/index.md), give the project's owner findings and options, and
keep a record of what held. The lessons guide; they do not decide for the project: the owner
chooses, and the maintainer's reading is marked "ours".
The [checklist](../checklist.md) does the same before a migration; this page follows its method,
report and record ([docs/report-formats.md](report-formats.md)), so both routes read alike. README
"Learning from the lessons" gives the prompts.

## How to run it

1. Run it in a fresh session on the project, changing nothing there (P1). Look for the record
   `docs/ai-lessons-review.md` first: with none, this is the first review, up to step 6; with one, a
   revisit (step 7). Say in one line which and why, the report's "Path:" line. If the session that did the
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
   With a specific or a new model (ours): process lessons (model ability `no`) need no re-check for a newer model, though each is still judged by its own words. Start
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
   the record, and go on (the owner can overturn it later). A decision only the owner can make (an
   approval, a change to a project rule) is not assumed: it stays "waiting on the owner".
   When a report gives token or call counts read from session logs, count them as [field reports](field-reports.md#for-the-agent-that-drafts-a-report) says: one API call per message id, tool calls rather than all text, and the definition of "tokens re-read" stated.
5. Report in the [AI lessons review format](report-formats.md#ai-lessons-review-report): findings,
   each with options for the owner and the trade-off of each (leaving it as it is is often one, its trade-off what the problem goes on costing),
   your own reading labelled "agent's reading"; do, later or skip is the owner's choice. Where a lesson's
   "Against" line or cases show it did not hold in a project like this one, say so. Wait for
   the owner's choice (P1). One change per option: split a proposal
   with several parts, or number its parts 3a, 3b, each with its own checks.
   - The agent's reading gives two reasons: "Prevents:", the cost seen, with its source ("seen
     here: <evidence>" or "seen in cases <X, Y>"), and "Costs the owner:", what the option adds
     each week. An option that adds a running cost (a prompt, a gate, a weekly step) needs a cost
     seen here; without one, lean "later" and name the event that would make it "do" (P7). A
     one-off step before something hard to undo (a baseline, a golden set, a rollback path) may
     rest on the cost seen in the cases. Look for the cost seen here in the project's own record:
     git history (reverts, fix-after-fix commits, rework on the same files), issues and CI
     failures, session logs, rules the owner wrote more than once.
   - An option that cuts or moves text in instruction files gives as its "Check now" each sentence
     that leaves, where it goes and whether it still drives behaviour (P8).
   - Before you wait, save the report to a file outside the project (in the temporary folder, or a
     path the owner names) and give its path: step 6 may then run in a fresh session from that
     file. A long review may send the measuring to fresh subagents: save each one's findings to
     that file as they arrive, since findings held only in a session's context are lost at a
     compaction.
6. Apply and record, once the owner has chosen (P1) ("Apply what you recommended": the options your
   reading favoured, the rest later; "Apply 1A and 3B; 2 later; skip 5"; "Apply none; write the
   record"). In a read-only run, write no file (P1); show the record after the report. Else:
   - "Apply what you recommended": first drop each favoured option whose reason you would not
     defend if the owner pushed back (P9); name it with that reason and record it as later. Never
     drop one because you expect its check to fail: that check runs, and the stop below holds
     (P9).
   - Write `docs/ai-lessons-review.md` in the project ([the record](report-formats.md#the-record))
     before changing anything, with each chosen proposal's baseline: how often its problem has
     happened so far, with the evidence. Complete it with every finding, the later and skipped
     ones too, the corrections.md entries checked ("none listed" if it has none), the newest
     log.md entry this review covered and who ran it ("Run by:").
   - Each row waiting for first use gets the owner (who looks for its event) and check-by date the
     owner named, or ones you propose for the owner to confirm. A question of fact left
     unanswered: assume the report's default and record the assumption; a decision left open
     stays open.
   - Do the work the way this project normally runs work (yourself, or by briefing workers), one
     proposal at a time, on a branch. First state its "Check now" and its "Event that proves it";
     it is applied when the check now passes (waiting for first use), proven only once later work
     shows the event.
   - Before you change a file outside the project (user-level instructions, skills or settings,
     another repository), show the owner the exact text (a diff; for a long change, a summary and
     the path to a file with the full text) and wait for their yes (P10). A user-level file that
     several projects share changes for one project at a time, each from its latest version.
   - Stop at the first failing check (P5): leave that proposal open, its event naming the failed
     check, apply no later proposal, and report what failed and what is left. The owner decides.
   - An owner's choice that differs from a lesson (a skip, or an option the lesson argues against)
     is recorded as the owner's choice: its date, reason and the owner's words, under the table.
7. Revisit, in a fresh session, when the collection has grown or after a few weeks of work:
   - Corrections, before anything else: read [corrections.md](../corrections.md) and follow it,
     even when the rest of the revisit ends at the Start step; with no entry, say so in a line and go on.
     Write what you checked on the record's "Corrections checked:" line.
   - Start: compare the log entry the record names (date and title) with the newest one
     [llms.txt](../llms.txt) names. If they match and no item is due for re-check (due: waiting
     or open, with commits in the project since the record's date, or past its check-by date), say
     so and stop (P3).
   - Re-check: list first the rows waiting for first use whose check-by date has passed, with
     their owner. Rerun each applied item's "Check now" unchanged (skipped items were not
     applied: they stay skipped unless the owner reopens them) and look for its "Event that proves it"
     in the work since; compare with its baseline. Mark each exactly proven, still waiting,
     stopped holding or not shown (its event cannot be seen yet), with the numbers; in the
     record, still waiting and not shown stay "waiting for first use". Date each change; reopen
     a proven item only if its check now fails.
   - Used or not: for each applied rule, count its trigger events since the record's date (the
     moments its "Event that proves it" names: a review, a clean-up, a release) and how many of them
     used the rule. Triggers happened and the rule was used in few of them: offer two options,
     each with its trade-off: retire it (it no longer costs every session that loads it, and what it
     guarded is unguarded again) or apply it again (the reason it went unused is fixed, or it keeps
     costing for little use). No trigger yet: it stays waiting for first use. A rule the owner
     retires gets status "retired", with the counts and the owner's words.
   - New: for each [log.md](../log.md) entry newer than the record's, read its file in
     `changes/`, named by the entry's date and title (`2026-11-14 — third update` is
     `changes/2026-11-14-third-update.md`): the lesson IDs and checklist questions added, changed
     or removed; open
     only those lessons, and measure them as in step 4.
   - Lint: list the applied lessons that a newer lesson now contradicts or supersedes, and the
     record's items whose lesson changed.
   - Closed items stay closed (P6): a skipped or declined item, or an owner's choice recorded
     against a lesson, comes back as a proposal only for a new or changed lesson that bears on it,
     or a measurement that changed since the record; say which. Else list it under "Still closed".
   - Give options only for the new or changed lessons, earlier "later" items, applied items that stopped
     holding, applied rules used in few of their triggers (retire or apply again), what the lint found and closed items reopened as above, each as options with their
     trade-offs, for the owner's do, later or skip, in the
     [revisit format](report-formats.md#revisit-report). Change nothing but the record (P1) until the
     owner chooses, then apply as in step 6. Update the record in its
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
| P4 | ours (`OUTDATED_MONTHS`, [Sizes and format limits](maintaining.md#sizes-and-format-limits)) | ours | trusting a lesson about model limits that only older models showed | dropping a marked lesson; the mark asks for a re-check, and a lesson just past a year is no worse than one just under |
| P5 | ours | ours | later changes piled on a failed one, so the failure points nowhere | stopping for a check that failed before the change too; report that, and let the owner decide |
| P6 | ours | ours | the same declined proposal at every revisit, overruling the owner by repetition | missing a new lesson that should reopen it; the agent says which reason it used |
| P7 | ours (one-off steps: the costs the cited cases report) | ours | rules that add a weekly cost against a risk this project has not paid, applied and then not followed | holding back a one-off baseline, golden set or rollback path because nothing has gone wrong here yet |
| P8 | ours | ours | a trim or move that drops sentences that still drive behaviour | listing sentences for a change that moves nothing out of the files loaded at the start |
| P9 | ours | ours | an option applied on a reason that would not survive the owner's question; an option held back to get round the stop at a failing check | holding back every option the owner might question, so nothing is applied |
| P10 | ours | ours | changes to the owner's user-level setup or other repositories that the owner never saw | asking for a yes on each file inside the project, which the owner's choice in step 5 already covers |
