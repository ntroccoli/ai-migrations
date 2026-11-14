---
title: Ladybird ports its JavaScript engine front end from C++ to Rust with Claude Code and Codex
date: 2026-02-23
company: Ladybird
summary: One engineer steered Claude Code and Codex to port LibJS's lexer, parser and bytecode generator to Rust in about 2 weeks, with identical output to C++.
source_url: https://ladybird.org/posts/adopting-rust/
also: [https://github.com/LadybirdBrowser/ladybird/pull/8104]
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: language
from: C++ (LibJS lexer, parser, AST, scope analysis and bytecode generator)
to: Rust (one crate linked into LibJS through a C interface)
from_languages: [C++]
size: about 25,000 lines (the Rust side)
duration: about 2 weeks
people: 1 engineer directing the agents; 2 people left review suggestions and 1 posted a Windows build fix on the pull request
cost: unstated
ai_share: most
tools: [Claude Code, Codex, test262, Ladybird regression tests, LIBJS_COMPARE_PIPELINES lockstep mode, Corrosion, Cargo, CMake]
models: [unstated]
period: 2026-02
outcome: completed
status: current
superseded_by:
---

# Ladybird ports its JavaScript engine front end from C++ to Rust with Claude Code and Codex

Ladybird, a web browser, began moving from C++ to Rust with the front half of its
JavaScript engine, LibJS: lexer, parser, syntax tree and bytecode generator. Its founder, Andreas
Kling, did the translation with Claude Code and Codex in hundreds of small prompts, deciding what to
port, in which order and how the Rust should look, then had other models review the result for
mistakes. The goal was output identical byte for byte to the C++ pipeline. After about 2 weeks the
Rust side came to about 25,000 lines; both pipelines gave identical syntax trees and bytecode, with
0 regressions on 52,898 test262 tests and 12,461 Ladybird tests. The author says the code reads as
translated C++ and is not idiomatic Rust
([source](https://ladybird.org/posts/adopting-rust/#results)).

## Source

A post on Ladybird's website by Andreas Kling, the project's founder and president, who did the
port himself; it links the pull request that merged it, which is archived as the second part of
the source ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)). Ladybird is a browser
project that sells no AI tool; Claude Code and Codex are named and linked, with no
partnership stated. The post states its test counts and the lockstep check without logs or
benchmark data, so its numbers are assertions; the merged code is public and carries the
comparison mode, so a reader could rerun the method. It names no model, no token count and no cost. The post and the pull request description
share most of their wording; this case cites each claim from the part that says it.

## What was migrated

The source-to-bytecode half of LibJS: the lexer, parser, syntax tree, scope analysis and bytecode
generator. The author chose it because these parts stand fairly alone and the test262 conformance
suite covers them widely ([source](https://ladybird.org/posts/adopting-rust/#porting-libjs)). The
Rust code is built through Corrosion, a bridge between CMake and Cargo, and linked statically
into LibJS; the C++ side passes source text over a C interface and receives a filled bytecode
executable back. The C++ pipeline stays in the tree: an environment variable switches back to it,
and another runs the two side by side and aborts on any difference in syntax tree or bytecode
([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).

## Who did what

- **AI:** Claude Code and Codex wrote the Rust translation, prompt by prompt; after the first
  translation, several passes of adversarial review by different models hunted for errors and
  poor patterns ([source](https://ladybird.org/posts/adopting-rust/#porting-libjs)). Basis for
  `ai_share: most`: the post and the pull request say the translation was done with these agents;
  neither gives a share in lines.
- **Rule-based tools:** test262 and Ladybird's own regression tests as the oracle; a lockstep mode
  that compares the two pipelines' syntax trees and bytecode as text dumps; Corrosion and Cargo for
  the build ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- **People:** the author directed the agents in hundreds of small prompts, chose the parts to port and
  their order, and set the shape of the Rust code
  ([source](https://ladybird.org/posts/adopting-rust/#porting-libjs)). In the same pull request,
  commits under his name made the C++ pipeline's output deterministic, added text dumps of trees
  and bytecode, fixed several C++ lexer, parser and scope bugs, added tests written alongside the port,
  and wired the Rust toolchain into CI and the Flatpak build; the source does not say whether
  agents wrote those commits. Two other people left a review suggestion each and one approved it;
  the pull request merged about 21 hours after it opened
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).

## How it was checked

From the start, the two pipelines had to give the same output, byte for byte. The author says every
syntax tree from the Rust parser equals its C++ counterpart and every bytecode from the Rust generator
matches the C++ output; test262 and Ladybird's regression tests showed no regressions, and the JS
benchmarks the project tracks showed no slowdown. Beyond the suites, he browsed the web with both
pipelines running in lockstep, checking that every script that passed through them gave identical
output ([source](https://ladybird.org/posts/adopting-rust/#results)). To make that comparison
possible, a commit in the pull request sorted hash-map iteration in scope analysis and made
register allocation always take the lowest free register, since the C++ output had varied between
runs ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| about 25,000 lines | Rust code produced by the port | reported | [post](https://ladybird.org/posts/adopting-rust/#results) |
| about 2 weeks | time for the whole port | reported | [post](https://ladybird.org/posts/adopting-rust/#results) |
| multiple months | the author's estimate of the same work by hand | self-estimate | [post](https://ladybird.org/posts/adopting-rust/#results) |
| 52,898 tests, 0 regressions | test262 conformance tests run against the Rust pipeline | reported | [post](https://ladybird.org/posts/adopting-rust/#results) |
| 12,461 tests, 0 regressions | Ladybird regression tests run against the Rust pipeline | reported | [post](https://ladybird.org/posts/adopting-rust/#results) |
| +30,550 and -444 lines in 162 files | size of the merged pull request, as GitHub counts it | measured | [PR](https://github.com/LadybirdBrowser/ladybird/pull/8104) |
| 13 commits | commits in the pull request, all by the author | measured | [PR](https://github.com/LadybirdBrowser/ladybird/pull/8104) |

## What worked

- Picking a first target that is self-contained and widely covered by a public conformance suite
  gave the port a ready oracle ([source](https://ladybird.org/posts/adopting-rust/#porting-libjs)).
- Demanding identical output, not just passing tests, made every difference a failure: syntax
  trees and bytecode were compared directly, the suites showed 0 regressions, and lockstep
  browsing extended the check to real web scripts
  ([source](https://ladybird.org/posts/adopting-rust/#results)).
- Preparing the old pipeline for comparison paid off: its output was made deterministic and
  dumpable before the Rust code arrived, and the comparison mode shipped in the merged code
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- With this steering, the port took about 2 weeks against the author's estimate of multiple
  months by hand ([source](https://ladybird.org/posts/adopting-rust/#results)).
- Keeping both pipelines in the tree, the C++ one a switch away, let the Rust one become the
  default (except on Windows) without retiring anything
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).

## What went wrong

- The Rust code is not idiomatic: the author says it reads as translated C++, mimics the C++
  register allocation so the bytecode matches, and leaves much to simplify once the C++ pipeline
  can be retired; the cleanup is deferred. The post also ranks matching the C++ pipeline above
  correctness, which comes a close second; so the port keeps whatever the C++ got wrong (our
  reading) ([source](https://ladybird.org/posts/adopting-rust/#results)).
- The pull request names register allocation as the most awkward part: the Rust generator frees
  registers by hand so their reuse order matches C++, which it says looks very strange
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- The Rust pipeline did not work on Windows at merge; it stayed off there and the pull request
  asked for help. A contributor posted a link-library change that built on Windows
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- Some commit messages failed the project's commit-message lint, which a bot flagged
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- After the merge, a commenter called the generated code mediocre and not idiomatic, and
  asked how code from a model squares with the project's independence and with copyright; another
  commenter replied that it is a straight port of Ladybird's own C++. Another asked, without an
  answer there, whether the project will depend on both languages for good
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- The move is a side track, not a switch: C++ development of the engine continues, the porting
  will run for a long time, and the post expects the choice to be controversial
  ([source](https://ladybird.org/posts/adopting-rust/#whats-next)).
- **Not reported:** the models used and how they were chosen; tokens and cost; the exact number
  of prompts, and how many agent outputs were rejected or rewritten by hand; what the adversarial reviews
  found; how the C++ bugs fixed in the pull request were found; how long the lockstep browsing ran
  and on which sites; benchmark figures; any defects found after merge; how closely people
  reviewed the roughly 25,000 lines before the merge
  ([post](https://ladybird.org/posts/adopting-rust/#results),
  [PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).
- **Ours:** the 0 regressions mean equal to C++ on these suites, not free of bugs; and the same
  pull request fixed C++ lexer and parser bugs and edited 42 expected-output test files, so the
  baseline the port matched was itself changed in it
  ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104)).

## Practices to copy

- [stated] Start with a part that stands alone and is covered by a public conformance suite, so the port has an oracle from day one. ([Porting LibJS](https://ladybird.org/posts/adopting-rust/#porting-libjs))
- [stated] Keep the person deciding which parts to port, their order and the shape of the code; steer the agents in many small prompts. ([Porting LibJS](https://ladybird.org/posts/adopting-rust/#porting-libjs))
- [stated] After the first translation, have different models review the code adversarially for errors and poor patterns. ([Porting LibJS](https://ladybird.org/posts/adopting-rust/#porting-libjs))
- [stated] Require output identical to the old pipeline at an internal level (syntax tree, bytecode), not only passing tests. ([Results](https://ladybird.org/posts/adopting-rust/#results))
- [stated] Make the old code's output deterministic and dumpable as text first, so old and new can be diffed exactly. ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104))
- [stated] Ship a mode that runs old and new side by side on real inputs and aborts on any difference, and browse real sites with it. ([Results](https://ladybird.org/posts/adopting-rust/#results))
- [stated] Accept translated, non-idiomatic code while compatibility is the goal; defer the cleanup until the old code retires. ([Results](https://ladybird.org/posts/adopting-rust/#results))
- [ours] Give a large ported change a review plan in proportion to its size; a fast merge with few comments says little about how it was read. ([PR](https://github.com/LadybirdBrowser/ladybird/pull/8104))

## In their words

> "This was human-directed, not autonomous code generation."
> — Andreas Kling, founder and president of Ladybird, [2026-02-23](https://ladybird.org/posts/adopting-rust/#porting-libjs)

## Context

- Ladybird had explored Swift as its memory-safe language before (the post does not describe it
  as an AI port); it says the C++
  interop never got far enough and platform support outside Apple was limited. It had also
  rejected Rust in 2024 as a poor fit for the web platform's object model with garbage collection
  and deep inheritance, and changed its mind after another year
  ([source](https://ladybird.org/posts/adopting-rust/#why-rust)).
- The core team decides further porting, and contributors are asked to coordinate before
  starting any ([source](https://ladybird.org/posts/adopting-rust/#whats-next)).
- Model era: early 2026, with Claude Code and Codex; the post names no model.
- Related: a larger agent-run port of a JavaScript runtime into Rust,
  [Bun Zig to Rust](2026-07-08-bun-zig-to-rust.md); a port that also used a black-box suite as its
  oracle, [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); a solo port
  into Rust steered by one engineer, [Pokémon Showdown to Rust](2026-01-25-vjeux-pokemon-showdown-rust.md).
