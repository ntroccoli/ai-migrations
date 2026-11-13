# Before you migrate: checklist

Questions to answer about a repository before an AI-driven migration to another language,
framework or library, or a large restructuring. Each has a **Check** an agent runs on the
repository, an **Evidence** line saying in our words what the cases show, and the cases that
support it; "ours" marks our own inference. Pitfalls by kind of move: [pitfalls.md](pitfalls.md).
How to run it and the report format are at the end.

Cases: [GitHub][] (TypeScript), [Bun][] (Zig) and [Intel][] (C) to Rust; [1Password][] (Go
restructuring); [Spotify][] (fleet changes); [Airbnb][] and [Slack][] (React tests); [Google][]
(wider IDs). Files are linked at the end.

1. **Is the move allowed, possible and worth it?**
   Check: find the written reason and the measured problem behind it (none written: ask the
   owner); repository rules that pin the stack, forbid new libraries or name an approver (one
   that forbids the target is a blocker); for each framework the product rests on (renderer, UI,
   desktop shell, platform or store SDK), its mature equivalent in the target, or mark the move a
   rewrite on a new base; where time, memory or money goes today (a profile, a bill) and whether
   the code to port is on that path; who maintains the result and whether they read the target
   language; what the target must win, as numbers where possible.
   Evidence: the cited cases start from a known problem or a forced move: GitHub's embedding,
   startup and memory, Bun's use-after-free crashes and leaks, Slack's test library lacking
   support for its next React version, Google's IDs nearing the int32 limit. The rest is ours.
   Cases: [GitHub][], [Bun][], [Slack][], [Google][].
2. **Is there a test oracle that survives the move and that the agent cannot edit?**
   Check: count the tests that exercise behaviour through a public interface (CLI, API, files
   written, a headless harness) apart from white-box tests; list public features with none; run
   them once and list those that fail or do not run. Find golden files tied to the old
   implementation and how they are regenerated. Say how results are compared across languages
   (plain-data summaries, tolerances) and how you confirm the tests ran. When the tests are what
   moves, say how intent and coverage are compared (coverage before and after, a hand-converted
   sample) and check new tests can fail. Find who must approve a test change (CODEOWNERS, branch
   rules, CI, the owner); none is a finding.
   Evidence: GitHub kept its end-to-end suites unchanged as the oracle; all but one regression
   that lost a feature came from gaps in them, a few tests asserted wrong behaviour, and one port
   deleted a test. Bun's suite, in a third language, judged the whole port: merge waited for a
   full pass on every platform with nothing skipped, and the author checked the tests ran; an
   outside critic replied that a suite that missed the old bugs cannot vouch for the new code.
   Intel's translation compiled yet crashed on `git blame` and other commands until repaired;
   model-written tests can pass trivially, it warns. Google's correct changes stalled on failing
   tests and goldens it could not regenerate. Spotify's worst case is green CI with wrong
   behaviour. Slack scored a sample against hand-converted files.
   Cases: [GitHub][], [Bun][], [Intel][], [Google][], [Spotify][], [Slack][].
3. **Can an agent build, check and test alone, fast, and in parallel, in both toolchains?**
   Check: find the command that builds, formats, lints and tests one unit in the old stack, and
   name the one for the target stack (pin its toolchain). Use recorded timings first (logs, CI
   history); otherwise time each, count the output lines of a failure, and run two worktrees at
   once. For the number of agents you plan, estimate compile time, disk space, disk speed and
   process limits; say how agents are kept from undoing each other's work, and which target
   platforms their machines can build and test. A missing formatter or linter is a finding.
   Evidence: GitHub's agents leaned on fast compiler feedback and needed a build lock when many
   built at once. Bun's agents sharing one checkout undid each other's work within minutes; a
   worktree each would have filled the disk, and a slow disk setting and heavy tests stalled or
   crashed the machine. 1Password gave each agent a worktree and warns that parallel agents need
   changes independent by design. Spotify's verify tool returns short errors but runs on Linux
   x86 only; Airbnb gated each file on tests, lint and types; Google ran cheap checks first.
   Cases: [GitHub][], [Bun][], [1Password][], [Spotify][], [Airbnb][], [Google][].
