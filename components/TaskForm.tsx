"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import type { Priority, TaskInput } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  mode: "create" | "edit";
  initial?: TaskInput;
  submitLabel: string;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const PRIORITIES: Array<{ value: Priority; label: string; dot: string; ring: string }> = [
  { value: "low", label: "Low", dot: "bg-sky-500", ring: "peer-checked:border-sky-400 peer-checked:bg-sky-50" },
  { value: "normal", label: "Normal", dot: "bg-violet-500", ring: "peer-checked:border-violet-400 peer-checked:bg-violet-50" },
  { value: "high", label: "High", dot: "bg-red-500", ring: "peer-checked:border-red-400 peer-checked:bg-red-50" },
];

export function TaskForm({ mode, initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "normal");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => titleRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, []);

  const canSubmit = title.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title,
      description,
      dueDate: dueDate === "" ? null : dueDate,
      priority,
    });
    if (mode === "create") {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("normal");
      titleRef.current?.focus();
    }
  }

  return (
    <form
      onSubmit={submit}
      className="animate-scale-in rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900">
          {mode === "create" ? "New task" : "Edit task"}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="icon-btn hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Close form"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
          }}
          placeholder="What needs doing?"
          aria-label="Task title"
          className="field !py-2.5 !text-base font-medium"
          maxLength={140}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          aria-label="Task description (optional)"
          rows={2}
          className="field resize-none"
          maxLength={500}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 transition-colors focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
            <CalendarDays className="size-4 shrink-0 text-zinc-400" aria-hidden />
            <input
              type="date"
              value={dueDate}
              min="2000-01-01"
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              className="w-full min-w-0 bg-transparent text-zinc-800 outline-none"
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

          <div
            role="radiogroup"
            aria-label="Priority"
            className="grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1"
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
                    "flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40",
                    p.ring,
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", p.dot)} aria-hidden />
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn btn-secondary px-4 py-2">
            Cancel
          </button>
          <button type="submit" disabled={!canSubmit} className="btn btn-primary px-4 py-2 disabled:pointer-events-none disabled:opacity-40">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
