# Rule-based tools and AI

Splitting the work between deterministic tools and models.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **TOL-1** [stated] Have agents build deterministic tools (analysers, call-site manifests, porting guides, ownership tables), review those, then bind later agent work to them.
  - Old system as oracle: no. Strength: strong. Era: 2026.
  - Cases: [1Password: what worked][opw-worked], [Bun: what worked][bun-worked], [Intel: who did what][int-who].
  - Against: Ordering errors persisted at 1Password even with explicit rules in place ([1Password][opw-wrong]).
- **TOL-2** [stated] Run a rule-based codemod first and give the model its partial output, with a note wherever the rules gave up; it anchors the model.
  - Old system as oracle: partly. Strength: medium. Era: Claude 2.1, 2024; internal Gemini.
  - Cases: [Slack: what worked][slk-worked], [Google: who did what][goo-who].
  - Against: Uber's recipes made all its rewrites with no model step, and its attempt to have AI migrate several files at once failed ([Uber][ubr-who]).
  - Sceptic: tag changed from no to partly. Challenge: a codemod needs old code to transform, and its gain came together with rendered output captured by running the old tests. Answer: accepted.
- **TOL-3** [stated] Find change sites with a code index or static analysis, include too many rather than too few, and let the model edit the whole file around each hint.
  - Old system as oracle: partly. Strength: medium. Era: internal Gemini; 2026.
  - Cases: [Google: what worked][goo-worked], [1Password: what worked][opw-worked].
  - Against: The index can miss sites beyond its hop limit ([Google][goo-wrong]).
  - Sceptic: tag changed from no to partly. Challenge: including too many sites is safe only because regression suites and slow rollouts catch the misses. Answer: accepted.
- **TOL-4** [stated] Price the rule-based alternative with the upkeep of its rules; hand-written transforms keep growing on long-tail patterns, which is where models pay off.
  - Old system as oracle: no. Strength: medium. Era: 2024–2025.
  - Cases: [Spotify: numbers][spo-numbers], [Slack: what went wrong][slk-wrong], [Google: what worked][goo-worked], [Zalando: what worked][zal-worked].
  - Against: Disagree: Uber kept writing recipes for each common build failure and sent failing files back to the old framework, so rules alone carried its long tail while a model attempt failed ([Uber][ubr-wrong]). At Slack the codemod's output still steered the model better than prompt work ([Slack][slk-worked]), so rules stay in the system.
- **TOL-5** [stated] Keep agents and models behind your own thin interface, log traces from day one, and pin model and settings per run; the best agent changed within a year.
  - Old system as oracle: no. Strength: medium. Era: 2023–2026.
  - Cases: [Spotify: what worked][spo-worked], [Google: who did what][goo-who].
  - Against: Disagree: GitHub switched models per slice and mid-session, trading repeatability for fit ([GitHub][gh-worked]).
  - Related view (karpathy-ideas): [plan for intelligence brownouts][k-plan-for-intelligence-brownouts], agrees.
- **TOL-6** [stated] Set up linters, formatters, type checks and coding instructions before the first change, and run them inside the agent's loop, not only in CI.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [GitHub: what worked][gh-worked], [Spotify: practices to copy][spo-practices], [Airbnb: what worked][air-worked], [Slack: what worked][slk-worked].
  - Against: At Shopify, with guidance, linting, tests and static analysis in place, generated code could still repeat logic or drift from the architecture, so native experts stayed essential ([Shopify][shp-wrong]).
  - Related view (karpathy-ideas): [agents ignore code style rules][k-agents-ignore-code-style-rules], agrees.
- **TOL-7** [stated] Before choosing a model for a mechanical framework move, try deterministic rewrites on a typed syntax tree; at very large scale they were judged more practical.
  - Old system as oracle: partly. Strength: weak. Era: unstated.
  - Cases: [Uber: what went wrong][ubr-wrong], [Uber: what worked][ubr-worked].
  - Against: Slack's codemod alone left work that a model then finished ([Slack][slk-worked]); Airbnb's LLM pipeline moved a test framework with no rule-based core ([Airbnb][air-worked]).
- **TOL-8** [stated] Give agents a direct way to inspect and drive the running app (state, events, commands, logic run headless); screenshots and accessibility trees made each test take minutes.
  - Old system as oracle: partly. Strength: weak. Era: 2025–2026 (models unstated).
  - Cases: [Shopify: what went wrong][shp-wrong], [Shopify: what worked][shp-worked].
  - Against: None found; Shopify gives no measured result for its headless CLI ([Shopify][shp-worked]).
- **TOL-9** [stated] Where the old format is regular, have the model fill a schema-checked data object and let templates write the new files; one template fix then repairs every target.
  - Old system as oracle: partly. Strength: weak. Era: Claude Sonnet 4.5, 2025–2026.
  - Cases: [Bloomberg: what worked][bbg-worked], [Bloomberg: how it was checked][bbg-checked].
  - Against: None found; the extraction path still produced a PR for only part of the tasks in each archetype, with reasons not given ([Bloomberg][bbg-wrong]).
- **TOL-10** [stated] At each model upgrade, review the pre-processing built to cover the older model's gaps; keep a step only if it adds reproducibility or eases debugging.
  - Old system as oracle: no. Strength: weak. Era: Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Bloomberg: what went wrong][bbg-wrong].
  - Against: The same authors warn that handing too much to the model makes a pipeline fragile when model behaviour shifts between versions ([Bloomberg][bbg-wrong]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bbg-checked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#how-it-was-checked
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-who]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#who-did-what
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[shp-worked]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-worked
[shp-wrong]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-went-wrong
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[ubr-who]: ../cases/2026-04-07-uber-junit4-to-junit5.md#who-did-what
[ubr-worked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-worked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
[zal-worked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-worked
[k-agents-ignore-code-style-rules]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-03-21-agents-ignore-code-style-rules.md
[k-plan-for-intelligence-brownouts]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-03-11-plan-for-intelligence-brownouts.md
