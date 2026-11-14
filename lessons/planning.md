# Planning and scoping

How to size, slice, order and stage a large piece of AI-driven work before agents touch the code.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **PLN-1** [stated] Pilot the whole pipeline (build, CI, review, packaging, release) on a few easy, well-tested units, and settle the conventions before fanning out to the rest.
  - Old system as oracle: partly. Strength: strong. Era: 2023–2026, all model eras.
  - Cases: [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked], [Google: what worked][goo-worked], [Airbnb: who did what][air-who], [Spartacus: what worked][spa-worked], [Spartacus: what went wrong][spa-wrong].
  - Against: Bun's three-file trial did not reveal the clash between agents sharing one checkout that hit minutes into the full run ([Bun][bun-wrong]).
  - Sceptic: tag changed from no to partly. Challenge: the pilot units were picked because strong old tests covered them, so the pilot was safe thanks to the old oracle. Answer: accepted; in new work, pick pilot units you can test first.
- **PLN-2** [stated] Expect most of the effort to go into specs, porting guides, manifests and tooling before the bulk run; schedule and staff that phase, not only execution.
  - Old system as oracle: no. Strength: strong. Era: 2024–2026.
  - Cases: [1Password: what worked][opw-worked], [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked], [Uber: what worked][ubr-worked].
  - Against: At Airbnb the bulk run was quick, but the long tail then took days of tuning and a week by hand ([Airbnb][air-wrong]): the tail is the other large cost.
- **PLN-3** [stated] Re-measure scope while the work runs; in a live repository, code moving into scope and code written meanwhile can multiply the first estimate.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: what went wrong][gh-wrong].
  - Against: None found; the Airbnb file set was fixed, so it had no inflow ([Airbnb][air-numbers]).
- **PLN-4** [stated] Order the slices along the dependency graph, leaves first and the most connected hub last, and approach the hub from one direction only.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [GitHub: what worked][gh-worked], [GitHub: what went wrong][gh-wrong], [Intel: who did what][int-who], [1Password: what worked][opw-worked].
  - Against: Disagree: the Pokémon Showdown port went through methods in list order with no working slices and joined them only at the end, then fixed what diverged from the old engine ([Pokémon][vjx-worked]); our reading is that a full old-engine oracle made the order matter less.
- **PLN-5** [stated] Translate first and redesign later: keep behaviour the same during the move so that any failure points at the port, not at a deliberate change.
  - Old system as oracle: yes. Strength: medium. Era: 2025–2026.
  - Cases: [GitHub: practices to copy][gh-practices], [Bun: what worked][bun-worked], [Pokémon: what was migrated][vjx-migrated], [ts-rust: what was migrated][tsr-migrated].
  - Against: Disagree: Intel aims for idiomatic data structures at translation time ([Intel][int-practices]), and GitHub's own review prompt asked for idiomatic, optimised code during the port. Shopify retired or simplified some Shop screens during the move, though each checkpoint still had to match the running old app ([Shopify][shp-migrated], [checkpoints][shp-checked]).
- **PLN-6** [stated] Set expectations per class of work: bounded, repetitive edits gain a lot; work with ordering, schema or shared-state constraints gains far less.
  - Old system as oracle: no. Strength: medium. Era: GPT-4o, 2024–2025; 2026 (models unstated).
  - Cases: [1Password: what worked][opw-worked], [1Password: what went wrong][opw-wrong], [Spotify: numbers][spo-numbers], [Zalando: what went wrong][zal-wrong].
  - Against: Uber's repetitive test-framework move did not work with generative AI over several files at once, which the authors put down to scale and in-house test patterns ([Uber][ubr-wrong]).
  - Related view (karpathy-ideas): [coding agents weak on novel code][k-coding-agents-weak-on-novel-code], agrees.
- **PLN-7** [ours] Reopen rewrites shelved for cost, since agents change the price; but weigh them against doing nothing, not against a manual rewrite nobody would fund.
  - Old system as oracle: no. Strength: medium. Era: 2026.
  - Cases: [Bun: numbers][bun-numbers], [GitHub: context][gh-context], [1Password: what worked][opw-worked].
  - Against: Slack had no do-nothing option: the old library blocked a framework upgrade ([Slack][slk-context]); and service extraction at 1Password gained only modestly ([1Password][opw-wrong]).
