# Release and rollout

How the new code reached users, and how risk was limited on the way.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **ROL-1** [stated] Swap one component per change inside normal releases, old and new in one tree joined by a temporary bridge, so the main branch can always ship.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [GitHub: what worked][gh-worked], [GitHub: practices to copy][gh-practices], [Uber: what worked][ubr-worked].
  - Against: Disagree: Bun's author says doing everything at once beats an incremental move, and merged one branch after eleven days ([Bun][bun-worked]); Shopify chose a fresh native build over a gradual move inside the old app ([Shopify][shp-migrated]) and shipped it after about two months of beta ([Shopify][shp-checked]).
- **ROL-2** [stated] Treat merged and released as separate gates: ship first to a canary or pre-release that few users take, and promote it only after real use.
  - Old system as oracle: no. Strength: medium. Era: 2024–2026.
  - Cases: [Bun: what went wrong][bun-wrong], [GitHub: how it was checked][gh-checked], [Google: what went wrong][goo-wrong].
  - Against: Some GitHub regressions still reached a stable release ([GitHub][gh-checked]).
- **ROL-3** [stated] Changes that reach many teams' systems still need slow production rollouts watched by their owners; the AI pipeline speeds the code, not this step.
  - Old system as oracle: no. Strength: medium. Era: internal Gemini; Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Google: what went wrong][goo-wrong], [Bloomberg: what went wrong][bbg-wrong].
  - Against: A downstream product took the whole Bun rewrite in one release and barely anyone noticed ([Bun][bun-wrong]).
- **ROL-4** [stated] Delete the old code in the same change that adds the new; concurrent edits to ported code then surface as rebase conflicts instead of silent losses.
  - Old system as oracle: no. Strength: weak. Era: 2026.
  - Cases: [GitHub: how it was checked][gh-checked].
  - Against: Branch drift and rebases still caused a few regressions ([GitHub][gh-wrong]).
- **ROL-5** [stated] Keep agent branches short-lived against a busy main branch; sessions left open for days pile up drift, and rebases lose changes.
  - Old system as oracle: no. Strength: weak. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **ROL-6** [ours] Track the size of the temporary bridge between old and new as the progress signal and drive it to zero; line counts on a busy code base mislead.
  - Old system as oracle: no. Strength: weak. Era: 2026.
  - Cases: [GitHub: numbers][gh-numbers].
  - Against: None found.
- **ROL-7** [stated] Ship a new failure boundary (such as hosting in-process) as an opt-in mode beside the old default, separate from the code port itself.
  - Old system as oracle: partly. Strength: weak. Era: 2026.
  - Cases: [GitHub: how it was checked][gh-checked].
  - Against: None found.
- **ROL-8** [stated] When old and new run side by side, send a unit that fails its tests back to the old framework rather than block the rollout or diagnose each failure.
  - Old system as oracle: yes. Strength: weak. Era: unstated.
  - Cases: [Uber: what went wrong][ubr-wrong], [Uber: what worked][ubr-worked].
  - Against: None found; Uber does not say how many units stayed on the old framework ([Uber][ubr-wrong]).
- **ROL-9** [stated] Unrequested changes of low priority mostly sit undecided; let owners commit to the generated branch, and consider generating hard-to-check moves only when owners ask.
  - Old system as oracle: no. Strength: weak. Era: Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Bloomberg: what went wrong][bbg-wrong].
  - Against: None found; both remedies are plans the authors have not yet tried.

[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[shp-migrated]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-was-migrated
[ubr-worked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-worked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
