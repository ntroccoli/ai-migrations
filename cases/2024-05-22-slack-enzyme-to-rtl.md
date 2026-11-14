---
title: Slack pairs a syntax-tree codemod with Claude 2.1 to help move 15K Enzyme tests to React Testing Library
date: 2024-05-22
company: Slack
summary: Codemod alone 45% (evaluation files), Claude 2.1 alone 40-60% (base not given), both 80% of code in 9 checked files; 22% of tests passed over 338 files.
source_url: https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: shown-in-source
kind: test-framework
from: Enzyme (React unit and integration tests)
to: React Testing Library
from_languages: [JavaScript, TypeScript]
size: more than 15,000 test cases
duration: unstated
people: unstated
cost: unstated
ai_share: unstated
tools: [custom AST codemod, custom conversion pipeline, Jest, linters with auto fix, CI nightly jobs]
models: [Claude 2.1]
period: unstated
outcome: ongoing
status: current
superseded_by:
---

# Slack pairs a syntax-tree codemod with Claude 2.1 to help move 15K Enzyme tests to React Testing Library

Enzyme has no React 18 support, so Slack had to rewrite over 15,000 test cases written with
Enzyme for React Testing Library. A rule-based syntax-tree codemod alone converted 45% of the code in its
evaluation files; Claude 2.1 alone succeeded 40 to 60% of the time. A pipeline that gave the model
the codemod's partial output with inline hints, plus each test's rendered DOM, reached 80% of the
code in nine hand-checked files. Over a wider run of 338 files, about 500 of 2,300 test cases
passed after conversion. Developers ran the tool on about 64% of the files moved to the new
library, and people reviewed its output before merging. The figures are interim: the post came
out as the project neared its end, with data still being gathered
([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## Source

A post on Slack's engineering blog by an engineer of the team that owns Slack's frontend test
frameworks, dated 2024-05-22 and updated 2024-10-03 with a note that an open-source version of the conversion tool
is on npm. Slack does not sell the model it used (Anthropic's); the free tool is the only product
the post points to. The post explains how the 80%, 22% and 64% figures were counted (sample sizes, the
quality rubric, the adoption formula) and shows a results chart, but not the per-file data; it
does not say how the 45%, 40–60% or 20–30% figures were measured. A QCon
San Francisco 2024 talk by the same author repeats these figures and adds nothing about the migration
on its page, so it is not listed here
([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## What was migrated

Slack's frontend unit and integration tests written with Enzyme, a library that tests React
components through their internals and has no adapter for React 18. Moving to React 18 meant
rewriting more than 15,000 test cases for React Testing Library, which queries what the user sees
in the rendered page. The team put the manual work at more than 10,000 engineering hours and found
no existing tool for it. Slack's code used 65 different Enzyme functions; `find` alone appeared
in 13,244 calls
([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## Who did what

- **AI:** the model, Claude 2.1, reached through an internal API endpoint set up with Slack's DevXP AI team,
  rewrote each test file. Its input held the original test, the codemod's partly converted file
  with hint comments, and the rendered DOM of every test case; when the converted test failed,
  the pipeline sent it back for another try. The source gives no share of the final migrated
  code that the model wrote, so `ai_share` is unstated
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- **Rule-based tools:** a syntax-tree codemod written by the team converted rendering calls,
  patterns for 10 common Enzyme functions, and Slack's own Jest matchers and selector helpers, and left a
  comment with a suggestion and a documentation link on every line it could not convert. Adapters
  around Enzyme's `mount` and `shallow` captured each test case's rendered DOM; linters with auto
  fix and Jest checked the model's output; CI nightly jobs ran hundreds of files and sorted them by
  how many test cases passed
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- **People:** Slack's test-frameworks team built the codemod and the pipeline and tuned the
  prompts; frontend developers chose when to run the tool, tweaked original files to help the
  model and finished the conversions by hand; frontend developers also hand-converted the 9
  benchmark files. People (the source does not say who) checked the generated code before merging
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## How it was checked

Two measures. First, a manual review of 9 test files (three each of easy, medium and complex),
converted both by the tool and by frontend developers, scored against a rubric covering imports,
rendering, Jest assertions, and JavaScript or TypeScript logic, with the developers' versions as
the benchmark. Second, a run over 338 files with about 2,300 test cases that counted which test
cases passed. People reviewed the generated code before it was merged. Each figure has its own
base: the 45% from evaluation files whose number and method are not given, the 80% from the 9
hand-checked files, the 22% from the
338-file run, the 64% from all files converted to the new library
([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| more than 15,000 test cases | Enzyme test cases to convert | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| more than 10,000 engineering hours | the team's estimate of the manual work | self-estimate | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 65 Enzyme functions | distinct Enzyme methods used in Slack's code | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 13,244 calls | uses of Enzyme's `find`, the most frequent method | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 10 Enzyme functions | methods the codemod got conversion rules for | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 45% of code | code converted automatically by the codemod alone, on the evaluation files (count not given) | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 40–60% success | conversion success of Claude 2.1 alone with prompts; base not given | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 80% of content | share of code judged right against the developers' versions, codemod plus model, 9 hand-checked files | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 20–30% improvement | gain of the pipeline's added context and controls over the model alone; base not given | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| about 2,300 test cases in 338 files | the wider pass-rate run in CI | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| about 500 test cases | test cases in that run that passed after conversion | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 16% of files | files in that run fully converted (results chart) | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 24% of files | files in that run partly converted, 20 to 100% of test cases passing (results chart) | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 78% of test cases | test cases in that run that did not pass (results chart) | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 22% of test cases | test cases in that run that passed (results chart) | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 22% of developer time | time saved, taken as equal to the share of passing test cases | self-estimate | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| about 64% of files | adoption: files the tool ran on, divided by all files converted to the new library | measured | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 2–5 minutes | time for an on-demand conversion run | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 10 required prompt rules | must-follow instructions in the main part of the prompt | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |
| 7 optional prompt rules | instructions to apply when they fit, in the main part of the prompt | reported | [post](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/) |

## What worked

- Feeding the model the codemod's output, already partly converted and with a hint comment on
  every line left undone, kept the model from inventing code or producing nonsense; the author
  calls it arguably the stronger control, ahead of prompt work
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- Giving the model what a person converting by hand would look at: the rendered DOM of each test
  case, captured by wrapping Enzyme's render calls, plus the test code, React code, test and lint
  logs ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- A short fixed prompt (context, required rules, optional rules, then a self-check of the output)
  instead of one universal prompt for first and feedback requests, which made requests harder
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- A loop of lint with auto fix, running the converted test, and sending failures back to the model
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- Nightly CI runs that sorted converted files into bands by passing test cases, so developers
  picked the best ones, and on-demand runs of 2 to 5 minutes for files they had tweaked
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## What went wrong

- Rule-based conversion hit a wall: exact rules were needed per case for 65 Enzyme functions, the
  rule set kept growing, and choosing the right query depends on the rendered DOM, which a
  syntax tree of one file cannot see. After 10 functions the team settled for 45% automatic
  conversion and left the rest to people
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- The model alone was inconsistent, at 40 to 60% success depending on how complex the test was;
  prompt tuning took a lot of time, helped little and may have confused the model
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- Even the hybrid left 20% of the content of the 9 hand-checked files for people to fix, and in
  the 338-file run about 78% of test cases did not pass; only 16% of the files converted fully
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- Some converted files did not run at all because of setup or import errors, so none of their
  test cases counted, even ones that may have been right
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- The 22% time saving counts only passing test cases. The source notes it may undercount (files
  that did not run); we add (ours) that it also leaves out time spent reviewing and fixing the
  rest ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- The figures are interim: data was still being gathered when the post came out
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- The author doubts AI can be the final answer for such conversions, citing how little is
  published on it, and expects custom pipelines to be needed
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- **Not reported:** whether all 15,000 test cases were finally moved, and when; how long the
  project ran and how many people worked on it; API cost; review effort per file; how the 45%
  and 40–60% figures were measured and on how many files; what happened to the files the results
  chart leaves out (it labels 16% and 24% of the 338 files); defects found after merging; data behind the
  claimed positive user feedback ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).

## Practices to copy

- [stated] Run a rule-based codemod first and give the model its partial output, with a hint comment on each line it could not convert. ([AST + LLM transformations](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [stated] Give the model the runtime facts a person would use, such as each test's rendered output, not only the source file. ([DOM tree collection](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [stated] Keep the prompt short and fixed: context, required rules, optional rules, then ask the model to list where its output breaks them. ([LLM control](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [stated] Lint, auto fix and run each converted test, and send failures back to the model. ([AST + LLM transformations](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [stated] Sort converted files by how many of their test cases pass, so people start from the best ones. ([Evaluation and impact](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [stated] Score a small set of easy, medium and complex files against a rubric, with hand-converted versions as the benchmark. ([Evaluation and impact](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [ours] State the base of every success rate (which files, how many, what counts as success) before comparing methods. ([Evaluation and impact](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))
- [ours] Count review and fix time on partly converted files before calling passing tests a time saving. ([Evaluation and impact](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/))

## Context

- Model era: the post names Claude 2.1, used through an internal endpoint; the post says the project was nearing
  its end in May 2024 and gives no start date
  ([source](https://slack.engineering/balancing-old-tricks-with-new-feats-ai-powered-conversion-from-enzyme-to-react-testing-library-at-slack/)).
- Same move at another company, a year later and with a retry-heavy LLM pipeline:
  [Airbnb's move off Enzyme](2025-04-01-airbnb-enzyme-to-rtl.md). Airbnb counts
  files migrated across its whole codebase; Slack counts content share in hand-checked files and
  passing test cases, so the figures do not compare.
