# Implementation Plan: Task Board (Kanban)

**Stack:** Lit · Tailwind CSS v4 · DaisyUI · Vite · TypeScript

Each ticket is scoped to teach one core concept from the learning path. Build them in order — later tickets depend on earlier ones.

---

## Overview

```
<task-board>                    ← orchestrates everything, holds all state
  <add-task-modal>              ← DaisyUI modal, form, dispatches 'task-added'
  <task-column status="todo">   ← receives tasks[], renders task cards
    <task-card>                 ← displays one task, dispatches events
    <task-card>
  </task-column>
  <task-column status="in-progress">
    ...
  </task-column>
  <task-column status="done">
    ...
  </task-column>
</task-board>
```

---

## Tickets

---

### TICKET-01 — Project Setup ✅ DONE

**Goal:** Get a working dev environment with all three technologies wired together.

**Steps:**
1. Scaffold a Lit + TypeScript project with Vite:
   ```bash
   npm create vite@latest kanban-board -- --template lit-ts
   cd kanban-board && npm install
   ```
2. Install Tailwind CSS v4 and DaisyUI:
   ```bash
   npm install -D tailwindcss @tailwindcss/vite daisyui
   ```
3. Configure `vite.config.ts` to use the Tailwind plugin:
   ```ts
   import { defineConfig } from 'vite';
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({ plugins: [tailwindcss()] });
   ```
4. Create `src/index.css`:
   ```css
   @import "tailwindcss";
   @plugin "daisyui";
   ```
5. Update `index.html` to import `index.css`, set `data-theme="light"`, and mount `<task-board>`.
6. Replace the generated boilerplate in `src/my-element.ts` — delete it, you will create your own components.
7. Create `src/main.ts` that imports your component files.

**Acceptance:** `npm run dev` renders a blank page with no console errors. DaisyUI classes like `btn btn-primary` work on a test element.

**Concepts:** Vite project scaffolding, Tailwind v4 plugin setup, DaisyUI CSS import.

---

### TICKET-02 — Shared Types & Mock Data ✅ DONE

**Goal:** Define the data shape and seed the board with test tasks.

**Create `src/types.ts`:**
```ts
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
}

export type Status = Task['status'];
export type Priority = Task['priority'];
```

**Create `src/mock-data.ts`:**
```ts
import { Task } from './types';

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Set up project', description: 'Init Vite + Lit + Tailwind', priority: 'high', status: 'done' },
  { id: '2', title: 'Build task card', description: 'Create the task-card component', priority: 'high', status: 'in-progress' },
  { id: '3', title: 'Build task column', description: 'Create the task-column component', priority: 'medium', status: 'todo' },
  { id: '4', title: 'Add modal', description: 'Create add-task-modal with a form', priority: 'low', status: 'todo' },
];
```

**Acceptance:** Types are importable from other files. Mock data has tasks across all three statuses.

**Concepts:** TypeScript interfaces, union types, module organization.

---

### TICKET-03 — `<task-card>` Component ✅ DONE

**Goal:** Build a display-only card using `@property()`, DaisyUI card + badge, and custom event dispatch.

**Create `src/components/task-card.ts`:**

Requirements:
- Disable Shadow DOM (`createRenderRoot() { return this; }`)
- Accept a `@property({ type: Object }) task: Task` input
- Render a DaisyUI `card` with:
  - `card-title` showing `task.title`
  - `<p>` showing `task.description`
  - A priority badge using the color map below
  - A "Move →" button in `card-actions`
- Priority badge class map:
  ```ts
  const priorityClass: Record<Priority, string> = {
    low: 'badge-success',
    medium: 'badge-warning',
    high: 'badge-error',
  };
  ```
- The "Move →" button dispatches a `task-move` custom event:
  ```ts
  this.dispatchEvent(new CustomEvent('task-move', {
    detail: { taskId: this.task.id },
    bubbles: true,
    composed: true,
  }));
  ```
- A "Delete" button dispatches a `task-delete` event with `{ taskId: this.task.id }`.

**Acceptance:** `<task-card .task=${mockTask}></task-card>` renders a styled card. Clicking buttons logs events to the console (test with a temporary listener on `document`).

**Concepts:** `@property()`, passing objects as properties (`.task=${}`), DaisyUI card/badge, custom event dispatch with `bubbles: true, composed: true`.

---

### TICKET-04 — `<task-column>` Component ✅ DONE

**Goal:** Build a column that holds and renders a list of task cards, using `@property()` and the `repeat` directive.

**Create `src/components/task-column.ts`:**

Requirements:
- Disable Shadow DOM
- Accept:
  - `@property() status: Status` — the column's status label
  - `@property({ type: Array }) tasks: Task[] = []` — tasks to display
