"use client";

import { useEffect, useRef } from "react";
import { CalendarClock, CheckCircle2, ListTodo, Sun } from "lucide-react";
import type { Filter } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  filter: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
};

/** Display order: All Tasks first, then Today, Upcoming, Completed. */
const TABS: Array<{ id: Filter; label: string; icon: typeof Sun }> = [
  { id: "all", label: "All Tasks", icon: ListTodo },
  { id: "today", label: "Today", icon: Sun },
  { id: "upcoming", label: "Upcoming", icon: CalendarClock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

export function FilterTabs({ filter, onChange, counts }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Keep the selected pill fully in view (it must never be cut off).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const selected = wrap.querySelector('[role="tab"][aria-selected="true"]');
    if (selected) {
      selected.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [filter]);

  return (
    // Full bleed: the strip overflows the content column on both sides.
    <div
      ref={wrapRef}
      role="tablist"
      aria-label="Task views"
      className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6"
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
              "flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
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
