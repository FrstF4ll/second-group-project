# Spec: Documentation RAG Agent

**Status:** revised — decisions locked after grill pass 1 (stack correction + follow-up questions), Decision #7 updated after source-access was confirmed. Recorded in `review.md`.
**Source:** baseline drafted from the initial brief; revised per `review.md`'s corrections and the answers below.
**See also:** `ARCHITECTURE.md` for the data model, request flows, and component layout derived from the decisions below; `website.md` for the reading list behind each stack choice.

## Thesis / Overview

A retrieval-augmented agent that answers natural-language questions about the JT docs website
(a Quartz-built documentation site), grounding every answer in the site's own content and citing
the source page/section, using DeepSeek as the reasoning/generation model. Built end-to-end in
TypeScript (React frontend, Node/LangChain.js backend) — no Python anywhere in the stack, per the
team's stated experience. Source-repo access to the JT docs content is available (see Decision
#7), so ingestion reads the markdown source directly rather than crawling the deployed site.

## User stories

**Reader.** I ask a question in plain language, in a chat UI on (or alongside) the docs site, and
get a direct answer with a citation linking back to the exact page it came from.

**Doc maintainer.** When the docs site is redeployed, I run one command to re-crawl and
re-ingest the updated content so the agent's answers stay current.

## Decisions taken (grill pass 1)

