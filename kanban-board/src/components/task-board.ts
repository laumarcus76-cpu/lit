import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { MOCK_TASKS } from '../mock-data.js';
import type { Task, Status } from '../types.js';
import './task-column.js';

@customElement('task-board')
export class TaskBoard extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state() private tasks: Task[] = MOCK_TASKS;

  private tasksFor(status: Status) {
    return this.tasks.filter(t => t.status === status);
  }

  render() {
    return html`
      <div class="min-h-screen bg-base-100 p-6">
        <header class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">Kanban Board</h1>
          <button class="btn btn-primary">+ Add Task</button>
        </header>

        <div class="grid grid-cols-3 gap-4">
          <task-column status="todo"        .tasks=${this.tasksFor('todo')}></task-column>
          <task-column status="in-progress" .tasks=${this.tasksFor('in-progress')}></task-column>
          <task-column status="done"        .tasks=${this.tasksFor('done')}></task-column>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'task-board': TaskBoard;
  }
}
