"use strict";

(function () {
    const STORAGE_KEY = "poc-grade-manager-v1";

    /* ------------------------------------------------------------------
     * Seed data
     * ---------------------------------------------------------------- */

    const seed = {
        coach: { id: 1, name: "M. Rossetti" },
        trainer: { id: 1, name: "Mme Perrin" },

        apprentices: [
            { id: 1, name: "Liam Morel", track: "cfc", coachId: 1, trainerId: 1, year: 2 },
            { id: 2, name: "Emma Favre", track: "maturite", coachId: 1, trainerId: 1, year: 1 },
            { id: 3, name: "Noah Blanc", track: "cfc", coachId: 1, trainerId: 1, year: 1 },
        ],

        modules: [
            { id: 1, number: "TPI", name: "Travail pratique individuel", type: "EPSIC", track: "cfc", category: "tpi", subject: "TPI" },
            { id: 2, number: "FRA", name: "Français", type: "EPSIC", track: "cfc", category: "base_elargie", subject: "Français" },
            { id: 3, number: "MATH", name: "Mathématiques", type: "EPSIC", track: "cfc", category: "base_elargie", subject: "Mathématiques" },
            { id: 4, number: "SOC", name: "Société et citoyenneté", type: "EPSIC", track: "cfc", category: "base_elargie", subject: "Société" },
            { id: 5, number: "106", name: "Développer des applications", type: "EPSIC", track: "cfc", category: "informatique", subject: "Informatique (école pro)" },
            { id: 6, number: "194", name: "Réaliser des projets en réseau", type: "EPSIC", track: "cfc", category: "informatique", subject: "Informatique (école pro)" },
            { id: 7, number: "294", name: "Assurer la maintenance de bases de données", type: "EPSIC", track: "cfc", category: "informatique", subject: "Informatique (école pro)" },
            { id: 8, number: "CIE-M1", name: "Module CIE : pratiques professionnelles", type: "CIE", track: "cfc", category: "informatique", subject: "Informatique (CIE)" },
            { id: 9, number: "CIE-M2", name: "Module CIE : anglais technique", type: "CIE", track: "cfc", category: "informatique", subject: "Informatique (CIE)" },
            { id: 10, number: "CG", name: "Culture générale", type: "EPSIC", track: "shared", category: "culture_generale", subject: "Culture générale" },
            { id: 11, number: "M-FRA", name: "Maturité : Français", type: "EPSIC", track: "maturite", category: "culture_generale", subject: "Maturité" },
            { id: 12, number: "M-MATH", name: "Maturité : Mathématiques", type: "EPSIC", track: "maturite", category: "base_elargie", subject: "Maturité" },
            { id: 13, number: "M-ECO", name: "Maturité : Économie", type: "EPSIC", track: "maturite", category: "culture_generale", subject: "Maturité" },
            { id: 14, number: "M-ANG", name: "Maturité : Anglais", type: "EPSIC", track: "maturite", category: "culture_generale", subject: "Maturité" },
        ],

        grades: [
            { id: 1, apprenticeId: 1, moduleId: 2, score: 5.0, date: "2026-02-18", fileName: null, source: "pdf", status: "notified" },
            { id: 2, apprenticeId: 1, moduleId: 3, score: 4.5, date: "2026-03-02", fileName: null, source: "pdf", status: "notified" },
            { id: 3, apprenticeId: 1, moduleId: 4, score: 5.5, date: "2026-03-11", fileName: null, source: "pdf", status: "notified" },
            { id: 4, apprenticeId: 1, moduleId: 5, score: 5.0, date: "2026-01-22", fileName: "106_5.0.pdf", source: "pdf", status: "notified" },
            { id: 5, apprenticeId: 1, moduleId: 6, score: 4.0, date: "2026-04-05", fileName: "194_4.0.pdf", source: "pdf", status: "notified" },
            { id: 6, apprenticeId: 1, moduleId: 7, score: 4.5, date: "2026-04-17", fileName: "294_4.5.pdf", source: "pdf", status: "notified" },
            { id: 7, apprenticeId: 1, moduleId: 8, score: 5.0, date: "2026-03-27", fileName: null, source: "manual", status: "notified" },
            { id: 8, apprenticeId: 1, moduleId: 10, score: 4.0, date: "2026-05-06", fileName: null, source: "pdf", status: "notified" },
            { id: 9, apprenticeId: 2, moduleId: 10, score: 5.0, date: "2026-04-30", fileName: null, source: "pdf", status: "notified" },
            { id: 10, apprenticeId: 2, moduleId: 11, score: 5.5, date: "2026-02-10", fileName: null, source: "pdf", status: "notified" },
            { id: 11, apprenticeId: 2, moduleId: 12, score: 5.0, date: "2026-03-18", fileName: "M-MATH_5.0.pdf", source: "pdf", status: "notified" },
            { id: 12, apprenticeId: 2, moduleId: 13, score: 4.5, date: "2026-04-08", fileName: null, source: "pdf", status: "notified" },
            { id: 13, apprenticeId: 2, moduleId: 14, score: 5.0, date: "2026-05-20", fileName: null, source: "pdf", status: "notified" },
            { id: 14, apprenticeId: 3, moduleId: 5, score: 4.5, date: "2026-03-14", fileName: "106_4.5.pdf", source: "pdf", status: "notified" },
            { id: 15, apprenticeId: 3, moduleId: 10, score: 3.5, date: "2026-06-02", fileName: null, source: "pdf", status: "notified" },
        ],

        comments: [
            { id: 1, gradeId: 5, author: "M. Rossetti (coach)", body: "Bon travail d'ensemble, mais le module réseau mérite d'être retravaillé avant le prochain projet.", createdAt: "2026-04-06T09:15:00" },
            { id: 2, gradeId: 15, author: "M. Rossetti (coach)", body: "3.5 en culture générale : on met en place un appui la semaine prochaine. Passe me voir.", createdAt: "2026-06-03T14:40:00" },
        ],

        notifications: [
            { date: "2026-06-02T16:00:00", message: "Note CG 3.5 (Noah Blanc) — notification envoyée à M. Rossetti et Mme Perrin, PDF renommé ci-joint." },
        ],
    };

    /* ------------------------------------------------------------------
     * State
     * ---------------------------------------------------------------- */

    let state = load();

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            /* corrupted storage -> reseed */
        }
        return fresh();
    }

    function fresh() {
        const s = JSON.parse(JSON.stringify(seed));
        s.nextIds = { grade: 100, comment: 100 };
        s.role = "apprentice";
        s.activeApprenticeId = 1;
        s.activeCoachId = 1;
        s.coachView = "dashboard";
        s.selectedGradeId = null;
        return s;
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            /* ignore quota errors in POC */
        }
    }

    /* ------------------------------------------------------------------
     * Helpers
     * ---------------------------------------------------------------- */

    const WEIGHTS = { tpi: 0.4, base_elargie: 0.1, informatique: 0.3, culture_generale: 0.2 };
    const INFO_ECOLE_PRO = 0.8;
    const INFO_CIE = 0.2;

    const CATEGORY_LABELS = {
        tpi: "TPI",
        base_elargie: "Compétences de base élargies",
        informatique: "Compétences en informatique",
        culture_generale: "Culture générale",
    };

    const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
    const modulesById = byId(state.modules);
    const apprenticesById = byId(state.apprentices);

    function mean(nums) {
        return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
    }

    function fmt(n, digits) {
        if (n === null || n === undefined || isNaN(n)) return "—";
        return n.toLocaleString("fr-CH", { minimumFractionDigits: digits ?? 2, maximumFractionDigits: digits ?? 2 });
    }

    function fmtDate(iso) {
        if (!iso) return "—";
        const d = new Date(iso);
        if (isNaN(d)) return "—";
        return d.toLocaleDateString("fr-CH", { day: "2-digit", month: "short", year: "numeric" });
    }

    function fmtDateTime(iso) {
        if (!iso) return "—";
        const d = new Date(iso);
        if (isNaN(d)) return "—";
        return d.toLocaleDateString("fr-CH", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function escapeHtml(s) {
        return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function scoreClass(score) {
        if (score >= 4.5) return "score-good";
        if (score >= 3.5) return "score-ok";
        return "score-low";
    }

    function trackBadge(track) {
        const label = track === "cfc" ? "CFC" : "Maturité";
        return `<span class="badge badge-${track}">${label}</span>`;
    }

    /* ------------------------------------------------------------------
     * Weighted average — port of Services/Grading/WeightedAverage.php
     * Maturité grades are excluded from the CFC average (brainstorm §Essentiels).
     * ---------------------------------------------------------------- */

    function weightedAverageCFC(grades) {
        const cat = {
            tpi: [],
            base_elargie: [],
            informatique: { epsic: [], cie: [] },
            culture_generale: [],
        };
        for (const g of grades) {
            const m = modulesById[g.moduleId];
            if (!m || m.track === "maturite") continue; // maturité notes comptées à part
            if (m.category === "informatique") {
                const bucket = m.type === "CIE" ? cat.informatique.cie : cat.informatique.epsic;
                bucket.push(g.score);
            } else {
                cat[m.category].push(g.score);
            }
        }

        const parts = [];

        const tpi = mean(cat.tpi);
        if (tpi !== null) parts.push({ w: WEIGHTS.tpi, v: tpi });

        const be = mean(cat.base_elargie);
        if (be !== null) parts.push({ w: WEIGHTS.base_elargie, v: be });

        const epsic = mean(cat.informatique.epsic);
        const cie = mean(cat.informatique.cie);
        let info = null;
        if (epsic !== null && cie !== null) info = INFO_ECOLE_PRO * epsic + INFO_CIE * cie;
        else if (epsic !== null) info = epsic;
        else if (cie !== null) info = cie;
        if (info !== null) parts.push({ w: WEIGHTS.informatique, v: info });

        const cg = mean(cat.culture_generale);
        if (cg !== null) parts.push({ w: WEIGHTS.culture_generale, v: cg });

        if (!parts.length) return null;

        const wSum = parts.reduce((a, p) => a + p.w, 0);
        return parts.reduce((a, p) => a + p.w * p.v, 0) / wSum;
    }

    function simpleMean(grades) {
        return grades.length ? grades.reduce((a, g) => a + g.score, 0) / grades.length : null;
    }

    /* ------------------------------------------------------------------
     * Filename prefill + JT rename (POC versions)
     * ---------------------------------------------------------------- */

    function parseModuleRefFromName(name) {
        const m = name.match(/(?:^|[\s_\-.])+(\d{3})(?:[\s_\-.]+|$)/);
        if (!m) return null;
        const mod = Object.values(modulesById).find((x) => x.number === m[1]);
        return mod ? mod.id : null;
    }

    function parseScoreFromName(name) {
        const tokens = name.replace(/\.pdf$/i, "").split(/[\s_\-.]+/);
        for (const t of tokens) {
            if (!/^\d+([.,]\d+)?$/.test(t)) continue;
            const n = parseFloat(t.replace(",", "."));
            if (n >= 1 && n <= 6) return Math.round(n * 100) / 100;
        }
        return null;
    }

    function parseDateFromName(name) {
        const iso = name.match(/(\d{4})[\s_\-.]+(\d{1,2})[\s_\-.]+(\d{1,2})/);
        if (iso) return `${iso[1]}-${String(iso[2]).padStart(2, "0")}-${String(iso[3]).padStart(2, "0")}`;
        const fr = name.match(/(\d{1,2})[\s_\-.]+(\d{1,2})[\s_\-.]+(\d{4})/);
        if (fr) return `${fr[3]}-${String(fr[2]).padStart(2, "0")}-${String(fr[1]).padStart(2, "0")}`;
        return null;
    }

    function parseFilename(fileName) {
        const suggestions = {};
        const modId = parseModuleRefFromName(fileName);
        if (modId !== null) suggestions.moduleId = modId;
        const score = parseScoreFromName(fileName);
        if (score !== null) suggestions.score = score;
        const date = parseDateFromName(fileName);
        if (date !== null) suggestions.date = date;
        return suggestions;
    }

    function jtRenamePreview(fileName, moduleId, score, date) {
        const d = date ? new Date(date) : new Date();
        const yy = String(d.getFullYear()).slice(-2);
        const mod = moduleId ? modulesById[moduleId].number : "MOD";
        const sc = score !== null && score !== undefined && score !== "" ? String(score).replace(".", ".") : "N";
        return `JT_CF_E${yy}_${mod}_${sc}.pdf`;
    }

    /* ------------------------------------------------------------------
     * Rendering helpers
     * ---------------------------------------------------------------- */

    function gradeRows(grades, withLink) {
        if (!grades.length) return `<div class="empty">Aucune note dans cette matière.</div>`;
        return grades
            .map((g) => {
                const m = modulesById[g.moduleId];
                const cat = m ? CATEGORY_LABELS[m.category] : "";
                const file = g.fileName
                    ? `<span class="file-chip" title="${escapeHtml(g.fileName)}">📎 ${escapeHtml(g.fileName)}</span>`
                    : "";
                const link = withLink
                    ? `<button class="btn btn-ghost btn-sm" data-action="open-grade" data-grade-id="${g.id}">Détails</button>`
                    : "";
                return `
                    <div class="grade-row">
                        <span class="score-badge ${scoreClass(g.score)}">${fmt(g.score, 1)}</span>
                        <div class="main">
                            <div class="title">${escapeHtml(m ? m.name : "?")} <span class="badge badge-cat">${escapeHtml(m ? m.number : "")}</span></div>
                            <div class="sub">${fmtDate(g.date)} · ${escapeHtml(cat)}</div>
                        </div>
                        ${file}
                        ${link}
                    </div>`;
            })
            .join("");
    }

    function groupBySubject(grades) {
        const groups = new Map();
        for (const g of grades) {
            const m = modulesById[g.moduleId];
            const subject = m ? m.subject : "Autres";
            if (!groups.has(subject)) groups.set(subject, []);
            groups.get(subject).push(g);
        }
        const order = [...groups.keys()].sort((a, b) => a.localeCompare(b, "fr"));
        return order.map((subject) => ({ subject, grades: groups.get(subject) }));
    }

    function subjectBlocks(grades, withLink) {
        const groups = groupBySubject(grades);
        if (!groups.length) return `<div class="empty">Aucune note enregistrée.</div>`;
        return groups
            .map(({ subject, grades: gs }) => {
                const avg = simpleMean(gs);
                return `
                    <section class="subject-group">
                        <h3 class="subject-group-title">${escapeHtml(subject)} <span class="count">· ${gs.length} note${gs.length > 1 ? "s" : ""} · moy. ${fmt(avg, 1)}</span></h3>
                        ${gradeRows(gs, withLink)}
                    </section>`;
            })
            .join("");
    }

    function commentThread(gradeId, editable) {
        const comments = state.comments.filter((c) => c.gradeId === gradeId);
        const list = comments.length
            ? comments
                  .map(
                      (c) => `
                        <div class="comment">
                            <div class="head">
                                <span class="author">${escapeHtml(c.author)}</span>
                                <span class="when">${fmtDateTime(c.createdAt)}</span>
                            </div>
                            <div class="body">${escapeHtml(c.body)}</div>
                        </div>`
                  )
                  .join("")
            : `<div class="empty">Aucun commentaire pour le moment.</div>`;
        const form = editable
            ? `<form class="comment-form" data-action="comment-form">
                    <textarea name="body" placeholder="Écrire un commentaire pour l'apprenti…" required></textarea>
                    <button type="submit" class="btn">Commenter</button>
               </form>`
            : `<div class="hint visible">Lecture seule — le coach écrit, l'apprenti lit.</div>`;
        return `<div class="thread">
                    <h2>Commentaires</h2>
                    ${list}
                    ${form}
                </div>`;
    }

    /* ------------------------------------------------------------------
     * Views
     * ---------------------------------------------------------------- */

    function renderApp() {
        const app = document.getElementById("app");
        if (state.role === "coach") app.innerHTML = renderCoach();
        else app.innerHTML = renderApprentice();
        refreshIdentitySelect();
        refreshRenamePreview();
    }

    function currentApprentice() {
        return apprenticesById[state.activeApprenticeId] || state.apprentices[0];
    }

    /* ---- Apprentice view ---- */

    function renderApprentice() {
        const app = currentApprentice();
        const myGrades = state.grades.filter((g) => g.apprenticeId === app.id);
        const cfcGrades = myGrades.filter((g) => modulesById[g.moduleId] && modulesById[g.moduleId].track !== "maturite");
        const matGrades = myGrades.filter((g) => modulesById[g.moduleId] && modulesById[g.moduleId].track === "maturite");
        const avg = weightedAverageCFC(myGrades);

        const selected = state.selectedGradeId
            ? state.grades.find((g) => g.id === state.selectedGradeId && g.apprenticeId === app.id)
            : null;

        const form = `
            <section class="card">
                <h2>Ajouter une note</h2>
                <form id="grade-form" data-action="grade-form">
                    <div class="field">
                        <label for="file-input">PDF scanné <em>(optionnel)</em></label>
                        <input type="file" id="file-input" accept=".pdf,application/pdf">
                    </div>
                    <div class="hint" id="prefill-hint"></div>
                    <div class="rename-preview hidden" id="rename-preview"></div>

                    <div class="field">
                        <label for="module-select">Module</label>
                        <select id="module-select" name="moduleId" required>
                            ${moduleOptions(app)}
                        </select>
                    </div>
                    <div class="field">
                        <label for="score-input">Note <em>(1 à 6)</em></label>
                        <input type="number" id="score-input" name="score" min="1" max="6" step="0.25" required placeholder="ex. 5.5">
                    </div>
                    <div class="field">
                        <label for="date-input">Date de la note</label>
                        <input type="date" id="date-input" name="date" required value="${new Date().toISOString().slice(0, 10)}">
                    </div>
                    <button type="submit" class="btn btn-block">Enregistrer la note</button>
                    <p class="hint" style="font-size:12px;display:block;background:none;border:none;padding:8px 0 0;color:var(--muted);">À l'enregistrement : renommage selon la convention JT, dépôt fichier + notification automatique au coach et au formateur.</p>
                </form>
            </section>`;

        const summary = `
            <section class="card">
                <div class="summary">
                    <div>
                        <div class="label">Moyenne CFC pondérée</div>
                        <div class="value">${fmt(avg, 2)}</div>
                    </div>
                    <div class="meta">${cfcGrades.length} note${cfcGrades.length > 1 ? "s" : ""} prise${cfcGrades.length > 1 ? "s" : ""} en compte · schéma canevas</div>
                </div>
                ${matGrades.length
                    ? `<div class="hint visible" style="background:var(--purple-soft);border-color:var(--purple);">
                        <strong>Maturité :</strong> ${fmt(simpleMean(matGrades), 2)} (${matGrades.length} note${matGrades.length > 1 ? "s" : ""}) — notes maturité traitées séparément, non incluses dans la moyenne CFC.
                      </div>`
                    : ""}
            </section>`;

        const list = `
            <section class="card">
                <h2>Mes notes</h2>
                ${subjectBlocks(cfcGrades.concat(matGrades).sort((a, b) => a.date.localeCompare(b.date)), true)}
            </section>`;

        const detail = selected
            ? `<section class="card">
                    <h2>${escapeHtml(modulesById[selected.moduleId].name)}
                        <span class="score-badge ${scoreClass(selected.score)}">${fmt(selected.score, 1)}</span>
                    </h2>
                    <div class="stack">
                        <div>
                            <div class="sub">${fmtDate(selected.date)} · ${escapeHtml(CATEGORY_LABELS[modulesById[selected.moduleId].category])}${selected.fileName ? " · 📎 " + escapeHtml(selected.fileName) : ""}</div>
                        </div>
                        ${commentThread(selected.id, false)}
                    </div>
               </section>`
            : "";

        const notify = `
            <section class="card">
                <h2>Envois récents</h2>
                ${state.notifications.length
                    ? state.notifications
                          .slice()
                          .reverse()
                          .map((n) => `<div class="comment"><div class="when">${fmtDateTime(n.date)}</div><div class="body">📧 ${escapeHtml(n.message)}</div></div>`)
                          .join("")
                    : `<div class="empty">Aucun envoi.</div>`}
            </section>`;

        return `
            <div class="grid">
                ${form}
                <div class="stack">
                    ${summary}
                    ${list}
                    ${detail}
                    ${notify}
                </div>
            </div>`;
    }

    function moduleOptions(app) {
        const allowed = state.modules.filter(
            (m) => m.track === app.track || m.track === "shared" || app.track === "maturite"
        );
        const groups = new Map();
        for (const m of allowed) {
            if (!groups.has(m.subject)) groups.set(m.subject, []);
            groups.get(m.subject).push(m);
        }
        const parts = [];
        for (const [subject, mods] of groups) {
            parts.push(`<optgroup label="${escapeHtml(subject)}">`);
            for (const m of mods) {
                parts.push(`<option value="${m.id}">${m.number} — ${escapeHtml(m.name)}</option>`);
            }
            parts.push(`</optgroup>`);
        }
        return parts.join("");
    }

    /* ---- Coach view ---- */

    function renderCoach() {
        const crumbs = (html) => `<div class="crumbs">${html}</div>`;

        if (state.coachView === "dashboard") {
            return `${crumbs(`<span>Dashboard coach</span>`)}
                <section class="card">
                    <h2>Mes apprentis</h2>
                    ${state.apprentices.map(apprenticeRow).join("")}
                </section>`;
        }

        const app = apprenticesById[state.coachView.apprenticeId];
        if (!app) return "";

        if (!state.coachView.gradeId) {
            const grades = state.grades
                .filter((g) => g.apprenticeId === app.id)
                .sort((a, b) => a.date.localeCompare(b.date));
            return `
                ${crumbs(`<button data-action="back-dashboard">Dashboard</button> <span>›</span> <span>${escapeHtml(app.name)}</span>`)}
                <div class="grid">
                    <div class="stack">
                        <section class="card">
                            <div class="summary">
                                <div>
                                    <div class="label">Moyenne CFC pondérée</div>
                                    <div class="value">${fmt(weightedAverageCFC(grades), 2)}</div>
                                </div>
                                <div class="meta">${trackBadge(app.track)} · Année ${app.year} · Dernière activité ${fmtDate(lastActivity(grades))}</div>
                            </div>
                        </section>
                        <section class="card">
                            <h2>Tests — ${escapeHtml(app.name)}</h2>
                            ${subjectBlocks(grades, true)}
                        </section>
                    </div>
                </div>`;
        }

        const grade = state.grades.find((g) => g.id === state.coachView.gradeId && g.apprenticeId === app.id);
        if (!grade) return "";
        const m = modulesById[grade.moduleId];
        return `
            ${crumbs(`
                <button data-action="back-dashboard">Dashboard</button> <span>›</span>
                <button data-action="back-apprentice" data-apprentice-id="${app.id}">${escapeHtml(app.name)}</button> <span>›</span>
                <span>${escapeHtml(m.name)}</span>`)}
            <div class="grid">
                <section class="card">
                    <h2>${escapeHtml(m.name)}
                        <span class="score-badge ${scoreClass(grade.score)}">${fmt(grade.score, 1)}</span>
                    </h2>
                    <div class="stack">
                        <div>
                            <div class="sub">${escapeHtml(app.name)} · ${fmtDate(grade.date)} · ${escapeHtml(CATEGORY_LABELS[m.category])}${grade.fileName ? " · 📎 " + escapeHtml(grade.fileName) : ""}</div>
                        </div>
                        ${commentThread(grade.id, true)}
                    </div>
                </section>
            </div>`;
    }

    function apprenticeRow(app) {
        const grades = state.grades.filter((g) => g.apprenticeId === app.id);
        const avg = weightedAverageCFC(grades);
        return `
            <div class="apprentice-row" data-action="open-apprentice" data-apprentice-id="${app.id}">
                <div class="avatar">${escapeHtml(initials(app.name))}</div>
                <div class="main">
                    <div class="name">${escapeHtml(app.name)}</div>
                    <div class="meta">${trackBadge(app.track)} · Année ${app.year} · ${grades.length} note${grades.length > 1 ? "s" : ""} · dernière activité ${fmtDate(lastActivity(grades))}</div>
                </div>
                <div>
                    <div class="avg">${fmt(avg, 2)}</div>
                    <div class="avg-label">moyenne CFC</div>
                </div>
            </div>`;
    }

    function lastActivity(grades) {
        if (!grades.length) return null;
        return grades.map((g) => g.date).sort().pop();
    }

    function initials(name) {
        return name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    }

    /* ------------------------------------------------------------------
     * Top bar
     * ---------------------------------------------------------------- */

    function refreshIdentitySelect() {
        const sel = document.getElementById("identity-select");
        if (!sel) return;
        const opts = state.role === "coach" ? [{ id: state.coach.id, name: state.coach.name, sub: "Coach" }] : state.apprentices.map((a) => ({ id: a.id, name: a.name, sub: a.track === "cfc" ? "CFC" : "Maturité" }));
        sel.innerHTML = opts
            .map((o) => `<option value="${o.id}">${escapeHtml(o.name)} — ${escapeHtml(o.sub)}</option>`)
            .join("");
        const active = state.role === "coach" ? state.activeCoachId : state.activeApprenticeId;
        sel.value = String(active);
    }

    function refreshRenamePreview() {
        const preview = document.getElementById("rename-preview");
        if (!preview) return;
        const fileInput = document.getElementById("file-input");
        const moduleSel = document.getElementById("module-select");
        const scoreInput = document.getElementById("score-input");
        const dateInput = document.getElementById("date-input");
        if (fileInput && fileInput.files.length) {
            const name = fileInput.files[0].name;
            const score = scoreInput ? scoreInput.value : "";
            const date = dateInput ? dateInput.value : new Date().toISOString().slice(0, 10);
            preview.textContent = "Nom généré (convention JT) : " + jtRenamePreview(name, moduleSel ? Number(moduleSel.value) : null, score, date);
            preview.classList.remove("hidden");
        } else {
            preview.classList.add("hidden");
        }
    }

    function refreshPrefillHint() {
        const hint = document.getElementById("prefill-hint");
        const fileInput = document.getElementById("file-input");
        if (!hint || !fileInput || !fileInput.files.length) {
            if (hint) { hint.classList.remove("visible"); hint.innerHTML = ""; }
            return;
        }
        const suggestions = parseFilename(fileInput.files[0].name);
        if (!Object.keys(suggestions).length) {
            hint.classList.remove("visible");
            hint.innerHTML = "";
            return;
        }
        const bits = [];
        if (suggestions.moduleId) {
            const m = modulesById[suggestions.moduleId];
            bits.push(`module « ${escapeHtml(m.name)} »`);
            const modSel = document.getElementById("module-select");
            if (modSel) modSel.value = String(suggestions.moduleId);
        }
        if (suggestions.score !== null) {
            bits.push(`note ${String(suggestions.score).replace(".", ",")}`);
            const score = document.getElementById("score-input");
            if (score) score.value = suggestions.score;
        }
        if (suggestions.date) {
            bits.push(`date ${suggestions.date}`);
            const date = document.getElementById("date-input");
            if (date) date.value = suggestions.date;
        }
        hint.innerHTML = `Suggestion détectée depuis le nom de fichier : ${bits.join(", ")}. Champs modifiables.`;
        hint.classList.add("visible");
        refreshRenamePreview();
    }

    /* ------------------------------------------------------------------
     * Toasts
     * ---------------------------------------------------------------- */

    function toast(title, body) {
        const container = document.getElementById("toast-container");
        const el = document.createElement("div");
        el.className = "toast";
        el.innerHTML = `<div class="toast-title">${escapeHtml(title)}</div>${body ? escapeHtml(body) : ""}`;
        container.appendChild(el);
        setTimeout(() => {
            el.classList.add("out");
            setTimeout(() => el.remove(), 350);
        }, 4200);
    }

    /* ------------------------------------------------------------------
     * Actions
     * ---------------------------------------------------------------- */

    function onGradeSubmit(e) {
        e.preventDefault();
        const app = currentApprentice();
        const fd = new FormData(e.target);
        const moduleId = Number(fd.get("moduleId"));
        const score = Number(fd.get("score"));
        const date = fd.get("date");
        const m = modulesById[moduleId];

        if (!m) { toast("Erreur", "Module invalide"); return; }
        if (isNaN(score) || score < 1 || score > 6) { toast("Erreur", "La note doit être comprise entre 1 et 6"); return; }
        if (!date) { toast("Erreur", "Une date est requise"); return; }

        const fileInput = document.getElementById("file-input");
        let fileName = null;
        if (fileInput && fileInput.files.length) {
            fileName = jtRenamePreview(fileInput.files[0].name, moduleId, score, date);
        }

        const grade = {
            id: state.nextIds.grade++,
            apprenticeId: app.id,
            moduleId,
            score,
            date,
            fileName,
            source: fileName ? "pdf" : "manual",
            status: "notified",
        };
        state.grades.push(grade);
        state.selectedGradeId = grade.id;

        const renamed = fileName ? ` PDF renommé « ${fileName} » ci-joint.` : " Note sans fichier.";
        const msg = `Note ${m.number} ${fmt(score, 1)} (${app.name}) — notification envoyée à ${state.coach.name} (coach) et ${state.trainer.name} (formateur).${renamed}`;
        state.notifications.push({ date: new Date().toISOString(), message: msg });

        save();
        e.target.reset();
        const dateInput = document.getElementById("date-input");
        if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
        toast("Note enregistrée", msg);
        renderApp();
    }

    function onCommentSubmit(e) {
        e.preventDefault();
        const gradeId = state.role === "coach" ? state.coachView.gradeId : state.selectedGradeId;
        const bodyEl = e.target.querySelector('[name="body"]');
        const body = bodyEl ? bodyEl.value.trim() : "";
        if (!body || !gradeId) return;
        const grade = state.grades.find((g) => g.id === gradeId);
        if (!grade) return;
        const app = apprenticesById[grade.apprenticeId];
        if (state.role === "coach" && (!app || app.coachId !== state.coach.id)) {
            toast("Accès refusé", "Ce commentaire n'est pas autorisé : apprenti hors de votre portefeuille.");
            return;
        }
        state.comments.push({
            id: state.nextIds.comment++,
            gradeId,
            author: state.role === "coach" ? `${state.coach.name} (coach)` : "Apprenti",
            body,
            createdAt: new Date().toISOString(),
        });
        save();
        toast("Commentaire publié", "Visible par " + app.name + ".");
        renderApp();
    }

    /* ------------------------------------------------------------------
     * Event delegation
     * ---------------------------------------------------------------- */

    document.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;

        switch (action) {
            case "open-grade": {
                const g = state.grades.find((x) => x.id === Number(btn.dataset.gradeId));
                if (!g) return;
                if (state.role === "coach") {
                    state.coachView = { apprenticeId: g.apprenticeId, gradeId: g.id };
                } else {
                    state.selectedGradeId = g.id;
                }
                save();
                renderApp();
                break;
            }
            case "open-apprentice": {
                state.coachView = { apprenticeId: Number(btn.dataset.apprenticeId), gradeId: null };
                save();
                renderApp();
                break;
            }
            case "back-dashboard": {
                state.coachView = "dashboard";
                state.selectedGradeId = null;
                save();
                renderApp();
                break;
            }
            case "back-apprentice": {
                state.coachView = { apprenticeId: Number(btn.dataset.apprenticeId), gradeId: null };
                state.selectedGradeId = null;
                save();
                renderApp();
                break;
            }
        }
    });

    document.addEventListener("submit", (ev) => {
        const form = ev.target.closest("[data-action]");
        if (!form) return;
        if (form.dataset.action === "grade-form") onGradeSubmit(ev);
        else if (form.dataset.action === "comment-form") onCommentSubmit(ev);
    });

    document.addEventListener("change", (ev) => {
        if (ev.target.id === "role-select") {
            state.role = ev.target.value;
            state.coachView = "dashboard";
            state.selectedGradeId = null;
            save();
            renderApp();
        } else if (ev.target.id === "identity-select") {
            if (state.role === "coach") state.activeCoachId = Number(ev.target.value);
            else {
                state.activeApprenticeId = Number(ev.target.value);
                state.selectedGradeId = null;
            }
            save();
            renderApp();
        } else if (ev.target.id === "file-input") {
            refreshPrefillHint();
        } else if (ev.target.id === "module-select" || ev.target.id === "score-input" || ev.target.id === "date-input") {
            refreshRenamePreview();
        }
    });

    document.getElementById("reset-btn").addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        state = fresh();
        renderApp();
        toast("Données réinitialisées", "Le jeu de démonstration a été rechargé.");
    });

    /* ------------------------------------------------------------------
     * Init
     * ---------------------------------------------------------------- */

    renderApp();
})();
