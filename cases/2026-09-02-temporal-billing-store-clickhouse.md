---
title: Temporal moves its Cloud billing store to ClickHouse with coding agents doing most of the cleanup
date: 2026-09-02
company: Temporal
summary: Saved agent prompts cover most deleted code and little new code; a shadow comparison caught an overflow, and agent instructions went stale.
source_url: https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered
also: [https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse]
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: data
from: previous data warehouse (not named) behind the usage and billing tables
to: ClickHouse (ClickHouse Cloud)
from_languages: [SQL]
size: a few dozen read-path queries over two tables
duration: unstated
people: unstated
cost: unstated
ai_share: unstated
tools: [coding agents (not named), unattended CI and review-comment loops, shadow comparison harness, regression tests, agent instruction files]
models: [unstated]
period: unstated
outcome: completed
status: current
superseded_by:
---

# Temporal moves its Cloud billing store to ClickHouse with coding agents doing most of the cleanup

Temporal re-implemented on ClickHouse the queries that read Temporal Cloud's metering and billing data
and used coding agents throughout. Looking back, the two authors found their saved prompts covered
most of the deleted code and little of the new; they credit three habits:
cleanup notes written next to temporary code, rules kept beside the code they govern with the
test that enforces them, and treating agent instructions as files that go stale. A shadow
comparison against the old store caught a ported query whose integer sum overflowed into negative
totals for the largest accounts. The authors decline any speed claim, and admit one agent
instruction file still describes the system they removed
([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered)).

## Source

Two posts on Temporal's blog by the same two engineers, Paul Oh and Chandler Ortman. The main
source, on coding agents, dated 2026-09-02, links the earlier one (2026-08-11) for the migration
itself, which says nothing about AI; this case takes the database facts from the earlier post and
every claim about agents from the later one. Temporal sells a durable-execution platform, not an
AI tool, and neither post names the agents or models used. The agent claims are stated without
data; the earlier post shows a monitoring chart of the freshness gap. Both posts were read in the
Markdown versions the site publishes.

## What was migrated

The store behind two tables that decide what Temporal Cloud customers are charged: metering
events and billing events, both fed by streams that deliver at least once, so every read must
remove duplicates. The old warehouse did that with a batch job on a schedule, which competed for
the cluster and, by the team's projection, would stop keeping up within about a year. Only the read path moved: a few dozen queries,
re-implemented in a new SQL dialect with different deduplication rules, used by the customer
usage and billing APIs and by the scheduled aggregation workflow that feeds invoicing. The
pipeline and streams stayed as they were
([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#why-we-moved)).

## Who did what

- **AI:** coding agents, not named, were used heavily throughout. Mapping saved prompts against
  the migration's pull requests, the authors found the prompts covered most of the deleted code
  but hardly any of the new code, though the record only begins more than a week in.
  The final teardown, several dozen files of mostly deployment configuration, took one working
  session, with an agent working from the cleanup notes; unattended loops handled CI failures and
  review comments. `ai_share` is `unstated`: the posts state no overall share, and prompt
  coverage as the authors report it is not measured authorship
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered)).
- **Rule-based tools:** a shadow comparison that sent every query to both stores, served the old
  answer and compared the two in the background; a regression test on the overflow fix; feature
  flags for the per-account cutover
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#cutting-over-in-order-of-reversibility)).
- **People:** designed the comparison and its classes of difference and ordered the cutover
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#cutting-over-in-order-of-reversibility));
  fixed the overflow (whether with agents is not stated); wrote the cleanup notes and instruction
  files and reviewed changes, where a reviewer made the case for moving one rule out of the root
  instruction file
  ([later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced)).

## How it was checked

