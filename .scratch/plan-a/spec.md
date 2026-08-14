# Spec: Gestionnaire de note — Plan A

## Overview

A web-based grade management system for Jobtrek apprentices. The MVP replaces a 6-step manual workflow (scan → download → rename → email coach+trainer → upload OneDrive → update Excel) with a single action: upload the scanned PDF, fill the grade metadata, submit — and the system handles the rest.

**Status:** Planning complete, ready for implementation.

## User story

As an apprentice, I want to log into the app, upload my scanned grade PDF, fill in the grade metadata (subject, score, date, module), and submit. The system then:

1. Auto-renames the file per JT naming convention
2. Stores the grade record + file in the database
3. Notifies my coach and trainer (email or in-app)
4. Generates/updates the Excel grade sheet

## Data model

### Entities

| Entity     | Key fields                                                              | Relationships                        |
|------------|-------------------------------------------------------------------------|--------------------------------------|
| Apprentice | name, email, year, assigned coach                                       | belongs to Coach                     |
| Coach      | name, email                                                             | has many Apprentices                 |
| Trainer    | name, email                                                             | has many Apprentices (skills focus)  |
| Grade      | subject, score, date, module ref, file_path, status (pending/notified)  | belongs to Apprentice                |

### Module catalog

Pre-seeded from the canevas Excel (`CANEVAS_Notes_DEV_nouveau tableau.xlsx`). Each module has:

- Module number (e.g. 106, 294)
- Type: `CIE` or `EPSIC`
- Name (e.g. "Interroger, traiter et assurer la maintenance des bases de données")
- Grade (nullable, populated when the apprentice submits)

### Grade status flow

```
pending → notified
```

- `pending` — grade submitted, awaiting notification
- `notified` — coach + trainer have been notified

## Tech stack

| Layer        | Choice                                                |
|--------------|-------------------------------------------------------|
| Backend      | Laravel 12                                            |
| Frontend     | React 19 via Inertia.js                               |
| Styling      | Tailwind CSS                                          |
| Auth         | Laravel built-in auth (simple login)                  |
| File storage | Local (`storage/app/grades/`)                         |
| Excel        | `maatwebsite/excel` (Laravel Excel / PhpSpreadsheet)  |
| Notifications| Laravel Mail (Mailable)                               |

## Excel generation

Mirror the canevas structure across 5 sheets:

1. **Totaux** — Per apprentice: weighted CFC calculation
   - TPI: 0.4 weight
   - Compétences de base élargies: 0.1
   - Compétences en informatique: 0.3
   - Culture générale: 0.2
   - 8 semesters of grades (Math, Anglais, Société, etc.)
   - Modules ecole pro (80%) vs CIE (20%)
2. **Modules informatiques** — Module number, type, name, grade
3. **Projets entreprise** — Project ID, title, grade
4. **Compétences opérationelles** — Module-to-competency mapping
5. **Sheet2** — Additional module catalog data

Export triggered per-apprentice or per-cohort. Downloadable as `.xlsx`.

## File naming convention

Per the JT spec (`JT_CF_A11_Nommage et envoi des notes de l'école profesionnelle.pdf`):

```
JT_CF_E10_1.6
```

The system auto-generates the filename based on:
- Company prefix (`JT`)
- Context (`CF`)
- Apprentice/evaluation identifier
- Module/semester reference

Parser to be validated against the actual convention doc during spike.

## Auth and roles

| Role       | Access                                    |
|------------|-------------------------------------------|
| Apprentice | Upload grades, view own grades            |
| Coach      | View assigned apprentices, dashboard (later phase) |
| Trainer    | Receive notifications (later phase: dashboard) |
| Admin      | Manage users, configure modules           |

**MVP scope:** Apprentice login + simple role assignment. Coach/trainer dashboards deferred.

## Architecture

```
second-group-project/
├── app/
│   ├── Http/Controllers/        # GradeController, AuthController
│   ├── Models/                  # Apprentice, Coach, Trainer, Grade, Module
│   ├── Mail/                    # GradeNotification Mailable
│   ├── Exports/                 # GradeExport (Laravel Excel)
│   └── Services/                # GradeService (rename, notify, export)
├── database/migrations/
├── database/seeders/            # Module catalog seeder from xlsx
├── resources/js/Pages/          # Inertia React pages
│   ├── Auth/
│   ├── Grades/
│   │   ├── Upload.jsx
│   │   └── List.jsx
│   └── Layouts/
├── storage/app/grades/          # Uploaded PDFs
├── .scratch/plan-a/spec.md      # This file
└── ...
```

## MVP scope (in / out)

### In scope
- Apprentice auth (login/register)
- Grade upload with metadata form
- Auto-file renaming per convention
- File storage (local)
- Coach + trainer email notification
- Excel export (per-apprentice or cohort)
- Module catalog seeder

### Deferred (later phases)
- Coach dashboard with apprentice overview
- Coach comments on grades
- Email inbox ingestion (Plan B vision)
- Microsoft Graph API / Entra ID integration
- OneDrive / SharePoint sync
- Training document management

## Risks

| Risk                                      | Mitigation                                      |
|-------------------------------------------|-------------------------------------------------|
| Excel formula weighting correctness       | Spike early: validate CFC calc against canevas  |
| File naming convention parsing            | Decode the convention doc, build parser, unit test |
| PDF handling without scan-to-text         | Treat as opaque file; metadata entered manually by apprentice |
| 1–2 month timeline with 4 devs            | Strict MVP cut; coach/trainer dashboards deferred |

## Timeline (suggested)

| Week | Milestone                                       |
|------|-------------------------------------------------|
| 1    | Project setup (Laravel + Inertia), DB schema, auth |
| 2    | Grade upload + file storage + rename logic      |
| 3    | Email notification + module catalog seeder      |
| 4    | Excel export                                    |
| 5–6  | Polish, testing, demo prep                      |

## Next steps

1. Scaffold Laravel + Inertia project
2. Create migrations for Apprentice, Coach, Trainer, Grade, Module
3. Seed module catalog from the canevas xlsx
4. Build grade upload flow (form + controller + service)
5. Spike the file rename logic + validate against convention doc
6. Implement Excel export and validate CFC weighting formula
7. Wire up email notifications
