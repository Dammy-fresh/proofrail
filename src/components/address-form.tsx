"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { validateContractAddress } from "@/lib/address";

export function AddressForm() {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateContractAddress(value);
    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);
    router.push(`/report/4663/${result.address}`);
  }

  return (
    <form className="address-form" onSubmit={submit} noValidate>
      <label htmlFor={inputId}>Contract address</label>
      <div className={`address-controls ${error ? "has-error" : ""}`}>
        <input
          id={inputId}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="0x…"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button type="submit">Analyze contract <span aria-hidden="true">→</span></button>
      </div>
      <p className="field-note" id={error ? errorId : undefined} role={error ? "alert" : undefined}>
        {error ?? "Paste an EVM contract address. We’ll use it only to open a read-only report."}
      </p>
    </form>
  );
}
