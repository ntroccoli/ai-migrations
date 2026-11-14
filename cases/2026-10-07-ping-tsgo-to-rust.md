---
title: Ping.gg ports the Go TypeScript 7 compiler to Rust with coding agents, after a restart
date: 2026-10-07
company: Ping.gg
summary: A Go-to-Rust TypeScript compiler port stalled near 84% after over $400,000 in tokens; a restart reports parity on upstream tests, with known gaps; unaudited.
source_url: https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md
also: [https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md, https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md, https://github.com/pingdotgg/ts-rust/commits/main]
source_type: repo
author_relation: user-of-tool
evidence: assertion-only
kind: language
from: Go (TypeScript 7 native compiler, type checker, language server and API)
to: Rust (tsc-rs)
from_languages: [Go]
size: unstated for the shipped port; the first attempts wrote over 1.3 million lines of Rust
duration: multiple months of first attempts; the restart had 2 weeks of reported spend by 2026-10-07, and work went on after
people: unstated (one author directed the agents and says he read none of the code)
cost: over $420,000 in API-priced tokens in all (over $400,000 first attempts, ~$24,047 restart), self-estimates; the restart ran on flat-rate plans
ai_share: most
tools: [Codex goal loops and subagents, Claude Code, ported Go tests and baselines, conformance gate scripts, AST and diagnostics code generators]
models: [GPT-5.6 Sol, GPT 6 Astra, gpt-5.5, Opus 5.5]
period: 2026-06..2026-10
outcome: ongoing
status: current
superseded_by:
---

# Ping.gg ports the Go TypeScript 7 compiler to Rust with coding agents, after a restart

Theo Browne of Ping.gg set coding agents to port Microsoft's native TypeScript compiler, written in
Go, to Rust: the compiler, type checker, language server and API. By his account, months of Codex
goal loops, mainly with OpenAI models, wrote over 1.3 million lines of Rust at over $400,000 of tokens at API
prices and never passed about 84% compatibility. He then ran Claude Code with Opus 5.5, which
started again from scratch and reached a working first version in 10 hours; by 2026-10-07 the
restart had used 2 weeks and about $24,047 of API-priced tokens. By 2026-10-22, the model-written part
of the README reports output matching Go's on the upstream test corpus, apart from cases Go skips
too, beside a list of known problems. He says he never read the
code. This is one person's unaudited report, not a model benchmark
([source](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go), [warnings](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#warnings),
[later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance)).

## Source

The README of the public ts-rust repository, owned by the Ping.gg organisation on GitHub. The
section that tells how the port went, signed by no name but committed by Theo Browne, entered the
README on 2026-10-07, the day the repository was created on GitHub (our check); since then only one word of it has changed. A line
below that section says everything after it was written by the author's models, so every later section is
model-written: what the port is, the second install section, status, known problems,
conformance, the benchmarks and development; we cite them from the later README of
2026-10-23, whose rewritten warning claims full compatibility on every real project tested, beside
a list of known problems. An unsigned history page (`docs/history.md`, text that sat in the README until just before the
first preview; the source does not say who wrote it) covers the first runs
([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md),
[later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md),
[history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md)).

Stake, from our check of GitHub, not from the source: the Ping.gg organisation describes itself
as building tools for developers, and its T3 Code repository describes a front end for both
Claude Code and Codex ([organisation](https://github.com/pingdotgg)), so it has a stake in both vendors' agents rather than one; the source does
not say whether T3 Code ran the port. We found no sponsorship of the work by either model vendor
in the repository, and the source states none; whether one exists is unknown. The author paid for
the restart through his own Claude plans. The cost, time and compatibility figures for the two
phases are stated, not shown, and nobody outside checked them. The two phases differ in model,
agent harness, starting state and what the author had already learned, so they do not measure
one model against another.

## What was migrated

TypeScript 7's native compiler, which Microsoft wrote in Go (formerly typescript-go): command line,
type checker, emitter, language server and API. The aim was a direct port that keeps Go's
algorithms and behaviour, the same command line and the same outputs, so Go at a pinned upstream
revision could serve as the reference. The port also carries the Effect plugin's diagnostics and editor features, ported from the Go version of that plugin, and ships as an npm package
([later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#what-actually-is-this)).

## Who did what

- **AI:** in the first phase, mainly OpenAI models in Codex goal loops with subagents wrote the code; the
  README names GPT 6 Astra and GPT-5.6 Sol, while the history page says 236 logged
  turns of the original work carry an earlier, unnamed model's label, one turn gpt-5.5 and only a short resume gpt-5.6-sol. In the
  restart, Opus 5.5 in Claude Code wrote a new port from scratch and kept going for 2 weeks. Models
  also wrote the README below its dividing line. Basis for `ai_share: most`: the author says he has not
  read any of the code
  ([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go), [warnings](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#warnings),
  [history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-model-experiment)).
- **Rule-based tools:** generators that write the syntax-tree data and the diagnostics catalogue,
  the ported Go test suite and baselines, and the gate scripts that compare the port with Go; the
  source does not say who wrote the generators and scripts
  ([later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#development)).
- **People:** the author chose the models, started the loops and decided to let the restart run;
  he did not read the code. The model-written sections say "we" without naming anyone else.

## How it was checked

By the model-written status and conformance sections, each release targets a single pinned
upstream revision and is compared with Go built there; a
difference Go also shows is counted as upstream behaviour. Each revision runs the checks on the
project's own machines, not in GitHub CI, and is accepted only if no earlier passing result is
lost. At the revision of 2026-10-22, diagnostics matched Go on 13,728 of 13,728 compiler test
configurations and emitted output on 13,654 of 13,654 checks, byte for byte, leaving out what Go's own test run skips; 186,890 tests passed
with no failures; 243,771 language-server calls matched with no differences; and 4 of 112,740 API
calls differed, in the file-system callbacks only. Calls where Go's own answer changed between two
runs, and language-server requests with nothing to resolve, were left out of both columns
([status](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#status),
[conformance](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance)).
On 120 open-source repositories, the command-line output matched Go's except for the listed
known problems and where Go's output varies by run
([later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#status)).
The source does not say how the first phase's compatibility figure was measured.

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| over $420,000 | tokens for the whole project, priced at API rates | self-estimate | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md) |
| over $400,000 | tokens at API prices spent on the first phase | self-estimate | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| over 1.3 million lines | Rust written in the first phase | reported | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| about 84% | compatibility the first phase never passed (measure not defined) | reported | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| 10 hours | time for the restart to reach a working first version | reported | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| ~$24,047 over 2 weeks | API-priced tokens spent on the restart | self-estimate | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| 925% to 983% | share of the weekly limits of a $200 plan used by the restart | self-estimate | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go) |
| ~$20k | what the author thinks the port could have cost, pointing to his account of the restart | self-estimate | [README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md) |
| 216,048,506 tokens | new input and output tokens (cache reads excluded) counted by Codex for three goal runs from June 22 to July 8 | measured | [history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026) |
| 70 failing tests | found by an audit of the first broad goal run | reported | [history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026) |
| 2.6 to 3.4x slower | first broad run's compiler against Go for the same work | reported | [history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026) |
| 13,728 of 13,728 test configurations | compiler test configurations whose diagnostics match Go (model-written section) | measured | [later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance) |
| 186,890 tests | ported Go tests and the project's own tests passing, none failing (model-written section) | measured | [later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance) |
| 4 of 112,740 calls | API calls whose callbacks differ from Go (model-written section) | measured | [later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance) |
| about half the time | type checking against Go across 60 open-source projects (geometric mean; model-written section) | reported | [later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#status) |
| 2.10x | speed of tsc-rs against tsc 7 across six apps (geometric mean; model-written section) | measured | [later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#benchmark-real-world-apps) |

## What worked

- By the author's account, the restart reached a working first version in 10 hours and got further
  than the first phase in a tenth of the time, without reusing the first phase's code
  ([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go)).
- Keeping Go's algorithms and pinning one upstream revision let Go's own output act as the
  reference; the model-written README reports that the port matches it on the upstream test corpus, except cases Go also skips, and on two real
  libraries checked in full
  ([later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance)).
- The model-written README reports the port faster than the Go compiler it copies: 2.10x across six apps, and about half Go's
  time on 60 projects with a tuned build faster than the npm packages, with the same diagnostics
  ([later README](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#benchmark-real-world-apps)).
- In the first phase, narrowing the goal to a small, explicit contract with its own oracle and
  gates gave the only goal run that completed
  ([history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026)).

## What went wrong

- By the author's account, the first phase ran for months, wrote over 1.3 million lines and cost over $400,000 of
  tokens at API prices without getting past about 84% compatibility; its code was not used
  ([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go)).
- Its first broad run spread hundreds of commits over many parts of the compiler before the parity
  checks could be trusted; an audit then counted 70 failing tests, the compiler ran 2.6 to 3.4x
  slower than Go, and the run was paused. A later checker goal widened the scope again, never showed full
  parity with Go, and stopped before it was cleaned up and verified
  ([history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026)).
- Which model wrote which code in the first phase is unclear: the README and the history page name
  different models, and the history page says 236 logged turns of the original work carry an
  earlier model's label
  ([history](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-model-experiment)).
  Our count of the public history adds that commits with a Claude co-author line appear in July
  2026 (19 commits) and September 2026 (1,027 commits), while the restart's 2 weeks of spend
  reported on 2026-10-07 reach back only to late September; commits without a co-author line,
  every commit of August 2026 among them, cannot be attributed
  ([commits](https://github.com/pingdotgg/ts-rust/commits/main)).
- The restart was not cheap either: about $24,047 at API prices, or 925% to 983% of the weekly
  limits of a $200 plan
  ([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go)).
- When published, the README called the port an early release, not yet able to replace tsc in
  every project, and the author said he did not know whether it would work; its model-written
  sections listed that build mode in watch could stop on an internal error and that there were no
  Windows or Linux arm64 builds
  ([warnings](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#warnings), [install](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#install),
  [builds](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#install-1), [known problems](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#known-problems)).
- The model-written sections list known differences: extra output and a rootDir error in some monorepos, stale or missing
  output, sometimes compile errors, in build mode without project references, editor memory that grows slowly over long edit
  sessions, 4 API calls whose callbacks differ and one allowed gate item; the test suite also skips
  3,637 test names, among them 1,906 Go baseline files with no ported test to compare them
  ([conformance](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance),
  [known problems](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#known-problems)).
- The account is one person's, self-reported and unaudited. The author says he read none of the
  code, and the source names no other reviewer.
- **Not reported:** how the compatibility figure was measured and against which revision; the
  token counts and prices behind each dollar figure; what the restart reused besides code (tests,
  specs, harness, the author's prompts); the agent setup and prompts of either phase; the people's
  hours; how the first phase was stopped and why so late; how many restart runs were discarded;
  who uses the port, and defects found by users after release.

## Practices to copy

- [stated] Pin the port to one upstream revision and compare with the original built there; count a difference the original also shows as upstream behaviour. ([Status](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#status))
- [stated] Keep the original's algorithms and behaviour so its output can be the oracle, compared byte for byte. ([Conformance](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance))
- [stated] Accept a revision only when no earlier passing result is lost across corpus, tests, language server and API checks. ([Conformance](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance))
- [stated] Leave out of the comparison the cases where the original's own answer changes between runs, and say how many. ([Conformance](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/README.md#conformance))
- [ours] Build the parity harness before porting broadly; breadth landed first in the first run, and its scope had to be cut back after an audit. ([History](https://github.com/pingdotgg/ts-rust/blob/704a83520fef65f080c944c1a21581cf5eb4401e/docs/history.md#the-first-goal-runs-june-to-july-2026))
- [ours] Define the compatibility measure and a stop rule before a long agent run; one attempt sat below its mark for months. ([Account](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go))
- [ours] Report agent spend with its price basis; API-list prices and flat-rate plan usage give different bills for the same work. ([Account](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go))

## In their words

> "Also worth mentioning: I've never read a line of this code."
> — Theo Browne, author of ts-rust, Ping.gg, [2026-10-07](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#warnings)

## Context

- Model era: OpenAI models in Codex from June 2026 to some point before the restart; Opus 5.5 in
  Claude Code for the 2 weeks of spend reported on 2026-10-07. The model difference between the phases is
  confounded with the harness, the starting point and the author's experience; read it as an era
  marker, not a comparison
  ([README](https://github.com/pingdotgg/ts-rust/blob/c1e5e5cd3f77aa491488690400ae445e00c292b5/README.md#how-did-this-go)).
- Our count of the public history, not the source's: its first commit is dated 2026-06-22; commits
  with a Claude co-author line appear from July 2026 and make up most commits from September 2026;
  no commit names an OpenAI model, and commits without a co-author line cannot be attributed
  ([commits](https://github.com/pingdotgg/ts-rust/commits/main)).
- Related ports to Rust with an existing test suite as the oracle:
  [Bun Zig to Rust](2026-07-08-bun-zig-to-rust.md) and
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md).
