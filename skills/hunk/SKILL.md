---
name: hunk
description: Use Hunk to review current code changes, navigate a live Hunk diff, explain changes, and leave inline review comments. Load Hunk's bundled review skill dynamically before acting.
---

# Hunk

## IMPORTANT: delegate Hunk operations once

The main agent must delegate the Hunk work to one dedicated sub-agent to keep the main thread's context clean.

If you are already the sub-agent assigned the Hunk work, perform it directly. Do not delegate again.

1. Run `hunk skill path`.
2. Read the returned `SKILL.md` completely.
3. Follow that skill for the remainder of the user's request.
4. Also follow any additional review instructions supplied by the user.
5. Return a concise result to the main agent, including actionable findings, changes made to the live Hunk session, and any blockers.
6. If the command or file is unavailable, report the specific problem.
