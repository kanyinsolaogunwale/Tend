import { sampleTasks } from "./sample";
import { hasSeenWelcome, loadTasks, markWelcomed, saveTasks } from "./storage";
import type { Task, TaskInput } from "./types";
import type { TaskPatch } from "./store-types";
import { uid } from "./utils";

type Listener = () => void;

/**
 * Module-level store owning the task list.
 * - `null` means "not hydrated yet" (server snapshot / first client paint → skeleton).
 * - Loaded once per browser session from localStorage, seeding samples on first visit.
 */
let tasks: Task[] | null = null;
const listeners = new Set<Listener>();

const EMPTY: Task[] = [];

function ensureLoaded(): Task[] {
  if (tasks === null) {
    const stored = loadTasks();
    if (stored !== null) {
      tasks = stored;
    } else if (!hasSeenWelcome()) {
      tasks = sampleTasks();
      markWelcomed();
    } else {
      tasks = EMPTY;
    }
    saveTasks(tasks);
  }
  return tasks;
}

function emit(): void {
  for (const listener of listeners) listener();
}

function commit(next: Task[]): void {
  tasks = next;
  saveTasks(next);
  emit();
}

/** Subscribe for useSyncExternalStore. Loads lazily on first subscription. */
export function subscribeTasks(listener: Listener): () => void {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Client snapshot — stable reference between mutations. */
export function getTasksSnapshot(): Task[] {
  return ensureLoaded();
}

/** Server snapshot — null so SSR and first paint render the skeleton. */
export function getServerTasksSnapshot(): Task[] | null {
  return null;
}

export const taskActions = {
  add(input: TaskInput): void {
    const task: Task = {
      id: uid(),
      title: input.title.trim(),
      description: input.description.trim(),
      dueDate: input.dueDate,
      priority: input.priority,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
    };
    commit([task, ...ensureLoaded()]);
  },

  update(id: string, patch: TaskPatch): void {
    commit(ensureLoaded().map((t) => (t.id === id ? { ...t, ...patch } : t)));
  },

  toggle(id: string): void {
    commit(
      ensureLoaded().map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: t.completed ? null : Date.now() }
          : t,
      ),
    );
  },

  remove(id: string): void {
    commit(ensureLoaded().filter((t) => t.id !== id));
  },

  clearCompleted(): void {
    commit(ensureLoaded().filter((t) => !t.completed));
  },
};
