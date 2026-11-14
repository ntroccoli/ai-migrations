---
title: Zalando moves partner apps from one in-house UI component library to another with GPT-4o
date: 2025-02-20
company: Zalando
summary: A Python tool fed GPT-4o hand-checked mappings and examples per component group; over 90% of migrated lines were right, and one bad change reached production.
source_url: https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html
also: [https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries]
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: framework
from: in-house UI component library (React)
to: another in-house UI component library (React)
from_languages: [unstated]
size: fifteen B2B partner applications in scope
duration: unstated
people: unstated
cost: under $40 per repository in GPT-4o API fees (estimate)
ai_share: part
tools: [custom Python migration CLI, llm Python library, continue.dev, Aider]
models: [GPT-4o]
period: 2024..2025-02
outcome: partial
status: current
superseded_by:
---

# Zalando moves partner apps from one in-house UI component library to another with GPT-4o

Zalando's Partner Tech department had built two UI component libraries of its own and set out to move its
fifteen partner-facing B2B applications onto one of them. Codemods were judged a poor fit for the
many ways teams used each component, so a team worked out a prompt in a hackathon over five rounds,
ending with an interface, a hand-checked mapping and examples per component. A Python tool on
GPT-4o then rewrote each file and opened it for an engineer's review. The authors report over 90%
of migrated lines correct, at under $40 per repository, but also wrong size mappings, invented
props, output that changed between runs, grids the model could not judge visually, and one
mistake that reached production ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html),
[talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).

## Source

A post on Zalando's engineering blog by a principal engineer in Partner Tech, dated 2025-02-20,
and a talk by the same engineer at Web Engineering Summit 2026, whose page carries a
machine-made transcript (it misspells some names; we read "AIDAR" as Aider and "Dataset" as
the Datasette project, which publishes the llm library). Zalando sells none of the tools it used. The talk adds
the accuracy metric, the review step, the number of applications migrated and a production
incident that the post leaves out. Neither shows the data behind its numbers; the post's only
figure is a code diff
([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html),
[talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).

## What was migrated

React user interfaces that Zalando's partners (brands and retailers) use to run their business on
the platform. The department had grown two component libraries with different components,
interfaces, design languages, spacing scales and grids, which split the user experience and
duplicated design and development work. The project moved the applications on one library to the
other; the two differed enough that the team put a move by hand at more than a year of developer
time, and one to four months for each application
([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#overview-of-migration-project),
[limits](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation),
[talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).

## Who did what

- **AI:** GPT-4o rewrote the component usages in each file from a prompt holding the target
  interface, mapping rules and examples for a group of components. An LLM, through continue.dev,
  also drafted those interfaces, rules and examples from the libraries' source code, and an
  AI tool the transcript calls AIDAR (likely Aider) wrote the commits and their descriptions.
  Basis for `ai_share: part`: the sources say the LLM did the repetitive, common transformations,
  while design differences, missing features, tests and varied codebases took significant manual
  work; they give no share of the changed code
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- **Rule-based tools:** the team's Python command-line tool, built on the conversation
  API of the llm library: it found the files that used the components, built each prompt, sent
  "continue" when output was cut off, pulled the file out of the reply and committed it. Codemods
  were tried first and judged a poor fit for the code's many variations.
- **People:** ran the hackathon experiments, checked and corrected the generated mappings and
  examples by hand, grouped the components, kept a golden set of before and after examples as
  regression tests, reviewed and tested every generated change before merging, and did the
  complex migrations, UI polish, bug fixes and deployment.

## How it was checked

Each generated change went to an engineer as a review to check, test, merge and deploy. The
prompts had their own regression tests: LLM-made before and after examples (a golden set, in the
talk), rerun after each prompt change or model trial and compared by hand or by an LLM.
Accuracy was the number of correctly migrated lines over all lines the LLM migrated; the
transcript says lines with missed imports, leftover variables or bugs were excluded, without
making clear from which side of the ratio. The authors call for code review
and visual testing, since the model cannot see a broken layout; one wrong data migration still
passed review and broke a page in production
([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool),
[talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| fifteen applications | B2B partner applications in the project's scope | reported | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#overview-of-migration-project) |
| eleven or more applications | complex B2B applications migrated with the tool, as of the talk | reported | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| more than a year | developer time expected for the migration by hand | estimate | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| 1 to 4 months | expected time to migrate each application | estimate | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| more than 90% | correct lines over lines the LLM migrated (definition from the talk), higher for low to medium complexity components | reported | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#what-worked-well), [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| under $40 per repository | GPT-4o API cost, worked out from average token counts | estimate | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness) |
| 40 USD per repository | cost per repository as the talk states it, basis not given | reported | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| ~45K tokens | mean prompt size for one component group | estimate | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness) |
| ~2K tokens | mean size of one output file | estimate | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness) |
| ~10 component groups | groups per repository, about 3 components each | estimate | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness) |
| ~30 files | files rewritten for each component group, on average | estimate | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness) |
| 40-50K tokens | prompt context kept per component group; the talk says under 40,000 tokens | reported | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool), [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| 4K token | output limit past which files were cut off mid-transformation | reported | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool) |
| 30 to 200 seconds | processing time for each file | reported | [post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation) |
| once every 10 to 15 runs | how often a change like a broken function name appeared, even at temperature zero | estimate | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |
| 4.5 seconds | source library's default notification timeout, which the model carried over unasked | reported | [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries) |

