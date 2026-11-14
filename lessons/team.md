# Team and roles

Who does what when agents write most of the code.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **TEM-1** [stated] The lead engineer's job becomes running the control loop: framing slices, challenging design, pushing for completeness, deciding every merge.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: numbers][gh-numbers], [GitHub: who did what][gh-who], [Bun: who did what][bun-who], [Pokémon: who did what][vjx-who].
  - Against: GitHub's split of the engineer's messages by intent was labelled by an LLM, not checked by a person ([GitHub][gh-numbers]).
  - Related view (karpathy-ideas): [partial autonomy and autonomy slider][k-partial-autonomy-and-autonomy-slider], agrees.
- **TEM-2** [stated] Count the people behind a one-engineer story (reviewers in many teams, interop, packaging and build specialists) and staff and budget for them.
  - Old system as oracle: no. Depends on model ability: no. Strength: strong. Era: 2024–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: who did what][gh-who], [Google: who did what][goo-who], [Slack: who did what][slk-who].
  - Against: Bun credits the port to one engineer and names no helpers for it ([Bun][bun-who]), and the Pokémon Showdown port was one person's holiday project ([Pokémon][vjx-who]).
- **TEM-3** [stated] A central team should own the agent tooling, build it with early adopters, and teach prompt writing; untrained users fell into the same traps.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2024–2026; newest: Claude (version unstated).
  - Cases: [Spotify: who did what][spo-who], [Spotify: what went wrong][spo-wrong], [Slack: who did what][slk-who].
  - Against: None found.
- **TEM-4** [stated] Review in two tiers: the migration owner screens each batch, then code owners accept; expect the load to spread over many teams.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Claude Opus 4.x.
  - Cases: [Google: how it was checked][goo-checked], [Spotify: who did what][spo-who], [Bloomberg: who did what][bbg-who].
  - Against: In Bun one engineer merged alone, with no second tier ([Bun][bun-who]).
- **TEM-5** [stated] Code the model migrates is code the team never wrote; keep owners close to it and teach them the new library, or debugging and incident handling suffer.
  - Old system as oracle: no. Depends on model ability: no. Strength: weak. Era: 2024–2025; newest: GPT-4o.
  - Cases: [Zalando: what went wrong][zal-wrong].
  - Against: ts-rust's author says he read none of the ported code and left the fixing to agents; it reports no incident either way, so the case neither shows nor rules out the cost ([ts-rust][tsr-who]). In the Pokémon port the agent debugged on its own though the owner had never written Rust; the one gap he reports was in judging speed work ([Pokémon][vjx-wrong]).

[bbg-who]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#who-did-what
[bun-who]: ../cases/2026-07-08-bun-zig-to-rust.md#who-did-what
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-who]: ../cases/2026-09-16-github-copilot-runtime-rust.md#who-did-what
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-who]: ../cases/2025-11-06-spotify-honk.md#who-did-what
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[tsr-who]: ../cases/2026-10-07-ping-tsgo-to-rust.md#who-did-what
[vjx-who]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#who-did-what
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
[k-partial-autonomy-and-autonomy-slider]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-17-partial-autonomy-and-autonomy-slider.md
