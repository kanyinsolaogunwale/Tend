import { addDays, todayISO } from "./dates";
import type { Task } from "./types";
import { uid } from "./utils";

/** Friendly starter list that exercises every state: due, overdue, upcoming, completed, priority. */
export function sampleTasks(): Task[] {
  const now = Date.now();
  const today = todayISO();
  return [
    {
      id: uid(),
      title: "Skim the pinned brief before Wednesday",
      description: "Note the deliverables and anything that needs a decision from the team.",
      dueDate: today,
      priority: "high",
      completed: false,
      createdAt: now - 3_600_000,
      completedAt: null,
    },
    {
      id: uid(),
      title: "Reply to Alex in the team chat",
      description: "",
      dueDate: addDays(today, -1),
      priority: "high",
      completed: false,
      createdAt: now - 200_000_000,
      completedAt: null,
    },
    {
      id: uid(),
      title: "Plan next week’s priorities",
      description: "Block 30 minutes to triage the board and pick the top three.",
      dueDate: addDays(today, 2),
      priority: "normal",
      completed: false,
      createdAt: now - 180_000_000,
      completedAt: null,
    },
    {
      id: uid(),
      title: "Book the dentist",
      description: "Ask for a morning slot.",
      dueDate: addDays(today, 5),
      priority: "low",
      completed: false,
      createdAt: now - 220_000_000,
      completedAt: null,
    },
    {
      id: uid(),
      title: "Set up the project workspace",
      description: "",
      dueDate: addDays(today, -1),
      priority: "normal",
      completed: true,
      createdAt: now - 90_000_000,
      completedAt: now - 7_200_000,
    },
    {
      id: uid(),
      title: "Water the plants",
      description: "",
      dueDate: null,
      priority: "normal",
      completed: true,
      createdAt: now - 300_000_000,
      completedAt: now - 12_000_000,
    },
  ];
}
