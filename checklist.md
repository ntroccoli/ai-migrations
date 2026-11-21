# Before you migrate: checklist

Questions to measure on a repository before an AI-driven move to another language, framework or
library, or a large restructuring. It guides an agent through what the cases show; it does not
decide for the project: findings and options go to the project's owner, who chooses. Each question
has a **Check**, what to measure and report (a measurement, not a verdict), the **Lessons** behind
it (`TST-2`: lesson 2 on the testing page; listed in [lessons/evidence.md](lessons/evidence.md)) and
a **Guide**, `guide/q<n>.md`, read only for the question in use: those lessons in our words with
links to them and their cases, what the question looks like in a project, questions to ask of this
one, the trade-offs, and when not to apply it. A threshold or hard rule carries a marker such as
(P3): the [Provenance](#provenance) table gives its source, evidence level, what it prevents and how
it fails applied blindly. `ours` and "(ours)" mark the maintainer's reading or a number we picked:
adapt it. A revisit reads [corrections.md](corrections.md) first.

1. **Is the move allowed, possible and worth it?**
   Check: find the written reason and the measured problem behind it (none written: ask the
   owner); repository rules that pin the stack, forbid new libraries or name an approver (one
   that forbids the target is the first finding the owner weighs (P1)); for each framework the
   product rests on (renderer, UI, desktop shell, platform or store SDK), its mature equivalent in
   the target, or mark the move a rewrite on a new base; where time, memory or money goes today
   (a profile, a bill) and whether the code to port is on that path; who maintains the result and
   whether they read the target language; what the target must win, as numbers where possible.
   Lessons: PLN-7, PLN-8, PLN-9, SEC-7.
   Guide: [guide/q1.md](guide/q1.md).
2. **Is there a test oracle that survives the move and that the agent cannot edit?**
   Check: count the tests that exercise behaviour through a public interface (CLI, API, files
   written, a headless harness) apart from white-box tests; list public features with none; run
   them once and list those that fail or will not run. Find golden files tied to the old
   implementation and how they are regenerated. Find what the old system has already made and
   kept that must stay as it is (saved results, rendered files, rows), and say how it is proved
   unchanged: on a copy of the store, old and new code each process all of it, outputs compared
   (ours). Say how results are compared across languages (plain-data summaries, tolerances) and how you confirm the tests ran. When the tests are what
   moves, say how intent and coverage are compared (coverage before and after, a hand-converted
   sample) and check new tests can fail. Say whether old and new can run the same inputs side by
   side, outputs compared (a differential or shadow run), and how late a wrong
   change first fails (build, tests, or only once deployed). Find who must approve a test change
   (CODEOWNERS, branch rules, CI, the owner); none is a finding.
   Lessons: TST-1, TST-2, TST-3, TST-4, TST-5, TST-6, TST-8, TST-10, TST-12, TST-13, TST-14, TST-15,
   VER-5, VER-11, OVS-1.
   Guide: [guide/q2.md](guide/q2.md).
3. **Can an agent build, check and test alone, fast, and in parallel, in both toolchains?**
   Check: find the command that builds, formats, lints and tests one unit in the old stack, and
   name the one for the target stack (say whether its toolchain is pinned). Use recorded timings first (logs, CI
   history); otherwise time each, count the output lines of a failure, and build and test two
   fresh clones outside the repository at once as an agent would (install dependencies, count
   the tests that ran, cap the time; not worktrees, which write into the measured repository's
   `.git`) (P2). For the agents you plan, estimate compile time, disk space and speed, and process
   limits; say how agents are kept from undoing each other's work, and which target platforms
   their machines can build and test; for an app, how an agent drives it and how long one test
   takes. A missing formatter or linter is a finding.
   Lessons: OPS-1, OPS-2, OPS-3, ORC-1, ORC-2, VER-2, VER-4, TOL-6, TOL-8.
   Guide: [guide/q3.md](guide/q3.md).
4. **How big is the job, really?**
   Check: scope is everything that must exist in the target. Count lines and files in scope by
   folder (`scc`, `tokei`, `cloc`, else `git ls-files -z -- <scope> | xargs -0 wc -l`) for
   code (GPU too), tests, build scripts, and other languages (shaders, generated files,
   templates or DSLs of the old stack). For a change across call sites, list every site with a
   code index or static analyzer, not text search alone, and keep the list. Add code tangled with
   the scope. List the data and asset formats both builds read, and stored data that must stay
   readable (rows, hashes, saves). Give the change rate in scope over the last quarter
   (`git log --since="3 months ago" --numstat --format=%ad --date=short -- <scope>`): commits and
   lines per week, active days, last change. Code still changing fast: ask the owner whether to
   wait, or delete the old code in the change that ports it so later edits conflict (P3).
   Lessons: PLN-3, PLN-10, ROL-4, TOL-1, TOL-3, MSR-8.
   Guide: [guide/q4.md](guide/q4.md).
5. **Can the work ship in small units, with old and new side by side?**
   Check: split the scope into units (files, components, packages, repositories), draw their
   dependency order with a read-only graph tool for the language (`go mod graph`, `cargo tree`,
   `jdeps`, `madge`, `pydeps`), and count the cycles (Go and Cargo reject package cycles: look
   between modules or files instead), and mark the leaves that touch neither I/O nor shared
   state. Find the seam that lets one unit switch while the rest stays, and how the build links
   both languages meanwhile (seams by kind of move: [pitfalls.md](pitfalls.md#seams)). No seam:
   say so, the move is one switch. Check what the platform rules allow. Propose pilot units.
   Lessons: PLN-1, PLN-4, PLN-11, ROL-1, ROL-6, ORC-4.
   Guide: [guide/q5.md](guide/q5.md).
6. **Is the end state written, and is the scope held?**
   Check: look for a written target for the whole migration (not one unit), before-and-after
   examples from this repository, sites grouped into patterns with a template each, when the
   agent must stop and escalate, a rule to translate first and redesign later, and a check on
   each diff for changes outside its scope (P4). A repository rule against translating first (delete
   old paths, keep no compatibility) is a finding (P5).
   Lessons: CTX-4, PLN-2, PLN-5, PLN-13, REV-4, AGF-2, AGF-4.
   Guide: [guide/q6.md](guide/q6.md).
7. **What does the old stack do implicitly?**
   Check: search the scope for behaviour the target will not give for free, with the lists for
   this kind of move in [pitfalls.md](pitfalls.md) as it says. Make a table of direct dependencies: target
   library, version, stable release or archived (a missing framework is question 1).
   Lessons: REV-3, OPS-4, TST-7, VER-6, SEC-5, SEC-6, AGF-3, SEC-10.
   Guide: [guide/q7.md](guide/q7.md).
8. **Is the code uniform enough for one prompt, and what context goes with it?**
   Check: group the units by kind of code (pure logic, concurrency, OS layer, GPU or UI, data
   pipelines) and by framework, build system and style. For each group, name the context an
   agent gets: the unit's source, its neighbours' tests, good examples, mapping tables for
   renamed fields or APIs, runtime facts a person would look at, and what a rule-based codemod
   can do first. Say whether the model was piloted on the hardest files of each language in scope (else propose a pilot), and check the
   largest files fit its context window. A group too varied for one prompt is a candidate to defer
   or do by hand. Search docs, agent instructions and the prompts tuned to the old engine or
   stack for advice favouring it: such a prompt raises no error on the new engine, its output is
   only worse (ours).
   Lessons: CTX-1, CTX-2, CTX-3, CTX-5, CTX-9, CTX-10, CTX-11, CTX-12, CTX-13, TOL-2, TOL-7, TOL-9,
   AGF-8, PLN-8, PLN-12.
   Guide: [guide/q8.md](guide/q8.md).
9. **How will you work the long tail, stop, and learn from failures?**
   Check: look for a status record per unit, a way to rerun failing units by step, a retry limit
   (for independent units such as files; where units depend on each other, a rule to fix the
   workflow and rerun instead), a rule for when to stop automating and finish by hand, and a place
   where a failure seen twice becomes a standing instruction, skill or eval (P6).
   Lessons: VER-3, KNW-1, KNW-2, KNW-4, KNW-5, OVS-3, OVS-5, CTX-7, AGF-7, OPS-6, ROL-8, TST-11.
   Guide: [guide/q9.md](guide/q9.md).
10. **What may the agent decide and reach alone, and who reviews?**
    Check: list the guardrails an agent could switch off (deleting or editing tests, updating
    snapshots or baselines, waiver labels, CI flags) and who must approve each; the steps kept
    for people (schema changes, backfills, deploy order); and the tools, skills and credentials
    agent sessions can reach. A rule only written down, with nothing enforcing it, is a
    finding: say what could enforce it, if the owner wants it enforced. Changes in other teams' code: count the owning teams,
    whether they asked for the move, who carries the deploy risk. Ask the owner who reviews,
    whether they read the target language, and their hours a week, and whether a fresh reader
    reads each large change before the merge rather than after (ours).
    Lessons: OVS-1, OVS-2, AGF-1, AGF-5, AGF-9, SEC-1, SEC-2, SEC-3, REV-1, REV-2, REV-9, REV-11,
    TEM-4, TEM-6, ROL-9.
    Guide: [guide/q10.md](guide/q10.md).
11. **How will changes reach users?**
    Check: find the release channels (pre-release, flags, canary), the share of users each
    reaches, how problems are reported and watched, and how one unit's change is rolled back (for
    a single-user or internal tool: what a release and a rollback are). Not released yet: mark it
    "not applicable yet" and say what must exist before the first release.
    Lessons: ROL-2, ROL-3, ROL-5, ROL-7, ROL-10, ROL-11, VER-1, OPS-5, OPS-8.
    Guide: [guide/q11.md](guide/q11.md).
12. **How will you measure cost and result?**
    Check: write down the manual estimate and how it was made. Measure, before the port and on
    fixed hardware, the number the product exists for (speed, latency, memory, output quality),
    and the part the port changes, if not the same path. Plan to record tokens or spend, engineer
    hours, pull requests, regressions after merge and reverts, marking measured against estimated.
    Lessons: CST-1, CST-2, CST-6, CST-7, MSR-1, MSR-2, MSR-4, MSR-5, MSR-9, MSR-10, TST-9, KNW-3.
    Guide: [guide/q12.md](guide/q12.md).

## Starting thresholds

Numbers from one case each: points of comparison, not targets. Where a question has none, its
Check's measurement stands on its own.

- Q4: GitHub first counted about 130,000 lines; about 430,000 went through the port (P7). A scope
  count with no allowance for code moving in or newly written is a finding to report (P7).
  [GitHub][]
- Q5: Bun ran its whole loop on 3 files before all 1,448 (P8). No pilot before the bulk run is a
  finding to report (P8). [Bun][]
- Q9: most of Airbnb's simple and medium files passed within about 10 attempts; 50 to 100
  attempts on the hardest gained little (P9). In a bulk run of many units, no retry limit, or no
  rule to stop and hand-port, is a finding to report (P9). [Airbnb][]

## How to run this checklist

1. Run it in a fresh session on the repository to migrate, changing nothing there (P10). Look for
   the record `docs/migration-review.md` first: with none, this is the first review, up to step 9;
   with one, a revisit (step 10). Say in one line which and why, the report's "Path:" line. The
   cases are few and mostly their teams' own accounts: read "What went wrong" before relying on them.
2. Measure first: answer each Check with a number, file or command output, not from memory.
3. A check you may not run: write the exact command, mark it "not run" with the reason, never
   guess its result (P11). The command is the line you would type (`GOOS=linux go build ./...`,
   not "a cross-compile"); a figure for the target that you estimate is labelled an estimate. Logs or
   CI history count if you name their source.
4. A fact only the owner knows (review time, budget): write the question, mark it "ask the
   owner" and state a default; unanswered, assume it, note it in the record, go on. A decision only
   the owner can make (approval of a new stack, a change to a project rule) is not assumed: it stays
   "waiting on the owner".
5. Report each question as a finding: what the Check found and did not find, with the
   measurement; or "nothing missing", or "not applicable yet" with what must exist first. A finding
   is a measurement for the owner to weigh, not a verdict; a Check part that does not fit the
   project's size or kind of move, as its guide's "When not to apply it" says, is reported as such.
6. Before writing a finding up, read the question's guide. Where its "When not to apply it" fits
   this project, say so: it may be the reason to leave things as they are. Build the options on
   the guide and, if you can, the cited lessons (their "Against" lines and oracle tags) and the case
   sections they link, above all "Practices to copy". Compare numbers across cases only in matching
   units. Keep the two readings apart: "(ours)" in the collection is the maintainer's, and so is a
   lesson tagged `[ours]`; label your own "agent's reading".
7. Give each finding options for the owner, each with its trade-off; leaving it as it is is often
   one, and its trade-off is what the problem goes on costing. You may say which option the measurements favour, labelled "agent's reading", with two
   reasons: "Prevents:", the cost seen, with its source ("seen here: <evidence>" or "seen in cases
   <X, Y>"), and "Costs the owner:", what the option adds each week. An option that adds a running
   cost (a prompt, a gate, a weekly step) needs a cost seen here; without one, lean "later" and
   name the event that would make it "do" (P13). A one-off step before something hard to undo (a
   baseline, a golden set, a rollback path) may rest on the cost seen in the cases. Look for the
   cost seen here in the project's own record: git history (reverts, fix-after-fix commits,
   rework on the same files), issues and CI failures, session logs, rules the owner wrote more
   than once. An option that cuts or moves text gives as its "Check now" each sentence that
   leaves, where it goes and whether it still drives behaviour (P14). Order the findings so the
   owner meets first what the rest depend on: a project rule against the move (question 1), then
   the oracle, the baseline and the end state.
8. Report as below and wait for the owner's choice (P10): for each finding, do (which option),
   later or skip is theirs. One change per option (or parts 3a, 3b). Before you wait, save the
   report to a file outside the project (in the temporary folder, or a path the owner names) and
   give its path: step 9 may then run in a fresh session from that file. A long review may send
   the measuring to fresh subagents: save each one's findings to that file as they arrive, since
   findings held only in a session's context are lost at a compaction.
9. Apply and record, once the owner has chosen (P10) ("Apply what you recommended": the options your
   reading favoured, the rest later; "Apply 1A and 3B; 2 later; skip 5"; "Apply none; write the
   record"). In a read-only run, write no file (P10); show the record after the report. Else:
   - "Apply what you recommended": first drop each favoured option whose reason you would not
     defend if the owner pushed back (P15); name it with that reason and record it as later. Never
     drop one because you expect its check to fail: that check runs, and the stop below holds
     (P15).
   - Write `docs/migration-review.md` in the measured repository (the one file this checklist adds
     there; format below) before changing anything, with each chosen proposal's baseline: how
     often its problem has happened so far, with the evidence. Complete it with every finding,
     the later and skipped ones too, the corrections.md entries checked ("none listed" if it has
     none), the newest log.md entry this review covered and who ran it ("Run by:").
   - Each row waiting for first use gets the owner (who looks for its event) and check-by date the
     owner named, or ones you propose for the owner to confirm. A question of fact left
     unanswered: assume the report's default and record the assumption; a decision left open (an
     approval, a change to a project rule) stays open.
   - Do the work the way this project normally runs work (yourself, or by briefing workers), one
     proposal at a time, on a branch. First state its "Check now" and its "Event that proves it";
     it is applied when the check now passes (waiting for first use), proven only once later work
     shows the event.
   - Before you change a file outside the project (user-level instructions, skills or settings,
     another repository), show the owner the exact text (a diff; for a long change, a summary and
     the path to a file with the full text) and wait for their yes (P16). A user-level file that
     several projects share changes for one project at a time, each from its latest version.
   - Stop at the first failing check (P12): leave that proposal open, its event naming the failed
     check, apply no later proposal, and report what failed and what is left. The owner decides.
10. Revisit: read [corrections.md](corrections.md) first, then go on as step 7 of
    [applying the lessons](docs/applying-lessons.md) says, with the questions its `changes/` files
    list as well as the lessons. There, each applied item's trigger events since the record's date
    are counted; one that was used in few of them is offered as retire or apply again, and one with
    no trigger yet stays waiting for first use. Report in the revisit format; change nothing but the
    record (P10) until the owner chooses, then apply as in step 9.
11. Share (optional): a [field report](docs/field-reports.md) once an item has met its problem.

## Report format

The report, the revisit report and the record `docs/migration-review.md`: [docs/report-formats.md](docs/report-formats.md).

## Provenance

Levels: `published case` (one), `published cases` (two or more), `others' measurement`,
`vendor guidance`, `ours`.

| ID | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- |
| P1 | ours | ours | a port planned against the project's own rules without the owner seeing it | holding the move where the rule only asks for an approver |
| P2 | clones: OPS-1, ORC-1; no worktree, time cap: ours | ours | a measurement that hangs or writes into the measured repository | refusing worktrees for the port itself, where they kept agents apart |
| P3 | [GitHub][], ROL-4 | published case | edits to old code after its port | deleting old code a side-by-side run (Q2) or a rollback (Q11) still needs |
| P4 | CTX-4, AGF-2, REV-4 | published cases | agents guessing past what they understand; diffs straying from the task | a stop rule so wide that every unit waits for a person |
| P5 | PLN-5 | published cases | a redesign inside the port, so a failure points nowhere | flagging a redesign the owner chose (PLN-5's Against lists moves that built the target first) |
| P6 | VER-3, OVS-3, KNW-1 | published cases | endless retries; one failure fixed by hand again and again | a retry cap on units judged independent that share state |
| P7 | [GitHub][], PLN-3 | published case | a plan sized on the first count | taking threefold growth as a rule for every project |
| P8 | [Bun][], PLN-1 | published case | a bulk run on an untried loop | taking three files as pilot enough for code of several kinds (Q8) |
| P9 | [Airbnb][], VER-3 | published case | attempts spent on files that will not pass | ten attempts as a cap for units that are not small independent files |
| P10 | ours | ours | changes the owner did not choose | skipping read-only builds and tests, or no record after the owner chose |
| P11 | ours | ours | invented measurements | marking checks "not run" that could run safely |
| P12 | ours | ours | later changes piled on a failed one, so the failure points nowhere | stopping for a check that failed before the change too; report that, and let the owner decide |
| P13 | ours (one-off steps: the costs the cited cases report) | ours | rules that add a weekly cost against a risk this project has not paid, applied and then not followed | holding back a one-off baseline, golden set or rollback path because nothing has gone wrong here yet |
| P14 | ours | ours | a trim or move that drops sentences that still drive behaviour | listing sentences for a change that moves nothing out of the files loaded at the start |
| P15 | ours | ours | an option applied on a reason that would not survive the owner's question; an option held back to get round the stop at a failing check | holding back every option the owner might question, so nothing is applied |
| P16 | ours | ours | changes to the owner's user-level setup or other repositories that the owner never saw | asking for a yes on each file inside the project, which the choice in step 8 already covers |

[GitHub]: cases/2026-09-16-github-copilot-runtime-rust.md
[Bun]: cases/2026-07-08-bun-zig-to-rust.md
[Airbnb]: cases/2025-04-01-airbnb-enzyme-to-rtl.md
