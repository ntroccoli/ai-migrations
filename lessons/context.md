# Context and prompts

What goes into the model's context, and how prompts are written.

Evidence base: every lesson here comes from the **migrations** in [this collection](../index.md), all done with AI except one rule-based contrast case; many apply to large engineering work done with AI agents generally.

`[stated]`: a source says it or reports it as what worked or failed. `[ours]`: our inference from what a source reports. "Old system as oracle" (`yes`, `partly`, `no`): does the evidence rely on the old system (its tests, its outputs, its users' reports) to tell right from wrong; it says where the evidence came from, not where the lesson applies. "Depends on model ability" (`yes`, `partly`, `no`): `yes` when the lesson states what models or agents can or cannot do, `partly` when it is a process whose need comes from such a behaviour, `no` when it holds whatever the model; the index marks a `yes` lesson whose newest case is over a year old as possibly outdated. "Era": the years the cited cases ran (their publication year when they give no period), then the newest model family: the family of the most recent cited case that names a model (its highest version when it names several), `unstated` when none names one; each case lists all its models. "Strength", capped by the cases in "Cases" (the validator checks it): `strong` needs two or more cases, or one whose source shows its data, and at least one case whose author does not sell the tool; `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a seller's case weighs less: a lesson that rests only on such cases is at most `medium`.

- **CTX-1** [stated] Choosing the right context (nearby files, good examples, runtime data, exact mapping tables) moved results more than polishing the prompt wording.
  - Old system as oracle: partly. Depends on model ability: yes. Strength: strong. Era: 2024–2026; newest: Claude (version unstated).
  - Cases: [Airbnb: what worked][air-worked], [Slack: what went wrong][slk-wrong], [Spotify: what worked][spo-worked], [Zalando: what worked][zal-worked], [Asana: what worked][asa-worked], [Datadog: what worked][ddg-worked].
  - Against: Disagree: Spotify treats prompt writing as the hard skill users lack ([Spotify][spo-wrong]). Zalando credits a system prompt and clearer wording as well as mappings and examples ([Zalando][zal-worked]). Asana found a richer setup (a long conventions prompt, a notes file) did worse than a short goal on a well-kept code base ([Asana][asa-wrong]).
  - Related view (karpathy-ideas): [context engineering][k-context-engineering], agrees.
- **CTX-2** [stated] Give the model the runtime facts a person would look at, such as the rendered output of each test, not only the source file.
  - Old system as oracle: yes. Depends on model ability: partly. Strength: medium. Era: 2024–2026; newest: Claude Opus 4.x.
  - Cases: [Slack: what worked][slk-worked], [Slack: practices to copy][slk-practices], [Zalando: what went wrong][zal-wrong], [Shopify: what worked][shp-worked], [Bloomberg: what worked][bbg-worked].
  - Against: None found.
- **CTX-3** [stated] Write field and API mappings out explicitly, such as in tables, and have a person check them against what each side means; a guide adapted from the human one, and mappings by name, went wrong.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2024–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what worked][spo-worked], [Spotify: practices to copy][spo-practices], [Zalando: what went wrong][zal-wrong].
  - Against: At Asana a much longer written guide to the target's conventions made results worse, and the code base's own examples sufficed ([Asana][asa-wrong]); more text was not better.
- **CTX-4** [stated] State the whole end state, its preconditions and when not to act; agents read vague goals narrowly and leave parts of the work out of scope.
  - Old system as oracle: no. Depends on model ability: partly. Strength: medium. Era: 2024–2026; newest: Claude Opus 5.x.
  - Cases: [GitHub: what went wrong][gh-wrong], [Spotify: practices to copy][spo-practices], [1Password: practices to copy][opw-practices], [Zalando: what went wrong][zal-wrong], [Gatsby blog: practices to copy][rmg-practices], [Mindstone: practices to copy][mnd-practices], [GitLab: what went wrong][glb-wrong].
  - Against: At 1Password the same ordering mistakes came back after the agents were told explicitly about order and constraints ([1Password][opw-wrong]): a clear statement is not enough on its own.
  - Related view (karpathy-ideas): [success criteria not steps][k-success-criteria-not-steps], agrees.
- **CTX-5** [stated] Put one change in each prompt; prompts bundling several changes ran out of context or stopped halfway.
  - Old system as oracle: no. Depends on model ability: yes. Strength: medium. Era: 2024–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what went wrong][spo-wrong], [Spotify: practices to copy][spo-practices], [Zalando: what went wrong][zal-wrong], [Datadog: what went wrong][ddg-wrong].
  - Against: Zalando put about three components in each prompt and held accuracy by capping the prompt's size instead ([Zalando][zal-numbers], [grouping][zal-worked]); the limit may be context size, not the number of changes.
- **CTX-6** [stated] Prefer large, static, version-controlled prompts and few tools for predictability; letting the agent fetch context through many tools adds variance.
  - Old system as oracle: no. Depends on model ability: yes. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what worked][spo-worked].
  - Against: Disagree: Spotify is now letting its agent gather context itself ([Spotify][spo-wrong]), and GitHub ran broad tool sets and finished ([GitHub][gh-worked]). Large prompts also hurt: a longer conventions prompt made Asana's results worse ([Asana][asa-wrong]), and Zalando's accuracy fell as its prompts grew ([Zalando][zal-wrong]).
- **CTX-7** [stated] Ask the agent after each session what its prompt lacked, and fold the answer into the next version of the prompt.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: practices to copy][spo-practices].
  - Against: None found.
