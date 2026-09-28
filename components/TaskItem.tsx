"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { formatDueLabel } from "@/lib/dates";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  task: Task;
  today: string;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  exiting?: boolean;
};

const PRIORITY_META = {
  high: { label: "High priority", dot: "bg-red-500", chip: "bg-red-50 text-red-700 ring-red-200" },
  normal: { label: "Normal priority", dot: "bg-violet-500", chip: "bg-violet-50 text-violet-700 ring-violet-200" },
  low: { label: "Low priority", dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700 ring-sky-200" },
} as const;

export function TaskItem({ task, today, onToggle, onEdit, onDelete, exiting }: Props) {
  const overdue = !task.completed && task.dueDate !== null && task.dueDate < today;
  const dueToday = !task.completed && task.dueDate === today;
  const priority = PRIORITY_META[task.priority];

  return (
    <li
      className={cn(
        "task-enter group relative flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow",
        task.completed && "bg-zinc-50/80",
        exiting && "task-exit",
      )}
    >
      {/* Priority accent rail */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-2.5 left-0 w-1 rounded-full transition-opacity",
          task.completed ? "bg-emerald-400 opacity-60" : priority.dot,
          !task.completed && "opacity-70 group-hover:opacity-100",
        )}
      />

      {/* Complete toggle */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark “${task.title}” as not done` : `Mark “${task.title}” as done`}
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 active:scale-90",
          task.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-zinc-300 bg-transparent text-transparent hover:border-emerald-400 hover:bg-emerald-50",
        )}
      >
        {task.completed && <Check className="animate-pop size-3.5" strokeWidth={3} aria-hidden />}
      </button>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "break-words text-[0.95rem] font-medium leading-snug text-zinc-900 transition-colors",
            task.completed && "text-zinc-400 line-through decoration-zinc-300",
          )}
        >
          {task.title}
        </p>
        {task.description !== "" && (
          <p
            className={cn(
              "mt-1 break-words text-sm leading-snug text-zinc-500",
              task.completed && "text-zinc-400",
            )}
          >
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.dueDate !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                overdue
                  ? "bg-red-50 text-red-700 ring-red-200"
                  : dueToday
                    ? "bg-amber-50 text-amber-700 ring-amber-200"
                    : "bg-zinc-50 text-zinc-600 ring-zinc-200",
              )}
            >
              {overdue ? "Overdue · " : ""}
              {formatDueLabel(task.dueDate, today)}
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
              task.completed && "opacity-60",
              priority.chip,
            )}
            title={priority.label}
          >
            <span className={cn("size-1.5 rounded-full", task.completed ? "bg-zinc-400" : priority.dot)} aria-hidden />
            {priority.label}
          </span>
        </div>
      </div>

      {/* Actions — always visible on touch, on hover on desktop */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="icon-btn hover:bg-indigo-50 hover:text-indigo-600"
          aria-label={`Edit “${task.title}”`}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="icon-btn hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete “${task.title}”`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
