---
name: architecture-documentation
description: Create, maintain, and audit codebase architecture documentation. Use when asked to document a system's architecture, update architecture docs after code changes, or check existing docs for drift. When this skill is active during development, assess whether the task affected documented architecture and make targeted updates only when needed.
---

# Architecture documentation

**Goal:** Maximize accurate understanding and confidence per unit of human attention. Help a developer form a reliable big-picture mental model, then investigate specific concerns without wading through incidental implementation detail.

Produce ordinary Markdown optimized for fast filename/content search, reading in an editor, and AI-assisted lookup. Favor clear conceptual boundaries, immediate architectural conclusions, and progressive detail.

Write plain technical English, like one developer explaining the system to another. Name who does what, connect the ideas, and explain necessary technical terms. Preserve precision without inflated language or jargon that can be stated simply.

Keep the four navigation landmarks: **Overview, Capabilities, Foundations, and Choices**. Under the architecture root, use `overview.md`, `capabilities/`, `foundations/`, and `choices/` for warranted subjects. The topology is required;
the inventory and depth adapt to the system. Do not flatten these categories or create empty ones. Follow the document contracts and local navigation rules in [documentation.md](./documentation.md).

Use fenced Mermaid for every diagram, including simple relationships and flows. Keep its source readable in an editor; do not substitute ASCII diagrams.

## Choose the operation

- **Thorough discovery / initial documentation:** Only when the developer explicitly asks to document or rediscover the architecture. Read [generation.md](generation.md) and [documentation.md](./documentation.md). Build a system-wide model before writing.
- **Incremental maintenance:** When this skill is active during a coding task, briefly assess whether the work changes architectural meaning or invalidates documented code references. If plausible, read [maintenance.md](./maintenance.md) and [documentation.md](./documentation.md), then investigate and update only what's affected. Otherwise, leave the docs alone.
- **Documentation audit:** Only when explicitly requested. Read [maintenance.md](./maintenance.md) (audit section) and [documentation.md](./documentation.md). Check existing claims against the implementation and report or repair drift according to the request.

A skill file cannot make itself run after every task. Apply the maintenance assessment when this skill is actually loaded into a development workflow; do not imply automatic background execution.

## Rules across operations

- **Implementation over assumption.** Investigate real entry points, runtime behavior, dependencies, boundaries, and constraints. Do not invent behavior, historical reasons, guarantees, or intended designs.
- **Meaning over file layout.** Organize docs by capabilities, fundamental or shared mechanisms, and architectural choices, not by mirroring source directories. Preserve established document paths while their conceptual responsibilities remain intact.
- **Explanation over inventory.** Connect ownership, interactions and consequences into a model a reader can reason with. Lists of accurate facts, APIs or source files do not by themselves explain the architecture.
- **Architecture over churn.** Change docs when the architectural explanation or useful navigation becomes inaccurate, not just because code changed. Do not regenerate everything for a local change.
- **Autonomous investigation.** Do not interrupt documentation work with clarification questions. Investigate independently. Mark a material unresolved issue inline as **`Unclear:`**, saying what remains unknown and why it matters; omit trivial unknowns.
- **Proportional verification.** Check high-consequence claims, relevant cross-document consistency, links, code references, and diagram syntax where practical. Reuse knowledge already established; avoid pointless repeated exploration.
- **Small footprint.** No mandatory agents, scripts, templates, registries, scheduled audits, CI gates, or freshness metadata. Add no infrastructure solely for this skill.
- **Respect repository scope.** Follow established documentation locations and contribution policies. Documenting architecture does not authorize relocating plans/specs, changing workflow policy, or modifying application code. Update navigation only where the requested documentation requires it.

## Finish the task

Write the requested docs or corrections, not just a plan. Summarize the key architectural picture or changes, any material uncertainties, and what was validated. If no documentation change is warranted, say so briefly. Call out significant document restructuring when it happens.
