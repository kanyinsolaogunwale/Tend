# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.

## Project

**Tend** — a minimalist, responsive to-do list web app.

- **Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS v4
- **Icons:** [lucide-react](https://lucide.dev) only — the single icon source. Never mix in other icon sets or raw inline SVGs for UI icons.
- **Persistence:** browser `localStorage` (no backend, no database). All task state lives client-side.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:3000)
npm run build      # production build — run before declaring any change "done"
npm run lint       # ESLint
npx tsc --noEmit   # typecheck
```

## Architecture

```
app/
  layout.tsx        # root layout, fonts, metadata, viewport
  page.tsx          # renders <TodoApp/>
  globals.css       # Tailwind v4 theme tokens, keyframes, shared .btn/.field classes
components/
  TodoApp.tsx       # client root: state wiring, composer, views, confirmation flow
  TaskForm.tsx      # create/edit form (title, optional description, due date, priority)
  TaskItem.tsx      # one task row: toggle, meta chips, edit/delete actions
  FilterTabs.tsx    # Today / Upcoming / Completed / All Tasks tabs with counts
  ConfirmDialog.tsx # ask-before-delete modal (single + clear-completed)
lib/
  types.ts          # Task, TaskInput, Priority, Filter
  useTasks.ts       # the single owner of task state; hydrates + persists to localStorage
  storage.ts        # localStorage read/write with schema sanitizing
  tasks.ts          # filter predicates + display-order sorting
  dates.ts          # timezone-safe local-date helpers ("YYYY-MM-DD" everywhere)
  sample.ts         # one-time sample tasks for first-run visitors
```

## Conventions & rules

- **Date handling:** due dates are local calendar strings (`YYYY-MM-DD`). Always use helpers in `lib/dates.ts`; never construct dates from strings via `new Date(str)` (UTC parsing causes off-by-one days).
- **State:** all mutations flow through the `useTasks` hook (`addTask`, `updateTask`, `toggleTask`, `deleteTask`, `clearCompleted`). Components stay presentational where possible.
- **Deletions are always confirmed** via `ConfirmDialog`. Do not add unguarded delete paths.
- **Task visibility rules:**
  - *Today* = open tasks due today or overdue; *Upcoming* = open tasks due after today; *Completed* = any finished task; *All Tasks* = everything.
  - `sortTasks` in `lib/tasks.ts` defines display order — keep sort changes there, not in components.
- **Styling:** Tailwind utility classes; shared primitives (`.btn`, `.field`, `.icon-btn`) live in `globals.css`. Accent tokens (`--accent`, etc.) are defined there — use them instead of hard-coding brand colors.
- **Responsiveness:** the layout must work from ~320px phones to desktop. Test narrow widths before shipping UI changes.
- **Accessibility:** icon-only buttons need `aria-label`s; the confirm dialog is `role="alertdialog"` and Escape cancels; the checkbox toggle is `role="checkbox"` with `aria-checked`.
- **No new dependencies** without a strong reason; icons in particular come only from `lucide-react`.

## Definition of done

`npm run build` passes (typecheck + lint + production compile), and the change is visually verified at mobile and desktop widths.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
