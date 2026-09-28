"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, ChevronDown, ChevronUp, ListChecks, Plus, Sun, Trash2 } from "lucide-react";
import { ConfirmDialog, type ConfirmState } from "@/components/ConfirmDialog";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { todayISO } from "@/lib/dates";
import { matchesFilter, sortTasks } from "@/lib/tasks";
import type { Filter, Task, TaskInput } from "@/lib/types";
import { useTasks } from "@/lib/useTasks";

const EMPTY_COPY: Record<Filter, { icon: typeof ListChecks; title: string; hint: string }> = {
  all: { icon: ListChecks, title: "No tasks yet", hint: "Tap the add button to create your first task." },
  today: { icon: Sun, title: "Nothing due today", hint: "Enjoy the clear runway." },
  upcoming: { icon: CalendarClock, title: "No upcoming tasks", hint: "Tasks with a future due date will land here." },
  completed: { icon: CheckCircle2, title: "Nothing completed yet", hint: "Check off a task and it will show up here." },
};

const VIEW_NAME: Record<Filter, string> = {
  all: "All Tasks",
  today: "Today",
  upcoming: "Upcoming",
  completed: "Completed",
};

/** How many tasks render before the "Show more" indicator appears. */
const PAGE_SIZE = 8;

export function TodoApp() {
  const {
    tasks,
    hydrated,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    deleteManyTasks,
  } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [expanded, setExpanded] = useState(false);

  const today = todayISO();

  const counts = useMemo<Record<Filter, number>>(
    () => ({
      today: tasks.filter(matchesFilter("today", today)).length,
      upcoming: tasks.filter(matchesFilter("upcoming", today)).length,
      completed: tasks.filter(matchesFilter("completed", today)).length,
      all: tasks.length,
    }),
    [tasks, today],
  );

  const visible = useMemo(
    () => sortTasks(tasks.filter(matchesFilter(filter, today))),
    [tasks, filter, today],
  );

  /** Tasks a page-level delete would remove (the whole view, shown or not). */
  const pageTaskIds = useMemo(() => visible.map((t) => t.id), [visible]);
  const pageCount = pageTaskIds.length;

  const shown = expanded ? visible : visible.slice(0, PAGE_SIZE);
  const hiddenCount = visible.length - shown.length;

  const editingTask = editingId ? tasks.find((t) => t.id === editingId) ?? null : null;

  function handleAdd(input: TaskInput) {
    addTask(input);
    setComposerOpen(false);
  }

  function handleUpdate(input: TaskInput) {
    if (editingId) updateTask(editingId, input);
    setEditingId(null);
  }

  function handleDeleteRequest(task: Task) {
    setConfirm({ kind: "one", taskTitle: task.title });
    setExitingId(task.id);
  }

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.kind === "one") {
      if (exitingId) deleteTask(exitingId);
    } else {
      deleteManyTasks(pageTaskIds);
    }
    setConfirm(null);
    setExitingId(null);
    setEditingId(null);
  }

  function handleCancelConfirm() {
    setConfirm(null);
    setExitingId(null);
  }

  function changeFilter(next: Filter) {
    setFilter(next);
    setExpanded(false);
  }

  const empty = EMPTY_COPY[filter];
  const EmptyIcon = empty.icon;
  const showSkeleton = !hydrated;

  /** Label for the page-aware clear action. */
  const clearLabel =
    filter === "completed"
      ? `Clear ${pageCount} completed`
      : filter === "all"
        ? `Delete all ${pageCount} tasks`
        : `Delete ${pageCount} ${pageCount === 1 ? "task" : "tasks"} in ${VIEW_NAME[filter]}`;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      {/* Header: logo + name only */}
      <header className="animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-accent text-white shadow-sm shadow-accent/30">
            <ListChecks className="size-6" aria-hidden />
          </span>
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-zinc-900">Tend</h1>
        </div>

        {/* Views: directly under the logo and name */}
        <div className="mt-5">
          <FilterTabs filter={filter} onChange={changeFilter} counts={counts} />
        </div>
      </header>

      <main className="mt-6 grid gap-3.5">
        {showSkeleton ? (
          <div className="grid gap-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-zinc-200/70 bg-white" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="animate-fade-in rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-14 text-center">
            <EmptyIcon className="mx-auto size-10 text-zinc-300" strokeWidth={1.75} aria-hidden />
            <p className="mt-4 text-sm font-medium text-zinc-700">{empty.title}</p>
            <p className="mt-1.5 text-sm text-zinc-400">{empty.hint}</p>
          </div>
        ) : (
          <>
            <ul className="grid gap-3">
              {shown.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  today={today}
                  onToggle={toggleTask}
                  onEdit={(t) => {
                    setComposerOpen(false);
                    setEditingId(t.id);
                  }}
                  onDelete={handleDeleteRequest}
                  exiting={exitingId === task.id}
                />
              ))}
            </ul>

            {/* More-content indicator */}
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="btn btn-secondary mx-auto mt-2 h-11 px-5 text-xs"
              >
                <ChevronDown className="size-3.5" aria-hidden />
                Show {hiddenCount} more {hiddenCount === 1 ? "task" : "tasks"}
                <span className="text-zinc-400">
                  · showing {shown.length} of {visible.length}
                </span>
              </button>
            )}
            {expanded && visible.length > PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="btn btn-ghost mx-auto mt-1 h-11 px-4 text-xs"
              >
                <ChevronUp className="size-3.5" aria-hidden />
                Show less
              </button>
            )}
          </>
        )}

        {/* Page-aware delete action */}
        {!showSkeleton && pageCount > 0 && (
          <button
            type="button"
            onClick={() => setConfirm({ kind: "page", filter, count: pageCount })}
            className="btn btn-ghost mx-auto mt-2 h-11 px-4 text-xs"
          >
            <Trash2 className="size-3.5" aria-hidden />
            {clearLabel}
          </button>
        )}
      </main>

      {/* Add button: rests right after the content, floats while scrolling, never covers the last task */}
      <div className="sticky bottom-4 z-30 mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setComposerOpen(true);
          }}
          className="btn btn-primary h-14 rounded-full px-6 shadow-lg shadow-accent/30"
          aria-label="Add new task"
        >
          <Plus className="size-5" aria-hidden />
          <span className="text-sm">Add New Task</span>
        </button>
      </div>

      {composerOpen && (
        <TaskForm
          mode="create"
          onSubmit={handleAdd}
          onCancel={() => setComposerOpen(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          mode="edit"
          initial={{
            title: editingTask.title,
            description: editingTask.description,
            dueDate: editingTask.dueDate,
            dueTime: editingTask.dueTime,
            priority: editingTask.priority,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog confirm={confirm} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      )}
    </div>
  );
}
