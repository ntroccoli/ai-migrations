---
title: Bloomberg opens 2,333 migration PRs for Python packaging and C++ builds with a hybrid pipeline
date: 2026-11-03
company: Bloomberg
summary: A rule-driven pipeline with Claude in bounded steps opened 2,333 packaging and build PRs; 729 were merged, and most got no decision from their owners.
source_url: https://arxiv.org/abs/2611.05457
also: []
source_type: paper
author_relation: user-of-tool
evidence: shown-in-source
kind: mixed
from: an in-house shared-environment Python packaging model; CppBuild, an in-house C++ build system
to: PyPackaging, an in-house per-package dependency model; CMake
from_languages: [Python, C++]
size: about 8,600 candidate repos; 2,333 PRs
duration: 6 months of campaigns
people: unstated
cost: unstated
ai_share: unstated
tools: [archetype registry, data collectors, validation rules, prompt template renderer, CMake templates, deterministic CMake generator, JSON schema validation, AST import analysis, production telemetry, per-run containers, initiative tracker]
models: [Claude Opus 4.6, Claude Sonnet 4.5]
period: 2025-10..2026-06
outcome: ongoing
status: current
superseded_by:
---

# Bloomberg opens 2,333 migration PRs for Python packaging and C++ builds with a hybrid pipeline

