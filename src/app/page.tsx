"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/StatCard";
import { TimeOffRow } from "@/components/TimeOffRow";
import { TeamBadge } from "@/components/TeamBadge";
import { useTimeOff } from "@/lib/timeoff-client";
import { addDays, todayISO, toISODate } from "@/lib/dates";
import { TEAM_ORDER, employeesByTeam } from "@/lib/employees";
import {
  activeOn,
  startingWithin,
  withEmployee,
} from "@/lib/timeoff-selectors";

export default function DashboardPage() {
  const { entries, loading, error } = useTimeOff();
  const today = todayISO();
  const weekEnd = toISODate(addDays(new Date(), 7));

  const enriched = useMemo(() => withEmployee(entries), [entries]);
  const awayToday = useMemo(() => activeOn(enriched, today), [enriched, today]);
  const startingSoon = useMemo(
    () => startingWithin(enriched, today, weekEnd),
    [enriched, today, weekEnd]
  );

  const awayTodayIds = new Set(awayToday.map((e) => e.employeeId));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          A quick look at who&apos;s away right now, and who&apos;s heading out soon.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-status-red/30 bg-status-red/10 px-4 py-3 text-sm text-status-red">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Away today" value={awayToday.length} accent="amber" />
        <StatCard label="Starting within 7 days" value={startingSoon.length} accent="blue" />
        <StatCard
          label="Team size"
          value={13}
          hint="Front Desk, Leads, Coaches"
          accent="neutral"
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Coverage by team, today
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TEAM_ORDER.map((team) => {
            const roster = employeesByTeam(team);
            const away = roster.filter((e) => awayTodayIds.has(e.id));
            const short = away.length > 0;
            return (
              <div
                key={team}
                className="flex items-center justify-between rounded-2xl border border-bg-border bg-bg-panel p-4"
              >
                <TeamBadge team={team} />
                <span className={`text-sm font-medium ${short ? "text-brand-amber" : "text-slate-400"}`}>
                  {away.length} / {roster.length} away
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Away today
        </h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : awayToday.length === 0 ? (
          <p className="rounded-xl border border-dashed border-bg-border px-4 py-6 text-center text-sm text-slate-500">
            Nobody&apos;s away today — full team in.
          </p>
        ) : (
          <div className="space-y-2">
            {awayToday.map((entry) => (
              <TimeOffRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Starting in the next 7 days
        </h2>
        {!loading && startingSoon.length === 0 ? (
          <p className="rounded-xl border border-dashed border-bg-border px-4 py-6 text-center text-sm text-slate-500">
            Nothing coming up this week.
          </p>
        ) : (
          <div className="space-y-2">
            {startingSoon.map((entry) => (
              <TimeOffRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
