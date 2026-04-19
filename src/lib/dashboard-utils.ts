export function formatPKR(value: number): string {
  if (value >= 100000) {
    return `₨ ${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `₨ ${(value / 1000).toFixed(1)}K`;
  }
  return `₨ ${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value >= 100000) {
    return `${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
}

export function calcDeltaPercentage(today: number, yesterday: number): number {
  if (yesterday === 0) return today > 0 ? 100 : 0;
  return Math.round(((today - yesterday) / yesterday) * 100);
}