Bloomberg ran two low-priority infrastructure moves across its repositories: Python packages to a
per-package dependency model, and C++ projects from an in-house build tool to CMake. A
deterministic pipeline sorted each repository into an archetype, gathered its context (production
telemetry included, for Python), rendered a fixed prompt and checked the result; a Claude model
did only the bounded edit, any repair once a check failed, and the PR text. Through 2026-04-30
the campaigns opened 2,333 PRs; by 2026-06-30, 729 PRs were merged. Most PRs got no decision from
their owners. The authors conclude that producing changes was the easy part, and that
what owners must spend to review, test and ship each one set the pace
([source](https://arxiv.org/abs/2611.05457)).

## Source

An industrial experience paper on arXiv (v1, 2026-11-03) by six Bloomberg engineers and two
University College London researchers, licensed CC BY 4.0. Bloomberg does not sell the model it
used. The paper shows its outcome tables, the dates of its observation window and how it labels
each PR, but its data and code are proprietary and not released. It states plainly that its
authors built the system they evaluate, that it ran no controlled experiment, and that its effort
figures are the team's own estimates. arXiv offers no HTML version of this paper; our archive is
the PDF text with its tables checked by hand.

## What was migrated

Two campaigns, the two of five pilot areas that grew into sustained work
([source](https://arxiv.org/abs/2611.05457)):

- **PyPackaging (pseudonym):** Python packages moved off a shared-environment packaging model
  onto an in-house model where every package lists and ships with the dependencies it needs.
  About 1,900 candidate repos, spread over eighteen archetypes, from bare scripts to mixed C++
  and Python repositories; 294 PRs opened ([source](https://arxiv.org/abs/2611.05457)).
- **CppBuild-to-CMake:** C++ projects moved from CppBuild, an in-house build tool (pseudonym), to
  CMake, with source trees restructured and dependencies declared again. About 6,700 candidate
  repos in a few uniform archetypes; 2,039 PRs opened ([source](https://arxiv.org/abs/2611.05457)).

Neither move changes what the code does. The old way was for the owning central team to publish
instructions and ask each team to migrate on its own.

## Who did what

- **AI:** a Claude agent, each migration in its own container (for PyPackaging the paper adds:
  only file and shell tools, offline, confined to the repository). For PyPackaging it wrote the migration itself
  (packaging configuration, layout, build changes); for CMake it only read each makefile and
  filled a JSON object with what the build needs (sources, libraries, flags, custom rules). It
  also repaired its output when a check failed (up to 3 retries) and wrote each PR description.
  Basis for `ai_share: unstated`: the paper gives no share. By the roles it states, the model
  wrote the PyPackaging changes but never the CMake build files (templates do), which make up
  2,039 of the 2,333 PRs ([source](https://arxiv.org/abs/2611.05457)).
  Classification by an LLM was tried in a prior campaign and abandoned.
- **Rule-based tools:** everything else: an archetype registry built from asset, package and
  tracker data; twelve data collectors (telemetry, package metadata, syntax-tree import scans,
  build configuration); fixed prompt templates per archetype; seven validation rules drawn from
  past failures; CMake templates and a schema check; a fully deterministic generator for one
  CMake archetype, with no model involved; a fleet-wide map from module names to package names;
  an orchestrator, PR lifecycle tooling and a dashboard. The PyPackaging tool holds roughly 4,300
  lines of rule-based Python and 230 lines of model interface, besides some 3,600 lines of
  templates and reference documents ([source](https://arxiv.org/abs/2611.05457)).
- **People:** the central team designed the pipeline, wrote templates and documents, and checked
  the generated PRs batch by batch before owners were asked to act; one engineer, part time,
  helped with CMake reviews. Owning teams reviewed, tested, deployed and merged, or rejected or
  left the PRs undecided; some redid the migration themselves.

## How it was checked

Inside the pipeline, before any PR: for CMake, the extracted JSON against a schema, then a full
build, then the project's unit tests; for PyPackaging, the seven rules, a packaging check, a run
of each command-line script with a help flag before and after, and a comparison of the new
package layout with what is deployed today. The authors call the Python loop deep: a wrong
dependency choice passes all of these and fails only once the owner ships and runs the code.
The central team then reviewed PRs in batches, and owners reviewed and deployed them
([source](https://arxiv.org/abs/2611.05457)).

Outcomes: every campaign PR opened by 2026-04-30 was labeled on 2026-06-30 (each at least 2
months old) as merged, rejected (closed by a developer without merging) or no decision (open at
the cut-off, or shut by automation such as bots that close idle PRs). Test PRs in personal or
sandbox repos, and PRs the pipeline closed on its own (usually to generate them again), are not
counted. The 729 "successful migrations" of the abstract are the merged PRs
([source](https://arxiv.org/abs/2611.05457)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| about 1,900 repos | PyPackaging candidate repositories | reported | [paper](https://arxiv.org/abs/2611.05457) |
| about 6,700 repos | CppBuild-to-CMake candidate repositories | reported | [paper](https://arxiv.org/abs/2611.05457) |
| 2,333 PRs | campaign PRs opened through 2026-04-30: 294 PRs PyPackaging, 2,039 PRs CMake | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 729 PRs | merged PRs by 2026-06-30, both campaigns (the paper's 729 migrations) | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 31 PRs (10.5%) | PyPackaging PRs merged | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 64 PRs (21.8%) | PyPackaging PRs rejected | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 199 PRs (67.7%) | PyPackaging PRs with no decision | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 698 PRs (34.2%) | CMake PRs merged | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 165 PRs (8.1%) | CMake PRs rejected | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 1,176 PRs (57.7%) | CMake PRs with no decision | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 80.2% of 96 tasks | PR produced, simplest Python archetype (no packaging metadata yet); the authors say early easy picks may inflate it | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 56.5% of 186 tasks | PR produced, Python scripts packaged from scratch | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 54.5% of 55 tasks | PR produced, broken existing Python packaging | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 44.4% of 2,889 tasks | PR produced, CMake archetype with team-defined build configuration | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 63.0% of 1,355 tasks | PR produced, CMake code-generation archetype | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 1,877 tasks | CMake tasks with company-defined configuration, left to a deterministic tool | reported | [paper](https://arxiv.org/abs/2611.05457) |
| 34 of 51 repos | Python repositories that rejected the PR, then migrated on their own (follow-up method not given) | reported | [paper](https://arxiv.org/abs/2611.05457) |
| 14 PRs | of those owner PRs, ones that reused most of the generated changes | reported | [paper](https://arxiv.org/abs/2611.05457) |
| 13 turns, 48 s | mean agent run, CMake (Sonnet 4.5) | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 63 turns, 7.2 minutes | mean agent run, PyPackaging (primary model Opus 4.6) | measured | [paper](https://arxiv.org/abs/2611.05457) |
| 4.1 to 7.7 minutes | mean PyPackaging run, earlier Sonnet 4.5 PRs to later Opus 4.6 PRs; the archetype mix changed too | measured | [paper](https://arxiv.org/abs/2611.05457) |
| about 2 person-days | manual migration effort per CMake task | self-estimate | [paper](https://arxiv.org/abs/2611.05457) |
| 1 to 2 person-days | manual migration effort per PyPackaging task | self-estimate | [paper](https://arxiv.org/abs/2611.05457) |
| over 1,000 person-days | manual work the merged changes stand for | self-estimate | [paper](https://arxiv.org/abs/2611.05457) |

## What worked

- Keeping the frame deterministic: classification, context gathering, prompt rendering and every
  check stay out of the model, which gets one bounded edit per repository. The authors relaxed
  pre-processing as models improved but never moved a check into the model, since one error it
  let through could spread to hundreds of repositories ([source](https://arxiv.org/abs/2611.05457)).
- Letting the model extract data instead of writing code where the input is regular: a bad CMake
  file then traces to either the extraction or a template, and a template fix repairs it in all
  repositories at once; one archetype needed no model at all
  ([source](https://arxiv.org/abs/2611.05457)).
- A shallow check loop: CMake PRs arrived built and tested; owners merged them over three times
  as often as the Python ones (34.2% against 10.5% of PRs) and rejected them less than half as
  often ([source](https://arxiv.org/abs/2611.05457)). The authors name other causes they cannot
  separate: a uniform population, an earlier start, lower perceived risk and one engineer helping
  with reviews. For a move of build files they call a clean compile a strong sign the change is right,
  and still ran the unit tests after the build. The CMake merge count was still rising at a
  steady rate at the cut-off, so we read its rate as a floor.
- Sorting targets into archetypes, each with its own template, collectors and rules, made
  success rates readable per group and let the team order work by expected return
  ([source](https://arxiv.org/abs/2611.05457)).
- Production telemetry for Python: crossing syntax-tree imports with modules seen at runtime
  stopped treating test-only and conditional imports as hard requirements (they reach the model
  without a version pin), surfaced plugins, showed the interpreter actually in
  use and fixed versions that broke on some clusters. This is the team's judgment from its
  pilots, not measured
  ([source](https://arxiv.org/abs/2611.05457)).
- For Python, holding back a PR when the collected data showed an unsafe case (dependencies that cannot be
  resolved, more than one package in a repository); most failures to produce a PR were of this
  kind ([source](https://arxiv.org/abs/2611.05457)).
- Rejected PRs still helped: in 34 of 51 Python repos that rejected one, owners migrated on
  their own, and 14 of the PRs they opened reused most of the generated change
  ([source](https://arxiv.org/abs/2611.05457)).

## What went wrong

- Owners, not generation, were the limit: 67.7% of Python PRs got no decision when the window
  closed, as did 57.7% of CMake ones, and the authors expect better generation would not have
  moved these figures much. They also name how far owners trusted a change to work. PRs went out in a few short bursts, while merges came at a steady
  pace of their own. The authors put part of this on low priority: no deadline, no security
  driver, and owners carry the deploy risk for a diffuse gain. They plan to let teams ask for
  deep-loop migrations when ready to deploy them ([source](https://arxiv.org/abs/2611.05457)).
- The Python checks could not catch runtime faults: a package could build and pass the smoke
  checks with a wrong dependency, found only when owners deployed it; one developer reported a
  generated change that broke unit tests the pipeline never ran. Python PRs were rejected at
  21.8%; when such a fault surfaces, the migration has to be redone from the start
  ([source](https://arxiv.org/abs/2611.05457)).
- Owners had no way to add commits to the PR the bot opened, a frequent reason they closed it and
  opened their own; one tried an AI coding tool on the PR and it opened a new one instead
  ([source](https://arxiv.org/abs/2611.05457)).
- A good part of the work produced no PR: 44.4% to 80.2% of tasks got one, by archetype
  ([source](https://arxiv.org/abs/2611.05457)). For Python, most misses were deliberate refusals;
  the paper gives no reasons for CMake tasks left without a PR.
- LLM-based classification was dropped: one package could fall into a different archetype from
  run to run, failures were harder to trace, and a call per candidate was wasteful
  ([source](https://arxiv.org/abs/2611.05457)).
- Pre-processing built to cover earlier models' weak import analysis, weeks of work, mattered
  less once the next model handled the cases itself. The authors name the opposite risk too:
  handing too much to the model makes the pipeline fragile when its behaviour shifts between
  versions ([source](https://arxiv.org/abs/2611.05457)).
- Only three Python archetypes got a dedicated template; all the others got a generic prompt
  whose PR is labelled for owners as a starting point. Archetypes of at most 20 repos were never
  worth a template ([source](https://arxiv.org/abs/2611.05457)).
- The evidence is limited by the authors' own account: no controlled experiment (pipeline,
  prompts, rules and model changed at once), no ablation for the runtime-data claim, possible
  bias toward easy archetypes early, effort figures from expert judgment, and authors who
  evaluate their own system. No metric separates a change's quality from the owners' engagement;
  developer feedback was informal, with no user study; rates come without confidence intervals or
  tests; the figures are tied to these models and this period, and to one organization
  ([source](https://arxiv.org/abs/2611.05457)).
- **Not reported:** how many merged PRs were later reverted or broke in production; review time
  per PR; team size; the pipeline's build cost (inference is called negligible, with no figure);
  how many Python tasks the generic prompt handled and how their PRs fared (by our subtraction,
  if Tables III and IV count PRs alike, 82 PyPackaging PRs fall outside the three templated archetypes); how many PRs the central
  review stopped; how many test and bot-closed PRs were left out; retry and validation-failure
  rates. Some counts do not
  reconcile and the paper does not explain them: Table II's rows add up to 2,137 CMake PRs against 2,039 PRs
  in Table IV, and its tasks total 6,121 tasks against about 6,700 candidate repos
  ([source](https://arxiv.org/abs/2611.05457)).

## Practices to copy

- [stated] Keep classifying targets, building their context and validating results out of the model; give it one bounded edit per target. ([RQ1](https://arxiv.org/abs/2611.05457))
- [stated] Never move a check into the model; widen its role in producing changes only. ([Lesson 4](https://arxiv.org/abs/2611.05457))
- [stated] Where the old format is regular, have the model extract structured data and let templates write the new files. ([Section III-C](https://arxiv.org/abs/2611.05457))
- [stated] Sort targets into archetypes, each with its own prompt template, data collectors and checks. ([Lesson 2](https://arxiv.org/abs/2611.05457))
- [stated] Before building the pipeline, judge how late a wrong change would first be caught by a check. ([Lesson 5](https://arxiv.org/abs/2611.05457))
- [stated] Feed production data (startup logs, module usage, deployed versions) into packaging migrations. ([Lesson 3](https://arxiv.org/abs/2611.05457))
- [stated] Hold back a change when the collected data shows a case the pipeline cannot migrate safely. ([RQ1](https://arxiv.org/abs/2611.05457))
- [stated] Each model upgrade, revisit workaround pre-processing; keep a step only if it adds reproducibility or eases debugging. ([Lesson 4](https://arxiv.org/abs/2611.05457))
- [stated] Give rare archetypes a generic starting-point PR instead of dedicated automation. ([Lesson 7](https://arxiv.org/abs/2611.05457))
- [stated] Let owners commit to the generated branch, and run each project's test suite before the PR opens. ([RQ3](https://arxiv.org/abs/2611.05457))
- [stated] Plan for the receiving teams' review and deploy cost as the main budget line of a fleet migration, not generation. ([Conclusions](https://arxiv.org/abs/2611.05457))
- [stated] Count owner-made migrations that reuse a rejected change, or a merge rate alone undercounts the effect. ([Lesson 6](https://arxiv.org/abs/2611.05457))

## In their words

> "expand the LLM's role in generating changes, but not in verifying them"
> — Mario Corchero and co-authors, Bloomberg and UCL, [2026-11-03](https://arxiv.org/abs/2611.05457)

## Context

- Model era: Claude Sonnet 4.5, then Claude Opus 4.6, from 2025-10 (start) to 2026-04 (last
  PR), outcomes read on 2026-06-30 ([source](https://arxiv.org/abs/2611.05457)). `outcome:
  ongoing` because the paper plans later rounds of the Python campaign.
- A paper with tables and a stated counting method, but no released data: `evidence` is
  `shown-in-source` for the PR outcomes; the effort and runtime-data claims are the team's own.
- Bloomberg uses many repositories and sends PRs to owning teams; the paper notes a monorepo,
  where one change updates all callers, would face a different version of the landing problem. Compare the
  monorepo pipeline at [Google](2025-04-13-google-int64-ids.md) and fleet-wide agent PRs at
  [Spotify](2025-11-06-spotify-honk.md).
- Same finding that generation is not the bottleneck, from a single-repository refactor:
  [1Password](2026-04-20-1password-monolith-refactor.md).
