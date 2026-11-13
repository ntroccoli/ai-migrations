# Knowledge capture

Turning failures and logs into lasting improvements.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **KNW-1** [stated] When a failure recurs, fix what generates the code (prompt, reviewer rule, skill, evaluation, harness), not only the output; the second time is the trigger.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked], [Airbnb: what worked][air-worked].
  - Against: None found.
- **KNW-2** [stated] Stamp each unit with its status, tune against the largest failing group using a small sample, then sweep all units again.
  - Old system as oracle: partly. Strength: strong. Era: 2023–2025.
  - Cases: [Airbnb: what worked][air-worked], [Slack: what worked][slk-worked], [Google: what worked][goo-worked].
  - Against: None found.
- **KNW-3** [stated] Keep structured session logs from the start; they later answered where time went and what people did, and became evaluations.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: numbers][gh-numbers], [GitHub: what worked][gh-worked].
  - Against: None found.

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
