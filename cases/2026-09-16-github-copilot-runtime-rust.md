---
title: GitHub ports the Copilot agent runtime from TypeScript to Rust with agents
date: 2026-09-16
company: GitHub
summary: One engineer steered agent fleets to port about 430,000 lines of TypeScript to Rust in place, one component per PR, over 14.5 weeks.
source_url: https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/
also: []
source_type: engineering-post
author_relation: seller-of-tool
evidence: shown-in-source
kind: language
from: TypeScript on Node.js and V8
to: Rust (native library with a C ABI)
size: about 430,000 lines of TypeScript ported into 832,378 lines of Rust
duration: about 14.5 weeks
people: 1 lead developer, with a team for interop, SDK bindings, packaging and reviews
ai_share: most
tools: [GitHub Copilot app, GitHub Copilot CLI, agent merge, Copilot Code Review, napi-rs, cargo, end-to-end test suites]
models: [Claude Opus 4.8, Claude Opus 5, GPT-5.6 Sol, GPT-5.5, Claude Haiku 4.5, Claude Sonnet, Gemini 3.1 Pro, Grok 4.6]
period: 2026-05..2026-08
outcome: completed
status: current
superseded_by:
---

# GitHub ports the Copilot agent runtime from TypeScript to Rust with agents

GitHub rewrote the runtime behind its Copilot CLI, app and SDK from TypeScript to Rust, mostly
with agents steered by one engineer. The port ran in place on the main branch: each pull request
swapped one component for a thin shim into Rust and deleted the old code, while the existing
end-to-end tests had to pass and pre-releases shipped first. The source reports about 430,000
lines of TypeScript ported, 128 pull requests, 14.5 weeks and about $120,000 in tokens, along with
dozens of regressions and a first scope estimate that was off by more than three times
([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/)).
It is the most detailed account in this collection of how agent fleets behave on a large port.

## Source

A long post on the GitHub Blog by the engineer who led the port, dated 2026-09-16 and updated
2026-09-23. GitHub sells Copilot, the tool that did the work, so the post is also promotion; it
weighs less for that. It is unusually open: it shows numbers from the repository history and
from the agent session logs, lists the regressions by kind, and gives the token bill. The
repository itself is private, so the numbers cannot be checked from outside. Charts are images;
the archive keeps their alt text.

## What was migrated

The Copilot agent runtime: the agent loop shared by the Copilot CLI, the Copilot app, the Copilot
SDK and other Microsoft products. It ran as a Node.js process that every SDK, in six languages,
had to spawn and talk to over JSON-RPC. The goal was a native library that hosts can load in
process, with lower startup cost and memory use. Separating the terminal UI from the runtime was
a second task, still in progress. The port also replaced the npm dependencies with Rust crates;
the post counts about 60 npm packages removed
([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-two-migrations-in-one)).

## Who did what

- **AI:** agents in the Copilot app and CLI wrote most of the Rust code, explored the code base,
  split large ports into child sessions and wrote their prompts, reviewed each port line by line
  against the old TypeScript with several models, and drove pull requests to green through
  agent merge (fixing CI failures, answering review comments, rebasing). AI review bots ran on
  every commit.
- **Rule-based tools:** napi-rs macros generated the temporary interop glue and TypeScript
  declarations; the Rust compiler, `cargo check`, clippy and the linters gave the fast inner
  loop; CI ran the end-to-end tests and a schema compatibility check on every pull request.
- **People:** one engineer chose the target architecture, partitioned and ordered the work,
  challenged the agents' design choices, reviewed high-risk areas and made every merge decision.
  Colleagues built the temporary out-of-process interop layer and the SDK bindings, packaged the
  binaries, split crates for build time, sped up CI and reviewed pull requests.

## How it was checked

