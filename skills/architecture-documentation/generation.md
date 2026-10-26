# Thorough discovery and generation

Use this workflow for an **explicitly requested** initial documentation effort or major architectural rediscovery. Aim for a coherent system-wide explanation, not a sequence of isolated source-file summaries. Follow [documentation.md](./documentation.md) for the resulting documents.

## Discover before writing

Start broad: inspect the repository shape, project manifests, entry points, build/deployment configuration, service boundaries, and existing architecture notes. For a monorepo, determine which pieces run independently, which contracts connect them, and which shared mechanisms cross project boundaries.

Build a **working architectural hypothesis**: the system's purpose and major capabilities; its runtime components and communication/data flows; shared foundations, ownership boundaries, invariants, constraints, and consequential choices. Challenge that hypothesis against representative implementations and the paths where responsibilities meet. Track contradictions and unanswered important questions as leads for investigation, not as excuses to guess.

Test the model through representative scenarios: follow an important operation from intent to durable or visible effect, and follow a failure, reconnect or restart where lifetimes diverge. Establish who owns each state, what crosses each boundary, what order matters, and what survives or becomes invalid. Choose scenarios that reveal different architectural relationships; a source-file tour or endpoint catalog cannot substitute for these connections.

Follow the code as far as architectural confidence requires. Read selectively, prioritizing cross-boundary interactions, lifecycle and failure behavior, data ownership, configuration that changes runtime behavior, and mechanisms repeated across capabilities. Do not impose an arbitrary file/time/token budget; likewise, do not read every file when targeted inspection settles the architectural question.

**Establish the global model before drafting documents.** Only then choose conceptual document boundaries, names, and reading paths. Make these decisions autonomously, using stable responsibilities rather than balancing file sizes. Choose subjects within the required Overview / Capabilities / Foundations / Choices topology. Preserve existing useful document identities; correct misplaced subjects when rediscovery warrants it. Autonomy over the document map does not make the four-category topology optional.

For each proposed document, identify its category, central reader question, authoritative explanation, immediate parent, and sibling order. Identify neighboring explanations it should link to. Deliberately assess consequential current choices and their changeability; do not omit Choices merely because historical rationale is unavailable. Use this as a working outline, not a mandatory published registry. If two pages mostly repeat one mechanism, give that mechanism one owner. If a page answers several independently useful questions with different readers or lifecycles, consider focused documents. Keep operational instructions available without letting them dominate architectural orientation.

## Write the architectural model

Create or revise the architecture overview first as a self-contained orientation, including a system-level diagram by default. Use the repository's established architecture location; `docs/overview.md` is the default when none exists. Place warranted capability, foundation, and choice documents in their corresponding directories. Use the category and nested-area overview rules in documentation.md to provide meaningful parent explanations and local reading order. Do not replace this hierarchy with a flat collection or one system-wide tour.

For each document, lead with the architectural conclusion. Explain how the responsibility works and connects to the rest of the system; surface constraints, surprising behavior, and consequential failure modes early. Include navigation-friendly code references to the actual implementation. Use diagrams to clarify relationships that prose alone obscures, not as decoration.

Develop the model before listing its exceptions: explain the normal relationship or flow, then the failure or constraint that changes a reader's expectations. Use a concrete scenario where abstract terms or several independent identities would otherwise force the reader to reconstruct the mechanism. Retain exact limits, versions and protocol fields where they explain a contract or help lookup; place incidental tuning and exhaustive inventories in the relevant reference material or link to code.

Write current facts and verified implications. Do not reverse-engineer imaginary decision histories, promise invariants not established by the code, or silently resolve conflicting evidence. Investigate gaps found while writing. If a materially important point still cannot be established, mark it inline as `Unclear:` and explain its consequence.

For consequential user actions, distinguish what the backend permits from what each client exposes. Check the action's availability and triggering conditions in the relevant entry point; command support alone does not establish that every UI offers it in every state.

Do not ask the developer to approve document plans or proposed structural changes before writing.

## Review as a system

Once drafted, compare documents against the global model and with one another. Check especially:

- Whether the overview and detailed documents agree about component boundaries, ownership, interactions, contracts, lifecycle, and failure behavior.
- Whether architectural claims with large consequences are grounded in implementation rather than names or assumptions.
- Whether document responsibilities are distinct, important concepts are covered, and shared foundations are not explained inconsistently in multiple places.
- Whether a reader can use the docs to explain the representative operation and failure scenarios, including authority, ordering and lifetime, without reconstructing the model from scattered details.
- Whether difficult interactions have a useful visual explanation, and raw Markdown remains readable at ordinary editor widths after repository formatting.
- Whether the required category topology is present for warranted subjects, Choices assess current commitments, and every overview explains its area rather than merely listing files.
- Whether each document's breadcrumbs, Topic X of Y, and top/bottom Previous/Next links match its parent's canonical order. Keep each sequence within its immediate parent's ordered children, following the category-entry rules in documentation.md.
- Whether links, code references, and Mermaid syntax work where verification tools are available.

Resolve inconsistencies with **targeted** code investigation. Do not rerun the entire discovery simply to validate the output. No extra agents, generators, mandatory tooling, or separate audit phase are required.

## Finish

Deliver the actual Markdown documents and a concise summary of the architecture, meaningful constraints, any unresolved material uncertainties, and checks performed. Mention major taxonomy changes if rediscovery replaced an existing structure.
