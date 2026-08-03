"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { useEmployees } from "@/lib/employees-client";
import { TEAM_LABELS, TEAM_ORDER } from "@/lib/employees";
import type { Team } from "@/lib/types";

export function AddEmployeeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addEmployee } = useEmployees();
  const [name, setName] = useState("");
  const [team, setTeam] = useState<Team>("coaches");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function resetAndClose() {
    setName("");
    setTeam("coaches");
    setFormError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await addEmployee(name.trim(), team);
      resetAndClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Add team member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-400">Name</span>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan"
            maxLength={60}
            className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-amber/60"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-400">Team</span>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value as Team)}
            className="w-full rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-white outline-none focus:border-brand-amber/60"
          >
            {TEAM_ORDER.map((t) => (
              <option key={t} value={t}>
                {TEAM_LABELS[t]}
              </option>
            ))}
          </select>
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
            {submitting ? "Adding…" : "Add team member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
