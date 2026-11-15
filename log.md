# Update log

Each update of the collection: when it ran, the sources it covered, and what changed. Newest
first.

## 2026-11-15 — provenance of thresholds and hard rules

- **Covered:** no new sources. Why: a size limit of 12 KB, picked in another project without a
  measurement, spread through a published checklist into skills that sessions then pruned by it.
  A reader's agent applies a number as written, so every threshold and hard rule here now says
  where it comes from.
- **Rules:** each threshold and each item that tells the reader or its agent to cut, cap, delete,
  forbid or stop, in `checklist.md`, `docs/applying-lessons.md` and `docs/report-formats.md`,
  carries a marker such as (P3); the file's Provenance table gives its source (a case or lesson
  ID), its evidence level (`published case`, `published cases`, `others' measurement`,
  `vendor guidance` or `ours`), what it prevents and how it fails applied blindly. The validator
  refuses a threshold or hard rule without one (`docs/lesson-rules.md` "Provenance"). Our own size
  caps have the same four parts in `docs/maintaining.md` "Size caps": all are numbers we picked,
  none measured, and a trim to meet one moves text and proves no rule lost.
- **Moved:** the report and record templates of both routes into `docs/report-formats.md`, to make
  room in `checklist.md`; no rule was dropped (the rule sentences were compared before and after).
- **Records:** each row waiting for first use names an owner and a check-by date; a revisit lists
  the rows past their date first, and a row past its date makes the record due (both README
  routes, `docs/applying-lessons.md` and `llms.txt`).

### Checklist and lessons impact

- **New lessons:** none.
- **Changed lessons:** none.
- **Checklist:** questions 1, 2, 3, 4, 5, 6 and 9 carry provenance markers (questions 2 and 5
  reworded only where a description read as a rule); the "How to run" steps 1, 3, 8 and 9 and the
  starting thresholds carry them too; the report and record formats moved to
  `docs/report-formats.md`.

## 2026-11-14 — third update

- **Covered:** eight cases from engineering posts published between 2025-08 and 2026-09: a
  personal blog moved from Gatsby to Next.js after a failed first run (Robert Marshall); Ladybird's
  JavaScript front end ported from C++ to Rust, checked against the C++ pipeline in lockstep;
  PagerDuty's Rundeck moved to Grails 7 by a product manager with an agent, engineers finishing;
  Datadog's routing store moved from FoundationDB to PostgreSQL after a schema redesign; Mindstone's
  86 Go targets (55 of them services) rewritten as one TypeScript service by agents under an assert-everything harness;
  GitLab's rate limiter moved into a shared gem (a seller's account); Checkly's Node.js worker
  rewritten in Go overnight, then fixed for production's queue layout; Temporal's billing reads
  moved to ClickHouse behind a shadow comparison. One field report was open (relation to the
  collection unstated, not a migration); it is not independent evidence and changed nothing here.
- **Mix:** two language moves, one mixed move (language and architecture), two framework moves,
  two data-store moves and one restructuring; one author sells a tool the case used (GitLab).
- **Added:** the eight case files; 12 new lessons; in `pitfalls.md`, a section for data-store
  moves (access patterns kept on a new engine, sums that overflow at real volumes) and an
  equality item under library upgrades.
- **Rules:** new units (service, target, queue, key, cohort and others) and Groovy among the
  languages; a number after "day" or "week" is a label; `lessons/index.md` is capped at 12 KB
  (12,288 bytes), so model families with the same lessons share a row in "By model" and "Where
  the cases disagree" lists IDs per page; "Codex 5.3" and "GPT-5.3 Codex" form one family (OpenAI
  Codex 5.x). `llms.txt` lists no cases any more: one line points to `index.md`, which now also
  holds "Moves covered", so `llms.txt` stops growing with each case (23,385 bytes before, 8,990
  now) and is capped at 20 KB (20,480 bytes). The revisit prompts in the README read the record
  and `llms.txt` first and stop there when nothing is due (an item waiting or open, with commits
  since the record's date). The checklist's step 10 now points to the revisit step of
  `docs/applying-lessons.md` instead of listing its parts.
- **Review fixes:** an outside review before publishing corrected question 11 (GitLab's shadow
  run flagged the divergence; its labels did not set it apart), PagerDuty's cost ratio (the post
  gives no method), Temporal's AI share (`unstated`: the posts state none) and Mindstone's scope
  (86 targets, not 86 services), and took back grades raised faster than the cases support.
