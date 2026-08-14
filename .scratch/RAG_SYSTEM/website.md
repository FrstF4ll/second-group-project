# Technological choices — links to learn

Reference material for the stack decided in `spec.md` and `review.md`.

## Orchestration — LangChain.js

- LangChain.js docs — https://js.langchain.com/docs/introduction/
- Retrieval-augmented generation (RAG) tutorial — https://js.langchain.com/docs/tutorials/rag/
- `Runnable` interface (the shared abstraction behind `agent/chain.ts`) — https://js.langchain.com/docs/concepts/runnables/
- Agents / tool-calling (for the later multi-hop loop, not MVP — Decision #6) — https://js.langchain.com/docs/concepts/agents/
- LangGraph.js (if the agent loop ever needs more control than a basic agent executor) — https://langchain-ai.github.io/langgraphjs/

## LLM — DeepSeek

- DeepSeek API docs — https://api-docs.deepseek.com/
- DeepSeek API is OpenAI-compatible (base URL + model name swap) — https://api-docs.deepseek.com/guides/reasoning_model
- `@langchain/openai`'s `ChatOpenAI` (point `baseURL` at DeepSeek's endpoint — the recommended wrapper per `spec.md` Open Question #2) — https://js.langchain.com/docs/integrations/chat/openai/
- Community `@langchain/deepseek` package (alternative wrapper, less maintained than first-party integrations) — https://www.npmjs.com/package/@langchain/deepseek

## Embeddings — local, in-process (Decision #5)

- `@xenova/transformers` (transformers.js — runs ONNX models in Node, no Python) — https://huggingface.co/docs/transformers.js/en/index
- `bge-small-en-v1.5` model card (the embedding model referenced in `spec.md`) — https://huggingface.co/BAAI/bge-small-en-v1.5
- Background on embedding models generally (what they are, how similarity search uses them) — https://www.couchbase.com/blog/embedding-models/
- LangChain.js custom `Embeddings` interface (needed to wrap `@xenova/transformers` so LangChain's chain can call it like any other embedder) — https://js.langchain.com/docs/concepts/embedding_models/

## Vector store — Postgres + pgvector (Decision #4)

- `pgvector` extension — https://github.com/pgvector/pgvector
- LangChain.js pgvector integration — https://js.langchain.com/docs/integrations/vectorstores/pgvector/
- Supabase's pgvector guide (if going managed instead of self-hosted) — https://supabase.com/docs/guides/ai/vector-columns
- Indexing (IVFFlat / HNSW — relevant to the Risks table's indexing note in `spec.md`) — https://github.com/pgvector/pgvector#indexing

## Frontend — React chat UI

- Vercel AI SDK's `useChat` hook (streaming chat UI, works with any backend exposing a compatible endpoint — worth evaluating against hand-rolling the chat UI) — https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot

## Ingestion — crawling the deployed site (Decision #7)

- `cheerio` (HTML parsing/extraction in Node, referenced in `spec.md`'s tech stack table) — https://cheerio.js.org/
- Sitemap protocol (what `crawler.ts` looks for first) — https://www.sitemaps.org/protocol.html
- Quartz's sitemap plugin (confirms whether the target site emits one) — https://quartz.jzhao.xyz/plugins/Sitemap

## Out of scope / not used

- `python-genai` (Google's Python SDK) — https://github.com/googleapis/python-genai — not applicable, this stack is TypeScript-only per Decision #1; kept here only because it was in this file before the stack was pinned down
