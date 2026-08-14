# Review template

Used for Pass 2. Written as a separate file from the baseline spec — never edit the baseline in
place. Address it to the baseline as if reviewing someone else's work; the point is honest
friction, not rubber-stamping.

```markdown
# Review — third-party overview of <baseline plan name>

**Status:** reviewed — baseline frozen, corrections recorded as delta, not applied.
**Source:** <link to the baseline spec being reviewed>

## 1. The idea

- Is the stated problem real? Is it fully solved, or does the baseline automate/address only
  part of it? Name the honest boundary if partial — don't let "MVP" quietly hide a gap.
- Any missing case the user stories imply but the spec doesn't cover (e.g., the no-file /
  no-network / no-account edge case)?

## 2. The stack

- Is the choice appropriate for the team's experience and the timeline, or over/under-built?
- Any dependency pulling in real complexity for a feature that doesn't need it?

## 3. The planning

Walk the baseline section by section. Call out, specifically:

1. **The biggest overrun risk** — usually a feature whose "faithful" version is much harder than
   its "good enough for the goal" version. Name both.
2. **Any ambiguous requirement** — especially anything mentioned in the user story but with no
   supporting data model field or explicit rule (e.g., a notification step with no recipient
   field).
3. **Small gaps** — auth model mismatches, missing test-strategy line, scope items that contradict
   each other.

## 4. Corrections (delta vs baseline, not applied)

| # | Correction | Impact |
|---|------------|--------|
| 1 | ... | ... |

These corrections are **not** baked into the baseline file — they either land in a sibling
alternative plan or a subsequent revised spec (see `references/workflow.md`, Pass 3). This file
stays as the change record either way.

## 5. Third way (optional)

Only include this if the review surfaces a genuinely different approach, not just the corrections
applied. Summarize it in a paragraph; if it's worth pursuing, it gets detailed in its own sibling
spec, not fully fleshed out here.
```
