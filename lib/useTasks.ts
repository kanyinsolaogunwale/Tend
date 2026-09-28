"use client";

import { useSyncExternalStore } from "react";
import {
  getServerTasksSnapshot,
  getTasksSnapshot,
  subscribeTasks,
  taskActions,
} from "@/lib/taskStore";
import type { TaskPatch } from "@/lib/store-types";
import type { Task, TaskInput } from "@/lib/types";

/**
 * React binding for the module-level task store.
 * SSR and the first client paint render the skeleton (`hydrated === false`);
 * localStorage hydration happens immediately after, outside of effects.
 */
export function useTasks(): {
  tasks: Task[];
  hydrated: boolean;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, patch: TaskPatch) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
} {
  const snapshot = useSyncExternalStore(
    subscribeTasks,
    getTasksSnapshot,
    getServerTasksSnapshot,
  );

  return {
    tasks: snapshot ?? [],
    hydrated: snapshot !== null,
    addTask: taskActions.add,
    updateTask: taskActions.update,
    toggleTask: taskActions.toggle,
    deleteTask: taskActions.remove,
    clearCompleted: taskActions.clearCompleted,
  };
}
