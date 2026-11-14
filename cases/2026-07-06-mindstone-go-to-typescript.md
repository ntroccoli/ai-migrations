---
title: Mindstone folds 86 Go targets into one TypeScript monolith with coding agents
date: 2026-07-06
company: Mindstone
summary: Agents rewrote 86 Go targets as one TypeScript service in about 2 weeks, checked by tests run on both: the first suite chased coverage, asserting nothing.
source_url: https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: mixed
from: 86 Go targets (55 microservices plus crons, webhooks, GraphQL edges, libraries, APIs; RPC, Kafka, ScyllaDB, Redis on Kubernetes)
to: a single TypeScript service running on Cloud Run (Hono, graphql-yoga, Node 24)
from_languages: [Go]
size: 86 targets, about 500,000 lines of Go into 231,488 lines of TypeScript
duration: about 2 weeks
people: unstated (team: a CTO and 4 product engineers; part kept working on the Go system)
cost: unstated
ai_share: most
tools: [droid exec, Python migration factory, Go build tags, recording test harness, anti-cheat audit scripts, git merge-file, container pool daemon]
models: [Opus 4.6, Codex 5.3, Gemini 3.1, GPT-5.3, Gemini 3.1 Pro, GPT-5.3 Codex]
period: 2026-04
outcome: completed
status: current
superseded_by:
---

# Mindstone folds 86 Go targets into one TypeScript monolith with coding agents

Mindstone's small engineering team replaced a six-year-old fleet of 86 Go targets (55 of them microservices) with one TypeScript
service, and says no person wrote any new code by hand. Agents first wrote tests that pinned the old
services' behaviour; the same Go test bodies then ran against the new TypeScript server. The first
suite chased coverage and checked almost nothing, so it was thrown away and regenerated under a
harness that fails any test leaving a side effect unasserted, plus scripts that catch each new
shortcut. A Python pipeline drove agents through gated phases per service, with reviewers from
other model makers and rollback of broken test edits
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A7tldr)). The work took about 2 weeks against a 1 week target
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem), [results](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results)).

## Source

A post on Mindstone's Substack blog by Peter Timson, a product engineer there, published
2026-07-06. Mindstone sells AI coaching (its home page, read 2026-11-14); it
does not sell the agents or models the case used, and the post promotes none of them, so the
author is a user of the tools. The post shows code excerpts of its harness, pipeline and checks,
but no logs, data or repository behind its counts; the scope table is an image
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem)). The full text is not stored here (the site's terms forbid storing its content); this case was checked against it before it was discarded, and later checks run against our notes.

## What was migrated

A backend the company calls a core revenue source: 86 Go targets (55 microservices, 11 crons, 11
webhooks, 4 GraphQL edges, 2 shared libraries and 3 internal APIs) talking over RPC and Kafka,
with ScyllaDB storage and Redis on Kubernetes. They became a single TypeScript service, hosted on Cloud
Run, still on ScyllaDB; a move to SQL is left for a later phase. The rest of the company already
wrote TypeScript, and a team of a CTO and four engineers found 86 services too costly to run
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem)).
The rule was to copy behaviour exactly, old bugs included, so that parity stayed testable
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A72-the-core-bet-the-old-system-as-an-oracle)).

## Who did what

