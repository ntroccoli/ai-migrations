# Security

Sandboxing agents, memory safety, dependencies and data integrity.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **SEC-1** [stated] Run unattended agents in a minimal sandbox with an allowlist of commands; pushing, merging and talking to people belong to the surrounding infrastructure.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what worked][spo-worked], [Spotify: practices to copy][spo-practices].
  - Against: Bun's agents committed and pushed themselves and the project still finished ([Bun][bun-wrong]). One author found the sandbox blocked pushing and an antivirus stopped each new build, and worked around both (a local server running git, builds in Docker, every prompt approved) to keep his agent running; he reports no harm ([Pokémon][vjx-wrong]).
  - Related view (karpathy-ideas): [agent security is the wild west][k-agent-security-is-the-wild-west], agrees.
- **SEC-2** [stated] Whatever the harness exposes may get used unasked (an unlisted skill, git commands, a peer's worktree); remove what the task does not need.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Bun: what went wrong][bun-wrong], [Spotify: what worked][spo-worked].
  - Against: Disagree: Spotify itself is adding skills and self-gathered context because prompts grew unwieldy without them ([Spotify][spo-wrong]).
- **SEC-3** [ours] Block destructive repository and system commands in the tool layer, not with a prompt rule, which only arrives after the damage.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude Fable 5.x.
  - Cases: [Bun: what went wrong][bun-wrong], [Spotify: practices to copy][spo-practices].
  - Against: None found; one author ran an agent for weeks on his own computer with every prompt approved by a key-press script and reports no damage ([Pokémon][vjx-wrong]); one unharmed run is a small sample.
- **SEC-4** [stated] After a port into a memory-safe language, count where unsafe code sits, allow it only at foreign and system boundaries, and have the compiler forbid it elsewhere.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: numbers][gh-numbers], [Bun: what went wrong][bun-wrong], [Intel: practices to copy][int-practices].
  - Against: Disagree: on how much to allow, Bun's faithful port keeps far more unsafe code and plans to cut it only by later refactoring ([Bun][bun-wrong]).
- **SEC-5** [stated] Generate foreign-function signatures with a binding tool and reject any model answer that differs; a wrong contract leaks unsafety into safe-looking code.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: medium. Era: 2026; newest: GPT-5.x.
  - Cases: [Intel: what worked][int-worked], [Intel: practices to copy][int-practices].
  - Against: None found.
- **SEC-6** [ours] A bounds-checked target turns silent out-of-range access into crashes; expect new crash reports and test limits at real-world sizes.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Fable 5.x.
  - Cases: [Bun: what went wrong][bun-wrong].
  - Against: None found.
- **SEC-7** [ours] Treat each replaced library as a migration of its own, above all sanitizers, credential stores and protocol SDKs, and vet every new dependency.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong].
  - Against: None found; no case shows new dependencies being vetted.
  - Related view (karpathy-ideas): [rethink dependencies supply chain][k-rethink-dependencies-supply-chain], agrees.
- **SEC-8** [stated] Treat agent session logs and traces as data that may hold secrets; control where they are stored and where they are uploaded.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: how it was checked][gh-checked], [Spotify: who did what][spo-who].
  - Against: None found.
- **SEC-9** [stated] Isolate each agent run from earlier attempts and reference answers, which it could otherwise read and lean on; decide about network access too.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude Opus 4.x.
  - Cases: [Intel: who did what][int-who], [Bloomberg: who did what][bbg-who].
  - Against: None found.
- **SEC-10** [stated] Never let agents choose the order of schema changes, backfills or ownership of shared tables; one agent's chosen order would have lost data silently.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: unstated.
  - Cases: [1Password: what went wrong][opw-wrong], [1Password: practices to copy][opw-practices].
  - Against: None found.

[bbg-who]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#who-did-what
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[int-who]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#who-did-what
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-who]: ../cases/2025-11-06-spotify-honk.md#who-did-what
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[k-agent-security-is-the-wild-west]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-16-agent-security-is-the-wild-west.md
[k-rethink-dependencies-supply-chain]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-03-24-rethink-dependencies-supply-chain.md
