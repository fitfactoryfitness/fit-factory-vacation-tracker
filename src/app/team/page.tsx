"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useTimeOff } from "@/lib/timeoff-client";
import { useEmployees } from "@/lib/employees-client";
import { todayISO } from "@/lib/dates";
import { TEAM_LABELS, TEAM_ORDER } from "@/lib/employees";
import { TEAM_STYLES } from "@/lib/colors";
import { daysUsedInYear, pastBefore, upcomingAfter, withEmployee } from "@/lib/timeoff-selectors";
import type { Employee, Team } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { TimeOffRow } from "@/components/TimeOffRow";
import { AddEmployeeModal } from "@/components/AddEmployeeModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function TeamPage() {
  const { entries, loading: timeOffLoading } = useTimeOff();
  const { employees, loading: employeesLoading, removeEmployee } = useEmployees();
  const loading = timeOffLoading || employeesLoading;
  const today = todayISO();
  const year = new Date().getFullYear();

  const [activeTeam, setActiveTeam] = useState<Team | "all">("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState<Employee | null>(null);
  const [removeBusy, setRemoveBusy] = useState(false);

  const enriched = useMemo(() => withEmployee(entries, employees), [entries, employees]);

  const visibleEmployees = employees.filter(
    (e) =>
      (activeTeam === "all" || e.team === activeTeam) &&
      e.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const removingCount = removing ? entries.filter((e) => e.employeeId === removing.id).length : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Team</h1>
          <p className="mt-1 text-sm text-slate-400">
            Everyone&apos;s upcoming and past time off, grouped by role.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="rounded-lg bg-brand-amber px-3 py-1.5 text-sm font-semibold text-bg transition hover:bg-amber-400"
        >
          + Add team member
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTeam("all")}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition",
              activeTeam === "all"
                ? "border-slate-500 bg-bg-card text-white"
                : "border-bg-border text-slate-500 hover:text-slate-300"
            )}
          >
            All
          </button>
          {TEAM_ORDER.map((team) => {
            const on = activeTeam === team;
            const s = TEAM_STYLES[team];
            return (
              <button
                key={team}
                onClick={() => setActiveTeam(team)}
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

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name…"
          className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-1.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-amber/60 sm:ml-auto sm:w-40"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-3">
          {visibleEmployees.map((employee) => {
            const mine = enriched.filter((e) => e.employeeId === employee.id);
            const upcoming = upcomingAfter(mine, today);
            const active = mine.filter((e) => e.startDate <= today && today <= e.endDate);
            const past = pastBefore(mine, today);
            const daysUsed = daysUsedInYear(entries, employee.id, year);

            return (
              <PersonSection
                key={employee.id}
                employee={employee}
                daysUsed={daysUsed}
                year={year}
                active={active}
                upcoming={upcoming}
                past={past}
                onRemove={() => setRemoving(employee)}
              />
            );
          })}

          {visibleEmployees.length === 0 && (
            <p className="rounded-xl border border-dashed border-bg-border px-4 py-6 text-center text-sm text-slate-500">
              No one matches that search.
            </p>
          )}
        </div>
      )}

      <AddEmployeeModal open={addOpen} onClose={() => setAddOpen(false)} />

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title="Remove team member?"
        confirmLabel={removeBusy ? "Removing…" : "Remove"}
        message={
          removing
            ? `Remove ${removing.name} from the team?${
                removingCount > 0
                  ? ` This will also permanently delete their ${removingCount} time off ${removingCount === 1 ? "entry" : "entries"}.`
                  : ""
              } This can't be undone.`
            : ""
        }
        onConfirm={async () => {
          if (!removing) return;
          setRemoveBusy(true);
          await removeEmployee(removing.id);
          setRemoveBusy(false);
          setRemoving(null);
        }}
      />
    </div>
  );
}

function PersonSection({
  employee,
  daysUsed,
  year,
  active,
  upcoming,
  past,
  onRemove,
}: {
  employee: Employee;
  daysUsed: number;
  year: number;
  active: ReturnType<typeof withEmployee>;
  upcoming: ReturnType<typeof withEmployee>;
  past: ReturnType<typeof withEmployee>;
  onRemove: () => void;
}) {
  const [showPast, setShowPast] = useState(false);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <PersonAvatar employee={employee} />
          <div>
            <div className="text-sm font-medium text-white">{employee.name}</div>
            <TeamBadge team={employee.team} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-300">{daysUsed}</span> weekdays off in {year}
          </div>
          <button
            onClick={onRemove}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-status-red/10 hover:text-status-red"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {[...active, ...upcoming].length === 0 && (
          <p className="py-2 text-sm text-slate-500">Nothing upcoming.</p>
        )}
        {[...active, ...upcoming].map((entry) => (
          <TimeOffRow key={entry.id} entry={entry} showTeam={false} />
        ))}
      </div>

      {past.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowPast((v) => !v)}
            className="text-xs font-medium text-slate-500 hover:text-slate-300"
          >
            {showPast ? "Hide" : `Show ${past.length} past`} time off
          </button>
          {showPast && (
            <div className="mt-1.5 space-y-1.5 opacity-70">
              {past.map((entry) => (
                <TimeOffRow key={entry.id} entry={entry} showTeam={false} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
