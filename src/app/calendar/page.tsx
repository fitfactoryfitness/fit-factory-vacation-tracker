"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useTimeOff } from "@/lib/timeoff-client";
import { useEmployees } from "@/lib/employees-client";
import { daysInMonthArray, monthLabel, todayISO } from "@/lib/dates";
import { TEAM_LABELS, TEAM_ORDER, employeesByTeam } from "@/lib/employees";
import { TEAM_STYLES } from "@/lib/colors";
import type { Team, TimeOff } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";

const CELL = "w-7 sm:w-8";

export default function CalendarPage() {
  const { entries, loading: timeOffLoading } = useTimeOff();
  const { employees, loading: employeesLoading } = useEmployees();
  const loading = timeOffLoading || employeesLoading;
  const today = todayISO();
  const now = new Date();

  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [activeTeams, setActiveTeams] = useState<Set<Team>>(new Set(TEAM_ORDER));

  const days = useMemo(() => daysInMonthArray(cursor.year, cursor.month), [cursor]);

  const entriesByEmployee = useMemo(() => {
    const map = new Map<string, TimeOff[]>();
    for (const e of entries) {
      map.set(e.employeeId, [...(map.get(e.employeeId) ?? []), e]);
    }
    return map;
  }, [entries]);

  function toggleTeam(team: Team) {
    setActiveTeams((prev) => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  }

  function shiftMonth(delta: number) {
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <p className="mt-1 text-sm text-slate-400">
            Everyone&apos;s time off, at a glance. Hover a bar for details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-lg border border-bg-border bg-bg-card p-2 text-slate-300 transition hover:text-white"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="w-36 text-center text-sm font-medium text-white">
            {monthLabel(cursor.year, cursor.month)}
          </span>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-lg border border-bg-border bg-bg-card p-2 text-slate-300 transition hover:text-white"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}
            className="rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TEAM_ORDER.map((team) => {
          const on = activeTeams.has(team);
          const s = TEAM_STYLES[team];
          return (
            <button
              key={team}
              onClick={() => toggleTeam(team)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                on ? clsx(s.bg, s.border, s.text) : "border-bg-border text-slate-500 hover:text-slate-300"
              )}
            >
              <span className={clsx("h-1.5 w-1.5 rounded-full", on ? s.dot : "bg-slate-600")} />
              {TEAM_LABELS[team]}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-bg-border bg-bg-panel">
          <div className="inline-block min-w-full">
            {/* Day header */}
            <div className="flex border-b border-bg-border">
              <div className="sticky left-0 z-10 w-36 shrink-0 bg-bg-panel sm:w-44" />
              {days.map((d) => (
                <div
                  key={d.iso}
                  className={clsx(
                    CELL,
                    "shrink-0 border-l border-bg-border py-1.5 text-center",
                    d.isWeekend && "bg-slate-500/15",
                    d.iso === today && "bg-brand-amber/10"
                  )}
                >
                  <div className={clsx("text-[10px]", d.isWeekend ? "text-slate-600" : "text-slate-500")}>
                    {d.weekdayLabel}
                  </div>
                  <div
                    className={clsx(
                      "text-xs font-medium",
                      d.iso === today
                        ? "text-brand-amber"
                        : d.isWeekend
                          ? "text-slate-500"
                          : "text-slate-300"
                    )}
                  >
                    {d.day}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows grouped by team */}
            {TEAM_ORDER.filter((t) => activeTeams.has(t)).map((team) => (
              <div key={team}>
                <div className="sticky left-0 z-10 border-b border-bg-border bg-bg-card/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {TEAM_LABELS[team]}
                </div>
                {employeesByTeam(employees, team).map((employee) => {
                  const myEntries = entriesByEmployee.get(employee.id) ?? [];
                  return (
                    <div key={employee.id} className="flex border-b border-bg-border last:border-b-0">
                      <div className="sticky left-0 z-10 flex w-36 shrink-0 items-center gap-2 bg-bg-panel px-3 py-2 sm:w-44">
                        <PersonAvatar employee={employee} size="sm" />
                        <span className="truncate text-sm text-white">{employee.name}</span>
                      </div>
                      {days.map((d) => {
                        const entry = myEntries.find((e) => e.startDate <= d.iso && d.iso <= e.endDate);
                        const isStart = entry ? entry.startDate === d.iso : false;
                        const isEnd = entry ? entry.endDate === d.iso : false;
                        const s = TEAM_STYLES[team];
                        return (
                          <div
                            key={d.iso}
                            title={
                              entry
                                ? `${employee.name}: ${entry.startDate} – ${entry.endDate}${entry.note ? ` · ${entry.note}` : ""}`
                                : undefined
                            }
                            className={clsx(
                              CELL,
                              "shrink-0 border-l border-bg-border py-2.5",
                              d.isWeekend && !entry && "bg-slate-500/15",
                              d.iso === today && "bg-brand-amber/5"
                            )}
                          >
                            {entry && (
                              <div
                                className={clsx(
                                  "h-2.5",
                                  s.bar,
                                  isStart && "ml-1 rounded-l-full",
                                  isEnd && "mr-1 rounded-r-full"
                                )}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
