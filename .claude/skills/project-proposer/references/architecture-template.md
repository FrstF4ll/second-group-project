# Architecture doc template

Used for Pass 4. Derived from the final spec — every section should trace back to something the
spec already decided. If you find yourself inventing a new decision while writing this doc, stop
and add it to the spec first.

```markdown
# Architecture — <Project name / plan label>

**Status:** derived from `<path to the final spec>`.

## System overview

```mermaid
flowchart LR
%% actors, the app, every external dependency — see references/mermaid-conventions.md
```

One paragraph: what's deliberately absent (no queue, no OAuth, no polling, no external API
beyond X) and why, if the spec considered and dropped those. State what the single source of
truth is (usually the DB) and how derived values (an average, a score) get computed — on read,
cached, or precomputed — and why that's fine at this project's scale.

## Database schema

```mermaid
erDiagram
%% same entities as the spec's Data model section — see references/mermaid-conventions.md
```

One or two sentences per non-obvious relationship or field — why it exists, what it drives
downstream (e.g., "this field gates query-layer scoping, see Authorization below").

## Request flow: <major user journey>

```
1. <actor does X>
2. POST/GET <route>  (<Controller@method>)
     ├─ <validation / policy check>
     ├─ <service call>
     └─ <side effect — notification, file write, etc.>
3. <redirect / response>
```

Repeat per major journey. State explicitly whether each step is synchronous in one request or
backgrounded, and why.

## Component map

```
app/
├── Http/Controllers/    # <one-line purpose each>
├── Models/
├── Policies/
└── Services/
```

List what's absent by decision (e.g., "no `Jobs/`, no `Exports/`") if the spec ruled those out —
this is a real design statement, not padding.

## Authentication and roles

How identity maps to role, expressed via the erDiagram above plus one sentence on the redirect
logic post-login. Use the small role→destination `flowchart` from
`references/mermaid-conventions.md` only if the mapping isn't already obvious from the erDiagram.

## Authorization and scoping

Where access control is actually enforced — name the policy/query-layer mechanism per role, and
explicitly call out that hiding an option in the UI is not enforcement if that's a real risk the
review pass flagged.

## <Headline computed feature pipeline, if any>

A short pipeline diagram or numbered steps: inputs -> transformation -> where it's rendered.
One line on where it's tested (see Testability below).

## Deployment shape

One line per moving part: app process, DB, queue worker (or explicitly "none"), cron (or
explicitly "none"), file storage, third-party integrations and their credentials.

## Testability

- Which services are pure (data in, data out, no network/auth) and unit-tested against real
  values, not invented ones.
- Which flows are feature-tested through the real pipeline.
- Which external calls the test suite deliberately never makes, and why (offline by design).
```
