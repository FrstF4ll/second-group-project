# Review — third-party overview of the Documentation RAG Agent baseline

**Status:** reviewed — baseline frozen, corrections recorded as delta, not applied.
**Source:** `.scratch/RAG_SYSTEM/spec.md`

## 1. The idea

Unchanged from the baseline — the problem (find an answer in a doc site without grepping it by
hand, with a citation you can verify) is real and the shape of the solution is right. This review
is triggered by a stack correction, not a rethink of the idea.

## 2. The stack

The baseline's tech stack row (`sentence-transformers` for embeddings, Chroma as the vector
store) was written stack-agnostic and defaulted to the Python ML ecosystem because that's where
those specific libraries live. You've now said: React frontend, LangChain backend, **TypeScript,
not Python** — your team doesn't have the Python experience to make debugging a Python service
worth the cost. That's a real constraint, not a preference, and it invalidates two of the
baseline's four stack rows outright:

- **`sentence-transformers`** is Python-only. There is no TS equivalent library — the JS
  ecosystem's answer is either (a) run embedding models locally via ONNX through
  `@xenova/transformers` (transformers.js — same models, e.g. `bge-small-en-v1.5`, running in
  Node with no Python runtime involved), or (b) call a hosted embeddings API instead of running
  anything locally. Both are viable; they trade off differently (see grill questions below).
- **Chroma**, in its typical local-dev setup, runs as a server process that's part of the
  `chromadb` Python package — the JS client talks to that server over HTTP. Picking Chroma would
  quietly reintroduce a Python process into an otherwise all-TS stack. The JS-native alternatives
  are an embedded vector store with a Node binding (LanceDB — Rust core, no external server, no
  Python) or a plain Postgres + `pgvector` extension (any language talks to Postgres over SQL;
  Supabase bundles pgvector + hosting + auth if you want managed instead of self-hosted).

**LangChain.js** is a reasonable orchestration choice here beyond just "it's not Python": its
`Runnable` abstraction means a single-shot retrieve→generate chain and a later agentic
tool-calling loop (via LangChain's agent executors, or LangGraph.js if the loop gets complex) can
share the same retriever interface — so committing to LangChain.js now doesn't force choosing
"single-shot vs. agentic" today the way a hand-rolled pipeline would. One gotcha worth flagging
early: LangChain.js has no first-party DeepSeek integration bundled by default. DeepSeek's API is
OpenAI-compatible, so either `@langchain/openai`'s `ChatOpenAI` class pointed at DeepSeek's base
URL, or the community `@langchain/deepseek` package, both work — just don't expect
`@langchain/deepseek` to be as maintained/documented as the first-party OpenAI/Anthropic
integrations.

React on the frontend was already the baseline's deferred Open Question #3 ("does this need a
UI?") — you've now answered it: yes, a UI is in scope, not deferred.

## 3. The planning

Two consequences of the stack correction ripple into sections the baseline hadn't touched yet:

1. **Deployment shape changes materially** depending on the vector store choice. LanceDB
   (embedded, file-backed, no server) keeps the deployment as simple as the baseline's Chroma
   choice was meant to be. Postgres/pgvector (self-hosted or Supabase) adds a real database
   service to operate — more standard for a team that's going to build a React+TS app anyway
   (most such teams already know SQL and Postgres), but it's a service, not a file, and that's a
   deployment-shape decision, not just a library swap.
2. **The embedding choice has a cost/complexity tradeoff the baseline's single Python row hid.**
   Local ONNX embeddings via transformers.js: zero per-call cost, but it's a real model running
   in your Node process (memory footprint, first-load latency) — new territory for a team new to
   ML tooling generally, even without Python specifically. A hosted embeddings API: trivial to
   integrate (one HTTP call), but real per-embedding cost and an external dependency at ingest
   time. Neither is obviously right without knowing the team's comfort running local models vs.
   preferring pure API calls.

Everything else in the baseline (data model, chunking approach, MVP in/out split, risk table,
test strategy) holds regardless of the language/runtime — those don't change with this
correction.

## 4. Corrections (delta vs baseline, not applied)

| # | Correction | Impact |
|---|------------|--------|
| 1 | Backend is TypeScript/Node, not Python | Rules out `sentence-transformers` and the typical Chroma server setup outright — both were Python-dependent |
| 2 | Frontend is React, and a UI is in scope | Resolves baseline Open Question #3 ("does this need a UI?") — yes, not deferred |
| 3 | Orchestration is LangChain.js | Gives single-shot and future agentic-loop architectures a shared interface via `Runnable`; DeepSeek needs `ChatOpenAI` pointed at DeepSeek's base URL or the community `@langchain/deepseek` package — no first-party integration |
| 4 | Embedding model must be JS-native or API-based | Local: `@xenova/transformers` (ONNX, in-process, zero per-call cost). Hosted: any embeddings API (real cost, external dependency). Needs a decision — see grill questions |
| 5 | Vector store must be JS-native or language-agnostic over the wire | LanceDB (embedded, Node binding, no server) or Postgres+pgvector (self-hosted or Supabase managed) — different deployment shapes, needs a decision |

These corrections are not applied to `spec.md` yet — they land in the revised spec once the open
questions below are resolved.

## 5. Third way

Not applicable here — corrections 1–3 are a straightforward adoption of your stated constraint,
not a fork in approach. Corrections 4–5 are genuine decisions, not alternate architectures; they
get resolved as decisions in the revised spec, not as a sibling plan.
