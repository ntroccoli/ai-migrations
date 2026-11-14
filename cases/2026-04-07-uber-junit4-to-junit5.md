---
title: Uber moves 75K test classes off JUnit 4 onto JUnit 5 with OpenRewrite; an AI attempt failed
date: 2026-04-07
company: Uber
summary: Contrast case. Rule-based OpenRewrite recipes moved over 75,000 Java test classes onto JUnit 5; a generative-AI attempt failed and AI only helped debug.
source_url: https://www.uber.com/blog/junit-migration/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: test-framework
from: Java tests on JUnit 4 in a Bazel monorepo
to: Java tests on JUnit 5 (Jupiter engine on the JUnit Platform)
from_languages: [Java]
size: over 75,000 test classes; over 1.25 million lines changed
duration: 4 months
people: unstated
cost: unstated
ai_share: little
tools: [OpenRewrite, custom OpenRewrite recipes, custom Bazel test runner, custom Bazel aspect, Shepherd (internal code-change tool), Bazel, CI]
models: [unstated]
period: 2025..2026
outcome: partial
status: current
superseded_by:
---

# Uber moves 75K test classes off JUnit 4 onto JUnit 5 with OpenRewrite; an AI attempt failed

This is a contrast case: the move was done by rule-based tools, not by AI. Uber's Java platform
team first made Bazel run tests on the JUnit Platform, then built OpenRewrite recipes that
rewrote only the files whose runners, rules and test base classes they supported. A script applied
each patch, built the target and ran its tests; an internal tool turned passing targets into
diffs for CI. Repeated rollouts, with new recipes for common build failures and failing files
put back on JUnit 4, moved over 75,000 test classes in 4 months. The team tried generative AI to
migrate several test files at once; it did not work, and AI was kept to debugging failures
([source](https://www.uber.com/blog/junit-migration/)).

## Source

A post on Uber's engineering blog by two engineers of its Java platform team, dated 2026-04-07.
Uber does not sell the tools it used; OpenRewrite is an open-source framework from Moderne, and
the authors say they sent improvements to its recipes upstream. The post explains its method
with diagrams, commands and one table of usage counts, but states its outcome numbers without the
data behind them. It names no model, team size or cost. The site answers automated clients with
an error; the full text was archived on 2026-11-13 by reading the page in a browser, and our
checks ran against that text
([source](https://www.uber.com/blog/junit-migration/)).

## What was migrated

Java tests in Uber's Bazel monorepo: over 600,000 tests written for JUnit 4, spanning code that totals 15 million lines.
Active development of JUnit 4 had stopped in 2021, and future JUnit releases plan to drop it.
Bazel runs JUnit 4 natively but not the JUnit Platform that JUnit 5 needs, so the build had to
change before any test could move. The post reports over 75,000 test classes migrated; it does
not say how many of the 600,000 tests those classes hold
([source](https://www.uber.com/blog/junit-migration/)).

## Who did what

- **AI:** generative AI (no model or tool named) was tried for migrating several test
  files in one go and failed. The authors say AI had one role only: helping to debug failed builds and
  tests. On that statement we record its share of the changed code as little; the post gives
  no figure.
- **Rule-based tools:** all the rewrites of test files. A custom Bazel test runner put tests of both JUnit
  versions under the JUnit Platform. A custom Bazel aspect fed each test target's sources and classpath to
  OpenRewrite, which ran a composite recipe: a precondition filter, OpenRewrite's own JUnit migration
  recipe, Uber's recipes for its in-house runners, rules and test base classes, and a dependency finder. A shell
  script applied the patch, added dependencies, built and tested each target; Shepherd, an
  internal code-change tool, made one diff per passing target; CI ran integration tests, linters
  and coverage checks on each diff.
- **People:** the Java platform team built the runner, aspect, recipes and script, measured how
  often each test utility was used, wrote JUnit 5 equivalents for internal utilities, analysed
  failure logs after each rollout, wrote recipes for common build failures, put failing files
  back on JUnit 4, and contributed recipe improvements upstream. Who reviewed the diffs is not stated.

## How it was checked

Each target counted as migrated only if it built and all its tests passed after the patch; a
build failure stopped that target, and a test failure also named the failing classes. Each resulting diff then went through
Uber's CI, which includes integration tests, linters and enforced code coverage. Whether people
reviewed the diffs or compared test counts before and after is not stated
([source](https://www.uber.com/blog/junit-migration/)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| over 600,000 tests | JUnit 4 tests in the monorepo before the move | reported | [post](https://www.uber.com/blog/junit-migration/) |
| 15 million lines | lines of code those tests span | reported | [post](https://www.uber.com/blog/junit-migration/) |
| over 75,000 test classes | test classes migrated to JUnit 5 | reported | [post](https://www.uber.com/blog/junit-migration/) |
| over 1.25 million lines | lines of code changed (given elsewhere in the post as nearly 1.25 million lines) | reported | [post](https://www.uber.com/blog/junit-migration/) |
| 4 months | time in which the classes were migrated | reported | [post](https://www.uber.com/blog/junit-migration/) |
| over 5,000 code-change diffs | diffs generated by the automated changes | reported | [post](https://www.uber.com/blog/junit-migration/) |
| over 2,000 code-change diffs | diffs from the first rollout | reported | [post](https://www.uber.com/blog/junit-migration/) |
| 751 files | files using the ExpectedException rule | measured | [post](https://www.uber.com/blog/junit-migration/) |
| 346 files | files using the TemporaryFolder rule | measured | [post](https://www.uber.com/blog/junit-migration/) |
| 264 files | files using an internal DSLite test container rule | measured | [post](https://www.uber.com/blog/junit-migration/) |
| 162 files | files using an internal MariaDB test container rule | measured | [post](https://www.uber.com/blog/junit-migration/) |

## What worked

- Changing the build first: a custom runner let tests of both versions run side by side under one
  platform, and every test module was onboarded to it before any test moved, which the authors call the foundation without which the move could not have happened
  ([source](https://www.uber.com/blog/junit-migration/)).
- A deterministic rewrite on a typed syntax tree, chosen so that changes would keep type safety
  and meaning; the authors judged it more practical than AI for a code base of this size with many in-house test
  patterns ([source](https://www.uber.com/blog/junit-migration/)).
- Precondition filters skipped any file using a runner, rule or base class the recipes did not
  support, so no file was left half on JUnit 4 and half on JUnit 5 and one hard file did not block
  its target ([source](https://www.uber.com/blog/junit-migration/)).
- Search recipes counted how often each runner and rule was used (751 files for the top rule in the
  post's sample table), and the recipes were built around the most used ones
  ([source](https://www.uber.com/blog/junit-migration/)).
- A one-argument script per target and Shepherd to fan out over thousands of targets (running
  them locally was judged impractical, taking several hours); the first
  rollout already produced over 2,000 code-change diffs, and rollouts were repeated with new
  recipes for each common build failure
  ([source](https://www.uber.com/blog/junit-migration/)).

## What went wrong

- **The AI attempt failed:** the team tried generative AI to migrate several test
  files in one go and calls the approach unsuccessful. The post gives no model, no attempt size, no date and
  no reason for the failure; it says only that, at its scale and with its custom test patterns, a
  deterministic approach was more practical. AI stayed in a side
  role, helping to debug failed builds and tests ([source](https://www.uber.com/blog/junit-migration/)).
- OpenRewrite could not run on Bazel as shipped; the team had to build a Bazel aspect and an
  integration layer first ([source](https://www.uber.com/blog/junit-migration/)).
- Many targets did not migrate on the first rollout, because builds broke, tests failed or
  patterns were unsupported ([source](https://www.uber.com/blog/junit-migration/)).
- Files whose tests failed after migration were put back on JUnit 4 rather than fixed, since
  diagnosing each failure was not practical across so many files. Files with unsupported
  runners, test rules or base classes were skipped until a recipe supported them; how many
  remain on JUnit 4 is not stated. The post calls the migration a success but never says it
  finished, so we record the outcome as partial ([source](https://www.uber.com/blog/junit-migration/)).
- **Not reported:** how many tests or files stayed on JUnit 4; the failure rate per rollout; how
  many rollouts ran; team size and hours; who reviewed the diffs and how long that took; any
  defects or flaky tests after merge; whether test counts were compared before and after, and the coverage threshold CI enforced;
  details of the failed AI attempt (model, prompts, files tried, how it failed); exact dates; the engineering hours saved, which the post calls countless without a figure.

## Practices to copy

- [stated] Make the build and test runner support old and new framework side by side before changing any test. ([Prerequisites](https://www.uber.com/blog/junit-migration/))
- [stated] Gate each file on a list of supported patterns, and skip files the rules cannot fully convert instead of leaving them half migrated. ([Preconditions](https://www.uber.com/blog/junit-migration/))
- [stated] Count how often each runner, rule and base class is used across the code base, and build the transforms around the most used. ([Transformation logic](https://www.uber.com/blog/junit-migration/))
- [stated] Accept a unit only when it builds and its tests pass after the change, then send each unit as its own diff through CI. ([Orchestration](https://www.uber.com/blog/junit-migration/))
- [stated] Roll out in waves: run, group failure logs, add rules for common failures, run again; revert what fails tests. ([Rollouts](https://www.uber.com/blog/junit-migration/))
- [stated] In a large code base with many custom test patterns, prefer a deterministic rewrite on a typed syntax tree to an AI-driven migration. ([Key learnings](https://www.uber.com/blog/junit-migration/))
- [ours] Record a failed AI attempt in enough detail (model, unit size, failure) for others to reuse; this source gives none. ([Key learnings](https://www.uber.com/blog/junit-migration/))

## Context

- Why it is here: the collection keeps only migrations done with AI. This one is kept as a
  contrast, because the source reports a failed AI attempt and a rule-based tool doing the work.
  The model era of that attempt is only roughly known: the post names no model; dated April 2026,
  it says JUnit 4 was still the main framework earlier that year and that the move took 4 months,
  so we put the work in 2025 to 2026 ([source](https://www.uber.com/blog/junit-migration/)).
- Same kind of move done with an LLM, at a smaller scale (their counts use other units):
  [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md) and
  [Slack Enzyme to RTL](2024-05-22-slack-enzyme-to-rtl.md); Slack also ran a rule-based
  codemod first and gave its output to the model.
- Rule-based site finding with a model making the edits:
  [Google int64 IDs](2025-04-13-google-int64-ids.md). Fleet-wide changes that moved from
  scripted transforms to agents: [Spotify Honk](2025-11-06-spotify-honk.md).
- Uber has built tooling that runs OpenRewrite from a Bazel rule when building Spring Boot 3 services,
  and names further moves it pursues or plans: Joda-Time to java.time, and Guava to plain Java APIs.
