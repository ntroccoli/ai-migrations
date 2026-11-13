# Testing and oracles

What tells you the new code is right, and where those oracles fail.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **TST-1** [stated] Use a black-box suite that does not depend on the implementation language as the oracle, and run it unchanged against the old code and the new.
  - Old system as oracle: yes. Strength: strong. Era: 2026.
  - Cases: [Bun: how it was checked][bun-checked], [GitHub: how it was checked][gh-checked].
  - Against: An outside critic asks why a suite that let the old bugs through should vet the new code ([Bun][bun-wrong]); Bun still shipped known regressions after a fully green run.
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], agrees.
- **TST-2** [stated] Before the move starts, widen end-to-end coverage of the behaviour that matters; the gaps in it are where missing-feature regressions came from.
  - Old system as oracle: yes. Strength: strong. Era: 2025–2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: practices to copy][spo-practices].
  - Against: Google leaned on the owning teams' existing regression suites and slow rollouts rather than new tests ([Google][goo-checked]); Intel left the tests out on purpose and got a build that crashed ([Intel][int-wrong]).
- **TST-3** [stated] Equivalence with the old system is not correctness: a faithful port carries the old bugs, and tests can assert the wrong behaviour with confidence.
  - Old system as oracle: yes. Strength: medium. Era: 2026.
  - Cases: [Bun: what went wrong][bun-wrong], [GitHub: what went wrong][gh-wrong].
  - Against: The Bun rewrite also fixed many bugs that the old code had ([Bun][bun-wrong]), so a port is not only a copy of old defects.
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], contradicts: equality with the reference also carries the reference's bugs and its wrong tests into the port.
- **TST-4** [ours] Run the oracle on the build configuration you ship; debug-only assertions and checks hid regressions that appeared only in release builds.
  - Old system as oracle: partly. Strength: weak. Era: 2026.
  - Cases: [Bun: what went wrong][bun-wrong].
  - Against: None found.
- **TST-5** [stated] Where the old system has thin tests, record its inputs and outputs (or have a separate agent write equivalence tests) and replay them against the new code.
  - Old system as oracle: yes. Strength: medium. Era: 2024 (Claude 2.1), 2026 (Claude Mythos Preview).
  - Cases: [Intel: what worked][int-worked], [Slack: what worked][slk-worked].
  - Against: Full coverage through a library's public functions is often out of reach, and generated tests can be vacuous ([Intel][int-wrong]).
- **TST-6** [stated] Make the baseline green before agents start: fix tests that already fail and make golden files regenerable, or correct changes stall at the gate.
  - Old system as oracle: yes. Strength: medium. Era: internal Gemini, period unstated.
  - Cases: [Google: what went wrong][goo-wrong], [Spotify: how it was checked][spo-checked].
  - Against: None found.
- **TST-7** [stated] When widening or retyping data, test with values outside the old range; small test values pass even when a truncation or a wrong type survives.
  - Old system as oracle: partly. Strength: medium. Era: internal Gemini; 2026.
  - Cases: [Google: who did what][goo-who], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **TST-8** [ours] When the migrated artefact is itself a test, passing is a weak oracle; also compare test counts, coverage and intent file by file.
  - Old system as oracle: yes. Strength: weak. Era: 2023–2024.
  - Cases: [Slack: practices to copy][slk-practices], [Airbnb: how it was checked][air-checked].
  - Against: None found; Airbnb says coverage and intent were kept but shows no method.
- **TST-9** [stated] Treat performance as part of the contract: benchmark end to end against a deterministic local stand-in for slow services, and count slowdowns as regressions.
  - Old system as oracle: yes. Strength: medium. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [GitHub: numbers][gh-numbers].
  - Against: GitHub's own before-and-after mixes in other changes from the same months, which the author flags.
- **TST-10** [stated] Keep the agent that writes code apart from the one that writes its tests; one generation producing both invites checks that cannot fail.
  - Old system as oracle: no. Strength: weak. Era: 2026.
  - Cases: [Intel: what went wrong][int-wrong], [Intel: practices to copy][int-practices].
  - Against: When generated separately, Intel's agent-written tests worked as well as expert ones as feedback ([Intel][int-worked]).

[air-checked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#how-it-was-checked
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[slk-practices]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#practices-to-copy
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[k-port-with-equality-tests]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-01-03-port-with-equality-tests.md
