---
title: 'GitHub Issues in Your Terminal: How SprintOS Two-Way Sync Works'
description: 'How SprintOS keeps your GitHub issues and PRs in sync with your sprint board — without leaving the terminal. Real-time updates, automated task creation, and keyboard-driven triage from a single interface.'
pubDate: 2026-06-03
image: 'https://res.cloudinary.com/dy7kvvzgj/image/upload/v1753346476/k17k1ildz12yvcacx0e8_uh7wmi.webp'
readtime: '10 min read'
category: 'dev-tips'
tags: ['github', 'github issues', 'project management', 'terminal', 'CLI', 'sprint planning', 'automation', 'sprintos']
authors: ['varmiguemunoz']
draft: false
---

The context switch between a terminal and a browser costs more than the seconds it takes. You break flow, your hands leave the keyboard, you land on GitHub's issue tracker and suddenly you're reading a three-day-old comment thread instead of fixing the bug that sent you there.

SprintOS's GitHub integration is built around one premise: your GitHub issues and PRs should live in the same terminal interface as your sprint board. No browser required.

Here's how the two-way sync works, why it's built the way it is, and how to get it running in about five minutes.

---

## What "Two-Way" Actually Means

Most "GitHub integrations" in project management tools are one-directional: you import an issue once, it creates a card, and from that point on the two systems drift apart. Change the title in GitHub, the card doesn't update. Close the PR, the task stays "in progress."

SprintOS's sync maintains a live mapping between GitHub issues and SprintOS tasks. Changes flow both ways:

**GitHub → SprintOS:**
- New issue created → task appears in backlog
- Issue labeled `sprint` → task moves to active sprint
- Issue closed → task moves to Done
- PR merged → linked task moves to Done
- Issue assigned to a team member → task assigned in SprintOS

**SprintOS → GitHub:**
- Task moved to "In Progress" → issue labeled `in-progress`
- Task status changed → issue label updated
- Task closed in SprintOS → issue closed on GitHub
- Sprint generated from backlog → milestone created on GitHub and issues linked

The underlying mechanism is GitHub webhooks for the inbound direction and the GitHub REST API for outbound writes. SprintOS runs a lightweight webhook receiver as part of its background process.

---

## Setup

**Step 1: Connect your GitHub account**

From inside the SprintOS TUI, press `s` to open Settings, navigate to **Integrations**, and select **GitHub**. You'll see:

```
GitHub Integration
──────────────────
Status: Not connected

Press [c] to connect via GitHub OAuth
```

Press `c`. SprintOS opens your browser to GitHub's OAuth page (this is the one time you'll use a browser). After you authorize, the token is stored locally and the TUI confirms the connection.

**Step 2: Link a repository**

Navigate to your project settings (`p` → project name → `e` for edit) and set the GitHub repository:

```
Project: TaoFlow
GitHub repo: varmiguemunoz/taoflow
Sync mode: [two-way ▼]
Auto-import: open issues only
```

**Step 3: Configure the webhook**

SprintOS needs to receive webhook events from GitHub to pick up changes in real-time. Run:

```bash
sprintos github webhook setup
```

