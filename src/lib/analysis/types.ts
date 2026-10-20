export type EvidenceClassification = "CONFIRMED" | "POSSIBLE" | "UNKNOWN";
export type EvidenceSource = "Robinhood Chain RPC" | "Blockscout";

export type Evidence = { classification: EvidenceClassification; source: EvidenceSource; address: `0x${string}`; blockNumber?: string; explorerUrl: string; observedValue: string; observation: string; interpretation: string; limitation?: string };
export type Ownership = { status: EvidenceClassification; owner?: `0x${string}`; explanation: string; roleInformation: string; evidence: Evidence[] };
export type Proxy = { status: EvidenceClassification; explanation: string; implementation?: `0x${string}`; beacon?: `0x${string}`; beaconImplementation?: `0x${string}`; admin?: `0x${string}`; minimalProxyImplementation?: `0x${string}`; evidence: Evidence[] };
export type PermissionFinding = { title: string; classification: EvidenceClassification; explanation: string; limitation: string; evidence: Evidence };
export type RiskFinding = { title: string; severity: "INFORMATIONAL"; classification: EvidenceClassification; explanation: string; evidence: Evidence };
export type IdentityReport = { kind: "success"; address: `0x${string}`; analyzedAt: string; blockNumber: string; blockTimestamp: string; hasCode: boolean; verification: { status: EvidenceClassification; contractName?: string; limitation?: string }; category: { status: EvidenceClassification; label: string; limitation?: string }; token?: { name: string; symbol: string; decimals: number; totalSupplyRaw: string; totalSupplyDisplay: string }; evidence: Evidence[]; ownership?: Ownership; proxy?: Proxy; permissions?: PermissionFinding[]; risks?: RiskFinding[] };
export type AnalysisFailure = { kind: "failure"; code: "NETWORK_UNAVAILABLE"; message: string };
export type AnalysisResult = IdentityReport | AnalysisFailure;
