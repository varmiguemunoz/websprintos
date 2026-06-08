---
title: 'Self-Hosting SprintOS: A Complete PostgreSQL Setup Guide'
description: 'How to run your own SprintOS instance with full data ownership using PostgreSQL — on Railway, Supabase, Neon, or a bare VPS. No vendor lock-in, no $15/seat/month.'
pubDate: 2026-06-08
image: 'https://res.cloudinary.com/dy7kvvzgj/image/upload/v1753346476/k17k1ildz12yvcacx0e8_uh7wmi.webp'
readtime: '11 min read'
category: 'dev-tips'
tags: ['postgresql', 'self-hosted', 'project management', 'railway', 'supabase', 'neon', 'devops', 'sprintos']
authors: ['varmiguemunoz']
draft: false
---

Most project management tools treat "self-hosted" as a premium upsell. Jira's self-managed tier starts at $9,600/year for 50 users. Linear doesn't offer it at all. Plane's self-hosted version requires Docker, Nginx, Redis, and a weekend of debugging compose files.

SprintOS stores everything in a single PostgreSQL database. That means if you can provision a Postgres instance — free tier on Neon, $5/month on Railway, your own VPS, whatever — you own your data completely. No cloud lock-in, no seat fees, no audit logs gated behind an enterprise plan.

This guide walks through four deployment options from easiest to most hands-on.

---

## Prerequisites

Install SprintOS if you haven't already:

```bash
brew install varmiguemunoz/tap/sprintos
```

Or from source:

```bash
go install github.com/varmiguemunoz/sprintos@latest
```

You need a PostgreSQL 14+ instance with a database URL in the format:

```
postgresql://user:password@host:5432/dbname?sslmode=require
```

SprintOS runs its own migrations on first launch — there's nothing to seed manually.

---

## Option 1: Neon (Free Tier — Recommended for Solo Devs)

Neon is a serverless Postgres provider with a generous free tier: 0.5 GB storage, auto-suspend when idle, and instant branching if you want to test schema changes without affecting production.

**1. Create a Neon project**

