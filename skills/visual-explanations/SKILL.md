---
name: visual-explanations
description: Use when the user explicitly asks where a task, ticket, feature, component, diff, branch, or completed change appears in a running application's UI, including UI orientation, change tours, visible consequences, or explanatory screenshots.
---

# Visual Explanations

Use the running application to connect code, tasks, and changes to the UI the human sees. The browser is evidence for an explanation, not merely an automation target.

## Modes

Choose from the user's intent; do not require them to name a mode.

| Intent | Mode | Required reference |
| --- | --- | --- |
| Where something lives and how to reach it | Orientation | Read [references/orientation.md](references/orientation.md) |
| What a diff or completed change visibly affects | Change Tour | Read [references/change-tour.md](references/change-tour.md) |

If required UI state or tooling is unavailable, read [references/blockers.md](references/blockers.md) before deciding or reporting anything.

## Workflow

1. Read the reference for the selected mode.
2. Inspect only enough task, code, route, copy, test, or diff context to identify the likely product surface.
3. **REQUIRED SUB-SKILL:** Use `playwright-cli` for browser interaction.
4. Navigate the running application and confirm the path and state.
5. Capture the minimum visual evidence that makes the explanation concrete.
6. Explain the result using visible product language and a manual UI path.

If `playwright-cli`, its browser, or another prerequisite is unavailable, report a blocker. Do not install or upgrade tooling, mutate product state, repair the environment, or substitute another browser workflow during this run.

## Evidence states

| State | Meaning |
| --- | --- |
| Visually confirmed | The relevant running UI state was reached and inspected. |
| Inferred, not visually confirmed | Code or other evidence indicates the surface, but the UI state was not reached. |
| Blocked | A prerequisite outside ordinary navigation was unavailable. |

Never present inference as observation or fabricate a visual before-state.

## Agency boundary

Visual Explanations is observational. Investigate ordinary navigation problems such as renamed menus, collapsed navigation, stale selectors, or another obvious non-destructive route.

Stop when reaching the target would require data or fixture creation, feature-flag or configuration changes, permissions, credentials, authentication help, API calls that manufacture state, code edits, dependency installation, or environment remediation.

Disposable environments, reversible changes, explicit install authorization, deadlines, manager authority, and sunk cost do not expand this boundary. State the missing prerequisite and return control to the user.

## Shared output rules

- Give a manual path using visible labels, such as `Settings -> Billing -> Payment methods`.
- Use the fewest screenshots that preserve useful orientation; highlight the relevant region when it materially helps.
- Resolve each screenshot path on the current machine, URL-encode it, and present it as a normal Markdown link to an absolute `file://` URL, for example macOS `[Open Talks section screenshot](file:///Users/ovi/Projects/example-app/.playwright-cli/talks-section.png)` or Linux `[Open Talks section screenshot](file:///home/ovi/Projects/example-app/.playwright-cli/talks-section.png)`.
- Describe only states, controls, relationships, and behavior established by browser observation or other named evidence.
- Distinguish visually confirmed, inferred, and blocked findings explicitly.
- Use implementation names only when they help connect visible UI back to code.

This skill is not QA, visual regression testing, accessibility auditing, responsive-matrix testing, test generation, broad debugging, correctness verification, environment repair, or product-data setup. Mention an obvious defect only when it affects the explanation; do not diagnose or fix it automatically.

## Completion

Orientation is complete when the human knows where the target lives, how to reach it, and what to look at.

A Change Tour is complete when the human knows which visible product areas changed, where each appears, and which conclusions were or were not visually confirmed.
