# Code review

How agent-written changes were reviewed, by agents and by people.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **REV-1** [stated] Never let the writing agent review its own change; use two or more reviewers in fresh contexts that see only the diff and are told to find faults.
  - Old system as oracle: partly. Strength: medium. Era: 2026 (Claude Fable 5 pre-release; Opus 5, GPT-5.6 Sol, Grok 4.6).
  - Cases: [Bun: how it was checked][bun-checked], [Bun: what worked][bun-worked], [GitHub: practices to copy][gh-practices].
  - Against: No source measures how much these reviewers miss; an outside critic calls the Bun merge unreviewed ([Bun][bun-wrong]).
  - Related view (karpathy-ideas): [llm council anonymous peer review][k-llm-council-anonymous-peer-review], agrees.
- **REV-2** [stated] Split the review: agents and tests do the exhaustive old-against-new comparison; people spend their attention on architecture, contracts and flagged risk.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [GitHub: who did what][gh-who], [Bun: how it was checked][bun-checked].
  - Against: Disagree: at Slack and Google a person checked every change before merge ([Slack][slk-who]) ([Google][goo-checked]), and Shopify puts a person's approval on every checkpoint ([Shopify][shp-checked]); in Bun no person read every line.
- **REV-3** [ours] Give reviewers a written list of constructs that read the same in both languages but behave differently: assertions, eager defaults, falsy checks, number types.
  - Old system as oracle: yes. Strength: medium. Era: 2026.
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
  - Against: The green filter also held back correct changes where old tests already failed ([Google][goo-wrong]), and a green change can still be wrong in ways reviewers miss ([Spotify][spo-wrong]).
- **REV-8** [stated] Audit the reviewers and the fixer: check that AI reviewers flag real differences and that the agent's answers to review comments hold up.
  - Old system as oracle: partly. Strength: medium. Era: 2026.
  - Cases: [Bun: how it was checked][bun-checked], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
  - Sceptic: tag changed from no to partly. Challenge: the audited reviewers compared new code with old code line by line, so "real differences" assumes a reference. Answer: accepted; checking the agent's replies to review comments still holds without one.
- **REV-9** [stated] Once agents write fast, review, testing and deploy by the owning teams become the bottleneck; plan for that load from the start: reviewer capacity, evidence that eases review, priority.
  - Old system as oracle: no. Strength: strong. Era: 2023–2026.
  - Cases: [GitHub: what went wrong][gh-wrong], [Google: who did what][goo-who], [Spotify: how it was checked][spo-checked], [Bloomberg: what went wrong][bbg-wrong].
  - Against: At Bloomberg reviewer time was not the whole limit: the moves were low priority and owners carried the deploy risk, so most PRs got no decision; its authors look to more checks inside the pipeline and to runs that owners request ([Bloomberg][bbg-wrong]). At Asana, whose engineers reviewed their own agents' pull requests twice a day, slow lint and CI held the work up, not approval ([Asana][asa-wrong]).
  - Related view (karpathy-ideas): [verification not generation is the bottleneck][k-verification-not-generation-is-the-bottleneck], agrees.
- **REV-10** [ours] Grade a small sample of converted code against hand-converted versions with a rubric; pass rates say nothing about readability or idiom.
  - Old system as oracle: yes. Strength: weak. Era: Claude 2.1, 2024.
  - Cases: [Slack: how it was checked][slk-checked].
  - Against: Airbnb reports intent and coverage kept, with no quality grading ([Airbnb][air-checked]).
- **REV-11** [stated] Code that meets the feature requirements can still duplicate logic, drift from the architecture or run slowly; keep reviewers who know the target platform.
  - Old system as oracle: no. Strength: weak. Era: 2025–2026 (models unstated).
  - Cases: [Shopify: what went wrong][shp-wrong].
  - Against: None found.

[air-checked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#how-it-was-checked
[asa-wrong]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#what-went-wrong
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
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
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[shp-wrong]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-went-wrong
[slk-checked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#how-it-was-checked
[slk-who]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#who-did-what
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[k-llm-council-anonymous-peer-review]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-11-22-llm-council-anonymous-peer-review.md
[k-models-too-agentic-state-stakes-and-scope]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-08-09-models-too-agentic-state-stakes-and-scope.md
[k-verification-not-generation-is-the-bottleneck]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-04-verification-not-generation-is-the-bottleneck.md
