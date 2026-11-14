---
title: Checkly rewrites its Node.js results daemon in Go with Claude Code
date: 2026-09-01
company: Checkly
summary: A black-box harness with golden files from the legacy daemon judged an overnight agent rewrite in Go; its simplified queue model broke retries.
source_url: https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: language
from: Node.js background worker in plain JavaScript (Results Daemon)
to: Go service
from_languages: [JavaScript]
size: about 13,000 lines of Go; roughly 92 million messages daily
duration: overnight agent run; about 1 week of customer rollout
people: unstated
cost: the accepted agent run fit in one day's token allowance of a $200 plan; the discarded run and people's time are not costed
ai_share: most
tools: [Claude Code, Playwright, Docker Compose, Toxiproxy, ClickHouse, Tilt, sqlc]
models: [Fable, Opus]
period: unstated
outcome: completed
status: current
superseded_by:
---

# Checkly rewrites its Node.js results daemon in Go with Claude Code

Checkly, a monitoring company, had Claude Code rewrite its Results Daemon, a Node.js worker
handling roughly 92 million messages daily, in Go. Before the agent started, the team built a
black-box test harness whose expected outputs were golden files generated against the legacy
daemon; passing it was the agent's main acceptance test. One overnight run produced about 13,000
lines of Go. Anti-patterns were then removed and observability added under human supervision. On
internal accounts, problems came at once, mostly failed retries: the harness modelled 3 retry
queues where production routes to 18 queues per region, and the agent had built to the harness.
After the fix, customers moved in cohorts behind a feature flag over a week
([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/)).

## Source

A post on Checkly's blog by Edvinas Janusevicius, a backend engineer there, dated 2026-09-01 in
the page's metadata (modified 2026-09-29). Checkly sells synthetic monitoring built on Playwright,
closes the post by promoting it, and advertises agent features beside it, but it sells none of the
AI tools the case used, so the author counts as a tool user. The post states its results without
the data behind them. An embedded video in which the author walks Stefan through the rewrite was
not archived; this case rests on the text only
([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/)).

## What was migrated

Results Daemon, a background worker in plain JavaScript on Node.js. It takes check results from
Checkly's runner, stores them in databases, decides each check's outcome, sends alerts, queues
reruns and pushes live updates to the command-line tool and web app. It handles roughly 92 million
messages daily, about 40 million of them check results. Check volume had doubled in a year; the
daemon had turned into a bottleneck that woke the on-call engineer more often, and weak typing
made changes risky
([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-problem)).

## Who did what

- **AI:** Claude Code with Fable wrote the Go service overnight from a one-sentence instruction,
  with the legacy code as reference, looping on the harness until it passed. An earlier attempt
  with Opus on the same instruction fell short and was discarded
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)). An
  agent also proposed test cases while inputs were generated, and again from coverage reports
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases)).
  Basis for `ai_share: most`: the agent wrote the whole deployable service, about 13,000 lines;
  later changes were made under human supervision, without saying who typed them
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)).
- **Rule-based tools:** the harness: Playwright for the black-box tests, Docker Compose for real
  databases, a home-built SQS emulator, Toxiproxy for infrastructure failures, and oracle classes
  comparing output byte for byte with golden files
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness));
  ClickHouse to reduce a day's production configurations to unique scenarios
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases));
  Tilt for the local platform, from an earlier monorepo move the approach depended on
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite));
  sqlc for database queries
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#better-database-performance)).
- **People:** designed and built the harness before the rewrite, with some agent-proposed cases
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness));
  reviewed the agent's code and supervised the removal of runtime-derived configuration and the
  added observability
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite));
  fixed the harness's queue model and supervised reworking the retry code
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong));
  ran the staged rollout
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers)).

## How it was checked

