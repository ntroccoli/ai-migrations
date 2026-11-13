# Planning and scoping

How to size, slice, order and stage a large piece of AI-driven work before agents touch the code.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **PLN-1** [stated] Pilot the whole pipeline (build, CI, review, packaging, release) on a few easy, well-tested units, and settle the conventions before fanning out to the rest.
  - Old system as oracle: partly. Strength: strong. Era: 2023–2026, all model eras.
  - Cases: [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked], [Google: what worked][goo-worked], [Airbnb: who did what][air-who].
  - Against: Bun's three-file trial did not reveal the clash between agents sharing one checkout that hit minutes into the full run ([Bun][bun-wrong]).
  - Sceptic: tag changed from no to partly. Challenge: the pilot units were picked because strong old tests covered them, so the pilot was safe thanks to the old oracle. Answer: accepted; in new work, pick pilot units you can test first.
- **PLN-2** [stated] Expect most of the effort to go into specs, porting guides, manifests and tooling before the bulk run; schedule and staff that phase, not only execution.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [1Password: what worked][opw-worked], [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked].
  - Against: At Airbnb the bulk run was quick, but the long tail then took days of tuning and a week by hand ([Airbnb][air-wrong]): the tail is the other large cost.
- **PLN-3** [stated] Re-measure scope while the work runs; in a live repository, code moving into scope and code written meanwhile can multiply the first estimate.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong].
  - Against: None found; the Airbnb file set was fixed, so it had no inflow ([Airbnb][air-numbers]).
- **PLN-4** [stated] Order the slices along the dependency graph, leaves first and the most connected hub last, and approach the hub from one direction only.
  - Old system as oracle: no. Strength: strong. Era: 2026.
  - Cases: [GitHub: what worked][gh-worked], [GitHub: what went wrong][gh-wrong], [Intel: who did what][int-who], [1Password: what went wrong][opw-wrong].
  - Against: None found.
- **PLN-5** [stated] Translate first and redesign later: keep behaviour the same during the move so that any failure points at the port, not at a deliberate change.
  - Old system as oracle: yes. Strength: strong. Era: 2026.
  - Cases: [GitHub: practices to copy][gh-practices], [Bun: what worked][bun-worked].
  - Against: Disagree: Intel aims for idiomatic data structures at translation time ([Intel][int-practices]), and GitHub's own review prompt asked for idiomatic, optimised code during the port.
- **PLN-6** [stated] Set expectations per class of work: bounded, repetitive edits gain a lot; work with ordering, schema or shared-state constraints gains far less.
  - Old system as oracle: no. Strength: medium. Era: 2026 (models unstated).
  - Cases: [1Password: what worked][opw-worked], [1Password: what went wrong][opw-wrong], [Spotify: numbers][spo-numbers].
  - Against: None found; the 1Password post is the only one to compare both classes in one team.
  - Related view (karpathy-ideas): [coding agents weak on novel code][k-coding-agents-weak-on-novel-code], agrees.
- **PLN-7** [ours] Reopen rewrites shelved for cost, since agents change the price; but weigh them against doing nothing, not against a manual rewrite nobody would fund.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [Bun: numbers][bun-numbers], [GitHub: context][gh-context], [1Password: what worked][opw-worked].
  - Against: Slack had no do-nothing option: the old library blocked a framework upgrade ([Slack][slk-context]); and service extraction at 1Password gained only modestly ([1Password][opw-wrong]).
- **PLN-8** [stated] Leave out segments you cannot specify or verify (non-standard repositories, unsupported platforms, languages the model handles poorly) instead of forcing one approach on all.
  - Old system as oracle: no. Strength: medium. Era: 2023–2026.
  - Cases: [Spotify: what went wrong][spo-wrong], [Google: what went wrong][goo-wrong].
  - Against: None found.
- **PLN-9** [ours] Plan for a partial outcome and a stop rule: no published case here was abandoned, so success odds read from such cases are inflated.
  - Old system as oracle: no. Strength: medium. Era: all.
  - Cases: [Slack: what went wrong][slk-wrong], [1Password: what went wrong][opw-wrong], [Spotify: what went wrong][spo-wrong], [Airbnb: what went wrong][air-wrong].
  - Against: None found; every source is a survivor.

[air-numbers]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#numbers
[air-who]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#who-did-what
[air-wrong]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-went-wrong
[bun-numbers]: ../cases/2026-07-08-bun-zig-to-rust.md#numbers
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-context]: ../cases/2026-09-16-github-copilot-runtime-rust.md#context
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[int-who]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#who-did-what
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[slk-context]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#context
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[k-coding-agents-weak-on-novel-code]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-10-17-coding-agents-weak-on-novel-code.md
