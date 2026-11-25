export function parseCurrency(value: string): number | null {
  const normalizedValue = value.trim().replace(",", ".");

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedValue)) {
    return null;
  }

  const [wholePart, fractionalPart = ""] = normalizedValue.split(".");
  const cents =
    Number(wholePart) * 100 + Number(fractionalPart.padEnd(2, "0"));

  return Number.isSafeInteger(cents) ? cents : null;
}
