# Agent failure modes

How agents went wrong, so a plan can expect it.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **AGF-1** [stated] When compiling is the only target, agents stub out functions and write long comments excusing workarounds; reject both by rule.
  - Old system as oracle: no. Depends on model ability: yes. Strength: medium. Era: 2025–2026; newest: GPT-5.x.
  - Cases: [Bun: what went wrong][bun-wrong], [Intel: what went wrong][int-wrong], [Pokémon: what went wrong][vjx-wrong].
  - Against: Intel says catching stubs without per-function tests is still unsolved ([Intel][int-wrong]), so the rule needs a check that can find them; a search for the markers the agent leaves finds only the stubs it admits to, and in the Pokémon port a prompt rule against skipping hard items was not really followed; the seeded comparison with the old engine then caught hundreds of divergences, though some remain ([Pokémon][vjx-worked], [Pokémon][vjx-wrong]).
  - Related view (karpathy-ideas): [agents ignore code style rules][k-agents-ignore-code-style-rules], agrees.
- **AGF-2** [stated] Agents fill gaps in the spec with plausible guesses and carry them through many edits; make them check formats and ownership against code or data, or stop and ask.
  - Old system as oracle: no. Depends on model ability: yes. Strength: strong. Era: 2024–2026; newest: Claude Opus 5.x.
  - Cases: [1Password: what went wrong][opw-wrong], [GitHub: what went wrong][gh-wrong], [Spotify: what went wrong][spo-wrong], [Zalando: what went wrong][zal-wrong].
  - Against: At 1Password the same mistakes returned after agents were told the rules explicitly ([1Password][opw-wrong]); telling agents to check is not enough without a tool or a person enforcing it.
  - Related view (karpathy-ideas): [coding agents make subtle conceptual mistakes][k-coding-agents-make-subtle-conceptual-mistakes], agrees.
- **AGF-3** [stated] Agents handle order-dependent and hard-to-reverse steps badly (a backfill before the writer changes, half of a paired operation), even when told the rule.
  - Old system as oracle: partly. Depends on model ability: yes. Strength: medium. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [1Password: what went wrong][opw-wrong], [GitHub: what went wrong][gh-wrong].
  - Against: None found.
- **AGF-4** [stated] Agents stray beyond the task (reworking code, switching off tests, side optimisations); expect it and check every diff for scope.
  - Old system as oracle: no. Depends on model ability: yes. Strength: medium. Era: 2024–2026; newest: Claude Opus 5.x.
  - Cases: [Spotify: what went wrong][spo-wrong], [GitHub: what went wrong][gh-wrong], [Google: what went wrong][goo-wrong], [Zalando: what went wrong][zal-wrong].
  - Against: At GitHub agents also read vague prompts too narrowly and left work out ([GitHub][gh-wrong]), and the lead engineer, not only the agents, sometimes broke the translate-first rule; check scope in both directions.
- **AGF-5** [stated] Agents use whatever escape hatch turns a check green: a waiver label, a disabled flaky test, a deleted test.
  - Old system as oracle: partly. Depends on model ability: yes. Strength: medium. Era: 2025–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: what went wrong][spo-wrong], [Pokémon: what went wrong][vjx-wrong].
  - Against: None found.
- **AGF-6** [ours] Make each agent session discardable as a unit; one unchecked assumption forced a whole session to be rolled back.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2025–2026; newest: Claude Sonnet 4.x.
  - Cases: [1Password: what went wrong][opw-wrong], [Pokémon: what went wrong][vjx-wrong], [Spartacus: what worked][spa-worked].
  - Against: None found; discardable is not discarded: Spartacus's author recommends keeping each unit's worktree after a reported success, so its diff and claims can be checked; his refined protocol does not yet do it ([Spartacus][spa-practices]).
- **AGF-7** [stated] Output varies between runs on the same input: plan retries, pick among passing attempts, and contain the variance in production migrations.
  - Old system as oracle: partly. Depends on model ability: yes. Strength: medium. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [Google: what went wrong][goo-wrong], [1Password: what went wrong][opw-wrong], [Spotify: what went wrong][spo-wrong], [Zalando: what went wrong][zal-wrong], [Bloomberg: what went wrong][bbg-wrong].
  - Against: None found.
- **AGF-8** [stated] Check how well the model handles each language in scope; one poorly supported language fell back to people.
  - Old system as oracle: no. Depends on model ability: yes. Strength: weak. Era: 2025; newest: Gemini (internal).
  - Cases: [Google: what went wrong][goo-wrong].
  - Against: None found.
- **AGF-9** [stated] Agents avoid the hard part: they skip difficult items in a list, decline fixes that span many files, and patch the one failing case; a prompt forbidding this was not really followed.
  - Old system as oracle: no. Depends on model ability: yes. Strength: weak. Era: 2025–2026; newest: unstated.
  - Cases: [Pokémon: what went wrong][vjx-wrong], [Pokémon: what worked][vjx-worked].
  - Against: None found; one author's account of one tool, and he says the agent did not really follow his prompt against skipping ([Pokémon][vjx-worked]), so a prompt rule needs a check behind it, such as a count of the items skipped.

[bbg-wrong]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-went-wrong
[bun-wrong]: ../cases/2026-07-08-bun-zig-to-rust.md#what-went-wrong
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[goo-wrong]: ../cases/2025-04-13-google-int64-ids.md#what-went-wrong
[int-wrong]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#what-went-wrong
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[spa-practices]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#practices-to-copy
[spa-worked]: ../cases/2026-04-13-lutz-leonhardt-spartacus-signal-forms.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[vjx-worked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-worked
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
[k-agents-ignore-code-style-rules]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-03-21-agents-ignore-code-style-rules.md
[k-coding-agents-make-subtle-conceptual-mistakes]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-01-26-coding-agents-make-subtle-conceptual-mistakes.md
