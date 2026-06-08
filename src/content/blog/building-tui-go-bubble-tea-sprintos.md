---
title: 'Building a TUI in Go with Bubble Tea: What I Learned Building SprintOS'
description: 'A practical deep-dive into building terminal user interfaces with Go and the Bubble Tea framework — architecture decisions, performance lessons, and the patterns that actually work in production.'
pubDate: 2026-06-05
image: 'https://res.cloudinary.com/dy7kvvzgj/image/upload/v1753346476/becs06b6vgw2hnpio6rv_tboj6y.webp'
readtime: '14 min read'
category: 'tech-stack'
tags: ['golang', 'bubble tea', 'TUI', 'terminal', 'bubbletea', 'charmbracelet', 'sprintos', 'open source']
authors: ['varmiguemunoz']
draft: false
---

A year ago I started building a terminal project manager in Go. The pitch was simple: a keyboard-driven Kanban board that lives in your terminal, talks to PostgreSQL, and ships a native MCP server so Claude and Cursor can manage your sprint without you touching a browser.

What I didn't expect was how much the choice of TUI framework would shape every architectural decision that followed.

This is what I learned building SprintOS with [Bubble Tea](https://github.com/charmbracelet/bubbletea) — the good, the tricky, and the patterns I'd use again on day one.

---

## Why Bubble Tea

The Go TUI ecosystem has a few serious options: [tview](https://github.com/rivo/tview), [tcell](https://github.com/gdamore/tcell), and [Bubble Tea](https://github.com/charmbracelet/bubbletea) from Charmbracelet.

tview is mature and widget-rich but takes an imperative approach — you build widget trees, attach callbacks, and mutate state directly. Fine for simple dashboards, but it fights you when your state gets complex.

tcell is a low-level terminal library. Maximum control, maximum boilerplate. You handle everything: input parsing, color codes, cursor positioning, redraws. Good if you're building a custom terminal emulator. Not great if you want to ship a product.

Bubble Tea is different. It uses the [Elm Architecture](https://guide.elm-lang.org/architecture/): every update is a pure function from `(Model, Msg) → (Model, Cmd)`. Your entire UI state lives in one struct. Side effects (database calls, API requests, timers) are handled through commands that run outside the update loop and return messages.

The mental model clicked immediately. Coming from React, the pattern felt familiar. Coming from a codebase that was already becoming a ball of shared mutable state, it felt like a lifeline.

---

## The Core Pattern

The Bubble Tea model for every component:

```go
type Model struct {
    tasks    []Task
    cursor   int
    loading  bool
    err      error
}

type Msg interface{}

type TasksLoadedMsg struct {
    tasks []Task
    err   error
}

func (m Model) Init() tea.Cmd {
    return loadTasks
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "j", "down":
            if m.cursor < len(m.tasks)-1 {
                m.cursor++
            }
        case "k", "up":
            if m.cursor > 0 {
                m.cursor--
            }
        }

    case TasksLoadedMsg:
        if msg.err != nil {
            m.err = msg.err
            return m, nil
        }
        m.tasks = msg.tasks
        m.loading = false
    }

    return m, nil
}

func (m Model) View() string {
    if m.loading {
        return "Loading tasks..."
    }

    var b strings.Builder
    for i, task := range m.tasks {
        cursor := " "
        if i == m.cursor {
            cursor = ">"
        }
        fmt.Fprintf(&b, "%s %s\n", cursor, task.Title)
    }
    return b.String()
}

func loadTasks() tea.Msg {
    tasks, err := db.GetTasks()
    return TasksLoadedMsg{tasks: tasks, err: err}
}
```

Pure `View()`, pure `Update()`. The only place you touch external state is inside commands.

---

## Composing Multiple Views

SprintOS has distinct screens: a Kanban board, a backlog list, a sprint planner, a time tracker, a GitHub sync panel, and an MCP status view. Each needs its own model and key bindings.

The pattern I use is a root model that holds the active screen as an enum and delegates `Update` and `View` to the active child:

```go
type Screen int

const (
    ScreenKanban Screen = iota
    ScreenBacklog
    ScreenSprintPlanner
    ScreenTimeTracker
)

type RootModel struct {
    screen      Screen
    kanban      kanban.Model
    backlog     backlog.Model
    sprint      sprint.Model
    timeTracker tracker.Model
}

func (m RootModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "1":
            m.screen = ScreenKanban
            return m, m.kanban.Init()
        case "2":
            m.screen = ScreenBacklog
            return m, m.backlog.Init()
        }
    }

    var cmd tea.Cmd
    switch m.screen {
    case ScreenKanban:
        m.kanban, cmd = kanban.Update(m.kanban, msg)
    case ScreenBacklog:
        m.backlog, cmd = backlog.Update(m.backlog, msg)
    }
    return m, cmd
}

func (m RootModel) View() string {
    switch m.screen {
    case ScreenKanban:
        return m.kanban.View()
    case ScreenBacklog:
        return m.backlog.View()
    }
    return ""
}
```

Each sub-model is a Go package that exposes its own `Model`, `Update`, and `View`. They don't know about each other. The root model routes messages and switches views. This made it easy to develop each screen in isolation and test them independently.

---

## Handling Database Calls Without Blocking the Event Loop

Early on I made the mistake of calling the database synchronously inside `Update`. The TUI would freeze for 50-200ms on every query — noticeable, especially on cold starts when you're loading a full sprint's worth of tasks.

The Bubble Tea way is to wrap every I/O operation in a command:

```go
func fetchSprintTasks(sprintID int) tea.Cmd {
    return func() tea.Msg {
        tasks, err := db.GetSprintTasks(sprintID)
        if err != nil {
            return errMsg{err}
        }
        return tasksLoadedMsg{tasks}
    }
}
```

Commands run in goroutines managed by the Bubble Tea runtime. Your `Update` function never blocks. The UI stays responsive — you can keep scrolling, switching views, or typing while data loads in the background.

For SprintOS I built a small query cache on top of this: commands first check an in-memory cache keyed by (query, sprintID). If the data is less than 30 seconds old, they return immediately. Otherwise they hit Postgres and update the cache. The result is that navigation between screens feels instant after the first load.

---

## Styling with Lip Gloss

Charmbracelet's [Lip Gloss](https://github.com/charmbracelet/lipgloss) is the styling companion to Bubble Tea. It handles colors, borders, padding, and layout — all using a Go API that generates ANSI escape codes.

```go
var (
    taskCard = lipgloss.NewStyle().
        Border(lipgloss.RoundedBorder()).
        BorderForeground(lipgloss.Color("62")).
        Padding(0, 1).
        Width(28)

    selectedCard = lipgloss.NewStyle().
        Border(lipgloss.RoundedBorder()).
        BorderForeground(lipgloss.Color("205")).
        Padding(0, 1).
        Width(28).
        Bold(true)

    columnHeader = lipgloss.NewStyle().
        Foreground(lipgloss.Color("241")).
        MarginBottom(1).
        Width(28).
        Align(lipgloss.Center)
)
```

The most useful Lip Gloss feature for SprintOS's Kanban view is `lipgloss.JoinHorizontal` — it places styled blocks side by side in the terminal, which is exactly what you need for a multi-column board:

```go
func (m Model) View() string {
    cols := []string{
        renderColumn("Backlog", m.backlogTasks, m.cursor, m.activeCol == 0),
        renderColumn("In Progress", m.inProgressTasks, m.cursor, m.activeCol == 1),
        renderColumn("Review", m.reviewTasks, m.cursor, m.activeCol == 2),
        renderColumn("Done", m.doneTasks, m.cursor, m.activeCol == 3),
    }
    return lipgloss.JoinHorizontal(lipgloss.Top, cols...)
}
```

One gotcha: Lip Gloss measures string width in terms of terminal cells, not bytes. CJK characters are double-width. If your team has task titles with emoji or non-ASCII characters, make sure you're using `lipgloss.Width()` rather than `len()` for layout calculations — otherwise your column borders will misalign.

---

## Terminal Resize Events

Bubble Tea emits a `tea.WindowSizeMsg` when the terminal is resized. Handle it:

```go
case tea.WindowSizeMsg:
    m.width = msg.Width
    m.height = msg.Height
    m.kanban.SetSize(msg.Width, msg.Height)
```

For SprintOS's Kanban board, the column count and task card width adapt to the terminal width. On a narrow terminal (< 100 cols) you get two columns; full-width gives you four. This matters more than you'd expect — developers often have SprintOS running in a split pane next to their editor.

---

## Key Binding Management

Global key bindings (quit, help, screen navigation) need to be processed before per-screen bindings, but per-screen bindings should override global ones when there's a conflict.

I use a layered approach: the root model processes certain keys first, and only passes the message down to the active sub-model if it didn't match anything at the root level:

```go
func (m RootModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    if key, ok := msg.(tea.KeyMsg); ok {
        switch key.String() {
        case "ctrl+c", "q":
            return m, tea.Quit
        case "?":
            m.showHelp = !m.showHelp
            return m, nil
        case "1", "2", "3", "4":
            return m.switchScreen(key.String())
        }
    }

    return m.delegateToActiveScreen(msg)
}
```

This keeps global shortcuts clean and lets each screen define its own key map without worrying about conflicts with root-level bindings.

---

## Testing TUI Logic

Because `Update` is a pure function, testing is straightforward:

```go
func TestCursorNavigation(t *testing.T) {
    m := kanban.New(testTasks)

    m2, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("j")})
    got := m2.(kanban.Model).Cursor()
    if got != 1 {
        t.Errorf("expected cursor 1, got %d", got)
    }
}
```

No mocking, no browser automation, no fixtures — just call `Update` with a message and assert the model state. The same pattern applies to testing that a database command is returned when expected, that loading states are set correctly, and that error messages surface properly in `View()`.

---

## What I'd Do Differently

**Start with the resize handler.** I added `WindowSizeMsg` handling late, and retrofitting it into every sub-model was tedious. Wire it in on day one.

**Keep models lean.** I put too much in the root model early on — cached data, auth state, GitHub sync status. That state should live in purpose-built packages and be accessed through commands. The root model should hold only UI state: active screen, modal visibility, focused element.

**Invest in the status bar early.** A persistent status bar with contextual key hints (like Vim's status line) dramatically reduces the "what can I do here?" friction. SprintOS's status bar shows available actions for the current view and mode — it's one of the things users comment on most.

---

## Resources

If you're starting a new Bubble Tea project:

- [Bubble Tea examples](https://github.com/charmbracelet/bubbletea/tree/master/examples) — the canonical reference
- [Lip Gloss](https://github.com/charmbracelet/lipgloss) — styling
- [Bubbles](https://github.com/charmbracelet/bubbles) — pre-built components (text input, spinner, progress bar, table, viewport)
- [awesome-tuis](https://github.com/rothgar/awesome-tuis) — a curated list of TUI projects to study

SprintOS's source is on [GitHub](https://github.com/varmiguemunoz/sprintos) if you want to see how these patterns work at scale.

---

*Running SprintOS and want to let Claude manage your board? [Set up the MCP server →](/mcp)*
