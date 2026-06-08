export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method:      HttpMethod;
  path:        string;
  description: string;
}

export const apiEndpoints: ApiEndpoint[] = [
  { method: 'GET',    path: '/api/health',       description: 'Health check — no auth required' },
  { method: 'GET',    path: '/api/projects',      description: 'List all projects' },
  { method: 'POST',   path: '/api/projects',      description: 'Create a project' },
  { method: 'GET',    path: '/api/tasks',          description: 'List tasks (filter by state, assignee)' },
  { method: 'POST',   path: '/api/tasks',          description: 'Create a task' },
  { method: 'PATCH',  path: '/api/tasks/:id',      description: 'Update task metadata' },
  { method: 'DELETE', path: '/api/tasks/:id',      description: 'Delete a task' },
  { method: 'POST',   path: '/api/tasks/:id/move', description: 'Move task to another state' },
  { method: 'GET',    path: '/api/members',        description: 'List organization members' },
  { method: 'POST',   path: '/api/webhooks',       description: 'Register outbound webhook' },
];

export const webhookPayloadExample = `{
  "event":     "task.completed",
  "timestamp": "2026-06-15T14:30:00Z",
  "task_id":   42,
  "duration":  12400
}`;

export const apiBaseUrl = 'http://localhost:8090';