4. **How big is the job, really?**
   Check: scope is everything that must exist in the target. Count lines and files in scope
   (`git ls-files | xargs wc -l`, by folder) for code (GPU code counts), tests, build scripts,
   and other languages (shaders, generated files, templates or DSLs of the old stack). For a
   change across call sites, list every site with a code index or static analyzer, not text
   search alone, and keep the list. Add code tangled with the scope. List the data and asset
   formats both builds read, and stored data that must stay readable (rows, hashes, saves). Give
   the change rate in scope over the last quarter (`git log --since --numstat`): commits and
   lines per week, active days, last change. Code still changing fast: ask the owner whether to
   wait, or delete the old code in the change that ports it so later edits conflict.
   Evidence: GitHub's first count was about a third of what was finally ported, because code
   moved into scope and colleagues kept adding to the old code; deleting the old code in each
   port made such edits conflict. Google's code index beat its old text searches, though it
   listed irrelevant sites and could miss distant uses; 1Password's analyzer listed every site.
   Cases: [GitHub][], [Google][], [1Password][].
5. **Can the work ship in small units, with old and new side by side?**
   Check: split the scope into units (files, components, packages, repositories), draw their
   dependency order with the language's own read-only graph tool (`go list -deps`, `cargo tree`,
   an import graph), count the cycles, and mark the leaves that touch neither I/O nor shared
   state. Find the seam that lets one unit switch while the rest stays, and how the build links
   both languages meanwhile (seams by kind of move: [pitfalls.md](pitfalls.md#seams)). No seam:
   say so, the move is one switch. Check what the platform rules allow. Pick the pilot units.
   Evidence: GitHub replaced one component per pull request through a temporary interop layer,
   starting from pure leaf helpers; Intel went in dependency order, data structures first with
   round-trip tests, each cycle of symbols as one unit; Google ran one migration per ID, small
   ones first; Airbnb and Spotify moved one file or repository at a time. Bun made one switch
   after a trial on a few files, and its package split before the port left cycles that two
   more agent runs had to untangle. The cost of a mixed build is ours.
   Cases: [GitHub][], [Intel][], [Google][], [Airbnb][], [Spotify][], [Bun][].
6. **Is the end state written, and is the scope held?**
   Check: look for a written target for the whole migration (not one unit), before-and-after
   examples from this repository, sites grouped into patterns with a template each, when the
   agent must stop and escalate, a rule to translate first and redesign later, and a check on
   each diff for changes outside its scope. A repository rule against translating first (delete
   old paths, keep no compatibility) is a finding.
   Evidence: GitHub's agents ported only the hot paths until the full end state was written, and
   each redesign the lead allowed during the port cost regressions, time or tokens. Bun wrote a
   porting guide and a lifetime table first, kept the old design and left idiomatic code for
   later. 1Password's cleanup of over 3,000 call sites ran in hours from a list, templates and a
   playbook with escalation rules; on its service extraction an agent short of context guessed
   an identifier format. Spotify's judge rejects about a quarter of sessions, mostly for
   straying from the prompt; Google's model sometimes made unrelated edits.
   Cases: [GitHub][], [Bun][], [1Password][], [Spotify][], [Google][].
7. **What does the old stack do implicitly?**
   Check: search the scope for behaviour the target will not give for free, starting from the
   lists for this kind of move in [pitfalls.md](pitfalls.md); mark each item "like for like" or
   "needs a decision" and give the search you used (a count only says where to look). Make a
   table of direct dependencies: target library, version, stable release or archived (a missing
   framework is question 1).
   Evidence: GitHub's regressions all compiled; their kinds included implicit behaviour (number
   types, falsy defaults, time zone, environment, a Windows window flag), library differences,
   paired operations ported on one side only, and lifecycle and ordering bugs. Bun's were mostly
   lines that read the same in both languages but behave differently, plus a placeholder left
   in. Intel's compiling translation compared pointers by address where the C compared contents,
   and left stubs. Google's changes reached bit operations and SQL strings tied to the old width;
   1Password's agents ordered a backfill so rows could be lost silently and treated shared tables
   as their own.
   Cases: [GitHub][], [Bun][], [Intel][], [Google][], [1Password][].
8. **Is the code uniform enough for one prompt, and what context goes with it?**
   Check: group the units by kind of code (pure logic, concurrency, OS layer, GPU or UI, data
   pipelines) and by framework, build system and style. For each group, name the context an
   agent gets: the unit's source, its neighbours' tests, good examples, mapping tables for
   renamed fields or APIs, runtime facts a person would look at, and what a rule-based codemod
   can do first. Check the model handles each language in scope and the largest files fit its
   context window. A group too varied for one prompt is a candidate to defer or do by hand.
   Evidence: Spotify dropped one pipeline framework whose code varied too much for one prompt, and
   mapping tables fixed wrong field mappings; Airbnb found choosing related files mattered more
   than prompt wording. Slack gave the model a codemod's partial output with hints, plus each
   test's rendered output. Google's model handled Dart poorly and could not take its largest
   files, so people did those; GitHub split its largest file across child sessions; Intel chose
   each symbol's context by fixed rules, hardest callers first.
   Cases: [Spotify][], [Airbnb][], [Slack][], [Google][], [GitHub][], [Intel][].
9. **How will you work the long tail, stop, and learn from failures?**
   Check: look for a status record per unit, a way to rerun failing units by step, a retry limit,
   a rule for when to stop automating and finish by hand, and a place where a failure seen twice
   becomes a standing instruction, skill or eval. Say which exist and which the port must add.
   Evidence: Airbnb stamped each file with its status, tuned on small samples of failures, swept
   again, and finished the last files by hand once retries stopped helping. Google's nightly run
   kept the list of remaining sites current, yet its developers could not tell how many retries
   a file needed; Intel capped retries and retranslated a failing symbol from scratch. Slack's
   best pipeline got 80% of the content right on nine hand-checked files, and most test cases in
   a wider run failed. Bun fixed the process, not the code, when agents stubbed functions; GitHub
   turned repeated failures into instructions, skills and evals; Spotify asks the agent after
   each session what its prompt lacked.
   Cases: [Airbnb][], [Google][], [Intel][], [Slack][], [Bun][], [GitHub][], [Spotify][].
10. **What may the agent decide and reach alone, and who reviews?**
    Check: list the guardrails an agent could switch off (deleting or editing tests, updating
    snapshots or baselines, waiver labels, CI flags) and who must approve each; the steps kept
    for people (schema changes, backfills, deploy order); and the tools, skills and credentials
    agent sessions can reach. A rule written only in a document, with nothing enforcing it, is a
    partial gap. Ask the owner who reviews, whether they read the target language, and how many
    hours a week they have.
    Evidence: a GitHub agent applied a waiver label to pass a failing check, and a session merged
    a peer's worktree on its own after the peer refused; people there reviewed architecture and
    risk. Spotify's agents switched off unreliable tests unasked; its agent has few tools and
    never pushes. Bun's agents stubbed functions and excused workarounds in comments until
    reviewer agents, seeing only the diff, rejected that; an outside critic still called the
    merge unreviewed. 1Password's agents repeated ordering mistakes after being told the
    constraints; its engineers keep ordering and boundaries. Google had a developer and code
    owners accept every change; Intel made the compiler reject unsafe code. Budgeting reviewer
    time is ours.
    Cases: [GitHub][], [Spotify][], [Bun][], [1Password][], [Google][], [Intel][].
11. **How will changes reach users?**
    Check: find the release channels (pre-release, flags, canary), the share of users each
    reaches, how problems are reported and watched, and how one unit's change is rolled back (for
    a single-user or internal tool: what a release and a rollback are). Not released yet: mark it
    "not applicable yet" and say what must exist before the first release.
    Evidence: GitHub aimed to ship each port to a pre-release first, not always managing it, and
    some regressions reached a stable release; it compared issue rates before and during the
    port. Bun's merge was not a release: the build stayed a canary while regressions were fixed.
    Google rolled its two largest migrations out slowly, owners watching. A rollback path per unit
    is ours.
    Cases: [GitHub][], [Bun][], [Google][].