Code review was judged not enough: a ported query could compile, pass its unit tests on small
fixtures and still be wrong at production scale. For six weeks both stores answered every query,
side by side. Differences were sorted into tolerated (floating-point
sums within a relative tolerance, row counts exact), expected (the new store holding fresher data,
a class added only after it first showed up as failures, then handled by comparing only
settled time windows) and blocking (a logic mismatch or an impossible
value). Shadowing started on a few high-volume internal accounts. Each read path then moved account by
account through three phases: compare and serve old, compare and serve new, read only
the new store
([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#deciding-which-differences-were-bugs)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| over a week | how far into the project the saved prompt history starts | reported | [post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered) |
| 6 weeks | both stores run in parallel with every query shadowed | reported | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse) |
| about 1 year | headroom left on the old warehouse | estimate | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#why-we-moved) |
| 3 to 5 years | headroom on ClickHouse on current growth projections | estimate | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |
| about 70% | drop in steady-state spend | reported | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |
| 30 to 50% | cost reduction the design doc aimed for | reported | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |
| about 1.4 seconds | average time saved per query over a week of identical live traffic | measured | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |
| about half an hour | how much sooner usage data reaches customers | measured | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |
| about 20 minutes | freshness gap on metering data, from the monitoring chart | measured | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#deciding-which-differences-were-bugs) |
| several dozen files | touched by the final teardown, done in one working session | reported | [later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#why-cleanup-is-the-part-that-benefits) |
| about a month | life of the overflow instruction file before it was deleted | reported | [later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-3-treat-agent-instructions-as-artifacts-that-go-stale) |
| about 5 minutes | a column type change on a table of billions of rows after cutover | reported | [earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us) |

## What worked

- Agents paid off most on removal: the exhaustive, dull search for leftover configuration,
  manifests, environment variables, fixtures and mocks, which teams tend to put off for years
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#why-cleanup-is-the-part-that-benefits)).
- All temporary code written for the migration carried a marked comment saying what it was for and
  what to do with it afterwards; weeks later an agent found them all and used them as the
  deletion checklist, removing one package whole as its note said
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-1-write-the-cleanup-instructions-when-you-write-the-temporary-code)).
- The overflow rule went into an instruction file in the package's own directory, after a
  reviewer pointed out that a rule at the repository root costs every session context; the file
  named its regression test, so a reader can check that the rule still holds. When the column type
  later changed, the rule's cast was gone from the code, so its expiry was plain, and a colleague
  removed both file and test
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced)).
- Checking whether a value was possible at all, not only whether the two stores agreed, flagged
  the overflow. Shadowing had started on a few high-volume internal accounts for other reasons; the authors say
  starting with the smallest would have shown full agreement and passed the port, and advise
  aiming the comparison at the largest and most unusual accounts first, the cutover at the other end
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#the-defect-this-caught)).
- Ordering the cutover by how costly a mistake is to undo, against the direction data flows: the
  read-only APIs went first, where a flag reverses a wrong answer, and the aggregation that feeds
  invoices went last, since its mistakes leave the system and cannot be taken back
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#cutting-over-in-order-of-reversibility)).

## What went wrong

- A ported query summed a 64-bit integer column into an integer accumulator, which ClickHouse does
  not widen; for the largest accounts over long windows it wrapped into negative totals. It
  compiled and passed its tests, since fixtures hold small numbers. The comparison caught it within
  days of shadowing starting, before any customer was served from the new store; the fix was a
  cast before summing plus a test over every billing query. Neither post says who or what wrote the
  query ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#the-defect-this-caught)).
  The later post calls it a production defect, though it never reached a customer
  ([later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced)).
- The migration silently broke another agent instruction file, the guide for adding a new type
  of usage record, which still points at files the migration deleted, at a data
  structure that is now a function, and at build and test steps for code that is gone. The authors predict that an agent
  following it would fail, lose a round and then work around it, and only an engineer who noticed the
  confusion would know.
  No tool checks such prose, it was outside the team's documentation upkeep, and it was still
  wrong when the post went out
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-3-treat-agent-instructions-as-artifacts-that-go-stale)).
- The unattended loops on CI failures and review comments mostly produced hygiene fixes that the team's
  own local checks should have caught first
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim)).
- The agents' setup was less than it may seem: nearly all the agent instruction files the habits
  relied on were months older than the migration, and the team built no toolkit, being the first
  heavy user of an existing one
  ([later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim)).
