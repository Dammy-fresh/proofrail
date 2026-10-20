import { getAddress, isAddress } from "viem";

export type AddressValidationResult =
  | { valid: true; address: `0x${string}` }
  | { valid: false; error: string };

/** Validates local EVM address syntax only. It never makes a network request. */
export function validateContractAddress(value: string): AddressValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Enter a contract address to continue." };
  }

  if (!isAddress(trimmed, { strict: false })) {
    return {
      valid: false,
      error: "Enter a valid EVM address beginning with 0x.",
    };
  }

  return { valid: true, address: getAddress(trimmed) };
}
