"use client";

import { useEffect, useRef } from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import type { Filter } from "@/lib/types";

export type ConfirmState =
  | { kind: "one"; taskTitle: string }
  | { kind: "page"; filter: Filter; count: number };

type Props = {
  confirm: ConfirmState;
  onConfirm: () => void;
  onCancel: () => void;
};

function pageCopy(filter: Filter, count: number): { title: string; desc: string } {
  const n = count === 1 ? "1 task" : `${count} tasks`;
  switch (filter) {
    case "all":
      return {
        title: "Delete all tasks?",
        desc: `All ${count === 1 ? "1 task is" : `${count} tasks are`} in All Tasks and will be permanently removed.`,
      };
    case "today":
      return {
        title: `Delete ${n} in Today?`,
        desc: "Everything in Today, including overdue tasks, will be permanently removed.",
      };
    case "upcoming":
      return {
        title: `Delete ${n} in Upcoming?`,
        desc: "Everything in Upcoming will be permanently removed.",
      };
    case "completed":
      return {
        title: `Delete ${n} in Completed?`,
        desc: "All completed tasks will be permanently removed.",
      };
  }
}

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
  const { title, desc } =
    confirm.kind === "one"
      ? { title: "Delete this task?", desc: `“${confirm.taskTitle}” will be permanently removed.` }
      : pageCopy(confirm.filter, confirm.count);

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
        className="animate-scale-in w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl"
      >
        {/* Big centered icon */}
        <div className="flex justify-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600">
            {single ? <Trash2 className="size-7" aria-hidden /> : <TriangleAlert className="size-7" aria-hidden />}
          </span>
        </div>

        <h2 id="confirm-title" className="mt-4 text-lg font-semibold text-zinc-900">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 break-words text-sm leading-relaxed text-zinc-500">
          {desc}
        </p>

        <div className="mt-6 grid gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className="btn btn-secondary h-11 w-full">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn btn-danger h-11 w-full">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
