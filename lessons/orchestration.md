# Many agents at once

Running several agents in parallel without them wrecking each other.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **ORC-1** [stated] Agents sharing one working copy wreck each other's work; give each writer its own worktree, or restrict git to committing its own files.
  - Old system as oracle: no. Strength: strong. Era: 2026.
  - Cases: [Bun: what went wrong][bun-wrong], [1Password: what worked][opw-worked], [GitHub: what worked][gh-worked].
  - Against: One worktree per agent would have filled Bun's disk, so it used a few shared ones with git restricted ([Bun][bun-wrong]).
- **ORC-2** [stated] Run agents in parallel only on changes that are independent by design; otherwise parallelism adds inconsistency.
  - Old system as oracle: no. Strength: weak. Era: 2026.
  - Cases: [1Password: practices to copy][opw-practices].
  - Against: None found.
- **ORC-3** [stated] Peer agents on adjacent code need a named coordinator or human tiebreaker, and autonomy must stop at anything outside the agent's own branch.
  - Old system as oracle: no. Strength: weak. Era: 2026 (GPT-5.6 Sol, Opus 4.8 sessions).
  - Cases: [GitHub: what went wrong][gh-wrong], [GitHub: practices to copy][gh-practices].
  - Against: None found.
  - Related view (karpathy-ideas): [delegate long tasks decompose well][k-delegate-long-tasks-decompose-well], agrees.
- **ORC-4** [stated] Build the work queue from deterministic output (compiler errors by module, failing traces per command), run the tool once, then fan the items out.
  - Old system as oracle: partly. Strength: strong. Era: 2024–2026.
  - Cases: [Bun: what worked][bun-worked], [Airbnb: what worked][air-worked].
  - Against: None found.
- **ORC-5** [stated] Within one workspace, fan reading out to subagents and keep the edits with one agent; reading far outnumbered editing.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: what worked][gh-worked], [GitHub: numbers][gh-numbers].
  - Against: Parallel writing still worked with a separate workspace per writer: GitHub's child sessions ported in their own worktrees ([GitHub][gh-worked]), and Bun ran dozens of writers split by crate ([Bun][bun-worked]).
  - Sceptic: tag kept at no. Challenge: the reading-to-editing ratio was measured in a port, where much reading was of the old code. Answer: kept at "no": reading old code is input, not an oracle; the ratio may differ in new work, which the Era and Strength already limit.
- **ORC-6** [stated] Prefer a short leash to a complex multi-agent design where you can: fixed code picks context, order and output place, and the model translates one unit.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [Intel: what worked][int-worked], [Intel: practices to copy][int-practices].
  - Against: Disagree: Bun and GitHub ran fleets of dozens of agents and finished ([Bun][bun-worked]) ([GitHub][gh-worked]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[k-delegate-long-tasks-decompose-well]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-02-25-delegate-long-tasks-decompose-well.md
