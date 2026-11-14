# Pitfalls by kind of move

Behaviour the old stack gives without being asked, which a port or restructuring can lose while
the code still compiles. Question 7 of the [checklist](checklist.md) uses these lists: search the
scope for each item that applies, give the search you used, and mark the item "like for like" or
"needs a decision". An item with a case link is reported by that case; an item marked (ours) is
our inference. A count only says where to look.

## A JavaScript runtime to a compiled language (for example TypeScript to Rust, Go or C#)

TypeScript's types are erased at run time: the regressions come from what the JavaScript runtime
does underneath them.

- One number type for integers and floats; falsy defaults; time zone; environment reads;
  platform behaviour the old runtime supplied silently, such as a Windows window flag. [GitHub][]
- Paired operations (open and close, subscribe and unsubscribe) ported on one side only;
  lifecycle and ordering. [GitHub][]
- (ours) Locale; typed arrays and float width; exceptions against error values; garbage-collected
  object graphs and shared mutable references against ownership; callbacks and closures held across
  frames; an event loop against threads; `undefined`, `null` and absent fields in parsed JSON;
  DOM or `window` access.

## Python to a compiled language (ours; no case covers it)

- Integers without a size limit; the global interpreter lock hiding data races; `asyncio`'s event
  loop against threads; C extensions and who owns their memory; data saved with `pickle` or other
  Python-only formats; attributes added or patched at run time; truthiness of empty values;
  decorators and metaclasses that generate code.

## Garbage-collected static languages to Rust (Go, Java, C#; ours)

