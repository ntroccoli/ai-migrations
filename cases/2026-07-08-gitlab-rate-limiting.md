---
title: GitLab uses AI agents to move its application rate limiter onto a shared Ruby gem
date: 2026-07-08
company: GitLab
summary: Agents moved 121 rate-limit keys onto one gem; 17 keys slipped past the plan, and a divergence that shadow mode had flagged still reached users.
source_url: https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/
also: []
source_type: engineering-post
author_relation: seller-of-tool
evidence: assertion-only
kind: architecture
from: Gitlab::ApplicationRateLimiter in the GitLab monolith (a Rack-level limiter moves next)
to: a single implementation in the labkit-ruby gem
from_languages: [Ruby]
size: 121 rate-limit keys at application level; 14 specs and over 30 merge requests
duration: a few weeks (rollouts from early May to mid-June 2026)
people: 3 team members, plus a couple of engineers who joined in part
cost: unstated
ai_share: unstated
tools: [GitLab Duo Agent Platform, GitLab Duo Code Review, MCP, feature flags, shadow-mode comparison]
models: [Claude]
period: 2026-05..2026-06
outcome: completed
status: current
superseded_by:
---

# GitLab uses AI agents to move its application rate limiter onto a shared Ruby gem

A small GitLab team used agents to move the application-level rate limiter of its monolith,
121 keys, onto one implementation in the `labkit-ruby` gem. Agents wrote the specs, made scoped
code changes and reviewed each other's work in a fixed loop; people decided scope and design,
ran the rollouts and gave the last review. The keys moved in six cohorts behind feature flags, with shadow
mode beside the old limiter, and all were at full traffic by mid-June 2026. Two misses
got through: 17 of the 121 keys slipped past the planned cohorts (the post traces them to
limits Claude missed, and nobody kept a count), found only by a person's audit, and a divergence that shadow comparison had flagged was ramped to full traffic
and broke requests for some users until the flag was turned off. The author says review capacity,
not code writing, became the slow part
([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/)).

## Source

A post on GitLab's blog by Sam Wiskow, who set the project's scope and wrote part of the first gem
code. GitLab sells the AI features the team used, GitLab Duo Agent Platform and Duo Code Review;
the post recommends them and ends with a link to a free trial, so the author is a seller of the
tool. It states results without data: no dashboards, logs or counts beyond those in the text. Its
two figures are diagrams (the agent loop and the shifted bottleneck). It names Claude, with no version, as
the agent that missed keys. The full text is not stored here (the site's terms forbid automated
retrieval); our notes were taken from it once, before its terms were read, and this case was checked
against those notes ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/)).

## What was migrated

GitLab had two rate limiters in production for years: `Gitlab::ApplicationRateLimiter` inside the
monolith, which holds 121 keys, and another one at the Rack layer. The goal is one implementation in
`labkit-ruby`, observable and operated alike in every place. All monolith traffic passes
through it, so its failures had to show and be reversible. The post covers the application-level
part; the Rack layer, at about 4 billion requests daily, is next and in progress
([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup), [now](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now)). The gem itself was largely
built in the same project (14 specs and more than 30 merge requests into `labkit-ruby`), so the case
is part new build and part migration ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup)).

## Who did what

- **AI:** a handful of agents, through GitLab Duo Agent Platform among other tools, read epics and
  issues, wrote specs, ran adversarial reviews of specs and merge requests, made small scoped code
  changes, added tests and gave merge requests a first review; Duo Code Review reviewed merge requests.
  Basis for `ai_share: unstated`: the post gives no share of the code, and people also wrote code
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup)). The post names Claude as the agent that missed keys
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed)), and says mechanical edits across many call sites suit
  agents, without saying who made the second cohort's edits
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked)).
- **Rule-based tools:** no code rewriting tools are reported. Feature flags gated each cohort,
  shadow mode compared the new limiter's decisions with the old one, and the test suite ran in
  CI ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked)).
