# Before you migrate: checklist

Questions to answer about a repository before an AI-driven move to another language, framework
or library, or a large restructuring. Each has a **Check** an agent runs, an **Evidence** line in
our words ("ours" marks our inference) and the **Lessons** behind it (`TST-2`: lesson 2 on the
testing page; listed in [lessons/evidence.md](lessons/evidence.md)).

Cases named below (moves in [index.md](index.md)): [1Password][], [Airbnb][], [Asana][], [Bloomberg][],
[Bun][], [Checkly][], [GitHub][], [GitLab][], [Google][], [Intel][], [Ladybird][], [PagerDuty][], [Pokémon][],
[Shopify][], [Slack][], [Spartacus][], [Spotify][], [Temporal][], [ts-rust][], [Zalando][], [Uber][] (a contrast case).

1. **Is the move allowed, possible and worth it?**
   Check: find the written reason and the measured problem behind it (none written: ask the
   owner); repository rules that pin the stack, forbid new libraries or name an approver (one
   that forbids the target is a blocker); for each framework the product rests on (renderer, UI,
   desktop shell, platform or store SDK), its mature equivalent in the target, or mark the move a
   rewrite on a new base; where time, memory or money goes today (a profile, a bill) and whether
   the code to port is on that path; who maintains the result and whether they read the target
   language; what the target must win, as numbers where possible.
   Evidence: the cases start from a known problem or forced move (GitHub's startup and memory,
   Bun's crashes, Slack's blocked React upgrade, Google's int32 limit). The rest is ours.
   Lessons: PLN-7, PLN-8, PLN-9, SEC-7.
2. **Is there a test oracle that survives the move and that the agent cannot edit?**
   Check: count the tests that exercise behaviour through a public interface (CLI, API, files
   written, a headless harness) apart from white-box tests; list public features with none; run
   them once and list those that fail or do not run. Find golden files tied to the old
   implementation and how they are regenerated. Say how results are compared across languages
   (plain-data summaries, tolerances) and how you confirm the tests ran. When the tests are what
   moves, say how intent and coverage are compared (coverage before and after, a hand-converted
   sample) and check new tests can fail. Say whether old and new can run the same inputs side by
   side, outputs compared (a differential or shadow run), and how late a wrong
   change first fails (build, tests, or only once deployed). Find who must approve a test change
   (CODEOWNERS, branch rules, CI, the owner); none is a finding.
   Evidence: GitHub's unchanged end-to-end suites were the oracle; its feature-loss regressions
   came almost all from their gaps. Bun's suite, in a third language, judged the whole port (a
   critic notes it missed the old bugs). Google's correct changes stalled on failing tests and
   goldens; Spotify's worst case is green CI with wrong behaviour. Intel, Shopify, ts-rust,
   Pokémon and Ladybird ran old and new on the same inputs (Ladybird also edited its expected
   outputs in that change). Bloomberg's changes could fail only once deployed; Checkly's harness
   passed while production retries failed.
   Lessons: TST-1, TST-2, TST-3, TST-4, TST-5, TST-6, TST-8, TST-10, TST-12, TST-13, TST-14, TST-15,
   VER-5, VER-11, OVS-1.
