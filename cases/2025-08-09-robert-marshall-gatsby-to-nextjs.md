---
title: Robert Marshall moves his Gatsby blog to Next.js with Claude Code, after a failed first run
date: 2025-08-09
company: Robert Marshall
summary: A one-prompt sub-agent migration rebuilt Gatsby's data layers inside Next.js; a restart from a fresh Next.js app, moving parts one at a time, worked.
source_url: https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/
also: [https://dev.to/robmarshall/why-my-gatsby-to-next-js-migration-failed-and-what-it-taught-me-about-ai-workflows-2l9n]
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: framework
from: Gatsby (blog fed by headless WordPress)
to: Next.js App Router
from_languages: [unstated]
size: a small website (the author's word; no count given)
duration: about 4 hours in all, cleanup of the first run included
people: 1 developer
cost: unstated
ai_share: unstated
tools: [Claude Code, Claude Code sub-agents, Context7, Serena, Sequential Thinking, create-next-app]
models: [unstated]
period: unstated
outcome: completed
status: current
superseded_by:
---

# Robert Marshall moves his Gatsby blog to Next.js with Claude Code, after a failed first run

A developer moved his own blog, a Gatsby site reading posts from a headless WordPress, to the
Next.js App Router with Claude Code. The first run used one prompt that sent sub-agents through a
file list in stages. In 45 minutes it ported the user interface well, but it rebuilt Gatsby's
resolvers and data layers inside Next.js
([run](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-actually-happened)), and about 4 hours of cleanup did not rescue it
([cleanup](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-real-problem-i-asked-claude-to-solve-the-wrong-thing)). He restarted from a fresh Next.js app: first an architecture, then a WordPress
data module, then one component at a time, then wiring and testing. He gives about 4 hours for the
whole job, cleanup included
([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome)).

## Source

A post on the author's own blog, also cross-posted to dev.to on 2025-08-14
([dev.to](https://dev.to/robmarshall/why-my-gatsby-to-next-js-migration-failed-and-what-it-taught-me-about-ai-workflows-2l9n));
the two texts are the same. The blog dates it 2025-08-09 and shows a later update on 2025-08-21.
The author, a developer who has done freelance Gatsby work, writes about his own site; he sells none of the tools he
used. The post shows his first prompt and the prompts of the restart, but no code, diff,
repository or measurement behind its claims.

## What was migrated

The author's blog, built years earlier with Gatsby, its posts served from a headless WordPress.
He moved it after publishing a post failed with Cloudflare errors he traced to the old Gatsby
build, and because he sees Gatsby as a stalled framework. Busy with paid work, he ruled out
moving it by hand and gave the job to Claude Code ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/)). He calls the site small and
gives no page, file or line count ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-obvious-approach)).

## Who did what

- **AI:** Claude Code wrote the code in both runs; the post names the Context7, Serena and
  Sequential Thinking add-ons for the first. In the first run it planned the move in plan mode, then carried it out with every
  step running without approval; the prompt told it to list the files, build shared code with
  2 subagents and split the rest among another 4 to 6 subagents, and the post reports the plan and the result,
  not each stage ([prompt](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-prompt)). In the restart it designed the Next.js architecture,
  wrote the WordPress data module, adapted each component and wired them up
  ([steps](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-3-component-migration)). The post gives no share of the code, only that a
  manual move was ruled out; hence `ai_share: unstated`.
- **Rule-based tools:** `create-next-app` generated the new project skeleton (TypeScript,
  Tailwind, ESLint, App Router) for the restart.
- **People:** the author alone: he wrote the prompts, spent the cleanup hours on the first run,
  chose to restart, and ordered the restart's steps.

## How it was checked

The post names no tests, build checks or review. The restart's last step asks Claude to test
everything end to end, without saying how. The author asserts the new code is tidy and in Next.js
style and that it outperforms the old Gatsby site, with no figure and no method given
([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome)).

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 45 minutes | Claude's first run, every step auto-approved, watched by the author | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-actually-happened) |
| about 4 hours | time spent cleaning up the first run | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-real-problem-i-asked-claude-to-solve-the-wrong-thing) |
| about 4 hours | whole migration after the restart, the first run's cleanup included | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome) |
| 1 subagent | agent told to list the files needing change | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-prompt) |
| 2 subagents | agents told to build the shared code listed first | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-prompt) |
| 4 to 6 subagents | agents told to migrate the remaining files | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-prompt) |
| 4 steps | stages of the restart | reported | [post](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-better-approach-foundation-first) |