- **People:** 3 team members: Max Woolf (Staff Backend Engineer) led the monolith changes and ran
  most of the rollouts; the gem and its design were led by Bob Van Landuyt, of the Scalability
  group; the author held scope. A couple of other engineers added code and reviews. People decided scope and
  design, ran the rollouts, gave the last review, and settled any spec blocker the agents could not
  resolve in 2 review rounds
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup)).

## How it was checked

The loop, applied more or less strictly by each engineer (Bob often iterated on specs
alone before sharing them): the spec was challenged by an adversarial agent before any
code; the implementing agent posted test and CI evidence; a second adversarial pass checked the
merge request, counting critical or high Duo findings as blockers; then a staff engineer reviewed
it ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup)).
Cohorts were compared with the old limiter (the second cohort spent several days in shadow mode
before enforcement) and rolled out in steps (1%, 10%, 50%, then 100% for the first cohort). Seeing the two limiters agree under light traffic,
Bob planned to push traffic over the limit to test them
([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked)).
A person's audit against master found the keys no cohort covered; a final audit found the old path
near zero, and a guardrail now stops new rate limits from bypassing the framework
([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 121 keys | rate-limit keys in `Gitlab::ApplicationRateLimiter`, all moved by mid-June | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup) |
| 3 team members | people in the pod, plus a couple who joined in part | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup) |
| 14 specs | numbered specs shipped | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup) |
| over 30 merge requests | merge requests into `labkit-ruby` | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup) |
| 2 review rounds | cap on adversarial review rounds before a person decides | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup) |
| 5 keys | heavily used keys in the first cohort | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked) |
| 1%, 10%, 50%, 100% | rollout steps of the first cohort over two days | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked) |
| 95 call sites | second cohort, 83 call sites in the monolith, 12 call sites in Enterprise Edition, under one flag pair | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked) |
| about 95 flag changes and ~190 YAML file edits | work avoided by one flag pair for the second cohort | self-estimate | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked) |
| 17 of 121 keys | keys left out of the planned cohorts, found by an audit | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed) |
| 6 cohorts, 5 cohorts planned | rollout cohorts needed versus planned | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed) |
| two days | time from the enforcement failure to its first fix | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed) |
| 4 shards | size of the Redis cluster behind rate limiting | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed) |
| 75,000 connections | where `maxclients` was stopped, short of the 100,000 connections planned | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed) |
| about 4 billion requests per day | traffic at the Rack layer, the next part to move | reported | [post](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now) |

## What worked

- Putting the 95 call sites of the second cohort under one flag pair spared about 95 flag changes
  and ~190 YAML file edits; the author says agents do such repetitive edits across a codebase well and
  people badly
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked)).
- The first cohort, 5 keys among the busiest, went from 1% to 100% over May 4 and 5, 2026, with the
  new and old limiters agreeing; Bob treated that agreement as unproven under light traffic and
  set out to exceed the limits on purpose
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked)).
- By mid-June all 6 cohorts ran at 100%, every one of the 121 keys used the new framework, and a
  guardrail now blocks a new rate limit from bypassing it
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now)).
- With agents writing specs and code in a tight loop, code writing stopped being the slow step
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-the-agents-actually-changed)).

## What went wrong

