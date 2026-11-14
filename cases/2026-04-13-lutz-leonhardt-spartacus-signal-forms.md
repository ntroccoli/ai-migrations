---
title: Lutz Leonhardt starts moving 44 Angular form components in a Spartacus fork to Signal Forms
date: 2026-04-13
company: Lutz Leonhardt
summary: Claude Code sub-agents in worktrees moved Angular forms to Signal Forms, 34 of 44 marked done; a review found untested successes and silent rule changes.
source_url: https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop
also: [https://github.com/lutzleonhardt/spartacus/pull/1, https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md, https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/Plan.md, https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/AsmCreateCustomerFormComponent.md]
source_type: engineering-post
author_relation: user-of-tool
evidence: shown-in-source
kind: framework
from: Angular Reactive Forms (FormBuilder, Validators)
to: Angular Signal Forms through SignalFormControl, the interop first stage
from_languages: [TypeScript]
size: 44 components
duration: 2 to 3 hours of agent time for the first run
people: 1 developer (the author)
cost: unstated
ai_share: most
tools: [Claude Code, git worktrees, Nx, TypeScript compiler, Codex PR review, Qodo PR review]
models: [Claude Sonnet 4.6]
period: 2026-04
outcome: partial
status: current
superseded_by:
---

# Lutz Leonhardt starts moving 44 Angular form components in a Spartacus fork to Signal Forms

A developer used Claude Code to move 44 form components in a personal fork of SAP Spartacus, an
open-source Angular storefront, from Reactive Forms to the Signal Forms interop control. After two
hand migrations the author wrote a playbook; an orchestrator agent then gave each component to a sub-agent
in its own git worktree. The post counts 34 components successful; the plan counts the 2 hand migrations among them,
so the agents did 32 components in one evening; 5 components failed and 5 components were skipped. A later adversarial review found that "success" often meant only a clean compile: tests
had not run in several worktrees, and one agent quietly changed which email addresses a form accepts. The author would now add a second-model review and run small waves, each with test
gates and a person's sign-off ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop)); the refined protocol adds all but that review ([protocol](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md)).

## Source

A post by the developer who ran the migration, on dev.to, plus the pull request and the two
branches it links: the first run's plan, playbook and per-component logs, and a second branch with
the refined protocol and its first wave
([PR](https://github.com/lutzleonhardt/spartacus/pull/1),
[protocol](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md)).
The post shows no year; dev.to's article data gives 2026-04-13. The work ran in the author's fork,
not in SAP's repository: it is not SAP's migration and the pull request targets the fork's own
`develop` branch. The author sells no AI tool; the post names two review tools only as examples.
Because the repository shows the plan and commits behind the post's counts, the evidence is
`shown-in-source`, though most per-component logs hold only a status and the test list in the pull
request is self-reported. The per-component logs and the plan's statuses were written by the
agents; who wrote the pull request's description is not stated; the review comments on it come
from the Codex and Qodo bots. The model comes from our count of the pull request's commits, not
from its text: the sub-agents' commits (30 of 96 commits) carry a co-author line for Claude
Sonnet 4.6, from their prompt template; the orchestrator's model is not stated ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).

## What was migrated

Form code in 44 components and services across Spartacus feature and integration libraries
(checkout, customer service tools, quotes, user accounts and others). Most controls built with
`FormBuilder` and `Validators` became a `SignalFormControl` with a schema of signal validators,
while the `FormGroup` and most templates stayed as they were. Components using `FormArray` were out
of scope, since this first stage has no signal equivalent for it
([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-migration-target-signal-forms-stage-1)).
`SignalFormControl` is marked experimental in the Angular version used
([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).

## Who did what

- **AI:** a Claude Code orchestrator agent read the protocol, picked the next component from the
  plan, started a sub-agent for each component in a separate worktree, merged successful branches
  and recorded each result. The sub-agents rewrote the form code and templates, ran the checks and
  reported success or failure. Basis for `ai_share: most`: the post says the pipeline merged 34
  components; the plan counts the 2 hand migrations among them, so the agents did 32 components
  ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)). The author ran an adversarial review of the diff that found the semantic errors;
  the post does not say which model or tool ran it ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed)). On the pull request, the Codex and Qodo review bots also
  commented ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- **Rule-based tools:** git worktrees for isolation, the TypeScript compiler as the first run's
  real gate, and Nx test runs where the worktree allowed them.
