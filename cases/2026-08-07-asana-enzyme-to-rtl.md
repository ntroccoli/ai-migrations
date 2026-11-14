---
title: Asana finishes its Enzyme to React Testing Library move with Codex agents in two weeks
date: 2026-08-07
company: Asana
summary: Up to 4 Codex agents on a 5-sentence prompt removed Enzyme in about 1.5 weeks of engineering time for about $12K; stale docs and slow lint got in the way.
source_url: https://asana.com/inside-asana/migrating-off-enzyme-2-weeks
also: []
source_type: engineering-post
author_relation: seller-of-tool
evidence: assertion-only
kind: test-framework
from: Enzyme (frontend React tests)
to: React Testing Library
from_languages: [unstated]
size: unstated
duration: about 1.5 weeks of engineering time over 2 calendar weeks
people: unstated
cost: ~$11,000 model usage plus ~$1,000 infrastructure
ai_share: unstated
tools: [OpenAI Codex, typechecker, linter, test suite, CI]
models: [unstated]
period: unstated
outcome: completed
status: current
superseded_by:
---

# Asana finishes its Enzyme to React Testing Library move with Codex agents in two weeks

Asana had been moving its frontend tests off Enzyme since 2022 and, at its pace, still faced
about five years of work. Engineers then ran up to four OpenAI Codex agents in parallel, one per
directory, all on the same five-sentence goal prompt, through day and night, reviewing progress
and pull requests twice a day. Enzyme was gone after roughly 1.5 weeks of engineering effort,
spread across two calendar weeks, missing a one-week goal it had called deliberately unreasonable, for roughly $11K of model usage and $1K of
infrastructure. Richer setups did worse; stale internal docs that still favoured Enzyme misled
the agent, and slow lint and CI that disagreed with local runs needed the most human help
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## Source

A post on Asana's Inside Asana blog, under the byline "Engineering Team" with no named author,
dated 2026-08-07. It closes by calling itself part of a continuing Asana and OpenAI
collaboration on what Codex can do for larger engineering work, so `author_relation` is
`seller-of-tool`: the author's company promotes, in the source, the AI tool the case used (Asana
itself does not sell Codex). The post also points to an OpenAI article on harness engineering.
It states its figures without data, logs or a method; it has no charts or tables
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## What was migrated

Asana's frontend test suite, written with Enzyme, a React testing library that had lost
community support, worked poorly with newer React versions and invited tests tied to component
internals. The target, React Testing Library, tests what users see and do. The move began in
2022; several staffed projects, each worth multiple engineer-years, and product teams had
moved parts of it, but the rest was still about five years away at that rate. The post gives
no count of files or tests and does not name the language
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-five-year-problem)).
Along the way an even older test framework, still present in some corners of the code, was cleaned up too
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## Who did what

- **AI:** OpenAI Codex with frontier models (not named) on an extra-high reasoning setting,
  as many as four agents in parallel, each given one directory, the goal prompt and the test command to
  run; the agents converted the files. The post does not say who opened the pull requests
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went)).
  Basis for `ai_share: unstated`: the post describes only agents writing code in the final two
  weeks but gives no share, and earlier staffed projects had already moved part of the suite.
- **Rule-based tools:** the existing checks the agents ran against: typechecking, linting, the
  test command and CI
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#why-a-five-sentence-prompt-was-enough)).
  No codemod is named.
- **People:** set the goal and wrote the prompt, kept the machine awake, looked in twice a day to
  review progress and the pull requests, and stepped in mostly where lint and CI were
  slow or disagreed with local checks. Earlier, years of staffed projects and product teams did
  part of the move
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way)).

## How it was checked

Done meant no Enzyme left in the code. Each agent ran the given test command, and
typechecking, linting, tests and CI could catch mistakes at once, by the post's account; people reviewed the pull requests twice a day
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#why-a-five-sentence-prompt-was-enough)).
The post says test coverage went up and poor tests were fixed, but gives no coverage figures and
does not say how review was done or how deep it went
([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| roughly 5 years | time still needed to finish at the pre-agent pace | self-estimate | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-five-year-problem) |
| 1 week | goal the team set for the whole migration | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-five-year-problem) |
| about 1.5 weeks | engineering time the migration took | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |
| 2 calendar weeks | elapsed time of the migration | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |
| up to 4 agents | Codex agents run at once, one per directory | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went) |
| 5-sentence prompt | length of the whole prompt, in sentences | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went) |
| 10+ minutes | time a lint step sometimes took | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way) |
| roughly $11K | model usage cost | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |
| $1K | infrastructure cost | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |
| $12K | total of model usage and infrastructure | reported | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |
| roughly $6M | fully loaded engineering cost of doing the wider scope (migration, coverage, test fixes, infrastructure cleanup) by hand | self-estimate | [post](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks) |