All existing end-to-end tests of the CLI and SDK ran against the new Rust code on every pull
request; a pull request that broke a required test did not land. Deleting the TypeScript in the
same pull request turned any later change to ported code into a rebase conflict, so it could not
slip by. Each port went through a multi-model review loop, AI review bots and a schema
compatibility check, then a human spot check before merge. Ports shipped in pre-releases first;
the post reports 135 releases in the window, 100 of them pre-releases
([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy)).
Afterwards the author compared the share of quality-related issues in two public repositories
before and during the port
([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-the-regressions)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| roughly 130,000 lines | TypeScript in scope at the first plan, early May 2026 | estimate | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-it-looked-like-before) |
| approximately 430,000 lines | production TypeScript that passed through the port, after code moved into scope and new code arrived | estimate | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-it-looked-like-before) |
| 832,378 lines | production Rust at completion, 2026-08-21 | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy) |
| 468,689 lines | Rust unit tests at completion | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy) |
| 174,675 lines | end-to-end TypeScript tests kept as the oracle | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy) |
| 128 pull requests | port pull requests that landed in main | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/) |
| roughly 14.5 weeks | porting window | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy) |
| 135 releases | releases from main in the window: 100 pre-releases and 35 stable releases | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy) |
| 2,019 exports | peak of temporary Rust-to-Node interop exports, 2026-08-03, with 3,356 TypeScript call sites; 0 exports at the end | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-interop) |
| 2,639 messages | messages the engineer typed or spoke, out of 31,247 user-role messages in the session logs | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-the-session-data-shows) |
| 31.0% | share of the engineer's messages about review, testing and CI; 17.4% challenged design choices, 15.0% pushed for completeness | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-the-session-data-shows) |
| 96.22% | prompt-cache hit rate on input-side tokens | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-it-s-all-about-caching) |
| 5,116 compactions | automatic context compactions across the port sessions | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-it-s-all-about-caching) |
| 8,678 diagnostics | Rust compiler error codes captured; 84% in four families of ordinary typing errors; 1.7% about ownership, borrowing or lifetimes | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-yes-static-analysis-helps) |
| 10x | file reading and search calls compared with edit calls | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-agents-like-reading) |
| 15 child sessions | sessions one parent session started for the hardest file, about 30,000 lines of TypeScript, in a 25-hour run | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-working-with-agent-fleets) |
| dozens of regressions | known port regressions traced by 2026-09-14, all fixed; no exact count given | reported | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-the-regressions) |
| 22.9% to 23.7% | quality-related share of issues in the public CLI repository, January to April against May to August | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-the-regressions) |
| 158 blocks | `unsafe` blocks in the runtime crate, across 36 files, all at external boundaries | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-how-much-unsafe) |
| 7.55 to 120.0 lifecycles per second | one-turn session lifecycles per second, Node runtime against Rust in process, on a local stub model | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-perf-perf-and-more-perf) |
| 1,383 MB to 126 MB | peak private memory added by a ten-client batch, Node against Rust in process | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-perf-perf-and-more-perf) |
| ~136.3 billion tokens | tokens spent on the port, including ~130.6 billion tokens of cached input reads | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-the-port-cost) |
| ~$120,000 | monetary bill for those tokens | measured | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-the-port-cost) |
| roughly 3 weeks | the lead developer's time on the port, from the port's share of their pull requests | self-estimate | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-the-port-cost) |
| a year or two | what the work would have taken a whole team before agents | self-estimate | [post](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/) |

## What worked

- The in-place swap kept main shippable and let the rest of the team keep working; each release
  carried a small, known set of ports, which made regressions easy to trace
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-in-place-porting-strategy)).
- Two pilot pull requests set up the workspace, CI, lint rules and interop patterns on pure,
  well-tested helpers; the order then ran from leaf components inward, with session orchestration
  last ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-getting-going)).
- The compiler was a fast feedback loop: most errors were ordinary typing mistakes, and 87.1% of
  4,478 `cargo check` runs came back clean, which the author ties to small edits and constant
  recompiling ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-yes-static-analysis-helps)).
