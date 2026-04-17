// ─── Helper ───────────────────────────────────────────────────────────────────
export function formatProgress(amount: number): string {
  const TARGET = 100000;
  if (amount === 0) return "0% TARGET";
  const percentage = Math.min(100, Math.round((amount / TARGET) * 100));
  if (percentage < 50) return "CRITICAL";
  return `${percentage}% TARGET`;
}


export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


export function NumberFormat(amount: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "PKR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}


export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}