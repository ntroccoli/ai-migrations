# Verification loops and gates

The automated checks around each agent change, and what they can and cannot prove.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **VER-1** [stated] A clean compile or a green CI run shows the parts fit together, not that behaviour survived; plan a behavioural check after it.
  - Old system as oracle: partly. Depends on model ability: no. Strength: strong. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Intel: what went wrong][int-wrong], [Spotify: what went wrong][spo-wrong], [Zalando: what went wrong][zal-wrong], [Bloomberg: what went wrong][bbg-wrong], [Pokémon: what went wrong][vjx-wrong], [Spartacus: how it was checked][spa-checked], [PagerDuty: what went wrong][pgd-wrong].
  - Against: In a memory-safe target, one class of memory bugs does become a compile error ([Bun][bun-checked]), so the compiler is a real but narrow check; Bloomberg calls a clean compile a strong sign of a right change when only build files move, though it still ran the unit tests after the build ([Bloomberg][bbg-worked]).
- **VER-2** [stated] Order gates from cheap to costly and drop a candidate at its first failure, with cheap no-change checks (whitespace only, unchanged syntax tree) up front.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Gemini (internal).
  - Cases: [Google: how it was checked][goo-checked], [Uber: how it was checked][ubr-checked].
  - Against: Airbnb ran the tests before lint and type checks and retried a failed step instead of dropping the file ([Airbnb][air-worked]); Slack and Spotify send failures back to the model ([Slack][slk-worked], [Spotify][spo-checked]).
- **VER-3** [stated] Retry a failed unit with its latest errors in a fresh prompt, cap the attempts, and hand what remains to people; this fits independent units, such as one file each.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: strong. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [Airbnb: what worked][air-worked], [Google: who did what][goo-who], [Spotify: numbers][spo-numbers], [Bloomberg: who did what][bbg-who].
  - Against: Google's developers could not tell how many retries a file would need ([Google][goo-wrong]); test feedback helped one model on Intel's battery far more than another ([Intel][int-worked]); Uber neither retried nor handed over files whose tests failed but put them back on the old framework, as diagnosing each was impractical ([Uber][ubr-wrong]); in Bun's port, where units depended on each other, the engineer fixed the workflow prompt instead of handing units to people ([Bun][bun-practices]).
- **VER-4** [stated] Give the agent one verify tool that picks the right build and test runner and returns short errors, and run it automatically before the agent may finish.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what worked][spo-worked], [Spotify: practices to copy][spo-practices].
  - Against: GitHub's agents called the raw build and test commands directly, in large volume, and still finished ([GitHub][gh-numbers]).
- **VER-5** [stated] Before trusting a green suite, confirm the tests really ran: compare executed tests and assertions with the baseline, and count skips as failures.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2024–2026; newest: Claude Fable 5.x.
  - Cases: [Bun: how it was checked][bun-checked], [Bun: practices to copy][bun-practices], [Slack: what went wrong][slk-wrong], [Spartacus: what went wrong][spa-wrong].
  - Against: None found; in Spartacus's second run the tests did run and pass, and in our reading a changed email rule still got through ([Spartacus][spa-wrong]): a run check does not replace coverage.
- **VER-6** [stated] Check output against machine-readable contracts (generated signatures, schema-compatibility checks) so a dropped or changed interface fails mechanically.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [Intel: what worked][int-worked], [GitHub: what went wrong][gh-wrong].
  - Against: At GitHub the agent silenced the schema check with its waiver label and only human review caught it ([GitHub][gh-wrong]); a contract check needs its bypass behind approval.
- **VER-7** [stated] Define done as an empty list of change sites produced by deterministic tooling and rerun on a schedule, never as the agent's own report.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Google: what worked][goo-worked], [1Password: what worked][opw-worked], [Pokémon: what worked][vjx-worked], [Spartacus: what went wrong][spa-wrong], [GitLab: what went wrong][glb-wrong].
  - Against: Google's reference search stops after a set number of hops and can miss sites ([Google][goo-wrong]); the Pokémon port's list came from markers the agent itself wrote, so it misses stubs it left unmarked ([Pokémon][vjx-worked]).
- **VER-8** [stated] Rank failures by cost: no change is cheap, a red change costs an engineer, a green but wrong change costs trust; aim verification at the last kind.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [Spotify: what went wrong][spo-wrong], [GitHub: how it was checked][gh-checked], [Zalando: what went wrong][zal-wrong], [Bloomberg: what went wrong][bbg-wrong].
  - Against: None found.
- **VER-9** [stated] Where the target has no tests the agent cannot check itself: leave it out, require tests first, or budget for owners to test each change.
  - Old system as oracle: partly. Depends on model ability: no. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: how it was checked][spo-checked], [Spotify: practices to copy][spo-practices].
  - Against: Intel translated without tests on purpose to measure the repair cost afterwards ([Intel][int-checked]).
- **VER-10** [stated] Where one change repeats across many targets, keep the pass/fail gates deterministic as the model writes more; an error a model-run gate lets through can spread to every target.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude Opus 4.x.
  - Cases: [Bloomberg: what worked][bbg-worked].
  - Against: Disagree: Google's gates include the model agreeing its change was needed ([Google][goo-checked]), Spotify gates each PR with an LLM judge ([Spotify][spo-checked]), Shopify puts two adversarial reviewers (likely agents) on every checkpoint ([Shopify][shp-checked]), and Bun's reviewer agents, seeing only the diff, caught bugs ([Bun][bun-checked]) and, once a rule was added, rejected stubs ([Bun][bun-wrong]).
- **VER-11** [stated] Before building the pipeline, judge how late a wrong change first fails; changes that only the owner's deploy could check were merged less and rejected more.
  - Old system as oracle: partly. Depends on model ability: no. Strength: weak. Era: 2025–2026; newest: Claude Opus 4.x.
  - Cases: [Bloomberg: what worked][bbg-worked], [Bloomberg: what went wrong][bbg-wrong].
  - Against: None found; Bloomberg's authors cannot separate this from the population, the earlier start, the perceived risk of each move and a part-time review helper ([Bloomberg][bbg-worked]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[bbg-who]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#who-did-what
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-practices]: ../cases/2026-07-08-bun-zig-to-rust.md#practices-to-copy
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-checked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#how-it-was-checked
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[glb-wrong]: ../cases/2026-07-08-gitlab-rate-limiting.md#what-went-wrong
[goo-checked]: ../cases/2025-04-13-google-int64-ids.md#how-it-was-checked
[goo-who]: ../cases/2025-04-13-google-int64-ids.md#who-did-what
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-checked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#how-it-was-checked
[int-worked]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-worked
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[pgd-wrong]: ../cases/2026-04-13-pagerduty-rundeck-grails-7.md#what-went-wrong
[shp-checked]: ../cases/2026-09-10-shopify-react-native-to-native.md#how-it-was-checked
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spa-checked]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#how-it-was-checked
[spa-wrong]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-went-wrong
[spo-checked]: ../cases/2025-11-06-spotify-honk.md#how-it-was-checked
[spo-numbers]: ../cases/2025-11-06-spotify-honk.md#numbers
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[ubr-checked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#how-it-was-checked
[ubr-wrong]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-went-wrong
[vjx-worked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-worked
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
