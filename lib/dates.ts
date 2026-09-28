/** Format a Date as a local calendar date string, "YYYY-MM-DD". */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today as a local calendar date string, "YYYY-MM-DD". */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Current local time as "HH:MM" (24h). */
export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Parse "YYYY-MM-DD" as a local date (never UTC; avoids off-by-one bugs). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** Add (or subtract) days from a "YYYY-MM-DD" string. */
export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Whole-day difference from `fromISO` to `toISO` (positive = future). */
export function diffInDays(fromISO: string, toISO: string): number {
  const a = parseISODate(fromISO).getTime();
  const b = parseISODate(toISO).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Human label for a due date: "Today", "Tomorrow", "Yesterday", "Mon, Sep 29"… */
export function formatDueLabel(iso: string, today: string = todayISO()): string {
  const delta = diffInDays(today, iso);
  if (delta === 0) return "Today";
  if (delta === 1) return "Tomorrow";
  if (delta === -1) return "Yesterday";
  const d = parseISODate(iso);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  else if (Math.abs(delta) <= 6) opts.weekday = "short";
  return d.toLocaleDateString(undefined, opts);
}

/** Human label for a "HH:MM" time: "9:00 AM", "2:30 PM"… */
export function formatTimeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