- **People:** the author migrated the first two components by hand, wrote the three files that
  steered the agents (protocol, playbook, plan), committed a build fix after the run (in our reading of
  the commits, without the AI co-author line), and decided what
  changes for the second protocol.

## How it was checked

In the first run a component counted as successful when the migration finished and the TypeScript
compiler reported nothing blocking; that did not reliably mean tests had run or that behaviour was
unchanged
([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results)).
The pull request lists passing tests for 8 components and calls the others TypeScript-clean, with
tests blocked by the worktree setup ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
An adversarial review of the whole diff came afterwards. The second protocol makes each sub-agent
install dependencies, run the tests before and after the change, and report an abort when tests
cannot run; a baseline that runs but fails is noted as an old failure and the work goes on. The
orchestrator stops after each wave for a person
([protocol](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 44 components | components targeted | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 34 components | marked successful after the first run (the first run's plan, in the [PR](https://github.com/lutzleonhardt/spartacus/pull/1), counts the 2 hand migrations among them) | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 5 components | failed during the migration | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 5 components | skipped because they use `FormArray` | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 77% | first-run automation rate over all targets | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 87% | first-run rate over the components attempted | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results) |
| 94 commits | commits in the migration pull request | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-orchestrator-architecture) |
| 2 to 3 hours | agent time of the first run, in one evening | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-orchestrator-architecture) |
| 3 test runs | limit per sub-agent after the migration, set in the prompt | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today) |
| 4 to 5 components | size of a wave in the refined process | reported | [post](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today) |
| 8 components | components and services the pull request lists with passing unit tests | reported | [PR](https://github.com/lutzleonhardt/spartacus/pull/1) |
| 3 components | second branch's first wave marked successful, with one left in progress | reported | [plan](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/Plan.md) |

## What worked

- Two hand migrations first surfaced a pitfall that turned into a core rule (a `required` HTML
  attribute makes Angular try to change the control's validators, which the new control rejects),
  and the author wrote such rules into a playbook aimed at a fellow developer; a commit during the
  run added the required-attribute lesson to the playbook ([PR](https://github.com/lutzleonhardt/spartacus/pull/1),
  [source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-first-two-manual-migrations)).
- A separate sub-agent for each component, each in its own worktree branched from the feature branch, let
  agents edit, test and commit without touching each other; successes were merged, failures
  thrown away and documented
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-orchestrator-architecture)).
- A plan file with a status per component served the orchestrator as its state machine
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-three-artifacts)).
- The mechanical part scaled: the agents did 32 components in one evening (the plan counts
  the 2 hand migrations among the post's 34 components), and the 5 failed components all pointed at one API
  boundary
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#initial-results), [PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- The adversarial review caught two semantic changes that unit tests had not
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed)).

## What went wrong

