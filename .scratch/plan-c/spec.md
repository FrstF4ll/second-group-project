# Spec: Gestionnaire de note — Plan C

**Status:** proposal — potential upgrade path, not the baseline.
**Source:** reviewed in `.scratch/plan-a/review.md`; sibling to frozen baseline `.scratch/plan-a/spec.md`.

Plan C is the third way: "confirm, don't fill." It inverts Plan A's interaction so the apprentice confirms the app's guess rather than filling a form, attacks the two most annoying steps (scan inbox, download), and carries all five corrections from the Plan A review.

## Overview

Plan A automates the paperwork (rename, store, notify, export) but the apprentice still fetches the scan and drags it in. Plan C removes that too: the app finds the grade (via forwarded email or IMAP polling), prefills the metadata from the filename and email heuristics, and the apprentice just confirms. Same outcome, one tap.

## User story

As an apprentice, I forward the grade email (or the app polls my inbox). The app:

1. Extracts the attached PDF
2. Prefills metadata: filename → module number via the mapping table, plus email subject/sender heuristics
3. Shows one confirmation screen: "Math 2, semestre 4, 5.5 — correct?"
4. On confirm, runs the pipeline: store, rename per JT convention, notify coach+trainer (email + attached PDF), export

If parsing or prefill fails, the screen degrades to the Plan A manual form.

## Corrections from the review (baked in)

| # | Correction | In Plan C |
|---|------------|----------|
| 1 | File upload optional — data-only grades allowed | Yes — a "no attachment" entry is just confirm-on-text |
| 2 | Seed demo users; drop register | Yes — seeded apprentice/coach/trainer/admin, no register route |
| 3 | Notification pinned: email with renamed PDF attached | Yes — no in-app link, dashboards stay out of MVP |
| 4 | Flat export, not 5-sheet mirror | Yes — per module / per student export |
| 5 | Test strategy: feature test submission, unit test prefill | Yes — stubbed IMAP + confirm flow both tested |

## Data model

Identical to Plan A's entities, plus parsing support:

| Entity     | Key fields                                                              | Relationships |
|------------|-------------------------------------------------------------------------|---------------|
| Apprentice | name, email, year, assigned coach                                       | belongs to Coach |
| Coach      | name, email                                                             | has many Apprentices |
| Trainer    | name, email                                                             | has many Apprentices |
| Grade      | subject, score, date, module ref, file_path (nullable), source (email/forward/attach), prefill_confidence, status | belongs to Apprentice |
| `Grade` gains: `source`, `prefill_confidence` | —                                                               |               |

Additional data:

- **Module catalog** — seeded as in Plan A (number, type CIE/EPSIC, name, grade).
- **Email ingestion table** — per-apprentice inbox connection (provider, IMAP host, credentials or forwarding address), or a single shared forwarding inbox.
- **Mapping table** — filename substrings / email sender patterns → module number, used by the prefill heuristic.

### Grade status flow

```
incoming → prefilled → confirmed → notified
incoming → prefilled → manual    (prefill rejected → Plan A form)
```

- `incoming` — email received / forwarded, not yet parsed
- `prefilled` — metadata guessed, awaiting apprentice confirmation
- `confirmed` — apprentice accepted the guess (or entered manually)
- `notified` — coach + trainer emailed with the renamed PDF

## Tech stack

Same as Plan A:

| Layer        | Choice                                                |
|--------------|-------------------------------------------------------|
| Backend      | Laravel 12                                            |
| Frontend     | React 19 via Inertia.js                               |
| Styling      | Tailwind CSS                                          |
| Auth         | Laravel built-in auth, seeded demo users (no register)|
| File storage | Local (`storage/app/grades/`)                         |
| Excel        | `maatwebsite/excel` flat export (per module / student)|
| Email        | Laravel Mail (Mailable) — notify coach+trainer        |
| Intake       | Laravel IMAP (`webklex/laravel-imap`) or forwarded-to shared inbox; stubbed for tests |

