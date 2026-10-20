"use client";

export default function Error({ reset }: { reset: () => void }) {
  return <main className="state-page"><section className="state-card"><p className="eyebrow">Proofrail</p><h1>Report unavailable</h1><p>We could not display this report interface. Please try again.</p><button className="retry-button" type="button" onClick={reset}>Try again</button></section></main>;
}