- **Sources kept as notes:** the sites of seven cases forbid storing their text (Mindstone, GitLab,
  and from this update also Airbnb, Asana, Datadog, Intel and Shopify), so the private archive keeps
  notes only. Each such case says so in its Source section and carries no quote (Shopify's quote
  was dropped); it counts toward a lesson's strength like any other. GitLab's page was fetched
  once by script before its terms were read; the maintainer kept the case on its notes.

### Checklist and lessons impact

- **Checklist:** no question added, merged or dropped. New evidence reached questions 2
  (Ladybird's lockstep run and its edited expected outputs, Checkly's harness that passed while
  production retries failed; TST-13, TST-14, TST-15), 6 (PLN-13: Gatsby and Datadog built the
  target's architecture or schema first), 7 (PagerDuty's equality
  change), 8 (CTX-12, CTX-13), 9 (KNW-5), 10 (TEM-6) and 11 (Temporal's compare-then-cut-over
  order, GitLab's ramp past a divergence its shadow run flagged but did not label; ROL-10,
  ROL-11, OPS-8). Questions 3 and 8 were trimmed in wording; the case list at the top keeps the
  names and points to the index for each move, and the lesson IDs point to `lessons/evidence.md`.
  The file grew from 20,051 to 20,418 bytes, under its 20,480-byte cap. No field report was
  behind any change.
- **New lessons:** PLN-13, TST-13, TST-14, TST-15, VER-12, ROL-10, ROL-11, OPS-8, TEM-6, CTX-12, CTX-13, KNW-5.
  Two merges: GitLab's shadow-mode lesson and Temporal's "aim the comparison at the largest
  inputs" became ROL-10; Mindstone's and GitLab's notes on the people's cost of agent work became
  TEM-6.
