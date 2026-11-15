# Lesson and checklist rules

Read before editing a lesson page in `lessons/` or `checklist.md`, or citing a case from them.
Moved from `AGENTS.md`, which keeps the commands and the writing rules.

## Lessons

One page per aspect in `lessons/` (`testing.md`, `review.md`, ...), listed in order in
`LESSON_PAGES` (`scripts/lib.mjs`). The pages are the source of truth; `lessons/index.md` (counts,
"By model", "May be outdated", where cases disagree) and `lessons/evidence.md` are generated. A page is a `# Title`, a
one-paragraph intro (used in the index and `llms.txt`), the evidence note (the exact sentence in
`LESSON_NOTE`), a legend, the lessons, then the reference definitions of its links:

```markdown
- **TST-1** [stated] One line in our own words, at most 200 characters, no number.
  - Old system as oracle: yes. Depends on model ability: no. Strength: strong. Era: 2026; newest: Claude Opus 5.x.
  - Cases: [Bun: how it was checked][bun-checked], [GitHub: how it was checked][gh-checked].
  - Against: counter-evidence from other cases with links ([Bun][bun-wrong]), or "None found."
  - Related view (karpathy-ideas): [port with equality tests][k-port-with-equality-tests], agrees.
```

Rules (all checked by `node scripts/validate.mjs`; one broken-copy test each):

- IDs: three capital letters, a hyphen and a number; one prefix per page; unique across pages.
  IDs are never reused, so checklist and outside references do not break.
- `[stated]`: a source says it or reports it as what worked or failed; `[ours]`: our inference.
  A `[stated]` lesson cites at least one case section other than "Practices to copy"; when it
  cites only practices, the practice line closest to it (most content words shared,
  `closestPractices` in `scripts/lib.mjs`) must be `[stated]` too, since an `[ours]` practice is
  our inference. Failing that, cite the section the practice comes from, or tag the lesson `[ours]`.
- Sub-items in this order: "Old system as oracle: yes|partly|no. Depends on model ability:
  yes|partly|no. Strength: strong|medium|weak. Era: YYYY[–YYYY]; newest: <model family>.", "Cases:" (at least one link), "Against:" (never empty; start it
  with "Disagree:" for a real split between cases, which the index lists; when it gives only a
  limit of the cases already cited, start it "None found;" and state the limit), then optional
  "Related view (karpathy-ideas):". No "Sceptic:" line: what a sceptic pass challenged is kept in the
  private archive by lesson ID (**maintainer only**); the page shows the tag it changed.
- "Old system as oracle": does the lesson's evidence rely on the old system (its tests, outputs,
  users' reports) to tell right from wrong. It says where the evidence came from, not where the
  lesson applies.
- "Depends on model ability": `yes` when the lesson states what models or agents can or cannot
  do (a failure mode, what they handle well or badly); `partly` when it is a process whose need
  comes from such a behaviour (a check, a rule, a tool built because agents do something); `no`
  when it holds whatever the model. Lessons about model limits age fast, process lessons barely;
  newer models still fail in old ways, so the cases decide the tag, not assumptions.
- "Era": the years from the `period` of each case in "Cases" (its `date` when the period is
  `unstated`), as `YYYY` or `YYYY–YYYY` (en dash), then "; newest: " and the newest model family:
  the family (`modelFamily`) of the most recent cited case that names a model (the later of its
  `date` and the end of its `period`), its highest version when it names several (the first listed
  on a tie), `unstated` when no cited case names one (`expectedEra` in `scripts/lib.mjs`; the
  validator prints the expected value). The full model lists stay in the cases; "By model" and
  "may be outdated" read the cited cases, never the Era text. Era is what makes lessons comparable
  in time, so it is derived, never written freely.
- "May be outdated": `build.mjs` marks, in `lessons/index.md`, `lessons/evidence.md` and `llms.txt`, every lesson tagged
  `yes` whose most recent case in "Cases" (the later of its `date` and the end of its `period`)
  is more than 12 months (`OUTDATED_MONTHS`) older than the date of the newest `log.md` entry,
  never today's date, so the output never changes by itself (`--today YYYY-MM-DD` is for tests
  only). The mark is refreshed by the next update's log entry and rebuild; re-check each marked
  lesson against newer cases then.
- "Strength" is capped by the cases in "Cases" (`strengthCeiling` in `scripts/lib.mjs`):
  `strong` needs two or more cases, or one whose `evidence` is `shown-in-source` or
  `independent-data`, and at least one case whose `author_relation` is not `seller-of-tool`;
  `medium` needs two or more cases, or one that shows its data; any other lesson is `weak`. So a
  seller's case weighs less: a lesson resting only on such cases is at most `medium`. A contrast
  case (`ai_share: little`) does not count toward any lesson's cap. Below the cap, grade by how well the
  cases support the lesson; recount as cases arrive. The legend on every page states this rule
  (`LESSON_LEGEND`).
