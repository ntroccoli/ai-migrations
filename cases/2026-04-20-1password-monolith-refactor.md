---
title: 1Password uses AI agents to refactor its Go monolith and begin a service extraction
date: 2026-04-20
company: 1Password
summary: Agents rewrote over 3,000 panicking transaction calls from a tight spec, but stumbled on a service extraction's ordering and invariants.
source_url: https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: architecture
from: Go monolith (B5), database transactions opened with MustBegin (panics on failure)
to: separately owned services; transaction calls that return errors
size: over 3,000 call sites in a monolith of millions of lines; one service extraction attempted
duration: unstated (the call-site edits ran in hours)
people: unstated
cost: unstated
ai_share: unstated
tools: [AI agents (unnamed), Go SSA analyzer, SQL parsing, DataDog MCP integration, git worktrees]
models: [unstated]
period: unstated
outcome: ongoing
status: current
superseded_by:
---

# 1Password uses AI agents to refactor its Go monolith and begin a service extraction

1Password used AI agents on B5, its Go monolith of millions of lines, as it starts to break the
system into services. Agents helped write part of a static analyzer that, with SQL parsing and
runtime coupling data, ranked which domain to extract first. A bounded cleanup went well:
from a generated list of over 3,000 call sites, templates and a written playbook, parallel
agents replaced a panicking transaction call with error returns in hours. Extracting a service
was harder: agents ordered a data backfill so that rows could be lost silently, treated shared
tables as their own, and guessed an identifier format, which forced a full rollback of one
session. The gain there was close to 20 to 30% ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).

## Source

A post on 1Password's blog by three authors from the company (the post gives no roles). 1Password
does not sell the coding agents it used, and the post does not name them; it does market its own
platform for human and agent workflows, which the post gives as the reason for the refactor and
mentions again before its lessons. It also quotes a Cursor executive on how Cursor customers plan work, without saying
1Password used Cursor. Results are stated, not shown; its two diagrams are images whose content
appears only as alt text ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).

## What was migrated

Two pieces of work on B5, the Go monolith behind 1Password's product
([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)):

- A cleanup: the server opened database transactions with `MustBegin`, which panics when it
  fails. At production scale, timeouts and cancelled requests should end in a clean error
  instead, so over 3,000 call sites in production and test code had to change
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- An architecture change: plans to split B5 along service boundaries, starting with an extraction
  order (Vault first, Billing second, authentication and authorization next, Identity kept as the
  core), then the extraction of one relatively small service. This touched schema changes, the
  code that reads and writes the data, deployment order and data shared with the rest of the
  monolith.

## Who did what

- **AI:** agents (product and model not named) wrote some of the Go SSA analyzer; an
  agentic toolchain analyzed the code base and produced the extraction order; agents ran in
  parallel to make the `MustBegin` edits from the playbook, with orders to stop and escalate
  outside it; in the extraction, agents drafted the changes. The post gives no share of the
  changed code written by AI.
- **Rule-based tools:** the SSA analyzer built a reproducible domain map and a manifest listing each
  `MustBegin` use; SQL parsing found data dependencies; a DataDog MCP integration supplied
  runtime coupling data; git worktrees kept each agent's changes apart.
- **People:** sorted the call sites into a few patterns with a template each, wrote the playbook
  with known failure modes and escalation rules, and spent most of the cleanup's time on tooling
  and specification. In the extraction, coordination and close review stayed with people; the
  post does not say who rolled back the session that went wrong. Engineers keep ownership of boundaries, dependencies and ordering.

## How it was checked

The post says the extraction order largely matched what experienced engineers would choose. For
the `MustBegin` change it calls the agents fast and accurate when the task is completely specified, but
does not say how the edits were tested or reviewed, or whether any failed. For the extraction,
it does not say how the backfill order, shared-table and identifier mistakes were found, or
whether any reached production; one of them led to rolling back a whole agent session
([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| over 3,000 call sites | `MustBegin` uses to change, in production and test code | reported | [post](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith) |
| close to 20 to 30% | productivity gain from agents on the service extraction | self-estimate | [post](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith) |

## What worked

- Agents wrote parts of a deterministic analyzer instead of being asked to interpret the system
  each time; the analyzer's domain map is a stable artifact the team can reason over, and the
  resulting extraction order (Vault first) largely matched what experienced engineers would
  expect
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- The tracing added for the analysis also gave DataDog a better view of whole transactions, a
  gain beyond the project
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- The cleanup of over 3,000 call sites, long left in the backlog, ran in hours once a
  generated manifest, per-pattern templates and a playbook with escalation rules existed; most of
  the effort went into that preparation
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- Several agents worked at once, each in its own git worktree so their changes stayed isolated
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).

## What went wrong

- Wrong order: an agent tried to backfill new UUID columns before changing the code that inserts
  new rows, an order the authors say causes silent data loss
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- Ownership: agents treated tables shared with the monolith as if the new service owned them
  alone, which would have caused conflicts at deployment
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- The same mistakes kept appearing after the agents were told explicitly about order and
  constraints ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- "Speculation": short of context, an agent assumed an identifier's format was ULID without checking and
  carried that through a chain of changes; the whole agent session had to be rolled back
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- On the extraction the gain was smaller, close to 20 to 30%; agents helped, but people still had to
  coordinate the steps and review the work closely
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- The authors name two general risks: model non-determinism is a hazard in production
  migrations, and wrong ordering, schema or shared-state decisions break the system however
  tidy the code the agents write may be
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- The authors warn that running agents in parallel adds inconsistency unless changes are already
  independent and conflicts ruled out by design
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- **Not reported:** which agents and models were used; team size, time and cost; how the
  `MustBegin` edits were tested or reviewed, how many agents escalated or failed; how many sessions
  were rolled back; whether the extracted service shipped, and whether any of the extraction
  mistakes reached production; how the 20 to 30% gain was measured
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).

## Practices to copy

- [stated] Have agents build deterministic tools (analyzers, manifests), then constrain later agent work to those outputs. ([Building the analysis layer](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [stated] Before agents edit, list every call site with a static tool, group the sites into patterns and give each a template. ([Human to agent ratio](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [stated] Write a playbook with known failure modes and clear rules for when an agent stops and escalates instead of guessing. ([Human to agent ratio](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [stated] Spell out invariants, ordering constraints and escalation paths; gaps in the spec get filled with plausible guesses. ([Lesson 3](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [stated] Run agents in parallel only on changes that are independent, each in its own git worktree. ([Lesson 4](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [ours] Keep schema changes, backfills and deploy order as human-owned steps; let agents draft code inside that plan. ([Stronger constraints](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))
- [ours] Make agents verify assumed formats and table ownership against data or code before building on them. ([Stronger constraints](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith))

## In their words

> "The bottleneck for agentic refactoring is not code generation"
> — Nancy Wang, Wayne Duso and K.J. Valencik, 1Password, [2026-04-20](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)

## Context

- Model era: the post names no model or agent product, and gives no dates for the work beyond its
  publication in April 2026
  ([source](https://1password.com/blog/what-we-learned-using-ai-agents-to-refactor-a-monolith)).
- Kind: an architecture change and an API cleanup inside one language, not a port; filed as
  `architecture`.
- Related: a migration where per-file checks gated every agent edit,
  [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md); fleet-wide agent changes with
  verifiers, [Spotify Honk](2025-11-06-spotify-honk.md).
