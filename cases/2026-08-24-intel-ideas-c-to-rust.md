---
title: Intel's IDEAS harness ports the libgit2 command-line client from C to safe Rust
date: 2026-08-24
company: Intel
summary: An LLM harness turned 112K lines of C into safe Rust that compiled but crashed; 8 person-hours guiding an agent got git blame working.
source_url: https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html
also: []
source_type: engineering-post
author_relation: seller-of-tool
evidence: shown-in-source
kind: language
from: C (libgit2 command-line client)
to: safe Rust (no unsafe code)
size: about 112,000 lines of C
duration: unstated
people: unstated
cost: ~$0.55 per symbol for translation (total unstated), plus ~$6.5 for repair
ai_share: most
tools: [IDEAS, rust-bindgen, Rust compiler, VS Code Copilot agent mode, KISS agent framework, cargo-llvm-cov, Docker]
models: [Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, GPT-5.6 Sol, Claude Mythos Preview]
period: unstated
outcome: partial
status: current
superseded_by:
---

# Intel's IDEAS harness ports the libgit2 command-line client from C to safe Rust

Intel researchers working in DARPA's TRACTOR program built IDEAS, an open-source harness that
calls an LLM one C symbol at a time and keeps every other decision in ordinary code. On the
libgit2 command-line client it produced about 116,000 lines of Rust with no `unsafe` code that
compiled, yet `git blame` and other commands crashed at once. With 8 person-hours of developer
guidance and about $6.5 of extra model cost, a coding agent fixed a wrong pointer comparison and
shims replaced stubbed and missing functions, until the official benchmark script ran without
crashing. On a battery of 80 test projects, the
best model passed 99.4% of tests with test feedback
([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).

## Source

A post on Intel's security blog by two researchers of Intel's CTO team, one of them Intel's
principal investigator for DARPA TRACTOR, dated 2026-08-24. Intel sells nothing in it, but it
presents IDEAS, Intel's own open-source translator
([repository](https://github.com/IntelLabs/IDEAS)), and closes by pointing to Intel's memory
tagging hardware, so the case is rated as a tool author's. The method is shown: the harness,
its ranking code and its prompt are public, and the test format follows DARPA's public test
corpus. The libgit2 figures are stated without logs or the translated code. The work is funded
by DARPA. The full text of the page was not archived (the site refuses automated reading), so
our checks for copied wording and for the numbers ran against notes taken while reading it.

## What was migrated

The command-line client of libgit2 (its `src/cli` folder), a C implementation of git commands,
about 112,000 lines of C
([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
The goal was Rust with no `unsafe` code at all, not a line-by-line copy. libgit2's own test
suite was left out on purpose: the team wanted to learn whether a developer could cheaply repair
an automatic, memory-safe rewrite. A second set of results covers the second TRACTOR battery: 80
small C test projects from MIT Lincoln Laboratory, each between 150 and 3,000 lines, built around
void pointers, manual memory management, comparisons of raw pointers, and pointers to functions.

## Who did what

- **AI:** Claude Opus 4.6 translated each C symbol (function or type), or each group of symbols
  that use each other, into safe Rust, and wrote the bodies of the C-compatible wrappers. Claude
  Sonnet 4.6, run as an agent inside VS Code Copilot, found the pointer bug and, with developer
  guidance, the repair shimmed the missing functions (the post does not name who wrote each
  shim). GPT-5.6 Sol produced the post's example of one data-structure translation, with
  converters and a round-trip test; GPT-5.4 and Claude Sonnet 4.6 translated the battery's
  projects; Claude Mythos Preview wrote equivalence tests as an autonomous agent. Basis for
  `ai_share`: the post says every part of the output came from the LLM call, the only
  non-deterministic step.
- **Rule-based tools:** everything around the model call. Each agent runs in a sandbox: the
  project's README warns that without it agents could read earlier translation attempts and be
  swayed by them, and notes that its lighter sandbox mode leaves network access open
  ([repository](https://github.com/IntelLabs/IDEAS)). IDEAS analyses the build and the code,
  picks the context for each symbol (nearby functions in full, others as signatures, C callers
  ranked by their hardest constructs, void pointers first), and walks the symbols in dependency order. Every
  module carries a compiler setting that rejects `unsafe` code; failed builds are retried up to a
  set limit. rust-bindgen generates each wrapper's signature, and an answer whose signature
  differs from it is rejected. When tests exist, a mixed C and Rust build runs them after each symbol, and a
  failure sends that symbol back for a fresh translation; for libgit2 no tests were used.
- **People:** built the harness and its rules; for libgit2, one or more developers guided the
  repair agent over four sessions, reading its reasoning, for 8 person-hours in total
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)). The battery's
  expert-written tests: author not stated; the projects come from the MIT Lincoln Laboratory
  evaluation team.

## How it was checked

For libgit2, the compiler was the only check during translation, so the Rust built and was free
of `unsafe` code but was not equivalent to the C. After repair, the official libgit2 benchmark
script ran without crashing and `git blame` on the git repository gave output identical to the
C version. Whether libgit2's own test suite was run afterwards is not stated. For the
battery, expert-written tests compared C and Rust behaviour; some projects have a single test,
and the tests cover defined behaviour only
([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| about 112,000 lines | C code of the libgit2 command-line client given as input | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| about 116,000 lines | safe Rust produced (elsewhere the post gives 120,000 lines) | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| about 4,600 symbols (functions, types) | C symbols translated, in dependency order | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 133 symbols (functions, types) | the largest cycle of mutually dependent symbols, done in one go | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| about $0.55 per symbol | average model cost of translating one symbol | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 4 attempts | most consecutive failed attempts before any merged symbol compiled | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| about 6.5 USD | extra model cost of the repair | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 8 person-hours | cumulative human time spent guiding the repair | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 4 sessions | prompting sessions of the repair | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| about 3,500 tokens | length of the translation prompt | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| up to 3,500 lines | largest C project in the test-generation experiment (cJSON) | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 80 test projects | C projects in the second TRACTOR battery, each between 150 and 3,000 lines | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 87.8% and 63 of 80 test projects | GPT-5.4, one shot: share of tests passed, and projects passing all their tests | measured | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 92.1% and 70 of 80 test projects | GPT-5.4 with test feedback during translation: the same two measures | measured | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 99% and 73 of 80 test projects | Claude Sonnet 4.6, one shot: the same two measures | measured | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 99.4% and 75 of 80 test projects | Claude Sonnet 4.6 with test feedback: the same two measures | measured | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 88.28% average, 91.18% median | branch coverage reached by agent-written tests over 68 sessions, one per C library | measured | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 13.2 USD average, 4.2 USD median | model cost of test generation per library | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |
| 10 of 10 retries | runs in which GPT-5.6 Sol typed one example void-pointer field (`hash_table`) correctly given the chosen context | reported | [post](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html) |

## What worked

- Keeping the model on a short leash, by design: it translates one symbol at a time, with context
  chosen by fixed rules, which is meant to stop it drifting in strategy or wasting calls; the
  authors chose this over a complex multi-agent design (the post gives no measure of the effect)
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Letting the compiler enforce safety: with `unsafe` forbidden in every module, the roughly 116,000
  lines of output were all safe Rust, and no merged symbol had more than 4 failed attempts back
  to back before compiling; the authors credit the compiler's error messages more than the translation
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Fixing the signature in code: bindgen writes each wrapper's signature and the model only fills
  the body; any answer with a different signature is rejected (how often is not given)
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Cheap repair of the safe rewrite: 8 person-hours and about $6.5 of agent time let the client
  run the benchmark script without crashing and reproduce `git blame` exactly
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Test feedback during translation raised both models on the battery: GPT-5.4 from 63 to 70 test
  projects fully passing, Claude Sonnet 4.6 from 73 to 75 test projects
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Agent-written equivalence tests, at about 13.2 USD per library on average, served as well as
  expert-written ones when fed back into translation on the battery, by the authors' account
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).

## What went wrong

- The first libgit2 translation compiled and was free of `unsafe` code, but was not equivalent:
  `git help` worked while `git blame` and other commands crashed at once. The authors say a clean
  build mainly shows how good the compiler's error messages are, not the translation's quality
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- The model had silently changed meaning: it compared two pointers by address where the C
  compared their contents, a safe line that always returned false; a one-line fix let `git blame`
  get further.
- The model left several file-system functions as stubs, and the object database backend lacked
  a write-stream function and others; the repair shimmed them in. The authors call stubs
  a sign of a deeper problem: with only compiler feedback, a stub passes easily, and catching
  it without per-function tests is still unsolved.
- On the battery, GPT-5.4 fully passed only 63 of 80 test projects in one shot and 70 of 80 test projects with
  feedback; even the best run left 5 test projects failing
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- Model-written data-structure translations and their own round-trip tests can game the check
  (empty converters, tests that always pass); the authors say that risk remains.
- Test generation often cannot reach full coverage through a library's public functions; two
  low-coverage libraries stopped early for that reason, which the authors confirmed by hand.
- Limits the authors list: firmware and code that calls hardware or assembly cannot be safe Rust;
  platforms without Rust's standard library or compiler need extra work; the test agent ran on projects of up
  to 3,500 lines, and millions of lines, or single-file amalgamations such as SQLite, call
  for a dependable way to split the code, and how existing per-file harnesses would handle such
  amalgamations is an open question
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- The C-compatible layer and the data-structure helpers may use `unsafe`; the final step that
  removes them also drops compatibility with the C interface
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).
- **Not reported:** whether libgit2's own test suite passes after repair; whether the shims are
  complete implementations; how symbols are checked when a project has no tests; how many commands were
  checked beyond the benchmark script and `git blame`; the total translation cost or time (only a
  per-symbol average); how many symbols needed retries or how often signatures were rejected; any measure behind the
  claim that shortening context does not hurt quality; whether the Rust is idiomatic or
  maintainable (the authors list idiomatic output as an open question); which 68 libraries the
  test agent ran on and their coverage one by one (only in an image); a link to the test
  harness the post says is online; whether the translated code is published. The post gives 116,000 and 120,000
  lines for the same output without explanation
  ([source](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html)).

## Practices to copy

- [stated] Let fixed code choose the context, output place and order; call the model only to translate one symbol or one cycle of symbols. ([Controlled, Granular Translation](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [stated] Forbid unsafe code in every target module so the compiler, not review, rejects any unsafe answer. ([Safe Rust translation](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [stated] Generate interface signatures with a binding tool and reject any model answer whose signature differs. ([C FFI Wrappers](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [stated] Test a mixed old and new build after each translated symbol and retranslate the symbol from scratch on a failure. ([Validating Partial Translations](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [stated] Translate data structures first, with conversion functions and round-trip tests, since later code depends on them. ([Data Structure Translation](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [stated] Give the model the callers that use the hardest pointer patterns first when the context budget is small. ([Controlled, Granular Translation](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [ours] Treat a clean build of a translation as no evidence of behaviour; run real commands or equivalence tests before calling it done. ([Translating Large-Scale Codebases](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [ours] Scan the translated code for stubs and empty bodies before testing, since compile-only feedback lets them through. ([Open Challenges](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))
- [ours] When a model writes both the code and its tests, check the tests can fail, for example against a deliberately broken version. ([Data Structure Translation](https://www.intel.com/content/www/us/en/security/security-practices/blogs/ideas-for-tractor.html))

## Context

- Model era: Claude Opus 4.6 for the libgit2 translation, Claude Sonnet 4.6 for its repair; the
  post does not date the work. Claude Mythos Preview was reached through Intel's part in Project
  Glasswing.
- Program: DARPA TRACTOR funds the work; the battery's test format follows its
  [public test corpus](https://github.com/DARPA-TRACTOR-Program/PUBLIC-Test-Corpus).
- Related: an agent-driven port to Rust that used end-to-end tests as its oracle from the start,
  [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md); a per-file
  pipeline with validation gates and retries,
  [Airbnb Enzyme to React Testing Library](2025-04-01-airbnb-enzyme-to-rtl.md).