- 5 components failed, all where code changes validators or errors imperatively: a `required`
  attribute in a template, a cross-field validator setting errors on another control, two date
  pickers whose form setup changes validators, and a form combining error calls, cross-field checks and
  enable calls inside its tests
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-failure-taxonomy-from-the-initial-run)).
- In several worktrees the tests never ran: dependencies had not been installed, so the test runner
  could not start. The sub-agents noted a warning and still reported success because the compiler
  was clean; the author says a significant number of successes were never test-verified
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed)).
- An agent swapped Spartacus's own email validator for Angular's built-in one in a customer
  creation form. The two use different patterns, so the form now accepts and rejects different
  addresses; no test noticed, and the review caught it
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed)).
- In a cart-binding form, a validator with a side effect that clears UI state ran at a different
  time after the migration and could reset an alert right after it was set; unit tests did not
  show it
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed)).
- The post says the protocol's prompt capped each sub-agent at three test runs once the migration
  was done, and some agents ignored the cap
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today)). That cap is in the second protocol; the
  first one capped compile fixes and turns without progress
  ([protocol](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md)), and its playbook allowed 2 fix-and-retest attempts per error
  ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- The review bots on the pull request flagged more that the post does not mention: a terms and
  conditions checkbox moved from a must-be-true check to a plain required one, which lets an
  unchecked box pass, in 3 checkout components (Qodo's summary shows the same control in a
  fourth); a constructor call that no longer compiled; and 2 components
  still enabling and disabling form controls imperatively, which can throw at runtime. The broken call was in
  a component the pull request lists as passing its tests: each worktree was checked alone, and the
  break between two components showed only after merging. A build fix followed 5 days after the
  run. In our reading of the branch on 2026-11-14, the checkbox still uses the plain required check
  ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- The agent's own log for the customer creation form says it removed the custom validators as
  unmapped, with tests unable to run, and still marked the component a success; the log names a
  different rule than the email check the original code used ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- The counts do not quite agree. The plan counts the 2 hand migrations among the 34 successful components,
  and its total and the folder's README give 43 components, not 44 components; the pull request holds 96
  commits and changes 94 files, where the post says 94 commits. The README gives about 79%, the
  post 77%, and one of the 5 skipped components is marked only as to be checked for `FormArray`
  ([PR](https://github.com/lutzleonhardt/spartacus/pull/1)).
- The second branch's first wave passed the customer creation form with all its tests green while,
  in our reading, it still uses Angular's built-in email check: the stricter test gates did not
  catch the change the review had found ([log](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/AsmCreateCustomerFormComponent.md)). The cart-binding form kept its validator
  with the side effect, also green; whether the timing problem is gone is not shown. That wave left
  one of 4 components in progress, and its plan summary was not updated
  ([plan](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/Plan.md)).
- The refined protocol follows only part of the post's advice: on success it still merges the
  worktree's branch and deletes the branch, keeps the test-run cap in the prompt, and has no second-model review step
  ([protocol](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/goal.md)).
- **Not reported:** cost or token use; which model ran the adversarial review and how many false
  alarms it raised; the author's review time; whether the review's findings and two of the three bot findings were fixed; the orchestrator's model; any test
  beyond unit tests (no end-to-end or browser checks); whether anything reached SAP's repository
  or production (the pull request was still open when we read it on 2026-11-14).

## Practices to copy

- [stated] Migrate the first components by hand and write their edge cases into a playbook before handing the rest to agents. ([Manual migrations](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-first-two-manual-migrations))
- [stated] Give each sub-agent its own git worktree and merge its branch only when it succeeds. ([Orchestrator](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-orchestrator-architecture))
- [stated] Keep a plan file with a status per target that the orchestrator updates as its state machine. ([Three artifacts](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-three-artifacts))
- [stated] Run small mixed waves and make the orchestrator stop for a person's approval before the next one. ([Differently today](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today))
- [stated] Run the tests before and after each change; when they cannot run, record an abort, never a success. ([Differently today](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today))
- [stated] Keep worktrees after a reported success so the diff and the agent's claims can be checked. ([Differently today](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today))
- [stated] Enforce limits the agent must not break, such as test-run counts, in a wrapper script rather than the prompt. ([Differently today](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today))
- [stated] Have a different model review the diff for semantic changes, then let a senior developer decide. ([Differently today](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-i-would-do-differently-today))
- [ours] Before an agent swaps a custom validator for a built-in, pin the old accept and reject cases in tests. ([Review](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#what-the-review-changed))
- [ours] Read the review bots' comments on the pull request before counting a target done; here they caught a checkout rule change. ([PR](https://github.com/lutzleonhardt/spartacus/pull/1))

## In their words

> "Agent transforms. Second model challenges. Human decides."
> — Lutz Leonhardt, developer, [2026-04-13](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-real-takeaway)

## Context

- Not SAP's migration: Spartacus is SAP's open-source Angular storefront, and this ran in one
  developer's public fork, as an experiment the author sets against a real client project. It builds on
  a published description of the interop pattern
  ([source](https://dev.to/lutz_leonhardt/i-used-ai-agents-to-migrate-44-angular-components-the-review-changed-my-mind-4pop#the-migration-target-signal-forms-stage-1)).
- Model era: Claude Code with Claude Sonnet 4.6, April 2026; the first run took one evening and the
  second protocol's first wave ran on the day the post appeared
  ([plan](https://github.com/lutzleonhardt/spartacus/blob/feature/signal-forms-migration-v2/SignalFormMigration/Plan.md)).
- Related: per-file gates and retries on a test-framework move,
  [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md); a migration where pages passed the
  syntax checks yet broke in layout, [Zalando UI libraries](2025-02-20-zalando-ui-component-libraries.md);
  agents in a fleet with an LLM judge, [Spotify Honk](2025-11-06-spotify-honk.md).
