# Contributing

Thanks for helping keep these cases accurate.

## What is welcome

- **Corrections:** a wrong number or date, a broken link, a misattribution, a summary or lesson
  that misreads its source, a quote that is not exact.
- **Suggestions:** a well-documented migration done with AI that is missing. Link its primary
  source (an engineering post, paper, talk or official repository); secondhand reports are left
  out. Use the "Suggest a case" form.
- **Field reports:** what the checklist or the lessons predicted on your project, and what
  actually happened. See [docs/field-reports.md](docs/field-reports.md).

Please open an [issue](https://github.com/ntroccoli/ai-migrations/issues/new/choose). Pull
requests from outside contributors are not accepted yet.

## Rules every file follows

- One case per file in `cases/`, in the format described in [AGENTS.md](AGENTS.md).
- Only migrations done with AI. Rule-based tools used inside one are recorded in that case; the
  one exception, a contrast case, is described in [AGENTS.md](AGENTS.md#scope).
- Summaries in our own words. At most one quote per file, 15 words or fewer, attributed, linked
  and listed in [NOTICE.md](NOTICE.md).
- Every number carries its unit and links to its source; inferences are marked as ours.
- `index.md`, `lessons/index.md`, `lessons/evidence.md`, `llms.txt` and `llms-full.txt` are generated: change the
  sources, run `node scripts/build.mjs`, then `npm run check:all` (validator, generated files
  and the validator's tests; Node.js 20 or later) and
  `npx markdownlint-cli2@0.24.0 "**/*.md"`. Both must pass.

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
