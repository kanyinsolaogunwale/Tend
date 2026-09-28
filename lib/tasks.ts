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

const PRIORITY_RANK = { high: 0, normal: 1, low: 2 } as const;

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
    const aOver = a.dueDate !== null && a.dueDate < today;
    const bOver = b.dueDate !== null && b.dueDate < today;
    if (aOver !== bOver) return aOver ? -1 : 1;
    // …then earliest due date; undated tasks trail dated ones.
    if (a.dueDate !== b.dueDate) {
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    // Then higher priority.
    if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    }
    // Newest first within a tie.
    return b.createdAt - a.createdAt;
  });
}

function todayISODate(): string {
  return localISO(new Date());
}

function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