## What worked

- Rounds of prompt design, each building on the last: the source code alone, then a
  generated interface, then mapping rules, then hand-checked rules, then hand-checked examples of
  rising complexity, which brought high accuracy for all sample components
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iterative-experiments)).
- A system prompt casting the model as an experienced developer, with code style rules and a
  strict output tag, gave more consistent output and stopped stray explanations
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#system-prompts)).
- Grouping components (form, core and so on) kept prompts near 40-50K tokens, where accuracy held
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool)).
- Fixed instructions and examples went first in the prompt and the file last, so the API could
  cache the shared part across files; the sources say caching could apply, not that it did
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool)).
- The model handled usages a codemod would need a rule for each: aliased components, select
  options built by a map, a default timeout of 4.5 seconds carried over without being asked
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#what-worked-well),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- Generating the prompts with an LLM and building the tool took less time than writing codemods,
  the authors say
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#what-worked-well)).

## What went wrong

- First round: given both libraries' source code, the model returned inconsistent output with
  many errors, which the team put down to too many steps in one pass
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iteration-1-transform-using-source-code)).
- Second round: a generated interface still left several attributes untransformed; it lacked
  what only the source code held. In the talk the example is a size the target library lacks,
  with no rule for where it should go (the talk and the post describe the button sizes
  differently)
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iteration-2-transform-using-interface),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- Third round: the model wrote its own size mapping by name, medium to medium, though the old
  medium button looks like the new large one; source code shows neither design intent nor
  rendering. Complex business logic, old imports and unused variables were also left as they
  were. After people fixed the mappings, components that needed substantial restructuring still
  had issues until examples were added
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iteration-3-transform-using-interface-and-transformation-instructions),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- A vague prompt made the tool rewrite unrelated components in files with no button
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#lessons-learned)).
- Files past the 4K token output limit were cut off mid-transformation until the tool sent
  "continue"; the model also added explanations or Markdown around the code until the system
  prompt forbade it
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool)).
- The same input gave different outputs. Temperature zero helped, yet a rerun still broke a
  correct function name about once every 10 to 15 runs, with no clear cause
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- The model sometimes ignored instructions, made unexpected changes or wrote plausible but wrong
  code, such as a property the component does not have; the talk shows it adding a field the
  instructions never asked for
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- Small changes to the instructions could swing results widely, which is why the prompt
  regression tests were added; larger prompts also lowered accuracy, which set the size limit
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool)).
- The model cannot see layout: the libraries used different spacing scales and 12-column versus
  24-column grids, so a page could compile and still look broken once deployed; halving a column
  span forces a choice between wrapping and extra whitespace that needs a visual check. The
  source gives this as a risk and an example, not as a counted failure
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation)).
- One wrong migration of a component's data was hard to spot, passed review and reached
  production, where a page broke for its users. The authors add that engineers who did not write
  the migration knew the new library less well, which makes debugging and incidents harder.
  The talk describes the remaining bugs as few, mostly unused imports, but in its lessons also
  speaks of many unexpected issues caused by the model
  ([talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- Copying source code into prompts by hand at first was slow and error-prone, until
  continue.dev took over that step
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#lessons-learned)).
- Taking 30 to 200 seconds a file, the tool was slow for quick experiments, though fine in the
  background
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation)).
- Full automation was out of reach: different design philosophies, features missing from the
  target library, inconsistent test suites and varied codebases took significant manual work.
  Time pressure meant test cases were not migrated
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- **Not reported:** how many of the fifteen applications in scope were finished (the talk
  counts eleven or more migrated, without tying them to that scope); the share of the code the
  tool changed versus people; the line counts behind the accuracy figure; how the cost was
  measured (the post works it out from averages, the talk states 40 USD per repository without a
  basis); review time per change; the hours people spent on fixes; a count of defects; team size
  and calendar time. The time saved is asserted, not measured
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#cost-effectiveness), [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).

