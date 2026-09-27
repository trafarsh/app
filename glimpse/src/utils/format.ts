export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (n >= 10_000) return `${trim(n / 1_000)}K`;
  return n.toLocaleString('en-US');
}

function trim(n: number): string {
  return n >= 100 ? Math.floor(n).toString() : n.toFixed(1).replace(/\.0$/, '');
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/** "2h", "3d", "5w" — used in comments, activity and DMs. */
export function timeShort(ts: number): string {
  const d = Date.now() - ts;
  if (d < MIN) return 'now';
  if (d < HOUR) return `${Math.floor(d / MIN)}m`;
  if (d < DAY) return `${Math.floor(d / HOUR)}h`;
  if (d < WEEK) return `${Math.floor(d / DAY)}d`;
  return `${Math.floor(d / WEEK)}w`;
}

/** "2 hours ago", "March 4" — used under feed posts. */
export function timeLong(ts: number): string {
  const d = Date.now() - ts;
  if (d < MIN) return 'Just now';
  const plural = (v: number, unit: string) => `${v} ${unit}${v === 1 ? '' : 's'} ago`;
  if (d < HOUR) return plural(Math.floor(d / MIN), 'minute');
  if (d < DAY) return plural(Math.floor(d / HOUR), 'hour');
  if (d < WEEK) return plural(Math.floor(d / DAY), 'day');
  return new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
