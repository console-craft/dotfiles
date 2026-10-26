# Documentation contracts

Maximize accurate understanding and confidence per unit of human attention.
These are semantic contracts, not templates: they define what readers learn, without requiring identical headings or presentation in every document.

## Required information architecture

Keep four predictable navigation landmarks: **Overview, Capabilities, Foundations, and Choices**. Use the repository's architecture root, defaulting to `docs/`. 
Its entry point is `overview.md`; place deeper explanations under `capabilities/`, `foundations/`, and `choices/` according to their purpose.
Preserve an explicitly established root entry filename during maintenance.

This category topology applies at every project size. Scale the subjects, document count, and depth, not the existence of the organizing principle.
Do not flatten the categories into sibling topic files at the architecture root. Do not manufacture subjects or empty directories to fill the categories. 
Assess whether each category has warranted content; a lack of historical decision records is not a reason to omit current architectural Choices.

A document is a bounded unit of understanding. Choose boundaries by conceptual responsibility and independent reader needs, not source directories, runtime owners, or equal file lengths. 
One daemon can own several mechanisms that deserve distinct documents. Closely coupled explanations can remain together. 
Keep one canonical home for each detailed explanation, with selective repetition of important conclusions where needed for local understanding.

Use descriptive lowercase kebab-case paths without numeric reading-order prefixes. 
A single topic is a Markdown file. A category or topic with multiple children has an `overview.md` that explains the area and lists its immediate children in deliberate learning order. 
Introduce nested topic folders only when they contain meaningful children. 
A category with one topic can link directly from the system overview to that file without an extra category overview.

For example, `capabilities/search.md` can stand alone. 
If search needs several independently useful explanations, `capabilities/search/overview.md` can explain the whole capability and introduce its children. 
These are examples of shape, not a required inventory. Operational guides may remain outside the architecture tree; 
preserve and link useful guidance without disguising it as a foundation.

## Shared contract

Orient immediately and answer first. Explain the subject's responsibilities, boundaries, and relationships before supporting details. 
Unfold information as **glance → understand → investigate**. Readers must be able to understand a topic without reading all its preceding siblings. 
A short scenario often connects ownership, ordering, and consequences better than a list of isolated facts.

Use conventional headings when helpful; do not add empty sections or force a uniform presentation. Contextual links should clarify relationships. 
Do not require generic Related Topics sections, reciprocal links, confidence scores, evidence ledgers, or verification sections.

### Overview: How does the system fit together?

The system overview is an independently useful architectural briefing and the primary navigation hub. 
Explain purpose and identity, major responsibilities, capabilities and foundations, boundaries, relationships, important interactions, and consequential constraints. 
Connect product concepts to the runtime pieces that realize them. After this page alone, a developer should be able to explain how the major parts work together without knowing their implementation details.

Include a primary architecture diagram by default and supplementary views when they answer different useful questions. Link into the category hierarchy without duplicating child explanations. 
Keep the overview conceptually stable: local implementation changes matter here only when they change the larger model.

`Key Facts` is a useful lookup heading. Keep incidental versions, tuning limits, build instructions, and exhaustive source inventories in their owning material.
Area overviews have the same obligation at a smaller scope: explain the area, its boundaries and interactions, then introduce the ordered children. 
An index alone is not an overview.

### Capabilities: What does this part accomplish, and how?

Describe recognizable system responsibilities, observable behavior, essential mechanisms, interactions, representative flows, dependencies, and boundaries.
Explain exceptional behavior when it changes the architectural model, exposes a constraint, or affects engineering decisions. Do not catalog ordinary errors.

Show the path from intent to effect where useful. Distinguish what the backend permits from what each client actually exposes and under which conditions.
Provide contextual source references and, when useful, a compact `Code References` section. A file inventory cannot replace an explanation of cooperation.

### Foundations: What underlying mechanism makes the system work?

A foundation can be **shared by multiple capabilities or fundamental to the system's operation**. 
Explain purpose, guarantees or invariants, lifecycle, state, ordering or data flow, consumers, dependencies, responsibility boundaries, constraints, assumptions, and important failure implications as applicable.

Foundations own authoritative explanations of their mechanisms. Other documents may repeat essential conclusions and explain local consequences, then link here instead of duplicating the mechanism. 
Include implementation entry points; `Code References` is a useful optional heading.

### Choices: What can we change, and at what cost?

Explain architecturally significant **current commitments and future flexibility**, including choices that are easy to reverse. 
Do not substitute a historical ADR narrative or skip choices because the original motivation is unknown.

