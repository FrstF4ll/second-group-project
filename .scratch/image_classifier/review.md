# Review — third-party overview of Image Classifier baseline

**Status:** reviewed — baseline frozen, corrections recorded as delta, not applied.
**Source:** `.scratch/image_classifier/spec.md`

## 1. The idea

The stated problem — "let a user upload a photo and see what a model thinks it is" — is fully
solved by the baseline, not partially. There's no hidden gap between the user story and the
scope: register, log in, upload, see labels, see history. All four are in the data model and the
architecture.

What the baseline doesn't examine is *why* a user would want this beyond a demo. "Upload a photo,
get back one of 1000 generic ImageNet labels" isn't a product on its own — every other plan in
this repo (grade management, docs RAG) solves a real workflow pain point for a named person. This
one solves "watch a pretrained classifier work," which is a fine school-project scope, but the
spec should say that plainly rather than imply a product pitch. It gestures at this in the Risks
table ("may not produce a compelling demo narrative") but that's a mitigation buried under a
different problem, not a statement of what this project actually is.

## 2. The stack

FastAPI + SQLAlchemy + React is appropriately sized for the scope — no over-engineering. Putting
the whole backend in Python (not just the inference step) is defensible given the team has no
stated Python experience either way, so there's no "familiar half + unfamiliar half" tradeoff to
make — it's unfamiliar either way, and one language is simpler to run/deploy/debug than a
Node+Python split for four routes and one model call.

The gap: **the baseline never states which Python web/ML tooling experience the team actually
has**, unlike `RAG_SYSTEM/spec.md`, which explicitly named "team has no Python experience" as the
reason it picked Node. This spec should either confirm the same fact applies here (it likely
does, same team) or say why a from-scratch Python backend is being chosen anyway despite that.
Right now it's implied by the Risks table but never stated as a stack decision.

## 3. The planning

1. **The biggest overrun risk isn't in the Risks table**: FastAPI + JWT auth + SQLAlchemy models
   + a working `transformers` pipeline, for a team with no stated FastAPI or Python-auth
   experience, is realistically a 1.5–2 week build before any React work starts — not a "week 1
   spike, then build" as Next Steps implies. The baseline's "faithful" version (real JWT auth,
   password hashing, SQLAlchemy migrations) is meaningfully harder than the "good enough for a
   demo" version (a single seeded demo user, no self-registration, session cookie instead of
   JWT). The spec doesn't name this tradeoff at all.

2. **Ambiguous requirement**: the user story says "I can see a history of everything I've
   uploaded" but nothing in MVP scope or the architecture says whether a user can *delete* an
   upload, or whether uploads are private per-user (implied by `user_id FK` but never stated as
   an authorization rule — is `GET /images` scoped to `current_user.id`, or does any logged-in
   user see everyone's history?). This is exactly the "enforce at the query layer, not just the
   UI" gap the skill's own gotchas call out, and the baseline is silent on it.

3. **Small gaps**:
   - No `image` size cap or allowed-extension list is *specified as a number/list* — the Risks
     table says "cap file size" and "validate content-type" but never picks values, so it reads
     as a placeholder for a decision rather than a decision.
   - `model_version` exists on `PREDICTIONS` for future-proofing against a fine-tuned model, but
     nothing in Next Steps says how it gets populated for the pretrained-only MVP (a literal
     string constant is fine — just say so).
   - No mention of what happens on a failed/slow inference call (model still loading, corrupt
     image file) — the upload endpoint's error path is unspecified.
   - Test strategy has no feature test for the auth flow itself (register → login → JWT
     accepted on a protected route), only for the upload endpoint's auth *rejection*.

## 4. Corrections (delta vs baseline, not applied)

| # | Correction | Impact |
|---|------------|--------|
| 1 | State explicitly whether the team has Python web-framework experience (FastAPI/Flask/Django), same way `RAG_SYSTEM/spec.md` stated Node experience — this determines whether week 1 is "spike the model" or "spike the model *and* learn FastAPI auth." | Changes the Next Steps timeline and possibly whether JWT auth is even the right MVP choice vs. a simpler session-cookie or single-seeded-user approach. |
| 2 | Add an explicit authorization rule: `GET /images` (and any per-image detail route) must scope to `current_user.id` at the query layer, not just hide other users' uploads in the UI. | Closes the "hide in UI, still reachable via API" gap the skill flags as a recurring mistake. |
| 3 | Pick concrete values for upload validation: max file size (e.g. 5 MB) and allowed extensions/MIME types (e.g. `.jpg`, `.jpeg`, `.png`), and specify the rejection response (4xx + message) rather than leaving "cap file size" as an unquantified mitigation. | Makes the upload endpoint actually specifiable/testable instead of a placeholder. |
| 4 | Add a feature test for the full auth round-trip (register → login → JWT accepted on a protected route), not just the upload endpoint's rejection of unauthenticated requests. | Covers the auth flow itself, which is new-territory code for this team per Correction #1. |
| 5 | State the MVP's honest framing directly in the Overview: this is a demo of a pretrained classifier working end-to-end through a real login/upload flow, not a product solving a named workflow problem the way the other plans in this repo do. | Sets expectations correctly for anyone comparing this plan against plan-a/plan-d/RAG_SYSTEM side by side when the team picks a final project. |

## 5. Third way

Not pursued here — the corrections above are all adopted-in-place fixes to the baseline's own
plan, not a fundamentally different architecture or interaction model. No sibling alternative
plan is warranted; the next pass should be an in-place revision (Pass 3) that bakes in
Corrections #1–5 directly into a revised spec.
