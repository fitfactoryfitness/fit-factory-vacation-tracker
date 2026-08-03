// Date helpers. Dates are handled as plain "YYYY-MM-DD" strings end-to-end
// (form inputs, API payloads, DB columns) and only parsed into local-midnight
// Date objects for display math, so there's no timezone drift between what
// someone picks and what shows on the calendar.

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function isBefore(a: string, b: string): boolean {
  return a < b;
}

export function isSameOrBefore(a: string, b: string): boolean {
  return a <= b;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function daysInclusive(start: string, end: string): number {
  const s = parseISODate(start);
  const e = parseISODate(end);
  return Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatShort(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
}

export function formatRange(start: string, end: string): string {
  if (start === end) return formatShort(start);
  const s = parseISODate(start);
  const e = parseISODate(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${MONTH_LABELS[s.getMonth()]} ${s.getDate()}–${e.getDate()}`;
  }
  return `${formatShort(start)} – ${formatShort(end)}`;
}

export function monthLabel(year: number, month: number): string {
  return `${[
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][month]} ${year}`;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/** Every day in a given month, for the Gantt-style calendar's day columns. */
export function daysInMonthArray(
  year: number,
  month: number
): { iso: string; day: number; weekdayLabel: string; isWeekend: boolean }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const weekday = d.getDay();
    return {
      iso: toISODate(d),
      day: d.getDate(),
      weekdayLabel: WEEKDAY_LABELS[weekday],
      isWeekend: weekday === 0 || weekday === 6,
    };
  });
}
