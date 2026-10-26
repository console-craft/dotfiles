# Incremental maintenance and audits

Use this workflow to keep architecture documentation faithful to the implementation without turning every coding task into a documentation project. Follow [documentation.md](./documentation.md) when editing documents.

## Relevance first

When the skill is active during ordinary development, make a **lightweight relevance assessment** using what the task has already revealed. Ask whether the changes affect a documented responsibility, boundary, contract, integration, data flow, shared mechanism, lifecycle, invariant, consequential choice, failure behavior, or the accuracy of a code reference.

If **no**, make no architecture-documentation change. Incidental internal refactors, test churn, formatting, and local implementation details ordinarily do not change the architectural model. Do not open and rewrite docs to prove they were considered.

If **possibly**, inspect the affected documentation and investigate the changed implementation just enough to establish impact. Reuse knowledge from the coding task. Read relevant Git diffs (including uncommitted changes when applicable), code references, repository searches, and neighboring implementations. If Git is unavailable, use the actual changed files and context instead. Do not maintain a source-to-document dependency registry.

## Make targeted updates

Update architectural **meaning** and useful navigation, not descriptions of every code edit. Preserve existing paths, conceptual boundaries, and unaffected explanations. Refresh stale code references even when the conceptual explanation remains correct. Check related documents when changes cross their boundaries, especially the overview and authoritative foundation explanations.

Add, split, merge, rename, or remove documents autonomously when responsibilities have genuinely changed. Significant restructuring deserves a final summary, not advance approval. Preserve the required category topology. Update the parent's ordered child list, breadcrumbs, Topic X of Y, and top/bottom parent and sibling Previous/Next links for every affected area. Keep each sequence within its immediate parent's ordered children, following the category-entry rules in documentation.md. Do not create a new Choices document merely because a library or small implementation preference changed.

Investigate disagreements between code and docs before writing. Where a significant fact remains unresolved, use `Unclear:` with the specific gap and implication. Revisit existing relevant `Unclear:` statements if the changed code or audit provides evidence to resolve them.

If the change appears to invalidate much of the system model, expand investigation across the affected boundaries. When targeted maintenance cannot responsibly restore a coherent global view, **recommend a developer-triggered thorough rediscovery**; do not silently launch an expensive full exploration during an ordinary task. Make safe, supported local corrections and report remaining uncertainty.

## Explicit documentation audit

Run an audit **only when requested**, using the existing documents to guide investigation rather than automatically repeating initial discovery. Check for:

- Incorrect, stale, or unsupported architectural claims.
- Broken, moved, or misleading code references and documentation links.
- Contradictions about boundaries, behavior, ownership, dependencies, invariants, and failures across documents.
- Outdated Choices documents and changeability assessments.
- Important architectural concepts that the current topology misses or obscures, including current commitments whose changeability is undocumented.
- Missing category structure, hollow overviews, or local navigation inconsistent with the parent's child order.
- Material unresolved `Unclear:` statements that new evidence may settle.
- Document splits, merges, or other structural corrections that the **actual conceptual model** warrants.

Trace suspicious claims to relevant code, widening the search when one finding suggests broader drift. Reassess the overview against the overall system shape. Audit thoroughly enough to establish a dependable result, but avoid indiscriminate re-reading of unaffected files.

Unless asked for a report-only audit, repair confirmed documentation drift where the correct account can be established. Report unresolved issues instead of inventing corrections. If the architecture is too uncertain for targeted repair, explain why thorough rediscovery is warranted.

## Validate and report

Validate changed claims against code with attention proportional to impact, and check affected document links, code references, diagram syntax, and cross-document consistency where practical. During ordinary maintenance, do not revalidate the entire documentation set unnecessarily.

Finish with a concise account of the documents changed (or why none changed), important architectural implications, significant structural adjustments, unresolved uncertainties, and verification performed. An audit should also distinguish fixed findings from open findings.
