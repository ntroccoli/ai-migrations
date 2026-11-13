# Before you migrate: checklist

Questions to answer about a repository before an AI-driven migration to another language,
framework or library. Each question has a "Check" an agent can run on the repository, and links
to the cases it comes from. The wording is ours; the cases hold the evidence, and three cases are
a small base (see their "What went wrong" sections). How to run it and the report format are at
the end.

1. **Is there a test oracle the agent cannot edit?**
   Check: list the end-to-end and integration test suites that exercise public behaviour, count
   their tests, and run them once. Find whether a change to those tests needs a separate owner or
   approval (CODEOWNERS, branch rules, CI checks). No suite, or a suite the migrating agent may
   rewrite, is a gap. Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Spotify](cases/2025-11-06-spotify-honk.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
2. **Can an agent build, lint and test alone, fast, and in parallel?**
   Check: find the single command (or write it down) that formats, builds, lints and tests one
   unit; time it; measure how long its output is on failure. Run it in two worktrees at once.
   Slow, noisy or shared-state steps are gaps.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Spotify](cases/2025-11-06-spotify-honk.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
3. **How big is the job, really?**
   Check: count the lines and files in scope, then add code that will move into scope (layers
   tangled with it) and the rate of incoming change: commits and lines per week that touch the
   scope over the last quarter (`git log --since`). A scope with no measured change rate is a
   gap. Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
4. **Can the work ship in small units, old and new side by side?**
   Check: split the scope into units (files, components, repositories) and draw their dependency
   order; mark leaf units with no I/O or shared state. Find whether a unit can switch to the new
   code while the rest stays on the old (a shim, an interop layer, per-file independence). Pick
   the first pilot units. Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md), [Spotify](cases/2025-11-06-spotify-honk.md).
5. **Is the end state written so an agent can check it?**
   Check: look for a written target (what done means for the whole migration, not one unit),
   before-and-after examples from this repository, and the cases where the agent must not act.
   Missing any of the three is a gap.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Spotify](cases/2025-11-06-spotify-honk.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
6. **What does the old stack do implicitly?**
   Check: search the scope for behaviour the target will not give for free: loose number types,
   falsy defaults, time zone and locale, environment reads, patched platform calls, global state.
   List each dependency and whether the target ecosystem has a like-for-like replacement.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md).
7. **Is the code uniform enough for one prompt?**
   Check: count the distinct frameworks, build systems and coding styles in scope, and how many
   units each covers. Group the units; a group too varied to describe in one prompt with
   examples is a candidate to defer or do by hand.
   Cases: [Spotify](cases/2025-11-06-spotify-honk.md), [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md).
8. **How will you work the long tail and stop?**
   Check: look for a per-unit status record, a way to rerun failing units by step, a retry limit,
   and a rule for when to stop automating and finish by hand. A plan with none of these is a gap.
   Cases: [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md),
   [Spotify](cases/2025-11-06-spotify-honk.md).
9. **What may the agent decide alone, and who reviews?**
   Check: list the guardrails an agent could switch off (waiver labels, snapshot updates, skipped
   or disabled tests, baselines) and who must approve each. Count reviewer hours per week against
   the expected pull requests per week. Look for a scope check on each diff (a judge, a size limit).
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Spotify](cases/2025-11-06-spotify-honk.md).
10. **How will you measure cost and result?**
   Check: write down the manual estimate before you start and how it was made, then plan to
   record tokens or API spend, engineer hours, pull requests, regressions found after merge and
   reverts. Name which numbers will be measured and which are estimates.
   Cases: [GitHub](cases/2026-09-16-github-copilot-runtime-rust.md),
   [Airbnb](cases/2025-04-01-airbnb-enzyme-to-rtl.md), [Spotify](cases/2025-11-06-spotify-honk.md).

## How to run this checklist

1. Run it in a fresh session on the repository you plan to migrate. Change nothing.
2. Measure first: answer every question with the number, file or command output its Check asks
   for, not from memory.
3. Mark each question "gap", "partial gap" or "no gap", with the measurement. List the questions
   with no gap in one line each.
4. For each gap, open only the linked cases' "Practices to copy" and "What went wrong" to write
   the proposal. Do not compare numbers across cases unless their units match.
5. Report as below and wait for the owner's choice.

## Report format

```markdown
# Before-you-migrate review: <repository>, <YYYY-MM-DD>

Migration: <from> to <to>. Scope measured: <lines, files, units, change rate per week>.

## No gap
- Q<n> <question>: <measurement>.

## Proposals
1. Q<n> <question> — gap | partial gap.
   Today: <what the repository does, with the measurement>.
   Change: <the proposal>.
   Cases: <links to the cases behind it>.
   Cost: S | M | L. Recommendation: do | later | skip.
   Check that proves it: <command or count to rerun after the change>.
2. ...
```
