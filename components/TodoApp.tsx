"use client";

import { useMemo, useState } from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog, type ConfirmState } from "@/components/ConfirmDialog";
import { FilterTabs } from "@/components/FilterTabs";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { todayISO } from "@/lib/dates";
import { matchesFilter, sortTasks } from "@/lib/tasks";
import type { Filter, Task, TaskInput } from "@/lib/types";
import { useTasks } from "@/lib/useTasks";

const EMPTY_COPY: Record<Filter, { title: string; hint: string }> = {
  today: { title: "Nothing due today", hint: "Enjoy the clear runway — or add something below." },
  upcoming: { title: "No upcoming tasks", hint: "Tasks with a future due date will land here." },
  completed: { title: "Nothing completed yet", hint: "Check off a task and it will show up here." },
  all: { title: "No tasks yet", hint: "Add your first task below to get started." },
};

export function TodoApp() {
  const { tasks, hydrated, addTask, updateTask, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [filter, setFilter] = useState<Filter>("today");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

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

  const editingTask = editingId ? tasks.find((t) => t.id === editingId) ?? null : null;

  function handleAdd(input: TaskInput) {
    addTask(input);
    setComposerOpen(false);
  }

  function handleUpdate(input: TaskInput) {
    if (editingId) updateTask(editingId, input);
    setEditingId(null);
  }

  /** Animate out, then actually remove. */
  function handleDeleteRequest(task: Task) {
    setConfirm({ kind: "one", taskTitle: task.title });
    setExitingId(task.id);
  }

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.kind === "one") {
      if (exitingId) deleteTask(exitingId);
    } else {
      clearCompleted();
    }
    setConfirm(null);
    setExitingId(null);
    setEditingId(null);
  }

  function handleCancelConfirm() {
    setConfirm(null);
    setExitingId(null);
  }

  const empty = EMPTY_COPY[filter];
  const showSkeleton = !hydrated;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      <header className="animate-fade-in">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-white shadow-sm shadow-accent/30">
            <ListChecks className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Tend</h1>
            <p className="text-xs text-zinc-500">
              {counts.today > 0
                ? `${counts.today} task${counts.today === 1 ? "" : "s"} need${counts.today === 1 ? "s" : ""} your attention today`
                : "Your day is clear — nice."}
            </p>
          </div>
        </div>
      </header>

      <main className="mt-6 grid gap-4">
        {/* Composer */}
        {composerOpen ? (
          <TaskForm
            mode="create"
            submitLabel="Add task"
            onSubmit={handleAdd}
            onCancel={() => setComposerOpen(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setComposerOpen(true);
            }}
            className="btn btn-secondary animate-fade-in w-full justify-start gap-2 px-4 py-3 text-zinc-500 hover:border-accent/30 hover:text-zinc-700"
          >
            <Plus className="size-4 text-accent" aria-hidden />
            Add a task
            <span className="ml-auto hidden text-xs text-zinc-400 sm:block">
              description optional
            </span>
          </button>
        )}

        {/* Edit form swaps in for the row being edited */}
        {editingTask && (
          <TaskForm
            mode="edit"
            initial={{
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
              priority: editingTask.priority,
            }}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        )}

        {/* Views */}
        <FilterTabs filter={filter} onChange={setFilter} counts={counts} />

        {showSkeleton ? (
          <div className="grid gap-2.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-zinc-200/70 bg-white" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="animate-fade-in rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center">
            <ListChecks className="mx-auto size-8 text-zinc-300" aria-hidden />
            <p className="mt-3 text-sm font-medium text-zinc-700">{empty.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{empty.hint}</p>
          </div>
        ) : (
          <ul className="grid gap-2.5">
            {visible.map((task) => (
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
        )}

        {/* Footer actions */}
        {!showSkeleton && counts.completed > 0 && (
          <button
            type="button"
            onClick={() => setConfirm({ kind: "all" })}
            className="btn btn-ghost mx-auto mt-1 px-3 py-2 text-xs"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Clear {counts.completed} completed
          </button>
        )}
      </main>

      {confirm && (
        <ConfirmDialog confirm={confirm} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      )}
    </div>
  );
}
