export interface CLISnippet {
  comment: string;
  command: string;
}

export const cliCommands: CLISnippet[] = [
  {
    comment: '# Launch the interactive TUI',
    command: 'sprintos start',
  },
  {
    comment: '# Create a task with priority',
    command: 'sprintos task create "Fix memory leak" --priority high --state backlog',
  },
  {
    comment: '# Create a sprint',
    command: 'sprintos sprint create --name "Sprint 4" --start 2026-06-15 --end 2026-06-28',
  },
  {
    comment: '# Export PDF executive report',
    command: 'sprintos export --format pdf --last-sprint',
  },
  {
    comment: '# Move task to another state',
    command: 'sprintos task move 42 "In Review"',
  },
  {
    comment: '# Generate daily standup',
    command: 'sprintos standup',
  },
];

export interface ShortcutGroup {
  title:  string;
  accent: 'primary' | 'secondary';
  rows:   { key: string; action: string }[];
}

export const documentationShortcuts: ShortcutGroup[] = [
  {
    title:  'Global',
    accent: 'primary',
    rows: [
      { key: '?',       action: 'Help overlay' },
      { key: 'Ctrl+G', action: 'Switch project' },
      { key: '/',       action: 'Global search' },
      { key: 'q',       action: 'Quit / back' },
      { key: 'Esc',     action: 'Close / back' },
    ],
  },
  {
    title:  'Kanban Board',
    accent: 'secondary',
    rows: [
      { key: 'h / l',   action: 'Switch columns' },
      { key: 'j / k',   action: 'Navigate tasks' },
      { key: 'n',       action: 'New task' },
      { key: 'm',       action: 'Move task state' },
      { key: 'T',       action: 'Start/stop timer' },
      { key: 'E',       action: 'Export PDF report' },
    ],
  },
];
