import assert from "node:assert/strict";
import test from "node:test";
import { getVerificationStatus } from "./blockscout.ts";

const address = "0x52908400098527886E0F7030069857D2E4169EE7" as const;

test("missing Etherscan key returns unknown without making a request", async () => {
  const previous = process.env.ETHERSCAN_API_KEY;
  delete process.env.ETHERSCAN_API_KEY;
  try {
    const result = await getVerificationStatus(address);
    assert.equal(result.status, "UNKNOWN");
    assert.match(result.limitation ?? "", /requires a configured/i);
  } finally { if (previous) process.env.ETHERSCAN_API_KEY = previous; }
});

test("verification transport failures are safe unknown results", async () => {
  const previousKey = process.env.ETHERSCAN_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.ETHERSCAN_API_KEY = "test-key";
  globalThis.fetch = async () => { throw new Error("rate limited"); };
  try {
    const result = await getVerificationStatus(address);
    assert.equal(result.status, "UNKNOWN");
    assert.match(result.limitation ?? "", /could not be completed/i);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey) process.env.ETHERSCAN_API_KEY = previousKey; else delete process.env.ETHERSCAN_API_KEY;
  }
});
