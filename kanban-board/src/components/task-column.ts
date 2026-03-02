import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { Task, Status } from '../types.js';
import './task-card.js';

const statusLabel: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

const statusColor: Record<Status, string> = {
  'todo': 'badge-neutral',
  'in-progress': 'badge-warning',
  'done': 'badge-success',
};

@customElement('task-column')
export class TaskColumn extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @property() status!: Status;
  @property({ type: Array }) tasks: Task[] = [];

  private _onAddTask() {
    this.dispatchEvent(new CustomEvent('open-add-modal', {
      detail: { status: this.status },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="bg-base-200 rounded-box p-4 flex flex-col gap-3 min-h-64">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/70">
            ${statusLabel[this.status]}
          </h2>
          <span class="badge badge-sm ${statusColor[this.status]}">${this.tasks.length}</span>
        </div>

        <div class="flex flex-col gap-2 flex-1">
          ${repeat(
            this.tasks,
            t => t.id,
            t => html`<task-card .task=${t}></task-card>`
          )}
        </div>

        <button class="btn btn-ghost btn-sm w-full border-dashed border-base-300" @click=${this._onAddTask}>
          + Add Task
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'task-column': TaskColumn;
  }
}