- Missed keys: Claude left out a set of Enterprise Edition rate limits (`notification_emails`,
  several EE registry entries, 3 webhook keys, 3 `partner_*` keys with sub-second windows, some
  orphaned adapter rows). The post counts 17 of the 121 keys that no earlier cohort had covered. Nobody had asked the agents, or
  the people, to keep a tally of finished keys checked against the whole inventory. Max's audit against master on
  May 15 found them, and a sixth cohort was added to the five planned
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed)).
- A failure that passed every step: when the second cohort moved from shadow mode to enforcement,
  the new adapter dropped an identifier on a single path for users not signed in, where three string values were
  packed into two slots and the wrong one overwrote it. A small share of users saw a plain
  error for a brief period. The change had gone through each stage of the loop: the spec, adversarial review, implementation,
  Duo Code Review and the gradual rollout
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed)).
- The signal was there but hidden: shadow comparison had marked that key as divergent, but its
  labels could not tell a structural collision from ordinary disagreement, so the flag sat on a
  dashboard while the team ramped to 100%. The enforcement flag was turned off at once; the
  first fix went out two days later, and the structural cleanup (passing the limiter named
  characteristics instead of array scopes) waits for a later pass
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed)).
- Redis capacity: at the start Bob judged the 4-shard cluster behind rate limiting to have some
  spare capacity, though too little for twice its load; in early May a Redis limit met before this project came back
  and needed an infrastructure change. The connection cap, `maxclients`, was raised in stages and stopped at 75,000
  connections, short of 100,000 connections, because more would have saturated the primaries'
  CPU; each shard has one primary and executes commands on one core, so no bigger machine helps
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed)).
- Review became the bottleneck: reviewing, deciding on rollouts and watching operations became
  the slow parts, and they still take people's time
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-the-agents-actually-changed)).
- Working with agents cost time to learn: Max once looped with an agent without progress and felt he
  would have been faster alone, and called the project a steep learning curve
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-the-agents-actually-changed)).
- A flag per key in the first cohort was judged overkill afterwards; the author notes agents
  will produce such needless work if asked, and only a person decided against it
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-the-agents-actually-changed)).
- **Not reported:** which models or versions ran beyond the name Claude; cost and token use; how
  many agent changes or specs were rejected or redone; review hours; how many users the
  enforcement failure reached and for how long; test coverage; the data behind the near-zero
  legacy path; whether the Redis infrastructure change was made; whether the Rack layer has moved
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/)).

## Practices to copy

- [stated] Run each change through a fixed loop: spec, adversarial review of the spec, code, evidence, adversarial review of the merge request, human review. ([The setup](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup))
- [stated] Cap the rounds of agent review and send unresolved blockers to a person. ([The setup](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#the-setup))
- [stated] Do not read agreement in shadow mode as success; push traffic past the limits at a low rollout share first. ([What worked](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked))
- [stated] Group many call sites under one feature flag pair instead of a flag per site. ([What worked](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-worked))
- [ours] Label shadow comparison results so a structural collision shows apart from ordinary disagreement. ([Where the loop missed](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed))
- [ours] Hold the rollout ramp while shadow comparison flags any divergence on a key. ([Where the loop missed](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed))
- [ours] Have agents and people keep a running count of migrated items against the full inventory, and check it before closing. ([Where the loop missed](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed))
- [stated] Have a person audit the main branch for leftovers when the migration looks done. ([Where we are now](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now))
- [stated] Add a guardrail so new code cannot bypass the new framework. ([Where we are now](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now))
- [ours] When shared backing services lack the headroom to carry old and new paths at once, fix capacity before the shadow phase. ([Where the loop missed](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-the-loop-missed))
- [ours] Plan for human review, rollout decisions and watching operations to be the slow parts once agents write the code. ([What the agents changed](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#what-the-agents-actually-changed))

## Context

- Model era: the post names Claude without a version; the rollouts ran from May to mid-June
  2026 ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now)).
- Scope: the application-level limiter, which the post calls done; the Rack layer is the next
  step of the same unification and not counted here
  ([source](https://about.gitlab.com/blog/ai-agents-for-migrating-rate-limiting-system/#where-we-are-now)).
- Kind: a restructuring inside one language (Ruby), moving call sites from an in-app limiter to
  a shared gem, not a port; filed as `architecture`.
- Seller: GitLab sells the agent platform and code review it used, so this case weighs less in
  lesson strength.
- Related: the same shift of the bottleneck from code writing to people,
  [1Password monolith refactor](2026-04-20-1password-monolith-refactor.md).