SprintOS uses [ngrok](https://ngrok.com/) under the hood if you're running locally, or reads your `SPRINTOS_PUBLIC_URL` if you've set one. It automatically creates the webhook on your GitHub repo with the correct event subscriptions:

- `issues` (opened, closed, labeled, assigned)
- `pull_request` (opened, closed, merged)
- `milestone` (created, closed)

That's it. From this point forward, issues and PRs appear in your terminal.

---

## Working With Issues in the TUI

Once sync is active, SprintOS adds a GitHub pane to the backlog view. Press `g` from anywhere in the app to open it:

```
┌─ GitHub Issues ─────────────────────────────────────────────────────┐
│ ● open  #47  Fix race condition in sync goroutine          @alex     │
│ ● open  #48  Add rate limiting to webhook receiver                   │
│ ● open  #49  Document MCP tool signatures              @varmiguemunoz│
│ ✓ closed #45  Migrate DB schema to v2                               │
│ ⟳ PR #12   feat: add time tracking export           [review needed] │
│                                                                      │
│ [a] add to sprint  [t] create task  [o] open in browser  [/] filter │
└──────────────────────────────────────────────────────────────────────┘
```

From here you can:

- **`a`** — add the selected issue to the active sprint (creates a linked SprintOS task)
- **`t`** — create a task from the issue without adding it to the current sprint
- **`o`** — open the issue in your browser (only time you leave the terminal)
- **`/`** — filter by assignee, label, or milestone

When you add an issue to a sprint, SprintOS creates a task with the issue title, description, assignee, and a backlink to the GitHub URL. Any subsequent changes to the issue — title edits, label changes, closure — are reflected in the task automatically.

---

## Sprint-to-Milestone Automation

One of the more useful features is sprint-to-milestone sync. When you create a sprint in SprintOS:

```
New Sprint: Week 24 — June 3–7
──────────────────────────────
Goals: Ship GitHub sync + fix webhook race condition

Auto-create GitHub milestone? [Y/n]
```

Pressing `Y` creates a corresponding milestone on GitHub and links every issue in the sprint to it. Your GitHub milestone page becomes an automatic reflection of your sprint state — useful for external stakeholders who live in GitHub but don't use SprintOS.

When the sprint ends and you mark it complete, SprintOS automatically closes the GitHub milestone.

---

## PR Tracking

PRs are first-class in the GitHub pane. SprintOS tracks:

- PR status (open, draft, review requested, approved, merged)
- Which task the PR is linked to (via the issue reference in the PR description or branch name)
- Review state — who has reviewed, who is requested

The branch name convention `feature/TASK-123-description` automatically links a PR to task 123. If your team uses the GitHub issue-closing syntax (`Closes #47`) in PR descriptions, SprintOS picks that up as well.

When a PR is merged, the linked task moves to Done and the GitHub issue is closed. Zero manual bookkeeping.

---

## CLI Commands for CI/CD Integration

Beyond the TUI, SprintOS exposes GitHub sync operations as CLI commands. This is useful for wiring into CI/CD:

**Move a task to "In Progress" when a branch is pushed:**

```bash
# In your GitHub Action:
- name: Update SprintOS task
  run: sprintos task update --ref ${{ github.ref }} --status in-progress
  env:
    SPRINTOS_DB_URL: ${{ secrets.SPRINTOS_DB_URL }}
```

**Create a task from a new issue via CLI (for automation scripts):**

```bash
sprintos github import-issue --repo varmiguemunoz/taoflow --issue 47
```

**Force a full re-sync if state drifts:**

```bash
sprintos github sync --repo varmiguemunoz/taoflow --full
```

The full sync walks all open issues and PRs on GitHub, compares them to SprintOS tasks, and reconciles any drift. It's idempotent — safe to run in a cron job.

---

## How the Sync Engine Works Internally

For those interested in the implementation: SprintOS stores a `github_syncs` table that maps `(github_issue_id, repo)` to `task_id`. On each webhook event, the sync goroutine looks up the record and applies the appropriate state transition.

The webhook receiver uses an HMAC-SHA256 signature check against your webhook secret to reject tampered requests. Events are processed in a buffered channel with a pool of worker goroutines — so a burst of 50 webhook events (say, closing all issues before a release) doesn't block the TUI or overflow the event queue.

Outbound writes (SprintOS → GitHub) use the GitHub REST API with exponential backoff on 429 rate limit responses. SprintOS respects GitHub's `X-RateLimit-Remaining` header and queues writes when the limit is low rather than burning through it.

---

## Conflict Resolution

What happens if someone changes an issue title on GitHub and a task title in SprintOS at the same time?

SprintOS uses a **last-write-wins** strategy with the GitHub event timestamp as the tiebreaker. If the GitHub webhook arrives after a SprintOS update, the GitHub value wins. If SprintOS's update was more recent (based on updated_at), it's preserved and pushed back to GitHub.

In practice, conflicts are rare because developers tend to own one side of the workflow — engineering managers in SprintOS, contributors in GitHub. But the resolution behavior is documented and you can override it per-project with `sync_conflict_resolution: sprintos_wins` or `github_wins` in your project settings.

---

## Limitations

**Private repositories** require a GitHub token with `repo` scope (not just `public_repo`). The OAuth flow handles this — just make sure you're authorizing with an account that has access to the repo.

**GitHub Enterprise** is supported but requires setting `SPRINTOS_GITHUB_API_URL` to your Enterprise API endpoint:

```bash
export SPRINTOS_GITHUB_API_URL="https://github.yourcompany.com/api/v3"
```

**Monorepos:** if multiple projects share one GitHub repository, you can link different SprintOS projects to the same repo with different label filters. Issues labeled `project-a` feed one SprintOS project, `project-b` feeds another.

---

The goal was to make GitHub feel like a persistence layer for your sprint board rather than a separate tool you have to check. Issues created in GitHub, tasks created in SprintOS, PRs opened in the editor — it all ends up in the same place, reflected in real-time, without you switching context.

---

*Want your AI agent to manage these tasks too? [Set up the SprintOS MCP server →](/mcp)*
