import assert from "node:assert/strict";
import test from "node:test";
import { analyzePermissions } from "./permissions.ts";

const address = "0x52908400098527886E0F7030069857D2E4169EE7" as const;
test("verified ABI permission names are possible capability indicators, not confirmed authority", () => { const findings = analyzePermissions(address, 7n, [{ type: "function", name: "mint" }, { type: "function", name: "pause" }]); assert.equal(findings.length, 2); assert(findings.every((finding) => finding.classification === "POSSIBLE")); });
test("misleading non-function ABI names and unavailable ABI produce no permission finding", () => { assert.equal(analyzePermissions(address, 7n, [{ type: "event", name: "mint" }]).length, 0); assert.equal(analyzePermissions(address, 7n).length, 0); });