| # | Question | Decision |
|---|----------|----------|
| 1 | Backend language/runtime | **TypeScript/Node, not Python.** Rules out `sentence-transformers` and the typical Chroma server; see `review.md` corrections #1–3. |
| 2 | Frontend | **React.** A chat UI is in scope, not deferred — resolves baseline Open Question #3. |
| 3 | Orchestration framework | **LangChain.js.** `Runnable`-based chain now, room to grow into an agent loop later without a rewrite. DeepSeek via `ChatOpenAI` pointed at DeepSeek's base URL, or the community `@langchain/deepseek` package. |
| 4 | Vector store | **Postgres + `pgvector`** (self-hosted or Supabase-managed). Chosen over LanceDB — the team already works in SQL, and a real DB service is worth the extra deployment piece over an embedded file store. |
| 5 | Embeddings | **Local, via `@xenova/transformers`** (ONNX, in-process, e.g. `bge-small-en-v1.5`). Zero per-call cost, accepted the added Node-process weight over calling a hosted embeddings API. |
| 6 | Agent loop ambition (MVP) | **Single-shot chain**: embed → retrieve top-k → generate once. No multi-hop retrieval loop or tool-calling for the MVP — LangChain.js's `Runnable` interface keeps this swappable later. |
| 7 | Ingestion source | **Source-repo access confirmed — the JT docs website's markdown `content/` directory is available.** ~~Originally decided as deployed-site-only (crawl the rendered HTML)~~ — superseded once repo access was confirmed. Ingestion reads the Quartz markdown source directly: frontmatter, clean heading structure, no HTML-chrome stripping needed. This reverts to the baseline's original assumption; see the Corrections table in `review.md` for why it had been changed away from this in the first place. |

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React (chat UI) | Per team decision — in scope for MVP, not deferred |
| Backend runtime | Node.js + TypeScript | Team has no Python experience; rules out the Python-native ML tooling the baseline assumed |
| Ingestion | Loader reading the JT docs `content/` markdown directory directly — frontmatter parsing (`gray-matter` or similar) + markdown AST (`remark`/`unified`) | Source-repo access confirmed (Decision #7) — no crawler/HTML-extraction needed |
| Chunking | Heading-aware splitter over the markdown AST, ~300–500 tokens, ~15% overlap | Chunk quality drives answer quality more than model choice |
| Embeddings | `@xenova/transformers`, e.g. `bge-small-en-v1.5`, run in-process in Node | Local, zero per-call cost (Decision #5) |
| Vector store | Postgres + `pgvector` extension (self-hosted or Supabase) | Team's existing SQL familiarity; real DB service over an embedded file store (Decision #4) |
| Orchestration / agent | LangChain.js, single-shot `Runnable` chain for MVP | Shared retriever interface that can grow into an agent loop later without a rewrite (Decision #6) |
| LLM | DeepSeek chat completions, via LangChain's `ChatOpenAI` pointed at DeepSeek's base URL (or `@langchain/deepseek`) | Per the brief; no first-party LangChain.js DeepSeek integration, so pin down which wrapper before building |
| API layer | A small Node service (Express/Fastify/Next.js API routes — pick whichever the team's React app already uses) exposing `POST /query` and an `ingest` CLI command | Keeps ingestion and querying decoupled; ingestion doesn't need to be a live HTTP endpoint |

## MVP scope

### In
- Ingest the JT docs `content/` markdown directory directly (frontmatter + body)
- Heading-aware chunking of the markdown content
- Local embeddings via `@xenova/transformers`, stored in Postgres/`pgvector`
- Single-shot RAG query via LangChain.js: embed question, retrieve top-k, DeepSeek generates an answer with citations
- Citations resolve back to the source page URL (derived from `source_path`)
- React chat UI, calling `POST /query`
- CLI re-ingestion command, skips unchanged files via `content_hash`
- A small fixture-corpus eval: known Q/A pairs checked for correct chunk retrieval + citation presence

### Out
- Automatic re-ingestion on every content commit (a CI/webhook hook) — **deferred**, manual CLI trigger is enough for MVP
- Multi-turn conversational memory across queries — **deferred**, MVP is single-shot Q&A, no session state
- A DeepSeek-driven multi-hop agent loop (multiple retrieval queries, tool use) — **cut for MVP** per Decision #6; LangChain.js keeps this swappable in later
- Reranking or fine-tuned retrieval models — **deferred**, top-k cosine similarity via pgvector is the MVP retrieval strategy
- Auth / rate-limiting on the query API — **deferred**, assumed to sit behind whatever hosts the app, or demo-only
- Non-English content handling — **out of scope** unless the actual docs are already multilingual
- HTML-crawling ingestion path — **cut, not deferred**: Decision #7 confirms markdown source access, so the crawler design considered earlier is dropped, not just deferred

## Risks

| Risk | Mitigation |
|------|------------|
| **No first-party LangChain.js↔DeepSeek integration.** Community packages lag official ones in maintenance; pointing `ChatOpenAI` at DeepSeek's base URL is more likely to keep working across LangChain.js version bumps than a smaller community wrapper. | Pin down which wrapper before building the chain (see Next Steps); prefer the `ChatOpenAI`-pointed-at-DeepSeek approach unless it's missing a needed feature. |
| **`pgvector` similarity search needs an index to stay fast as the corpus grows** (a naive `ORDER BY embedding <-> $1` full-scans without one). | Add an IVFFlat or HNSW index on the embedding column once there's a realistic corpus size to tune it against — don't defer this past the point where query latency becomes visible. |
| **Local embedding model (`@xenova/transformers`) adds real weight to the Node process** — first-load latency, memory footprint — new territory for a team that hasn't run local ML models before, even without the Python angle specifically. | Load the model once at process startup, not per-request; budget time in week 1 to just get the model loading and embedding a string end-to-end before wiring anything else to it. |
| **Chunking quality still drives answer quality more than model choice.** | Heading-aware chunker, hand-checked against real pages before trusting it on the full corpus. |
| **DeepSeek API availability/cost at query time.** | Embeddings are local (no API dependency there); only the generation step depends on DeepSeek's API — keep `deepseekClient.ts` behind an interface in case of an outage during a demo. |

## Test strategy

- Unit: loader against a small fixture `content/` directory — verifies frontmatter/title/path extraction
- Unit: chunker against markdown fixtures (headings, code fences, nested lists) — verifies no mid-block splits
- Integration: ingest a 3–5 page fixture corpus, run known Q/A pairs, assert the expected chunk is in top-k and the answer cites it — DeepSeek calls mocked/stubbed in CI
- Explicitly untested/offline: no live crawl of the real deployed site in CI, no billed DeepSeek or embedding-API calls in the automated test suite (moot for embeddings now that they're local, but keep the rule for the LLM call)

## Open questions (ordered by how much each blocks)

1. **Is a DeepSeek API key already available** (and is there a budget), or does that need setting up first? Blocks when dev/testing against the real model can start — fixture-based unit tests don't need it, but the integration test and any manual demo do.
2. **Which DeepSeek↔LangChain.js wrapper** — `ChatOpenAI` pointed at DeepSeek's base URL, or `@langchain/deepseek`? Blocks `deepseekClient.ts`; low-risk either way but should be picked once, not per-PR.
3. **Team size / timeline?** Still not given — needed before a workstream-split table makes sense; intentionally omitted from this spec until known.

Corpus size (baseline Open Question #4) is no longer blocking — Postgres/`pgvector` handles
growth without a store migration, unlike the embedded-store option it would have blocked.

## Next steps

1. Confirm the DeepSeek↔LangChain.js wrapper (Open Question #2) — small decision, but `deepseekClient.ts` is built once against it.
2. Build `loader.ts` against a small fixture slice of the real JT docs `content/` directory; hand-check the parsed frontmatter/headings before trusting it on the full corpus.
3. Get `@xenova/transformers` loading and embedding a string end-to-end in the Node process — budget real time for this, it's new territory for the team.
4. Stand up Postgres + `pgvector` (decide self-hosted vs. Supabase-managed) and wire the upsert/query paths.
5. Wire the LangChain.js single-shot chain end to end against the fixture corpus before touching the React UI.
6. Build the React chat UI last, once `POST /query` is proven to work.
