# Change Tour

Use Change Tour when the human asks what changed in the UI, where a branch or PR is visible, or which screens to inspect.

Change Tour answers: what changed visibly, where can I see each change, and what was or was not confirmed?

## Establish the change set

Use an explicit comparison supplied by the user. Otherwise use the most obvious reliable change set, such as current work relative to its clear base. Never silently invent a comparison range; say when no reliable range can be established.

## Workflow

1. Inspect the change set.
2. Translate implementation changes into potential user-visible outcomes rather than a file-by-file summary.
3. Group files by visible outcome or product surface.
4. For each surface, determine where it lives, navigate there, confirm the relevant state, and capture useful evidence.
5. Separate browser observations from conclusions inferred from code or the diff.
6. Read [blockers.md](blockers.md) for any surface that cannot be reached.

## Output

Start with one short summary of visible impact. Then use exactly this shape for each meaningful stop:

```markdown
### [Stop]

**Location:** [product area and screen]

**Path:** [visible UI labels, for example Customers -> Acme Corp -> Invoices]

**Change:** [user-visible consequence, not changed-file narration]

**What to look at:** Look at [observed element] in [observed region].

**Visual evidence:** [selected screenshot and short caption, or why no screenshot adds information]

**Evidence status:** [Visually confirmed, Inferred but not visually confirmed, or Blocked]
```

`What to look at` is exactly one sentence and never a list. Every claim in the stop must map to a stated browser observation, the established diff, or other named evidence. Do not add layout judgments, acceptance criteria, alternate-state claims, responsive checks, or unexercised interaction outcomes.

If several changes appear on one screen, prefer one explained screenshot over redundant captures.

## Before and after

A visual baseline is optional. Do not build baseline infrastructure merely to produce before/after evidence.

If both states are readily available, compare them. Otherwise use the diff to establish the previous behavior, inspect the current running state, and label the previous state as inferred. Never fabricate or imply a before screenshot.
