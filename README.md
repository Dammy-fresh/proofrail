# Proofrail

Proofrail is a read-only smart-contract intelligence website for **Robinhood Chain mainnet only** (chain ID 4663). It never needs a wallet connection, private key, seed phrase, signature, approval, or transaction.

## Getting started

This project requires **Node.js 20.9 or newer**. The current development environment uses Node.js 22.16.0.

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment configuration

Proofrail performs read-only Robinhood Chain analysis at request time. Production and Vercel Preview deployments require a dedicated Robinhood Chain mainnet RPC endpoint:

```env
ROBINHOOD_RPC_URL=
```

To enable verified-source and ABI lookup through Etherscan's Robinhood Chain V2 API, also configure:

```env
ETHERSCAN_API_KEY=
```

Put local values in `.env.local`, which is ignored by Git. Do not use `NEXT_PUBLIC_` prefixes for either variable: both values must remain server-side. The official public RPC is a rate-limited local-development fallback only; it is not used by production deployments without `ROBINHOOD_RPC_URL`.

## Quality checks

```bash
npm run lint
npm run type-check
npm run test
npm run build
```
