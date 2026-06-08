---
title: 'How to Use Claude to Manage Your Sprint with SprintOS MCP'
description: 'A practical guide to connecting Claude Desktop or Cursor to your SprintOS board and letting your AI agent create tasks, generate sprints from PRDs, and run your daily standup — all through natural language.'
pubDate: 2026-06-08
image: 'https://res.cloudinary.com/dy7kvvzgj/image/upload/v1753346476/becs06b6vgw2hnpio6rv_tboj6y.webp'
readtime: '9 min read'
category: 'ai-tools'
tags: ['claude', 'mcp', 'model context protocol', 'AI agents', 'sprint planning', 'cursor', 'developer productivity']
authors: ['varmiguemunoz']
draft: false
---

Most AI integrations in project management tools are bolted on. You get a chatbot that summarizes a Jira ticket and calls it "AI-powered." You don't get an agent that can read your board state, create a sprint from a PRD, assign tasks to your team, and then tell you which items are stale — all without you switching context.

SprintOS ships a native Model Context Protocol (MCP) server. That means Claude, Cursor, and Windsurf don't just have *access* to your board — they can *act* on it with full read/write permissions through a standardized protocol that your AI tool already understands.

This is a practical guide to setting it up and actually using it.

---

## What is MCP, and Why Does It Matter Here?

MCP (Model Context Protocol) is an open standard created by Anthropic that lets AI assistants connect to external tools in a structured way. Instead of copy-pasting data into a chat window, your AI agent can call real functions against real data — and SprintOS exposes every one of its core features as an MCP tool.

The difference between SprintOS's MCP and the community-built MCP servers for Linear or Jira:

- **SprintOS MCP is built into the binary.** No separate install, no extra config, no version lag.
- **Full read/write access.** Most community MCP servers are read-only. SprintOS's MCP can create tasks, move them, assign team members, and generate entire sprints.
- **Auto-configuration.** The TUI setup wizard detects your AI tool and writes the config file for you.

---

## Step 1: Start the MCP Server

First, make sure SprintOS is installed and configured with a project. Then run:

```bash
sprintos mcp
```

The server starts on `stdio` by default — which is exactly what Claude Desktop and Cursor expect. You'll see output like:

```
SprintOS MCP server started
Listening for connections...
Active project: TaoFlow (ID: 1)
```

Keep this running in a terminal tab while you work.

---

## Step 2: Connect Your AI Tool

### Claude Desktop

The TUI setup wizard handles this automatically. From inside SprintOS:

1. Press `s` on the Projects list to open Organization Settings
2. Press `m` to open MCP setup
3. Select **Claude Desktop**
4. SprintOS writes the config to `~/Library/Application Support/Claude/claude_desktop_config.json`

Or write it manually:

```json
{
  "mcpServers": {
    "sprintos": {
      "command": "sprintos",
      "args": ["mcp"]
    }
  }
}
```

Fully quit Claude Desktop and relaunch it. SprintOS will appear under your connected tools (the hammer icon in the bottom-left of the chat input).

### Cursor

Same wizard flow — select **Cursor**. SprintOS writes to `~/.cursor/mcp.json`:

```json
{
  "sprintos": {
    "command": "sprintos",
    "args": ["mcp"]
  }
}
```

Restart Cursor. SprintOS appears under MCP Tools in the sidebar.

### Windsurf / Zed

Same pattern. The wizard writes the correct config format for each tool.

---

## Step 3: Your First Prompt

Once connected, try the simplest possible test — just ask Claude what's on your board:

> **"What projects do I have in SprintOS?"**

Claude calls `list_projects` and returns something like:

```
You have 2 active projects:
- TaoFlow (ID: 1) — 3 open sprints, 24 tasks
- SprintOS Website (ID: 2) — 1 open sprint, 11 tasks
```

Now you know the integration works. Let's do something useful.

---

## Use Case 1: Generate a Sprint from a PRD

This is the one that genuinely saves hours.

Copy your product requirements doc (or even rough bullet points) and paste it into Claude:

> **"Generate a sprint for the TaoFlow project based on this PRD: [paste PRD]"**

Claude calls `list_states` to understand your board columns, then calls `generate_sprint` with a structured list of tasks. In seconds you get:

```
Created 8 tasks in the TaoFlow Backlog:

1. [high] Set up authentication middleware
2. [high] Implement JWT token refresh
3. [medium] Add rate limiting to /api/auth routes
4. [medium] Write unit tests for auth module
5. [medium] Set up email verification flow
6. [low] Update API documentation
7. [low] Add error logging for auth failures
8. [low] Create integration tests
```

