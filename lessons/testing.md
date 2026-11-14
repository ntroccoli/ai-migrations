# Testing and oracles

What tells you the new code is right, and where those oracles fail.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **TST-1** [stated] Use a black-box suite that does not depend on the implementation language as the oracle: fix it before the port, review every edit to it, and run it against the old code and the new.
  - Old system as oracle: yes. Depends on model ability: no. Strength: strong. Era: 2025–2026; newest: GPT-6.x.
  - Cases: [Bun: how it was checked][bun-checked], [GitHub: how it was checked][gh-checked], [ts-rust: how it was checked][tsr-checked], [Ladybird: how it was checked][lb-checked], [Datadog: how it was checked][ddg-checked], [Mindstone: how it was checked][mnd-checked], [Checkly: how it was checked][chk-checked].
  - Against: An outside critic asks why a suite that let the old bugs through should vet the new code ([Bun][bun-wrong]); Bun still shipped known regressions after a fully green run. The suite itself often moved: Ladybird's pull request edited 42 expected-output files of its own tests while test262 stayed unchanged ([Ladybird][lb-wrong]); Checkly changed its harness during the move and still missed production's queue layout ([Checkly][chk-wrong]); Mindstone's suite was written by agents during the move, and its first version asserted nothing ([Mindstone][mnd-wrong]); Datadog's tests checked only fixtures, so it added weeks of live comparison ([Datadog][ddg-checked]).
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], agrees.
- **TST-2** [stated] Before the move starts, make sure tests cover the behaviour that matters and that agents can run them; the gaps were where missing-feature regressions came from.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: GPT-6.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: practices to copy][spo-practices], [ts-rust: what went wrong][tsr-wrong], [Spartacus: what went wrong][spa-wrong], [Checkly: what went wrong][chk-wrong].
  - Against: Google leaned on the owning teams' existing regression suites and slow rollouts rather than new tests ([Google][goo-checked]); Intel left the tests out on purpose and got a build that crashed ([Intel][int-wrong]).
- **TST-3** [stated] Equivalence with the old system is not correctness: a faithful port carries the old bugs, and tests can assert the wrong behaviour with confidence.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [Bun: what went wrong][bun-wrong], [GitHub: what went wrong][gh-wrong].
  - Against: The Bun rewrite also fixed many bugs that the old code had ([Bun][bun-wrong]), so a port is not only a copy of old defects.
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], contradicts: equality with the reference also carries the reference's bugs and its wrong tests into the port.
- **TST-4** [ours] Run the oracle on the build configuration you ship; debug-only assertions and checks hid regressions that appeared only in release builds.
  - Old system as oracle: partly. Depends on model ability: no. Strength: weak. Era: 2026; newest: Claude Fable 5.x.
  - Cases: [Bun: what went wrong][bun-wrong].
  - Against: None found.
- **TST-5** [stated] Where the old system has thin tests, record its inputs and outputs (or have a separate agent write equivalence tests) and replay them against the new code.
  - Old system as oracle: yes. Depends on model ability: partly. Strength: medium. Era: 2024–2026; newest: Claude Fable (version unstated).
  - Cases: [Intel: what worked][int-worked], [Slack: what worked][slk-worked], [Mindstone: who did what][mnd-who], [Checkly: how it was checked][chk-checked].
  - Against: Full coverage through a library's public functions is often out of reach, and generated tests can be vacuous ([Intel][int-wrong]); Mindstone's first agent-written suite asserted nothing and was regenerated under stricter rules ([Mindstone][mnd-wrong]). The Pokémon port ran both versions live on seeded inputs rather than recording, and does not say the old tests were thin ([Pokémon][vjx-checked]).
- **TST-6** [stated] Make the baseline green before agents start: fix tests that already fail and make golden files regenerable, or correct changes stall at the gate.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Google: what went wrong][goo-wrong], [Spotify: how it was checked][spo-checked].
  - Against: Spartacus's refined protocol lets an agent go on from a red baseline, noted as an old failure, and stops only when the tests will not start ([Spartacus][spa-checked]).
