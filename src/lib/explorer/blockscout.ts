import type { Address } from "viem";
import { explorerAddressUrl } from "../chain/robinhood.ts";

export type VerificationLookup = { status: "CONFIRMED" | "UNKNOWN"; contractName?: string; abi?: unknown[]; limitation?: string; explorerUrl: string };

export async function getVerificationStatus(address: Address): Promise<VerificationLookup> {
  // Etherscan's Robinhood Chain page documents contract endpoints with chainid=4663 and an API key.
  // getsourcecode returns result[0].SourceCode, ABI, and ContractName; source must be non-empty and ABI JSON must parse.
  const explorerUrl = explorerAddressUrl(address); const key = process.env.ETHERSCAN_API_KEY;
  if (!key) return { status: "UNKNOWN", explorerUrl, limitation: "Verified-source lookup requires a configured Etherscan API key." };
  try { const response = await fetch(`https://api.etherscan.io/v2/api?chainid=4663&module=contract&action=getsourcecode&address=${address}&apikey=${encodeURIComponent(key)}`, { cache: "no-store", signal: AbortSignal.timeout(8_000) }); if (!response.ok) return { status: "UNKNOWN", explorerUrl, limitation: "Verification lookup was unavailable or rate-limited." }; const body: unknown = await response.json(); const item = (body as { result?: Array<{ SourceCode?: string; ABI?: string; ContractName?: string }> }).result?.[0]; if (!item?.SourceCode || !item.ABI || item.ABI === "Contract source code not verified") return { status: "UNKNOWN", explorerUrl, limitation: "The lookup did not reliably confirm verified source." }; const abi = JSON.parse(item.ABI); if (!Array.isArray(abi)) return { status: "UNKNOWN", explorerUrl, limitation: "The returned ABI was not usable." }; return { status: "CONFIRMED", explorerUrl, contractName: item.ContractName || undefined, abi }; } catch { return { status: "UNKNOWN", explorerUrl, limitation: "Verification lookup could not be completed." }; }
}
