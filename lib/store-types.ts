/** Shared action payload types for the task store. */
import type { Priority, Task, TaskInput } from "./types";

/** Fields that can be updated on an existing task. */
export type TaskPatch = {
  title?: string;
  description?: string;
  dueDate?: string | null;
  priority?: Priority;
  completed?: boolean;
  completedAt?: number | null;
};

export type { Task, TaskInput };
