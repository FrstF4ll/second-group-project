---
name: project-proposer
description: Use when the user wants a project idea turned into a proposal, spec, or implementation plan — phrases like "propose a project for X", "spec out X", "write me a plan for X", "help me plan this app/feature", or when they describe a rough idea and want it developed into something buildable. Produces an iterative baseline-spec -> critical-review -> revised-spec -> architecture-doc package, grounded in this repo's actual source material (brainstorm notes, domain docs, prior plans) rather than generic assumptions. Not for implementing code — this only produces planning documents.
metadata:
  author: thomaslucking
---

# Project Proposer

Turns a rough project idea into the same multi-pass planning package already used in this repo
(`.scratch/plan-a/`, `.scratch/plan-c/`, `.scratch/plan-d/`): a baseline spec, a critical review that
finds its weaknesses, a revised spec that fixes them, and an architecture doc derived from the
final spec. Nothing here is implementation — no code, no migrations, only planning documents.

## Before drafting anything

1. **Read the repo's own source material first.** Root-level brainstorm/notes files, `docs/`,
   any domain PDFs/spreadsheets, `AGENTS.md`, and prior `.scratch/*/spec.md` files are ground
   truth — a spec built only from the user's one-paragraph idea and generic assumptions is the
   failure mode this skill exists to avoid. If the idea is a variant/extension of something
   already planned, read the existing plan before writing a new one.
2. **Find the issue-tracker convention.** Check `docs/agents/issue-tracker.md` (or `AGENTS.md`
   pointing at it) for where planning docs live in this repo. If found, follow it. Otherwise
   default to `.scratch/<feature-slug>/`, one directory per proposal, kebab-case slug.
3. **Ask, don't assume, when it changes the shape of the plan**: team size and timeline (drives
   whether a workstream-split table makes sense), and whether this is a from-scratch idea or an
   alternative/upgrade to an existing plan (drives whether step 3 below is a sibling plan or a
   revision in place).

## Workflow

Read `references/workflow.md` before starting — it has the full rationale and worked example
for each pass below. The short version:

1. **Baseline spec** (`spec.md`) — first honest pass at the idea: overview, user story, data
   model, tech stack, architecture, MVP scope in/out, risks, timeline, next steps. Follow the
   structure in `references/spec-template.md`. Mark it `Status: proposal` or `Status: planning
   complete` — never silently "final."
2. **Critical review** (`review.md`) — a *separate* file, written as if by a skeptical third
   party grilling the baseline. Never edit the baseline spec to "fix" it in place — the baseline
   stays frozen as a record, and corrections live in the review as a numbered delta table. Follow
   `references/review-template.md`.
3. **Revised spec** — either a sibling alternative plan (new `.scratch/<slug-b>/spec.md` that
   explicitly says which corrections from the review it bakes in and cross-references the
   baseline) or, after another grill pass, a final revised spec in the same family
   (`.scratch/<slug>/spec.md` v2, decisions recorded in a table). Use judgment: if the review's
   corrections are all adopted with no real alternative approach, skip straight to a final
   revised spec instead of manufacturing an alternative for its own sake.
4. **Architecture doc** (`ARCHITECTURE.md`) — derived *from* the final spec, not drafted in
   parallel. System overview, request flows, component map, auth/roles, authorization/scoping,
   any computed-feature pipeline, deployment shape, testability. Follow
   `references/architecture-template.md`.

Each pass is a separate file, never a rewrite of the previous one — the paper trail of what
changed and why is as valuable as the final answer.

## Diagrams

Use Mermaid for every structural diagram — data model, system overview, component
relationships, auth/role relationships. Read `references/mermaid-conventions.md` for the exact
diagram types to use and worked examples before drawing one. Keep step-by-step request flows as
plain numbered code blocks (they read better linearly than as sequence diagrams for this kind of
doc) unless the user asks for a sequence diagram specifically.

## Gotchas

- **Number open questions by how much they block, not by when they were raised.** The
  highest-blocking unresolved question goes first, even if it was the last one noticed.
- **"Deferred" and "out of scope" are different words with different meanings** — don't blur
  them. Something cut on purpose ("considered and dropped") reads differently from something
  merely not-yet-built ("later phase"). Say which one it is.
- **A risky/unproven calculation, integration, or formula is the headline risk, not a footnote.**
  If the spec's value proposition hinges on getting something like a weighted formula or an
  external protocol right, put it at the top of the risk table with "read the source values
  first, encode as test fixtures before writing the service" as the mitigation — not "test it
  later."
- **Enforce at the query/policy layer in the plan, not just the UI.** Any multi-role app plan
  that says "hide X from role Y" without also saying "and reject it server-side" has a gap —
  flag it in the review pass.
- **A test strategy line is mandatory**, even a short one — a spec with no mention of how the
  headline feature gets verified is an incomplete spec, not a lean one.
- **Don't build a workstream-split table if the user hasn't said how many people are working on
  this** — ask, or omit the section entirely rather than guessing team size.
