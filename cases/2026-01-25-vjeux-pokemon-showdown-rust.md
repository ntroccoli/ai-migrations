---
title: Christopher Chedeau moves the Pokémon Showdown battle engine off TypeScript onto Rust with Claude Code
date: 2026-01-25
company: Christopher Chedeau (personal project)
summary: One engineer had Claude Code write about 100k lines of Rust in a month, checked against the original on millions of seeded battles; no Rust written by hand.
source_url: https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html
also: [https://github.com/vjeux/pokemon-showdown-rs]
source_type: engineering-post
author_relation: user-of-tool
evidence: shown-in-source
kind: language
from: Pokémon Showdown battle engine (TypeScript; the post calls it JavaScript)
to: Rust
from_languages: [TypeScript]
size: about 100k lines of Rust
duration: 4 weeks
people: 1 engineer
cost: unstated
ai_share: most
tools: [Claude Code, CLAUDE.md instructions, source-comment script, seeded divergence test harness, Docker, git, AppleScript key-press loop, auto clicker]
models: [unstated]
period: 2025-12..2026-01
outcome: completed
status: current
superseded_by:
---

# Christopher Chedeau moves the Pokémon Showdown battle engine off TypeScript onto Rust with Claude Code

Over a winter break, one engineer had Claude Code rewrite the battle engine of Pokémon Showdown,
an open-source simulator, in Rust, so that it could run fast inside a training loop. A first
free-form port compiled but cut corners. What worked was structure: a script put each original
method beside its Rust twin, every Rust method got its own file, and a harness replayed seeded
random battles in both versions and compared them turn by turn. Claude fixed hundreds of
divergences on its own, while the author steered clean-ups, kept the agent running day and night,
and reverted a run that went wrong. The author reports about 100k lines of Rust from 5,000 commits in 4
weeks, 80 divergent battles left in the earliest 2.4 million seeds, and a speed-up of 3.5x
([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).

## Source

A first-person post on Christopher Chedeau's personal blog, dated 2026-01-25 by the site's
publishing data. The author used Claude Code; nothing in the post or the repository shows a stake in the tool, and the port is a holiday project,
not a company product. The post shows screenshots of the agent's work, test summaries and a timing
run, and links the public repository, which holds the code, the test scripts and the result files
([repository](https://github.com/vjeux/pokemon-showdown-rs)). It names no model and no cost.

## What was migrated

The battle simulator of Pokémon Showdown, which applies the game's rules for moves, abilities,
items and turn order. The post calls the original JavaScript, but its title says TypeScript, its
code screenshot shows TypeScript syntax, and the port's README describes a move from TypeScript
([README](https://github.com/vjeux/pokemon-showdown-rs)). The aim was a one-to-one port, every
original file and method with a Rust counterpart, fast enough to train a battle-playing AI
([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
The README limits the engine to Generation 9 random battles
([README](https://github.com/vjeux/pokemon-showdown-rs)).

## Who did what

- **AI:** Claude Code (model not named) wrote the Rust code and the helper scripts, built the
  comparison harness, and found and fixed the divergences, often unattended overnight. Basis for
  `ai_share: most`: the author says he wrote no line of code himself and had never written Rust
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- **Rule-based tools:** a script (written by Claude) that copied each original method into the Rust
  files as comments; the original's seeded random number generator, which produced reproducible
  battles; a search for TODO and "simplif" markers that served as the work list; the Rust compiler,
  run inside Docker; a local server that ran git commands for the sandboxed agent; and a key-press
  loop plus an auto clicker that kept the session going.
- **People:** the author alone. He set the structure, wrote the prompts, worked with the agent by
  day and queued long jobs by night, spotted wrong abstractions and hard-coded behaviour and told
  the agent where to move them, chose to integrate only once everything was ported, and reverted
  a run that went wrong.

## How it was checked

At first only compilation was checked. Once most methods were ported, a harness fed the same teams,
the same actions and the same random seed to both versions and compared the battle state at each
step. The author grew the seed batches from a hundred battles to millions, and a results file with
the pass rate per seed was committed to GitHub so progress could be read from a phone. One of Claude's
summaries in the post reports 1,000 regression tests passing. Nothing in the post shows that anyone
who knows Rust reviewed the code
([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| ~100k lines | size of the Rust code base | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 5,000 commits | commits made during the port | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 4 weeks | time for those commits (the post also says a month, and two weeks in its conclusion) | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| more than 10k lines | length of some source files once the original code was added as comments | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 3 weeks | time the agent spent fixing divergences | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| one fix about every 20 minutes | average rate at which the agent fixed divergences | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 100 to 2.4 million seeds | growing batches of seeded battles compared | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 80 seeds, 0.003% | battles still diverging among the earliest 2.4 million seeds | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 1,018 seeds, 99.96% | failing seeds and pass rate over 2.4 million seeds in an undated screenshot | measured | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 480 of 500 seeds | battles passing in the 500-seed results file in a screenshot | measured | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 3.5x | speed of Rust over the original on 2,000 seeds with 10 threads each (7.2 seconds against ~25 seconds) | measured | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 1,000 tests | regression tests passing in one of Claude's summaries | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 5 seconds | interval of the key press that approved every prompt | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |
| 10 years | time the original had already been refined | reported | [post](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html) |

## What worked

- A script, not the agent, placed each original method as a comment beside its Rust version. The
  author says the agent mistranslated even when told to copy code, and the script made the port
  far more reliable
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Giving every Rust method its own file greatly improved results (the original's files were left
  whole, for fear of changing behaviour, though the author says splitting them too would help more)
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Porting everything before integrating, instead of growing simple versions step by step: the
  author argues the original had already settled its design over 10 years, so relearning it
  would not converge
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Seeded random battles run in both versions gave a simple, exact oracle. Over 3 weeks the agent
  fixed divergences at a pace of about one per 20 minutes, hundreds in all, with no help from the author
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Encoding what the agent did well: one debug script that prints the random-number steps, the
  actions of each turn and stack traces, plus instructions in CLAUDE.md, so each investigation
  started at once instead of being reinvented after every compaction.
- A searchable marker in the code (TODO, "simplif") replaced a master to-do file as the work
  list.
- A results file committed after each run let the author follow progress from GitHub.
- Overnight jobs ran on short, strict prompts: go item by item, in order, never skip a hard item,
  build missing infrastructure, keep the code compiling, commit after each unit, and look for the
  same mistake elsewhere once one is fixed. The author notes the agent did not really follow them.
- The port was 3.5x faster than the original in a parallel run on 2,000 seeds
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).

## What went wrong

- The first one-shot port only looked good: thousands of compiling lines, but loose ports where
  anything complex was "simplified", two incompatible definitions of a move in two files, wrong
  abstractions, and hard-coded fixes. Letting the loop port more on that base went nowhere
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Files of more than 10k lines, once the original was added as comments, were refused or read in
  loose chunks, and they filled the context so that compaction came far more often
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- The master to-do file soon grew too big to help, and the agent littered the repository with
  more such files.
- Left alone, the agent hard-coded the behaviour of specific moves, abilities and items all over
  the code, even after being told not to; each day-long run needed a clean-up the author directed.
- The fixing loop was very slow at first: after each compaction the agent lost what it had
  learned, reinvented its approach and wrote piles of new markdown notes and test scripts, or
  produced many tests that never matched the original.
- Rust's rules caused their own bugs: the borrow checker forced copies, indices and callbacks
  because battle and creature objects point at each other; loosely typed return values needed
  new types; and every optional argument had to be spelled out.
- The agent dodged hard work: it refused fixes touching more than a couple of files unless pushed,
  patched the one failing test instead, wrote simplified versions (some methods were better deleted
  and ported again), skipped hard items in a list, and sometimes changed the original code kept as
  the reference.
- The context got poisoned: one TODO sat inside the original code, the agent changed it
  sensibly, then changed every later TODO the same way where that made no sense; the author
  reverted all those commits
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- A day of agent-planned speed work brought no gain, and some changes made it much slower; the
  author, new to Rust, could not judge the plan and says expertise is still needed
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Keeping the agent running took constant babysitting and workarounds: the sandbox blocked git
  over ssh, an antivirus stopped each new binary, the skip-permissions flag was disabled in his setup (later fixed), so a
  script pressed enter every 5 seconds to approve everything; the agent kept stopping to recap, and
  a known looping technique could not be made to work; pop-ups stole focus; and a crash of Claude
  Code stopped runs on a handful of nights
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Not finished: 80 seeds still diverged among the earliest 2.4 million seeds, the author could not
  say how many issues remained, and the battle AI that motivated the port was never built
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)). The README calls the port under active development, with move, ability and
  item callbacks still to implement, and covers only Generation 9 random battles
  ([README](https://github.com/vjeux/pokemon-showdown-rs)).
- **Not reported:** the model; token use or cost; the author's hours; any review of the Rust by
  someone who knows the language; how the two failure counts (80 seeds in the text, 1,018 seeds in a
  screenshot, both over 2.4 million seeds) relate; why the duration reads 4 weeks, a month and two
  weeks in different places (the repository's commits span about 5 weeks); and coverage beyond the random battles the harness generates
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).

## Practices to copy

- [stated] Generate the scaffold with a script, not the agent: put each original method as a comment next to its target stub, so the reference text is exact. ([Giving it structure, Porting](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Split the target into one file per method so the agent can read each unit whole without chunking or early compaction. ([Litte Islands](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] When the original already settled its design, port every unit first and integrate once, instead of growing simple versions step by step. ([Build everything before testing](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Compare old and new on seeded, reproducible runs step by step, and widen the batch of seeds as the failures thin out. ([End-to-end test](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Turn the agent's useful debugging into one shared script and a line in its instructions file, so each new session starts investigating at once. ([Giving it structure, Integration](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Keep the work list in the code as searchable markers rather than in one growing to-do file. ([Todos](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Tell the agent that a specific fix calls for a search for the same fault elsewhere, and for the larger fix behind it. ([Fixing](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [ours] Commit after each unit so a run that went wrong can be reverted as a block. ([Todos](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [stated] Commit the test results file so progress can be followed from anywhere. ([Fixing](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [ours] Forbid skipping hard items, but check it: the agent skipped them despite the prompt. ([Types of issues](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [ours] Make the reference code read-only to the agent; it edited the original it was meant to copy. ([Types of issues](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [ours] Have someone who knows the target language judge speed work against a benchmark before the agent spends a day on it. ([Is it fast?](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))
- [ours] Run an agent that approves its own commands only in a disposable machine or container, not on a personal computer. ([Escaping the sandbox](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html))

## In their words

> "it still feels like a tool that requires my engineering expertise and constant babysitting"
> — Christopher Chedeau, author of the port, [2026-01-25](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)

## Context

- A personal open-source project, not a company product: the original simulator is maintained by
  others, and the Rust port lives in the author's public repository, which held 4,828 commits on
  its main branch when we read it on 2026-11-14
  ([repository](https://github.com/vjeux/pokemon-showdown-rs)).
- The author was prompted by a public goal, from an engineer at a large software company, of one
  engineer porting a million lines in a month with AI and algorithms
  ([source](https://blog.vjeux.com/2026/analysis/porting-100k-lines-from-typescript-to-rust-using-claude-code-in-a-month.html)).
- Model era: Claude Code from late December 2025 to late January 2026; the post never names the
  model behind it; the repository's commits run from 2025-12-22 to 2026-01-25
  ([repository](https://github.com/vjeux/pokemon-showdown-rs)).
- Related: other ports into Rust checked against the old system's behaviour,
  [Bun Zig to Rust](2026-07-08-bun-zig-to-rust.md) and
  [GitHub Copilot runtime port](2026-09-16-github-copilot-runtime-rust.md); a library port that
  recorded the old code's outputs as tests, [Intel C to Rust](2026-08-24-intel-ideas-c-to-rust.md).