## What worked

- A short goal prompt was enough: the move, follow the codebase's norms, the directory, the test
  command, easy files first. The agents ran overnight, and people reviewed progress and pull requests
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went)).
- The authors credit the codebase more than the prompt: the earlier choice of the target
  library, good test helpers, clear conventions and real examples the agent could read
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#why-a-five-sentence-prompt-was-enough)).
- The task had a checkable finish line (no Enzyme left) and fast checks (types, lint, tests, CI)
  able to flag errors quickly
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#why-a-five-sentence-prompt-was-enough)).
- The run also improved coverage, fixed weak tests and cleaned up a forgotten older test framework,
  by the authors' account
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## What went wrong

- The team missed its own goal: it aimed at one week and needed roughly 1.5 weeks of
  engineering effort
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-five-year-problem)).
- Fancier setups did worse: tracked tickets, a running notes file for the agent, sub-agents for
  more parallel work and a long prompt on the target's conventions almost all hurt results
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went)).
- Recent internal docs and instructions written for agents still recommended Enzyme and pushed
  the agent the wrong way
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way)).
- Slow and unreliable tooling, with lint that sometimes ran 10+ minutes and CI results that differed
  from local checks, is where people had to step in most
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way)).
- The agents copied awkward patterns from the codebase along with the good ones; the post does
  not say whether those copies were found or fixed
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-harness-is-the-product-now)).
- The post blames most of the friction, not all of it, on the team's own tooling and docs, and does
  not describe the part the model caused
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way)).
- Before the agents, several staffed projects over years had left about 5 years of work
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-five-year-problem)).
- **Not reported:** how many files or tests moved; how many engineers took part, and whether the
  1.5 weeks of engineering time counts people's hours or something else; the models;
  how many pull requests, how they were reviewed and how many were rejected or reverted; defects
  or flaky tests found later; coverage figures. The roughly $6M comparison prices a wider scope
  than the migration, and the post calls it back-of-the-napkin
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks)).

## Practices to copy

- [stated] Give each agent a short goal: the move, follow codebase norms, one directory, the test command, easy files first. ([How it went](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went))
- [stated] Run a few agents in parallel on separate directories and review their progress and pull requests twice a day. ([How it went](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went))
- [stated] Start with the simplest setup; tickets, notes files, sub-agents and long prompts made results worse here. ([How it went](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went))
- [stated] Hand agents a task with a checkable finish line and fast checks (types, lint, tests, CI). ([Why five sentences](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#why-a-five-sentence-prompt-was-enough))
- [stated] Invest in docs, conventions and the checks around the code, since agents follow and copy them. ([Harness](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-harness-is-the-product-now))
- [ours] Before the run, search docs and agent guidance for advice favouring the old library and fix it. ([Got in the way](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way))
- [ours] Make lint and CI fast and consistent with local checks before a long agent run, since that is where people stepped in. ([Got in the way](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#what-got-in-the-way))
- [ours] Clean up or flag awkward patterns in example code before agents copy them, and review for them. ([Harness](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#the-harness-is-the-product-now))

## Context

- Model era: the post, dated 2026-08-07, calls the work recent and names only frontier models in
  Codex on an extra-high reasoning setting
  ([source](https://asana.com/inside-asana/migrating-off-enzyme-2-weeks#how-it-actually-went)).
- Same move at two other companies:
  [Slack Enzyme to RTL](2024-05-22-slack-enzyme-to-rtl.md), with a syntax-tree codemod feeding
  an early model, and [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md), with a
  per-file pipeline of checks and retries. Slack gives no duration; Airbnb gives one in weeks, but
  Asana gives no file count, so the speeds do not compare. Neither Airbnb nor Slack gives a cost, so Asana's is the
  only cost figure for this move.
- Where Airbnb found that more context per file helped, Asana found that richer setups (detailed
  prompt, notes, sub-agents) hurt; the two used different tools and model eras.
