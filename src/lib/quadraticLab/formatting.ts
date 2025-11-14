const numberFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 6 });
const scientificFormatter = new Intl.NumberFormat("es-ES", {
  notation: "scientific",
  maximumFractionDigits: 2
});

export function sanitizeNumber(value: number | string, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function formatNumber(value: number, digits = 6) {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(4)} %`;
}

export function formatScientific(value: number) {
  if (!Number.isFinite(value)) return "—";
  return scientificFormatter.format(value);
}
