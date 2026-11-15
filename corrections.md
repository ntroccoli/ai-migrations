# Corrections

What this collection published wrong, and how a project that applied it can find and repair it.
Every revisit reads this file first, before anything else, even while it has no entry: README step
1 of both routes when the project has a record, step 10 of the [checklist](checklist.md) and step 7
of [applying the lessons](docs/applying-lessons.md).

## How a revisit uses it

1. For each entry, compare its "Published" span with the project's record: the collection's commit
   or date and the log entry it names, and earlier versions of the record in the project's git
   history, if it is kept there. Compare by date: a commit counts by its date, a log entry by its
   heading's. The entry applies when any of them falls in the span.
2. For an entry that applies, look for it in the project as "How to recognise it" says, then follow
   "How to find what it changed": the record first, then the git history of the files that the
   record's applied items touched.
3. Report what you found for each entry, and turn its "What to propose" into options for the
   project's owner, each with its trade-off. Change nothing until the owner chooses (P1), except
   the record's "Corrections checked:" line (step 4).
4. In the record, write the entries you checked on its "Corrections checked:" line, with the date
   and what you found ("COR-1: not found", "COR-2: found, proposal 4"); with no entry, "none listed".
5. No entry, or none that applies: say so in one line and go on with the revisit.

While an entry exists, the README and [llms.txt](llms.txt) ask anyone who ran the checklist or the
lessons route during its span to run the revisit again.

## Entries

None yet.

## Provenance

Levels as in the [checklist](checklist.md#provenance).

| ID | Source | Level | Prevents | Blind failure |
| --- | --- | --- | --- | --- |
| P1 | ours | ours | a repair the owner did not choose, made by an agent that trusts an entry over the project's own reasons | leaving a wrong rule at work in the project while the question waits; ask the owner at once |