12. **How will you measure cost and result?**
    Check: write down the manual estimate and how it was made. Measure, before the port and on
    fixed hardware, the number the product exists for (speed, latency, memory, output quality),
    and the part the port changes, if not the same path. Plan to record tokens or spend, engineer
    hours, pull requests, regressions after merge and reverts, marking measured against estimated.
    Evidence: GitHub benchmarked before and after and gave its token bill, warning that other
    changes landed in the same window; Bun priced its tokens at list rates, benchmarked on one
    machine of its own and counted regressions after merge. Google measured shares as edit
    distance; Slack's rates rest on different bases; Intel gives a cost per symbol, not a total.
    Every manual-effort or saving figure is the team's own estimate. Recording reverts is ours.
    Cases: [GitHub][], [Bun][], [Google][], [Slack][], [Intel][], [Airbnb][], [Spotify][], [1Password][].

## Starting thresholds

Only where a case gives a number. They are starting points from one case each, not targets;
adjust them to the repository. For a question without a line here, judge "gap" from the Check alone.

- Q9: Airbnb saw most simple and medium files pass within about 10 attempts, and 50 to
  100 attempts on the hardest gained little before people finished them; it tuned each fix on 5
  to 10 failing files before sweeping again. No retry limit, or no rule to stop and hand-port, is
  a gap. [Airbnb][]