3. **Can an agent build, check and test alone, fast, and in parallel, in both toolchains?**
   Check: find the command that builds, formats, lints and tests one unit in the old stack, and
   name the one for the target stack (pin its toolchain). Use recorded timings first (logs, CI
   history); otherwise time each, count the output lines of a failure, and build and test two
   fresh clones outside the repository at once as an agent would (install dependencies, count
   the tests that ran, cap the time; not worktrees, which write into the measured repository's
   `.git`). For the agents you plan, estimate compile time, disk space and speed, and process
   limits; say how agents are kept from undoing each other's work, and which target platforms
   their machines can build and test; for an app, how an agent drives it and how long one test
   takes. A missing formatter or linter is a finding.
   Evidence: GitHub needed a build lock. Bun's agents sharing one checkout undid each other's work
   within minutes, and heavy tests stalled the machine. 1Password and Spartacus gave each agent a
   worktree (Spartacus's tests failed to start there); Spotify's verify tool returns short
   errors. Shopify's agents took minutes per test in simulators; Asana's lint was slow and CI disagreed with local runs.
   Lessons: OPS-1, OPS-2, OPS-3, ORC-1, ORC-2, VER-2, VER-4, TOL-6, TOL-8.
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
   wait, or delete the old code in the change that ports it so later edits conflict.
   Evidence: GitHub's scope grew about threefold as code moved in and the old code kept
   growing. Google's code index beat text search but listed irrelevant sites; 1Password's
   analyzer listed every site.
   Lessons: PLN-3, PLN-10, ROL-4, TOL-1, TOL-3, MSR-8.
5. **Can the work ship in small units, with old and new side by side?**
   Check: split the scope into units (files, components, packages, repositories), draw their
   dependency order with a read-only graph tool for the language (`go mod graph`, `cargo tree`,
   `jdeps`, `madge`, `pydeps`), and count the cycles (Go and Cargo forbid package cycles: look
   between modules or files instead), and mark the leaves that touch neither I/O nor shared
   state. Find the seam that lets one unit switch while the rest stays, and how the build links
   both languages meanwhile (seams by kind of move: [pitfalls.md](pitfalls.md#seams)). No seam:
   say so, the move is one switch. Check what the platform rules allow. Pick the pilot units.
   Evidence: GitHub swapped one component per pull request through a temporary interop layer,
   leaves first; Intel went in dependency order; Google, Airbnb and Spotify moved one ID, file or
   repository at a time. Bun made one switch after a small trial, and cycles left by its package
   split took two more agent runs. Shopify's author says one-pass ports give code that cannot ship;
   small reviewed checkpoints replaced them. The cost of a mixed build is ours.
   Lessons: PLN-1, PLN-4, PLN-11, ROL-1, ROL-6, ORC-4.
6. **Is the end state written, and is the scope held?**
   Check: look for a written target for the whole migration (not one unit), before-and-after
   examples from this repository, sites grouped into patterns with a template each, when the
   agent must stop and escalate, a rule to translate first and redesign later, and a check on
   each diff for changes outside its scope. A repository rule against translating first (delete
   old paths, keep no compatibility) is a finding.
   Evidence: GitHub's agents ported only the hot paths until the full end state was written, and
   each redesign allowed mid-port cost regressions, time or tokens. Bun wrote a
   porting guide first and left idiomatic code for later. 1Password's call-site cleanup ran from
   a list, templates and escalation rules; Spotify's judge rejects sessions mostly for straying
   from the prompt. Gatsby and Datadog built the target's design first.
   Lessons: CTX-4, PLN-2, PLN-5, PLN-13, REV-4, AGF-2, AGF-4.
7. **What does the old stack do implicitly?**
   Check: search the scope for behaviour the target will not give for free, with the lists for
   this kind of move in [pitfalls.md](pitfalls.md) as it says. Make a table of direct dependencies: target
   library, version, stable release or archived (a missing framework is question 1).
   Evidence: the regressions compiled: GitHub's runtime defaults and one-sided paired operations,
   Bun's lines that read alike but behave differently, Intel's pointer comparison, Google's bit
   operations and SQL tied to the old width, 1Password's backfill order, Zalando's wrong data
   mapping that broke a live page, PagerDuty's equality change.
   Lessons: REV-3, OPS-4, TST-7, VER-6, SEC-5, SEC-6, AGF-3, SEC-10.
8. **Is the code uniform enough for one prompt, and what context goes with it?**
   Check: group the units by kind of code (pure logic, concurrency, OS layer, GPU or UI, data
   pipelines) and by framework, build system and style. For each group, name the context an
   agent gets: the unit's source, its neighbours' tests, good examples, mapping tables for
   renamed fields or APIs, runtime facts a person would look at, and what a rule-based codemod
   can do first. Pilot the model on the hardest files of each language in scope, and check the
   largest files fit its context window. A group too varied for one prompt is a candidate to defer
   or do by hand. Search docs and agent instructions for advice favouring the old stack.
   Evidence: Spotify dropped a framework too varied for one prompt; mapping tables fixed wrong
   field mappings. Airbnb's choice of related files mattered more than wording; Slack gave the
   model a codemod's partial output and each test's rendered output. Google's model handled Dart
   poorly, so people did it; Uber's recipes did a move its AI attempt failed. Bloomberg gave each
   kind of target its own prompt; stale docs misled Asana's agents; Pokémon split files the agent
   would not open.
   Lessons: CTX-1, CTX-2, CTX-3, CTX-5, CTX-9, CTX-10, CTX-11, CTX-12, CTX-13, TOL-2, TOL-7, TOL-9,
   AGF-8, PLN-8, PLN-12.
9. **How will you work the long tail, stop, and learn from failures?**
   Check: look for a status record per unit, a way to rerun failing units by step, a retry limit
   (for independent units such as files; where units depend on each other, a rule to fix the
   workflow and rerun instead), a rule for when to stop automating and finish by hand, and a place
   where a failure seen twice becomes a standing instruction, skill or eval.
   Evidence: Airbnb stamped each file with its status, swept again after each fix and finished
   the last files by hand; Intel capped retries. GitHub turned repeated failures into
   instructions, skills and evals; Spotify asks the agent what its prompt lacked; Zalando reran a golden set after each prompt
   change. Uber put files whose tests failed back on the old framework. ts-rust's first attempt
   stalled for months, no stop rule stated; Spartacus now stops for a person after each wave.
   Lessons: VER-3, KNW-1, KNW-2, KNW-4, KNW-5, OVS-3, OVS-5, CTX-7, AGF-7, OPS-6, ROL-8, TST-11.
10. **What may the agent decide and reach alone, and who reviews?**
    Check: list the guardrails an agent could switch off (deleting or editing tests, updating
    snapshots or baselines, waiver labels, CI flags) and who must approve each; the steps kept
    for people (schema changes, backfills, deploy order); and the tools, skills and credentials
    agent sessions can reach. A rule only written down, with nothing enforcing it, is a
    partial gap. Changes in other teams' code: count the owning teams, whether they asked
    for the move, who carries the deploy risk. Ask the owner who reviews, whether they
    read the target language, and their hours a week.
    Evidence: a GitHub agent applied a waiver label to pass a failing check, and a session merged
    a peer's worktree unasked; Spotify's agents switched off unreliable tests; Bun's agents
    stubbed functions until reviewer agents, seeing only the diff, rejected that; 1Password's
    agents repeated ordering mistakes after being told. Most of Bloomberg's unrequested pull
    requests got no decision from their owners; Shopify needed reviewers who knew the target
    platform.
    Lessons: OVS-1, OVS-2, AGF-1, AGF-5, AGF-9, SEC-1, SEC-2, SEC-3, REV-1, REV-2, REV-9, REV-11,
    TEM-4, TEM-6, ROL-9.
11. **How will changes reach users?**
    Check: find the release channels (pre-release, flags, canary), the share of users each
    reaches, how problems are reported and watched, and how one unit's change is rolled back (for
    a single-user or internal tool: what a release and a rollback are). Not released yet: mark it
    "not applicable yet" and say what must exist before the first release.
    Evidence: GitHub aimed to ship each port to a pre-release first, yet some regressions reached
    stable; Bun's merged build stayed a canary while regressions were fixed; Google rolled its
    largest migrations out slowly, owners watching. Temporal compared every query and cut over
    read-only paths first; GitLab ramped to full traffic past a divergence its shadow run flagged
    but did not label. A rollback path per unit is ours.
    Lessons: ROL-2, ROL-3, ROL-5, ROL-7, ROL-10, ROL-11, VER-1, OPS-5, OPS-8.
12. **How will you measure cost and result?**
    Check: write down the manual estimate and how it was made. Measure, before the port and on
    fixed hardware, the number the product exists for (speed, latency, memory, output quality),
    and the part the port changes, if not the same path. Plan to record tokens or spend, engineer
    hours, pull requests, regressions after merge and reverts, marking measured against estimated.
    Evidence: GitHub benchmarked before and after (amid other changes) and gave its token bill;
    Bun and ts-rust priced tokens at list rates (ts-rust's restart used flat-rate plans); Bun
    counted regressions after merge; Google measured shares as edit distance. Every effort or saving
    figure is the team's own estimate. Bloomberg also counted undecided pull requests, and
    owners' migrations that reused rejected ones. Recording reverts is ours.
    Lessons: CST-1, CST-2, CST-6, CST-7, MSR-1, MSR-2, MSR-4, MSR-5, MSR-9, MSR-10, TST-9, KNW-3.

## Starting thresholds

Starting points from one case each, not targets; elsewhere judge "gap" from the Check alone.

- Q4: GitHub first counted about 130,000 lines; about 430,000 went through the port. A scope
  count with no allowance for code moving in or newly written is a partial gap.
  [GitHub][]
- Q5: Bun ran its whole loop on 3 files before all 1,448. No pilot before the bulk run is a gap.
  [Bun][]
- Q9: most of Airbnb's simple and medium files passed within about 10 attempts; 50 to 100
  attempts on the hardest gained little. No retry limit, or no rule to stop and hand-port, is a
  gap. [Airbnb][]

## How to run this checklist

1. Run it in a fresh session on the repository to migrate, changing nothing there. The cases are
   few and mostly their teams' own accounts: read "What went wrong" before relying on them.
2. Measure first: answer each Check with a number, file or command output, not from memory.
3. A check you may not run: write the exact command, mark it "not run" with the reason, never
   guess its result. Logs or CI history count if you name their source.
4. A fact only the owner knows (review time, budget, approval of a new stack): write the question,
   mark it "ask the owner" and state a default; unanswered, assume it, note it in the record, go on.
5. Mark each question "gap", "partial gap", "no gap" or "not applicable yet", with the
   measurement.
6. Base proposals on the Evidence lines and, if you can, the cited lessons (their "Against"
   lines and oracle tags) and the case sections they link, above all "Practices to copy".
   Compare numbers across cases only in matching units.
7. Order proposals by what blocks the rest: blockers first (a "no" on question 1 is the usual
   one), then what others depend on (the oracle, the baseline, the end state), then the rest.
8. Report as below and wait for the owner's choice. One change per proposal (or parts 3a, 3b).
9. Record: once the owner has chosen, write `docs/migration-review.md` in the measured repository
   (the one file this checklist adds there; format below). In a read-only run, write no file;
   show the record after the report.
10. Revisit as step 7 of [applying the lessons](docs/applying-lessons.md) says, with the questions its `changes/` files list as well as the lessons.
11. Share (optional): a [field report](docs/field-reports.md) once an item has met its problem.

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

The record, `docs/migration-review.md` in the measured repository:

```markdown
# Migration review record: <repository>

Checklist: <ai-migrations commit or date>. Migration: <from> to <to>.
Log entry: <date and title of the newest log.md entry this review covered>.

| # | Question | Proposal | Baseline | Status | Event that shows it | Date |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Q<n> | <one line> | <how often, evidence> | <status> | <commit, test run or number> | <YYYY-MM-DD> |
```

One status per row (a proposal's parts: rows 3a, 3b): open, proven, waiting for first use,
stopped holding, skipped. "Later" is open; declined is skipped; a failed "Check now" stays open,
its event naming it. A passed "Check now" is waiting for first use; its "Event that proves it",
seen in later work, makes it proven. Assumed owner answers: one line each under the table.
Baseline: written before any change, how often the problem happened so far, with evidence; a
revisit compares with it. Outside a migration, the lessons route keeps a
record of the same shape: [docs/applying-lessons.md](docs/applying-lessons.md).

[GitHub]: cases/2026-09-16-github-copilot-runtime-rust.md
[Bun]: cases/2026-07-08-bun-zig-to-rust.md
[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md
[1Password]: cases/2026-04-20-1password-monolith-refactor.md
[Spotify]: cases/2025-11-06-spotify-honk.md
[Airbnb]: cases/2025-04-01-airbnb-enzyme-to-rtl.md
[Google]: cases/2025-04-13-google-int64-ids.md
[Slack]: cases/2024-05-22-slack-enzyme-to-rtl.md
[Uber]: cases/2026-04-07-uber-junit4-to-junit5.md
[Zalando]: cases/2025-02-20-zalando-ui-component-libraries.md
[Asana]: cases/2026-08-07-asana-enzyme-to-rtl.md
[Shopify]: cases/2026-09-10-shopify-react-native-to-native.md
[Bloomberg]: cases/2026-11-03-bloomberg-python-cpp-uplift.md
[Pokémon]: cases/2026-01-25-vjeux-pokemon-showdown-rust.md
[ts-rust]: cases/2026-10-07-ping-tsgo-to-rust.md
[Spartacus]: cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md
[Ladybird]: cases/2026-02-23-ladybird-libjs-rust.md
[Checkly]: cases/2026-09-01-checkly-nodejs-to-go.md
[Temporal]: cases/2026-09-02-temporal-billing-store-clickhouse.md
[GitLab]: cases/2026-07-08-gitlab-rate-limiting.md
[PagerDuty]: cases/2026-04-13-pagerduty-rundeck-grails-7.md
