import assert from "node:assert/strict";
import test from "node:test";
import { validateReportApiInput } from "./api-input.ts";

test("invalid API-route input is rejected safely", () => {
  assert.deepEqual(validateReportApiInput("invalid"), { valid: false, error: "Enter a valid EVM contract address." });
});
