"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { IdentityPicker } from "./IdentityPicker";
import { PersonAvatar } from "./PersonAvatar";
import { useIdentity } from "@/lib/identity";
import { useTimeOff } from "@/lib/timeoff-client";
import { todayISO } from "@/lib/dates";
import type { TimeOff } from "@/lib/types";

export function AddTimeOffModal({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  /** Pass an existing entry to edit it instead of creating a new one. */
  editing?: TimeOff | null;
}) {
  const { employee, setIdentity } = useIdentity();
  const { addTimeOff, updateTimeOff } = useTimeOff();

  const isEdit = Boolean(editing);

  // New entries always re-confirm who they're for, even if someone's
  // already identified on this device — cheap insurance against adding
  // time off as whoever last used a shared computer. Edits skip this: the
  // edit button only ever shows on your own entries already.
  const [confirmed, setConfirmed] = useState(isEdit);
  useEffect(() => {
    if (open) setConfirmed(isEdit);
  }, [open, isEdit]);

  const [startDate, setStartDate] = useState(editing?.startDate ?? todayISO());
  const [endDate, setEndDate] = useState(editing?.endDate ?? editing?.startDate ?? todayISO());
  const [note, setNote] = useState(editing?.note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function resetAndClose() {
    setStartDate(todayISO());
    setEndDate(todayISO());
    setNote("");
    setFormError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (endDate < startDate) {
      setFormError("End date can't be before the start date.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      if (isEdit && editing) {
        await updateTimeOff(editing.id, { startDate, endDate, note: note || null });
      } else if (employee) {
        await addTimeOff({ employeeId: employee.id, startDate, endDate, note: note || null });
      }
      resetAndClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isEdit && !confirmed) {
    return (
      <Modal open={open} onClose={resetAndClose} title="Who's this time off for?" widthClass="max-w-lg">
        <div className="space-y-5">
          {employee && (
            <button
              onClick={() => setConfirmed(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-brand-amber/40 bg-brand-amber/10 px-4 py-3 text-left transition hover:bg-brand-amber/20"
            >
              <PersonAvatar employee={employee} />
              <span className="text-sm text-white">
                Continue as <span className="font-semibold">{employee.name}</span>
              </span>
            </button>
          )}
          <div>
            {employee && (
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Or pick someone else
              </div>
            )}
            <IdentityPicker
              onPick={(id) => {
                setIdentity(id);
                setConfirmed(true);
              }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={isEdit ? "Edit time off" : `Add time off — ${employee?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">Start date</span>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) setEndDate(e.target.value);
              }}
              className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-white outline-none focus:border-brand-amber/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-400">End date</span>
            <input
              type="date"
              required
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-white outline-none focus:border-brand-amber/60"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-400">
            Note <span className="text-slate-600">(optional)</span>
          </span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Flying out Friday morning"
            maxLength={280}
            className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-amber/60"
          />
        </label>

        {formError && <p className="text-sm text-status-red">{formError}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-bg-card"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-amber px-4 py-2 text-sm font-semibold text-bg transition hover:bg-amber-400 disabled:opacity-60"
          >
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Add time off"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
