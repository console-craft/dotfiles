# UI Orientation

Use Orientation for requests such as:

- "Where is this in the UI?"
- "Show me where this ticket applies."
- "Where can I see this component?"
- "What do I click to reach this?"
- "Orient me in the relevant flow."

Orientation answers: where is this, how do I reach it, and what am I looking at?

## Workflow

1. Identify the task, feature, behavior, component, route, bug, or product concept the human means.
2. Inspect only enough routes, component composition, imports, handlers, visible copy, nearby tests, or feature modules to identify the likely product surface.
3. Navigate the running application. Confirm the route and visible path rather than reconstructing them from code.
4. Find the smallest useful context: the screen, relevant area within it, how the human reaches it, and why it relates to the target.
5. Capture the fewest screenshots needed to anchor the explanation. Keep surrounding UI when it helps orientation; use an element screenshot when isolation is clearer.

## Output

Use this shape when it fits:

```markdown
## Where

[Product area and screen]

## How to get there

[Visible labels, for example Customers -> Acme Corp -> Invoices -> INV-123 -> Summary]

## What to look at

Look at [observed control, state, or region] in [observed context].

## Why this is relevant

[Brief connection to the task, feature, behavior, or code]

## Visual evidence

[Selected screenshot and a short caption]

## Evidence status

[Visually confirmed, Inferred but not visually confirmed, or Blocked]
```

`What to look at` is one evidence-caption sentence, not a QA checklist. Use visible product names rather than implementation names unless the code connection helps the explanation.

If the final state was not reached, do not use the normal output as though it was. Read [blockers.md](blockers.md) and report the boundary explicitly.
