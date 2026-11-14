---
title: PagerDuty's product manager gets Rundeck's Grails 7 upgrade to 99.7% passing tests in 9 days
date: 2026-04-13
company: PagerDuty
summary: A product manager with Claude Sonnet 4.5 in Cursor took Rundeck to Grails 7 in 9 days before engineer review; a Groovy 4 equals() change dropped the admin role.
source_url: https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: framework
from: Rundeck on Grails 6 (Spring Boot 2.7, Spring Security 5, Hibernate 5, Groovy 3, Java 11, javax)
to: Rundeck on Grails 7 (Spring Boot 3.2, Spring Security 6, Hibernate 6, Groovy 4, Java 17, jakarta)
from_languages: [Groovy, Java]
size: 5,100 tests; 400+ files touched by the jakarta package rename
duration: 9 days
people: 1 product manager, plus engineer reviewers (count unstated)
cost: $200 in AI tools
ai_share: unstated
tools: [Cursor]
models: [Claude Sonnet 4.5]
period: unstated
outcome: completed
status: current
superseded_by:
---

# PagerDuty's product manager gets Rundeck's Grails 7 upgrade to 99.7% passing tests in 9 days

A PagerDuty product manager, fairly technical and with some coding behind them but by their own
account no software engineer, took Rundeck to Grails 7, with
Spring Boot, Spring Security, Hibernate, Groovy, Java and the jakarta package rename moving at
once, using Claude Sonnet 4.5 inside Cursor. Consultants had quoted 6 months and
$200,000 to $300,000; the post reports 9 days, $200 in AI tools, and 5,083 of 5,100 tests
passing, then handed the work to engineers for review and finalization. The code compiled after day one; 221 tests failed on day two. On day five a test deploy showed
the admin user locked out: a Groovy 4 change to `equals()` let a set drop the admin role. AI
helped find it; the fix needed knowledge of the authorization model. The 40-60x speed-up is the
team's own estimate
([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## Source

A post on PagerDuty's engineering blog by Forrest Evans, who ran the migration as a product
manager. PagerDuty, the post's publisher, also sells its own AI agents (the same page promotes one, an SRE
agent), but none of them took part here; the tools used were Claude Sonnet 4.5 inside Cursor, which
PagerDuty does not sell, so the author is a user of the tools. The post states its results
without the data behind them: it says commits, test fixes and patterns were tracked, but shows
none of them. It has no figures or tables and links no repository or pull request
([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## What was migrated

Rundeck, a PagerDuty product built on Grails. Seven moves ran together: the
step up to Grails 7, Spring Boot 2.7 to 3.2, Spring Security 5 to 6, Hibernate 5 to 6 (query
syntax), Groovy 3 to 4 (changed semantics), Java 11 to 17, and the rename of javax packages to
jakarta across more than 400 files. LDAP login and metrics handling were refactored completely.
The upgrade had been planned for months while engineers were busy
([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## Who did what

- **AI:** Claude Sonnet 4.5 in Cursor, with upgrade guides and release notes in its context,
  read compile errors and failing tests, named likely causes (artifact conflicts, Groovy 4
  read-only properties, the wrong test trait) and proposed fixes; by day three the agent found and
  fixed Groovy 4 field-access failures faster. It also drafted the 44 migration patterns and
  helped trace the login failure. Basis for `ai_share: unstated`: the post says AI suggested the
  fixes, but gives no share of the changed code and does not say who did the LDAP and metrics
  refactoring
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- **Rule-based tools:** the compiler and the test suite as the checks; no
  codemod or rewrite tool is named.
- **People:** the product manager gathered the context, approved each fix the AI suggested,
  checked that tests passed and wrote up each pattern. The 6 hours of debugging behind the admin
  login fix are not credited to anyone in particular. Engineers took the work over for review and
  finalization; the closing section's working model includes 2-3 hours a day of engineer review,
  and it is unclear whether this project had that much
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## How it was checked

The existing test suite of 5,100 tests was the main check; the post's advice names CI/CD as the
real validation. A deploy to a test environment on day five showed the admin user could not log
in; the post does not say whether any of the 17 tests still failing touched login. The post recommends two-person code review for security and performance, and
says the work went to engineering for review before it was finished, without saying what that
review found or changed
([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| $200,000 to $300,000 and 6 months | price and time quoted by consultants for the migration | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| ~$72,000 and 6 months | loaded cost and full-time span the post gives for a senior engineer doing it | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| $200 | spent on AI tools | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 9 days | time from start to the reported end state | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 5,100 tests | size of the test suite | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 400+ files | files touched by the javax to jakarta rename | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 221 tests | failing tests at the start of day two, once the code compiled | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 17 tests | failing tests on day five, before the test deploy | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 6 hours | debugging that found the lost admin role | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 99.7% (5,083 of 5,100 tests) | tests passing at the end | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 44 patterns by day seven, 44+ migration patterns at the end | migration patterns written up | reported | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| $50,000 to $75,000 | dollar value of the time the patterns are expected to save on later upgrades and the handoff | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 40-60x | speed-up over a manual migration | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 900-1500x | cost saving against the consultants' quote, counting only the $200 tools bill | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 10x cheaper, 40x faster | the closing section's working model (team member, AI and engineer review) against consultants and manual work | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 2-3 hours a day | engineer review in that working model | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |
| 3-5 years | how long the post expects the new platform to last | self-estimate | [post](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/) |

## What worked

- Loading upgrade guides, release notes and forum issues into the tool's context first; the
  author says AI without that context wanders
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- Error triage by pattern: given a compile error or failing test, the model named the root cause
  and the fix in seconds, work the author says an engineer could do but only after reading docs
  and searching. The code compiled within the first day
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- Treating test failures as clusters: one fix often cleared many tests, and writing each fix up as
  a pattern (what broke, why, the fix, how to find it elsewhere) sped the agent up by day three
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- The pattern notes outlived the project: the author says the next upgrade, of Runbook Automation,
  now resolves in minutes issues that took hours the first time
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## What went wrong

- After the suite was down to 17 failing tests, a deploy to a test environment showed the admin
  user could not log in. Under Groovy 4, `equals()` on the `RundeckRole` class compared by name, so
  a principal and a role both named "admin" counted as duplicates in a set and the role was
  dropped. Finding it took 6 hours; AI helped trace the authentication flow, but the fix needed
  someone who understood the authorization model
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- The failure surfaced on the test deploy; the post does not say whether any test covered login
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- 17 of 5,100 tests (0.3%) still failed at the end, the same count as on day five. The post does not
  say what they were or whether they were fixed, skipped or accepted
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- Fixes cascaded both ways: one fix could clear twenty failures or break thirty
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- The author warns that the tools take the shortest path and patch symptoms, make plausible
  mistakes, and struggle with architecture
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- The 9 days end at a handoff: engineers then reviewed and finalized the work, and the post does
  not say how long that took
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- The 900-1500x saving counts only the $200 tools bill against the consultants' quote, leaving out
  the product manager's 9 days and the engineers' review; with people included, the closing section
  gives 10x cheaper and 40x faster. Neither ratio is derived, and the post's own 6 months against
  9 days come to about 20x in calendar time, not 40-60x (our arithmetic)
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).
- **Not reported:** how many engineer hours the review and finalization took, and what it changed;
  who did the LDAP and metrics refactoring; the share of code the AI wrote; what the last failing
  tests were; when the work ran; a production release, rollback or incident after the move; how
  the speed-up and cost ratios were computed; what the $200 bought; the cost of people's time
  ([source](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)).

## Practices to copy

- [stated] Load upgrade guides, release notes, known issues and codebase history into the tool's context before any code changes. ([Knowledge base](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [stated] Write each fix up as a pattern: what broke, the root cause, the fix, and how to spot it elsewhere. ([Document everything](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [stated] Lean on the tests and CI, and steer the agent away from shortest-path fixes that only silence a symptom. ([Validate constantly](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [stated] Keep two-person code review for security and performance, since AI handles patterns better than architecture. ([Know your limits](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [stated] When blocked, have the agent write the problem down and move on, keeping other investigations running. ([Know your limits](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [ours] Deploy to a test environment and log in with each role before trusting a nearly green suite after a language upgrade. ([When authentication stopped working](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))
- [ours] Have someone who knows the authorization model check changes to equality or collection behaviour in security code. ([When authentication stopped working](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/))

## In their words

> "AI can't rewrite your security layer without domain knowledge."
> — Forrest Evans, product manager, PagerDuty, [2026-04-13](https://www.pagerduty.com/eng/how-ai-tools-accelerated-six-month-framework-migration-to-nine-days/)

## Context

- Model era: Claude Sonnet 4.5 inside Cursor; the post, from April 2026, does not date the work
  itself.
- The open-source Rundeck repository holds an upgrade pull request by the same author, opened in
  December 2025 and merged in April 2026, whose description names later versions (Spring Boot 3.5
  where the post says Spring Boot 3.2) and more patterns than the post. The post gives no link to it, so this case takes
  nothing from it ([pull request](https://github.com/rundeck/rundeck/pull/9922)).
- Related: a move whose pages passed every syntax check yet broke on deploy,
  [Zalando UI libraries](2025-02-20-zalando-ui-component-libraries.md); a framework move by one
  developer with a second model as reviewer,
  [Spartacus Signal Forms](2026-04-13-lutz-leonhardt-spartacus-signal-forms.md).
