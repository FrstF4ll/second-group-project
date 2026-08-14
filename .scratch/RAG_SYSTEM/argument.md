# Argument — Is the Documentation RAG Agent actually useful?

**Source:** grilled against `spec.md`, `ARCHITECTURE.md`, `review.md`, `website.md`.
**Framing:** played as a first-year apprentice with only the jt-lab docs to go on, arguing skeptically before conceding the case for building this.

## Why it's usefulgt

- **Citations make it verifiable, not just plausible.** The design explicitly resolves every
  answer back to a `source_path`/`heading_path`, and stores `QUERIES`/`CITATIONS` so a bad answer
  can be debugged after the fact. That's a meaningfully different product than a bare chatbot
  bolted onto the docs — it's built to be checked, not just trusted.
- **It answers questions search can't.** Full-text search finds pages containing your words;
  it doesn't synthesize an answer that spans two sections, rephrase jargon into the reader's
  question, or tell you "no, that's not supported" when nothing matches. If the JT docs corpus
  has cross-cutting concepts (setup steps split across multiple pages, prerequisites buried in a
  different section than the feature that needs them), a RAG answer with citations is strictly
  more useful than "here are 4 pages containing the word 'install'."
- **The stack decisions are load-bearing, not decorative.** Local embeddings (zero per-call
  cost), Postgres/pgvector (a store the team already knows, scales without a migration), and a
  single-shot `Runnable` chain (swappable into an agentic loop later without a rewrite) are all
  decisions that reduce ongoing cost and keep the door open, rather than adding complexity for
  its own sake. This wasn't cargo-culted from a Python RAG tutorial — the stack was corrected
  specifically because the team doesn't know Python.
- **The MVP scope is honestly cut.** Reranking, multi-hop agent loops, auth, CI-triggered
  re-ingestion — all explicitly deferred or cut rather than silently assumed. That's a spec that
  resists scope creep, which matters more for "is this useful" than "is this impressive": a small
  working thing beats a large half-built one.
- **Ingestion reads the markdown source directly**, not the rendered HTML — confirmed source-repo
  access removed an entire crawler/extractor subsystem from the design. Less surface area, less
  to break, more accurate chunk boundaries (real headings, not scraped DOM structure).

## Why it might not be

- **The core need is asserted, not measured.** Nowhere in the spec is there a corpus size, a
  frequency of "I couldn't find this in the docs" complaints, or any baseline showing that
  Quartz's built-in search actually fails often enough to justify a Postgres instance, a local
  embedding model, and an external LLM dependency. "Find an answer without grepping it by hand"
  is a plausible problem, not a demonstrated one.
- **Citation presence ≠ citation correctness.** The eval checks that "the expected chunk is in
  top-k and the answer cites it" — it does not check that the generated answer *actually reflects
  what the cited chunk says*. A model can retrieve the right chunk and still misstate its content
  while pointing at a real, clickable citation. That's arguably a worse failure mode than a plain
  search box: search fails loudly (zero results), a wrong-but-cited RAG answer fails quietly
  (it looks trustworthy).
