# Knowledge capture

Turning failures and logs into lasting improvements.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **KNW-1** [stated] When a failure recurs, fix what generates the code (prompt, reviewer rule, skill, evaluation, harness), not only the output; the second time is the trigger.
  - Old system as oracle: no. Depends on model ability: no. Strength: strong. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [Bun: what worked][bun-worked], [GitHub: what worked][gh-worked], [Airbnb: what worked][air-worked], [Uber: what worked][ubr-worked], [Zalando: how it was checked][zal-checked], [Shopify: how it was checked][shp-checked], [Bloomberg: what worked][bbg-worked], [Pokémon: what worked][vjx-worked], [PagerDuty: what worked][pgd-worked], [Mindstone: what worked][mnd-worked], [Checkly: how it was checked][chk-checked].
  - Against: Fixing the instructions did not always hold: the Pokémon port's agent kept hard-coding behaviour after being told not to ([Pokémon][vjx-wrong]), and 1Password's ordering errors persisted under explicit rules ([1Password][opw-wrong]).
- **KNW-2** [stated] Stamp each unit with its status, tune against the largest failing group using a small sample, then sweep all units again.
  - Old system as oracle: partly. Depends on model ability: no. Strength: strong. Era: 2024–2026; newest: Gemini (internal).
  - Cases: [Airbnb: what worked][air-worked], [Slack: what worked][slk-worked], [Google: what worked][goo-worked], [Uber: what worked][ubr-worked].
  - Against: None found.
- **KNW-3** [stated] Keep structured session logs from the start; they later answered where time went and what people did, and became evaluations.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: numbers][gh-numbers], [GitHub: what worked][gh-worked].
  - Against: GitHub's split of the engineer's messages by intent was labelled by an LLM, not checked by a person ([GitHub][gh-numbers]).
- **KNW-4** [stated] A compacted or fresh session forgets what the last one learned; keep the method in files it rereads (instructions, one debug script) and find work by search, not a growing notes file.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Pokémon: what went wrong][vjx-wrong], [Pokémon: what worked][vjx-worked], [Datadog: what worked][ddg-worked].
  - Against: Disagree: PagerDuty's author credits a growing file of fix patterns with faster fixes later in the run and in the next upgrade, unmeasured ([PagerDuty][pgd-worked]). The Pokémon account gives no measure of time saved, and a search finds only the markers the agent wrote, not stubs it left unmarked ([Pokémon][vjx-worked]); such files also go stale: at Temporal a migration left an agent guide pointing at deleted code, and nothing flagged it ([Temporal][tmp-wrong]).
- **KNW-5** [stated] Mark temporary migration code the day you write it with what it is for and how to remove it; an agent can later find the notes and work through them as the removal list.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: unstated.
  - Cases: [Temporal: what worked][tmp-worked].
  - Against: None found; one team's account, its prompt record misses the early weeks, and it gives no count of leftovers the notes did not cover ([Temporal][tmp-wrong]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[bun-worked]: ../cases/2026-07-08-bun-zig-to-rust.md#what-worked
[chk-checked]: ../cases/2026-09-01-checkly-nodejs-to-go.md#how-it-was-checked
[ddg-worked]: ../cases/2026-06-23-datadog-foundationdb-to-postgres.md#what-worked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[mnd-worked]: ../cases/2026-07-06-mindstone-go-to-typescript.md#what-worked
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[pgd-worked]: ../cases/2026-04-13-pagerduty-rundeck-grails-7.md#what-worked
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[tmp-worked]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#what-worked
[tmp-wrong]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#what-went-wrong
[ubr-worked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-worked
[vjx-worked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-worked
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-checked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#how-it-was-checked
