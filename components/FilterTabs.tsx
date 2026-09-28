"use client";

import { CalendarClock, CheckCircle2, ListTodo, Sun } from "lucide-react";
import type { Filter } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  filter: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
};

const TABS: Array<{ id: Filter; label: string; icon: typeof Sun }> = [
  { id: "today", label: "Today", icon: Sun },
  { id: "upcoming", label: "Upcoming", icon: CalendarClock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
  { id: "all", label: "All Tasks", icon: ListTodo },
];

export function FilterTabs({ filter, onChange, counts }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Task views"
      className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto p-1"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = filter === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              active
                ? "bg-accent text-white shadow-sm"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
            <span
              className={cn(
                "min-w-5 rounded-full px-1.5 py-0.5 text-[0.68rem] font-semibold leading-4",
                active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500",
              )}
            >
              {counts[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