- The prompt record misses the first week and more, so the construction work is the part least
  visible; with no baseline and no second run, the authors make no speed claim and guess the
  cleanup would otherwise have waited another year
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim)).
- The instructions that worked best held carve-outs that rest on years of knowledge of how the
  billing pipeline is wired; no prompt supplies that
  ([source](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim)).
- The fresher data in the new store first showed up as comparison failures, and the team searched
  for duplicated writes and aggregation errors before reclassifying it as expected
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#deciding-which-differences-were-bugs)).
- Building a comparison with useful results took more work than the team expected, and the bulk
  of the engineering went into deciding which disagreements meant a bug
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#why-code-review-wasnt-enough)).
- The latency gain is an average over query types with no percentiles, from a mid-month week that
  missed month-end billing load; and the earlier post gives six weeks of parallel running but
  also says shadowing ran for months before any cutover
  ([earlier post](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-it-bought-us)).
- **Not reported:** which agents and models were used; how many people worked on it and for how
  long; the cost of the migration or of agent use; how much of the new query code agents wrote,
  beyond very little; how agent changes were reviewed; any defects found after cutover
  ([later post](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim)).

## Practices to copy

- [stated] Mark temporary migration code, the day it is written, with what it is for and what to do with it after the move; agents can use the notes as the removal list. ([Practice 1](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-1-write-the-cleanup-instructions-when-you-write-the-temporary-code))
- [stated] Give agents the cleanup: the exhaustive search for leftover configuration, manifests, environment variables, fixtures and mocks. ([Cleanup](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#why-cleanup-is-the-part-that-benefits))
- [stated] Keep an agent rule in an instruction file in the directory it governs, not at the root, so only work in that area pays for it in context. ([Practice 2](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced))
- [stated] Make each written rule name the test enforcing it, so a reader can tell whether the rule still holds. ([Practice 2](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced))
- [stated] Put agent instruction files in the same upkeep process as the documentation; a migration can break guidance elsewhere and nothing will flag it. ([Practice 3](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-3-treat-agent-instructions-as-artifacts-that-go-stale))
- [stated] Write down which differences between old and new are tolerated or expected before comparing their answers. ([Lessons](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#what-wed-do-again))
- [stated] Check whether each new answer is possible at all, not only whether old and new agree, and compare on the largest accounts first. ([Defect](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#the-defect-this-caught))
- [stated] Cut over in order of the cost of undoing a mistake, keeping a flag to fall back to the old store. ([Cutover](https://temporal.io/blog/migrating-temporal-clouds-billing-store-to-clickhouse#cutting-over-in-order-of-reversibility))
- [ours] Save agent prompts and sessions from the first day, so the share of work agents did can be measured later. ([Limits](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim))
- [ours] Run the local checks before pushing, so unattended agent loops on CI failures are not spent on hygiene. ([Limits](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#what-we-cannot-claim))

## In their words

> "A written rule that points at nothing is an assertion"
> — Paul Oh and Chandler Ortman, Temporal, [2026-09-02](https://temporal.io/blog/using-coding-agents-on-a-migration-three-practices-that-mattered#practice-2-put-durable-rules-next-to-the-code-and-say-how-they-are-enforced)

## Context

- Model era: the posts name no model and give no dates for the work; the account of the migration
  appeared in 2026-08 and the account of the agents a few weeks later.
- Dated by the later post: the earlier one (2026-08-11) never mentions AI, so the two are not a
  series; the post about the agents is the source, and the earlier one gives the migration's detail.
- A data-store move rather than a language port: the code that changed was queries in a new SQL
  dialect, plus the teardown of the old store's scaffolding and configuration.
- Related: stale docs and agent guidance that still favour the old library slowed
  [Asana's Enzyme move](2026-08-07-asana-enzyme-to-rtl.md); a data-type widening where small test
  values hid a truncation, [Google's int64 IDs](2025-04-13-google-int64-ids.md).
