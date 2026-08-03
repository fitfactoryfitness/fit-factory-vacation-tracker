"use client";

import { useMemo, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { useTimeOff } from "@/lib/timeoff-client";
import { todayISO } from "@/lib/dates";
import { daysUsedInYear, pastBefore, upcomingAfter, withEmployee } from "@/lib/timeoff-selectors";
import { PersonAvatar } from "@/components/PersonAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { StatCard } from "@/components/StatCard";
import { TimeOffRow } from "@/components/TimeOffRow";
import { AddTimeOffModal } from "@/components/AddTimeOffModal";
import { IdentityPicker } from "@/components/IdentityPicker";

export default function MyTimeOffPage() {
  const { employee, setIdentity, clearIdentity } = useIdentity();
  const { entries, loading } = useTimeOff();
  const today = todayISO();
  const year = new Date().getFullYear();
  const [addOpen, setAddOpen] = useState(false);

  const mine = useMemo(
    () => withEmployee(entries.filter((e) => employee && e.employeeId === employee.id)),
    [entries, employee]
  );
  const active = mine.filter((e) => e.startDate <= today && today <= e.endDate);
  const upcoming = upcomingAfter(mine, today).filter((e) => !active.includes(e));
  const past = pastBefore(mine, today);
  const daysUsed = employee ? daysUsedInYear(entries, employee.id, year) : 0;

  if (!employee) {
    return (
      <div className="max-w-lg space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Time Off</h1>
          <p className="mt-1 text-sm text-slate-400">Pick your name to see and manage your own time off.</p>
        </div>
        <IdentityPicker onPick={setIdentity} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PersonAvatar employee={employee} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-white">{employee.name}</h1>
            <TeamBadge team={employee.team} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-lg bg-brand-amber px-4 py-2 text-sm font-semibold text-bg transition hover:bg-amber-400"
          >
            + Add time off
          </button>
          <button
            onClick={clearIdentity}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:text-slate-300"
          >
            Not you?
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label={`Days off in ${year}`} value={daysUsed} accent="amber" />
        <StatCard label="Away right now" value={active.length > 0 ? "Yes" : "No"} accent={active.length > 0 ? "green" : "neutral"} />
        <StatCard label="Upcoming trips" value={upcoming.length} accent="blue" />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Current &amp; upcoming
            </h2>
            {[...active, ...upcoming].length === 0 ? (
              <p className="rounded-xl border border-dashed border-bg-border px-4 py-6 text-center text-sm text-slate-500">
                Nothing booked. Hit &ldquo;Add time off&rdquo; to plan your next one.
              </p>
            ) : (
              <div className="space-y-2">
                {[...active, ...upcoming].map((entry) => (
                  <TimeOffRow key={entry.id} entry={entry} showTeam={false} />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Past</h2>
              <div className="space-y-2 opacity-70">
                {past.map((entry) => (
                  <TimeOffRow key={entry.id} entry={entry} showTeam={false} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <AddTimeOffModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