For each choice explain the implemented approach, consequences and tradeoffs, sources of rigidity, changeability, and the broad change path to an alternative.
Ground the assessment in actual dependencies, contracts, stored data, consumers, and deployment obligations. Historical rationale is optional and must be known.
Do not invent alternatives' benefits or claim an untested migration is safe.

Use one classification with a short architecture-specific explanation:

- **Local change:** Replaceable within a relatively isolated boundary.
- **Coordinated change:** Requires changes across connected components or capabilities.
- **Major migration:** Requires significant restructuring, migration, or external coordination.
- **Unassessed:** Insufficient understanding to classify responsibly.

`Changeability` is the preferred heading. Every Choice uses one classification, including Unassessed when necessary; it describes this system, not the technology in the abstract.
Skip trivial preferences. Keep independently useful commitments easy to locate.

## Local navigation

The parent overview defines the canonical order of its immediate children. Use conceptual learning order, not alphabetical, runtime, or source-directory order.

Every non-root document must provide:

- Breadcrumbs near the top showing its architectural location, with links to ancestor overviews and its own title as the final element.
- `Topic X of Y` within its immediate parent's ordered children.
- Previous, and Next links at both top and bottom. Omit Previous for the first child and Next for the last; a sole child has neither.

Previous and Next refer only to siblings listed by that immediate parent. 
Never continue from the last topic inside one area into the first topic inside another, or descend into a child area. 
Category entry pages are siblings under the system overview and may link to one another at that level; their children have separate local sequences. This is not a flattened system-wide tour. 
For a category represented by one file, that file is a direct child of the system overview; include the category name in its breadcrumb without inventing an empty overview to link to.

The system overview has no parent, breadcrumb obligation, position indicator, or Previous/Next links. It supplies ordered entry links, grouped by category.
If categories have overviews, these are its immediate children. A nested topic with children likewise lists its immediate children in order, while its own Previous/Next remain among siblings in the enclosing area.

Use ordinary relative Markdown links and meaningful labels. Prefer document links, using anchors when specifically useful. Contextual cross-links may cross areas; they are separate from the local reading sequence. 
Keep headings, filenames, and domain terminology useful for fuzzy finding and full-text search.

## Plain technical English and source reading

Write like one developer explaining the system to another. Give enough context, name who does what, and connect causes with consequences. 
Use precise domain terms and code identifiers when they help; explain unfamiliar terms at first use.
Avoid stacked nouns, inflated language, vague claims, decorative metaphors, and jargon that can be stated simply. 
Keep sentences focused and paragraphs connected; concise prose must still explain the qualification that makes a claim accurate.
Use Simplified Technical English as a style influence without claiming formal ASD-STE100 compliance or restricting code identifiers to its vocabulary.

Optimize raw Markdown for Neovim and targeted agent retrieval. Wrap prose near 80–100 columns where repository conventions permit. 
Prefer labelled lists over paragraph-filled tables; use tables for compact comparisons that do not require horizontal scrolling. 
Keep link labels meaningful with Markdown syntax visible. Long paths and URLs can be unavoidable exceptions. 
A rendered preview alone does not establish source readability; do not require a particular editor.

Source references help readers investigate. Link to relevant files and name meaningful symbols, briefly explaining their roles. 
Resolve paths from each document's directory; avoid brittle line numbers and exhaustive file inventories.
Describe established behavior and verified implications. Mark material unresolved uncertainty inline as **Unclear:**, stating the gap and why it matters. 
Omit trivial unknowns and do not reproduce the investigative process in the documentation.

## Mermaid diagrams

Use **fenced Mermaid for every diagram**, including simple relationships and flows. No ASCII art, text-arrow substitutes, external image diagrams, or duplicate representations. 
Embed diagrams in Markdown. Borrow C4's change of zoom when useful; do not impose a diagram taxonomy, count, or arbitrary complexity limit.

Choose a diagram by the question it answers: ownership and boundaries, cooperation and ordering, state transitions, data flow, or another architectural relationship.
Favor architectural completeness. Separate views when they answer different questions or improve legibility, not to meet a node budget. 
Show significant boundary crossings and make labels express verified relationships.

Use short semantic IDs, readable labels, and one relationship per source line.
Explain essential conclusions in adjacent prose so the model remains clear without a renderer. 
Check meaning as well as syntax where tooling permits. Do not diagram incidental call graphs or dependencies simply to increase the diagram count.

## Stability

Preserve document identities while responsibilities remain stable. Add, split, merge, rename, or remove documents when conceptual change or a demonstrated organization defect warrants it. 
Preserve useful operational guidance and material unresolved risks during restructuring. Keep the required categories and local navigation intact, and report significant structural changes afterward.
