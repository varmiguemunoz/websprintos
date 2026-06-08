export interface MCPTool {
  name:        string;
  description: string;
}

export const mcpTools: MCPTool[] = [
  { name: 'list_projects',      description: 'List all projects in the organization' },
  { name: 'list_tasks',         description: 'List all tasks with IDs, states, and assignees' },
  { name: 'create_task',        description: 'Create a task with title, state, priority, and due date' },
  { name: 'move_task',          description: 'Move a task to a different board state' },
  { name: 'assign_task',        description: 'Assign or unassign a team member' },
  { name: 'generate_sprint',    description: 'Create multiple tasks from a structured list or PRD' },
  { name: 'summarize_project',  description: 'Project health: counts, overdue tasks, workload' },
  { name: 'analyze_stale_tasks',description: 'Find tasks stuck in a state with suggested actions' },
];

export const mcpPrompts = [
  { icon: 'forum',       query: '"Generate a sprint from this PRD"',     detail: 'Paste any PRD and the AI creates tasks, subtasks, and a structured sprint.' },
  { icon: 'query_stats', query: '"Which tasks are stale for 5+ days?"',  detail: 'AI scans the board and surfaces blocked or forgotten work items.' },
  { icon: 'auto_fix',    query: '"Optimize velocity for this sprint"',   detail: 'Analyzes bottlenecks and suggests workload rebalancing across the team.' },
];

export const mcpCompatible = ['Claude Desktop', 'Cursor', 'Windsurf', 'Zed'];

export const mcpSetupCommand = 'sprintos mcp';