- Render a DaisyUI-styled column container with:
  - A column header showing the `status` label (capitalized) and a task count badge
  - A vertical list of `<task-card>` elements using `repeat` from `lit/directives/repeat.js`
    ```ts
    import { repeat } from 'lit/directives/repeat.js';
    // ...
    repeat(this.tasks, t => t.id, t => html`<task-card .task=${t}></task-card>`)
    ```
  - An "Add Task" button at the bottom that dispatches an `open-add-modal` event with `{ status: this.status }`

**Acceptance:** Renders all tasks passed to it. `repeat` is used (not `.map()`). Task count in header updates reactively.

**Concepts:** `@property({ type: Array })`, passing arrays as properties, `repeat` directive for keyed list rendering.

---

### TICKET-05 — `<task-board>` Component (Basic) ✅ DONE

**Goal:** Build the top-level orchestrator that holds all state and passes tasks down to columns.

**Create `src/components/task-board.ts`:**

Requirements:
- Disable Shadow DOM
- `@state() private tasks: Task[] = MOCK_TASKS` — single source of truth
- Derived getter that filters tasks by status:
  ```ts
  private tasksFor(status: Status) {
    return this.tasks.filter(t => t.status === status);
  }
  ```
- Render a 3-column grid layout using Tailwind: `grid grid-cols-3 gap-4`
- Render one `<task-column>` per status: `'todo'`, `'in-progress'`, `'done'`
- Pass filtered tasks down: `.tasks=${this.tasksFor('todo')}`
- A page header with the board title and a global "Add Task" button

**Acceptance:** Board renders 3 columns with correct tasks in each. Changing `MOCK_TASKS` is reflected immediately on the page.

**Concepts:** `@state()`, derived data (filtering), passing arrays as properties, Tailwind grid layout.

---

### TICKET-06 — `<add-task-modal>` Component

**Goal:** Build a DaisyUI modal with a form that collects new task data and dispatches it.

**Create `src/components/add-task-modal.ts`:**

Requirements:
- Disable Shadow DOM
- Use a `<dialog>` element with DaisyUI `modal` classes (not `display:none` toggling)
- Expose a `open()` method using `@query`:
  ```ts
  @query('dialog') private dialog!: HTMLDialogElement;
  open() { this.dialog.showModal(); }
  ```
- Accept `@property() defaultStatus: Status = 'todo'` so the column's "Add Task" button pre-sets the status
- Form fields (all required):
  - `title` — text input
  - `description` — textarea
  - `priority` — select with options: `low`, `medium`, `high`
  - `status` — select pre-set to `defaultStatus`
- On submit:
  - Prevent default form submission
  - Read form values
  - Generate `id` with `crypto.randomUUID()`
  - Dispatch `task-added` event:
    ```ts
    this.dispatchEvent(new CustomEvent('task-added', {
      detail: { task: newTask },
      bubbles: true,
      composed: true,
    }));
    ```
  - Close the dialog and reset the form
- Cancel/close button closes the dialog without dispatching

**Acceptance:** Modal opens, form can be filled out, submission dispatches `task-added` with correct data, modal closes after submit.

**Concepts:** `@query` decorator, `HTMLDialogElement.showModal()`, form handling in Lit, `crypto.randomUUID()`.

---

### TICKET-07 — Event Wiring: Move, Delete, Add

**Goal:** Connect child component events to state mutations in `<task-board>`.

**Update `src/components/task-board.ts`:**

Requirements:

**Handle `task-move`** — cycle task to next status:
```ts
private _onTaskMove(e: CustomEvent<{ taskId: string }>) {
  const order: Status[] = ['todo', 'in-progress', 'done'];
  this.tasks = this.tasks.map(t => {
    if (t.id !== e.detail.taskId) return t;
    const next = order[order.indexOf(t.status) + 1];
    return next ? { ...t, status: next } : t; // no-op if already 'done'
  });
}
```

**Handle `task-delete`:**
```ts
private _onTaskDelete(e: CustomEvent<{ taskId: string }>) {
  this.tasks = this.tasks.filter(t => t.id !== e.detail.taskId);
}
```

**Handle `task-added`:**
```ts
private _onTaskAdded(e: CustomEvent<{ task: Task }>) {
  this.tasks = [...this.tasks, e.detail.task];
}
```

**Handle `open-add-modal`** from column's "Add Task" button:
```ts
private _onOpenModal(e: CustomEvent<{ status: Status }>) {
  this.modal.defaultStatus = e.status;
  this.modal.open();
}
```

Wire listeners on the board's root element and add a `@query('add-task-modal')` ref for the modal.

**Acceptance:** Moving a task updates its column in real time. Deleting removes it. Adding a new task appears in the correct column immediately.

