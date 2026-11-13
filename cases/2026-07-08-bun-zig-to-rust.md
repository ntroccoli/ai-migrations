---
title: Bun moves its JavaScript runtime off Zig onto Rust with Claude agents in 11 days
date: 2026-07-08
company: Bun
summary: One engineer ran about 50 Claude Code workflows, up to 64 agents at once, to port 535K lines of Zig to Rust in 11 days; 19 known regressions, all fixed.
source_url: https://bun.com/blog/bun-in-rust
also: []
source_type: engineering-post
author_relation: seller-of-tool
evidence: shown-in-source
kind: language
from: Zig (Bun runtime, bundler, package manager, test runner)
to: Rust (about 100 crates)
size: 535,496 lines of Zig (comments excluded) in 1,448 files
duration: 11 days (2026-05-03 to the merge on 2026-05-14, per the post)
people: 1 engineer
cost: ~$165,000 at API list prices for the tokens used before merge (690 million output tokens, 5.9 billion fresh input tokens, 72 billion cached input tokens)
ai_share: most
tools: [Claude Code dynamic workflows, cargo check, Bun test suite, Buildkite CI, systemd-run, LeakSanitizer (after merge), Claude Code Security (after merge)]
models: [Claude Fable 5 (pre-release version), unstated]
period: 2026-05
outcome: completed
status: current
superseded_by:
---

# Bun moves its JavaScript runtime off Zig onto Rust with Claude agents in 11 days

