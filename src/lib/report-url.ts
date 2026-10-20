import type { Address } from "viem";
import { validateContractAddress } from "./address.ts";
export const ROBINHOOD_CHAIN_ID = "4663";
export function createReportPath(address: Address) { return `/report/${ROBINHOOD_CHAIN_ID}/${address}`; }
export function validateReportRoute(chainId: string, address: string) { if (chainId !== ROBINHOOD_CHAIN_ID) return { valid: false as const, error: "Proofrail currently supports Robinhood Chain mainnet only." }; const parsed = validateContractAddress(address); return parsed.valid ? { valid: true as const, address: parsed.address } : { valid: false as const, error: "This report link does not contain a valid EVM contract address." }; }
