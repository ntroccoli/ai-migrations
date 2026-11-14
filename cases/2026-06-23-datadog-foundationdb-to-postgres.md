---
title: Datadog moves Stream Router storage off FoundationDB onto PostgreSQL and DuckDB
date: 2026-06-23
company: Datadog
summary: People redesigned a key-value store as a relational schema; Claude and Cursor ported the storage methods one failing test at a time.
source_url: https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: data
from: FoundationDB key-value store (write path) and RocksDB snapshots (read path)
to: relational schema on PostgreSQL (write path) and DuckDB snapshots (read path)
from_languages: [unstated]
size: unstated
duration: about 3 months
people: unstated
cost: unstated
ai_share: most
tools: [Claude, Cursor, end-to-end tests, blue/green deployment, response validator service, PostgreSQL, DuckDB]
models: [Claude]
period: 2025-12..2026-02
outcome: completed
status: current
superseded_by:
---

# Datadog moves Stream Router storage off FoundationDB onto PostgreSQL and DuckDB

Stream Router, a Datadog control-plane service, holds the routing decisions (Kafka cluster,
topic and partitions for each metrics datapoint) that other services read. It kept its routing data as key-value entries in
FoundationDB and rebuilt the relations between them in application code. Large operations hit
the store's transaction size limits. Keeping that access pattern on PostgreSQL was estimated to be far too slow, so
engineers redrew the schema themselves. Claude and Cursor then wrote the new storage methods one
at a time against the existing end-to-end tests, and a live side-by-side comparison ran for weeks
before cutover. The models' SQL was correct but not optimal until people showed them optimized
patterns. The team reports operations estimated at 45 minutes on that dropped design now take
about 1 second
([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/)).

## Source

A post on Datadog's engineering blog by Arnold Wakim, dated 2026-06-23 in
the page's publishing data. The AI tools this case used (Claude and Cursor) are not Datadog's, and the post promotes no Datadog
product. It states its results without the measurements behind them and gives no team size. Its
two figures are diagrams (the old architecture and the new schema) with no numbers.

## What was migrated

The storage layer of Stream Router. The service manages routing decisions for the metrics
pipeline (Datadog's platform, the post says, processes more than 100 trillion events a day); it
sends no messages itself but tells producers and queriers where data goes, and records where
data lived over time ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/)). Its write
path stored routes, sharding strategies and rules as key-value entries in FoundationDB; its read
path served snapshots from RocksDB in memory
([architecture](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#from-config-file-to-control-plane)). Because these entities reference each other, the
code pulled entries by the tens of thousands into pod processes and checked the relations itself
([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#when-the-kv-model-stopped-scaling)).
The new write path is a relational schema on Datadog's self-managed PostgreSQL platform; the read
path restores DuckDB snapshots, chosen over SQLite for its array columns and a dialect close
enough to PostgreSQL's to share queries
([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#designing-a-schema-that-matches-the-data)).
The post does not name the language of the service code.

## Who did what

- **AI:** Claude built a map of the old key-value controller: Markdown notes on why each key
  function existed. Claude or Cursor then wrote a first version of each new storage method from
  the old method, the new schema, those notes and the failing test output, and iterated until
  the tests passed ([map](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-1-building-a-map),
  [loop](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)). It also extracted validation logic and wired up the
  new schema ([limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short)). Basis for `ai_share: most`: the post says the team gave AI most of the
  implementation
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-made-the-migration-safe)).
  It names Claude without a version and does not say which model Cursor ran.
- **Rule-based tools:** the existing end-to-end tests, which judged each method; a blue/green setup
  running both back ends side by side; and a validator service comparing their routing answers
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-3-blue-green-validation-in-production)).
- **People:** chose to redesign rather than swap databases, designed the relational schema and
  picked PostgreSQL and DuckDB before any AI was involved
  ([schema](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#designing-a-schema-that-matches-the-data)); reviewed and adjusted each generated
  method ([loop](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)); wrote the optimized SQL (batching, `UNNEST`, common table expressions) that the models
  then copied ([limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short)). An engineer had built the blue/green setup
  earlier ([safety](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-made-the-migration-safe)).

## How it was checked

Each storage method had end-to-end tests stating the expected storage state after each
operation; each test green on the old back end had to be green in the same way on the new one,
and passing the existing tests was the pass mark for each method
([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)).
People reviewed each generated method before rerunning the tests. In production, the PostgreSQL
version ran beside the FoundationDB one, and a validator compared their answers every 30 seconds
for weeks before cutover
([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-3-blue-green-validation-in-production)), alerting the team on any difference
([safety](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-made-the-migration-safe)). The tests alone checked behaviour only against
fixtures; the post gives that as the reason for the live comparison.

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| more than 100 trillion events a day | events processed by the platform Stream Router serves | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/) |
| 45 minutes | time the heaviest operations would take with key-value access kept on PostgreSQL (never built) | estimate | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#when-the-kv-model-stopped-scaling) |
| every 30 seconds | how often the validator compared the two back ends' answers | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-3-blue-green-validation-in-production) |
| roughly 3 months | from first design to production, December 2025 to February 2026 | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |
| 4 weeks | time to a working proof of concept | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |
| ~1 second | time those operations take after the migration, which the post puts at nearly 3,000x faster than the 45-minute estimate | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |
| 40x | shrinkage of the routing dataset in PostgreSQL; the DuckDB snapshots are smaller still | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |
| hundreds of ms to a few ms | overall latencies before and after | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |
| 90% | drop in database costs after the managed FoundationDB clusters were retired | reported | [post](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration) |

## What worked

- Notes written by Claude on the intent of each old function were, by the team's account, among
  the most valuable steps: with them in the prompt, fewer rounds were needed per method. Comments on why code exists
  helped in the same way ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-1-building-a-map)), and a fresh session could carry
  on after the context window filled ([loop](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)).
- The stub, test and iterate loop turned the port into converging on tests the old code already
  passed; prompts scoped to one method or one failing test gave far better results than broad
  ones ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)).
