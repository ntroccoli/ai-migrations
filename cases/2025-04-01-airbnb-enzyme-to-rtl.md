---
title: Airbnb moves 3.5K React test files off Enzyme onto React Testing Library
date: 2025-04-01
company: Airbnb
summary: An LLM pipeline with per-file validation steps and retries migrated 97% of about 3,500 React test files; people finished the rest by hand.
source_url: https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: test-framework
from: Enzyme (React component tests)
to: React Testing Library
size: nearly 3,500 test files
duration: 6 weeks
people: unstated
ai_share: most
tools: [custom LLM migration pipeline, Jest, ESLint, TypeScript compiler]
models: [unstated]
period: 2023..2024
outcome: completed
status: current
superseded_by:
---

# Airbnb moves 3.5K React test files off Enzyme onto React Testing Library

Airbnb replaced Enzyme with React Testing Library in nearly 3,500 component test files using an
LLM pipeline. Each file moved through validation steps (refactor, tests, lint, types), and the LLM
was called to fix whatever step failed, with retries that fed back the errors. Rich context, not
prompt wording, carried the harder files. A first bulk run migrated 75% of the files in four
hours; four days of sampling and tuning raised that to 97%; people finished the rest by hand in
about a week. The team had estimated the work at 1.5 years by hand and finished in 6 weeks
([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/)).

## Source

A post on Airbnb's engineering blog by one of its engineers (the page shows no date; the site's
publishing data gives 2025-04-01). Airbnb does not sell the tools it used. The post states its
results without the data behind them. It names no model, team size or cost figure; its only
figures are two diagrams of the pipeline.

## What was migrated

React component tests written with Enzyme, a testing library built for older React versions
that reaches into component internals. Airbnb had written new tests with React Testing Library
since 2020. The two libraries differ too much for a mechanical swap, and deleting the Enzyme tests
would have left gaps in code coverage, so each test had to be rewritten while keeping its intent
and its coverage ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#d5be)).

## Who did what

- **AI:** LLMs (not named; the post says frontier models) rewrote each test file and fixed the
  failures of each validation step, given the errors and the latest version of the file. A
  hackathon team first showed in mid-2023 that LLMs could convert hundreds of files in a few
  days.
- **Rule-based tools:** the pipeline itself: a per-file state machine that ran Jest, ESLint and
  the TypeScript compiler as gates, retried steps up to a set limit, gathered context files for
  each prompt, stamped each file with its migration status, and re-ran files by step or path.
- **People:** built the pipeline in 2024, wrote the migration guidelines and few-shot examples,
  ran the sample-tune-sweep loop on the long tail, and migrated the last files by hand, starting
  from the failed automatic attempts.

## How it was checked

A file counted as migrated only when it passed every step: the refactor, its Jest tests, lint and
type checks. The post says test intent and overall code coverage were kept, but does not say how
intent was checked or whether people reviewed the migrated files before merging
([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#7d0c)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| nearly 3.5K files | React component test files migrated | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/) |
| 1.5 years | engineering time the team had estimated for a manual migration | self-estimate | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/) |
| 6 weeks | time to finish the entire migration | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/) |
| 75% in 4 hours | share of target files migrated by the first bulk run | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032) |
| nearly 900 files | files still failing validation after that run | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5) |
| 97% after 4 days | share of files done after four days of tuning prompts and scripts | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5) |
| just under 100 files | files left for people at that point | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5) |
| 50 to 100 retries | attempts already spent on many long-tail files before the switch to manual work | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5) |
| 10 attempts | attempts by which most simple-to-medium files succeeded | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#0e90) |
| 40,000 to 100,000 tokens | prompt size reached late in the migration | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032) |
| as many as 50 files | related files pulled into one prompt | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032) |
| 5 to 10 files | sample of failing files used to tune a fix for one common issue | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5) |
| another week | manual work to finish the last 3% of files | reported | [post](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#7d0c) |

## What worked

- Breaking the work into per-file steps with a gate after each made progress visible, let failing
  steps be rerun, and allowed hundreds of files to run at once
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#f20f)).
- Plain retries with the validation errors in a fresh prompt beat early prompt engineering for
  simple and medium files; most passed within 10 attempts
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#0e90)).
- For complex files, more context did the work: the component source, the test, sibling tests
  from the same folder, imports, guidelines and examples. The authors say picking which
  related files to include mattered more than perfecting the prompt
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032)).
- The long tail was worked breadth first: a status comment in each file showed where files got
  stuck, a command re-ran files by step and path, and a loop of sampling, tuning and sweeping took
  the done share from 75% to 97% in 4 days
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5)).

## What went wrong

- The first bulk run left nearly 900 files failing, which took four more days of tuning to bring
  down ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5)).
- Automation hit a ceiling: just under 100 files still failed after 50 to 100 retries each, and
  people had to finish them
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5)).
- Early prompt-engineering experiments helped less than brute-force retries
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#0e90)).
- Retries alone did not work for files with complicated test setup or many layers of
  indirection; those needed much larger prompts with related files and examples
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032)).
- **Not reported:** the models used; team size; the API cost (the post only says the total was
  far below the manual estimate); how test intent was verified; whether people reviewed the
  migrated files; any defects or flaky tests found after the migration. The steps it times (4
  hours, 4 days, another week) do not add up to the 6 weeks it gives for the whole migration, and
  it does not say where the rest went ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#7d0c)).

## Practices to copy

- [stated] Split the migration into per-file steps, each closed by a check (refactor, tests, lint, types) before the next starts. ([Steps](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#f20f))
- [stated] On a failed step, retry with the errors and the current file in a fresh prompt, up to a set limit. ([Retry loops](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#0e90))
- [stated] Pick context files well (component source, sibling tests, imports, good examples) before tuning prompt wording. ([Increasing the context](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#c032))
- [stated] Mark each file with its migration status so failures can be grouped and rerun by step. ([Systematic improvement](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5))
- [stated] Work the long tail breadth first: sample a few failing files per issue, fix the prompt, then sweep all files again. ([Systematic improvement](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5))
- [stated] Stop automating at a ceiling and finish by hand, starting from the failed automatic attempt. ([Systematic improvement](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#93c5))
- [ours] Before deleting the old test framework, measure coverage and decide how test intent will be checked, since the source does not say. ([Results and impact](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#7d0c))

## Context

- Model era: pipeline built in 2024 on frontier models the post does not name; the hackathon
  proof came in mid-2023
  ([source](https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/#3b8e)).
- Related: an agent-driven language port that used end-to-end tests as its oracle,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); fleet-wide
  migrations with verifiers and an LLM judge, [Spotify Honk](2025-11-06-spotify-honk.md).
