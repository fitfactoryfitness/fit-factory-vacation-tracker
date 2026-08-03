"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-sm">
      <p className="text-sm text-slate-400">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-bg-card"
        >
          Cancel
        </button>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onConfirm();
            setBusy(false);
          }}
          className="rounded-lg bg-status-red/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-status-red disabled:opacity-60"
        >
          {busy ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
