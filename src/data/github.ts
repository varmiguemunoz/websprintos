export const githubContent = {
  title:       'Deep GitHub Integration',
  description: "SprintOS isn't just a silo — it reflects your actual dev workflow. When you push, your board moves automatically.",
  setupCommand: 'sprintos github setup',
  webhookEvents: [
    { trigger: 'PR opened',           action: 'Task → "In Review"' },
    { trigger: 'PR merged',           action: 'Task → "Done"' },
    { trigger: 'Issue labeled',       action: 'Task priority updated' },
    { trigger: 'PR closed (no merge)', action: 'No change' },
  ],
  branchConvention: 'feat/TSK-42-add-rate-limiting',
  features: [
    {
      icon:   'sync',
      title:  'Two-Way Sync',
      detail: 'Update a task locally and the GitHub Issue updates instantly. Change a label in the browser and SprintOS reflects it.',
    },
    {
      icon:   'alt_route',
      title:  'PR Triggers',
      detail: 'Configure custom workflows that fire on PR opening, review requested, or merge events — moving tasks automatically.',
    },
    {
      icon:   'tag',
      title:  'Branch Convention',
      detail: 'Include the task ID in your PR title or branch name and SprintOS links them automatically. Zero config.',
    },
  ],
};

export const techStack = [
  { name: 'Go 1.22',      accent: 'primary' },
  { name: 'Bubble Tea',   accent: 'primary' },
  { name: 'PostgreSQL',   accent: 'secondary' },
  { name: 'Cobra CLI',    accent: 'secondary' },
  { name: 'mark3labs/mcp-go', accent: 'primary' },
  { name: 'systray',      accent: 'secondary' },
  { name: 'GORM',         accent: 'primary' },
  { name: 'maroto v2',    accent: 'secondary' },
];