- **Real infrastructure for an unproven payoff.** Postgres + pgvector, an in-process ONNX
  embedding model (explicitly flagged as "new territory" — first-load latency, memory footprint,
  a team that's never run local ML tooling), a chunking pipeline, and a per-query DeepSeek
  dependency, all to maintain, versus the alternative of just improving search or building a
  much simpler "stuff the whole page into an LLM prompt, no vector store" chatbot. The spec never
  argues why the heavier pipeline earns its cost over that simpler alternative — it default to
  full RAG rather than testing whether it's necessary.
- **The eval corpus (3–5 fixture pages) proves the pipeline runs, not that it's useful.** It
  can't surface ambiguous questions, overlapping sections, or stale docs — the actual failure
  modes that would determine whether this is worth using day to day. There's no plan to measure
  real usage after ship (no analytics on whether readers use it, trust it, or abandon it for
  Ctrl+F).
- **Maintenance is manual by design.** Re-ingestion is a CLI a doc maintainer has to remember to
  run after every deploy (CI/webhook auto-ingestion was explicitly deferred). Stale answers with
  confident citations to outdated content are a predictable outcome the spec doesn't mitigate for
  MVP.

## Update — checked against the real corpus

Pulled `https://docs.in.jt-lab.ch/sitemap.xml` directly: ~89 URLs, ~60 real content pages once
tag/index pages are excluded. This is not a toy corpus, and it's cross-cutting in exactly the way
that matters: `apprentis/cours/system/` alone spans docker, docker-services, linux, networking,
IP addressing, GNS3, and CI/CD across 10 separate pages; `dev/` spans git workflow, commits,
CI, CD, release-please, and issue templates across ~11 pages. A realistic question ("how do we do
CI/CD here") plausibly needs 3-4 of these pages synthesized, not just found — which is exactly
where Ctrl+K-style search stops being enough (it returns a page list, not a merged answer) and a
citing RAG answer starts pulling ahead.

This revises the "core need is asserted, not measured" objection above: it's still not measured
(no usage data), but it's no longer implausible — the corpus shape actively supports the case for
synthesis over keyword search, especially for the stated target user (a 1st-year apprentice who
doesn't yet have the vocabulary to know which of `dev/ci` vs. `dev/release-please` vs.
`apprentis/cours/system/docker-services` to open).

Two things the current MVP spec still doesn't cover, raised independently in this discussion:
- **No web search / outside context.** Several pages (e.g. `docker-services`,
  `database-1-conception`) are internal-conventions docs that assume upstream knowledge (how
  Docker itself works, general DB theory) the JT docs don't re-explain. An agent that can't step
  outside the corpus can't help with "I don't understand the underlying concept," only "where does
  jt-lab mention this." That's explicitly cut for MVP (Decision #6), not deferred.
- **No multi-turn depth.** A 2nd-year apprentice's stated complaint about Ctrl+K was "can't go
  into detail" — but single-shot Q&A (Decision #6) doesn't fix that either; it answers once and
  stops. The follow-up-question depth that would actually address the complaint requires the
  agentic/multi-turn loop this spec deliberately defers past MVP.

## Net read

The idea is sound *if* the JT docs corpus is large or fragmented enough that plain search
genuinely fails readers with some regularity — that's the one load-bearing assumption the whole
project rests on, and it's the one thing the spec never establishes. The engineering built on top
of that assumption (stack choices, MVP cuts, data model) is disciplined. But usefulness here is a
question about the *docs*, not the *architecture*, and the docs about the docs are silent on it.

## Update 2 — content sampled with agent-browser

Read six representative pages directly (`/`, `apprentis/cours/system/docker-services`,
`apprentis/cours/database/database-1-conception`, `dev/ci`, `dev/release-please`,
`apprentis/lexique`). Two findings change the recommendation below from "build it" to "build it,
but fix two things first":

1. **The docs are French, and the spec's embedding model isn't.** Every page sampled is
   French-language content (`database-1-conception` is a 13-minute French workshop write-up;
   `apprentis/lexique` is a structured FR↔EN glossary table). `spec.md`/`website.md` pin
   `bge-small-en-v1.5` — English-tuned — and wave off "Non-English content handling" as out of
   scope "unless the actual docs are already multilingual." They are. An English embedding model
   over French content doesn't error, it just retrieves worse — a silent quality hit exactly
   where the whole pitch is "citations you can trust." This needs a multilingual embedding model
   decision before build, not a scope dismissal.
   **Candidate checked:** `google/embeddinggemma-300m` — trained on 100+ languages (French
   included) plus code/technical documents specifically, which matches this corpus better than a
   general English sentence-embedder. Matryoshka-truncatable from 768 down to 512/256/128 dims,
   useful for keeping the `pgvector` column and ANN index small. An ONNX build exists
   (`onnx-community/embeddinggemma-300m-ONNX`), so it drops into `@xenova/transformers` the same
   way `bge-small-en-v1.5` does — no architecture change. Tradeoff: gated behind Google's Gemma
   license (one-time accept, processed immediately) and heavier (~300M params vs. ~130M for
   `bge-small-en-v1.5`), which compounds the "new territory" local-model risk `spec.md` already
   flags — budget for it, don't ignore it, but this is the right model to switch to.
2. **Content completeness is uneven.** `dev/ci` — a page a real question ("how does CI work
   here") would need — is the literal text "TODO." A RAG agent will either honestly surface that
   it's undocumented, or (more likely, since `dev/release-please` is semantically adjacent)
   confidently answer from the neighboring page with a citation that looks right but isn't what
   was asked. Ctrl+K shows you the empty stub directly; a synthesized answer can paper over it.
   The eval in `spec.md` (`known Q/A pairs`) has no case for "the answer isn't in the docs yet" —
   it should, given stub pages exist in the real corpus.

The corpus-shape case for synthesis-over-search still holds (interactive teaching content like
`docker-services`'s embedded self-check, cross-cutting `dev/`/`cours/system/` pages, sequenced
project briefs) — these two items are blockers to add to the build, not reasons not to build.

## Recommendation — build it?

**Revised: probably not, not as the priority project — two points raised late in this discussion
outweigh the corpus-shape case made above.**

The corpus-shape argument (cross-cutting `dev/`/`cours/system/` pages, sequenced project briefs,
interactive teaching content) establishes that *if used, the retrieval quality problem is real*.
It never established *how often it would be used* — and that turned out to be the deciding
variable, not retrieval quality:

- **Usage frequency doesn't justify the infra.** 1st-year apprentices check the docs "once or
  twice, 95% of the time," per direct estimate from someone who went through the program. Building
  Postgres + pgvector + a local embedding model + a chunking/re-ingestion pipeline + an LLM
  dependency to serve that access pattern is a bad infra-to-value ratio — you'd be operating a
  database for a feature that's touched a handful of times per person per project. The corpus
  being well-shaped for synthesis doesn't matter if the trigger for using it barely occurs.
- **Pedagogical tension the earlier analysis missed entirely.** This isn't a general company
  wiki — it's apprentice training material, and part of what a 1st-year is supposed to build is
  the skill of searching and cross-referencing documentation themselves (the docs' own interactive
  self-check quizzes on pages like `docker-services` are deliberately designed to make you work
  for the answer, not just hand it over). A tool that synthesizes and hands over an answer with a
  citation short-circuits exactly the skill the program exists to build. That's a real conflict
  with the docs' own teaching philosophy, not just a UX tradeoff.

Everything from the earlier analysis (multilingual embedding fix, stub-page eval gap, corpus
cross-referencing) stays correct *as engineering* — if this gets built, those are the right
things to fix. But they answer "would it work well," not "should it exist," and the usage-
frequency and pedagogical points argue it shouldn't, at least not as the thing to prioritize
building right now.

**If anyone still wants to build it**, treat it as a learning exercise for the builder (real RAG
pipeline, real stack decisions) rather than a solved need for the apprentices — and if it does
ship, instrument it (the `QUERIES` table already supports this) specifically to test the usage-
frequency assumption before investing further, since that's the assumption this recommendation
now rests on.
