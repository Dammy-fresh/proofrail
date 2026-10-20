# Proofrail project rules

Proofrail V1 is a read-only smart-contract intelligence website. This foundation is Milestone 0 only; do not add blockchain analysis, external API calls, wallets, deployment, AI integration, or contract examples unless a later task explicitly authorizes them.

- Support **Robinhood Chain mainnet only** (chain ID `4663`). Never use, fall back to, or imply support for another chain.
- Official endpoints: public RPC `https://rpc.mainnet.chain.robinhood.com`; explorer `https://robinhoodchain.blockscout.com`. Verify every future endpoint against official documentation before use. Treat the public RPC as rate-limited local-development fallback; production must use a configured RPC URL.
- Analysis is read-only. Never request or handle wallet connections, signatures, transactions, approvals, private keys, seed phrases, or other credentials.
- Use exactly these classifications: **CONFIRMED** — directly supported by reliable onchain reads, verified contract data, or equivalent evidence; **POSSIBLE** — supported by indicators or conservative heuristics but not proven; **UNKNOWN** — insufficient evidence to determine the result.
- Each significant finding must state its evidence source, relevant address, useful explorer link, relevant block information, and clearly separate observation from interpretation.
- Verified source or ABI may improve analysis. Treat unverified bytecode only with conservative storage/bytecode heuristics; never present it as equivalent visibility.
- Never invent vulnerabilities, contract data, API responses, endpoints, or real contract addresses. Treat addresses and explorer/blockchain data as untrusted input.
- Keep blockchain-analysis modules separate from UI modules. Validate inputs; in future API work use timeouts and graceful errors, and keep secrets server-side.
- Before completing future work, run relevant lint, type-check, tests, and a production build where feasible.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
