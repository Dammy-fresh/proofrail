type ProofrailMarkProps = { compact?: boolean };

export function ProofrailMark({ compact = false }: ProofrailMarkProps) {
  return (
    <div className="brand" aria-label="Proofrail">
      <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 25V7h11.5L25 13.5V25H7Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M12 19.5 15 16l2.6 2.4L21.5 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21.5" cy="13" r="1.5" fill="currentColor" />
      </svg>
      {!compact && <span>Proofrail</span>}
    </div>
  );
}
