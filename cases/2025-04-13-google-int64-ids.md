---
title: Google widens int32 IDs to int64 in 39 migrations with an LLM pipeline
date: 2025-04-13
company: Google
summary: A nightly pipeline of code search, rule-based sorting, an internal Gemini model and staged checks drafted 74.45% of 595 code changes in 39 ID migrations.
source_url: https://arxiv.org/abs/2504.09691
also: [https://arxiv.org/html/2504.09691]
source_type: paper
author_relation: seller-of-tool
evidence: shown-in-source
kind: data
from: int32 ID fields in protocol buffer schemas and the code using them (Java, C++, Dart and others)
to: int64 ID fields
size: 39 ID migrations, 595 code changes, 93,574 characters of edits
duration: 12 months
people: 3 developers
cost: unstated
ai_share: most
tools: [Kythe, rule-based location categorizers, fuzzy diff application, AST parser, build and regression tests, Critique code review]
models: [internal version of Gemini, fine-tuned with the DIDACT framework]
period: unstated
outcome: completed
status: current
superseded_by:
---

# Google widens int32 IDs to int64 in 39 migrations with an LLM pipeline

Google had a recurring, costly job: when an ID field in a protocol buffer schema neared the int32
limit, every direct and indirect use of it across the monorepo had to be found and changed, tests
included. One earlier manual pass for a single ID took about 2 years. Google built a nightly
pipeline: a code index finds candidate locations, rules sort out the obvious ones, an internal
Gemini model rewrites each affected file, and a chain of checks (parse, a model self-check, build,
tests) filters the results before developers and code owners review them. Over 12 months, three
developers ran 39 such migrations. The model drafted 74.45% of the 595 submitted code changes (people then
edited about half of those drafts) and made 69.46% of the edited characters; the developers estimated the time spent fell by 50%
([source](https://arxiv.org/abs/2504.09691)).

## Source

A peer-reviewed paper by six Google engineers, posted to arXiv on 2025-04-13 ahead of its
publication at the ACM FSE 2025 conference. Google sells Gemini models; the case used an
internal, fine-tuned Gemini version that is not sold as such, and the paper presents the workflow
as a model for others. The paper shows its method and per-migration data in two tables and
defines how it splits work between model and people ([Table 1](https://arxiv.org/html/2504.09691#S4.T1), [Table 2](https://arxiv.org/html/2504.09691#S4.T2)); no one outside Google measured it. The time
saving is the developers' own estimate. Six figures are images, among them the per-migration
model share chart.

## What was migrated

The type of ID fields in protocol buffer schemas, from int32 to int64
([section 2.1](https://arxiv.org/html/2504.09691#S2.SS1)), in 39 migrations, one per ID
([section 4.2](https://arxiv.org/html/2504.09691#S4.SS2)). A schema change alone is easy; the work is in
the code that reads or writes the ID, directly or through other variables: accessors, values passed
along, bit operations that assume the int32 width, and tests whose example IDs should exceed the
int32 range; one example in the paper also changes values inside SQL strings
([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)). The migrations ranged from 23 characters of edits in one file to 23,800 characters
over 418 files, and touched 1 to 5 programming languages each
([Table 2](https://arxiv.org/html/2504.09691#S4.T2)).

## Who did what

- **AI:** an internal Gemini model, fine-tuned on Google code for several software tasks but only
  prompted for this one, at a fixed version and temperature zero. It got each whole file, the
  suggested lines marked as comments and a short language-specific instruction, and answered with a
  diff; three attempts were made per file and one passing attempt kept at random. The same model
  also served as one check, judging whether its change was needed. By the paper's count, 443 of 595
  code changes (74.45%) contained model-made files, and the model made 64,996 of 93,574 characters
  of edits (69.46%), measured as Levenshtein distance
  ([section 3.3](https://arxiv.org/html/2504.09691#S3.SS3), [Table 1](https://arxiv.org/html/2504.09691#S4.T1)).
- **Rule-based tools:** Kythe, Google's code index, found each use of the ID field and then,
  step by step, the code depending on those, no more than five steps away. Categorizers (regular expressions, and one that
  spots class and method definitions) marked locations as not yet migrated, irrelevant (for example class definitions),
  relevant, or left over for people. A fuzzy matcher applied the model's diffs; checks rejected
  failed responses, whitespace-only edits and files that would not parse or were unchanged, then ran
  the build and the regression tests. The whole loop ran nightly
  ([section 3](https://arxiv.org/html/2504.09691#S3)).
- **People:** three developers ran the migrations, settled left-over locations through the
  system's configuration, wrote the 152 code changes the model had no part in and edited model
  output in 229 more code changes, and looked over every change before sending it to code owners: 306 people from
  149 teams reviewed the changes, and code owners accepted them. The two largest migrations needed the
  code owners' attention and went to production slowly. People made 28,578 characters of edits (30.54%)
  ([Table 1](https://arxiv.org/html/2504.09691#S4.T1), [section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).

## How it was checked

Each model-edited file passed six gates in order of cost: a successful model response, more than
whitespace changed, a parse with a changed syntax tree, the model agreeing the change was needed,
a clean build, and passing regression tests. A file failing any gate was dropped and left to
developers. Every code change was then read by a developer and accepted by its code owners in
Critique; changes for the two largest IDs went to production slowly to watch for side effects
([section 3.3](https://arxiv.org/html/2504.09691#S3.SS3), [section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
The paper counts work as edit distance between file snapshots: the model's share from the
original to its output, the people's share from that output to the submitted file, skipping edits
in between ([section 4.1](https://arxiv.org/html/2504.09691#S4.SS1)). Satisfaction and time saved come
from interviewing the three developers afterwards.

## Numbers

| Number | What it counts | Basis | Source |
| --- | --- | --- | --- |
| 39 migrations | ID fields migrated from int32 to int64 | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 3 developers | people who ran the migrations | reported | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 12 months | span of the case study | reported | [paper](https://arxiv.org/abs/2504.09691) |
| 595 code changes | changes submitted across all migrations | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 54 to 290 code changes | changes submitted per developer | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 214 code changes (35.97%) | changes made by the model alone | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 229 code changes (38.48%) | changes made by the model, then edited by people | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 152 code changes (25.55%) | changes made by people alone | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 74.45% | share of code changes the model generated (the first two kinds) | measured | [section 4.2](https://arxiv.org/html/2504.09691#S4.SS2) |
| 93,574 characters | total edits, as Levenshtein distance, across all migrations | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 64,996 characters (69.46%) | edits made by the model | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 28,578 characters (30.54%) | edits made by people | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 306 people | reviewers of the changes | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 149 teams | teams those reviewers belonged to | measured | [Table 1](https://arxiv.org/html/2504.09691#S4.T1) |
| 23,800 characters | edits in the largest migration, over 418 modified files and 39 code changes | measured | [Table 2](https://arxiv.org/html/2504.09691#S4.T2) |
| 71.80% | model share of edits in that largest migration | measured | [section 4.3](https://arxiv.org/html/2504.09691#S4.SS3) |
| 1 to 5 languages | programming languages touched per migration | measured | [Table 2](https://arxiv.org/html/2504.09691#S4.T2) |
| 3 attempts | model attempts per file | reported | [section 3.3](https://arxiv.org/html/2504.09691#S3.SS3) |
| 2 of 39 migrations | migrations that needed code owners' attention and slow production rollouts | reported | [section 4.3](https://arxiv.org/html/2504.09691#S4.SS3) |
| 50% | cut in total time per migration against earlier manual ones | self-estimate | [section 4.3](https://arxiv.org/html/2504.09691#S4.SS3) |
| about 2 years | time an earlier manual migration of one ID took | reported | [section 2.2](https://arxiv.org/html/2504.09691#S2.SS2) |

## What worked

- Finding candidates with a code index and letting the model edit the whole file replaced
  regular-expression searches and hand edits, and spared the team from writing transformation
  rules: the model fixed lines the index only hinted at, changed matching values inside
  SQL strings, and made smaller edits than suggested when that was right
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- In one example the paper shows, nearly the same short prompt updated both Java and C++ code
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- Automatic checks meant developers saw only changes that already built and passed tests; they
  called this a large gain over starting and waiting on checks by hand
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- Even for changes they wrote themselves, developers found the system's candidate locations more
  accurate than their old regular-expression searches
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The nightly run refreshed the list of remaining locations, so progress stayed visible; the
  developers started on small, local IDs and moved to large ones as they learned the system
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).

## What went wrong

- Large files did not fit the model's context window; those attempts failed the first gate and
  people made the edits (the paper notes later Gemini versions have a larger window)
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The model sometimes only reformatted code, only added comments, or made unrelated edits. The
  paper ties the people's share, 152 code changes (25.55%) and 30.54% of edits, to such cases,
  though it also blames other causes below for the same share
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- Output varied between runs; developers could not tell how many retries a file would need before
  giving up and editing by hand, and disliked the manual work left at the end
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The model handled Dart poorly for lack of training data, so IDs used heavily in Dart had lower
  model shares ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- Early on, developers new to the system did more edits by hand, which lowered the model share of
  some small migrations ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- Test suites that already failed blocked correct model changes at the test gate; developers had
  to get owners to fix those tests first
  ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The system could not run the tools that regenerate golden test outputs, so such tests sometimes
  failed and needed manual work ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The two largest migrations needed slow, owner-watched production rollouts, a step the system did
  not help with ([section 4.3](https://arxiv.org/html/2504.09691#S4.SS3)).
- The reference search over-includes irrelevant locations and can miss references beyond its
  distance limit; the paper relies on tests and slow rollouts to catch misses, and people sorted
  every left-over location ([section 3.1](https://arxiv.org/html/2504.09691#S3.SS1)).
- The authors list limits: no controlled comparison with other methods, so no single part of the
  system can be credited; a small sample, three developers and their 39 migrations; the developers had
  helped shape the system, which may bias their views; the 50% saving is perception, not time
  tracking; edit distance may miss the thinking involved; one kind of migration, one company, one
  internal model ([section 5](https://arxiv.org/html/2504.09691#S5)).
- **Not reported:** the cost in compute or tokens; how many files failed each gate or needed
  retries; how long developer and owner reviews took; whether any change caused a production
  problem or was rolled back; calendar dates of the work. By design the people's share counts only
  the net distance from the model's output to the submitted file, not their edits along the way,
  so it may understate their effort (ours)
  ([section 4.1](https://arxiv.org/html/2504.09691#S4.SS1)).

## Practices to copy

- [stated] Find candidate locations with a code index, include too many rather than too few, and let the model edit the whole file around each hint. ([Section 3.1](https://arxiv.org/html/2504.09691#S3.SS1))
- [stated] Sort locations with cheap rules first: drop the surely irrelevant, send the rest to the model, and let people settle leftovers in configuration. ([Section 3.2](https://arxiv.org/html/2504.09691#S3.SS2))
- [stated] Order checks from cheap to costly: response, non-trivial diff, parse, model self-check, build, tests; drop a file at its first failure. ([Section 3.3](https://arxiv.org/html/2504.09691#S3.SS3))
- [stated] Run the pipeline nightly so the list of remaining locations refreshes and progress shows. ([Section 4.3](https://arxiv.org/html/2504.09691#S4.SS3))
- [stated] Have a developer read every generated change and its code owners accept it before it is submitted. ([Section 3.3](https://arxiv.org/html/2504.09691#S3.SS3))
- [ours] Measure the model's and people's shares as edit distance between file snapshots, knowing the authors list it as a threat: it misses the thinking behind an edit. ([Section 4.1](https://arxiv.org/html/2504.09691#S4.SS1))
- [stated] Start with small, local migrations while the team learns the tool, then move to large ones. ([Section 4.3](https://arxiv.org/html/2504.09691#S4.SS3))
- [ours] Fix failing tests and support golden-file updates before starting, or correct changes stall at the test gate. ([Section 4.3](https://arxiv.org/html/2504.09691#S4.SS3))
- [ours] Check how well the model handles each language in scope; a weak language falls back to people. ([Section 4.3](https://arxiv.org/html/2504.09691#S4.SS3))
- [ours] Track wall-clock effort from the first day if you will claim time saved; this paper has only an estimate. ([Section 5](https://arxiv.org/html/2504.09691#S5))

## Context

- Model era: one fixed version of an internal Gemini model, fine-tuned with Google's DIDACT
  framework; the paper gives no dates for the 12 months of work beyond its April 2025 posting
  ([section 3.3](https://arxiv.org/html/2504.09691#S3.SS3)).
- Background: several of the same authors published a broader experience report on LLM-based code
  migrations at Google in January 2025,
  [on arXiv](https://arxiv.org/abs/2501.06972) and cited by this paper as in press at ICSE 2025
  (industry practice track); the paper calls its earlier accounts of this work high-level.
- Related: per-file gates and retries for a test-library move,
  [Airbnb Enzyme to React Testing Library](2025-04-01-airbnb-enzyme-to-rtl.md); fleet-wide
  migrations with verifiers and an LLM judge, [Spotify Honk](2025-11-06-spotify-honk.md).