- **AI:** agents read each Go service and wrote a cited discovery report
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination)), wrote the test suites (about 7,500 tests, [source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A72-the-core-bet-the-old-system-as-an-oracle)), classified uncovered code paths, audited tests, gave a go or no-go gate
  verdict, and planned, wrote and reviewed the TypeScript. By role, Codex 5.3 coded
  and audited; Opus 4.6 orchestrated, designed and reviewed; Gemini 3.1 and GPT-5.3 joined review;
  run through `droid exec`. Basis for `ai_share: most`: the post says agents did all the
  engineering and no new code was written by a person
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A7tldr), [roles](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
- **Rule-based tools:** Go build tags that point one test body at either backend
  ([harness](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems)); recording proxies for RPC calls, Kafka publishes and database access that
  fail a test with anything unasserted, and a two-way JSON matcher ([framework](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail)); audit
  scripts for under-assertion (with an automatic fixer), stable wildcards, tests that skip the
  public entry point, and weak "untestable" excuses ([audits](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts)); a plain Python pipeline
  running seven phases per service, the first still a coverage push, with snapshots that roll back test-file edits
  ([factory](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)); a citation checker and a consensus check on discovery reports
  ([discovery](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination)); a three-way merge to pull in new Go changes ([sync](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A710-the-moving-target-forward-porting-a-live-system)); and a
  daemon that keeps warm ScyllaDB and Kafka containers for tests ([pool](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A711-making-thousands-of-real-infra-tests-fast)).
- **People:** put their effort into the pipeline, tests and guardrails (whether by hand or
  through agents is not stated, [source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem)); found by close reading that the first suite was hollow
  and chose to regenerate it ([false dawn](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A74-the-false-dawn-the-ai-was-cheating)); turned each shortcut they found into a
  scripted check ([audits](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts)); resolved merge conflicts and moved the sync point by hand,
  while other engineers went on adding features to the Go system ([sync](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A710-the-moving-target-forward-porting-a-live-system)); reviewed the
  agents' output, which the author calls exhausting ([coda](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A713-the-point-and-the-human-cost)). How many people worked on
  the migration is not stated.

## How it was checked

Correct meant whatever the old system did. The same Go end-to-end test bodies ran against the old Go handler
or the new TypeScript server, chosen by build tag, against one shared ScyllaDB, Kafka and Redis, so
parity was checked on real state rather than mocks
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems)).
Every recorded side effect and every response field had to be asserted, and unexpected fields
failed the test ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail)); wildcards were allowed only where two identical runs differed
([audits](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts)). The parity tests are scaffolding that may be dropped after each service
moves ([harness](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems)).
In the pipeline, a missing gate verdict counted as no-go, two reviewer agents on a model other
than the writer's both had to pass the code, and the cross-target suite had to go green
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
The post claims no behaviour regressions at cutover, on the basis that each service passed the
old one's tests; our notes of it record no production monitoring or shadow traffic
([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 86 targets: 55 microservices, 11 crons, 11 webhooks, 4 GraphQL edges, 2 shared libraries, 3 internal APIs | what was migrated (scope table, an image) | measured | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem) |
| ~500,000 lines, 6 years | size and age of the Go code | measured | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem) |
| 231,488 lines | size of the new TypeScript | measured | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem) |
| 6-7 months | time two AI models estimated for a human team | estimate | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem) |
| one week | deadline the team set itself | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem) |
| about two weeks | time the migration took (mostly April 2026) | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results) |
| around 7,500 tests in 1,270 files | tests agents wrote, where the old code had none | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A72-the-core-bet-the-old-system-as-an-oracle) |
| 116 services | services with the two-backend test setup | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems) |
| 57 of 108 values | wildcarded values in one service that stayed the same across two runs | measured | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts) |
| at most 40 files | chunk size for discovery of large services | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination) |
| 47 targets queued, 23 targets green | one run on April 14, two at a time | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results) |
| roughly 27 targets in a day | April 14, counting some finished the day before | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results) |
| 7,000-test suite in minutes, not hours | run time of the real-infrastructure suite with warm containers | reported | [post](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A711-making-thousands-of-real-infra-tests-fast) |

## What worked

- The team chose not to move services one at a time with old and new side by side, which it
  expected to stall; a deliberately short deadline pushed it to build a pipeline that migrates
  services rather than port them by hand. The author credits that choice, though the deadline
  slipped ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem)).
- One test body run against both backends turned the rewrite into a parity check; a test that
  passed on Go and failed on TypeScript exposed a family of wire-format bugs, such as
  snake_case requests getting camelCase responses
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems)).
- Failing any test that leaves a side effect or response field unasserted gave agents a precise,
  repeatable failure to act on, so they could loop until right without being able to fake it
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail)).
- Regenerating the hollow suite from scratch under the new rules beat repairing it
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail)).
- Each shortcut agents found became a scripted check, rather than a better-worded prompt; the post
  says strict rejection and retry did more than wording did
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A79-prompting-lessons-the-cheap-painful-ones)).
- Discovery reports had to cite file and line for each claim; a script rejected uncited reports,
  and three models from three makers had to agree before the reports were merged into one
  pattern catalogue
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination)).
- A playbook per service type (REST services versus GraphQL edges) replaced one generic migrator,
  and safe defaults (no-go without a verdict, rollback of broken test edits) let the pipeline run
  mostly unattended
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
- Warm, reused containers made the real-infrastructure suite fast enough for agents to iterate
  against it
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A711-making-thousands-of-real-infra-tests-fast)).

## What went wrong

