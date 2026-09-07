---
name: verify
description: Run project-specific quality gates in a dedicated sub-agent while keeping noisy command output out of the main thread. Use after implementation or configuration changes and before claiming work complete; when the user asks to verify, test, lint, type-check, build, or make a project good to go; or when repository instructions require checks. Discover the exact commands from the current project's instructions and configuration instead of assuming a global toolchain.
---

# Verify

## Delegate exactly once

The main agent must delegate verification to one dedicated sub-agent. Give it the repository or worktree path, the change goal and scope, relevant user constraints, and whether edits are authorized.

If you are already the sub-agent assigned verification, perform it directly. Do not delegate again.

Delegate after the implementation has stabilized, not after every small edit. Keep raw command output in the sub-agent context. The main agent should consume the concise result and must not repeat checks merely to confirm successful work.

If the harness cannot delegate, report that isolated verification is unavailable. Do not silently run noisy checks in the main thread; use a main-thread fallback only when the user explicitly authorizes it.

## Preserve the task's authority boundary

- If the parent task authorized implementation or fixes, make only the smallest mechanical changes needed to pass relevant checks.
- If the user asked only to inspect, review, diagnose, or report verification status, remain read-only.
- Stop and report before making ambiguous, risky, destructive, broad, or out-of-scope changes.
- Preserve unrelated user changes. Never discard or reset them.

## Sub-agent workflow

1. Work from the specified repository or worktree. Read the applicable repository instructions and inspect the current status and diff before running checks.
2. Determine the project-specific verification contract using this precedence:
   1. Explicit user instructions.
   2. Applicable repository instructions such as `AGENTS.md` or `CONTRIBUTING.md`.
   3. Project-local verification commands, skills, scripts, or task-runner definitions.
   4. CI workflows and package or build configuration.
3. If an instruction names a harness-specific command that is unavailable, read its project-local definition and follow the underlying commands when safe. Do not invent a replacement command.
4. Select checks proportional to the changed surface and run required checks in the prescribed order. Do not install dependencies, use external services, update snapshots, or run unusually expensive suites unless already authorized by the task or repository contract.
5. When a check fails:
   - Diagnose the failure from the focused output.
   - If edits are authorized and the fix is minimal, mechanical, and in scope, apply it.
   - Re-run the narrow failing check first, then continue or re-run the required suite.
   - If the cause or fix is ambiguous, stop and report the evidence and proposed next step instead of guessing.
6. Inspect any files modified by formatters or autofix commands; treat those modifications as part of the task and authority boundary.

## Return a compact result

Report only what the main agent needs:

- Each command or check and its pass, fail, or skipped status.
- Minimal fixes made, if any.
- Remaining failures, skipped checks, blockers, or verification gaps.
- Final `git status --short` and `git diff --stat` when Git is available.
- Only the important failure excerpts or diff hunks; omit routine successful logs.

The main agent must not describe the work as fully verified when any required check failed, was skipped, or could not run. It should include the sub-agent's verification result in the final task summary.
