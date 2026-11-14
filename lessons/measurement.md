# Measuring and reading results

How to read the numbers in these sources, and how to report your own.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **MSR-1** [ours] Treat savings measured against a manual effort that never ran as self-estimates; record the basis beside each figure and never add them across cases.
  - Old system as oracle: no. Strength: strong. Era: all.
  - Cases: [Google: what went wrong][goo-wrong], [Spotify: numbers][spo-numbers], [Airbnb: numbers][air-numbers], [Slack: numbers][slk-numbers], [Bun: numbers][bun-numbers], [1Password: what went wrong][opw-wrong].
  - Against: Google's estimate at least agrees with its measured shares of model-made edits ([Google][goo-numbers]).
- **MSR-2** [ours] For every success rate ask out of what (attempted, opened, merged, dropped from scope), and report each measure with its base; bases differed several-fold.
  - Old system as oracle: no. Strength: strong. Era: all.
  - Cases: [Spotify: what went wrong][spo-wrong], [Slack: how it was checked][slk-checked], [Zalando: how it was checked][zal-checked], [Bloomberg: how it was checked][bbg-checked].
  - Against: Airbnb's main rate covers its whole file set ([Airbnb][air-numbers]).
- **MSR-3** [ours] Weigh each source by the author's stake in the tool (seller, owner, partner); none of the cases had outside measurement.
  - Old system as oracle: no. Strength: medium. Era: all.
  - Cases: [Bun: who did what][bun-who], [GitHub: context][gh-context], [Spotify: context][spo-context], [1Password: context][opw-context], [Intel: who did what][int-who].
  - Against: Google lists its own threats to validity ([Google][goo-wrong]), and Slack has no stake in the model it used ([Slack][slk-who]).
- **MSR-4** [stated] Credit a gain to the migration only after separating it from work that landed in the same window (other speed work, linker changes, unrelated fixes).
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Bun: what went wrong][bun-wrong].
  - Against: Disagree: the Zig creator credits link-time optimisation the old toolchain already had for Bun's speed-up ([Bun][bun-wrong]).
- **MSR-5** [stated] Escaped defects are unknown by nature: publish known regressions as a floor, grouped by cause, and use a before-and-after proxy labelled as a proxy.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Bun: what went wrong][bun-wrong].
  - Against: Airbnb reports no defects after merge at all, which is missing data, not evidence ([Airbnb][air-wrong]).
- **MSR-6** [ours] Activity numbers (lines per minute, commits, merged changes) are not progress; track verified behaviour or the shrinking list of remaining sites.
  - Old system as oracle: no. Strength: medium. Era: all.
  - Cases: [Bun: numbers][bun-numbers], [Spotify: numbers][spo-numbers], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **MSR-7** [ours] Re-date a lesson before reusing it: early negative results, and results from pre-release or restricted models, may not hold for the models you use.
  - Old system as oracle: no. Strength: medium. Era: Claude 2.1 (2024) to pre-release models (2026).
  - Cases: [Slack: who did what][slk-who], [Bun: who did what][bun-who], [Intel: who did what][int-who], [Google: what went wrong][goo-wrong], [Uber: what went wrong][ubr-wrong].
  - Against: 1Password's 2026 agents still broke ordering rules ([1Password][opw-wrong]), so some failures persist across eras.
- **MSR-8** [ours] Do not credit the model with work the deterministic tools did: finding sites, building manifests and codemods were often the hard part.
  - Old system as oracle: no. Strength: strong. Era: all.
  - Cases: [Google: who did what][goo-who], [Slack: who did what][slk-who], [1Password: who did what][opw-who], [Spotify: who did what][spo-who], [Uber: who did what][ubr-who], [Bloomberg: who did what][bbg-who].
  - Against: In Bun almost all the work ran through agent workflows ([Bun][bun-who]).
- **MSR-9** [stated] If you will claim savings, measure people's share from file snapshots or logs from day one; estimates from the tool's own builders are biased.
  - Old system as oracle: no. Strength: medium. Era: internal Gemini.
  - Cases: [Google: how it was checked][goo-checked], [Google: what went wrong][goo-wrong].
  - Against: Google itself warns that edit distance misses the thinking behind edits, and the snapshot method skips edits made along the way, so it understates people's share ([Google][goo-wrong]).
- **MSR-10** [stated] A merge rate undercounts unrequested changes: also count targets whose owners rejected the change and then migrated anyway, often reusing it.
  - Old system as oracle: no. Strength: weak. Era: Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Bloomberg: what worked][bbg-worked].
  - Against: None found; Bloomberg followed up only the rejected Python PRs, not the far larger group left without a decision ([Bloomberg][bbg-worked]).

[air-numbers]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#numbers
[air-wrong]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-went-wrong
[bbg-checked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#how-it-was-checked
[bbg-who]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#who-did-what
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[bun-numbers]: ../cases/2026-07-08-bun-zig-to-rust.md#numbers
[bun-who]: ../cases/2026-07-08-bun-zig-to-rust.md#who-did-what
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-context]: ../cases/2026-09-16-github-copilot-runtime-rust.md#context
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-numbers]: ../cases/2025-04-13-google-int64-ids.md#numbers
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-who]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#who-did-what
[opw-context]: ../cases/2026-04-20-1password-monolith-refactor.md#context
[opw-who]: ../cases/2026-04-20-1password-monolith-refactor.md#who-did-what
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[slk-checked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#how-it-was-checked
[slk-numbers]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#numbers
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-context]: ../cases/2025-11-06-spotify-honk.md#context
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-who]: ../cases/2025-11-06-spotify-honk.md#who-did-what
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[ubr-who]: ../cases/2026-04-07-uber-junit4-to-junit5.md#who-did-what
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
[zal-checked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#how-it-was-checked
