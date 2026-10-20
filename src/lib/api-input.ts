import { validateContractAddress } from "./address.ts";

export function validateReportApiInput(address: string) {
  const result = validateContractAddress(address);
  return result.valid ? result : { valid: false as const, error: "Enter a valid EVM contract address." };
}
