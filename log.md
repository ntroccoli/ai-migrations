# Update log

Each update of the collection: when it ran, the sources it covered, and what changed. Newest
first.

## 2026-11-14 — second update

- **Covered:** three cases from sources published between 2026-01 and 2026-10: Pokémon Showdown
  (one engineer's port of a TypeScript battle engine to Rust with Claude Code, checked on seeded
  battles; a personal blog post and the port's repository), Spartacus (one developer's move of 44
  Angular form components in a fork of SAP's storefront to Signal Forms with Claude Code
  sub-agents; a dev.to post with its pull request and plan files; not SAP's migration) and ts-rust
  (Ping.gg's port of the Go TypeScript 7 compiler to Rust, a first attempt that stalled and a
  restart; the repository's README, partly written by models, and a history page; unaudited). No
  field reports were open.
- **Mix:** two language moves (TypeScript and Go to Rust) and one framework move; one blog post,
  one dev.to post and one repository; no author sells an AI tool the case used. All three are one-person
  efforts: two personal projects, and ts-rust, where one person directed every agent.
- **Added:** the three case files; 4 new lessons; a pitfall item each under JavaScript runtime to
  a compiled language (objects that point at each other) and under library or framework moves
  (built-ins that check differently; that section now holds a case-backed item, so its heading
  dropped "(ours)").
- **Rules:** `also` may hold the project's official repository when the source links it; when part
  of a source was written by a model, the case's Source section says which parts and each claim
  is cited from the part that says it; seed, battle and thread are units. The README disclosure
  now counts models the source names without the word Claude (Opus, Sonnet, Haiku) and cases
  that used Claude Code with the model unstated, and names the cases that also used other
  vendors' models.

### Checklist and lessons impact

- **Checklist:** no question added, merged or dropped. The record format gains a "Log entry"
  line and a "Baseline" column, and says which status a later, declined or failed proposal gets. Question 3 now asks to build and test two
  clones at once (not only build); question 8 cites CTX-11, question 9 KNW-4 and OVS-5, question
  10 AGF-9. New evidence reached questions 2 (ts-rust's pinned-revision
  comparison, Pokémon's seeded battles), 3 (Spartacus's worktrees where tests could not start), 8
  (Pokémon split files the agent would not open), 9 (ts-rust's first attempt with no stop rule,
  Spartacus's waves) and 12 (ts-rust's list-price token figures); the file grew to 19,856 bytes,
  under its 20,480-byte cap, after the review fixes to its record format and step 9. No field report was behind any change.
- **New lessons:** AGF-9, CTX-11, KNW-4, OVS-5.
- **Changed lessons:** strength raised for AGF-6 (to medium); the raises of TST-5 (to strong)
  and REV-11 (to medium) were undone after the outside review, since the Pokémon case does not
  carry them (it moved to TST-5's Against only, and splits REV-11);
  oracle tag changed from no to partly on VER-1 and MSR-6 in the sceptic pass; REV-3 reworded
  (old and new code, not two languages; built-in validators added); new citations or Against
  lines on AGF-1, PLN-1, PLN-4, PLN-5, PLN-9, PLN-11, TST-1, TST-2, TST-6, VER-1, VER-5, VER-7,
  REV-2, REV-5, OVS-1, OVS-2, AGF-5, KNW-1, SEC-1, SEC-3, TEM-1, TEM-2, TEM-5, CST-2, CST-4,
  MSR-2, MSR-6, ORC-1, OPS-2 and TOL-1. Five "Against: None found" lines now carry
  counter-evidence (KNW-1, PLN-4, REV-11, TEM-5, TST-6) and four state a limit instead (AGF-6,
  REV-3, SEC-3, VER-5); with the new lessons' limits, "None found" lines went from 54 to 53
  (plain ones from 43 to 34). PLN-4, PLN-11 and REV-11 now open their Against with "Disagree:"
  (PLN-11's cites Bun and the Pokémon port); "Disagree:" lines went from 16 to 19.
- **By case:**
  - Pokémon: questions 2, 8, 9 and 10; lessons AGF-9, CTX-11, KNW-4 (new), AGF-1,
    TST-5, AGF-6, REV-11, TEM-5, PLN-4, PLN-5, PLN-11, SEC-1, SEC-3, AGF-5, OVS-1, KNW-1, MSR-6,
    TEM-1, TEM-2, VER-1, VER-7, TOL-1.
  - Spartacus: questions 3 and 9; lessons OVS-5 (new), AGF-6, REV-3, TST-6, VER-5, VER-1, VER-7,
    TST-2, REV-5, MSR-2, ORC-1, PLN-1, OPS-2.
  - ts-rust: questions 2, 9 and 12; lessons TEM-5, PLN-9, OVS-2, REV-2, MSR-6, CST-2, CST-4,
    PLN-5, TST-1, TST-2.

### Lesson tags (same day, after the update)

- **New tag:** every lesson now says whether it depends on model ability (`yes`: it states what
  models or agents can or cannot do; `partly`: a process whose need comes from such a behaviour;
  `no`: it holds whatever the model). Lessons about model limits age fast, process lessons barely.
- **Era in one form:** the years and the models of the cases a lesson cites, derived from the
  cases and checked by the validator, so lessons compare in time.
- **May be outdated:** `lessons/index.md` and `llms.txt` mark a lesson tagged `yes` whose most
  recent case is more than a year older than the build; today TOL-2 and AGF-8.
- **Sceptic pass:** of 15 lessons sampled at random among those tagged "Old system as oracle: no",
  2 flipped to partly (REV-5, AGF-3), and AGF-5 with them; 10 model-ability tags moved from no
  to partly.
- **By model:** `lessons/index.md` groups the cases' models into families with the lessons tagged
  `yes` or `partly` per family; llms.txt and the lessons route say how to use it with a specific
  or new model; the field-report form asks which models ran; Google's model is one name again.
- **Route fixes:** reports split "Check that proves it" into "Check now" and "Event that proves it", one change per proposal (rows 3a, 3b), unanswered owner questions take the stated default, and `lessons/evidence.md` gives every lesson in one line with its cases for and against.

## 2026-11-13 — first update

- **Covered:** four cases from sources published between 2025-02 and 2026-11, picked from
  sources set aside during the first collection and for kinds of move not yet covered: Zalando
  (one in-house UI component library to another with GPT-4o, an engineering post and a talk),
  Asana (Enzyme to React Testing Library with Codex agents, written in partnership with OpenAI,
  so it counts as a seller's case), Shopify (React Native apps rebuilt natively for iOS and Android, two posts)
  and Bloomberg (Python packaging and C++ builds moved across thousands of repositories, a paper
  with outcome tables). No field reports were open.
- **Mix:** one language move, one framework, one test-framework and one mixed; three engineering
  posts (Zalando's with a talk) and one paper; one author sells or promotes an AI tool the case
  used (Asana).
- **Added:** the four case files; 15 new lessons; a pitfalls section each for UI component
  library moves, cross-platform mobile apps moved to native, and build or packaging moves; a
  Shopify seam and an Asana item under "Any move" in the pitfalls.
- **Rules:** a source written with the tool's vendor counts as `seller-of-tool` (a text search of
  the other cases' sources found no such partnership, so no earlier case changed); units accept
  plurals in "-ies" (repositories, dependencies), and app, application and screen are units.

### Checklist and lessons impact

- **Checklist:** question 2 now asks how late a wrong change first fails (build, tests, or only
  once deployed); question 3 asks how an agent drives an app and how long one test takes;
  question 8 asks for a search of docs and agent instructions that still favour the old stack;
  question 10 asks, when changes land in other teams' code, how many teams own it, whether they
  asked for the move and who carries the deploy risk. New evidence reached questions 2, 3, 5, 7,
  8, 9, 10 and 12; the file was trimmed to stay under its size limit. No question was added,
  merged or dropped; no field report was behind any change.
- **New lessons:** PLN-11, PLN-12, TST-11, TST-12, VER-10, VER-11, REV-11, ROL-9, TEM-5, TOL-8,
  TOL-9, TOL-10, CTX-10, OVS-4, MSR-10.
- **Changed lessons:** strength raised for PLN-10 and CTX-3 (to medium), VER-1, REV-9 and OPS-3
  (to strong); reworded PLN-10, CTX-3, REV-9, CST-6 and CST-8; new citations or
  Against lines on PLN-5, PLN-6, PLN-8, TST-8, VER-3, VER-8, REV-2, ROL-1, ROL-3, OPS-1, OPS-6,
  SEC-9, CST-1, CST-4, TEM-4, TOL-4, TOL-6, CTX-1, CTX-2, CTX-4, CTX-5, CTX-6, ORC-1, ORC-2, ORC-6,
  AGF-2, AGF-4, AGF-7, OVS-3, KNW-1, MSR-2 and MSR-8. Ten "Against: None found" lines now
  carry counter-evidence (PLN-8, OPS-1, OPS-3, OPS-6, REV-9, CST-1, TOL-6, CTX-3, CTX-5, CTX-8),
  and ORC-2 gained one in the sceptic pass.
- **By case:**
  - Zalando: questions 7, 8 and 9; lessons TST-11, TEM-5 (new), PLN-6, VER-1, VER-8, CST-1,
    TOL-4, CTX-1 to CTX-6, REV-2, TST-12, AGF-2, AGF-4, AGF-7, KNW-1, MSR-2.
  - Asana: questions 3, 8 and 10; lessons CTX-10 (new), TST-8, REV-9, OPS-1, OPS-3, CST-4,
    CTX-1, CTX-3, CTX-6, CTX-8, ORC-2, ORC-6.
  - Shopify: questions 2, 3, 5 and 10; lessons PLN-11, TST-12, REV-11, TOL-8, OVS-4 (new),
    PLN-5, VER-10, REV-2, ROL-1, OPS-3, TOL-6, CTX-2, ORC-1, ORC-6, KNW-1.
  - Bloomberg: questions 2, 8, 10 and 12; lessons PLN-12, VER-10, VER-11, ROL-9, TOL-9, TOL-10,
    MSR-10 (new), PLN-8, PLN-10, VER-1, VER-3, VER-8, REV-9, ROL-3, OPS-6, SEC-9, CST-8, TEM-4,
    CTX-2, ORC-6, AGF-7, OVS-3, KNW-1, MSR-2, MSR-8.

## 2026-11-13 — first collection

- **Covered:** nine cases from sources published between 2024-05 and 2026-09. Eight are
  migrations done with AI: Slack and Airbnb (Enzyme to React Testing Library), Google (int32 to
  int64 IDs, a paper), Spotify (many library and framework moves by background agents),
  1Password (a Go monolith split, failure-heavy), Bun (Zig to Rust), Intel (C to safe Rust,
  partial) and GitHub (a TypeScript runtime to Rust). One is a contrast case: Uber (JUnit 4 to
  JUnit 5 with rule-based recipes, after an AI attempt failed).
- **Mix:** three language moves, three test-framework moves, one data, one architecture and one
  mixed; eight engineering posts and one paper; five authors sell or promote an AI tool the case
  used, so those cases weigh less (a lesson that rests only on them is never rated strong).
- **Added:** the case files, lessons by aspect drawn from them, the before-you-migrate
  checklist with its pitfalls page, and the generated `index.md`, `lessons/index.md`, `llms.txt`
  and `llms-full.txt`.
- **Checklist impact:** first version; nothing to revisit yet.
