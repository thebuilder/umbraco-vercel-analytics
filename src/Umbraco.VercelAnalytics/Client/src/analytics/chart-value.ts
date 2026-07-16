export function formatChartAxisValue(value: number): string {
  if (Math.abs(value) < 1_000) return value.toLocaleString();

  const compactValue = Math.round((value / 1_000) * 10) / 10;
  return `${compactValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
}
