import { NextResponse } from "next/server";
import { getRobinhoodClient } from "@/lib/chain/robinhood";
import { analyzeIdentity } from "@/lib/analysis/identity";
import { analyzeOwnership } from "@/lib/analysis/ownership";
import { analyzeProxy } from "@/lib/analysis/proxy";
import { validateReportApiInput } from "@/lib/api-input";

export const dynamic = "force-dynamic";

function logAnalysisFailure(error: unknown) {
  const record = error && typeof error === "object" ? error as { name?: unknown; status?: unknown; statusCode?: unknown; cause?: unknown } : undefined;
  const cause = record?.cause && typeof record.cause === "object" ? record.cause as { status?: unknown; statusCode?: unknown } : undefined;
  const status = [record?.status, record?.statusCode, cause?.status, cause?.statusCode].find((value): value is number => typeof value === "number");

  // Do not log error messages: provider errors can include request URLs and embedded API keys.
  console.error("[Proofrail] Report analysis failed", {
    errorType: typeof record?.name === "string" ? record.name : "UnknownError",
    ...(status ? { httpStatus: status } : {}),
  });
}

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const validated = validateReportApiInput(address);
  if (!validated.valid) return NextResponse.json({ kind: "failure", code: "INVALID_ADDRESS", message: "Enter a valid EVM contract address." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  try {
    const client = getRobinhoodClient();
    const report = await analyzeIdentity(validated.address, client);
    if (report.kind === "success") {
      const blockNumber = BigInt(report.blockNumber);
      const code = report.hasCode ? await client.getBytecode({ address: report.address, blockNumber }) : "0x";
      report.ownership = await analyzeOwnership(report.address, blockNumber, report.hasCode, client);
      report.proxy = await analyzeProxy(report.address, blockNumber, code, client);
    }
    return NextResponse.json(report, { status: report.kind === "failure" ? 503 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logAnalysisFailure(error);
    return NextResponse.json({ kind: "failure", code: "NETWORK_UNAVAILABLE", message: "Proofrail could not reach Robinhood Chain right now. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
