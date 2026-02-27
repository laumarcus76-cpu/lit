import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Task, Priority } from '../types.js';

const priorityClass: Record<Priority, string> = {
  low: 'badge-success',
  medium: 'badge-warning',
  high: 'badge-error',
};

const priorityLabel: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

@customElement('task-card')
export class TaskCard extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @property({ type: Object }) task!: Task;

  private _onMove() {
    this.dispatchEvent(new CustomEvent('task-move', {
      detail: { taskId: this.task.id },
      bubbles: true,
      composed: true,
    }));
  }

  private _onDelete() {
    this.dispatchEvent(new CustomEvent('task-delete', {
      detail: { taskId: this.task.id },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-4 gap-2">
          <h3 class="card-title text-sm">${this.task.title}</h3>
          <p class="text-xs text-base-content/60">${this.task.description}</p>
          <div class="card-actions justify-between items-center mt-2">
            <span class="badge badge-sm ${priorityClass[this.task.priority]}">
              ${priorityLabel[this.task.priority]}
            </span>
            <div class="flex gap-1">
              <button
                class="btn btn-xs btn-ghost"
                @click=${this._onDelete}
              >Delete</button>
              <button
                class="btn btn-xs btn-primary"
                ?disabled=${this.task.status === 'done'}
                @click=${this._onMove}
              >Move →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'task-card': TaskCard;
  }
}
