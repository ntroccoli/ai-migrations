---
title: Spotify runs fleet-wide migrations with its Honk background coding agent
date: 2025-11-06
company: Spotify
summary: Spotify put a coding agent inside its fleet migration tooling; verifiers and an LLM judge gate each PR, and over 1,500 agent PRs were merged.
source_url: https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1
also: [https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2, https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3, https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4]
source_type: engineering-post
author_relation: seller-of-tool
evidence: assertion-only
kind: mixed
from: many (for example Java AutoValue classes, old Scio versions, deprecated datasets)
to: many (for example Java records, the newest Scio, new dataset versions)
from_languages: [Java, Scala, SQL]
size: more than 1,500 merged PRs by part 1; 240 PRs in the dataset case (part 4)
duration: unstated (agent work began in February 2025)
people: unstated (hundreds of developers use the agent)
cost: unstated
ai_share: most
tools: [Honk (internal agent CLI), Claude Code, Claude Agent SDK, Fleet Management (Fleetshift), Backstage, MCP verifier tools, Goose, Aider, MLflow]
models: [Claude via Claude Code (version unstated)]
period: 2025-02..2026-04
outcome: ongoing
status: current
superseded_by:
---

# Spotify runs fleet-wide migrations with its Honk background coding agent

Spotify already pushed scripted code changes to thousands of repositories with its Fleet
Management system, but complex changes needed rare expertise. It replaced the scripts with a
coding agent, called Honk, that takes a prompt and edits each repository, while the existing
tooling still picks targets, opens pull requests and merges. Claude Code became the agent of
choice after open-source agents and a home-built loop fell short. Verifiers behind one tool and an
LLM judge decide whether a pull request opens. More than 1,500 agent pull requests were merged by
the first post, with 60–90% of the time saved, by its own estimate
([source](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)).
A fourth part shows the limits on a data migration with few tests.

## Source

A four-part series on Spotify's engineering blog, 2025-11-06 to 2026-04-22: the first three parts by two
of the platform's engineers, part 4 by an engineer on a data team that used it. Spotify sells
Fleetshift, its migration tooling, as part of its Backstage portal product, and part 4 ends with
a pitch for it; part 2 carries an endorsement from Anthropic, which makes the agent used. The
series gives totals and internal metrics but shows no data, and the tables comparing agents are
images.

## What was migrated

Not one migration but a platform for many: turning Java value classes into records, upgrading
data pipelines to a newer Scio version with breaking changes, moving Backstage plugins to a new
frontend system, and config changes that must keep their schemas
([source](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)).
Part 4 follows one case: moving about 1,800 downstream data pipelines off two deprecated datasets,
in three frameworks (BigQuery Runner and dbt in SQL, Scio in Scala)
([source](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)).

## Who did what

- **AI:** a coding agent (Claude Code, after Goose, Aider and a home-built loop) writes the change
  in each repository from a prompt; an LLM judge compares each diff with its prompt; a chat
  workflow agent turns Slack or GitHub requests into prompts. In part 4 Claude also drafted a
  context file from a human migration guide, which proved too thin.
- **Rule-based tools:** Fleet Management targets the repositories, opens, tracks and merges the
  pull requests; verifiers run formatters, linters, builds and tests and summarise their output
  with regular expressions; a stop hook runs all verifiers before a pull request can open;
  Backstage lineage and code search find the affected repositories. The agent CLI also uploads
  session logs to cloud storage and records traces
  ([source](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)).
- **People:** platform engineers built the agent CLI, verifiers and judge; migration owners write
  and tune the prompts by trial and error and write context files (in part 4, mapping tables);
  repository owners review and merge the pull requests and, without tests, test by hand.

## How it was checked

Inside the agent's loop, verifiers chosen by what the repository contains (a Maven verifier, say,
when there is a pom.xml file) build and test the change; the agent cannot open a pull
request while one fails. An LLM judge then checks the diff against the prompt. Repository owners
review the pull request, and CI runs as usual
([source](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
In the dataset case the SQL repositories rarely had build-time tests, so the agent could not
verify its work and owning teams tested by hand before merging
([source](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| more than 1,500 PRs | agent-generated pull requests merged into production, by part 1 | reported | [part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) |
| around half of PRs | share of Spotify's pull requests automated by scripted Fleet Management since mid-2024 (not by AI) | reported | [part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) |
| over 20,000 lines | size of the scripted Maven dependency updater, as an example of script complexity | reported | [part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) |
| 60–90% | time saved on agent migrations against hand-written changes | self-estimate | [part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) |
| about 50 migrations | migrations run with Claude Code by part 2 | reported | [part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2) |
| 10 turns per session | limit in the home-built agent loop, with 3 session retries | reported | [part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2) |
| about a quarter of sessions | agent sessions the LLM judge vetoes, from internal metrics over thousands of sessions | reported | [part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) |
| half the time | share of vetoed sessions where the agent then corrected course | reported | [part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) |
| ~1,800 pipelines | direct downstream data pipelines of the two deprecated datasets | reported | [part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4) |
| 240 PRs | automated migration pull requests rolled out in the dataset case | reported | [part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4) |
| 10 engineering weeks | effort the data team estimated a manual migration would take, and the saving it claims | self-estimate | [part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4) |

## What worked

- Swapping only the transformation step for an agent kept the rest of the fleet tooling (targets,
  pull requests, review, merge) unchanged, and a thin internal CLI let the team change agents and
  models without users noticing
  ([source](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)).
- The team moved to Claude Code because the home-built loop needed rigid step-by-step prompts and
  failed on multi-step edits; Claude Code took prompts that describe the goal and could keep a
  task list and start subagents. The post names it the best-performing agent so far, but does not
  show how it did on the edits the old loop failed
  ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)).
- Few tools and large, static, version-controlled prompts made the agent more predictable than
  letting it fetch context through many tools
  ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)).
