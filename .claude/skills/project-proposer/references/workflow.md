# Workflow detail

This is the rationale and worked example behind the four passes in `SKILL.md`. It mirrors what
actually happened in this repo across `.scratch/plan-a/`, `.scratch/plan-c/`, and `.scratch/plan-d/`
— read those three `spec.md` files plus `plan-a/review.md` if you want the real example instead
of the abstract description below.

## Why multiple passes instead of one "final" spec

A single-pass spec written straight from an idea tends to smuggle in unstated assumptions and
skip the one or two decisions that actually make or break the project (a formula, an integration,
an auth boundary). Splitting drafting from criticism catches those before code gets written,
and keeps a paper trail: anyone reading the `.scratch/<slug>/` directory later can see not just
what was decided but what was considered and rejected, and why.

## Pass 1 — Baseline spec

Write the most straightforward version of the idea that satisfies the user's stated goal. Don't
pre-optimize or pre-cut scope — that's the review's job, and a baseline that's already been
second-guessed by its own author is a worse anchor for the review than an honest first pass.

Do, however, ground it in real material: if there's a source document (a spreadsheet a workflow
currently limps along on, a naming convention PDF, an existing partial implementation), read it
before writing the data model or the file-naming logic, rather than inventing structure that
sounds plausible.

Every baseline spec needs, at minimum:
- An overview / thesis: one or two sentences on what problem this solves and how, sharp enough
  that a reader could restate it back to you correctly.
- A user story per role.
- A data model — entities, key fields, relationships. Use a Mermaid `erDiagram` per
  `references/mermaid-conventions.md`.
- A tech stack table with a reason per row where the choice isn't the obvious default.
- An MVP scope split into **In** and **Out**, with a one-line reason for anything non-obvious in
  **Out** (cut vs deferred — see the Gotchas in `SKILL.md`).
- A risk table, ordered by severity, with a concrete mitigation per row (not "will investigate").
- Next steps: a short ordered list, not a restatement of the whole plan.

## Pass 2 — Critical review

Written as a separate document, addressed to the baseline as if reviewing someone else's PR. Structure:

1. **The idea** — is the stated problem real, and does the baseline actually solve the whole
   thing or just part of it? Name the honest boundary if it's partial.
2. **The stack** — is the tech choice appropriate for the team/timeline, or over/under-engineered?
3. **The planning** — walk the baseline section by section; call out ambiguity, the biggest
   overrun risk, and anything load-bearing that's unstated (e.g., a notification step referenced
   in the user story but with no data model support for who gets notified).
4. **Corrections** — a numbered table: `# | Correction | Impact`. This is the payload of the
   review — everything above builds up to it. Explicitly note these corrections are *not*
   applied to the baseline; the baseline stays frozen as a record.
5. Optionally, a **third way** if the review surfaces a fundamentally different approach worth
   considering (not just a tweak) — summarize it here, detail it in a sibling spec if it's worth
   pursuing (see Pass 3).

## Pass 3 — Revised spec

Two shapes, pick based on what the review found:

- **Sibling alternative plan**: when the review's "third way" is a genuinely different
  interaction model or architecture, not just the corrections applied. New directory or new
  spec file, explicitly states in its header which baseline and review it descends from, and
  which numbered corrections it bakes in.
- **In-place revision**: when the corrections are all adopted and there's no real alternative,
  skip the sibling and go straight to a revised spec in the same family. This is often the
  result of a *second* grill pass on the sibling/alternative itself — decisions accumulate in a
  `Decisions taken` table (`# | Question | Decision`), and the spec's data model, scope, and
  risk sections get rewritten to reflect them, not patched.

The revised spec inherits every requirement from Pass 1's baseline checklist, plus:
- A `Decisions taken` table if this pass resolved open questions.
- An `Open questions` section for anything still unresolved, **ordered by how much it blocks**,
  not by discovery order. Each entry should say what it blocks.
- A workstream split table, *only if* the user has given you a team size — ask rather than guess.
- A test strategy section: what gets unit-tested, what gets feature-tested, and explicitly what
  stays untested/offline (e.g., "the suite does not call the real external API — that's for
  manual eyeballing in dev, not CI").

## Pass 4 — Architecture doc

Derived from the final (Pass 3) spec, not drafted independently — if something in the
architecture doc isn't traceable to a decision in the spec, that's a sign either the spec is
missing something or the architecture doc is inventing scope.

Sections, in order:
1. **System overview** — actors, the app, and every external dependency (storage, DB, third-party
   APIs) as a Mermaid diagram (see `references/mermaid-conventions.md`). State explicitly what's
   *absent* (no queue, no OAuth, no polling, etc.) if the baseline/review considered and dropped
   it — this is a real design statement, not padding.
2. **Database schema** — Mermaid `erDiagram`, generated from the spec's data model section.
3. **Request flow(s)** — one per major user journey, as a numbered step list (not a diagram —
   see `SKILL.md`'s Diagrams section for why), each step naming the concrete
   controller/service/component responsible.
4. **Component map** — a file tree of what actually gets built, annotated inline with a one-line
   purpose per file. Explicitly list what's *absent by decision* (e.g., "no `Jobs/`, no
   `Exports/`") if the spec ruled those out.
5. **Auth/roles and authorization/scoping** — how identity maps to roles, and where access
   control is actually enforced (query layer / policy, not just UI). This is the section most
   likely to reveal a gap the review pass should have caught — if it does, note it.
6. **Any computed-feature pipeline** (a formula, a scoring algorithm, an aggregation) — its own
   small diagram or pipeline sketch, plus a one-line note on where it's tested.
7. **Deployment shape** — what actually needs to run in production: one line per moving part
   (app process, DB, queue worker or its absence, cron or its absence).
8. **Testability** — which pieces are pure/unit-testable vs. need the real HTTP/DB pipeline,
   and which external calls the test suite deliberately never makes.

## When to shorten this

If the user explicitly asks for "just a quick spec" or a single document, don't manufacture all
four passes — write Pass 1 to the checklist above and stop, but still ground it in the repo's
real source material. Offer the full multi-pass treatment rather than assuming it; a one-line
idea doesn't always want a four-document package.
