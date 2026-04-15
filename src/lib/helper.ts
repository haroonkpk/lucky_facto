// ─── Helper ───────────────────────────────────────────────────────────────────
export function formatProgress(amount: number): string {
  const TARGET = 100000;
  if (amount === 0) return "0% TARGET";
  const percentage = Math.min(100, Math.round((amount / TARGET) * 100));
  if (percentage < 50) return "CRITICAL";
  return `${percentage}% TARGET`;
}

export function formatPKR(amount: number): string {
  if (amount >= 1_000_000) return `PKR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `PKR ${(amount / 1_000).toFixed(0)}K`;
  return `PKR ${amount.toFixed(0)}`;
}


export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}