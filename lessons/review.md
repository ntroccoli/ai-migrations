# Code review

How agent-written changes were reviewed, by agents and by people.

Evidence base: every lesson here comes from the AI-assisted **migrations** in [this collection](../index.md); many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle": does the lesson rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong (`yes`, `no`, `partly`). "Strength": `strong` (several cases, or measured), `medium`, `weak` (one case or assertion only).

- **REV-1** [stated] Never let the writing agent review its own change; use two or more reviewers in fresh contexts that see only the diff and are told to find faults.
  - Old system as oracle: partly. Strength: medium. Era: 2026 (Claude Fable 5 pre-release; Opus 5, GPT-5.6 Sol, Grok 4.6).
  - Cases: [Bun: how it was checked][bun-checked], [Bun: what worked][bun-worked], [GitHub: practices to copy][gh-practices].
  - Against: No source measures how much these reviewers miss; an outside critic calls the Bun merge unreviewed ([Bun][bun-wrong]).
  - Related view (karpathy-ideas): [llm council anonymous peer review][k-llm-council-anonymous-peer-review], agrees.
- **REV-2** [stated] Split the review: agents and tests do the exhaustive old-against-new comparison; people spend their attention on architecture, contracts and flagged risk.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [GitHub: who did what][gh-who], [Bun: how it was checked][bun-checked].
  - Against: Disagree: at Slack and Google a person checked every change before merge ([Slack][slk-who]) ([Google][goo-checked]); in Bun no person read every line.
- **REV-3** [stated] Give reviewers a written list of constructs that read the same in both languages but behave differently: assertions, eager defaults, falsy checks, number types.
  - Old system as oracle: yes. Strength: strong. Era: 2026.
  - Cases: [Bun: what went wrong][bun-wrong], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **REV-4** [stated] Add an automatic scope check that compares each diff with its instruction; agents drift into refactors, switched-off tests and side fixes.
  - Old system as oracle: no. Strength: medium. Era: Claude Code, 2025; internal Gemini.
  - Cases: [Spotify: what worked][spo-worked], [Google: how it was checked][goo-checked].
  - Against: Spotify's judge has no evaluation yet, so how often it vetoes good work is unknown ([Spotify][spo-wrong]).
  - Related view (karpathy-ideas): [models too agentic state stakes and scope][k-models-too-agentic-state-stakes-and-scope], agrees.
- **REV-5** [ours] Treat LLM reviewers and judges as unmeasured until you know their miss rate; veto counts and showcase catches say nothing about what got through.
  - Old system as oracle: no. Strength: medium. Era: 2025–2026.
  - Cases: [Spotify: what went wrong][spo-wrong], [Bun: how it was checked][bun-checked].
  - Against: GitHub turned its session logs into evaluations, a start on measuring ([GitHub][gh-worked]).
- **REV-6** [stated] Have the tool leave an inline note with a guide link at each spot it deliberately left for a person, so reviewers find the judgement calls fast.
  - Old system as oracle: no. Strength: medium. Era: Claude 2.1, 2024; Claude Code, 2025–2026.
  - Cases: [Spotify: what worked][spo-worked], [Slack: who did what][slk-who].
  - Against: None found.
- **REV-7** [stated] Let people see only changes that already built and passed tests; developers counted that filter as one of the largest gains.
  - Old system as oracle: partly. Strength: medium. Era: internal Gemini.
  - Cases: [Google: what worked][goo-worked].
  - Against: None found.
- **REV-8** [stated] Audit the reviewers and the fixer: check that AI reviewers flag real differences and that the agent's answers to review comments hold up.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [Bun: how it was checked][bun-checked], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
  - Sceptic: tag changed from no to partly. Challenge: the audited reviewers compared new code with old code line by line, so "real differences" assumes a reference. Answer: accepted; checking the agent's replies to review comments still holds without one.
- **REV-9** [stated] Once agents write fast, waiting for approval becomes the bottleneck; plan reviewer capacity across the owning teams from the start.
  - Old system as oracle: no. Strength: strong. Era: 2023–2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Google: who did what][goo-who], [Spotify: how it was checked][spo-checked].
  - Against: None found.
  - Related view (karpathy-ideas): [verification not generation is the bottleneck][k-verification-not-generation-is-the-bottleneck], agrees.
- **REV-10** [ours] Grade a small sample of converted code against hand-converted versions with a rubric; pass rates say nothing about readability or idiom.
  - Old system as oracle: yes. Strength: weak. Era: Claude 2.1, 2024.
  - Cases: [Slack: how it was checked][slk-checked].
  - Against: Airbnb reports intent and coverage kept, with no quality grading ([Airbnb][air-checked]).

[air-checked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#how-it-was-checked
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-practices]: ../cases/2026-09-16-github-copilot-runtime-rust.md#practices-to-copy
[gh-who]: ../cases/2026-09-16-github-copilot-runtime-rust.md#who-did-what
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[slk-checked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#how-it-was-checked
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[k-llm-council-anonymous-peer-review]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-11-22-llm-council-anonymous-peer-review.md
[k-models-too-agentic-state-stakes-and-scope]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-08-09-models-too-agentic-state-stakes-and-scope.md
[k-verification-not-generation-is-the-bottleneck]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-04-verification-not-generation-is-the-bottleneck.md