**Concepts:** Event bubbling across components, immutable state updates (`map`, `filter`, spread), `@state()` triggering re-renders.

---

### TICKET-08 — Advanced Directives

**Goal:** Upgrade the implementation to use Lit directives for cleaner, more efficient rendering.

**Requirements:**

1. **`classMap`** in `<task-card>` — apply conditional classes to the card based on priority:
   ```ts
   import { classMap } from 'lit/directives/class-map.js';
   // e.g. add a left border color based on priority
   html`<div class=${classMap({
     'card': true,
     'border-l-4': true,
     'border-error': this.task.priority === 'high',
     'border-warning': this.task.priority === 'medium',
     'border-success': this.task.priority === 'low',
   })}>`
   ```

2. **`when`** in `<task-column>` — show an empty state message when no tasks:
   ```ts
   import { when } from 'lit/directives/when.js';
   // ...
   when(
     this.tasks.length === 0,
     () => html`<p class="text-base-content/40 text-sm text-center py-8">No tasks yet</p>`,
     () => html`${repeat(...)}`
   )
   ```

3. **`styleMap`** (optional stretch) — dynamically style the column header background.

**Acceptance:** `classMap` and `when` are used. No regressions from TICKET-07.

**Concepts:** `classMap`, `when`, `styleMap` directives.

---

### TICKET-09 — Polish & Theme

**Goal:** Final UI polish and theme switching.

**Requirements:**

1. Add a theme switcher in the board header (dropdown or toggle):
   - Toggles `data-theme` on `<html>` between `light` and `dark`
   - Use DaisyUI `swap` component or a simple `select`

2. Add a loading spinner (`class="loading loading-spinner"`) during any async operation (prep for future persistence).

3. Make the board layout responsive:
   - Mobile: single column (`grid-cols-1`)
   - Tablet: 2 columns (`md:grid-cols-2`)
   - Desktop: 3 columns (`lg:grid-cols-3`)

4. Add a task count summary in the board header (e.g. "3 todo · 1 in progress · 2 done").

**Acceptance:** Board looks good on mobile and desktop. Theme switcher works. Column count adapts to screen width.

**Concepts:** Responsive Tailwind breakpoints, DaisyUI theme switching via `data-theme`, dynamic class attributes.

---

### TICKET-10 — (Stretch) Lit Context for Shared State

**Goal:** Refactor state management to use `@lit/context` instead of prop-drilling.

**Install:**
```bash
npm install @lit/context
```

**Requirements:**

1. Create `src/board-context.ts`:
   ```ts
   import { createContext } from '@lit/context';
   import { Task } from './types';
   export interface BoardState { tasks: Task[]; }
   export const boardContext = createContext<BoardState>('board');
   ```

2. In `<task-board>`, provide the context:
   ```ts
   import { provide } from '@lit/context';
   @provide({ context: boardContext })
   boardState: BoardState = { tasks: MOCK_TASKS };
   ```

3. In `<task-column>` and `<task-card>`, consume the context instead of receiving props.

**Acceptance:** Removing `.tasks` property bindings from `<task-column>` still renders correctly. Context updates propagate reactively.

**Concepts:** `@lit/context`, `@provide`, `@consume`, avoiding prop-drilling in web component trees.

---

## Build Order Summary

| # | Ticket | Key Concept |
|---|--------|-------------|
| 01 | ~~Project Setup~~ ✅ | Vite + Lit + Tailwind + DaisyUI |
| 02 | ~~Types & Mock Data~~ ✅ | TypeScript interfaces, module structure |
| 03 | ~~`<task-card>`~~ ✅ | `@property()`, DaisyUI card, event dispatch |
| 04 | ~~`<task-column>`~~ ✅ | `@property({ type: Array })`, `repeat` directive |
| 05 | ~~`<task-board>` (basic)~~ ✅ | `@state()`, derived data, Tailwind grid |
| 06 | `<add-task-modal>` | `@query`, `HTMLDialogElement`, form handling |
| 07 | Event Wiring | Event bubbling, immutable state updates |
| 08 | Advanced Directives | `classMap`, `when`, `styleMap` |
| 09 | Polish & Theme | Responsive design, DaisyUI themes |
| 10 | Lit Context (stretch) | `@lit/context`, shared state pattern |

---

## File Structure (End State)

```
kanban-board/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.ts                    # imports all components
│   ├── index.css                  # @import tailwindcss + daisyui plugin
│   ├── types.ts                   # Task, Status, Priority
│   ├── mock-data.ts               # MOCK_TASKS seed data
│   └── components/
│       ├── task-card.ts           # TICKET-03
│       ├── task-column.ts         # TICKET-04
│       ├── task-board.ts          # TICKET-05, updated in TICKET-07
│       └── add-task-modal.ts      # TICKET-06
```