Go to [neon.tech](https://neon.tech) → New Project. Name it `sprintos`. Neon creates a default database and gives you a connection string like:

```
postgresql://alex:AbcDefGhi@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Copy it — you'll need it in the next step.

**2. Set the environment variable**

```bash
export SPRINTOS_DB_URL="postgresql://alex:AbcDefGhi@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

To make it permanent, add it to your shell profile:

```bash
echo 'export SPRINTOS_DB_URL="<your-url>"' >> ~/.zshrc
source ~/.zshrc
```

**3. Launch SprintOS**

```bash
sprintos
```

On first launch, SprintOS detects the new database, runs migrations, and drops you into the onboarding flow. Takes about 2 seconds.

**Free tier caveat:** Neon auto-suspends your compute after 5 minutes of inactivity. The first query after a cold start takes 1-2 seconds to resume. For a terminal app you're actively using this is barely noticeable — SprintOS reconnects transparently.

---

## Option 2: Railway ($5/month — Best for Teams)

Railway's Postgres service is $5/month for the starter plan, runs without suspension, and includes automatic backups. It's the best option for teams sharing a single SprintOS instance.

**1. Create a Railway project**

```bash
npm install -g @railway/cli
railway login
railway init
railway add --plugin postgresql
```

Or do it through the dashboard: [railway.app](https://railway.app) → New Project → Add PostgreSQL.

**2. Get your connection string**

```bash
railway variables | grep DATABASE_URL
```

**3. Configure SprintOS**

```bash
export SPRINTOS_DB_URL=$(railway variables --json | jq -r '.DATABASE_URL')
sprintos
```

Railway's Postgres supports connection pooling out of the box, so you can have multiple team members connected simultaneously without hitting connection limits.

**Team workflow:** each team member installs SprintOS locally, sets `SPRINTOS_DB_URL` to point at the shared Railway instance, and runs `sprintos`. Everyone shares the same board state in real-time. Task assignments, sprint moves, and status changes are visible to everyone the next time they open the TUI.

---

## Option 3: Supabase (Free Tier — Best for Full-Stack Projects)

Supabase gives you Postgres with a REST API, auth, and realtime subscriptions built on top. If you're already using Supabase for your application's database, running SprintOS against the same instance is a clean choice.

**1. Create a Supabase project**

Go to [supabase.com](https://supabase.com) → New Project. Once provisioned, go to Project Settings → Database → Connection string (URI).

Use the **Transaction pooler** URL if you're on the free tier — it handles connection limits better:

```
postgresql://postgres.xxxxxxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**2. Configure SprintOS**

```bash
export SPRINTOS_DB_URL="postgresql://postgres.xxxxxxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
sprintos
```

**Important:** Supabase's free tier pauses projects after 7 days of inactivity. If you open SprintOS after a week away and get a connection error, log into the Supabase dashboard and click "Resume" on your project. The pause/resume takes about 30 seconds.

---

## Option 4: Bare VPS (Full Control)

For teams that want zero cloud dependency, a $6/month VPS (Hetzner CX22, Linode Nanode, DigitalOcean Droplet) is enough to run a Postgres instance for a small-to-mid team.

**1. Provision Postgres on Ubuntu 22.04**

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib

sudo -u postgres psql -c "CREATE USER sprintos WITH PASSWORD 'your_strong_password';"
sudo -u postgres psql -c "CREATE DATABASE sprintos OWNER sprintos;"

sudo nano /etc/postgresql/14/main/pg_hba.conf
```

In `pg_hba.conf`, add a line to allow your client IPs:

```
host    sprintos    sprintos    0.0.0.0/0    scram-sha-256
```

Then allow external connections in `postgresql.conf`:

```
listen_addresses = '*'
```

Restart Postgres:

```bash
sudo systemctl restart postgresql
```

**2. Open the firewall port**

```bash
sudo ufw allow 5432/tcp
```

Restrict this to your own IP range in production — wide-open Postgres is a common attack vector.

**3. Configure SprintOS**

```bash
export SPRINTOS_DB_URL="postgresql://sprintos:your_strong_password@YOUR_VPS_IP:5432/sprintos"
sprintos
```

**SSL on bare Postgres:** If you want SSL (recommended for connections over the public internet), generate a self-signed cert or point Postgres at a Let's Encrypt cert, and add `?sslmode=require` to your connection string. For VPN-isolated setups (Tailscale, WireGuard) where the Postgres traffic never hits the public internet, `?sslmode=disable` is fine.

---

## Schema Overview

SprintOS manages its own migrations. On first launch it creates these tables:

```
organizations   – your org/workspace
users           – team members
projects        – project boards
sprints         – sprint cycles
tasks           – individual work items
task_tags       – many-to-many tag relations
time_entries    – time tracking records
github_syncs    – GitHub issue/PR sync state
mcp_sessions    – active MCP server connections
```

You never need to touch these directly. But knowing the structure is useful for:

- **Backups:** `pg_dump sprintos > backup.sql` gives you a full snapshot
- **Analytics:** Run any SQL query against your own data — no API rate limits
- **Migrations:** SprintOS handles them automatically on upgrade; your data is preserved

---

## Backup Strategy

**Automated daily backup (cron)**

```bash
0 3 * * * pg_dump $SPRINTOS_DB_URL | gzip > ~/backups/sprintos-$(date +%Y%m%d).sql.gz
```

Neon and Railway handle this for you. Supabase free tier includes 7-day PITR. On bare VPS, set this up yourself.

**Before upgrading SprintOS**

Always dump before running `brew upgrade sprintos` or pulling a new binary:

```bash
pg_dump $SPRINTOS_DB_URL > pre-upgrade-backup.sql
```

SprintOS migrations are forward-only and tested — but one backup command is worth the peace of mind.

---

## Troubleshooting

**"connection refused" on first launch**

Check that your `SPRINTOS_DB_URL` is exported in the same shell session you're running `sprintos` from. Run `echo $SPRINTOS_DB_URL` to verify it's set.

**"too many connections" on Supabase free tier**

Switch to the transaction pooler URL (port 6543) instead of the direct connection URL (port 5432). The pooler multiplexes connections and stays within free-tier limits.

**SSL errors on Neon or Railway**

Ensure your URL includes `?sslmode=require`. Both providers require SSL; connections without it are rejected.

**Neon auto-suspend causing slow first query**

This is expected. Neon resumes in 1-2 seconds. If it bothers you, upgrade to Neon's $19/month plan which disables auto-suspend, or switch to Railway.

---

## Why Self-Hosting Matters

The software you use to track what you're building should be something you control. SprintOS's decision to use PostgreSQL as its only dependency — no Redis, no Kafka, no proprietary storage layer — was deliberate. A single `pg_dump` command gives you your entire work history in a portable format. Move providers, migrate to a new database, spin up a clone for a new team — it's one environment variable.

For teams that care about data sovereignty, it also means no vendor getting acquired, no pricing changes, no terms-of-service updates that suddenly make your sprint data part of someone's training dataset.

Your board, your data.

---

*Using SprintOS's MCP server with your self-hosted instance? [See the MCP setup guide →](/mcp)*
