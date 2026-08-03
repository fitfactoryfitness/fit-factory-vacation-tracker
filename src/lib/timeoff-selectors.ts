import { getEmployee } from "./employees";
import { addDays, daysInclusive, parseISODate, toISODate } from "./dates";
import type { Employee, TimeOff } from "./types";

export type TimeOffWithEmployee = TimeOff & { employee: Employee };

/** Attach the employee record, dropping any orphaned entries (e.g. someone removed from the roster). */
export function withEmployee(entries: TimeOff[]): TimeOffWithEmployee[] {
  return entries.flatMap((entry) => {
    const employee = getEmployee(entry.employeeId);
    return employee ? [{ ...entry, employee }] : [];
  });
}

export function sortByStart<T extends TimeOff>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Entries that cover the given date. */
export function activeOn<T extends TimeOff>(entries: T[], iso: string): T[] {
  return entries.filter((e) => e.startDate <= iso && iso <= e.endDate);
}

/** Entries starting within [fromIso, toIso] (inclusive), not already active on fromIso. */
export function startingWithin<T extends TimeOff>(
  entries: T[],
  fromIso: string,
  toIso: string
): T[] {
  return sortByStart(
    entries.filter((e) => e.startDate > fromIso && e.startDate <= toIso)
  );
}

export function upcomingAfter<T extends TimeOff>(entries: T[], afterIso: string): T[] {
  return sortByStart(entries.filter((e) => e.startDate > afterIso));
}

export function pastBefore<T extends TimeOff>(entries: T[], beforeIso: string): T[] {
  return sortByStart(entries.filter((e) => e.endDate < beforeIso)).reverse();
}

/** Total days off booked for one employee within a given year, clipped to that year's bounds. */
export function daysUsedInYear(entries: TimeOff[], employeeId: string, year: number): number {
  const yearStart = toISODate(new Date(year, 0, 1));
  const yearEnd = toISODate(new Date(year, 11, 31));

  return entries
    .filter((e) => e.employeeId === employeeId && e.startDate <= yearEnd && e.endDate >= yearStart)
    .reduce((total, e) => {
      const clippedStart = e.startDate < yearStart ? yearStart : e.startDate;
      const clippedEnd = e.endDate > yearEnd ? yearEnd : e.endDate;
      return total + daysInclusive(clippedStart, clippedEnd);
    }, 0);
}

export function returnDate(endDateIso: string): string {
  return toISODate(addDays(parseISODate(endDateIso), 1));
}