- **CTX-8** [stated] Fit the prompt to the agent: a weak home-built loop needed step-by-step lists, while a stronger agent did better with the end state and room to plan.
  - Old system as oracle: no. Depends on model ability: yes. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Spotify: what worked][spo-worked], [Asana: what worked][asa-worked], [Asana: what went wrong][asa-wrong].
  - Against: Asana credits its code base (the target library chosen years before, test helpers, conventions, examples) more than its prompt or its agent, so it does not isolate the agent ([Asana][asa-worked]); 1Password's templates and playbook show step detail still helps on bounded edits ([1Password][opw-worked]).
- **CTX-9** [stated] When the context budget is small, choose context by fixed rules: full bodies of nearby functions, signatures for the rest, the hardest callers first.
  - Old system as oracle: partly. Depends on model ability: partly. Strength: medium. Era: 2026; newest: GPT-5.x.
  - Cases: [Intel: practices to copy][int-practices].
  - Against: Airbnb, with a large context budget, filled prompts with dozens of related files, also chosen by rules ([Airbnb][air-worked]); the lesson is for small budgets.
- **CTX-10** [stated] Agents learn from the repository as it stands: fix docs and agent guidance that still favour or point at the old code, and awkward examples, or they spread.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: unstated.
  - Cases: [Asana: what went wrong][asa-wrong], [Temporal: what went wrong][tmp-wrong].
  - Against: None found; Temporal's stale guide sends agents to deleted code, but the harm is predicted, not observed ([Temporal][tmp-wrong]).
- **CTX-11** [stated] Keep each unit small enough for the agent to read whole, such as one function per file in the target; very long files were refused or read in loose chunks and filled the context.
  - Old system as oracle: no. Depends on model ability: yes. Strength: weak. Era: 2025–2026; newest: unstated.
  - Cases: [Pokémon: what worked][vjx-worked], [Pokémon: what went wrong][vjx-wrong].
  - Against: None found; the author did not split the original's files, for fear of changing behaviour, so only half the pair was split.
- **CTX-12** [stated] Before porting, have a model write down why each old function exists and what behaviour it protects, and give those notes with every prompt; they cut the rounds per unit.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2025–2026; newest: Claude (version unstated).
  - Cases: [Datadog: what worked][ddg-worked].
  - Against: None found; one team's account, with no count of rounds before and after the notes ([Datadog][ddg-wrong]). Such notes can invent claims: Mindstone's agent-written discovery reports needed citation checks and a review by models from three makers ([Mindstone][mnd-wrong]).
- **CTX-13** [stated] Keep a rule for agents in an instruction file beside the code it governs, not at the root, and name the test enforcing it, so a reader can tell when the rule has expired.
  - Old system as oracle: no. Depends on model ability: partly. Strength: weak. Era: 2026; newest: unstated.
  - Cases: [Temporal: what worked][tmp-worked].
  - Against: None found; one team's account, with no measure of the context saved, and the same team left another instruction file stale ([Temporal][tmp-wrong]).

[air-worked]: ../cases/2025-04-01-airbnb-enzyme-to-rtl.md#what-worked
[asa-worked]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#what-worked
[asa-wrong]: ../cases/2026-08-07-asana-enzyme-to-rtl.md#what-went-wrong
[bbg-worked]: ../cases/2026-11-03-bloomberg-python-cpp-uplift.md#what-worked
[ddg-worked]: ../cases/2026-06-23-datadog-foundationdb-to-postgres.md#what-worked
[ddg-wrong]: ../cases/2026-06-23-datadog-foundationdb-to-postgres.md#what-went-wrong
[gh-worked]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-worked
[gh-wrong]: ../cases/2026-09-16-github-copilot-runtime-rust.md#what-went-wrong
[glb-wrong]: ../cases/2026-07-08-gitlab-rate-limiting.md#what-went-wrong
[int-practices]: ../cases/2026-08-24-intel-ideas-c-to-rust.md#practices-to-copy
[mnd-practices]: ../cases/2026-07-06-mindstone-go-to-typescript.md#practices-to-copy
[mnd-wrong]: ../cases/2026-07-06-mindstone-go-to-typescript.md#what-went-wrong
[opw-practices]: ../cases/2026-04-20-1password-monolith-refactor.md#practices-to-copy
[opw-worked]: ../cases/2026-04-20-1password-monolith-refactor.md#what-worked
[opw-wrong]: ../cases/2026-04-20-1password-monolith-refactor.md#what-went-wrong
[rmg-practices]: ../cases/2025-08-09-robert-marshall-gatsby-to-nextjs.md#practices-to-copy
[shp-worked]: ../cases/2026-09-10-shopify-react-native-to-native.md#what-worked
[slk-practices]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#practices-to-copy
[slk-worked]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-worked
[slk-wrong]: ../cases/2024-05-22-slack-enzyme-to-rtl.md#what-went-wrong
[spo-practices]: ../cases/2025-11-06-spotify-honk.md#practices-to-copy
[spo-worked]: ../cases/2025-11-06-spotify-honk.md#what-worked
[spo-wrong]: ../cases/2025-11-06-spotify-honk.md#what-went-wrong
[tmp-worked]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#what-worked
[tmp-wrong]: ../cases/2026-09-02-temporal-billing-store-clickhouse.md#what-went-wrong
[vjx-worked]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-worked
[vjx-wrong]: ../cases/2026-01-25-vjeux-pokemon-showdown-rust.md#what-went-wrong
[zal-numbers]: ../cases/2025-02-20-zalando-ui-component-libraries.md#numbers
[zal-worked]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-worked
[zal-wrong]: ../cases/2025-02-20-zalando-ui-component-libraries.md#what-went-wrong
[k-context-engineering]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2025-06-25-context-engineering.md
[k-success-criteria-not-steps]: https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/2026-01-26-success-criteria-not-steps.md
