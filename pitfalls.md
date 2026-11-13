# Pitfalls by kind of move

Behaviour the old stack gives without being asked, which a port or restructuring can lose while
the code still compiles. Question 7 of the [checklist](checklist.md) uses these lists: search the
scope for each item that applies, give the search you used, and mark the item "like for like" or
"needs a decision". An item with a case link is reported by that case; an item marked (ours) is
our inference. A count only says where to look.

## Dynamic to static typing (for example TypeScript to Rust, Go or C#)

- One number type for integers and floats; falsy defaults; time zone; environment reads;
  platform behaviour the old runtime supplied silently, such as a Windows window flag. [GitHub][]
- Paired operations (open and close, subscribe and unsubscribe) ported on one side only;
  lifecycle and ordering. [GitHub][]
- (ours) Locale; typed arrays and float width; exceptions against error values; garbage-collected object
  graphs and shared mutable references against ownership; callbacks and closures held across
  frames; an event loop against threads; `undefined`, `null` and absent fields in parsed JSON;
  DOM or `window` access.

## Garbage-collected static languages to Rust (Go, Java, C#; ours)

- Ownership of shared mutable state; the choice of async runtime; cancellation (Go's `context`);
  goroutines or threads; map iteration order; the exact bytes a serialiser writes;
  reflection-based decoding (struct tags, annotations); template engines and their escaping; files
  embedded at build time.

## C, C++ or Zig to Rust

- Lines that read the same in both languages but behave differently: a side effect inside an
  assertion compiled only in debug builds disappears from release builds; a slice cast panics on
  an odd byte count; text is rewritten inside formatted arguments. [Bun][]
- A placeholder constant lowered a limit that real projects reached. [Bun][] (ours) Search the
  port for placeholder values left for a later phase.
- A comparison of two pointers by address where the original compared what they point to: safe,
  compiles, and is always false. [Intel][]
- Functions left as stubs, or missing, behind a clean build; compiler feedback alone lets them
  through. [Intel][], [Bun][]
- Firmware and code that calls hardware or assembly cannot be safe Rust; platforms without the
  Rust standard library or compiler need extra work. [Intel][]
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
  [Slack][]

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

## Any move

- Replacement libraries that behave differently from the old ones; one caused an endless loop at
  startup. [GitHub][] (ours) List each direct dependency, its target library, version, and
  whether that is a stable release or archived.
- (ours) Source shared with another language or toolchain (shader headers, generated code), which a
  port splits into copies that drift.
- (ours) Bit-exact results across languages (float model, thread count) when tests compare outputs.

[GitHub]: cases/2026-09-16-github-copilot-runtime-rust.md
[Bun]: cases/2026-07-08-bun-zig-to-rust.md
[Intel]: cases/2026-08-24-intel-ideas-c-to-rust.md
[Google]: cases/2025-04-13-google-int64-ids.md
[1Password]: cases/2026-04-20-1password-monolith-refactor.md
[Slack]: cases/2024-05-22-slack-enzyme-to-rtl.md