## What worked

- In the first run, plan mode gave a plan that looked sound: it found the headless WordPress
  setup, the Gatsby-specific parts to replace and their order, foundations first. Carrying it out
  still rebuilt Gatsby's layers (see below)
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-actually-happened)).
- The author was very pleased with how the first run ported the UI components and styles; the
  architecture beneath them failed
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#where-it-all-went-wrong)).
- The restart began from a generated Next.js app and a prompt for a clean architecture, then a
  single module for every WordPress call (post list, single post, categories, cached with
  Next.js's own cache, plus a webhook to refresh pages on publish). Components were then moved one
  by one onto that module, so none had to imitate Gatsby's GraphQL layer
  ([fresh app](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-1-clean-slate-foundation), [data](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-2-wordpress-data-layer-foundation),
  [components](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-3-component-migration)).
- The author says the result is clean and outperforms the Gatsby site (no figure), and that it
  now serves the blog
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome)).

## What went wrong

- The first run copied Gatsby's complexity instead of removing it: several data-fetching
  layers, resolvers Next.js does not need, and stacked abstractions. These systems more or less
  worked, but made the site heavy ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#where-it-all-went-wrong)).
- Watching the run did not reveal the problem: the author followed its reasoning for 45 minutes
  while it ran every step without approval, it looked on track, and the flaw showed only afterwards
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-actually-happened)).
- About 4 hours of cleanup did not fix the first run's architecture; the author restarted
  instead. He blames his prompt, which asked for a migration rather than a clean target
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-real-problem-i-asked-claude-to-solve-the-wrong-thing)).
- The timings do not add up as written: cleanup alone took about 4 hours, yet the whole
  migration, cleanup included, is also given as about 4 hours
  ([source](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome)).
- **Not reported:** the model; the site's size; how the result was tested or reviewed; what
  was kept from the first run's components; the restart's own duration; the performance figures
  behind "performs better"; any bugs found after launch; the API or plan cost.

## Practices to copy

- [stated] For a framework move, scaffold the target app first and have the agent build its architecture, then port the old parts onto it. ([Foundation first](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-better-approach-foundation-first))
- [stated] Build the data-access layer in the target's own idiom before moving any component that reads data. ([Data layer](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-2-wordpress-data-layer-foundation))
- [stated] Move components one at a time, each prompt naming the shared target utilities to use. ([Components](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#step-3-component-migration))
- [stated] Give the agent one clear target state, not both architectures to bridge at once. ([Lessons](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-this-taught-me-about-ai-workflows))
- [ours] Review the architecture an auto-approved run builds, even a watched one, before polishing its output; a plausible run log is no proof of a sound design. ([What happened](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#what-actually-happened))
- [ours] Set a time box for repairing a failed agent run, and restart with a new plan when it runs out. ([Wrong problem](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-real-problem-i-asked-claude-to-solve-the-wrong-thing))

## In their words

> "I failed at defining the right problem to solve."
> — Robert Marshall, developer and author, [2025-08-09](https://robertmarshall.dev/blog/gatsby-next-migration-failed-but-taught-me-ai/#the-outcome)

## Context

- A small personal site moved by one developer: far smaller than the other
  cases here, so its timings and its lesson on scope weigh as one person's account, not as a
  measured result.
- Model era: written in August 2025 with Claude Code, sub-agents and plan mode; the post names no
  model and gives no period, so the publication date stands in for it.
- Other cases where a first approach gave way to another: [Shopify React Native to
  native](2026-09-10-shopify-react-native-to-native.md) (its author says one-shot ports fail) and
  the [Ping TypeScript compiler port](2026-10-07-ping-tsgo-to-rust.md) (a stalled port, then a restart).