- **Changed lessons:** PLN-5, PLN-6, PLN-7, PLN-9, PLN-11, PLN-12, TST-1, TST-2, TST-5, TST-7,
  TST-9, TST-12, VER-1, VER-7, REV-1, REV-3, REV-5, REV-9, REV-10, REV-11, ROL-1, ROL-2, ROL-3,
  OPS-3, CST-2, TEM-1, TEM-2, TOL-6, CTX-1, CTX-4, CTX-5, CTX-10, AGF-5, AGF-6, AGF-9, OVS-1,
  OVS-3, KNW-1, KNW-4, MSR-1, MSR-9, VER-4 (Datadog's verbose test output). Strength raised:
  TST-1 to strong (seven cases), now worded as a suite fixed before the port with every edit to
  it reviewed, since three of its cases changed their suite during the move; PLN-12, TST-7,
  TST-12, CTX-5, REV-11 and KNW-4 to medium. Among the new lessons, TEM-6 is weak (each half rests
  on one case), OPS-8 is `[ours]` (the source does not tie the returning limit to running both
  paths), and TST-13 is medium with Pokémon's seeded side-by-side runs as a second case. Reworded: REV-3 (equality), TST-7 (numeric
  types and sums, not only widening), TST-12 (query answers). The sceptic pass changed oracle
  tags on TST-14 and ROL-11 (partly to no) and REV-10 (yes to no), the model tag on TST-5 (no to
  partly), corrected OVS-1 (Ladybird's pull request was approved by another contributor) and
  REV-1 (no engineer passed GitLab's failing change), and kept CTX-10 and PLN-13 weak. OVS-1 and
  TST-1 now carry the cases where the suite or its owner moved with the port: OVS-1 opens with
  "Disagree:" (Mindstone's script-guarded tests). KNW-4 dropped its clause against a growing notes
  file, which PagerDuty's pattern file contradicted; PLN-13's limit now names the language ports
  that translated the old design first (Ladybird, Mindstone). "None found" lines went from 53 to 60
  (plain ones from 34 to 32), mostly the new lessons' stated limits; "Disagree:" lines from 19 to
  20.
- **Re-checks:** TOL-2 and AGF-8 stay marked "may be outdated": no new case shows a codemod
  feeding a model or a language the model handled poorly. New model families (OpenAI Codex
  5.x, and Claude Opus and Fable with no version) come from Mindstone and Checkly, whose
  citations show the same behaviour (gamed tests in AGF-5 and TST-14, a harness built to what the
  tests show in TST-15).
- **By case:**
  - Gatsby: question 6; lessons PLN-13 (new), PLN-5, PLN-9, CTX-4, AGF-6.
  - Ladybird: question 2; lessons TST-13, PLN-13 (new), PLN-5, PLN-11, TST-1, TST-9, REV-1,
    REV-10, TEM-1, ROL-1, OVS-1.
  - PagerDuty: question 7; lessons KNW-4, TEM-1, VER-1, REV-3, AGF-9, TEM-2, MSR-1, CST-2, KNW-1.
  - Datadog: questions 6, 7 and 8; lessons PLN-13, CTX-12 (new), PLN-5, TST-1, TST-12, CTX-5,
    CTX-1, REV-11, KNW-4, VER-4.
  - Mindstone: questions 2 and 10; lessons TST-14, TEM-6, PLN-13, CTX-12 (new), ROL-1, OVS-1, TST-5, TST-1,
    TST-13, PLN-5, AGF-5, AGF-9, KNW-1, REV-1, OPS-3, CTX-4, MSR-1, PLN-12.
  - GitLab: questions 10 and 11; lessons ROL-10, OPS-8, TEM-6, VER-12 (new), REV-1, ROL-2, REV-9,
    VER-7, CTX-4, OVS-3, ROL-3, REV-5.
  - Checkly: question 2; lessons TST-15 (new), TST-1, PLN-5, TST-5, TST-2, TST-13, ROL-2, KNW-1.
  - Temporal: questions 7, 8, 9 and 11; lessons ROL-10, ROL-11, CTX-13, KNW-5 (new), KNW-4, PLN-7,
    CTX-10, TST-7, TST-12, PLN-6, TOL-6, MSR-9.

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
  under its 20,480-byte cap, after the review fixes to its record format and step 9. Questions 1 and 7 were trimmed in wording only. No field report was behind any change.
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
  (PLN-11's cites Bun and the Pokémon port); "Disagree:" lines went from 16 to 19. After the
  update, every lesson gained the model-ability tag and a derived Era, and the sceptic pass moved
  oracle tags on REV-5, AGF-3 and AGF-5 ("Lesson tags" below): a revisit from an older record
  re-reads every lesson once.
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
- **Revisit and share:** step 3 of both routes stops at once when the record's log entry is the
  newest and nothing is due; else it re-checks the record against its baselines (proven, still
  waiting, stopped holding, not shown), reads the generated `changes/` file of each newer entry
  (lesson IDs and questions added, changed or removed), measures only those, lints the record
  for applied lessons a newer one contradicts, and updates the record in its existing layout. The
  field report is an optional step 4. The validator fails when an entry's impact part misses an
  ID or question its changes file lists; it found questions 1, 4 and 6 (first update) and 1 and 7
  (this entry) reworded but unnamed, now named above.

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
  8, 9, 10 and 12; the file was trimmed to stay under its size limit, which reworded questions 1,
  4 and 6. No question was added,
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
