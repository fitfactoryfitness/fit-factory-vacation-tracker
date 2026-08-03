"use client";

import { PersonAvatar } from "./PersonAvatar";
import { TEAM_LABELS, TEAM_ORDER, employeesByTeam } from "@/lib/employees";

export function IdentityPicker({
  onPick,
}: {
  onPick: (employeeId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        Pick your name. We&apos;ll remember it on this device so you don&apos;t have to do this again.
      </p>
      {TEAM_ORDER.map((team) => (
        <div key={team}>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            {TEAM_LABELS[team]}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {employeesByTeam(team).map((employee) => (
              <button
                key={employee.id}
                onClick={() => onPick(employee.id)}
                className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5 text-left text-sm text-white transition hover:border-brand-amber/50 hover:bg-bg-cardHover"
              >
                <PersonAvatar employee={employee} size="sm" />
                {employee.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
