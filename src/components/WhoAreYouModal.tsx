"use client";

import { Modal } from "./Modal";
import { IdentityPicker } from "./IdentityPicker";
import { useIdentity } from "@/lib/identity";

export function WhoAreYouModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setIdentity } = useIdentity();

  return (
    <Modal open={open} onClose={onClose} title="Who are you?" widthClass="max-w-lg">
      <IdentityPicker
        onPick={(id) => {
          setIdentity(id);
          onClose();
        }}
      />
    </Modal>
  );
}
