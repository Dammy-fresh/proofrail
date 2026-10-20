import assert from "node:assert/strict";
import test from "node:test";
import { validateContractAddress } from "./address.ts";

const lowerCaseAddress = "0x52908400098527886e0f7030069857d2e4169ee7";
const checksummedAddress = "0x52908400098527886E0F7030069857D2E4169EE7";

test("accepts a lower-case EVM address and returns its checksum", () => {
  assert.deepEqual(validateContractAddress(lowerCaseAddress), { valid: true, address: checksummedAddress });
});

test("accepts a checksummed EVM address", () => {
  assert.deepEqual(validateContractAddress(checksummedAddress), { valid: true, address: checksummedAddress });
});

test("safely trims surrounding whitespace", () => {
  assert.deepEqual(validateContractAddress(`  ${lowerCaseAddress}  `), { valid: true, address: checksummedAddress });
});

test("rejects malformed input with a safe error", () => {
  assert.deepEqual(validateContractAddress("not-an-address"), { valid: false, error: "Enter a valid EVM address beginning with 0x." });
});

test("rejects an empty value", () => {
  assert.deepEqual(validateContractAddress("  "), { valid: false, error: "Enter a contract address to continue." });
});