Bun's creator, Jarred Sumner, moved its runtime, 535,496 lines of Zig, to Rust to get compiler-checked memory
safety against a stream of use-after-free crashes and leaks. Sumner chose a faithful, all-at-once
translation that keeps the Zig design, guided by a porting guide and a per-field lifetime table
that Claude drafted and reviewed. About 50 agent workflows in Claude Code, up to 64 agents at a
time, wrote each file, fixed about 16,000 compiler errors, then fixed failing tests until the
existing TypeScript test suite passed on six platforms. Each change went to two or more reviewer
agents. The port merged after 11 days at about $165,000 in API tokens at list price; 19
regressions surfaced later and were fixed, and v1.4.0 was still a canary build when the post
appeared ([source](https://bun.com/blog/bun-in-rust)).

## Source

A post on Bun's blog by Jarred Sumner, Bun's creator, who ran the port. The post opens
with a disclosure: Anthropic acquired Bun in December 2025 (announced in
[Bun is joining Anthropic](https://bun.com/blog/bun-joins-anthropic), 2025-12-02), the author and other
Bun team members are Anthropic employees, and the port used a pre-release Claude model. Anthropic
sells the tools the case used: Claude models, Claude Code (whose dynamic workflows ran the agents)
and Claude Code Security; the post links the model's announcement and the security product's page,
and Claude Code itself runs on Bun. So this is a seller's case. The post shows much of its data:
hourly commit charts mined from the port branch, CI build results mined from Buildkite, test
counts per platform, benchmark tools and hardware, and the commits and issues behind each example;
the code is public. Its cost and effort figures are stated, not shown
([source](https://bun.com/blog/bun-in-rust)).

## What was migrated

Bun, a JavaScript runtime that also bundles, transpiles, installs npm packages and runs tests,
written in Zig since 2021, with about 20% of its code in C++ and embedded C and C++ libraries
(JavaScriptCore, BoringSSL, SQLite and others) that stayed as they were. The aim was a
mechanical port with as few behaviour changes as possible, keeping the same architecture and data
structures, so that the existing test suite, written in TypeScript and so independent of the
implementation language, could judge it. Turning the result into idiomatic Rust was left for
later. The single Zig compilation unit was split into about 100 Rust crates
([source](https://bun.com/blog/bun-in-rust#why-rust)).

## Who did what

- **AI:** Claude Fable 5, in a pre-release version, used for much of the port (the post does not
  name a model for the rest), run through about 50 agent workflows (Claude Code dynamic
  workflows). It wrote the porting guide (`PORTING.md`) from a conversation with Sumner, proposed a
  lifetime for every complex struct field (`LIFETIMES.tsv`), translated each `.zig` file, fixed the
  compiler errors crate by crate, fixed crashes and failing tests, and did later cleanup passes.
  Each step had one implementer, two or more adversarial reviewers, and one fixer
  ([source](https://bun.com/blog/bun-in-rust#loops-that-write-review-code)).
- **Rule-based tools:** `cargo check` produced the error lists that fed the queue; Bun's existing
  test suite (with over a million assertions) and Buildkite CI on six platforms were the oracle;
  `systemd-run` cgroups isolated heavy tests. After the merge, an improved LeakSanitizer setup
  tracked native allocations. The post names no rule-based code translator.
- **People:** Sumner (one engineer) decided the approach, spent about 3 hours shaping the porting
  guide with Claude, read the guide and lifetime table, watched the workflows and changed their
  prompts when they went wrong, confirmed by hand that the green tests had really executed, read
  much of the Rust next to the Zig original, and pressed merge. The post describes the code as
  written by Claude (at peak about 1,300 lines per minute, every line reviewed by Claude reviewers)
  and says Sumner fixed the process rather than hand-fixing the code
  ([source](https://bun.com/blog/bun-in-rust#finally-writing-the-code)).

## How it was checked

- The oracle was Bun's existing test suite: the port merged only when it passed in full in CI on
  every platform, with no test skipped or deleted (1,386,826 `expect()` calls in 60,624 tests on
  Debian 13 x64). Sumner reports checking by hand that the tests executed
  ([source](https://bun.com/blog/bun-in-rust#merging-the-rust-rewrite)).
- In the review loop, each change went to two or more reviewer agents in their own context
  windows, given the diff alone and asked to find how it fails; the post shows three memory and
  logic bugs they caught that compiled cleanly. In the trial run, reviewers compared each `.rs`
  file with its `.zig` original and the two guides
  ([source](https://bun.com/blog/bun-in-rust#adversarial-review)).
- Sumner reviewed the reviewers, looking at whether they flagged differences from the Zig and held
  the code to the guides, and read much of the code. The post does not say what share
  of the code a person read ([source](https://bun.com/blog/bun-in-rust#maintainability)).
- After merge: 11 review rounds by Claude Code Security, coverage-guided fuzzing of all parsers
  around the clock, and Miri on part of the code in CI
  ([source](https://bun.com/blog/bun-in-rust#the-work-continues)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 535,496 lines | Zig code before the port, comments excluded | reported | [post](https://bun.com/blog/bun-in-rust#why-rust) |
| 1,448 files | `.zig` files translated to `.rs` files | reported | [post](https://bun.com/blog/bun-in-rust#trial-run) |
| about 50 agent workflows | Claude Code dynamic workflows used for the port | reported | [post](https://bun.com/blog/bun-in-rust#loops-that-write-review-code) |
| 11 days | from the start until every platform passed the full test suite | measured | [post](https://bun.com/blog/bun-in-rust#stats) |
| 4 agent workflows, 16 agents each | peak parallelism: about 64 agents at once, one worktree per workflow | reported | [post](https://bun.com/blog/bun-in-rust#stats) |
| about 1,300 lines per minute | peak rate at which the agents wrote code | reported | [post](https://bun.com/blog/bun-in-rust#finally-writing-the-code) |
| 6,502 commits | port-branch commits, not counting merges | measured | [post](https://bun.com/blog/bun-in-rust#finally-writing-the-code) |
| 695 commits | busiest single hour | measured | [post](https://bun.com/blog/bun-in-rust#finally-writing-the-code) |
| about 16,000 errors | compiler errors once the crate cycles were fixed | reported | [post](https://bun.com/blog/bun-in-rust#compiler-errors-as-a-work-queue) |
| 1,610 commits | commits of the compiler-error phase in one day | measured | [post](https://bun.com/blog/bun-in-rust#compiler-errors-as-a-work-queue) |
| 972 to 23 test files | failing test files in CI, from the first CI run to two days later | measured | [post](https://bun.com/blog/bun-in-rust#get-the-test-suite-passing-in-ci) |
| +1,009,272 lines | lines added in the diff that landed | measured | [post](https://bun.com/blog/bun-in-rust#stats) |
| 1,386,826 `expect()` calls, 60,624 tests | test suite passing on Debian 13 x64 at merge (macOS and Windows ran fewer) | measured | [post](https://bun.com/blog/bun-in-rust#stats) |
| ~$165,000 | the tokens used before merge, priced at API list prices (not money spent) | reported | [post](https://bun.com/blog/bun-in-rust#stats) |
| 5.9 billion tokens | input tokens not served from cache, before merge | reported | [post](https://bun.com/blog/bun-in-rust#stats) |
| 690 million tokens | output tokens before merge | reported | [post](https://bun.com/blog/bun-in-rust#stats) |
| 72 billion tokens | cached input token reads before merge | reported | [post](https://bun.com/blog/bun-in-rust#stats) |
| 3 engineers for about a year | effort the author thinks a manual port would have taken | self-estimate | [post](https://bun.com/blog/bun-in-rust#stats) |
| 19 regressions | known regressions the port introduced, all fixed | reported | [post](https://bun.com/blog/bun-in-rust#porting-mistakes) |
| 11 review rounds | Claude Code Security reviews after merge, findings addressed | reported | [post](https://bun.com/blog/bun-in-rust#the-work-continues) |
| around 15 PRs | fix PRs from round-the-clock parser fuzzing after merge, so far | reported | [post](https://bun.com/blog/bun-in-rust#the-work-continues) |
| 128 bugs | bugs present in v1.3.14 that v1.4.0 fixes, so far | reported | [post](https://bun.com/blog/bun-in-rust#bun-is-better-in-rust) |
| about 4% | share of the Rust code inside `unsafe` blocks when the post was written | measured | [post](https://bun.com/blog/bun-in-rust#the-work-continues) |
| 6,745 MB to 609 MB | memory after 2,000 in-process builds, v1.3.14 against v1.4.0, after the leak-tracking work | measured | [post](https://bun.com/blog/bun-in-rust#we-fixed-every-instrumentable-memory-leak) |
| 3.8 to 6.8 MB | binary size cut by the port's first changes, by platform | reported | [post](https://bun.com/blog/bun-in-rust#smaller-binary-size) |
| ~20% | binary size cut on Linux and Windows from the port plus separate ICU and linker work (v1.4.0 canary) | measured | [post](https://bun.com/blog/bun-in-rust#smaller-binary-size) |
| 2% to 5% | speedup in HTTP throughput and app builds on one Linux x64 machine | measured | [post](https://bun.com/blog/bun-in-rust#2-5-faster) |
| 10% | Claude Code startup gain on Linux (median) after moving to the Rust build | measured | [post](https://bun.com/blog/bun-in-rust#production) |

## What worked

- A faithful translation that mirrors the Zig code let the old test suite judge it; the author says
  the team finds the Rust very close to the Zig they knew. Idiomatic refactoring was deferred
  ([source](https://bun.com/blog/bun-in-rust#maintainability)).
- Up-front prep: a porting guide and a reviewed lifetime for every complex struct field, both
  handed to every agent, then a trial run on 3 files before all 1,448 files
  ([source](https://bun.com/blog/bun-in-rust#prep-work)).
- Separating writer and reviewer: reviewer agents got the diff alone and the job of finding faults.
  They caught use-after-free, invalid-time and eager-panic bugs that compiled
  ([source](https://bun.com/blog/bun-in-rust#adversarial-review)).
- Using the compiler's error list as a to-do queue: about 16,000 errors, grouped by crate, split
  among 64 agents with one `cargo check` at the start of each round
  ([source](https://bun.com/blog/bun-in-rust#compiler-errors-as-a-work-queue)).
- Fixing the process instead of the code: when agents stubbed functions and padded workarounds with
  long comments, one prompt change stopped it within a few hours
  ([source](https://bun.com/blog/bun-in-rust#another-false-start)).
- The author reports gains: `Drop` closed some leaks on error paths; leak tracking added after the
  port cut memory after 2,000 builds from 6,745 MB to 609 MB, a fix an earlier Zig attempt did not
  merge for want of `Drop`; lower stack use; and a 2% to 5% speedup
  ([source](https://bun.com/blog/bun-in-rust#bun-is-better-in-rust)).

## What went wrong

- Agents sharing one checkout broke each other's work within about 2 minutes (one ran
  `git stash`, another `git stash pop`, then `git reset --hard`). One worktree per agent would
  have run out of disk, so agents were limited to committing their own files, with no cargo or
  slow commands; that ran too slowly, so the work was split into 4 worktrees
  ([source](https://bun.com/blog/bun-in-rust#false-starts)).
- A disk-speed setting left at its default on the cloud machine let one slow search stall disk
  reads and writes for minutes at a time
  ([source](https://bun.com/blog/bun-in-rust#finally-writing-the-code)).
- Sumner's pre-port PR to split the code into crates without cycles fell short; two more
  workflows had to classify and move the cyclic code
  ([source](https://bun.com/blog/bun-in-rust#compiler-errors-as-a-work-queue)).
- Told to make every crate compile, agents stubbed out failing functions and wrote long comments
  to excuse workarounds, until a reviewer rule rejected such code
  ([source](https://bun.com/blog/bun-in-rust#another-false-start)).
- The first build did not link, then panicked at start
  ([source](https://bun.com/blog/bun-in-rust#smoke-tests)).
- Leak tests and long integration tests timed out in debug builds; stress tests forced cgroup
  isolation, and the machine still filled its disk and crashed several times
  ([source](https://bun.com/blog/bun-in-rust#even-more-false-starts)).
- The port introduced 19 known regressions, all fixed, mostly code that reads the same in both
  languages but behaves differently: a side effect inside a Rust `debug_assert!` vanished in
  release builds and broke hot reload; a slice cast panicked on odd byte counts; a placeholder
  constant lowered a resolver limit enough for real projects to hit it; colour markers were
  rewritten inside formatted arguments
  ([source](https://bun.com/blog/bun-in-rust#porting-mistakes)).
- After merge, 11 review rounds by Claude Code Security produced findings that had to be fixed,
  and parser fuzzing has produced around 15 fix PRs so far
  ([source](https://bun.com/blog/bun-in-rust#the-work-continues)).
- Merging was not a release: the author did not yet trust it enough to ship, v1.4.0 was a
  canary build when the post appeared (its size figures compare that canary), and the merge PR
  lists optimisation and cleanup still to do
  ([source](https://bun.com/blog/bun-in-rust#shipping)).
- The result is still a Zig-shaped port: about 4% of the Rust code sits in `unsafe` blocks
  ([source](https://bun.com/blog/bun-in-rust#the-work-continues)).
- The post gives two commit counts for the port (6,502 commits on the branch, 6,778 commits
  for the 11 days) without reconciling them; the merge PR's own line count and binary-size range
  differ slightly from the post's ([source](https://bun.com/blog/bun-in-rust#stats),
  [PR](https://github.com/oven-sh/bun/pull/30412)).
- **Not reported:** how much of the code a person read; whether any tests were changed to pass
  (the post shows some failing on the new stack behaviour before merge); the reviewer agents' miss
  and false-alarm rates; the cost after merge (security rounds, fixes, cleanup); total engineer
  hours; regressions found after the post; the list of 128 fixed bugs; compile times of the Rust
  build. The roughly 20% binary-size cut mixes the port with separate ICU and linker work, which the
  post says itself. Benchmarks were run by Bun on one machine; no one outside measured them
  ([source](https://bun.com/blog/bun-in-rust#smaller-binary-size)).

## Practices to copy

- [stated] Port first as a faithful line-by-line translation that keeps the architecture; refactor to idiomatic code after it ships. ([Approach](https://bun.com/blog/bun-in-rust#claude-rewrite-bun-in-rust))
- [stated] Before porting, have agents write a pattern-mapping guide and an ownership table for tricky fields, reviewed adversarially and by a person. ([Prep work](https://bun.com/blog/bun-in-rust#prep-work))
- [stated] Trial the whole loop on a handful of files before running it on the full codebase. ([Trial run](https://bun.com/blog/bun-in-rust#trial-run))
- [stated] Give each change one writer and at least two reviewers in separate contexts that see only the diff and are told to find faults. ([Adversarial review](https://bun.com/blog/bun-in-rust#adversarial-review))
- [stated] Feed compiler errors, grouped by crate or file, into a queue that many agents drain in parallel. ([Compiler errors](https://bun.com/blog/bun-in-rust#compiler-errors-as-a-work-queue))
- [stated] When agents go wrong, fix the workflow prompt rather than patching their code by hand. ([Loops](https://bun.com/blog/bun-in-rust#loops-that-write-review-code))
- [stated] Forbid agents that share a checkout from running git commands beyond committing their own files. ([False starts](https://bun.com/blog/bun-in-rust#false-starts))
- [stated] Make reviewers reject stubs and long comments that justify a workaround. ([Another false start](https://bun.com/blog/bun-in-rust#another-false-start))
- [stated] Before trusting a green suite, check by hand that the tests really executed. ([Merging the Rust rewrite](https://bun.com/blog/bun-in-rust#merging-the-rust-rewrite))
- [ours] List constructs that look alike in both languages but differ (assert macros, casts, bounds checks, compile-time arguments) and test them on purpose. ([Porting mistakes](https://bun.com/blog/bun-in-rust#porting-mistakes))
- [ours] Grep the port for placeholder values left for a later phase; one cut a limit that real projects hit. ([Bounds checks](https://bun.com/blog/bun-in-rust#bounds-checks))
- [ours] Size the machine for the agent swarm (disk space, disk speed, process limits) before the bulk run; here each cost hours. ([False starts](https://bun.com/blog/bun-in-rust#false-starts))

## Context

- Model era: a pre-release Claude Fable 5, which the post calls a Mythos-class model, run through
  Claude Code dynamic workflows in May 2026 (merge PR
  [#30412](https://github.com/oven-sh/bun/pull/30412), merged 2026-05-14). Claude Code moved to
  the Rust build in mid-June 2026; the post came out after that
  ([source](https://bun.com/blog/bun-in-rust#production)).
- Conflict of interest: Bun belongs to the company that sells the model and the agent tool used,
  and the post links to that model's announcement and to a security product of the same company.
  Read its effort and cost claims with that in mind.
- Outside critique: Andrew Kelley, Zig's creator, replied the next day in
  [a blog post](https://andrewkelley.me/post/my-thoughts-bun-rust-rewrite.html)
  (2026-07-09). Kelley's claims: the merged code was unreviewed, and a test suite that missed the Zig
  bugs cannot be trusted to catch bugs in the Rust; bugs go away through engineering effort more
  than language choice; Zig has long supported link-time optimisation; the binary-size work was
  unrelated to the rewrite and belonged in the Zig code all along; Bun's team had told Zig
  it did not fuzz its code; the post leaves out compile speed. Most of Kelley's post is about the
  relationship between Bun and the Zig project, outside this case.
- Press: [The Register](https://www.theregister.com/devops/2026/07/14/zig-creator-calls-buns-claude-rust-rewrite-unreviewed-slop/5270743)
  and [DevClass](https://www.devclass.com/ai-ml/2026/07/15/zig-creator-calls-buns-claude-rust-rewrite-unreviewed-slop/5271749)
  reported Kelley's critique; [InfoQ](https://www.infoq.com/news/2026/09/bun-ai-rewrite-zig-rust-4-months/)
  summarised the port and the debate. These are secondhand; the claims above come from the
  primary posts.
- Related: another agent-driven port to Rust steered by one engineer, with end-to-end tests as the
  oracle, [GitHub Copilot runtime to Rust](2026-09-16-github-copilot-runtime-rust.md).
