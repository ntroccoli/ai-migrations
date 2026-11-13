# Context and prompts

What goes into the model's context, and how prompts are written.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **CTX-1** [stated] Choosing the right context (nearby files, good examples, runtime data, exact mapping tables) moved results more than polishing the prompt wording.
  - Old system as oracle: partly. Strength: strong. Era: 2023–2026.
  - Cases: [Airbnb: what worked][air-worked], [Slack: what went wrong][slk-wrong], [Spotify: what worked][spo-worked].
  - Against: Disagree: Spotify treats prompt writing as the hard skill users lack ([Spotify][spo-wrong]).
  - Related view (karpathy-ideas): [context engineering][k-context-engineering], agrees.
- **CTX-2** [stated] Give the model the runtime facts a person would look at, such as the rendered output of each test, not only the source file.
  - Old system as oracle: yes. Strength: medium. Era: Claude 2.1, 2024.
  - Cases: [Slack: what worked][slk-worked], [Slack: practices to copy][slk-practices].
  - Against: None found.
- **CTX-3** [stated] Write field and API mappings as explicit tables in the context, not prose; a guide adapted from the human one led to wrong mappings.
  - Old system as oracle: no. Strength: medium. Era: Claude Code, 2025–2026.
  - Cases: [Spotify: what worked][spo-worked], [Spotify: practices to copy][spo-practices].
  - Against: None found.
- **CTX-4** [stated] State the whole end state, its preconditions and when not to act; agents read vague goals narrowly and stop at the nearest easy point.
  - Old system as oracle: no. Strength: strong. Era: 2025–2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: practices to copy][spo-practices], [1Password: practices to copy][opw-practices].
  - Against: None found.
  - Related view (karpathy-ideas): [success criteria not steps][k-success-criteria-not-steps], agrees.
- **CTX-5** [stated] Put one change in each prompt; prompts bundling several changes ran out of context or stopped halfway.
  - Old system as oracle: no. Strength: medium. Era: Claude Code, 2025.
  - Cases: [Spotify: what went wrong][spo-wrong], [Spotify: practices to copy][spo-practices].
  - Against: None found.
- **CTX-6** [stated] Prefer large, static, version-controlled prompts and few tools for predictability; letting the agent fetch context through many tools adds variance.
  - Old system as oracle: no. Strength: medium. Era: Claude Code, 2025.
  - Cases: [Spotify: what worked][spo-worked].
  - Against: Disagree: Spotify is now letting its agent gather context itself ([Spotify][spo-wrong]), and GitHub ran broad tool sets and finished ([GitHub][gh-worked]).
- **CTX-7** [stated] Ask the agent after each session what its prompt lacked, and fold the answer into the next version of the prompt.
  - Old system as oracle: no. Strength: medium. Era: Claude Code, 2025.
  - Cases: [Spotify: practices to copy][spo-practices].
  - Against: None found.
- **CTX-8** [stated] Fit the prompt to the agent: a weak home-built loop needed step-by-step lists, while a stronger agent did better with the end state and room to plan.
  - Old system as oracle: no. Strength: medium. Era: Claude Code against a home-built loop, 2025.
  - Cases: [Spotify: what worked][spo-worked].
  - Against: None found; 1Password's templates and playbook show step detail still helps on bounded edits ([1Password][opw-worked]).
- **CTX-9** [stated] When the context budget is small, choose context by fixed rules: full bodies of nearby functions, signatures for the rest, the hardest callers first.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [Intel: practices to copy][int-practices].
  - Against: Disagree: Airbnb went the other way, with very large prompts pulling in dozens of related files ([Airbnb][air-worked]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[slk-practices]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#practices-to-copy
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[k-context-engineering]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-25-context-engineering.md
[k-success-criteria-not-steps]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-01-26-success-criteria-not-steps.md