- Verifiers hide build-system detail from the agent and return short errors, and the LLM judge
  catches out-of-scope edits; the agent works inside a tight sandbox and never pushes code itself
  ([source](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
- In the dataset case, explicit field-mapping tables made the agent reliable on most target
  repositories, and fields that needed judgement were left unchanged with a comment pointing to
  the human guide
  ([source](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)).

## What went wrong

- Open-source agents could not reliably produce mergeable pull requests at fleet scale, and the
  home-built loop ran out of turns on multi-file changes, lost the task as its context filled, and
  made users pick files by hand with search patterns
  ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)).
- Users without training wrote prompts that were either too vague for the agent to infer the goal
  or so detailed that they broke on the first surprise; reused prompts sent agents at tasks the
  target repository could not support, and prompts that bundled several changes ran out of context
  or stopped halfway ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)).
- Agents changed things their prompt did not ask for, such as reworking code or switching off
  unreliable tests; about a quarter of sessions get vetoed by the judge, mostly for straying from the
  prompt ([source](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
- The team names its worst failure mode: a pull request whose CI is green but whose behaviour is
  wrong, which reviewers can easily miss when the change spans thousands of components. Pull requests that fail
  CI leave engineers to repair half-done code, and reviewing pointless ones costs time. The posts
  do not say how often either happened ([source](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
- Agents are slow, their output varies from run to run, and running models at this scale costs a
  lot of compute; the first post names these as open problems without numbers
  ([source](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)).
- Prompts were tuned by trial and error, with no structured evaluation of prompts or models and no
  evals for the judge yet; the team also asks how it would know that a merged change actually
  fixed the problem it targeted ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2), [part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
- In the dataset case the Scio pipelines varied too much for one prompt and were dropped; a
  context file adapted from the human guide led to wrong field mappings until rewritten as tables;
  without tests the agent could not check its work
  ([source](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)).
- Verifiers run only on Linux x86, so iOS and ARM64 systems are out of reach for now
  ([source](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)).
- **Not reported:** the share of agent pull requests rejected, abandoned or reverted; defects found
  after merge; compute or API cost in numbers; model versions. In the dataset case, 240 pull
  requests set against about 1,800 affected pipelines, with no account of the rest
  ([source](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)).

## Practices to copy

- [stated] Keep targeting, pull requests and merging in deterministic tooling; let the agent only write the change. ([Part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1))
- [stated] Give the agent one verify tool that hides build-system detail and returns short, relevant errors. ([Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3))
- [stated] Run all verifiers before a pull request can open (for example in a stop hook) and block on failure. ([Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3))
- [stated] Add an LLM judge that compares the diff with the prompt to catch out-of-scope edits. ([Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3))
- [stated] Describe the end state with examples, and say when the agent must not act. ([Part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2))
- [stated] Put one change in each prompt. ([Part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2))
- [stated] Keep the agent's tools few and its sandbox tight; trade flexibility for predictability. ([Part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2))
- [stated] Write field and API mappings as explicit tables in the context, not as prose guides. ([Part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4))
- [stated] Where a change needs human judgement, have the agent leave a comment with a link to the guide instead of editing. ([Part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4))
- [stated] Ask the agent after each session what its prompt was missing. ([Part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2))
- [stated] Before agent migrations at scale, standardise repositories and require tests the agent can run. ([Part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4))
- [ours] Track how many agent pull requests are rejected or reverted and how many defects follow, since the posts give none. ([Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3))

## In their words

> "Writing prompts is hard, and most folks don’t have much experience doing it."
> — Max Charas, Senior Staff Engineer, and Marc Bruggmann, Principal Engineer, Spotify, [2025-11-24](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)

## Context

- Model era: agent work from February 2025 into 2026 on Claude through Claude Code; the posts name
  no model versions ([source](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)).
- Related: a single-repository language port with agent fleets,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); a per-file LLM
  pipeline with retries, [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md).