- Ownership of shared mutable state; the choice of async runtime; cancellation (Go's `context`);
  goroutines or threads; map iteration order; the exact bytes a serialiser writes;
  reflection-based decoding (struct tags, annotations); template engines and their escaping; files
  embedded at build time.
- Integer overflow (Go and Java wrap silently; Rust panics in debug builds and wraps in release);
  UTF-16 strings and their indexing (Java, C#) against UTF-8; exceptions against `Result`, and
  which errors the old code let pass.

## C, C++ or Zig to Rust

- Lines that read the same in both languages but behave differently: a side effect inside an
  assertion compiled only in debug builds disappears from release builds; a slice cast panics on
  an odd byte count; colour markers rewritten inside formatted output. [Bun][]
- A placeholder constant lowered a limit that real projects reached. [Bun][] (ours) Search the
  port for placeholder values left for a later phase.
- A comparison of two pointers by address where the original compared what they point to: safe,
  compiles, and is always false. [Intel][]
- Firmware and code that calls hardware or assembly cannot be safe Rust; platforms without the
  Rust compiler or its standard library need extra work. [Intel][]
- A faithful port keeps the old design, so some `unsafe` code remains; decide how much the target
  may use and where. [Bun][]
- (ours) Integer overflow and wrap; out-of-range float-to-integer casts; aliasing and casts away
  from const; mutable globals; custom allocators; unchecked indexing.

## Widening a type or a data format (for example 32-bit to 64-bit IDs)

- Bit operations that assume the old width; values held in SQL strings and other text the type
  system does not see; test fixtures whose sample values should exceed the old range; golden
  outputs that must be regenerated with the project's own tools. [Google][]
- Uses reached only through other variables, several steps from the changed field; an index
  search with a distance limit can miss them. [Google][]
- (ours) 64-bit values read as JSON by JavaScript or any reader that keeps numbers as doubles lose
  precision above 2^53; send them as strings.

## Restructuring within one language (monolith to services, an API pattern across call sites)

- The order of schema change, writers and backfill: filling a new column before the code that
  inserts rows is changed can lose rows silently. [1Password][]
- Tables or other state shared with other parts of the system, which a new service must not
  treat as its own. [1Password][]
- Formats an agent assumes without checking (an identifier's format, for example) and then builds
  on across many changes. [1Password][]
- (ours) Deploy order between the old system and the new service, and which side owns each write
  during the switch.

## One test framework to another

- The right replacement often depends on runtime facts (the rendered output a test queries), which
  a syntax-tree rule over one file cannot see; per-method rules for the old library keep growing.
  [Slack][]
- Converted files that fail at setup or import hide every test case in them, right or wrong.
  [Slack][] (ours) Compare the count of discovered tests before and after the move.
- In-house test runners, rules and shared base classes that no stock rule handles; Uber first
  changed the build so both versions ran side by side, and skipped any file using a pattern its
  recipes did not support. [Uber][]

## A UI component library or design system to another

- Sizes, spacing scales and grid columns that differ in meaning as well as name: a model mapped
  a medium button to medium where the old medium looked like the new large, and the two grids had
  12 and 24 columns. A page that compiles can render broken: check each page visually. [Zalando][]
- Properties the target component lacks, which a model may fill with a plausible one that does not
  exist; data passed into a component in a changed shape, which once passed review and broke a
  page in production. [Zalando][]
- Defaults the old components applied unasked, such as a notification timeout: decide whether to
  keep them. [Zalando][]

## A cross-platform mobile app to native apps (for example React Native to native iOS and Android code)

- What users and other systems see across the switch: staying signed in, push notifications, and
  analytics events with the context downstream systems read. [Shopify][]
- How long an agent takes to test one change on the target platform: driving simulators through
  screenshots or the accessibility tree took minutes per test, where the edit took seconds; plan a
  headless or command-line path into the app's logic. [Shopify][]
- (ours) Navigation and back stack, deep links, accessibility labels, layout across screen sizes
  and over-the-air updates the cross-platform framework handled.

## A build system or packaging model to another

- Imports that look required in the code but are test-only or conditional; Bloomberg crossed
  syntax-tree imports with modules seen at run time to tell them apart. [Bloomberg][]
- A wrong dependency choice that builds and passes smoke checks, then fails only once deployed;
  unit tests the pipeline never ran. [Bloomberg][]

## A library or framework version upgrade (ours)

- Removed or deprecated APIs; changed defaults; behaviour changes listed only in the release notes
  between the two versions (read them all, not only the latest); transitive dependencies that
  now conflict; generated code or configuration that must be regenerated.

## Seams

How one unit can switch while the rest stays, used by question 5 of the checklist (ours, except
where a case is linked):

- One framework to another: each file or component moves on its own.
- TypeScript to Rust: a native addon, WebAssembly inside the old app, or a separate process; GitHub
  used a temporary native-addon layer and removed the old code in the same change; a synchronous
  call across that layer froze the app's interface until made asynchronous. [GitHub][]
- C or C++ to Rust: a C ABI; Intel generated each wrapper's signature with a binding tool and,
  where tests existed (none for libgit2), tested a mixed build after each symbol. [Intel][]
- Go, Java or C# to Rust: a process boundary or a C ABI.
- Across a C ABI: who allocates and frees each value, and panics or exceptions that must not
  cross the boundary.
- A service split: route requests per path or tenant to the old or the new side and move the
  routes one at a time (the strangler-fig pattern).
- A cross-platform app to native apps: a fresh native app beside the old one, each screen ported
  against the running old app; Shopify chose this over a gradual move inside the old app. [Shopify][]
- A schema or storage change: expand and contract. Add the new form, write both, backfill, switch
  the reads, then drop the old form; this order avoids the backfill loss 1Password hit.
  [1Password][]

## Any move

- Replacement libraries that behave differently from the old ones; one caused an endless loop at
  startup. [GitHub][] (ours) List each direct dependency, its target library, version, and
  whether that is a stable release or archived.
- Docs and agent instruction files that still recommend the old library steer agents back to it;
  awkward patterns in example code get copied too. [Asana][]
- (ours) Source shared with another language or toolchain (shader headers, generated code), which a
  port splits into copies that drift.
- (ours) Bit-exact results across languages (float model, thread count) when tests compare outputs.
- Not a language difference but an agent failure that looks like one: functions left as stubs, or
  missing, behind a clean build; compiler feedback alone lets them through. [Intel][], [Bun][]

[GitHub]: cases/2026-09-16-github-copilot-runtime-rust.md
[Bun]: cases/2026-07-08-bun-zig-to-rust.md
[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md
[Google]: cases/2025-04-13-google-int64-ids.md
[1Password]: cases/2026-04-20-1password-monolith-refactor.md
[Slack]: cases/2024-05-22-slack-enzyme-to-rtl.md
[Uber]: cases/2026-04-07-uber-junit4-to-junit5.md
[Zalando]: cases/2025-02-20-zalando-ui-component-libraries.md
[Shopify]: cases/2026-09-10-shopify-react-native-to-native.md
[Bloomberg]: cases/2026-11-03-bloomberg-python-cpp-uplift.md
[Asana]: cases/2026-08-07-asana-enzyme-to-rtl.md
