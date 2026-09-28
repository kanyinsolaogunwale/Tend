import type { Task } from "./types";

const STORAGE_KEY = "tend.tasks.v1";
const WELCOME_KEY = "tend.welcomed.v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Coerce unknown parsed JSON into a valid Task, or null. */
function sanitizeTask(raw: unknown): Task | null {
  if (!isRecord(raw)) return null;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : crypto.randomUUID(),
    title,
    description: typeof raw.description === "string" ? raw.description : "",
    dueDate:
      typeof raw.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.dueDate)
        ? raw.dueDate
        : null,
    priority: raw.priority === "high" || raw.priority === "low" ? raw.priority : "normal",
    completed: raw.completed === true,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    completedAt: typeof raw.completedAt === "number" ? raw.completedAt : null,
  };
}

/** Load tasks from localStorage. Returns null when nothing valid is stored. */
export function loadTasks(): Task[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(sanitizeTask).filter((t): t is Task => t !== null);
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage can be unavailable (private mode / quota) — the app still works in-memory.
  }
}

export function hasSeenWelcome(): boolean {
  try {
    return window.localStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomed(): void {
  try {
    window.localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    // ignore
  }
}
