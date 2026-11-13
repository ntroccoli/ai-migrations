# Team and roles

Who does what when agents write most of the code.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **TEM-1** [stated] The lead engineer's job becomes running the control loop: framing slices, challenging design, pushing for completeness, deciding every merge.
  - Old system as oracle: no. Strength: strong. Era: 2026.
  - Cases: [GitHub: numbers][gh-numbers], [GitHub: who did what][gh-who], [Bun: who did what][bun-who].
  - Against: None found.
  - Related view (karpathy-ideas): [partial autonomy and autonomy slider][k-partial-autonomy-and-autonomy-slider], agrees.
- **TEM-2** [stated] Count the people behind a one-engineer story (reviewers in many teams, interop, packaging and build specialists) and staff and budget for them.
  - Old system as oracle: no. Strength: strong. Era: 2023–2026.
  - Cases: [GitHub: who did what][gh-who], [Google: who did what][goo-who], [Slack: who did what][slk-who].
  - Against: Bun credits the port to one engineer and names no helpers for it ([Bun][bun-who]).
- **TEM-3** [stated] A central team should own the agent tooling, build it with early adopters, and teach prompt writing; untrained users fell into the same traps.
  - Old system as oracle: no. Strength: medium. Era: Claude 2.1, 2024; Claude Code, 2025.
  - Cases: [Spotify: who did what][spo-who], [Spotify: what went wrong][spo-wrong], [Slack: who did what][slk-who].
  - Against: None found.
- **TEM-4** [stated] Review in two tiers: the migration owner screens each batch, then code owners accept; expect the load to spread over many teams.
  - Old system as oracle: no. Strength: medium. Era: 2023–2026.
  - Cases: [Google: how it was checked][goo-checked], [Spotify: who did what][spo-who].
  - Against: In Bun one engineer merged alone, with no second tier ([Bun][bun-who]).

[bun-who]: ../cases/2026-07-08-bun-zig-to-rust.md#who-did-what
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-who]: ../cases/2026-09-16-github-copilot-runtime-rust.md#who-did-what
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-who]: ../cases/2025-11-06-spotify-honk.md#who-did-what
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[k-partial-autonomy-and-autonomy-slider]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-17-partial-autonomy-and-autonomy-slider.md
