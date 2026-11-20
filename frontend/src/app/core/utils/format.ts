const eurFormatter = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 0 });

export function formatEur(value: number): string {
  return eurFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Slovak plural helper: plural(3, ['pozícia', 'pozície', 'pozícií']). */
export function plural(count: number, forms: readonly [string, string, string]): string {
  if (count === 1) return forms[0];
  if (count >= 2 && count <= 4) return forms[1];
  return forms[2];
}
