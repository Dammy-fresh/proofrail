import Link from "next/link";
import { ProofrailMark } from "@/components/proofrail-mark";
import { ReportClient } from "@/components/report-client";
import { validateReportRoute } from "@/lib/report-url";

export default async function ReportPage({ params }: { params: Promise<{ chainId: string; address: string }> }) {
  const { chainId, address } = await params;

  const result = validateReportRoute(chainId, address);
  if (!result.valid) return <State title={chainId === "4663" ? "Invalid contract address" : "Unsupported network"} detail={result.error} />;

  return (
    <div className="report-page">
      <header className="report-header content-width"><ProofrailMark /><Link className="back-link" href="/">← New analysis</Link></header>
      <main className="report-main content-width">
        <ReportClient address={result.address} />
      </main>
    </div>
  );
}

function State({ title, detail }: { title: string; detail: string }) {
  return <main className="state-page"><section className="state-card"><p className="eyebrow">Proofrail · Robinhood Chain mainnet</p><h1>{title}</h1><p>{detail}</p><Link href="/">Return to Proofrail</Link></section></main>;
}
