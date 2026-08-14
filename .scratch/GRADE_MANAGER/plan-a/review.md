# Review — third-party overview of Plan A

**Status:** reviewed — baseline frozen, corrections recorded as delta, not applied.
**Source:** same source material as `../plan-a/spec.md`.

Third-party review of the Gestionnaire de note plan. The original plan is frozen at `.scratch/plan-a/spec.md`. This file records the review and the corrections that would improve it, kept deliberately separate so the baseline stays untouched. Plan C (`.scratch/plan-c/spec.md`) is the alternative path built on these corrections.

## 1. The idea

- The pain is real: six steps to communicate one grade is absurd.
- Honest boundary: Plan A automates steps 3–6 (rename, store, notify, export) — the administrative half. Steps 1–2 (handling the scan and the email inbox) stay manual. The apprentice still finds the PDF and drags it in. That is fine for a POC, but name it: this automates the paperwork, not the friction.
- **Gap:** data-only grades (no scan) are absent from the spec. The upload form should make the file optional.

## 2. The stack

- Boring and correct. Laravel + Inertia + React + Tailwind is the safest choice for this team in six weeks; `maatwebsite/excel` is the right PHP library.
- Note: React adds real cost with zero complexity payoff on three pages (login, upload form, list). Keep it anyway — using React is a legitimate school-project goal.

## 3. The planning

Good instincts; three weaknesses:

1. **Excel mirror is the biggest overrun risk.** The canevas is a live calculation workbook (weighted CFC, 8 semesters, module/competency matrices, `#DIV/0!`). Faithfully regenerating five sheets means reverse-engineering the Swiss CFC grading rules for an export nothing consumes. A simple per-module/per-student sheet proves the concept at a tenth of the effort.
2. **Coach/trainer notification is ambiguous.** It is in MVP while their dashboards are out — so notification must mean *email with the renamed PDF attached*. Pin it down.
3. **Two small gaps:** a `register` flow is the wrong model (an admin creates apprentices; for a POC seed demo users and drop register); and the spec has no test strategy line — at minimum feature-test grade submission and unit-test the rename parser.

## 4. Corrections (delta vs Plan A, not applied)

| # | Correction                                                        | Impact |
|---|-------------------------------------------------------------------|--------|
| 1 | File upload optional — data-only grades allowed                    | Closes the no-scan workflow gap |
| 2 | Seed demo users (apprentice/coach/trainer/admin); drop register    | Less auth surface, faster demo |
| 3 | Pin notification: email with renamed PDF attached, no in-app link  | Removes the ambiguity at week 4 |
| 4 | Flat export (per module / per student) instead of 5-sheet mirror   | Kills the biggest overrun risk |
| 5 | Test strategy: feature test grade submission, unit test renamer    | Sets the quality bar early |

These corrections are baked into Plan C. If the team relocates all five into Plan A later, this file stays as the change record.

## 5. Third way (Plan C)

Fully detailed in `.scratch/plan-c/spec.md`. Summary: invert the interaction from "fill a form" to "confirm a guess." App pushes the grade to a confirmation screen prefilled from filename + email heuristics; apprentice taps; pipeline runs. Falls back to the Plan A form when parsing fails.