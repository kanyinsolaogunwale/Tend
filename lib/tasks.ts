import { nowHHMM, todayISO } from "./dates";
import type { Filter, Task } from "./types";

/**
 * Which tasks belong in each view.
 * - Today: due today or overdue, still open.
 * - Upcoming: due after today, still open.
 * - Completed: finished, any date.
 */
export function matchesFilter(
  filter: Filter,
  today: string,
): (task: Task) => boolean {
  switch (filter) {
    case "today":
      return (t) => !t.completed && t.dueDate !== null && t.dueDate <= today;
    case "upcoming":
      return (t) => !t.completed && t.dueDate !== null && t.dueDate > today;
    case "completed":
      return (t) => t.completed;
    case "all":
      return () => true;
  }
}

/** A task is overdue once its date has passed, or its time today has passed. */
export function isTaskOverdue(task: Task, today: string = todayISO()): boolean {
  if (task.completed || task.dueDate === null) return false;
  if (task.dueDate < today) return true;
  if (task.dueDate === today && task.dueTime !== null) {
    return task.dueTime < nowHHMM();
  }
  return false;
}

const PRIORITY_RANK = { high: 0, normal: 1, low: 2 } as const;
const NO_TIME = "99:99"; // sorts after every valid "HH:MM"

/** Stable, human-logical display order for any filtered list. */
export function sortTasks(list: Task[]): Task[] {
  const today = todayISODate();
  return [...list].sort((a, b) => {
    // Finished work always sinks to the bottom (matters in "All Tasks").
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.completed && b.completed) {
      return (b.completedAt ?? b.createdAt) - (a.completedAt ?? a.createdAt);
    }
    // Overdue first…
    const aOver = isTaskOverdue(a, today);
    const bOver = isTaskOverdue(b, today);
    if (aOver !== bOver) return aOver ? -1 : 1;
    // …then earliest due date; undated tasks trail dated ones.
    if (a.dueDate !== b.dueDate) {
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    // Same date: earlier time first; untimed tasks last.
    const at = a.dueTime ?? NO_TIME;
    const bt = b.dueTime ?? NO_TIME;
    if (at !== bt) return at < bt ? -1 : 1;
    // Then higher priority.
    if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    }
    // Newest first within a tie.
    return b.createdAt - a.createdAt;
  });
}

function todayISODate(): string {
  return todayISO();
}
