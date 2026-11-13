# Contributing

Thanks for helping keep these cases accurate.

## What is welcome

- **Corrections:** a wrong number or date, a broken link, a misattribution, a summary or lesson
  that misreads its source, a quote that is not exact.
- **Suggestions:** a well-documented migration done with AI that is missing. Link its primary
  source (an engineering post, paper, talk or official repository); secondhand reports are left
  out.

Please open an [issue](https://github.com/ntroccoli/ai-migrations/issues/new/choose). Pull
requests from outside contributors are not accepted yet.

## Rules every file follows

- One case per file in `cases/`, in the format described in [AGENTS.md](AGENTS.md).
- Only migrations done with AI. Rule-based tools used inside one are recorded in that case.
- Summaries in our own words. At most one quote per file, 15 words or fewer, attributed, linked
  and listed in [NOTICE.md](NOTICE.md).
- Every number carries its unit and links to its source; inferences are marked as ours.
- `index.md` and `llms.txt` are generated: run `node scripts/build.mjs`, then
  `node scripts/validate.mjs` (Node.js 20 or later).

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), header 72 characters or
less, with the types listed in [AGENTS.md](AGENTS.md#commits). Example:

```text
fix: correct the file count in the Airbnb case
```

## AI assistance

This repository is maintained with Claude Code. AI-assisted commits keep a `Co-Authored-By`
trailer, and a human reviews every change before it is published. If you use AI tools for a
contribution, say so.

## Conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
