---
name: herdr
description: Use Herdr to inspect or control its agents, panes, tabs, workspaces, terminals, sessions, or integrations. Use only when the user explicitly mentions Herdr or asks for a Herdr operation. Delegate Herdr CLI work to a dedicated sub-agent to keep the main agent's context clean.
---

# Herdr

## IMPORTANT: delegate Herdr operations once

The main agent must delegate all Herdr discovery, inspection, control, waiting, and transcript reading to one dedicated sub-agent. Give that sub-agent the user's goal, relevant constraints, and enough context to identify the intended target.

If you are already the sub-agent assigned the Herdr work, perform it directly. Do not delegate again.

The main agent should consume the sub-agent's concise result and synthesize the final response. Do not repeat Herdr commands in the main context merely to confirm successful work.

## Sub-agent workflow

1. Before issuing any live control command, verify that the worker is in a genuine Herdr-managed pane:

   ```bash
   test "${HERDR_ENV:-}" = 1
   ```

   If this fails, stop and report that Herdr live control is unavailable. Never set or fake `HERDR_ENV`.

2. Treat the installed CLI as authoritative. Start with `herdr --help`, then run the relevant command group without a nested subcommand, such as `herdr agent`, `herdr pane`, `herdr tab`, or `herdr workspace`. Do not run bare `herdr`; it launches or attaches the TUI.

3. Use explicit IDs returned by Herdr, or `--current` when the caller's pane is intended. Treat IDs as opaque and never derive them from examples or display order. Prefer `--no-focus` for background work.

4. Perform the requested operation and return a compact report containing the outcome, relevant target IDs, any blockers, and only the command output the main agent needs.

Herdr's installed agent integration already supplies agent identity and status reporting. Do not install or reinstall an integration merely to use this skill; inspect integration status only when the request or a concrete failure makes it relevant.
