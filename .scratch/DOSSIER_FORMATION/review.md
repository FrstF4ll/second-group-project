# Review — third-party overview of the Dossier de formation Plan A baseline

**Status:** reviewed — baseline frozen at `spec-v1.md`, corrections recorded as delta, not applied.
**Source:** `.scratch/DOSSIER_FORMATION/spec-v1.md` (frozen baseline).

## 1. The idea

- The problem is real and, unusually for a school-project idea, **formally documented**: the dossier is a mandatory CFC deliverable with an official brief (`JT_DEV_B09_1.5`), a prescribed fiche template, and a defined audience (apprentice, formateurs, commissaire, recours). The baseline is not inventing a need.
- The honest boundary is stated correctly: the tool automates the *structure and the review loop*, not the *writing*. That is the right boundary, but the baseline never says the second half out loud — the fiche **body text is deliberately the apprentice's own**, and the tool prefills metadata only. This matters for two reasons: the brief's own §4.6 warns that AI-assisted prose degrades the dossier's value as proof, and an app that generated fiche text would quietly poison the product's credibility story. It should be a stated rule, not an accident.
- The user stories imply a case the data model doesn't yet cover: the brief's §3.1 requires a **header block** (name, intitulé de la formation, période de formation, sommaire) at the start of the dossier. The baseline's dossier overview page implies it and the markdown export should emit it, but the data model has **no fields** for the apprentice's formation title or formation period. This is a real gap, not polish.
- Two derivations are named but not pinned down: the cohort gate "remaining catalog projects" and the "recently reviewed" indicator. "Remaining" needs a definition (catalog projects with no entry at all for that apprentice), and "recently reviewed" needs a window. Both are trivially computable; leaving them fuzzy invites two devs to implement two different things.

## 2. The stack

- Boring and correct for this team: Laravel 12 + Inertia + React 19 + Tailwind, same as the grade-manager plan. The `json` `choice_options` column and the plain-PHP markdown exporter are the right size. No spreadsheet, no git, no real-time anything — all defensible cuts.
- Two small stack-level nits:
  - `REVIEW_COMMENTS.section` is a free-form string. Typo'd or drifted section names will silently orphan pinned comments. It should be constrained to the fiche's known sections (enum or validated list), since the fiche structure is fixed by the brief.
  - Proof image upload is only safe if `file_path` is served through an authorized route, not a public disk path — the same rule the grade-manager plan already learned. The baseline mentions storage but not the serving rule.

## 3. The planning

Walking the baseline section by section:

1. **The biggest overrun risk is correctly identified and correctly defused** — the review loop, cut to the light model (read-time flags, no snapshots, no diff renderer). That is the single most important scoping call in the document, and it's right. What the baseline *doesn't* do is guard the transition logic: auto-cancel on "edit" is stated but never defined as *any mutation of an entry's content* (fiche fields, proofs, competencies), and deletion isn't covered at all (deleting an entry with a pending review would strand a review over a corpse). All of these transitions should go through one service so a two-tab race can't produce a review whose subject changed mid-flight.
2. **The light-diff baseline is correct but should be stated as a rule, not left as implementation** — an entry is flagged `new` on the first review (nothing reviewed yet), `changed` when `entry.updated_at` exceeds the latest `returned` review's `reviewed_at`, `unchanged` otherwise. It's implied; the spec should just say it.
3. **The authorization matrix is missing.** The baseline names three policies but never states who can do what. The intended shape: apprentice = read/write their own entries + ask/cancel reviews; formateur = read assigned apprentices' entries (never write them), write reviews/comments/evaluations for their own apprentices; admin = catalog + assignments. A multi-role plan that leaves this implicit is exactly the gap that produces a "hidden in the UI but reachable by URL" bug later. Enforce at the query layer and feature-test the 403s. Related: the demo seed should include **two formateurs with disjoint apprentices** so scoping is actually demonstrable, not just asserted.
4. **The notifications section contradicts itself.** MVP-In lists "in-app + email," while Open Question #3 asks whether it's in-app or in-app + email. Decide the in-app mechanism: a dashboard "pending review" flag (no notifications table) plus email is the smallest honest shape for a 6-week demo.
5. **Small gaps:** the fiche field set does map 1:1 to the brief's template (good — checked); the `source: prefill|manual` marker on `ENTRY_COMPETENCIES` is a nice touch that keeps the prefill honest; the deferred standalone-competency logging is correctly labelled *deferred* (not cut), and the pivot genuinely generalizes to it; the fiche's "burden" risk is acknowledged and mitigated by prefill, which is the right lever.

## 4. Corrections (delta vs baseline, not applied)

| # | Correction | Impact |
|---|------------|--------|
| 1 | **Add the dossier header block to the data model** — `APPRENTICES.formation_title`, `formation_start`, `formation_end` — and render it in the dossier overview + the markdown export (name, formation, period, sommaire) per brief §3.1 | Closes the §3.1 gap; the export becomes a real dossier, not a stack of fiches |
| 2 | **Pin the two derivations:** cohort gate `remaining` = catalog projects with no entry for that apprentice; `recently reviewed` = a fixed configurable window (default ~14 days) computed from `reviewed_at`, never stored | Two devs implement the same rule |
| 3 | **Auto-cancel covers any entry mutation** — fiche fields, proof add/delete, competency changes — **and entry deletion**; all transitions single-threaded through `ReviewService` | No review over a moving target; no stranded review over a deleted entry |
| 4 | **Constrain `REVIEW_COMMENTS.section`** to the brief's fixed section list (enum/validated), not a free string | Pinned comments can't silently orphan |
| 5 | **State the authorization matrix explicitly** and seed ≥2 formateurs with disjoint apprentices | Scoping is enforced at the query layer and demonstrable in the demo |
| 6 | **Resolve the notification contradiction:** dashboard flags + email (Mailtrap dev), no notifications table; drop Open Question #3 | Removes a self-contradiction; smallest honest shape |
| 7 | **State the no-prose-generation rule** in the fiche builder: the tool prefills metadata (title, competencies, variant) only; body text is the apprentice's own, per brief §4.6 | Keeps the tool out of the "AI wrote my dossier" credibility problem |
| 8 | **Proof files: validate type/size and serve `file_path` through an authorized route** (policy-gated), not a public disk path | Same lesson as the grade-manager's PDF route |

## 5. Third way

The credible alternative is **"manage the template" instead of "replace it"**: the apprentice keeps the dossier as a Markdown repo on the existing GitHub Pages template and the formateur reviews through pull requests. It's rejected for three reasons — most apprentices aren't git-literate, PR-style review is a worse formateur UX than a purpose-built loop, and the baseline's decision (app as system of record + markdown export) already delivers the portability the template existed for. Recorded here as considered-and-dropped, not deferred: the choice was made deliberately and the export keeps the door open to the template format later.

The one-way comment model (trainer→apprentice, no reply thread) deserves an affirmation with a flag: it's a *philosophy* decision that also means the tool can't track "resolved" state — the formateur's `needs_changes` verdict is the only binary, and the evidence that the apprentice fixed things is the light-diff showing the entry changed. That works; it should stay a decision, not silently grow a thread feature later.
