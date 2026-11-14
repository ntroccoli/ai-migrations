# Update log

Each update of the collection: when it ran, the sources it covered, and what changed. Newest
first.

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
