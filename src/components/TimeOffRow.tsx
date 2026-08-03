"use client";

import { useState } from "react";
import { PersonAvatar } from "./PersonAvatar";
import { TeamBadge } from "./TeamBadge";
import { AddTimeOffModal } from "./AddTimeOffModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { useIdentity } from "@/lib/identity";
import { useTimeOff } from "@/lib/timeoff-client";
import { formatRange } from "@/lib/dates";
import type { TimeOffWithEmployee } from "@/lib/timeoff-selectors";

export function TimeOffRow({
  entry,
  showTeam = true,
}: {
  entry: TimeOffWithEmployee;
  showTeam?: boolean;
}) {
  const { employee: me } = useIdentity();
  const { deleteTimeOff } = useTimeOff();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const isMine = me?.id === entry.employeeId;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5">
      <PersonAvatar employee={entry.employee} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-white">{entry.employee.name}</span>
          {showTeam && <TeamBadge team={entry.employee.team} />}
        </div>
        <div className="mt-0.5 truncate text-sm text-slate-400">
          {formatRange(entry.startDate, entry.endDate)}
          {entry.note && <span className="text-slate-500"> · {entry.note}</span>}
        </div>
      </div>

      {isMine && (
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-bg-cardHover hover:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-status-red/10 hover:text-status-red"
          >
            Delete
          </button>
        </div>
      )}

      <AddTimeOffModal open={editing} onClose={() => setEditing(false)} editing={entry} />
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete time off?"
        message={`Remove ${entry.employee.name}'s time off for ${formatRange(entry.startDate, entry.endDate)}? This can't be undone.`}
        onConfirm={async () => {
          await deleteTimeOff(entry.id);
          setConfirming(false);
        }}
      />
    </div>
  );
}