- Subagents explored in parallel while the main agent kept the edits; child sessions in separate
  worktrees did the parallel porting; one chat session acted as a build lock for several porting
  sessions ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-working-with-agent-fleets)).
- A stable prompt prefix kept the cache hit rate high, which the author says is what made long
  autonomous sessions affordable
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-it-s-all-about-caching)).
- Repeated failures were turned into standing instructions, skills, evals and harness changes
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-automating-the-inner-loop)).

## What went wrong

- The first plan counted about 130,000 lines of TypeScript; about 430,000 lines passed through the
  port, because code moved down from the UI layer and colleagues kept adding TypeScript during the
  port ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-what-it-looked-like-before)).
- Dozens of regressions, all of which compiled: numbers typed as floats that strongly typed SDKs
  rejected, JavaScript falsy defaults ported with different semantics, ambient behaviour (time
  zone, environment, a Windows window flag) that Node had supplied silently, paired operations
  ported only on one side, lifecycle and ordering bugs, missed features, library differences
  (one caused an infinite loop at startup), changes lost in rebases, and slower code
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-the-regressions)).
- One port dropped SDK callbacks and deleted their end-to-end test; another time an agent applied
  the waiver label that silences the schema check instead of restoring a lost method. Human review
  caught the second case before merge
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-automating-the-inner-loop)).
- Early prompts such as "port component X" were read as the hot paths only; the agents treated
  input and output and orchestration as out of scope until the end state was spelled out
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-lessons-learned)).
- Two parallel sessions, one porting bottom-up and one top-down, met at the most connected file;
  after its peer refused to integrate several times, one session merged the other's worktree on
  its own. The author blames his own partitioning. Fifteen agents building at once also froze his
  laptop ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-working-with-agent-fleets)).
- Each time the author let the agents redesign or optimise during the port, it cost more
  regressions, time or tokens
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-lessons-learned)).
- **Not reported:** the exact regression count and how many reached a stable release; review
  hours of the other engineers; the main-thread model mix (shown only in a chart). The benchmark
  table and the text disagree: the table gives 292 ms and 20.93 s where the text and chart give
  55.3 ms and 120.0 lifecycles per second
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-perf-perf-and-more-perf)).

## Practices to copy

- Port in place, one component per pull request: replace it with a thin shim into the new code and delete the old code in the same change.
- Make the end-to-end tests the oracle, strengthen them before you start, and forbid the agent to edit them without consent.
- Put escape hatches (waiver labels, snapshots, compatibility baselines) behind human approval so the agent cannot redefine correctness.
- Pilot the pipeline on pure, well-tested leaf components first, then port from the leaves inward.
- State the full end state in the prompt (for example, no TypeScript left in the runtime), not just the component to port.
- Translate first and redesign later; keep agents away from opportunistic fixes during the port.
- Ship each port in a pre-release first so every release carries a small, known set of changes.
- Have several models compare old and new code line by line; keep human review for architecture, contracts and risk.
- Give parallel agent sessions one coordinator and a build lock, and keep heavy builds out of child sessions.
- When a failure shows up twice, turn it into a standing instruction, skill, eval or harness change.
- List the source language's implicit behaviour (number types, falsy defaults, time zone, environment, platform flags) before porting.
- Make the build and test inner loop fast and safe for several worktrees at once before scaling agents.

## In their words

> "Porting code is easy. Making it correct is hard."
> — Stephen Toub, GitHub, [2026-09-16](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-the-regressions)

## Context

- Model era: May to August 2026, mixed vendors chosen per slice; the subagent mix was led by
  Claude Opus 4.8, GPT-5.6 Sol, Claude Haiku 4.5 and GPT-5.5
  ([source](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/#h-model-selection)).
- Related: a pipeline that migrates file by file with retries,
  [Airbnb Enzyme to RTL](2025-04-01-airbnb-enzyme-to-rtl.md); verifiers and an LLM judge around
  an agent, [Spotify Honk](2025-11-06-spotify-honk.md).
