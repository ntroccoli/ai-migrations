# Before you migrate: checklist

Questions to answer about a repository before an AI-driven migration to another language,
framework or library. Each question has a **Check** an agent runs on the repository, an
**Evidence** line saying in our words what the cases show (so an agent that cannot open the
cases can still use it), and links to the cases that support it. A part marked "(ours)" is our
inference, not something a case reports. Three cases are a small base; read their "What went
wrong" sections before you rely on them. How to run the checklist and the report format are at
the end.

Cases: [GitHub, Copilot runtime TypeScript to Rust, 2026](cases/2026-09-16-github-copilot-runtime-rust.md);
[Airbnb, Enzyme to React Testing Library, 2025](cases/2025-04-01-airbnb-enzyme-to-rtl.md);
[Spotify, Honk background coding agent, 2025-2026](cases/2025-11-06-spotify-honk.md).

1. **Is the move allowed, and what is it for?**
   Check: find the written reason for the migration and the measured problem behind it. Find the
   repository's own rules that pin the stack, forbid new libraries or name an owner who must
   approve the change. List what the target must win, as numbers where possible.
   Evidence: GitHub moved for in-process embedding, startup time and memory, and says the right
   target language differs from product to product. Checking the repository's own rules first is
   ours. Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
2. **Is there a test oracle that survives the move and that the agent cannot edit?**
   Check: list the tests that exercise behaviour through a public interface (CLI, API, files
   written, golden outputs) apart from white-box tests in the old language; count each kind and
   run them once. Find who must approve a change to them (CODEOWNERS, branch rules, CI, or the
   owner).
   Evidence: GitHub kept its end-to-end suites unchanged as the oracle; most regressions that lost
   a feature came from gaps in that suite, and one port deleted a test. Spotify's agent could not
   check its work where repositories had no tests, so owners tested by hand. That white-box tests
   written in the old language rarely survive a language change is ours.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Spotify](cases/2025-11-06-spotify-honk.md).
3. **Can an agent build, check and test alone, fast, and in parallel, in both toolchains?**
   Check: find the command that builds, formats, lints and tests one unit in the old stack, and
   name the one for the target stack (pin its toolchain). Time each, count the lines of output on
   a failure, and run two worktrees at once. A missing formatter or linter counts as a finding.
   Evidence: GitHub's agents leaned on fast compiler feedback and needed a build lock when many
   built at once; Spotify gives its agent one verify tool that returns short errors; Airbnb gated
   each file on tests, lint and type checks.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Spotify](cases/2025-11-06-spotify-honk.md),
   [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
4. **How big is the job, really?**
   Check: count lines and files in scope, separately for code, tests, build scripts and other
   languages (shaders, generated files). Add code that will move into scope because it is
   tangled with it. Give the change rate in scope over the last quarter (`git log --since`
   with `--numstat`): commits and lines per week, the number of active days and the last change,
   since an average hides bursts.
   Evidence: GitHub's first count was about a third of what was finally ported, because code
   moved into scope and colleagues kept adding to the old code during the port.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
5. **Can the work ship in small units, with old and new side by side?**
   Check: split the scope into units (files, components, repositories), draw their dependency
   order and mark the leaves that touch neither I/O nor shared state. Find the seam that lets one unit switch
   while the rest stays (a shim, a foreign-function interface, per-file independence) and how the
   build links both languages meanwhile. Pick the first pilot units.
   Evidence: GitHub replaced one component per pull request through a temporary interop layer and
   removed the old code in the same change, starting from pure leaf helpers; Airbnb pushed each
   file through its own steps; Spotify opens one pull request per repository. The cost of a
   mixed-language build is ours.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md),
   [Spotify](cases/2025-11-06-spotify-honk.md).
