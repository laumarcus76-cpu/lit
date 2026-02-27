import type { Task } from './types.js';

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Set up project', description: 'Init Vite + Lit + Tailwind + DaisyUI', priority: 'high', status: 'done' },
  { id: '2', title: 'Build task card', description: 'Create the task-card component with @property() and custom events', priority: 'high', status: 'in-progress' },
  { id: '3', title: 'Build task column', description: 'Create the task-column component using the repeat directive', priority: 'medium', status: 'todo' },
  { id: '4', title: 'Build task board', description: 'Orchestrate columns with @state() as single source of truth', priority: 'medium', status: 'todo' },
  { id: '5', title: 'Add task modal', description: 'Create add-task-modal with a DaisyUI form and event dispatch', priority: 'low', status: 'todo' },
];