- A storage interface already in place meant the new back end was a second implementation of it,
  while the other parts of the service stayed as they were
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-made-the-migration-safe)).
- After people showed an optimized query once, the models reused the pattern in later methods
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short)).
- The post reports operations estimated at 45 minutes now take about 1 second, a 40x smaller
  dataset, latencies down from hundreds of ms to a few, lower CPU and memory, 90% lower database
  costs, and a cutover without incident
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration)).

## What went wrong

- The first idea, moving to PostgreSQL while keeping the key-value access pattern, was ruled
  out: the heaviest operations were estimated at 45 minutes because they still made thousands of
  database round trips, one after another. The cause was the data model, not the database, and it took a full
  redesign ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#when-the-kv-model-stopped-scaling)).
- The original store had itself become a bottleneck: as routes grew, key operations ran into
  the size limit FoundationDB puts on a transaction, a trade-off the team says it had not fully foreseen
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#from-config-file-to-control-plane)). API calls on the old system timed out
  ([results](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration)).
- Broad prompts with more context gave worse code: context overload, invented interfaces, and
  code that compiled but behaved wrongly
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)).
- The models' SQL returned correct results but was consistently not optimal, with many more round trips
  than needed; they did not find batching, `UNNEST` or common table expressions on their own,
  and people wrote the optimized queries
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short)).
- Token use was high, especially early, because full test output was fed to the models; the
  suite was verbose and not built for AI work
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short)).
- Sessions had to be restarted often whenever the context window grew full
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate)).
- The headline speed-up (about 1 second, nearly 3,000x) is set against an estimate for a design
  that was never built, not against a measurement of the old system
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration)).
- **Not reported:** team size; the old system's actual time for those operations; how often an
  iteration needed a person's input and how much review time the generated code took; how many methods were ported and how many needed human rewrites;
  token counts or AI cost; any difference the validator found during the weeks of side-by-side
  running; how the 45-minute figure was estimated and how the speed-ups were measured; which
  model Cursor used and which Claude version.

## Practices to copy

- [stated] Redesign the data model by hand before bringing in AI, so the schema matches how the entities relate. ([Schema](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#designing-a-schema-that-matches-the-data))
- [ours] Before porting a store, measure whether the old access pattern on the new database is fast enough; round trips, not the engine, may be the limit. ([KV limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#when-the-kv-model-stopped-scaling))
- [stated] Keep the storage layer behind one interface so the new back end is a second implementation of it. ([Safety](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-made-the-migration-safe))
- [stated] Before porting, have a model write notes on why each old function exists, and give them with every prompt. ([Map](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-1-building-a-map))
- [stated] Port one method at a time: stub it to fail, run the whole test suite, give the model the old code, new schema and failure. ([Loop](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate))
- [stated] Scope each prompt to one method or one failing test; broad prompts gave worse code. ([Loop](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-2-stub-test-iterate))
- [stated] Run old and new back ends side by side on live traffic, comparing their answers, for weeks before cutover. ([Blue/green](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#phase-3-blue-green-validation-in-production))
- [stated] Review generated SQL for round trips; write one optimized query yourself and let the model copy the pattern. ([Limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short))
- [ours] Feed the model trimmed test output rather than full dumps to keep token use down. ([Limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short))
- [stated] Give the model the query planner's analysis so it can find optimizations its SQL missed. ([Limits](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#where-ai-fell-short))

## Context

- Model era: December 2025 to February 2026, with Claude (version not named) and Cursor
  ([source](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/#what-changed-after-the-migration)).
- A data move where the people's design decision, not the code port, carried the result: the
  first design, ruled out on an estimate, kept the old data model on a new engine.
- Related: a port judged by existing end-to-end tests,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); a large
  refactor of one codebase with agents, [1Password monolith](2026-04-20-1password-monolith-refactor.md).