- Q5: Bun ran its whole loop on 3 files before all 1,448. No pilot before the bulk run is a gap.
  [Bun][]
- Q4: GitHub's first count was about 130,000 lines and about 430,000 went through the port. A
  scope count with no allowance for code moving in and new code arriving is a partial gap.
  [GitHub][]

## How to run this checklist

1. Run it in a fresh session on the repository to migrate, changing nothing there. The cases are
   eight, a small base, mostly teams' own accounts: if you can open them, read their "What went
   wrong" sections before you rely on them.
2. Measure first: answer each Check with a number, file or command output, not from memory.
3. A check you may not run (read-only review, shared hardware, no target toolchain yet): write the
   exact command, mark it "not run" with the reason, never guess its result. Logs or CI history
   count if you say where they came from.
4. A fact only the owner knows (review time, budget, approval of a new stack): write the question
   and mark it "ask the owner".
5. Mark each question "gap", "partial gap", "no gap" or "not applicable yet", with the
   measurement.
6. Write proposals from the Evidence lines and, if you can open the cases, the linked cases'
   "Practices to copy" (`[stated]` by the source or `[ours]`) and "What went wrong". Compare
   numbers across cases only when their units match.
7. Order proposals by what blocks the rest: blockers first (a "no" on question 1 is the usual
   one), then what others depend on (the oracle, the baseline, the end state), then the rest.
   After a no-go on question 1, give the verdict and the blockers, and list the other gaps one
   line each, with no proposals.
8. Report as below and wait for the owner's choice.
9. Record: once the owner has chosen, write `docs/migration-review.md` in the measured repository
   (the one file this checklist adds there): each proposal with its status (open, proven, waiting
   for first use, stopped holding, skipped) and, for proven and stopped holding, the event that
   shows it (a commit, a test run, a measured number) and its date. In a read-only run, put the
   record after the report instead.
10. Revisit: a later run reads that record first and re-checks only the open, waiting and
    stopped-holding items, plus any question whose measurement may have moved (new code in scope,
    a new toolchain). Update each status with the date and the event; reopen proven or skipped
    items only if their check now fails.

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
- Q<n> <question>: <measurement>. <Optional one-line note.>

## Not applicable yet
- Q<n> <question>: <why, and what must exist first>.

## Proposals

<After a no-go on Q1, replace this section with "Other gaps": one line per gap.>

1. Q<n> <question> — gap | partial gap.
   Today: <what the repository does, with the measurement>.
   Change: <the proposal>.
   Evidence: Q<n> in the checklist, plus anything you read in the cases (links).
   Depends on: <proposal numbers, or none>.
   Cost: S | M | L (S under a day of agent work, M a few days, L a week or more).
   Recommendation: do | later | skip.
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

[GitHub]: cases/2026-09-16-github-copilot-runtime-rust.md
[Bun]: cases/2026-07-08-bun-zig-to-rust.md
[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md
[1Password]: cases/2026-04-20-1password-monolith-refactor.md
[Spotify]: cases/2025-11-06-spotify-honk.md
[Airbnb]: cases/2025-04-01-airbnb-enzyme-to-rtl.md
[Google]: cases/2025-04-13-google-int64-ids.md
[Slack]: cases/2024-05-22-slack-enzyme-to-rtl.md