- The harness sees the daemon only from outside, with no tie to its language. Each test gives an
  input and expects output matching a golden file generated against the legacy daemon byte for
  byte; values made during the test, such as IDs and timestamps, are replaced by typed
  placeholders. Databases and caches run as real containers the harness owns; SQS queues run on a
  home-built emulator
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness)).
- Inputs came from production: every account, group and check configuration and every result
  outcome from 24 hours, collapsed into unique scenarios with their counts. Coverage reports,
  aimed at 90% to 100%, measured the harness; the team expected gaps to remain and called it
  ready once the relevant files and scoped features were covered. A separate suite tested
  infrastructure failures such as PostgreSQL going down
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases)).
- Passing the harness was the main acceptance test; people then reviewed the code and ran the
  service in every environment but production on an internal account. The post does not say
  whether the agent could edit the harness or its golden files while it worked
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)).
- During rollout, CI ran the harness on the old and the new daemon alike and stopped any change
  that broke either. Each customer bug was first reproduced in the harness, then fixed
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| roughly 92 million messages daily | messages the daemon handles | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-problem) |
| about 40 million messages | of those, check results; the rest are WebSocket publishes | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-problem) |
| 24 hours | window of production configurations and outcomes used to build test inputs | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases) |
| 90% to 100% | code coverage the harness aimed for | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases) |
| about 13,000 lines | application code the agent produced overnight | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite) |
| $200 plan | subscription whose daily token allowance covered the accepted agent run | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite) |
| 3 queues | retry queues in the harness's local topology, by check type alone | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong) |
| 18 queues per region | possible retry queues in production, by check type plus factors such as priority and hosting type | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong) |
| a day | time from the retry fix to processing internal accounts | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong) |
| around 3% | share of platform load from internal accounts | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong) |
| 24 to 48 hours | monitoring after each cohort's flag flip | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers) |
| about an hour | time to close a customer bug, CI and deploy included | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers) |
| a week | customer rollout until the legacy workload was retired | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers) |
| 70% | fewer running pods | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/) |
| 60% | fewer average active sessions on the database | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#better-database-performance) |
| roughly 15% | lower database CPU | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#better-database-performance) |
| around 15 vCPU and 45 GB | compute and memory freed | reported | [post](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#improved-efficiency-and-operability) |

## What worked

- Building the harness first meant correctness was defined by tests, not by whoever reviewed the
  agent's code; the authors credit the harness, built before any agent code, for the result
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness)).
- Test inputs drawn from a day of real configurations and outcomes, reduced to unique scenarios,
  tied coverage to what production really does
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases)).
- One harness run in CI on both daemons kept them in step while both carried real traffic, and
  reproducing each bug in the harness first let the team close issues in about an hour
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers)).
- The rollout went from internal accounts to free, paid and then enterprise customers behind a
  feature flag; apart from those who hit the edge-case bugs, the post says no customer noticed
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers)).
- The authors find Go's types a better match for agents than JavaScript's, and a further check
  on regressions
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#improved-developer-experience)).

## What went wrong

- Problems came almost as soon as internal accounts moved, mostly failed retries; the post names
  no others. Locally the harness had 3 retry queues chosen by check type, while production also
  routes on factors such as priority and hosting type, to 18 queues per region. The agent wrote
  retry handling for the harness's world, and the gap shipped. The authors trace it to a
  design-time boundary model that was too coarse; they aligned the harness with production,
  removed local-only code paths and supervised reworking the retry code
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong)).
- The first agent attempt, with Opus, fell short of the team's standard and was dropped
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)).
- The new code mirrored the legacy design. Review found anti-patterns the agent had inherited or
  introduced, such as configuration assembled at runtime from scattered environment values; the
  harness had the same pattern, and both were simplified
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)).
- The harness was known to be incomplete when the run started, and coverage alone misses edge
  cases, as the post itself warns
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases)).
  Customers found bugs during the rollout; the post calls them minor, nearly all edge cases
  missing from the harness
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers)).
- The title and the opening claim zero incidents, though the retry failure hit internal accounts
  on production traffic; the post does not define an incident. It also says the harness
  guarantees consistent behaviour before rollout, which the retry gap and the edge-case bugs
  contradict, and claims faster shipping and fewer alerts without figures
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#improved-developer-experience)).
- **Not reported:** the number of bugs found in rollout; how many people worked on it and for how
  long, harness building included; whether the agent could change the harness or golden files;
  who wrote the supervised changes; the review effort; how many harness cases there are and the
  coverage reached; the period of the work; what the discarded Opus attempt got wrong; how the
  database and pod gains split between Go, sqlc and the new observability work
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#results)).

## Practices to copy

- [stated] Have the black-box harness, with expected outputs produced by the legacy system, ready before the agent starts. ([Test harness](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness))
- [stated] Run real database instances inside the harness where you can, and mask generated values with typed placeholders. ([Test harness](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#designing-a-test-harness))
- [stated] Draw test inputs from real production configurations and outcomes, collapsed into unique scenarios with their counts. ([Test cases](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#building-test-cases))
- [stated] Map every queue and table the service touches in production into the harness, and list and check each infrastructure assumption. ([First deployment](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#first-deployment-what-we-got-wrong))
- [stated] While old and new both serve traffic, make CI run the same harness on each and stop changes that break either. ([Rollout](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers))
- [stated] Before fixing a reported bug, reproduce it in the harness. ([Rollout](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers))
- [stated] Roll out by customer cohort behind a flag, from internal accounts to the largest customers, watching each before the next. ([Rollout](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#rolling-out-to-customers))
- [ours] Decide whether the agent may edit the harness and its golden files, and enforce it; the source does not say. ([Agentic rewrite](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite))

## Context

- Model era: the post names Fable for the accepted run and Opus for the discarded one, without
  versions or dates; it was published 2026-09-01
  ([source](https://www.checklyhq.com/blog/agentic-rewrite-nodejs-to-go/#the-agentic-rewrite)).
- Related: another language port judged by a black-box suite run against old and new,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); a port checked
  by replaying seeded inputs through both versions,
  [Pokémon Showdown to Rust](2026-01-25-vjeux-pokemon-showdown-rust.md).