Want to adjust? Tell Claude: *"Move the integration tests to a separate sprint and set the auth middleware to critical priority."* It calls `update_task` and `move_task` for each one.

---

## Use Case 2: Daily Standup in Seconds

At the start of each day, ask Claude:

> **"Summarize what we completed yesterday and what's blocked in project 1"**

Claude calls `list_tasks` with date filters, `list_overdue_tasks`, and `get_task_detail` for anything flagged. It returns a standup-ready summary:

```
Yesterday (completed):
✓ Set up CI pipeline (#4) — Miguel, 2h 15m
✓ Database migrations (#6) — completed, unassigned

Today (in progress):
→ Fix login bug (#12) — Miguel, started 2 days ago [stale]
→ Add rate limiting (#15) — unassigned [at risk]

Blocked:
⚠ Deploy v2.4 (#9) — waiting on code review from #12
```

Takes under 3 seconds. No tab switching, no context loss.

---

## Use Case 3: Find What's Stale

Stale tasks are invisible in most PM tools — they sit in "In Progress" columns while everyone assumes someone else is handling them.

> **"Which tasks in project 1 have been in the same state for more than 5 days?"**

Claude calls `analyze_stale_tasks` and returns each stuck task with its state, days idle, and a suggested action:

```
5 tasks stale for 5+ days:

• Fix memory leak in logger (In Progress, 8 days)
  Suggestion: Check if this is blocked on an external dependency. Consider moving to Backlog if not actively worked.

• Update API documentation (In Review, 6 days)
  Suggestion: Ping the reviewer. Consider self-merging if no feedback in 24h.
```

One prompt, complete picture of what's slipping.

---

## Use Case 4: Assign Tasks by Name

Natural-language assignment works exactly as you'd expect:

> **"Assign all the auth-related tasks in the backlog to Miguel"**

Claude calls `list_members` to get team IDs, filters tasks by title/tag, then calls `assign_task` for each match. Confirmed in seconds.

---

## Use Case 5: Sprint Velocity Check

> **"What's the velocity trend for TaoFlow over the last 3 sprints?"**

Claude uses `summarize_project` and the sprint history to compare completed task counts and hours logged across sprints. Useful before sprint planning to set a realistic scope.

---

## What the MCP Server Can't Do (Yet)

To be direct about the limits:

- **No natural-language task search** — you need to reference tasks by ID or title, not semantic meaning
- **No calendar integration** — due dates are managed manually
- **No Slack/Discord notifications** — the agent can't push updates to your channels directly (though it can tell you which webhook to fire)
- **No file attachments** — tasks are text-only

These are on the roadmap.

---

## Tips for Getting the Most Out of It

**Be specific about project IDs.** If you have multiple projects, include the project name or ID in every prompt. Claude uses `list_projects` automatically if you're vague, but being explicit is faster.

**Chain prompts.** Claude keeps context across turns. Start with *"List the overdue tasks in project 1"*, then follow up with *"Assign each of them to the team member with the lightest current load"*.

**Use it during code reviews.** From inside Cursor, when you merge a PR that's linked to a task (e.g., branch `feat/TSK-42-rate-limiting`), ask Claude: *"Mark task 42 as done and leave a comment with the PR number."*

**Run it on a schedule.** You can configure a cron job that sends a prompt to Claude via the API each morning to generate your standup and post it to Slack via the webhook integration.

---

## The Broader Picture

The terminal-first PM tools that existed before SprintOS (Taskwarrior, dstask) were built for individual productivity. They're great for personal task tracking but don't support teams, sprints, or real collaboration.

The modern team PM tools (Linear, Jira, Plane) are built for browsers. Their MCP integrations are bolted-on community projects with read-only access and manual configuration.

SprintOS is the only tool that's terminal-native *and* team-capable *and* MCP-native — meaning AI agents are a first-class citizen of the workflow, not an afterthought.

If you're already using Claude or Cursor for your code, there's no reason your project board should be outside its reach.

---

## Getting Started

```bash
# Install SprintOS
brew install varmiguemunoz/sprintos/sprintos

# First launch (guided setup)
sprintos start

# Start the MCP server
sprintos mcp
```

Then open Claude Desktop, describe your sprint goal, and watch it build the board for you.

The full MCP tool reference is at [sprintos.run/mcp](/mcp).
