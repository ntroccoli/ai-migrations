# Corrections

What this collection published wrong, and how a project that applied it can find and repair it.
Every revisit reads this file first, before anything else, even while it has no entry: README step
1 of both routes when the project has a record, step 10 of the [checklist](checklist.md) and step 7
of [applying the lessons](docs/applying-lessons.md).

## How a revisit uses it

1. For each entry, recognise whether the project could have read it, first by the publication
   window, then by the log entry. Window: compare the entry's "Published" span with the record's
   date and the collection's commit or date it names, and with earlier versions of the record in
   the project's git history, if it is kept there; a commit counts by its date. A review dated
   before the span did not read the wrong text: it applies only when the record or the project shows
   what "How to recognise it" names anyway. Log entry: a record that names a log entry newer than
   the span (by its heading's date), or lists the entry as checked, read the corrected text: it
   does not apply. Otherwise it applies when any of these dates falls in the span.
2. For an entry that applies, look for it in the project as "How to recognise it" says, then follow
   "How to find what it changed": the record first, then the git history of the files that the
   record's applied items touched. Take the files each role loads where it starts: a session
   started in another folder (the home folder, a coordinator's folder) loads other instruction
   files and another memory store than one started in the repository, so read the history of each.
3. Report what you found for each entry, and turn its "What to propose" into options for the
   project's owner, each with its trade-off. Change nothing until the owner chooses (P1), except
   the record's "Corrections checked:" line (step 4). A repair proposes the repair only: every
   other gap the revisit finds, its new or changed lessons and questions included, gets one line
   each, with no recommendation, so the owner can ask for them once the repair is chosen.
4. In the record, write the entries you checked on its "Corrections checked:" line, with the date
   and what you found ("COR-1: not found", "COR-2: found, proposal 4"); with no entry, "none listed".
   Once a repair is applied, the line says who made it: "COR-2: found, repaired by <who>, <date>".
   A shared file (a user-level setup several projects load) may already have been repaired by
   another project's revisit: check its history, and record "COR-1: repaired by <who>, <date>"
   instead of proposing the repair again.
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
