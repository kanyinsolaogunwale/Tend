export type Priority = "low" | "normal" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  /** Local calendar date, "YYYY-MM-DD". Null = no due date. */
  dueDate: string | null;
  /** Local time of day, "HH:MM" (24h). Null = no specific time. */
  dueTime: string | null;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
};

/** Payload used when creating or editing a task. */
export type TaskInput = {
  title: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
  priority: Priority;
};

export type Filter = "all" | "today" | "upcoming" | "completed";