6. **Is the end state written, and is the scope held?**
   Check: look for a written target for the whole migration (not one unit), before-and-after
   examples from this repository, the cases where the agent must not act, a rule to translate
   first and redesign later, and a check on each diff for changes outside its scope.
   Evidence: GitHub's agents read "port X" as the hot paths only until the full end state was
   written, and each redesign during the port cost regressions; Spotify's prompts describe the
   end state with examples and preconditions, and about a quarter of its sessions are vetoed by
   its judge, mostly for straying from the prompt; Airbnb's prompts carried hand-written examples.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Spotify](cases/2025-11-06-spotify-honk.md),
   [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
7. **What does the old stack do implicitly?**
   Check: search the scope for behaviour the target will not give for free, and list each item
   with "like for like" or "needs a decision". Typical items by kind of move:
   - dynamic to static typing (for example TypeScript to Rust, Go or C#): one number type for
     integers and floats, falsy defaults, time zone and locale, environment reads, runtime patches
     to platform calls;
   - C or C++ to Rust (ours): integer overflow and wrap, out-of-range float-to-integer casts,
     aliasing and casts away from const, mutable globals, custom allocators, unchecked indexing,
     and how much `unsafe` the target may use and where;
   - any move: libraries with no like-for-like replacement; source shared with another language
     or toolchain (shader headers, generated code), which a port splits into copies that drift
     (ours); bit-exact results across languages (float model, thread count) when tests compare
     outputs (ours).
   Evidence: most of GitHub's regressions compiled cleanly and came from implicit behaviour:
   number types, falsy defaults, time zone and environment, a Windows process flag, and libraries
   that behave differently. Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
8. **Is the code uniform enough for one prompt, and what context goes with it?**
   Check: group the units by kind of code (pure logic, concurrency, OS layer, GPU or UI, data
   pipelines) and by framework, build system and style. For each group, name the context an agent
   gets: the unit's source, its neighbours' tests, good examples, and mapping tables for renamed
   fields or APIs. A group too varied for one prompt is a candidate to defer or do by hand.
   Evidence: Spotify dropped one pipeline framework because its code varied too much for one
   prompt, and mapping tables fixed wrong field mappings; Airbnb found that choosing the related
   files mattered more than prompt wording.
   Cases: [Spotify](cases/2025-11-06-spotify-honk.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
9. **How will you work the long tail, stop, and learn from failures?**
   Check: look for a status record per unit, a way to rerun failing units by step, a retry limit,
   a rule for when to stop automating and finish by hand, and a place where a failure seen twice
   becomes a standing instruction, skill or eval.
   Evidence: Airbnb stamped each file with its status, tuned on small samples of failures, swept
   again, and finished the last files by hand once retries stopped helping; GitHub turned repeated
   failures into instructions, skills and evals.
   Cases: [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md), [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
10. **What may the agent decide and reach alone, and who reviews?**
    Check: list the guardrails an agent could switch off (deleting or editing tests, updating
    snapshots or baselines, waiver labels, CI flags) and who must approve each. List the tools,
    skills and credentials agent sessions can reach. Ask the owner who reviews and how many hours a
    week they have; the repository cannot tell you.
    Evidence: a GitHub agent applied a waiver label to pass a failing check, and a session used an
    orchestration skill nobody asked for to merge a peer's work; humans there reviewed
    architecture and risk while several models compared old and new code. Spotify keeps its
    agent's tools few, sandboxes it and never lets it push. Budgeting reviewer time is ours.
    Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Spotify](cases/2025-11-06-spotify-honk.md).
11. **How will changes reach users?**
    Check: find the release channels (pre-release, flags, canary), what share of users each
    reaches, how problems are reported and watched, and how one unit's change is rolled back.
    Evidence: GitHub aimed to ship each port to a pre-release first (not always), so each release
    held a small set of ports and problems were easy to trace; it compared issue rates before and
    during the port. A rollback path per unit is ours.
    Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
12. **How will you measure cost and result?**
    Check: write down the manual estimate and how it was made. Measure, before the port and on
    fixed hardware, the number the product exists for (speed, latency, memory, output quality).
    Plan to record tokens or spend, engineer hours, pull requests, regressions after merge and
    reverts, and mark which numbers are measured and which are estimates.
    Evidence: GitHub benchmarked before and after and gave its token bill, warning that other
    changes landed in the same window; Airbnb and Spotify give savings as their own estimates
    with no cost figure. Recording reverts and regressions after merge is ours: no case reports
    them.
    Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md),
    [Spotify](cases/2025-11-06-spotify-honk.md).

## Starting thresholds

Only where a case gives a number. They are starting points from one case each, not targets;
adjust them to the repository. Questions without a line here have no supported number: judge
"gap" from the Check alone.

- Q9: Airbnb saw most simple and medium files pass within about 10 attempts per step, and 50 to
  100 attempts on the hardest files gained little before people finished them. No retry limit,
  or no rule to stop and hand-port, is a gap.
  [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
- Q9: Airbnb tuned each fix on a sample of 5 to 10 failing files before sweeping all of them
  again. [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
- Q4: GitHub's first count was about 130,000 lines and about 430,000 went through the port. A
  scope count with no allowance for code moving in and new code arriving is a partial gap.
  [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
- Q11: pre-release versions took 10.5% of GitHub's npm downloads, so few users saw a port first.
  A reference point for exposure, not a threshold.
  [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).

## How to run this checklist

1. Run it in a fresh session on the repository you plan to migrate. Change nothing in the
   repository.
2. Measure first: answer each question with the number, file or command output its Check asks
   for, not from memory.
3. A check you may not run (read-only review, shared hardware, no target toolchain yet): write the
   exact command, mark it "not run" with the reason, and do not guess its result.
4. A fact only the owner knows (review time, budget, approval of a new stack): write the question
   and mark it "ask the owner".
5. Mark each question "gap", "partial gap" or "no gap", with the measurement.
6. Write proposals from the Evidence lines. If you can open the cases, also read the linked
   cases' "Practices to copy" (each marked `[stated]` by the source or `[ours]`) and "What went
   wrong". Do not compare numbers across cases unless their units match.
7. Order proposals by what blocks the rest: a blocker first (a "no" on question 1 stops all
   else), then what other proposals depend on (the oracle, the baseline, the end state), then the
   rest.
8. Report as below and wait for the owner's choice.
9. Record: once the owner has chosen, write `docs/migration-review.md` in the measured
   repository (the one file this checklist adds there). It lists each proposal with its status:
   open, proven, waiting for first use, stopped holding, or skipped; for proven and stopped
   holding, the event that shows it (a commit, a test run, a measured number) and its date. In a
   read-only run, put the record's text at the end of the report instead.
10. Revisit: a later run reads `docs/migration-review.md` first and re-checks only the open,
    waiting and stopped-holding items, plus any question whose measurement may have moved (new
    code in scope, a new toolchain). Update each status with the date and the event. Do not
    reopen proven or skipped items unless their check now fails.

## Report format

```markdown
# Before-you-migrate review: <repository>, <YYYY-MM-DD>

Migration: <from> to <to>. Scope measured: <lines and files by kind, units, change rate>.
Go / no-go: go | go after the blockers | no-go — <one line why>.

## Blockers
- Q<n>: <what must happen first, and who decides>.

## Not run
- Q<n>: `<exact command>` — <why it was not run>.

## Ask the owner
- Q<n>: <question>.

## No gap
- Q<n> <question>: <measurement>.

## Proposals
1. Q<n> <question> — gap | partial gap.
   Today: <what the repository does, with the measurement>.
   Change: <the proposal>.
   Evidence: <the case evidence, or "ours">. Cases: <links, if opened>.
   Depends on: <proposal numbers, or none>.
   Cost: S | M | L. Recommendation: do | later | skip.
   Check that proves it: <command or count to rerun after the change>.
2. ...
```

The record, `docs/migration-review.md` in the measured repository:

```markdown
# Migration review record: <repository>

Checklist: <ai-migrations commit or date>. Migration: <from> to <to>.

| # | Question | Proposal | Status | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- |
| 1 | Q<n> | <one line> | <status> | <commit, test run or number> | <YYYY-MM-DD> |
```

Status is one of: open, proven, waiting for first use, stopped holding, skipped.