## Architecture

```
second-group-project/
├── app/
│   ├── Http/Controllers/        # GradeController, ConfirmController, InboxController
│   ├── Models/                  # Apprentice, Coach, Trainer, Grade, Module, InboxMapping
│   ├── Mail/                    # GradeNotification Mailable
│   ├── Exports/                 # FlatGradeExport
│   ├── Services/
│   │   ├── GradeService/        # store, rename, notify, export
│   │   ├── Prefill/             # FilenameParser, EmailHeuristics, MappingTable
│   │   └── Inbox/               # ImapFetcher (swap-able; stubbed in tests)
│   └── Jobs/                    # FetchGrades (scheduled), ProcessIncomingGrade
├── database/migrations/
├── database/seeders/            # users, module catalog, mapping table
├── resources/js/Pages/          # Auth, Grades/Confirm.jsx, Grades/Upload.jsx (fallback), List.jsx
├── storage/app/grades/
├── .scratch/plan-c/spec.md      # This file
└── .scratch/plan-a/{spec,review}.md  # Sibling baseline + review
```

Rewrite note: since this spec sits alongside the Plan A files, the tree above is a delta — reusing the shared app structure from the baseline where unchanged.

## MVP scope (in / out)

### In scope
- Seeded demo users + simple auth (no register)
- Email intake: forwarded-to shared inbox or per-apprentice IMAP polling (stubbed for tests)
- Attachment extraction
- Prefill: filename parsing + email heuristics via mapping table
- Confirmation screen with manual-edit fallback (Plan A form on parse failure)
- Optional file for data-only grades
- Store + rename per JT convention
- Coach + trainer email notification with renamed PDF attached
- Flat Excel export
- Module catalog seeder + mapping table seeder

### Deferred
- Coach/trainer dashboards, coach comments
- OneDrive / SharePoint sync, Microsoft Graph (Plan B territory)
- Email auto-send of the grade onward (the original Outlook step) — kept out of MVP, pinned to email-with-attachment notify only where the stack supports it
- Training document management

## Risks

| Risk                                      | Mitigation                                        |
|-------------------------------------------|---------------------------------------------------|
| IMAP setup in a sandbox / no real mailbox | Stub the fetcher behind an interface; test prefill on fixtures |
| Prefill accuracy trivial or wrong         | Confidence score surfaced on the confirm screen; manual fallback |
| MIME / attachment parsing                | Start with forwarded-inbox + one attachment; reject multiple |
| Scope creep vs Plan A                     | Plan C is explicitly the *upgrade* — ship Plan A first if timeline tight |

## Timeline (suggested)

| Week | Phase                                     |
|------|-------------------------------------------|
| 1–2  | Plan A core (auth, upload, store, rename, notify, flat export) |
| 3    | Prefill services: filename parser, mapping table, heuristics |
| 4    | Inbox intake (IMAP or forwarded) behind an interface |
| 5    | Confirm screen + fallback wiring, package polish |
| 6    | Tests, demo prep                          |

**Sequence decision:** because Plan A is the baseline and Plan C its upgrade, the safest build order is Plan A first (weeks 1–2 above share that ground), then layer the prefill/intake on top. This guarantees a working POC even if the intake work slips.

## Test strategy

- Feature test: full confirm flow (email → prefilled → confirmed → notified → export)
- Feature test: manual fallback when prefill fails
- Unit test: `FilenameParser`, email heuristics, mapping table lookups
- Unit test: rename logic against the JT convention fixtures
- Intake: factory fixture emails, no live mailbox required

## Next steps

1. Build Plan A baseline first (see `.scratch/plan-a/spec.md`)
2. Add the flat-export + seeded-users + optional-file corrections from the review
3. Spike `FilenameParser` against the real convention doc fixtures
4. Stub inbox fetch behind an interface; iterate IMAP against the real mailbox only when available
5. Wire the confirm screen; keep the manual form as fallback