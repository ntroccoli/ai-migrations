# Case format

Read before writing or editing a case in `cases/`. Moved from `AGENTS.md`, which keeps the
commands and the writing rules.

## Case files

One file per case: `cases/YYYY-MM-DD-company-what.md`, where the date is the source's publication
date (for a series, its first part; when a companion post that never mentions AI gives the
migration's detail, the post about the AI work, and the Context says so). `node scripts/validate.mjs` checks the rules below; it
must exit 0 before a commit (the other checks are listed under "Commands" in `AGENTS.md`).

```markdown
---
title: Airbnb moves 3.5K React test files off Enzyme onto React Testing Library
date: 2025-04-01
company: Airbnb
summary: One sentence, at most 160 characters, for the index and llms-full.txt.
source_url: https://airbnb.tech/infrastructure/accelerating-large-scale-test-migration-with-llms/
also: []
source_type: engineering-post
author_relation: user-of-tool
evidence: assertion-only
kind: test-framework
from: Enzyme (React component tests)
to: React Testing Library
from_languages: [TypeScript]
size: nearly 3,500 test files
duration: 6 weeks
people: unstated
cost: unstated
ai_share: most
tools: [custom LLM migration pipeline, Jest, ESLint, TypeScript compiler]
models: [unstated]
period: 2024
outcome: completed
status: current
superseded_by:
---

# Airbnb moves 3.5K React test files off Enzyme onto React Testing Library

Summary in our own words, 40 to 150 words.

## Source
## What was migrated
## Who did what
- **AI:** ...
- **Rule-based tools:** ...
- **People:** ...
## How it was checked
## Numbers
| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
## What worked
## What went wrong
- **Not reported:** ...
## Practices to copy
## In their words        (optional)
## Context
```

Field rules (all checked):

- `date`: `YYYY-MM-DD`, not in the future; the file name starts with it.
- `source_url`: the primary source, `https://`. `also`: an inline list of the other URLs of the
  same source (the other parts of a series, a companion post the source links when the case is
  dated by its post about the AI work, or the project's official repository when the source links
  it), or `[]`.
- `source_type`: `engineering-post` (by the engineers who ran the migration, for a company or for
  themselves), `paper`, `talk`, `repo` (official repository or docs), `vendor-marketing` (written
  to sell).
- `author_relation`: `seller-of-tool` when the author's company sells, or promotes in the source,
  an AI tool or platform the case used, and also when a tool user writes the source in
  partnership with the tool's vendor; `user-of-tool`; `independent` (no stake in the work or
  the tools). A seller's case weighs less; its Source section says what is sold.
- `evidence`: how far a reader can check the claims. `independent-data` (someone outside the
  company measured it), `shown-in-source` (the source shows the data, logs, benchmark or method
  behind its numbers), `assertion-only` (numbers are stated, not shown).
- `kind`: `language`, `framework`, `test-framework`, `library-upgrade`, `data`, `architecture`
  (restructuring within one language: a monolith split into services, an API pattern changed
  across call sites), `mixed`.
- `from`, `to`, `size`, `duration`, `people`: short text; every number carries a unit;
  `unstated` when the source does not say.
- `from_languages`: an inline list of the languages the migrated code was written in before the
  move, each spelled as in `LANGUAGES` (`scripts/lib.mjs`; add one there when a case needs it), no
  repeats, or `[unstated]`. Named after `from` because "source" here means the publication.
  `index.md` lists the covered languages from it, and the ones in `LANGUAGES` that no case starts
  from.
- `ai_share`: `most`, `part`, `little` or `unstated`: the share of the changed code AI produced,
  only as the source states it, never guessed. The basis goes in "Who did what".
- `tools`, `models`: inline lists; `[unstated]` when the source names none. Models are named
  exactly as the source names them.
- `period`: when the work ran, `YYYY`, `YYYY-MM`, a range `A..B` of those, or `unstated`. With
  `models` it fixes the model era.
- `outcome`: `completed`, `partial`, `ongoing`, `abandoned`, as the source claims it; doubts go
  in "What went wrong".
- `cost`: what the migration cost, with its unit (money, tokens, compute), for example
  `~$120,000 for ~136.3 billion tokens`; `unstated` when the source gives no figure.
- `status`: `current` or `superseded`. A case is a past event: a newer case from another company
  does not make it wrong. Use `superseded` only when the same company publishes a later account
  of the same migration (corrected numbers, a rollback); then `superseded_by` names the newer
  case file, both cases have the same `company` (checked), and the newer case's Context links
  back. When the field moves on, say so in the checklist's Evidence lines and keep the older
  case `current`.

Body rules (all checked):

- The first heading equals `title`; a summary of 40 to 150 words follows; the sections above
  appear in that order, none empty. "In their words" is optional.
- "Who did what" has the three bullets **AI:**, **Rule-based tools:**, **People:** (`unstated`
  is allowed).
- "What went wrong" is never empty and always has a **Not reported:** bullet naming what the
  source leaves out (failure rates, rollbacks, cost, review effort). When the source names no
  failure, say "The source reports none." (survivor bias: most sources announce wins).
- "Practices to copy": one line per practice, `- [stated] text ([Section](source link))` or
  `- [ours] text ([Section](source link))`. `[stated]`: the source recommends it or reports it
  as what worked. `[ours]`: we infer it from what the source reports (often from a failure). The
  link goes to the source section it comes from. The text is at most 200 characters, with no
  number.
- "Numbers": one row per number as the source writes it, with its unit. Basis: `measured` (the
  source says how it counted: logs, repository history, a benchmark), `reported` (stated as
  fact, method not given), `estimate` (the source calls it an estimate), `self-estimate` (a team
  estimating its own effort or savings), `vendor-claim` (a seller's claim about its tool).
  Source: a link to `source_url` or an `also` URL.
- Every number in the text carries a unit, and every paragraph, list item or table row that
  holds one links to `source_url` or an `also` URL (a `#section` anchor is welcome).
- Quote: at most one per file, 15 words or fewer, as `> "text"` in "In their words", followed by
  `> — Name, role, [YYYY-MM-DD](source link)`, and listed in `NOTICE.md`. A quoted span of more
  than four words anywhere else counts as a quote.
- Relative links (to other cases) must resolve.

Units: every number needs a `%` or `x` suffix, a currency sign, or a word from `UNITS` in
`scripts/lib.mjs` within the next three words. Years, dates, version numbers after a name
(`Opus 4.8`, `Java 21`) and numbers after a label word (`part 4`) are exempt; numbers written as
words are not checked. The full rule is in the comment above `checkUnits` in
`scripts/validate.mjs`. Add a unit to `UNITS` when a case needs one.

Own words, checked (**maintainer only**: it needs the source text):
`node scripts/check-copy.mjs <case> <source text files>` lists every run of 5 or more consecutive
words the case shares with its source, outside "In their words" and the values of `models:` and
`tools:` (verbatim by rule). Run it on each new or changed case.
