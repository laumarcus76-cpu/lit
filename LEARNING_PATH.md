# Learning Path: Lit + Tailwind CSS + DaisyUI

## Stack Overview

| Technology | Role |
|---|---|
| **Lit** | Web components (custom elements, reactive properties, templates) |
| **Tailwind CSS v4** | Utility-first styling (layout, spacing, responsive design) |
| **DaisyUI** | Pre-built UI component classes on top of Tailwind |
| **Vite** | Dev server + bundler (no framework opinions) |

---

## Key Concept: Shadow DOM vs. Tailwind

Lit uses **Shadow DOM** by default — this isolates component styles, which means Tailwind's global utility classes won't reach inside your components out of the box.

**Simple fix for learning:** disable Shadow DOM per component:

```ts
protected createRenderRoot() {
  return this; // Tailwind classes now work normally inside this component
}
```

In production there are more sophisticated patterns (CSS custom properties, `adoptedStyleSheets`), but this override lets you focus on learning the actual concepts first.

---

## Lit Template Syntax Cheatsheet

```ts
// Expression binding
html`<p>${this.message}</p>`

// Property binding (not attribute)
html`<input .value=${this.name} />`

// Boolean attribute binding
html`<button ?disabled=${this.isLoading}>Submit</button>`

// Event binding
html`<button @click=${this._handleClick}>Click</button>`

// Conditional rendering
html`${this.show ? html`<p>Visible</p>` : ''}`

// List rendering
html`${this.items.map(item => html`<li>${item}</li>`)}`
```

---

## Week 1 — Tailwind & DaisyUI Foundation

### Days 1–2: Tailwind Fundamentals

**Goal:** Build a static page using only utility classes.

- [ ] Understand the utility-first mental model (no custom CSS, compose classes)
- [ ] Spacing: `p-4`, `m-2`, `gap-3`, `space-y-2`
- [ ] Flexbox: `flex`, `items-center`, `justify-between`, `flex-col`
- [ ] Grid: `grid`, `grid-cols-3`, `col-span-2`
- [ ] Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- [ ] Typography: `text-xl`, `font-bold`, `text-gray-500`, `leading-tight`
- [ ] Colors: `bg-blue-500`, `text-white`, `border-gray-200`

**Project:** Build a static portfolio/dashboard layout — header, sidebar, main content area, footer.

