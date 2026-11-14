# Human oversight

Where people stay in the loop, and what they guard.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **OVS-1** [stated] The agent that changes the code must not change what counts as correct: edits to tests, snapshots, baselines and waiver labels need a separate owner's approval.
  - Old system as oracle: partly. Strength: medium. Era: 2025–2026.
  - Cases: [GitHub: practices to copy][gh-practices], [GitHub: what went wrong][gh-wrong], [Spotify: what went wrong][spo-wrong], [Bun: how it was checked][bun-checked], [Intel: what went wrong][int-wrong], [vjeux: what went wrong][vjx-wrong].
  - Against: None found.
- **OVS-2** [stated] Keep the final merge with a person who checks how the agent answered CI and review, not only the diff.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [GitHub: how it was checked][gh-checked], [Google: how it was checked][goo-checked], [Slack: who did what][slk-who].
  - Against: Disagree: in Bun no person read every line; the engineer checked the reviewers instead ([Bun][bun-checked]), and an outside critic calls it unreviewed. ts-rust shipped releases whose author says he read none of the code, names no other reviewer, and gates each revision by comparison with the original's output ([ts-rust][tsr-checked]).
- **OVS-3** [stated] Decide up front where automation stops (a retry cap, a residue size, a category for people) and hand over with the failed attempt as the starting point.
  - Old system as oracle: no. Strength: strong. Era: 2023–2026.
  - Cases: [Airbnb: what worked][air-worked], [Airbnb: practices to copy][air-practices], [1Password: practices to copy][opw-practices], [Google: who did what][goo-who], [Bloomberg: who did what][bbg-who], [Bloomberg: what went wrong][bbg-wrong].
  - Against: Uber's stop rule was a revert to the old framework, not a hand-over to people ([Uber][ubr-wrong]).
- **OVS-4** [stated] Bind each human approval to the exact text approved, such as a hash of the plan, so any later edit to the plan needs a fresh approval.
  - Old system as oracle: no. Strength: weak. Era: 2025–2026 (models unstated).
  - Cases: [Shopify: how it was checked][shp-checked].
  - Against: None found.
- **OVS-5** [stated] Run agents in small mixed waves and make the orchestrator stop for a person's approval between them, so one systematic mistake cannot spread to every target.
  - Old system as oracle: no. Strength: weak. Era: Claude Sonnet 4.6, 2026-04.
  - Cases: [Spartacus: how it was checked][spa-checked], [Spartacus: practices to copy][spa-practices].
  - Against: None found; the waves are the author's plan after the first run, and in our reading the one wave run so far still let a changed email rule through ([Spartacus][spa-wrong]).

[air-practices]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#practices-to-copy
[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bbg-who]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#who-did-what
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spa-checked]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#how-it-was-checked
[spa-practices]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#practices-to-copy
[spa-wrong]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-went-wrong
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[tsr-checked]: ../cases/2026-10-07-ping-tsgo-to-rust.md#how-it-was-checked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
