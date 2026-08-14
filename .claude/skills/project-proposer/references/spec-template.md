# Spec template

Used for both the baseline spec (Pass 1) and the revised spec (Pass 3) — the revised version adds
the `Decisions taken` table and reorders/expands sections as decisions land. Delete any section
that genuinely doesn't apply rather than leaving it as an empty header; don't force every section
into a spec where it makes no sense (e.g., no workstream split without a known team size).

```markdown
# Spec: <Project name> — <Plan label, e.g. "Plan A" or omit if there's only one>

**Status:** proposal | planning complete | superseded by <link>
**Source:** <what grounded this — brainstorm notes, prior plan, domain docs>

## Thesis / Overview

One or two sentences: what problem this solves, how, and for whom. Sharp enough that someone
could repeat it back correctly after one read.

## User stories

One per role. Plain first-person walkthrough of the golden path, not a formal user-story-points
format.

## Decisions taken (revised spec only — omit in the baseline pass)

| # | Question | Decision |
|---|----------|----------|
| 1 | ... | ... |

## Data model

```mermaid
erDiagram
    %% see references/mermaid-conventions.md
```

Prose notes on any non-obvious field or relationship — why it exists, what it's derived from.

## <Headline computed feature, if any — e.g. "Weighted average", "Recommendation score">

If the project's value proposition hinges on a formula, algorithm, or aggregation, give it its
own section: the inputs, the calculation (plain prose or pseudocode, not a spreadsheet formula
string), and where the real-world values it must match come from.

## Tech stack

| Layer | Choice |
|-------|--------|
| ... | ... |

Add a one-line reason per row only where the choice isn't the obvious default for the stack.

## Architecture

```
<file tree of what actually gets built>
```

## MVP scope

### In
- ...

### Out
- <feature> — cut | deferred: <one-line reason, and say which of the two it is>

## Risks

| Risk | Mitigation |
|------|------------|
| <highest-severity risk first> | <concrete action, not "investigate later"> |

## Workstream split (only if team size is known — ask, don't guess)

| Week | Plan |
|------|------|

## Test strategy

- Unit: ...
- Feature: ...
- Explicitly untested / offline: ... (and why)

## Open questions (revised spec — ordered by how much each blocks, not discovery order)

1. **<question>** — blocks <what>.
2. ...

## Next steps

1. ...
```
