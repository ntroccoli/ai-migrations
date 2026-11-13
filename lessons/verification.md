# Verification loops and gates

The automated checks around each agent change, and what they can and cannot prove.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **VER-1** [stated] A clean compile or a green CI run shows the parts fit together, not that behaviour survived; plan a behavioural check after it.
  - Old system as oracle: no. Strength: strong. Era: 2025–2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Intel: what went wrong][int-wrong], [Spotify: what went wrong][spo-wrong].
  - Against: In a memory-safe target, one class of memory bugs does become a compile error ([Bun][bun-checked]), so the compiler is a real but narrow check.
- **VER-2** [stated] Order gates from cheap to costly and drop a candidate at its first failure, with cheap no-change checks (whitespace only, unchanged syntax tree) up front.
  - Old system as oracle: partly. Strength: strong. Era: 2023–2025.
  - Cases: [Google: how it was checked][goo-checked], [Airbnb: what worked][air-worked], [Slack: what worked][slk-worked], [Spotify: how it was checked][spo-checked], [Uber: how it was checked][ubr-checked].
  - Against: None found.
- **VER-3** [stated] Retry a failed unit with its latest errors in a fresh prompt, cap the attempts, and hand what remains to people.
  - Old system as oracle: partly. Strength: strong. Era: unnamed frontier models (2024) to 2026.
  - Cases: [Airbnb: what worked][air-worked], [Google: who did what][goo-who], [Spotify: numbers][spo-numbers].
  - Against: Google's developers could not tell how many retries a file would need ([Google][goo-wrong]); test feedback helped one model on Intel's battery far more than another ([Intel][int-worked]); Uber neither retried nor handed over files whose tests failed but put them back on the old framework, as diagnosing each was impractical ([Uber][ubr-wrong]).
- **VER-4** [stated] Give the agent one verify tool that picks the right build and test runner and returns short errors, and run it automatically before the agent may finish.
  - Old system as oracle: partly. Strength: medium. Era: Claude Code, 2025.
  - Cases: [Spotify: what worked][spo-worked], [Spotify: practices to copy][spo-practices].
  - Against: GitHub's agents called the raw build and test commands directly, in large volume, and still finished ([GitHub][gh-numbers]).
  - Sceptic: tag changed from no to partly. Challenge: the verify tool runs only the tests a repository already has, and stopped helping where there were none. Answer: accepted; new work must write those tests before the tool helps.
- **VER-5** [stated] Before trusting a green suite, confirm the tests really ran: compare executed tests and assertions with the baseline, and count skips as failures.
  - Old system as oracle: yes. Strength: medium. Era: 2024–2026.
  - Cases: [Bun: how it was checked][bun-checked], [Bun: practices to copy][bun-practices], [Slack: what went wrong][slk-wrong].
  - Against: None found.
- **VER-6** [stated] Check output against machine-readable contracts (generated signatures, schema-compatibility checks) so a dropped or changed interface fails mechanically.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [Intel: what worked][int-worked], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **VER-7** [stated] Define done as an empty list of change sites produced by deterministic tooling and rerun on a schedule, never as the agent's own report.
  - Old system as oracle: partly. Strength: medium. Era: internal Gemini; 2026.
  - Cases: [Google: what worked][goo-worked], [1Password: what worked][opw-worked].
  - Against: Google's reference search stops after a set number of hops and can miss sites ([Google][goo-wrong]).
- **VER-8** [stated] Rank failures by cost: no change is cheap, a red change costs an engineer, a green but wrong change costs trust; aim verification at the last kind.
  - Old system as oracle: no. Strength: medium. Era: 2025–2026.
  - Cases: [Spotify: what went wrong][spo-wrong], [GitHub: how it was checked][gh-checked].
  - Against: None found.
- **VER-9** [stated] Where the target has no tests the agent cannot check itself: leave it out, require tests first, or budget for owners to test each change.
  - Old system as oracle: partly. Strength: strong. Era: Claude Code, 2025–2026.
  - Cases: [Spotify: how it was checked][spo-checked], [Spotify: practices to copy][spo-practices].
  - Against: Intel translated without tests on purpose to measure the repair cost afterwards ([Intel][int-checked]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-practices]: ../cases/2026-07-08-bun-zig-to-rust.md#practices-to-copy
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-checked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#how-it-was-checked
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[ubr-checked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#how-it-was-checked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
