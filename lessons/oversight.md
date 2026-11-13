# Human oversight

Where people stay in the loop, and what they guard.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **OVS-1** [stated] The agent that changes the code must not change what counts as correct: edits to tests, snapshots, baselines and waiver labels need a separate owner's approval.
  - Old system as oracle: partly. Strength: strong. Era: 2025–2026.
  - Cases: [GitHub: practices to copy][gh-practices], [GitHub: what went wrong][gh-wrong], [Spotify: what went wrong][spo-wrong], [Bun: how it was checked][bun-checked], [Intel: what went wrong][int-wrong].
  - Against: None found.
- **OVS-2** [stated] Keep the final merge with a person who checks how the agent answered CI and review, not only the diff.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [GitHub: how it was checked][gh-checked], [Google: how it was checked][goo-checked], [Slack: who did what][slk-who].
  - Against: Disagree: in Bun no person read every line; the engineer checked the reviewers instead ([Bun][bun-checked]), and an outside critic calls it unreviewed.
- **OVS-3** [stated] Decide up front where automation stops (a retry cap, a residue size, a category for people) and hand over with the failed attempt as the starting point.
  - Old system as oracle: no. Strength: strong. Era: 2023–2026.
  - Cases: [Airbnb: what worked][air-worked], [Airbnb: practices to copy][air-practices], [1Password: practices to copy][opw-practices], [Google: who did what][goo-who].
  - Against: None found.

[air-practices]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#practices-to-copy
[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