**Resources:**
- [Tailwind Playground](https://play.tailwindcss.com)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

### Days 3–4: DaisyUI Components

**Goal:** Rebuild your Week 1 page using DaisyUI component classes.

- [ ] Install and configure DaisyUI as a Tailwind plugin
- [ ] Navbar: `navbar`, `navbar-start`, `navbar-end`
- [ ] Cards: `card`, `card-body`, `card-title`, `card-actions`
- [ ] Buttons: `btn`, `btn-primary`, `btn-outline`, `btn-sm`
- [ ] Forms: `input`, `textarea`, `select`, `label`, `form-control`
- [ ] Modals: `modal`, `modal-box`, `modal-action`
- [ ] Badges: `badge`, `badge-success`, `badge-warning`
- [ ] Alerts: `alert`, `alert-info`, `alert-error`

**Experiment:** Try 3–4 themes by adding `data-theme="dark"` (or `cupcake`, `cyberpunk`, `retro`) to your `<html>` tag.

---

### Day 5: Customization

- [ ] Extend Tailwind config with custom colors/spacing
- [ ] Create a custom DaisyUI theme via CSS variables
- [ ] Use `@apply` to bundle repeated utility classes into a reusable class

```css
/* Custom DaisyUI theme */
@plugin "daisyui" {
  themes: [{
    mytheme: {
      "primary": "#4f46e5",
      "secondary": "#7c3aed",
      "accent": "#06b6d4",
      "neutral": "#1e1b4b",
      "base-100": "#ffffff",
    }
  }]
}
```

---

## Week 2 — Lit Fundamentals

### Days 1–2: Core Lit

**Goal:** Build 3 simple components.

- [ ] `LitElement`, `html` tagged template, `css` tagged template
- [ ] `@property()` decorator — reactive properties that trigger re-render
- [ ] `@state()` decorator — internal reactive state (not exposed as attribute)
- [ ] Basic rendering lifecycle

```ts
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-counter')
export class MyCounter extends LitElement {
  protected createRenderRoot() { return this; }

  @state() private count = 0;

  render() {
    return html`
      <div class="flex items-center gap-4">
        <button class="btn btn-outline" @click=${() => this.count--}>-</button>
        <span class="text-2xl font-bold">${this.count}</span>
        <button class="btn btn-primary" @click=${() => this.count++}>+</button>
      </div>
    `;
  }
}
```

**Build these 3 components:**
1. `<my-counter>` — increment/decrement with `@state()`
2. `<my-card>` — accepts `title` and `description` as `@property()`
3. `<my-toggle>` — boolean property, dispatches change events

---

### Days 3–4: Reactivity & Events

- [ ] Difference between `@property()` and `@state()`
- [ ] Property vs. attribute: `.value=${x}` (property) vs `value=${x}` (attribute string)
- [ ] Dispatching custom events: `new CustomEvent('my-event', { bubbles: true, composed: true })`
- [ ] Why `composed: true` matters — events cross Shadow DOM boundaries
- [ ] Listening to events from parent components

```ts
// Dispatching
this.dispatchEvent(new CustomEvent('task-complete', {
  detail: { id: this.taskId },
  bubbles: true,
  composed: true
}));

// Listening in parent
html`<my-task @task-complete=${this._onTaskComplete}></my-task>`
```

---

### Day 5: Slots & Composition

- [ ] Default slot: `<slot></slot>`
- [ ] Named slots: `<slot name="header"></slot>`
- [ ] Using slots from outside: `<my-card><span slot="header">Title</span></my-card>`
- [ ] `::slotted()` CSS selector for styling slotted content
- [ ] Building compound components (parent + child components working together)

---

## Week 3 — Combining All Three

**Project: Task Board (Kanban)**

Build a mini Kanban board that wires all three technologies together.

### Components to Build

| Component | Key Concepts |
|---|---|
| `<task-card>` | `@property()`, DaisyUI card + badge, custom events |
| `<task-column>` | Slots, `@state()` for task list, DaisyUI styling |
| `<task-board>` | Orchestration, shared state, event handling across Shadow DOM |
| `<add-task-modal>` | DaisyUI modal, form handling, event dispatch |

### Task Data Shape

```ts
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
}
```

### Priority Badge Colors

```ts
const priorityClass = {
  low: 'badge-success',
  medium: 'badge-warning',
  high: 'badge-error',
};
```

---

## Week 4 — Advanced Patterns

### Lit Directives

```ts
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { cache } from 'lit/directives/cache.js';

// repeat — efficient list rendering with keyed updates
html`${repeat(this.tasks, t => t.id, t => html`<task-card .task=${t}></task-card>`)}`

// when — conditional rendering
html`${when(this.isLoading, () => html`<span class="loading loading-spinner"></span>`)}`

// classMap — dynamic class toggling
html`<div class=${classMap({ 'opacity-50': this.disabled, 'btn-primary': this.active })}></div>`
```

### Lit Context (Shared State)

Use `@lit/context` to share state across deeply nested components without prop-drilling.

```ts
// Define context
import { createContext } from '@lit/context';
export const boardContext = createContext<BoardState>('board');

// Provide in parent
import { provide } from '@lit/context';
@provide({ context: boardContext })
boardState: BoardState = { tasks: [] };

// Consume in child
import { consume } from '@lit/context';
@consume({ context: boardContext })
board!: BoardState;
```

### Production Setup

- [ ] Vite build optimization (`npm run build`)
- [ ] Testing: `@web/test-runner` + `@open-wc/testing`
- [ ] Linting: ESLint with Lit plugin
- [ ] TypeScript strict mode

---

## Project Setup (Reference)

```bash
npm create vite@latest my-lit-app -- --template lit-ts
cd my-lit-app
npm install
npm install -D tailwindcss @tailwindcss/vite daisyui
```

**`vite.config.ts`:**
```ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

**`src/index.css`:**
```css
@import "tailwindcss";
@plugin "daisyui";
```

**`index.html`:**
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/src/index.css" />
    <title>Lit App</title>
  </head>
  <body>
    <task-board></task-board>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

---

## Quick Reference

### DaisyUI Theme Switcher
```html
<html data-theme="dark">     <!-- dark -->
<html data-theme="cupcake">  <!-- pastel -->
<html data-theme="cyberpunk"> <!-- neon -->
<html data-theme="retro">    <!-- vintage -->
```

### Common DaisyUI + Tailwind Patterns
```html
<!-- Loading spinner -->
<span class="loading loading-spinner loading-md"></span>

<!-- Card with action -->
<div class="card bg-base-100 shadow-md">
  <div class="card-body">
    <h2 class="card-title">Title</h2>
    <p>Content</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>

<!-- Modal trigger + modal -->
<button class="btn" onclick="my_modal.showModal()">Open</button>
<dialog id="my_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Title</h3>
    <div class="modal-action">
      <form method="dialog"><button class="btn">Close</button></form>
    </div>
  </div>
</dialog>
```
