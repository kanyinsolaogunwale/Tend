"use client";

import { useEffect, useRef } from "react";
import { Trash2, TriangleAlert } from "lucide-react";

export type ConfirmState = {
  kind: "one" | "all";
  taskTitle?: string;
};

type Props = {
  confirm: ConfirmState;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Ask-before-delete modal. Escape and backdrop click both cancel. */
export function ConfirmDialog({ confirm, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    cancelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const single = confirm.kind === "one";

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-zinc-950/40 p-4 backdrop-blur-[2px]"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            {single ? <Trash2 className="size-5" aria-hidden /> : <TriangleAlert className="size-5" aria-hidden />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-title" className="text-base font-semibold text-zinc-900">
              {single ? "Delete this task?" : "Clear completed tasks?"}
            </h2>
            <p id="confirm-desc" className="mt-1 text-sm leading-relaxed text-zinc-500">
              {single ? (
                <>
                  “<span className="font-medium text-zinc-700">{confirm.taskTitle}</span>” will be permanently
                  removed.
                </>
              ) : (
                "Completed tasks will be permanently removed."
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className="btn btn-secondary px-4 py-2">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn btn-danger px-4 py-2">
            {single ? "Delete" : "Clear"}
          </button>
        </div>
      </div>
    </div>
  );
}
