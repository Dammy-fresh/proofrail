import assert from "node:assert/strict";
import test from "node:test";
import { analyzeOwnership } from "./ownership.ts";
import { analyzeProxy, EIP1967_IMPLEMENTATION_SLOT } from "./proxy.ts";

const contract = "0x52908400098527886E0F7030069857D2E4169EE7" as const;
const other = "0x1111111111111111111111111111111111111111" as const;
test("nonzero owner is possible, not comprehensive ownership", async () => { const result = await analyzeOwnership(contract, 9n, true, { readContract: async () => other }); assert.equal(result.status, "POSSIBLE"); assert.equal(result.owner, other); });
test("zero owner stays unknown and does not claim renunciation", async () => { const result = await analyzeOwnership(contract, 9n, true, { readContract: async () => "0x0000000000000000000000000000000000000000" }); assert.equal(result.status, "UNKNOWN"); assert.match(result.explanation, /does not independently prove/i); });
test("failed owner probe is unknown", async () => { const result = await analyzeOwnership(contract, 9n, true, { readContract: async () => { throw new Error("revert"); } }); assert.equal(result.status, "UNKNOWN"); });
test("implementation slot with code is possible EIP-1967 structure at supplied block", async () => { const blocks: bigint[] = []; const result = await analyzeProxy(contract, 9n, "0x99", { getStorageAt: async ({ slot, blockNumber }) => { blocks.push(blockNumber); return slot === EIP1967_IMPLEMENTATION_SLOT ? `0x000000000000000000000000${other.slice(2)}` as `0x${string}` : "0x"; }, getBytecode: async ({ address, blockNumber }) => { blocks.push(blockNumber); return address === other ? "0x01" : "0x99"; }, readContract: async () => other }); assert.equal(result.status, "POSSIBLE"); assert(blocks.every((block) => block === 9n)); });
test("exact EIP-1167 code is confirmed while nonmatching code is unknown", async () => { const runtime = `0x363d3d373d3d3d363d73${other.slice(2)}5af43d82803e903d91602b57fd5bf3` as `0x${string}`; const client = { getStorageAt: async () => "0x" as `0x${string}`, getBytecode: async () => "0x01" as `0x${string}`, readContract: async () => other }; const match = await analyzeProxy(contract, 9n, runtime, client); const noMatch = await analyzeProxy(contract, 9n, "0x1234", client); assert.equal(match.status, "CONFIRMED"); assert.equal(match.minimalProxyImplementation, other); assert.equal(noMatch.status, "UNKNOWN"); });
