// ─── Helper ───────────────────────────────────────────────────────────────────
export function formatProgress(amount: number): string {
  const TARGET = 100000;
  if (amount === 0) return "0% TARGET";
  const percentage = Math.min(100, Math.round((amount / TARGET) * 100));
  if (percentage < 50) return "CRITICAL";
  return `${percentage}% TARGET`;
}