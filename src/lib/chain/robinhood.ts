import { createPublicClient, http, type Address } from "viem";

export const ROBINHOOD_CHAIN_ID = 4663;
export const ROBINHOOD_EXPLORER_URL = "https://robinhoodchain.blockscout.com";
const DEVELOPMENT_FALLBACK_RPC = "https://rpc.mainnet.chain.robinhood.com";

export const robinhoodChain = { id: ROBINHOOD_CHAIN_ID, name: "Robinhood Chain", nativeCurrency: { name: "Robinhood", symbol: "RHC", decimals: 18 }, rpcUrls: { default: { http: [DEVELOPMENT_FALLBACK_RPC] } } } as const;
export const explorerAddressUrl = (address: Address) => `${ROBINHOOD_EXPLORER_URL}/address/${address}`;

export function getRobinhoodClient() {
  const configuredRpc = process.env.ROBINHOOD_RPC_URL;
  if (!configuredRpc && process.env.NODE_ENV === "production") throw new Error("Production RPC is not configured.");
  // The official public URL is a rate-limited local-development fallback only.
  return createPublicClient({ chain: robinhoodChain, transport: http(configuredRpc || DEVELOPMENT_FALLBACK_RPC, { timeout: 10_000, retryCount: 0 }) });
}