- **PLN-8** [stated] Leave out segments you cannot specify or verify (non-standard repositories, unsupported platforms, languages the model handles poorly) instead of forcing one approach on all.
  - Old system as oracle: no. Strength: medium. Era: 2023–2026.
  - Cases: [Spotify: what went wrong][spo-wrong], [Google: what went wrong][goo-wrong], [Uber: what worked][ubr-worked], [Bloomberg: what worked][bbg-worked].
  - Against: Bloomberg did not leave its rare archetypes out: each got a generic starting-point PR, labelled as such, for its owners to finish ([Bloomberg][bbg-wrong]).
- **PLN-9** [ours] Plan for a partial outcome and a stop rule: abandoned attempts appear here only inside stories that end in a success, so success odds read from such cases are inflated.
  - Old system as oracle: no. Strength: medium. Era: all.
  - Cases: [Slack: what went wrong][slk-wrong], [1Password: what went wrong][opw-wrong], [Spotify: what went wrong][spo-wrong], [Airbnb: what went wrong][air-wrong], [ts-rust: what went wrong][tsr-wrong].
  - Against: Uber reports an AI attempt that failed and was dropped, a first in this collection, though it names no model, size or date ([Uber][ubr-wrong]); ts-rust reports a first attempt that ran for months below its target before a restart replaced its code, with no stop rule stated ([ts-rust][tsr-wrong]); the migrations themselves are all survivors.
- **PLN-10** [stated] Measure how often each pattern (runner, rule, base class) is used and how automatable it is, and build the transforms or prompts with the best return first.
  - Old system as oracle: no. Strength: medium. Era: unstated; Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Uber: what worked][ubr-worked], [Bloomberg: what worked][bbg-worked].
  - Against: None found; Bloomberg's authors say easier archetypes may have gone first, which can inflate early success rates ([Bloomberg][bbg-wrong]).
- **PLN-11** [stated] Do not port a whole app in one pass, even from specs gathered first; Shopify's author says that gives code nobody can maintain. Port in small ordered slices a person can review quickly.
  - Old system as oracle: partly. Strength: weak. Era: 2025–2026 (models unstated).
  - Cases: [Shopify: what went wrong][shp-wrong], [Shopify: how it was checked][shp-checked], [Pokémon: what went wrong][vjx-wrong].
  - Against: Disagree: Bun merged a whole port as one branch ([Bun][bun-worked]), though built from many agent-sized units, not in one pass. After its failed one-shot attempt (cited above), the same Pokémon Showdown port ported every method before running any of it and joined them once, arguing that growing it slice by slice would relearn settled design ([Pokémon][vjx-worked]).
- **PLN-12** [stated] Sort targets into archetypes, each with its own prompt, data collection and checks; give rare archetypes a generic starting point instead of dedicated automation.
  - Old system as oracle: no. Strength: weak. Era: Claude Sonnet 4.5, then Opus 4.6, 2025–2026.
  - Cases: [Bloomberg: what worked][bbg-worked], [Bloomberg: what went wrong][bbg-wrong].
  - Against: Airbnb ran one pipeline over all its files and grouped the failures by status afterwards; its case reports no sorting up front ([Airbnb][air-worked]).

[air-numbers]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#numbers
[air-who]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#who-did-what
[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[air-wrong]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-went-wrong
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
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
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[shp-migrated]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-was-migrated
[shp-wrong]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-went-wrong
[slk-context]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#context
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spa-worked]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-worked
[spa-wrong]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-went-wrong
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[tsr-migrated]: ../cases/2026-10-07-ping-tsgo-to-rust.md#what-was-migrated
[tsr-wrong]: ../cases/2026-10-07-ping-tsgo-to-rust.md#what-went-wrong
[ubr-worked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-worked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
[vjx-migrated]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-was-migrated
[vjx-worked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-worked
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
[k-coding-agents-weak-on-novel-code]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-10-17-coding-agents-weak-on-novel-code.md
