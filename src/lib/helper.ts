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


export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}