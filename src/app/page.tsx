import { AddressForm } from "@/components/address-form";
import { ProofrailMark } from "@/components/proofrail-mark";

const checks = [
  ["01", "Contract identity", "Establish what public contract data can reliably identify."],
  ["02", "Ownership and administration", "Surface observable control paths and administrative signals when evidence permits."],
  ["03", "Proxy and upgrade structure", "Clarify whether deployed code may be routed or changed through a visible structure."],
  ["04", "Detectable permissions and risk indicators", "Distinguish supported indicators from conclusions that evidence cannot establish."],
];

const evidence = [
  ["CONFIRMED", "Direct, reliable evidence."],
  ["POSSIBLE", "An indicator, not proof."],
  ["UNKNOWN", "Insufficient evidence to determine the result."],
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header content-width">
        <ProofrailMark />
        <div className="network-pill"><span />Robinhood Chain <b>·</b> Mainnet</div>
      </header>

      <main>
        <section className="hero content-width">
          <p className="eyebrow">Contract intelligence, evidence first</p>
          <h1><span>PROOF</span>RAIL</h1>
          <p className="hero-title">Understand what your contract can do.</p>
          <p className="hero-copy">Proofrail will analyze publicly available Robinhood Chain contract evidence and present what it supports — without connecting to your wallet.</p>
          <AddressForm />
          <p className="read-only"><span aria-hidden="true">◌</span> Read-only analysis. No wallet connection required.</p>
        </section>

        <section className="checks-section content-width" aria-labelledby="checks-title">
          <div className="section-intro">
            <p className="eyebrow">The review surface</p>
            <h2 id="checks-title">What Proofrail checks</h2>
            <p>Reports are structured around the questions that matter before you interact with a contract.</p>
          </div>
          <div className="checks-grid">
            {checks.map(([number, title, description]) => (
              <article className="check-card" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="evidence-section content-width" aria-labelledby="evidence-title">
          <div>
            <p className="eyebrow">No black boxes</p>
            <h2 id="evidence-title">Evidence has a boundary.</h2>
            <p>Every future report will show the evidence behind a finding — and its limitations.</p>
          </div>
          <div className="evidence-list">
            {evidence.map(([label, detail]) => <div key={label}><strong>{label}</strong><span>{detail}</span></div>)}
          </div>
        </section>
      </main>

      <footer className="site-footer content-width">
        <ProofrailMark compact />
        <p>Proofrail — The evidence layer for onchain finance.</p>
        <p>Robinhood Chain mainnet only. Not investment, legal, or security advice.</p>
      </footer>
    </div>
  );
}