- Links in "Cases" and "Against" go to a case section, `../cases/<file>.md#<section>`, and must
  resolve to the file and a `##` section in it. A lesson never links a source directly: the case
  is the checked summary. Lessons cite cases, never each other.
- "Related view" links one idea file under
  `https://github.com/ntroccoli/karpathy-ideas/blob/main/ideas/` and ends with `, agrees.` or
  `, contradicts: why.`; it copies nothing from that project, and only where the match is clear.
- Every number carries a unit (the Era is exempt); no quoted span over four words; every
  relative link resolves; a page stays at or under 20 KB (20,480 bytes). Where these numbers come
  from, and how a trim must keep every rule: [maintaining.md "Size caps"](maintaining.md#size-caps).
- Every case is cited by at least one lesson or checklist question.

**Maintainer only:** each lesson was checked against the source lines it rests on, which the
private archive keeps by lesson ID. A new or changed lesson updates them, and `check-copy` runs on
every changed lesson page against all the source texts.

Upkeep: a new case comes with its lesson edits (new lessons, new citations, new "Against" lines,
strength changes), and the build is rerun. A sceptic pass from time to time challenges `no`
oracle tags, `no` model-ability tags on lessons about agent behaviour, `[stated]` tags and "None found" lines against the cases they cite, and checks that
the case which lifts a lesson to `strong` really supports it; its notes go to the private archive.

## Checklist

`checklist.md`: 5 to 12 questions; merge before adding. Each question has a "Check:" an agent can
run on a repository, an "Evidence:" line saying briefly, in our words, what the cases show (so an
agent without the cases can use it), and a "Lessons:" line citing the lesson IDs behind it
(`Lessons: TST-1, REV-3`); detail lives in the lessons, not here. Our own inferences are allowed
and marked "(ours)". Questions stay language-neutral; lists per kind of move (pitfalls, seams) go
to `pitfalls.md`, which the questions link. `checklist.md` stays at or under 20 KB (20,480 bytes;
agents read it whole, a cap of ours: [maintaining.md "Size caps"](maintaining.md#size-caps)): trim
wording or move detail before adding, and prove no rule lost. Cases, where named, are cited by
reference links (`[Bun][]`, defined once at the end of the file). The validator checks the count,
the size, "Check:", "Evidence:", that each question cites lesson IDs that exist, case links, and
links in `pitfalls.md`. **Maintainer only:** run `check-copy` on `checklist.md` and `pitfalls.md`
against all the source texts after changing them.

## Provenance

A reader's agent applies a published threshold as written, and a number we picked reads like a
measured one unless it says otherwise. So in each method file we publish (`PROVENANCE_FILES` in
`scripts/lib.mjs`: `checklist.md`, `docs/applying-lessons.md`, `docs/report-formats.md`), every
threshold and hard rule carries a marker such as `(P3)` inside its sentence, and the file's
`## Provenance` table gives that marker a row:

```markdown
| ID | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- |
| P3 | [GitHub][], ROL-1 | published case | what the rule prevents | how it fails when applied blindly |
```

What the validator detects (one broken-copy test each):

- Which sentences: from the file's first "## " heading or first numbered item on, outside code,
  headings, tables, reference definitions, the Provenance section and the "Evidence:" and
  "Lessons:" parts of a question; a question (ending in "?") is not a rule.
- A threshold: a sentence holding a number that needs a unit (the units rule; part labels such as
  3a and references such as "question 1" are not numbers).
- A hard rule: a sentence that tells the reader or its agent to cut, cap, delete, forbid or stop,
  found by the words in `HARD_RULE` (`scripts/lib.mjs`): cut, cap, trim, delete, remove, drop,
  forbid, never, stop, limit, "do not", "must not", "no more than", "at most", "at or under",
  "wait for", "change nothing", "write no". A description that uses one of them is reworded
  ("Go rejects package cycles"), never marked to pass.
- Each such sentence has a marker; each marker has a row; each row is used; a row has all five
  cells; Level is exactly one of `published case` (a case or a lesson in Source), `published cases`
  (two or more cases in Source, counting the cases its lessons cite), `others' measurement` or
  `vendor guidance` (a link in Source), `ours` (our inference or a number we picked); lesson IDs
  and case links in Source exist.

The same four parts are kept for our own caps in [maintaining.md "Size caps"](maintaining.md#size-caps)
(the validator checks a row per cap). Before every release, each item that tells an agent to cut,
cap, delete, forbid or stop gets a behaviour check (**maintainer only**: a fresh agent applies it to a
small prepared sample, and the check looks for the intended effect and the named harm).
