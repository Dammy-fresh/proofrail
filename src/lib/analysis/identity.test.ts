import assert from "node:assert/strict";
import test from "node:test";
import { analyzeIdentity, type IdentityClient } from "./identity.ts";

const address = "0x52908400098527886E0F7030069857D2E4169EE7" as const;
const verification = async () => ({ status: "UNKNOWN" as const, limitation: "Unavailable.", explorerUrl: `https://robinhoodchain.blockscout.com/address/${address}` });
const client = (overrides: Partial<IdentityClient>): IdentityClient => ({ getBlockNumber: async () => 42n, getBlock: async () => ({ timestamp: 1_700_000_000n }), getBytecode: async () => "0x1234", readContract: async ({ functionName }) => ({ name: "Sample", symbol: "SMP", decimals: 18, totalSupply: 1000000000000000000n })[functionName]!, ...overrides });

test("no bytecode is confirmed and skips token probes", async () => {
  let probes = 0;
  const report = await analyzeIdentity(address, client({ getBytecode: async () => "0x", readContract: async () => { probes += 1; return ""; } }), verification);
  assert.equal(report.kind, "success"); assert.equal(report.hasCode, false); assert.equal(report.evidence[0]?.classification, "CONFIRMED"); assert.equal(probes, 0);
});

test("complete ERC-20 probes produce confirmed identity fields", async () => {
  const report = await analyzeIdentity(address, client({}), verification);
  assert.equal(report.kind, "success"); assert.equal(report.category.status, "CONFIRMED"); assert.equal(report.token?.symbol, "SMP"); assert.equal(report.token?.totalSupplyRaw, "1000000000000000000");
});

test("failed token probe remains unknown without declaring non-token", async () => {
  const report = await analyzeIdentity(address, client({ readContract: async ({ functionName }) => { if (functionName === "symbol") throw new Error("revert"); return ({ name: "Sample", decimals: 18, totalSupply: 1n }[functionName]!); } }), verification);
  assert.equal(report.kind, "success"); assert.equal(report.category.status, "UNKNOWN"); assert.match(report.category.limitation ?? "", /does not establish/i);
});

test("verification unavailability stays unknown", async () => {
  const report = await analyzeIdentity(address, client({}), verification);
  assert.equal(report.kind, "success"); assert.equal(report.verification.status, "UNKNOWN");
});

test("RPC failure becomes a safe structured failure", async () => {
  const report = await analyzeIdentity(address, client({ getBlockNumber: async () => { throw new Error("provider secret"); } }), verification);
  assert.deepEqual(report, { kind: "failure", code: "NETWORK_UNAVAILABLE", message: "Proofrail could not reach Robinhood Chain right now. Please try again." });
});
