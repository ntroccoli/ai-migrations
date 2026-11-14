---
title: Shopify rebuilds its React Native mobile apps natively for iOS and Android
date: 2026-09-10
company: Shopify
summary: Agents port Shopify's React Native apps to native iOS and Android in gated checkpoints; the author says one-shot ports fail. The Shop app shipped in 12 weeks.
source_url: https://shopify.engineering/back-to-native
also: [https://shopify.engineering/shop-app-migration]
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: language
from: React Native apps (Shop first; Shopify, Point of Sale, Inbox to follow)
to: native iOS (Swift, SwiftUI) and Android (Kotlin, Jetpack Compose) apps
from_languages: [unstated]
size: Shop app (size unstated); Shopify app, in progress, 300+ screens
duration: 12 weeks (Shop app, proof of concept to app-store release)
people: Shop app core group of 6 engineers, then feature teams
cost: unstated
ai_share: unstated
tools: [Helix (Shopify checkpoint system), Pi coding agent with a Shopify migration extension, Tardis (Shopify app debugging tool), headless app CLI, linters, static analysis, tests]
models: [unstated]
period: 2025..2026
outcome: ongoing
status: current
superseded_by:
---

# Shopify rebuilds its React Native mobile apps natively for iOS and Android

Shopify is rewriting its React Native mobile apps as two native code bases, Swift and Kotlin, with coding
agents reading the old app as the reference. The author says that asking a model to reproduce the
features in one pass yields large amounts of code that cannot be maintained or shipped. Shopify
instead built Helix, which splits each screen into small checkpoints that must pass tests, a
visual comparison with the running app, two adversarial code reviewers (likely agents; the post does not say) and a person's approval.
Driving simulators with agents proved slow and fragile, so the apps are being restructured to run
their logic headless behind a CLI. The Shop app went from first trial to app-store release in 12
weeks; the Shopify app is still in progress
([source](https://shopify.engineering/back-to-native)).

## Source

Two posts on Shopify's engineering blog, both dated 2026-09-10. The main one, by Mustafa Ali,
explains the decision and the migration method; a companion post by three Shop app engineers
describes the first app moved, with before-and-after app metrics
([Shop app post](https://shopify.engineering/shop-app-migration)). Shopify does not sell the
coding agents or models it used; its tools Helix and Tardis are internal. The posts state results
without the data behind them, apart from two small tables of startup times and app sizes and
screen recordings. Neither post names a model, a token count or a cost. Two linked posts on X
were not archived.

## What was migrated

Shopify's mobile apps, which it had built in React Native since 2020: the Shopify app, Shop, Inbox
and the point-of-sale app. The team chose a fresh build of each app in Swift and Kotlin over a gradual move inside
the old app, using the React Native app as the reference for each feature. The Shop app moved
first; the Shopify app, with more than 300 screens plus widgets, a watch app and Siri shortcuts,
was underway at publication ([source](https://shopify.engineering/back-to-native)). The Shop
move also had to keep users signed in, keep push notifications working and keep sending the same
analytics events to downstream systems, while some screens were retired or simplified on purpose
([Shop app post](https://shopify.engineering/shop-app-migration)).

## Who did what

- **AI:** coding agents (models not named) ported features screen by screen from the React Native
  code, in the Shop app built Android from the iOS version (the prototypes also went the other way), and reviewed changes. In the
  Shop app, specialized subagents read the old source, wrote down its behaviour, planned each
  platform, built the features and checked that both apps matched. Two adversarial reviewers, not said to be people, check each
  Helix checkpoint ([source](https://shopify.engineering/back-to-native),
  [Shop app post](https://shopify.engineering/shop-app-migration)). Basis for `ai_share:
  unstated`: the posts say the work was assisted by AI and that agents now do enough of it to
  change the decision, but give no share.
- **Rule-based tools:** tests, linting, static analysis and performance checks; Tardis, which
  lets agents read the running app's events, logs and state, send it commands, and capture screenshots and
  events from both apps at named checkpoints; a headless CLI over the app's business logic; plan
  approval bound to a content hash of the plan
  ([Shop app post](https://shopify.engineering/shop-app-migration)).
- **People:** one engineer ran a one-week proof of concept; six core engineers laid the
  Shop app's native base and built its main flows; feature teams joined halfway to check their
  own areas and the rarer cases. Engineers approved the requirements and the plans before any
  code was written, approve each Helix checkpoint, and supplied the native expertise that review
  needed ([Shop app post](https://shopify.engineering/shop-app-migration),
  [source](https://shopify.engineering/back-to-native)).

## How it was checked

Each Helix checkpoint must prove its behaviour with tests, look the same as the live React Native app
when compared visually, get through two adversarial reviewers and win a person's approval before it is
committed and the next starts. Review feedback is remembered so later checkpoints need less help
([source](https://shopify.engineering/back-to-native)). For the Shop app, engineers approved
requirements and plans, and editing an approved plan cancelled its approval. Parity reviews
compared screenshots and raw analytics events from both apps at named checkpoints, allowing for
values that differ between runs. Beta testing ran for about two months and penetration testing
before release, per the timeline chart. The team then compared the two apps on startup time,
stability, download size, build speed and frame rate
([Shop app post](https://shopify.engineering/shop-app-migration)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 12 weeks | Shop app, from first trial to native release in the app stores | reported | [post](https://shopify.engineering/back-to-native) |
| 300+ screens | size of the Shopify app, whose move was underway | reported | [post](https://shopify.engineering/back-to-native) |
| several minutes against seconds | time agents took to test a change in a simulator, against the time to make it | reported | [post](https://shopify.engineering/back-to-native) |
| milliseconds, against minutes | iteration time through the headless CLI, against simulators | reported | [post](https://shopify.engineering/back-to-native) |
| 1 week, 1 engineer | Shop proof of concept porting the app to SwiftUI with agents | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 6 engineers | core group that built the Shop app's foundations and main journeys | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 2466 ms against 3200 ms, 23% | iOS cold start, native against React Native, tap to first home feed | measured | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 2233 ms against 4433 ms, 50% | Android cold start, same measure | measured | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 99.5%+ to 99.95%+ | share of sessions without a crash, React Native to native | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 10x | reduction in crashing sessions | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 109 MB (37.2%) smaller, 184 MB against 293 MB | Android release build size, native against React Native | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 1 MB (1.5%) larger, 68 MB against 67 MB | iOS release build size, native against React Native | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| about 75% | fall in Android release build time; iOS unchanged | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |
| 120 frames per second | native Android app scrolling and navigating on a Pixel device | reported | [Shop app post](https://shopify.engineering/shop-app-migration) |

## What worked

- Agents ported features well when an existing implementation sat beside them: the React Native
  app for the first platform, then the iOS version for Android
  ([source](https://shopify.engineering/back-to-native),
  [Shop app post](https://shopify.engineering/shop-app-migration)).
- Helix's small, ordered checkpoints, each blocked until tests, visual match, two adversarial
  reviewers and a person passed it, replaced one-shot porting; the author says it lets the apps be
  rebuilt far faster than before, without figures
  ([source](https://shopify.engineering/back-to-native)).
- A one-week proof of concept by one engineer was not production-ready but showed that a
  faithful port, feature by feature, was within reach before the team committed
  ([Shop app post](https://shopify.engineering/shop-app-migration)).
- Specialized subagents for reading the old source, writing requirements, planning, building and
  reviewing parity, with engineer approval of requirements and plans bound to the plan's hash
  ([Shop app post](https://shopify.engineering/shop-app-migration)).
- Engineers often ran several agent sessions at once, each in its own worktree, with clear tasks,
  quick build and test cycles and frequent review
  ([Shop app post](https://shopify.engineering/shop-app-migration)).
- Giving agents structured access to the running app (events, logs, state, commands) and
  side-by-side captures of both apps let them check navigation and analytics while people looked
  at the screens less ([Shop app post](https://shopify.engineering/shop-app-migration)).
- Separating business logic from the UI so it runs headless behind a CLI lets agents test in
  milliseconds rather than minutes and work alone for hours, the author says, while the
  restructuring of the apps continues ([source](https://shopify.engineering/back-to-native)).
- The Shop app reports faster cold starts on both platforms, fewer crashing sessions, a smaller
  Android build and faster Android builds
  ([Shop app post](https://shopify.engineering/shop-app-migration)).

## What went wrong

- The author says pointing a model at the React Native code to reproduce features in one pass
  does not work, even after gathering specs and task files up front: it yields large amounts of
  unmaintainable code that cannot ship. Helix was built because of this
  ([source](https://shopify.engineering/back-to-native)).
- Agents driving simulators were a bottleneck: could not build, test and iterate reliably,
  people had to watch them constantly, and Shopify's own tooling for reproducing, fixing and
  verifying bugs was slow and brittle. Reading app state from accessibility data or
  screen captures made each test take several minutes against seconds for the change; hot reload
  helped but did not fix it ([source](https://shopify.engineering/back-to-native)).
- Generated code could meet feature requirements and still repeat code, drift from the intended
  architecture or run slowly; native expertise, repository guidance, linting, tests and review were
  still needed ([Shop app post](https://shopify.engineering/shop-app-migration)).
- Native still means two code bases to build and maintain; the author says agents lowered that
  cost, not removed it ([source](https://shopify.engineering/back-to-native)).
- The Shop app's iOS build grew by 1 MB and its iOS build time did not improve, and the team says
  performance still needs work
  ([Shop app post](https://shopify.engineering/shop-app-migration)).
- **Not reported:** the models; how much of the code agents wrote; token or money cost; how many
  Helix checkpoints or AI reviews were rejected, and what the AI reviewers missed; defects or
  regressions found in beta or after release; the iOS test device, run counts and spread behind
  the startup times; any accessibility comparison, though the source review covered it; how parity was measured beyond the flows engineers
  ran; whether the one-shot failure was a measured trial or the author's summary. The Shop metrics
  compare a rebuilt and partly simplified app, so they do not isolate the effect of the move or
  of AI. The timeline chart spans about four months from foundations to
  release, longer than the 12 weeks stated, and the posts do not reconcile the two (our reading).
  The Shopify app had not shipped at publication
  ([source](https://shopify.engineering/back-to-native),
  [Shop app post](https://shopify.engineering/shop-app-migration)).

## Practices to copy

- [stated] Do not ask a model to port a whole app in one pass; slice each screen into small ordered checkpoints, each quick for a person to review. ([Preventing slop](https://shopify.engineering/back-to-native))
- [stated] Block each checkpoint until it passes tests, a visual match with the old app, adversarial code review and a person's approval. ([Preventing slop](https://shopify.engineering/back-to-native))
- [stated] Keep review feedback and feed it into later checkpoints so the loop needs less help as the migration goes on. ([Preventing slop](https://shopify.engineering/back-to-native))
- [stated] Decouple business logic from the UI and expose it to agents through a headless CLI so they can test without simulators. ([Fast feedback loops](https://shopify.engineering/back-to-native))
- [stated] Run a short proof of concept with one engineer and agents before committing to the full move. ([Proof of concept](https://shopify.engineering/shop-app-migration))
- [stated] Bind a plan's approval to a content hash, so any edit to the plan needs a new review. ([What we've learned](https://shopify.engineering/shop-app-migration))
- [stated] Capture screenshots and raw analytics events from old and new apps at named checkpoints and have agents compare them. ([What we've learned](https://shopify.engineering/shop-app-migration))
- [stated] Build one platform first and port the other from it, giving each platform a separate plan and a separate review. ([What we've learned](https://shopify.engineering/shop-app-migration))
- [ours] Before trusting a speed-up, time how long an agent takes to test one change on the target platform; minutes per test cap the gain. ([Fast feedback loops](https://shopify.engineering/back-to-native))

## In their words

> "It doesn’t matter how good the model is if it can’t test its work quickly"
> — Mustafa Ali, Shopify, [2026-09-10](https://shopify.engineering/back-to-native)

## Context

- Scope: the posts call this a fresh build rather than a gradual migration, but each feature is
  ported from the React Native app already in use, which agents read as the reference, so it is a move
  of existing products ([source](https://shopify.engineering/back-to-native)).
- Model era (the 2025 start of `period` is our inference from the post's late-2025 timing): Shopify says it has used LLMs since 2021 and that by late 2025 they could change the
  cost of building twice; the Shop timeline runs from May to August, with no year shown
  ([source](https://shopify.engineering/back-to-native),
  [Shop app post](https://shopify.engineering/shop-app-migration)).
- Shopify also reports who will maintain the open-source React Native libraries it published, which is outside
  this case.
- Related: adversarial reviewers and gated slices also appear in
  [Bun Zig to Rust](2026-07-08-bun-zig-to-rust.md); a multi-model review loop and slow inner
  loops appear in [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md).