- **TST-7** [ours] When a move touches numeric types or sums (a widened ID, a new engine's arithmetic), test values beyond the old range at real data sizes; small examples pass while overflow survives.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Gemini (internal).
  - Cases: [Google: what was migrated][goo-migrated], [Temporal: what went wrong][tmp-wrong].
  - Against: None found.
- **TST-8** [ours] When the migrated artefact is itself a test, passing is a weak oracle; also compare test counts, coverage and intent file by file.
  - Old system as oracle: yes. Depends on model ability: no. Strength: weak. Era: 2024–2026; newest: Claude 2.x.
  - Cases: [Slack: practices to copy][slk-practices], [Airbnb: how it was checked][air-checked], [Uber: how it was checked][ubr-checked], [Asana: how it was checked][asa-checked].
  - Against: None found; Airbnb says coverage and intent were kept, and Asana that coverage rose, but neither shows a method or figures.
- **TST-9** [stated] Treat performance as part of the contract: benchmark end to end against a deterministic local stand-in for slow services, and count slowdowns as regressions.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [GitHub: numbers][gh-numbers], [Ladybird: how it was checked][lb-checked].
  - Against: GitHub's own before-and-after mixes in other changes from the same months, which the author flags.
- **TST-10** [ours] Keep the agent that writes code apart from the one that writes its tests; one generation producing both invites checks that cannot fail.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: GPT-5.x.
  - Cases: [Intel: what went wrong][int-wrong], [Intel: practices to copy][int-practices].
  - Against: When generated separately, Intel's agent-written tests worked as well as expert ones as feedback ([Intel][int-worked]).
- **TST-11** [stated] Test the prompts too: rerun a golden set of before-and-after examples after each prompt edit or model trial; small wording changes swung results.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2024–2025; newest: GPT-4o.
  - Cases: [Zalando: how it was checked][zal-checked], [Zalando: what went wrong][zal-wrong].
  - Against: None found.
- **TST-12** [stated] Check parity on what users and downstream systems see: capture screens, raw events or query answers from old and new at the same points, ignoring values that vary per run.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2024–2026; newest: Claude (version unstated).
  - Cases: [Shopify: how it was checked][shp-checked], [Zalando: how it was checked][zal-checked], [Datadog: how it was checked][ddg-checked], [Temporal: how it was checked][tmp-checked].
  - Against: None found; Zalando calls for visual testing without saying how it compared the two, and Shopify does not say how far parity reached beyond the flows engineers ran ([Shopify][shp-wrong]).
- **TST-13** [stated] Make the old code's output deterministic and dumpable before porting, then run old and new side by side on real or seeded inputs and stop at the first difference.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: unstated.
  - Cases: [Ladybird: how it was checked][lb-checked], [Ladybird: who did what][lb-who], [Pokémon: how it was checked][vjx-checked].
  - Against: Checkly and Mindstone masked values that vary per run (typed placeholders, audited wildcards) instead of making the old code deterministic ([Checkly][chk-checked], [Mindstone][mnd-checked]); Ladybird does not say how long the side-by-side browsing ran or which sites it covered ([Ladybird][lb-wrong]).
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], agrees.
- **TST-14** [stated] Never make coverage alone the target of agent-written tests: it rose while the tests asserted nothing. Fail any test that leaves a side effect or response field unasserted.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: OpenAI Codex 5.x.
  - Cases: [Mindstone: what went wrong][mnd-wrong], [Mindstone: what worked][mnd-worked].
  - Against: None found; Mindstone's final pipeline still opens with a coverage push, and it counts no hollow tests before or after the rule ([Mindstone][mnd-who], [numbers][mnd-numbers]).
- **TST-15** [stated] Model the harness's surrounding infrastructure on production down to each queue and table; the agent builds to what the tests show, so a simplified layout ships as a bug.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: weak. Era: 2026; newest: Claude Fable (version unstated).
  - Cases: [Checkly: what went wrong][chk-wrong].
  - Against: None found; one case, whose harness recorded outputs from the old daemon yet missed what only production's queue routing showed.

[air-checked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#how-it-was-checked
[asa-checked]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#how-it-was-checked
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[chk-checked]: ../cases/2026-09-01-checkly-nodejs-to-go.md#how-it-was-checked
[chk-wrong]: ../cases/2026-09-01-checkly-nodejs-to-go.md#what-went-wrong
[ddg-checked]: ../cases/2026-06-23-datadog-foundationdb-to-postgres.md#how-it-was-checked
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-migrated]: ../cases/2025-04-13-google-int64-ids.md#what-was-migrated
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[lb-checked]: ../cases/2026-02-23-ladybird-libjs-rust.md#how-it-was-checked
[lb-who]: ../cases/2026-02-23-ladybird-libjs-rust.md#who-did-what
[lb-wrong]: ../cases/2026-02-23-ladybird-libjs-rust.md#what-went-wrong
[mnd-checked]: ../cases/2026-07-06-mindstone-go-to-typescript.md#how-it-was-checked
[mnd-numbers]: ../cases/2026-07-06-mindstone-go-to-typescript.md#numbers
[mnd-who]: ../cases/2026-07-06-mindstone-go-to-typescript.md#who-did-what
[mnd-worked]: ../cases/2026-07-06-mindstone-go-to-typescript.md#what-worked
[mnd-wrong]: ../cases/2026-07-06-mindstone-go-to-typescript.md#what-went-wrong
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[shp-wrong]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-went-wrong
[slk-practices]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#practices-to-copy
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[spa-checked]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#how-it-was-checked
[spa-wrong]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-went-wrong
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[tmp-checked]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#how-it-was-checked
[tmp-wrong]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#what-went-wrong
[tsr-checked]: ../cases/2026-10-07-ping-tsgo-to-rust.md#how-it-was-checked
[tsr-wrong]: ../cases/2026-10-07-ping-tsgo-to-rust.md#what-went-wrong
[ubr-checked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#how-it-was-checked
[vjx-checked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#how-it-was-checked
[zal-checked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#how-it-was-checked
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
[k-port-with-equality-tests]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-01-03-port-with-equality-tests.md
