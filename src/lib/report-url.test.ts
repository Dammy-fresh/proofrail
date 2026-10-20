import assert from "node:assert/strict";
import test from "node:test";
import { createReportPath, validateReportRoute } from "./report-url.ts";
const address = "0x52908400098527886E0F7030069857D2E4169EE7" as const;
test("builds a usable Robinhood Chain report URL path", () => assert.equal(createReportPath(address), `/report/4663/${address}`));
test("accepts valid report URLs and rejects invalid addresses and networks", () => { assert.equal(validateReportRoute("4663", address).valid, true); assert.equal(validateReportRoute("1", address).valid, false); assert.equal(validateReportRoute("4663", "invalid").valid, false); });