## Practices to copy

- [stated] Split the prompt into parts: the target interface, explicit mapping rules, then examples, rather than asking for all steps at once. ([Iterations](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iterative-experiments))
- [stated] Have people check generated mappings against how components look, since names like medium may not match across design systems. ([Iteration 4](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iteration-4-manual-verification-of-interface-and-transformation-instructions))
- [stated] Add hand-verified before and after examples of rising complexity to the prompt for complex components. ([Iteration 5](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#iteration-5-passing-examples-to-the-llm))
- [stated] Keep a golden set of examples as regression tests and rerun it on every prompt change or model trial. ([Talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries))
- [stated] Group components so each prompt stays small; accuracy fell as the context grew. ([Creating the tool](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool))
- [stated] Put fixed instructions first and the file last so prompt caching can apply across files. ([Creating the tool](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool))
- [stated] Review every generated change and test it visually; a compiling page can still have a broken layout. ([Lessons learned](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#lessons-learned))
- [stated] Keep the team close to the migrated code so it learns the new library the model applied for it. ([Talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries))
- [stated] Say what to do when the target is absent, so the model leaves unrelated code alone. ([Lessons learned](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#lessons-learned))
- [ours] Treat temperature zero as no guarantee of the same output; recheck a file whenever it is rerun. ([Challenges](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation))
- [ours] Give data-shape changes inside components extra review, since the one production incident came from one. ([Talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries))

## In their words

> "while a page could be syntactically migrated correctly, the layout may appear broken upon deployment."
> — Naval Singh, Principal Engineer, Zalando, [2025-02-20](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#challenges-and-limitation)

## Context

- Model era: GPT-4o, with the tool built in September 2024 and used soon after; the authors say
  their findings reflect that model at that time. In the talk the speaker says the method is
  still valid with newer models and agents, that codemods remain the choice for predictable
  changes, and that the team now uses LLMs in its later migrations. The tool did not cope with
  changes spanning several files, which the team met in a later move between two in-house
  frameworks. The talk's count of migrated applications may include work after the post
  ([post](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html#creating-the-tool),
  [talk](https://gitnation.com/contents/llm-powered-migration-of-ui-component-libraries)).
- The sources do not say whether the applications are written in JavaScript or TypeScript;
  `from_languages` is left unstated.
- Related: another per-file React migration with retries and rich context,
  [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md), and one where a codemod fed the
  model, [Slack Enzyme to RTL](2024-05-22-slack-enzyme-to-rtl.md). Zalando counts success as
  correct lines, Airbnb as files that pass checks, so their figures do not compare.
