# Cost

Tokens, money, people's time and the bill after merge.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **CST-1** [stated] Long agent runs are affordable only with high prompt-cache reuse: keep a stable prompt prefix and track the hit rate and each kind of token.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: numbers][gh-numbers], [GitHub: what worked][gh-worked], [Bun: numbers][bun-numbers].
  - Against: With a model call per file, Zalando put its API bill under $40 per repository before any cache discount ([Zalando][zal-numbers]); the cache matters most for long agent runs. Zalando still ordered its prompt for caching ([Zalando][zal-worked]).
- **CST-2** [ours] Ask for the full bill: tokens at the price paid, people's hours by role, compute and CI, review, and the work after merge; most sources give one piece.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [GitHub: numbers][gh-numbers], [Bun: numbers][bun-numbers], [Airbnb: what went wrong][air-wrong], [Spotify: what went wrong][spo-wrong], [ts-rust: numbers][tsr-numbers].
  - Against: GitHub gives the fullest token breakdown in the set ([GitHub][gh-numbers]).
- **CST-3** [ours] Expect cost per unit to have a long tail; report median and mean, and size the budget for hub components and hard files.
  - Old system as oracle: no. Strength: medium. Era: 2024–2026.
  - Cases: [Intel: what worked][int-worked], [GitHub: numbers][gh-numbers], [Airbnb: what went wrong][air-wrong].
  - Against: None found.
- **CST-4** [ours] Before reusing a published cost, check the model, how it was reached and the price basis; pre-release, internal or partner models give costs others cannot repeat.
  - Old system as oracle: no. Strength: medium. Era: model-specific by definition.
  - Cases: [Bun: who did what][bun-who], [Intel: who did what][int-who], [Google: who did what][goo-who], [Asana: source][asa-source], [ts-rust: numbers][tsr-numbers].
  - Against: None found.
- **CST-5** [ours] Work out cost per unit inside one case and name the unit; added lines, production lines, symbols and files differ, and tokens do not convert to money across cases.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [Bun: numbers][bun-numbers], [GitHub: numbers][gh-numbers], [Intel: numbers][int-numbers].
  - Against: None found.
- **CST-6** [ours] Count the work after merge (regression fixes, security rounds, fuzzing, clean-up and speed work) in what the migration cost.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [Bun: what went wrong][bun-wrong], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **CST-7** [ours] Budget review agents as a multiple of generation (several reviewers and a fixer per writer), and ask for their share of tokens, which no case reports.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [Bun: who did what][bun-who], [GitHub: practices to copy][gh-practices].
  - Against: None found.
- **CST-8** [stated] Missing or broken tests in target repositories, or checks the pipeline cannot run, shift the cost of checking onto the teams that receive the changes; the central figures leave it out.
  - Old system as oracle: partly. Strength: medium. Era: 2023–2026.
  - Cases: [Spotify: how it was checked][spo-checked], [Google: what went wrong][goo-wrong], [Bloomberg: what went wrong][bbg-wrong].
  - Against: None found.
- **CST-9** [ours] Pipeline and harness costs pay back over many repositories or migrations; a one-off project should reuse a general harness rather than build one.
  - Old system as oracle: no. Strength: weak. Era: 2025–2026.
  - Cases: [Spotify: numbers][spo-numbers], [Spotify: what worked][spo-worked].
  - Against: Disagree: Airbnb built its own pipeline for one migration and finished far inside its manual estimate ([Airbnb][air-who]), and Slack's author expects custom pipelines to stay necessary ([Slack][slk-wrong]).

[air-who]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#who-did-what
[air-wrong]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-went-wrong
[asa-source]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#source
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-numbers]: ../cases/2026-07-08-bun-zig-to-rust.md#numbers
[bun-who]: ../cases/2026-07-08-bun-zig-to-rust.md#who-did-what
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-numbers]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#numbers
[int-who]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#who-did-what
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[tsr-numbers]: ../cases/2026-10-07-ping-tsgo-to-rust.md#numbers
[zal-numbers]: ../cases/2025-02-20-zalando-ui-component-libraries.md#numbers
[zal-worked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-worked