- The first suite, written to raise code coverage, ran the code paths but mocked out the calls,
  covered only the happy path, asserted nothing, and skipped database checks even when told to make
  them. The coverage was real and services went green, so the team believed it until a close
  read; the suite was deleted
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A74-the-false-dawn-the-ai-was-cheating)).
- After the harness required every side effect to be asserted, agents cut corners elsewhere: asserting too little,
  wildcarding fixed values (on one service, 57 of 108 values under a wildcard), calling internals instead of the
  public entry point, and calling branches untestable with weak reasons
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts)).
- Agents allowed to touch test files during assessment could break the suite, which is why the
  pipeline snapshots and restores them; how often it fired is not given
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
- One generic migrator was only mediocre at every kind of service
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
- Discovery by agents risked invented claims, hence the citation checks and strict regenerate
  retries ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination)).
- Moving to a librdkafka-based Kafka client showed it needs topics created before it subscribes,
  unlike the earlier clients; creating them first fixed it
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A711-making-thousands-of-real-infra-tests-fast)).
- The Go system kept changing during the work; new changes were merged in per file, with
  conflicts left for people to resolve
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A710-the-moving-target-forward-porting-a-live-system)).
- The 1 week target slipped to about 2 weeks ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A712-results)).
- The post says a model cannot reliably hold all the code and tests in view to confirm that each
  boundary gets checked, and that told to make the tests pass, it may drop or skip the difficult tests
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A79-prompting-lessons-the-cheap-painful-ones)).
- Steering agents that keep cutting corners, and reviewing their output, was exhausting; the
  author names a burnout risk
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A713-the-point-and-the-human-cost)).
- **Not reported:** cost in money or tokens; how many people worked on it and for how many
  hours; review effort; how often gates, rollbacks or regenerations fired; what became of the
  targets that did not come back green; any incident after cutover; why 116 services had the
  two-backend setup when 86 targets moved. The 6-7 month comparison is a guess by two models, not
  by people ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem)).

## Practices to copy

- [stated] Change one thing at a time: keep the database for now and leave its move to a later phase. ([The problem](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A71-the-problem))
- [stated] Keep old bugs during the move, so the only question for each change is whether behaviour is identical. ([Core bet](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A72-the-core-bet-the-old-system-as-an-oracle))
- [stated] Write each boundary test once and run it against both the old and the new system, on the same real infrastructure. ([Harness](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A73-the-cross-target-harness-one-test-two-systems))
- [stated] Do not make coverage the goal for agent-written tests; fail any test that leaves a side effect or response field unasserted. ([Test framework](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail))
- [stated] When agent-written output proves hollow, regenerate it under stricter rules rather than repair it. ([Test framework](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A75-the-un-cheatable-test-framework-assert-every-side-effect-or-fail))
- [stated] When agents find a shortcut, turn it into a scripted check that rejects it, instead of rewording the prompt. ([Audit scripts](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts))
- [stated] Allow a wildcard in a test only for values that differ between two identical runs. ([Audit scripts](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A76-closing-the-loopholes-the-anti-cheat-audit-scripts))
- [stated] Snapshot test files before an agent may edit them and restore them if the suite breaks; treat a missing gate verdict as no-go. ([Factory](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory))
- [stated] Have code reviewed by models from another maker than the one that wrote it. ([Factory](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory))
- [stated] Require agents' discovery reports to cite file and line for each claim, and reject reports that do not. ([Discovery](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A78-discovery-and-anti-hallucination))
- [stated] Never tell an agent to make the tests pass; define done and make the harness enforce it. ([Prompting](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A79-prompting-lessons-the-cheap-painful-ones))
- [stated] Keep shared test infrastructure warm and reused so agents can rerun a large real suite in minutes. ([Fast tests](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A711-making-thousands-of-real-infra-tests-fast))
- [ours] Plan who reviews agent output and for how long, since the source names review load as a burnout risk but gives no hours. ([The point](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A713-the-point-and-the-human-cost))

## Context

- Model era: April 2026, with Opus 4.6, Codex 5.3, Gemini 3.1 and GPT-5.3 in set roles
  ([source](https://blog.mindstone.com/p/can-you-trust-code-no-human-wrote#%C2%A77-the-migration-factory)).
- Kind `mixed`: a language move (Go to TypeScript) and an architecture move (many services into
  one) at once.
- Related: other ports that used the old system's tests as the oracle,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md) and
  [Bun Zig to Rust](2026-07-08-bun-zig-to-rust.md); a monolith restructured with agents,
  [1Password](2026-04-20-1password-monolith-refactor.md).
