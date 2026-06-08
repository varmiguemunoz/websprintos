export interface FeatureCard {
  icon:        string;
  title:       string;
  description: string;
  accent:      'primary' | 'secondary';
}

export const featureCards: FeatureCard[] = [
  {
    icon:  'terminal',
    title: 'Terminal PM',
    description: 'Full project management lifecycle managed entirely through keyboard shortcuts and a GPU-accelerated TUI — no browser, no Electron.',
    accent: 'primary',
  },
  {
    icon:  'sprint',
    title: 'Sprint Planning',
    description: 'Organize backlog, assign story points, and start sprints with a single command. Automated velocity tracking and burndown charts included.',
    accent: 'secondary',
  },
  {
    icon:  'timer',
    title: 'Time Tracking',
    description: 'Native task-level time tracking with live counters. Precision reporting for billing, capacity planning, and personal productivity audits.',
    accent: 'primary',
  },
  {
    icon:  'self_improvement',
    title: 'Pomodoro Pro',
    description: 'Embedded 15/30/45-min focus sessions with OS-level notifications. Auto-restarts on completion with a configurable grace period.',
    accent: 'secondary',
  },
  {
    icon:  'smart_toy',
    title: 'AI & MCP',
    description: 'Model Context Protocol server built-in. Claude, Cursor, and Windsurf can manage your board, generate sprints, and analyze velocity.',
    accent: 'primary',
  },
  {
    icon:  'alt_route',
    title: 'GitHub Sync',
    description: 'Two-way integration. Opening a PR moves the task to "In Review." Merging moves it to "Done." Zero manual state management.',
    accent: 'secondary',
  },
];

export interface MatrixGroup {
  category: string;
  accent:   'primary' | 'secondary';
  items:    string[];
}

export const featureMatrix: MatrixGroup[] = [
  {
    category: 'Project Management',
    accent:   'primary',
    items: [
      'Kanban Board (Interactive TUI)',
      'Multi-Project Contexts',
      'Milestone & Subtask Tracking',
      'Custom Workflow Templates',
      'PDF Executive Reports',
      'Sprint Velocity Analytics',
    ],
  },
  {
    category: 'Productivity',
    accent:   'secondary',
    items: [
      'Active Task Bar (macOS Menu Bar)',
      'Pomodoro Focus Sessions',
      'Keyboard-Only Navigation',
      'Global Fuzzy Search',
      'Standup Auto-Generator',
      'Stale Task Detection',
    ],
  },
  {
    category: 'AI & Platform',
    accent:   'primary',
    items: [
      'MCP Server (Claude / Cursor / Windsurf)',
      'AI Sprint Generation from PRD',
      'Self-Hosting via Docker / Binary',
      'PostgreSQL + Supabase / Neon',
      'Full REST API + OpenAPI Docs',
      'Zapier / Make Webhook Support',
    ],
  },
];
