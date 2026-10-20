import { formatUnits, type Address } from "viem";
import { explorerAddressUrl } from "../chain/robinhood.ts";
import { getVerificationStatus } from "../explorer/blockscout.ts";
import { analyzePermissions } from "./permissions.ts";
import type { AnalysisResult, Evidence, IdentityReport } from "./types.ts";

const erc20Abi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export type IdentityClient = { getBlockNumber(): Promise<bigint>; getBlock(args: { blockNumber: bigint }): Promise<{ timestamp: bigint }>; getBytecode(args: { address: Address; blockNumber: bigint }): Promise<`0x${string}` | undefined>; readContract(args: { address: Address; abi: typeof erc20Abi; functionName: "name" | "symbol" | "decimals" | "totalSupply"; blockNumber: bigint }): Promise<string | number | bigint> };

const safeText = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 256;
const safeDecimals = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 255;
const evidence = (address: Address, blockNumber: bigint, observedValue: string, observation: string, interpretation: string, limitation?: string): Evidence => ({ classification: "CONFIRMED", source: "Robinhood Chain RPC", address, blockNumber: blockNumber.toString(), explorerUrl: explorerAddressUrl(address), observedValue, observation, interpretation, limitation });

export async function analyzeIdentity(address: Address, client: IdentityClient, verificationLookup = getVerificationStatus): Promise<AnalysisResult> {
  try {
    const blockNumber = await client.getBlockNumber();
    const block = await client.getBlock({ blockNumber });
    const analyzedAt = new Date().toISOString();
    const code = await client.getBytecode({ address, blockNumber });
    const base = { kind: "success" as const, address, analyzedAt, blockNumber: blockNumber.toString(), blockTimestamp: new Date(Number(block.timestamp) * 1000).toISOString(), verification: { status: "UNKNOWN" as const }, evidence: [] as Evidence[] };
    if (!code || code === "0x") return { ...base, hasCode: false, category: { status: "UNKNOWN", label: "No supported contract category determined from the limited V1 identity probes.", limitation: "No ERC-20 probes were attempted because no deployed bytecode was detected." }, evidence: [evidence(address, blockNumber, "0x", "No deployed bytecode detected at the analysis block.", "This address may be an externally owned account or may otherwise not contain code at that block.")] };
    const verification = await verificationLookup(address);
    const verificationEvidence: Evidence = { classification: verification.status, source: "Blockscout", address, explorerUrl: verification.explorerUrl, observedValue: verification.status, observation: "Verification metadata lookup was not interpreted as a definitive verified or unverified state.", interpretation: "Verification status is unknown.", limitation: verification.limitation };
    const read = async (functionName: "name" | "symbol" | "decimals" | "totalSupply") => { try { return await client.readContract({ address, abi: erc20Abi, functionName, blockNumber }); } catch { return undefined; } };
    const [name, symbol, decimals, totalSupply] = await Promise.all([read("name"), read("symbol"), read("decimals"), read("totalSupply")]);
    const complete = safeText(name) && safeText(symbol) && safeDecimals(decimals) && typeof totalSupply === "bigint";
    const permissions = analyzePermissions(address, blockNumber, verification.abi);
    const risks = permissions.map((finding) => ({ title: finding.title, severity: "INFORMATIONAL" as const, classification: finding.classification, explanation: "Administrative capability indicator only — this is not evidence of malicious behavior or a vulnerability.", evidence: finding.evidence }));
    const common: Pick<IdentityReport, "hasCode" | "verification" | "evidence" | "permissions" | "risks"> = { hasCode: true, verification: { status: verification.status, contractName: verification.contractName, limitation: verification.limitation }, evidence: [evidence(address, blockNumber, "deployed bytecode", "Deployed bytecode was detected at the analysis block.", "The address contains code at this block; source visibility remains distinct from bytecode presence."), verificationEvidence], permissions, risks };
    if (!complete) return { ...base, ...common, category: { status: "UNKNOWN", label: "No supported contract category determined from the limited V1 identity probes.", limitation: "One or more ERC-20 interface probes were unavailable; this does not establish that the contract is not a token." } };
    const token = { name, symbol, decimals, totalSupplyRaw: totalSupply.toString(), totalSupplyDisplay: formatUnits(totalSupply, decimals) };
    return { ...base, ...common, token, category: { status: "CONFIRMED", label: "ERC-20 token interface detected", limitation: "This confirms supported interface responses, not token legitimacy or safety." }, evidence: [...common.evidence, evidence(address, blockNumber, name, "ERC-20 name() returned successfully.", "Contract-reported token name is available."), evidence(address, blockNumber, symbol, "ERC-20 symbol() returned successfully.", "Contract-reported token symbol is available."), evidence(address, blockNumber, String(decimals), "ERC-20 decimals() returned successfully.", "Contract-reported token decimals are available."), evidence(address, blockNumber, totalSupply.toString(), "ERC-20 totalSupply() returned successfully.", "Contract-reported total supply is available without converting bigint to Number.")] };
  } catch { return { kind: "failure", code: "NETWORK_UNAVAILABLE", message: "Proofrail could not reach Robinhood Chain right now. Please try again." }; }
}
