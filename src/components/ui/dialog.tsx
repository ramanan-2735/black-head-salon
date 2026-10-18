"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Modal built on the native <dialog>, which gives focus trapping, Escape to close
 * and an inert background. A click on the backdrop also closes it.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[min(92vw,36rem)] rounded-[2px] border border-line bg-ink-900 p-0 text-bone-100 backdrop:bg-ink-950/80"
    >
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <h2 id={titleId} className="font-display text-3xl font-light">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
