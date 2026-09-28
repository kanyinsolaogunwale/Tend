"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock, X } from "lucide-react";
import type { Priority, TaskInput } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  mode: "create" | "edit";
  initial?: TaskInput;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const PRIORITIES: Array<{ value: Priority; label: string; dot: string; ring: string }> = [
  { value: "low", label: "Low", dot: "bg-sky-500", ring: "peer-checked:border-sky-400 peer-checked:bg-sky-50" },
  { value: "normal", label: "Normal", dot: "bg-violet-500", ring: "peer-checked:border-violet-400 peer-checked:bg-violet-50" },
  { value: "high", label: "High", dot: "bg-red-500", ring: "peer-checked:border-red-400 peer-checked:bg-red-50" },
];

/**
 * Create/edit form presented as a modal:
 * bottom sheet on phones, centered dialog on larger screens.
 */
export function TaskForm({ mode, initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "normal");
  const titleRef = useRef<HTMLInputElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  useEffect(() => {
    const id = window.setTimeout(() => titleRef.current?.focus(), 60);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelRef.current();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const canSubmit = title.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title,
      description,
      dueDate: dueDate === "" ? null : dueDate,
      dueTime: dueTime === "" ? null : dueTime,
      priority,
    });
    if (mode === "create") {
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setPriority("normal");
    }
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/40 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet-up max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-6 shadow-xl sm:animate-scale-in sm:max-w-lg sm:rounded-3xl sm:p-8"
      >
        {/* Drag handle (mobile sheet affordance) */}
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-200 sm:hidden" aria-hidden />

        <div className="flex items-center justify-between">
          <h2 id="task-form-title" className="text-lg font-semibold text-zinc-900">
            {mode === "create" ? "Add New Task" : "Edit Task"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="icon-btn hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-4">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            aria-label="Task title"
            className="field h-11 !text-base font-medium"
            maxLength={140}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            aria-label="Task description (optional)"
            rows={3}
            className="field resize-none"
            maxLength={500}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="relative flex h-11 min-w-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-600 transition-colors focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
              <CalendarDays className="size-4 shrink-0 text-zinc-400" aria-hidden />
              <input
                type="date"
                value={dueDate}
                min="2000-01-01"
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
                className="h-full w-full min-w-0 bg-transparent text-zinc-800 outline-none"
              />
              {dueDate !== "" && (
                <button
                  type="button"
                  onClick={() => setDueDate("")}
                  className="shrink-0 text-zinc-400 transition-colors hover:text-zinc-600"
                  aria-label="Clear due date"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              )}
            </label>

            <label className="relative flex h-11 min-w-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-600 transition-colors focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
              <Clock className="size-4 shrink-0 text-zinc-400" aria-hidden />
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                aria-label="Due time"
                className="h-full w-full min-w-0 bg-transparent text-zinc-800 outline-none"
              />
              {dueTime !== "" && (
                <button
                  type="button"
                  onClick={() => setDueTime("")}
                  className="shrink-0 text-zinc-400 transition-colors hover:text-zinc-600"
                  aria-label="Clear due time"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              )}
            </label>
          </div>

          <div
            role="radiogroup"
            aria-label="Priority"
            className="grid h-11 grid-cols-3 gap-1 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1"
          >
            {PRIORITIES.map((p) => (
              <label key={p.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p.value}
                  checked={priority === p.value}
                  onChange={() => setPriority(p.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-full items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium text-zinc-500 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40",
                    p.ring,
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", p.dot)} aria-hidden />
                  {p.label}
                </span>
              </label>
            ))}
          </div>

          {/* Full-width action buttons, matching the delete modal */}
          <div className="mt-2 grid gap-2">
            <button type="button" onClick={onCancel} className="btn btn-secondary h-11 w-full">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary h-11 w-full disabled:pointer-events-none disabled:opacity-40"
            >
              {mode === "create" ? "Add Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
