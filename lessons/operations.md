# Machines and operations

Running many agents on real machines, and keeping the result healthy after merge.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **OPS-1** [stated] Parallel agents saturate CPU, disk and I/O: size the machine first, let one agent build at a time through a lease, and push full test runs to CI.
  - Old system as oracle: no. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Bun: what went wrong][bun-wrong].
  - Against: At Asana, CI results that differed from local checks, with a slow lint step, were where people had to step in most ([Asana][asa-wrong]): pushing runs to CI helps only if CI matches local runs.
- **OPS-2** [stated] Contain heavy tests with operating-system limits (control groups, process namespaces, disk quotas); asking the agent to be careful contains nothing.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: Claude Fable 5.x.
  - Cases: [Bun: what went wrong][bun-wrong], [Spartacus: what went wrong][spa-wrong].
  - Against: Bun's limits covered memory, CPU and processes, yet the disk still filled and crashed the machine several times ([Bun][bun-wrong]); no case shows disk quotas in use.
- **OPS-3** [stated] Make the inner loop fast (module splits, build caches, host I/O) before scaling agents; their time goes mostly to reading, building and testing, not writing.
  - Old system as oracle: no. Depends on model ability: partly. Strength: strong. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [GitHub: numbers][gh-numbers], [Bun: practices to copy][bun-practices], [Shopify: what went wrong][shp-wrong], [Asana: what went wrong][asa-wrong], [Mindstone: what worked][mnd-worked].
  - Against: At Shopify the slow step was not the build: hot reload helped but did not fix it, because agents read and drove the app through simulators; its fix is a headless path into the app's logic ([Shopify][shp-worked]).
- **OPS-4** [stated] List what the old runtime supplied silently (time zone, environment, process flags) and test every platform you ship; one green platform says little.
  - Old system as oracle: yes. Depends on model ability: no. Strength: medium. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: what went wrong][spo-wrong].
  - Against: None found.
- **OPS-5** [stated] Keep hardening after merge: repeated security review, round-the-clock fuzzing and leak tracking, with people reviewing the fixes they produce.
  - Old system as oracle: no. Depends on model ability: no. Strength: weak. Era: 2026; newest: Claude Fable 5.x.
  - Cases: [Bun: how it was checked][bun-checked].
  - Against: Disagree: the Zig creator says Bun was not fuzzing before the port, against the post's claim ([Bun][bun-wrong]).
- **OPS-6** [stated] Run bulk change jobs, by agent or by rule, as scheduled batches sized to the infrastructure, sort results into status groups, and rerun only what is stuck.
  - Old system as oracle: partly. Depends on model ability: no. Strength: strong. Era: 2024–2026; newest: Gemini (internal).
  - Cases: [Slack: what worked][slk-worked], [Google: what worked][goo-worked], [Airbnb: what worked][air-worked], [Uber: what worked][ubr-worked].
  - Against: Batches sized to the infrastructure can still outrun the people receiving them: Bloomberg's PRs went out in a few bursts while merges came at a steady rate of their own ([Bloomberg][bbg-wrong]).
- **OPS-7** [ours] Load-test the new code for blocking and resource exhaustion; one port froze its interface on a synchronous call across the bridge.
  - Old system as oracle: partly. Depends on model ability: no. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **OPS-8** [ours] Check the headroom of shared services old and new paths both hit, such as caches and rate-limit stores; one team's store lacked room for double load, and raising it took infrastructure work.
  - Old system as oracle: no. Depends on model ability: no. Strength: weak. Era: 2026; newest: Claude (version unstated).
  - Cases: [GitLab: what went wrong][glb-wrong].
  - Against: None found; one case, its limit was known before the migration began, and the source does not say the side-by-side running brought it back.

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[asa-wrong]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#what-went-wrong
[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-checked]: ../cases/2026-07-08-bun-zig-to-rust.md#how-it-was-checked
[bun-practices]: ../cases/2026-07-08-bun-zig-to-rust.md#practices-to-copy
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-numbers]: ../cases/2026-09-16-github-copilot-runtime-rust.md#numbers
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[glb-wrong]: ../cases/2026-07-08-gitlab-rate-limiting.md#what-went-wrong
[goo-worked]: ../cases/2025-04-13-google-int64-ids.md#what-worked
[mnd-worked]: ../cases/2026-07-06-mindstone-go-to-typescript.md#what-worked
[shp-worked]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-worked
[shp-wrong]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-went-wrong
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[spa-wrong]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-went-wrong
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[ubr-worked]: ../cases/2026-04-07-uber-junit4-to-junit5.md#what-worked
