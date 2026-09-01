---
name: codebase-explanations
description: Explain existing codebases and questions related to codebases using consistent response templates. Use when the user's primary goal is to understand how a system or feature works, locate where something is implemented, trace or diagnose behavior, understand differences between implementations or revisions, or evaluate a focused technical design decision. Do not use for implementation, refactoring, planning, routine completion summaries, or PR review when another workflow owns the task.
---

# Codebase Explanations

Status: Experimental  
Implemented templates: System  
Pending templates: Location, Behavior, Difference, Decision

## Purpose

Use this skill when the user's primary goal is to understand some aspect of an existing codebase.

The goal is not maximum completeness. Produce a compact, reconstructable mental model that is easy to scan repeatedly because similar explanation types always use the same response structure.

Prefer stable response grammar over improvising a new presentation for every answer.

## Activation

Activate this skill automatically when the user's primary intent is to:

- understand how a system, feature, subsystem, or component works;
- locate where something lives in the codebase;
- trace or explain runtime behavior;
- understand differences between two implementations, revisions, branches, or states;
- understand or evaluate a technical design decision.

The user does not need to use words such as "explain".

Examples that should activate this skill:

- "How does authentication work?"
- "Describe the styling strategy in this app."
- "Where is CSV export implemented?"
- "What happens when the access token expires?"
- "Why does this request fire twice?"
- "What changed in this branch?"
- "How do these two implementations differ?"
- "Why did they use Context instead of Zustand?"
- "Would this be simpler without this abstraction?"

## Do Not Activate

Do not activate this skill merely because another task involves explanatory text.

Examples:

- implementing a feature;
- fixing a bug;
- refactoring code;
- running tests or commands;
- creating a plan;
- reviewing a PR when a dedicated review workflow or skill owns the task;
- summarizing work the agent itself just completed;
- routine status or completion reports;
- answering general technical knowledge questions that do not require understanding this codebase.

If the user later explicitly asks for an explanation of work performed, that new request may activate this skill.

Example:

- "Implement token refresh." → do not activate.
- "What exactly did you change?" → Difference.
- "Why did you implement it this way?" → Decision.

## Skill Composition

This skill owns the semantic structure of codebase explanations.

Other skills may independently own prose style, brevity, tone, or formatting constraints.

When another active skill requests shorter or simpler answers:

- preserve the explanation template;
- compress wording aggressively;
- remove nonessential detail;
- do not remove information required to preserve an accurate mental model.

When constraints conflict, prefer:

1. semantic correctness;
2. this skill's explanation structure;
3. stylistic or brevity constraints.

Specialized task skills take precedence when explanation is secondary to their primary task.

Planning is a separate concern and is outside this skill.

## Classification

Classify every matching request into exactly one primary explanation type.

Choose based on the user's primary requested operation, not on answer length or code complexity.

### System

Fundamental question:

> How does X work?

Use for mental models of systems, features, architectural approaches, components, conventions, or strategies.

Examples:

- "How does authentication work?"
- "Describe the styling strategy."
- "How is caching handled?"
- "What does this provider do?"
- "Explain the payments subsystem."

### Location

Fundamental question:

> Where is X?

Examples:

- "Where is authentication implemented?"
- "Where does feature X live?"
- "Where would I change token refresh behavior?"

Template: TODO.

Until this template is implemented, answer normally. Do not substitute the System template.

### Behavior

Fundamental question:

> What happens, or why does it happen?

Use for runtime behavior, execution paths, data flow, causal chains, and diagnosis.

Examples:

- "What happens when I click Save?"
- "Why does this request fire twice?"
- "What happens when refresh fails?"

Template: TODO.

Until this template is implemented, answer normally. Do not substitute the System template.

### Difference

Fundamental question:

> What is different between A and B?

A and B may represent:

- before and after;
- base branch and PR;
- two implementations;
- two components;
- old and new behavior.

Examples:

- "What did this PR change?"
- "How does this branch differ from main?"
- "What's different between these two auth implementations?"

Template: TODO.

Until this template is implemented, answer normally. Do not substitute the System template.

### Decision

Fundamental question:

> Why was X designed this way, or should it be designed differently?

Use for reconstructing or evaluating focused engineering decisions.

Examples:

- "Why did they choose Y instead of Z?"
- "Would X have been better implemented another way?"
- "Should this abstraction be simplified?"
- "Do we actually need this service?"

Template: TODO.

Until this template is implemented, answer normally. Do not substitute the System template.

## Classification Rules

Prefer the user's explicit requested operation when categories overlap.

Examples:

- "How does auth work after this PR?" → System
- "What changed about auth in this PR?" → Difference
- "What happens when auth refresh fails?" → Behavior
- "Where is auth refresh implemented?" → Location
- "Would auth refresh be simpler without this abstraction?" → Decision

Do not create hybrid templates.

Choose the single category that best represents what the user wants from the answer.

Complexity controls how much detail fills a template. It does not control whether the template is used.

---

# Diagram Selection

When a template includes a diagram, choose the diagram structure according to the mental model being communicated.

Prefer the simplest representation that preserves the important relationships.

Diagrams are explanatory tools, not decoration.

## Topology and component relationships

Use when the question is primarily about:

- important components;
- ownership boundaries;
- dependencies;
- architectural relationships;
- how pieces fit together.

Prefer:

- a small ASCII graph for simple relationships;
- a Mermaid `flowchart` for larger relationships;
- a Mermaid block diagram when high-level component grouping is more important than directional flow.

Example:

```text
AuthProvider ──→ API client ──→ Backend
```

Do not use complex architecture notation when a few boxes and arrows communicate the model more clearly.

## Interactions over time

Use when understanding depends on the order in which multiple participants interact.

Prefer a Mermaid `sequenceDiagram`.

Typical uses:

- browser → frontend → API → database;
- request/response flows;
- retries;
- authentication exchanges;
- asynchronous interactions between services.

Sequence diagrams should emphasize meaningful participants and interactions, not every function call.

## State transitions

Use when the central mental model is one entity moving between states.

Prefer a Mermaid `stateDiagram`.

Typical uses:

- order lifecycle;
- connection states;
- authentication/session states;
- workflow status changes.

Do not use a state diagram merely because the implementation happens to contain state.

## Repository location and ownership

Use when the question is about where code lives.

Prefer:

- an ASCII directory tree;
- a small ASCII relationship graph when the concept spans multiple areas.

Example:

```text
src/
└── features/
    └── reconciliation/
        ├── components/
        ├── hooks/
        └── api/
```

Use Mermaid only when ownership or dependencies across multiple repository areas cannot be communicated clearly with a small tree or graph.

## Before/after and alternatives

Use when the mental model is fundamentally comparative.

Prefer paired or mirrored diagrams that use the same visual structure on both sides.

Typical uses:

- before vs after;
- old vs new implementation;
- current design vs proposed alternative;
- implementation A vs implementation B.

Example:

```text
BEFORE                    AFTER

Component                 Component
   │                         │
   ▼                         ▼
  API                     Cache
   │                         │
   ▼                         ▼
  DB                        API
                              │
                              ▼
                             DB
```

When using Mermaid, a flowchart with parallel `subgraph`s is usually appropriate.

Keep both sides visually comparable so the meaningful delta is easy to see.

## Causal chains

Use when explaining why an observed behavior occurs and participant interaction is less important than cause and effect.

Prefer an ASCII or Mermaid flowchart.

Example:

```text
render
  ↓
new object identity
  ↓
effect dependency changes
  ↓
effect reruns
  ↓
second request
```

## Git topology

Use Mermaid `gitGraph` only when branches, commits, merges, or Git history topology are themselves the subject of the explanation.

Do not use `gitGraph` merely because the question concerns a PR or branch.

"What changed in this PR?" is normally a semantic before/after comparison, not a Git topology problem.

## Decision trees

A flowchart shaped as a decision tree may be useful when a design choice genuinely depends on a small number of explicit conditions.

Do not force nuanced engineering tradeoffs into artificial yes/no trees.

When comparing architectural alternatives, paired structural diagrams are usually more honest and useful.

---

# System Template

Use System when the user wants a mental model of how some part of the codebase works.

The reader should finish the answer able to:

- explain the subsystem back in their own words;
- understand its important pieces and relationships;
- mentally simulate its normal operation at an appropriate level;
- know where the important implementation lives.

The System template always uses this order:

1. Summary
2. Diagram
3. How it works
4. Key code
5. Important details, when needed

Do not add generic sections such as "Overview", "Conclusion", "Further reading", or "Recommendations".

Do not turn a System explanation into a design review.

## Summary

Always include `## Summary`.

Give the mental model immediately.

Use approximately 1–3 sentences.

State:

- what the system fundamentally does;
- its main organizing mechanism;
- the most important relationship or boundary when useful.

Do not begin with generic filler.

Bad:

> The authentication system consists of several interconnected components that work together to provide authentication functionality.

Better:

> Authentication uses short-lived access tokens plus refresh tokens. Frontend session state lives in `AuthProvider`, requests go through a shared API client, and backend middleware resolves authenticated users before protected handlers execute.

The Summary should be useful even if the reader stops there.

## Diagram

Always include a diagram immediately after the Summary.

Every System explanation is considered diagram-worthy, including very small systems.

Choose the diagram according to the global Diagram Selection rules.

For System explanations, normally prefer a topology-oriented diagram showing the important components and relationships.

A tiny ASCII diagram is sufficient for simple systems:

```text
AuthProvider ──→ API client
```

Use richer Mermaid diagrams only when the system's structure warrants them.

Do not make the diagram reproduce the entire `How it works` section.

The diagram should establish the visual mental model that the following explanation expands.

## How it works

Always include `## How it works`.

Explain the conceptual operating model.

Prefer approximately 3–5 items.

Use a numbered list when there is meaningful:

- sequence;
- lifecycle;
- precedence;
- causality;
- ordered flow.

Use short bullets instead when the system is better understood as parallel responsibilities, rules, conventions, or cooperating pieces.

Describe conceptual behavior, not every function call.

Example:

1. Login sends credentials to the authentication endpoint.
2. The backend validates them and issues access and refresh tokens.
3. The shared API client attaches the access token to protected requests.
4. Backend middleware validates the token and establishes the current user.
5. Expired access tokens enter the refresh flow before the original request is retried.

Do not place routine code snippets under these items.

Keep this section visually easy to scan.

## Key code

Always include `## Key code`.

Use code anchors to ground the explanation in the actual implementation.

Target approximately 5 anchors.

Prefer 4–5 when the subsystem naturally has that many important landmarks.

Use fewer when the subsystem is genuinely smaller.

Exceed 5 only when omitting another anchor would leave a materially important part of the mental model ungrounded.

An anchor may be:

- a file;
- function;
- class;
- hook;
- component;
- route;
- middleware;
- configuration entry;
- another concrete symbol or location.

Choose anchors that materially define the system.

Do not list every file that participates.

Each anchor should contain:

1. the path or symbol;
2. one short sentence explaining its role;
3. one small fenced snippet from the actual code.

Example:

**`src/auth/AuthProvider.tsx`**  
Owns frontend session state.

```ts
const [session, setSession] = useState<Session | null>(null)
```

**`src/api/client.ts`**  
Attaches the current access token to API requests.

```ts
headers.set("Authorization", `Bearer ${session.accessToken}`)
```

### Code snippet rules

Snippets are evidence, not miniature tutorials.

Normally use approximately 1–4 lines.

Select the smallest actual code fragment that demonstrates why the anchor matters.

Prefer:

- signatures;
- representative calls;
- important expressions;
- key configuration;
- central branches.

Remove irrelevant surrounding boilerplate.

Do not reconstruct code that does not exist.

Do not use pseudocode in place of actual repository code unless explicitly labeled and genuinely necessary.

Do not explain syntax that is already obvious from the snippet.

If no useful short snippet exists for an anchor, show the smallest relevant declaration or call site instead of manufacturing one.

## Important details

Include `## Important details` only when necessary.

This section contains facts that materially qualify the mental model established above.

Good candidates include:

- non-obvious constraints;
- exceptions;
- legacy paths;
- bypasses;
- surprising ownership boundaries;
- important differences from the apparent architecture;
- special behavior that would make the simplified model misleading if omitted.

Keep it short.

Do not use this section as a dumping ground for miscellaneous facts discovered during investigation.

If there are no important qualifications, omit the section entirely.

## Information Selection

The answer should not reproduce the investigation process.

Do not confuse:

> information required to discover the answer

with:

> information required by the user to understand the answer.

Inspect as much code as necessary.

Return only the information needed to reconstruct the useful mental model.

Do not include:

- exhaustive file inventories;
- every call in the execution chain;
- investigation diaries;
- generic background knowledge the user did not ask for;
- speculative improvements;
- repetitive conclusions.

Prefer high information density with low reading burden.

---

# Location Template

Use Location when the user's primary goal is to find where something lives, where it is owned, or where they should start making a particular change.

The reader should finish the answer able to:

- identify the primary implementation or ownership location;
- recognize the small repository neighborhood around it;
- know which nearby files or symbols matter;
- understand how those locations relate when that relationship is necessary for navigation.

The Location template always uses this order:

1. Location
2. Repository map
3. Key locations
4. How it connects, when needed

Keep Location answers deliberately smaller than System explanations.

Do not expand into a general explanation of how the subsystem works merely because the relevant code was discovered.

## Location

Always include `## Location`.

Answer the location question immediately.

Use approximately 1–2 sentences.

Identify:

- the primary directory, file, or symbol;
- the main owner or entry point when useful.

Example:

> The CSV export feature primarily lives under `src/features/export/`. Its main orchestration entry point is `useCsvExport()` in `hooks/useCsvExport.ts`.

For questions asking where to make a change, answer in action-oriented language:

> To change token refresh behavior, start in `src/api/client.ts`. `refreshAccessToken()` owns the retry flow; `AuthProvider` only supplies session state.

If the concept has no single primary location, say so explicitly rather than inventing one.

## Repository map

Always include a diagram immediately after the Location section.

Choose the representation according to the global Diagram Selection rules.

For Location answers, normally prefer a selective ASCII repository tree.

Example:

```text id="p7f2la"
src/
├── features/
│   └── reconciliation/
│       ├── api/
│       ├── hooks/
│       └── components/
└── shared/
    └── ledger/
```

For a very small location, the diagram may be correspondingly small:

```text id="7o5rnq"
src/
└── auth/
    └── middleware.ts   ← main implementation
```

When the relevant code spans several repository areas and their relationship matters more than their directory hierarchy, use a small ownership or dependency graph instead:

```text id="ow0gmv"
features/reconciliation
        │
        ├──→ api/payments
        └──→ shared/ledger
```

The map is selective, not an exhaustive directory listing.

Show only enough surrounding structure to establish orientation.

Do not include large unrelated portions of the repository.

## Key locations

Always include `## Key locations`.

Target approximately 3–5 anchors.

An anchor may be:

- a directory;
- file;
- function;
- class;
- hook;
- component;
- route;
- configuration entry;
- another concrete symbol or repository location.

For each anchor, give the path or symbol and one short sentence describing why it matters.

Example:

- **`src/features/reconciliation/`** — owns the feature.
- **`hooks/useReconciliation.ts`** — main frontend orchestration.
- **`api/reconciliation.ts`** — API boundary for the feature.
- **`components/ReconciliationPage.tsx`** — main user-facing entry point.
- **`shared/ledger/`** — shared ledger functionality consumed by reconciliation.

Prefer locations that help the reader navigate or modify the feature.

Do not list every file that happens to participate.

Do not include routine code snippets under these anchors. The path and ownership role are the evidence in a Location answer.

Use fewer anchors when the answer is genuinely small.

Exceed 5 only when another location is necessary to avoid giving a materially incomplete or misleading repository map.

## How it connects

Include `## How it connects` only when the relationship between the locations materially helps the reader understand ownership or navigate the codebase.

Keep it short.

Example:

> `AuthProvider` owns frontend session state, but authentication enforcement lives in backend middleware. The shared API client connects the two by attaching credentials to outgoing requests.

This section is especially useful when:

- responsibility is split across several directories;
- the apparent location is not the actual owner;
- one location is only an entry point into another;
- frontend and backend ownership differ;
- shared infrastructure participates in a feature owned elsewhere.

Omit this section when the paths and roles are already self-explanatory.

## Scope Control

Location answers are maps, not subsystem tutorials.

Do not explain implementation behavior unless a small amount of context is necessary to establish ownership or distinguish between nearby locations.

Do not include:

- a general architecture walkthrough;
- detailed runtime flows;
- exhaustive file inventories;
- code snippets merely to prove that a file exists;
- historical background;
- design recommendations;
- unrelated neighboring code.

If the user wants to understand how the located system works, that is a System request.

If the user wants to understand what happens through the located code at runtime, that is a Behavior request.

Prefer the smallest repository map that leaves the reader confidently oriented.

# Behavior Template

Use Behavior when the user wants to understand what happens, why something happens, or the causal mechanism behind an observed behavior.

Typical questions include:

- "What happens when I click Save?"
- "Why does this request fire twice?"
- "What happens when token refresh fails?"
- "Why did this PR make the test suite dramatically slower?"
- "How does this state transition happen?"

Behavior explanations may be substantially more detailed than other explanation types.

System explanations optimize for compression and orientation.

Behavior explanations optimize for causal completeness.

When choosing between omitting a meaningful causal link and making the answer somewhat longer, keep the causal link.

The reader should finish the answer able to:

- understand the mechanism that produces the behavior;
- follow the meaningful causal or execution chain;
- distinguish established evidence from inference;
- understand important conditions that change or amplify the behavior.

The Behavior template always uses this order:

1. Answer
2. Diagram
3. Mechanism
4. Evidence
5. Conditions and variations, when needed

## Answer

Always include `## Answer`.

Give the conclusion immediately.

For straightforward behavior questions, briefly state what happens.

For "why" or diagnostic questions, state the cause as early and directly as the available evidence allows.

Do not make the reader follow the investigation before revealing the conclusion.

Usually use approximately 1–3 sentences, but allow slightly more when the behavior requires several closely related causes or an important environment distinction.

Example:

> The request fires twice because `filters` receives a new object identity on each render. That changes the effect dependency, so the effect runs again and starts a second request.

For a more complex diagnosis:

> The PR made each test perform an expensive setup operation that was previously shared. Local hardware absorbed much of the additional work, but limited CI resources and test concurrency amplified the cost enough to push the suite from roughly five minutes to more than thirty.

The Answer should establish the causal thesis that the rest of the response explains and supports.

## Diagram

Always include a diagram immediately after the Answer.

Choose the diagram according to the global Diagram Selection rules.

Behavior diagrams should normally visualize movement, causality, interaction order, or state transition.

Typical choices:

- Mermaid `sequenceDiagram` when multiple participants interact over time;
- ASCII or Mermaid flowchart for causal chains and branching behavior;
- Mermaid `stateDiagram` when one entity moves between meaningful states.

Example causal diagram:

```text
render
  ↓
new filters object
  ↓
dependency changed
  ↓
effect reruns
  ↓
second request
```

The diagram should expose the important causal shape before the detailed explanation begins.

Do not include every function call or implementation layer.

## Mechanism

Always include `## Mechanism`.

This is the primary section of a Behavior explanation.

Explain the meaningful execution or causal chain that produces the behavior.

Prefer a numbered list when the mechanism has an ordered path.

A typical explanation may use approximately 4–8 meaningful steps, but do not impose a hard maximum when additional steps are necessary to preserve the causal model.

Behavior is explicitly allowed to exceed normal brevity preferences when causal completeness requires it.

Each step may contain several short sentences when necessary to explain:

- what happens;
- why that step matters;
- how it causes or enables the next step;
- relevant environmental or runtime behavior;
- an important file or symbol involved.

Name important files and symbols inline where useful.

Example:

1. **`InvoiceForm.onSubmit()` starts the save path.**  
   It passes the validated form model into the save mutation.

2. **`useSaveInvoice()` converts UI state into the API request.**  
   The mutation owns the transition from local form data into the persisted representation.

3. **The request reaches the invoice endpoint.**  
   The backend validates and persists the update before returning the resulting invoice.

4. **The mutation invalidates the cached invoice query.**  
   Consumers observing that query therefore refetch the latest persisted state.

### Preserve meaningful causality

Include a step only when crossing it changes the reader's understanding of the behavior.

Collapse transparent forwarding layers.

Do not produce traces such as:

```text
button
→ React event
→ handler
→ hook
→ wrapper
→ mutation
→ HTTP utility
→ fetch
→ middleware
→ router
→ controller
→ service
→ repository
→ ORM
→ database
```

when the useful model is:

```text
Form → mutation → API endpoint → persistence → cache invalidation
```

Do not confuse runtime completeness with explanatory completeness.

### Code inside the mechanism

Short fenced code snippets may appear directly beneath a Mechanism step when the code is the clearest evidence for that specific causal link.

Normally use approximately 1–4 lines.

Example:

1. **A new `filters` object is created on each render.**

```ts
const filters = { status, owner }
```

2. **The effect treats that new identity as a changed dependency.**

```ts
useEffect(() => {
  loadItems(filters)
}, [filters])
```

Use snippets selectively.

Do not place a code block under every step merely for consistency.

A snippet should prove or clarify the mechanism, not decorate it.

## Evidence

Always include `## Evidence`.

Show the strongest evidence supporting the mechanism described above.

Evidence may include:

- actual source code;
- tests;
- logs;
- timings or measurements;
- profiler output;
- configuration;
- environment differences;
- PR or commit diffs;
- before/after runs;
- behavior after a revert;
- other directly observed repository or runtime facts.

Prefer measured or directly observable evidence over inference.

Use the smallest representation appropriate to the evidence.

For a simple behavior question, Evidence may be only one or two short code snippets.

For a detailed diagnosis or post-mortem, this section may be substantially larger.

A table may be useful when several observations need to be compared across the same dimensions.

Example:

| Observation | Evidence | Why it matters |
| --- | --- | --- |
| Local suite took ~5 minutes | Local test timing | Establishes the local baseline |
| CI exceeded 30 minutes | Pipeline timing | Shows environment-specific amplification |
| Regression began with the PR | Before/after CI runs | Narrows the triggering change |
| Revert restored prior timing | Post-revert CI run | Strongly supports the causal explanation |

Do not present speculation as evidence.

When part of the mechanism is inferred rather than directly established, say so clearly.

## Conditions and variations

Include `## Conditions and variations` only when circumstances materially alter the main mechanism.

Use this section for:

- alternate branches;
- success and failure paths;
- retries;
- preconditions;
- environmental differences;
- concurrency effects;
- amplifying or suppressing conditions;
- behavior that occurs only in specific states;
- other variations that would make the main explanation incomplete if omitted.

Examples:

For token refresh:

- **Refresh succeeds:** replace the token and retry the original request.
- **Refresh fails:** clear the session and return to authentication.
- **Concurrent failures:** requests may share the same refresh operation rather than starting several.

For a CI performance regression:

- Local hardware may hide much of the additional cost.
- Lower CI CPU or memory may amplify resource contention.
- Worker concurrency may make an expensive operation scale much worse in CI than locally.

Do not use this section as a generic collection of extra facts.

If the behavior has no meaningful branches or qualifying conditions, omit it.

## Diagnostic and post-mortem depth

Behavior also owns deeper explanatory questions such as regressions, incidents, performance failures, and technical post-mortems.

For these questions, investigate as deeply as necessary before answering.

Do not stop at the nearest observable trigger.

Distinguish between:

- the change or condition that initiated the behavior;
- the mechanism through which it produced the observed effect;
- conditions that amplified, suppressed, or altered that effect;
- evidence supporting each major causal link.

Do not require incident-specific headings such as "Root cause" or "Contributing factors".

Express those ideas through the normal Behavior grammar:

- `Answer` states the causal conclusion;
- `Mechanism` reconstructs the causal chain;
- `Evidence` supports it;
- `Conditions and variations` captures amplifiers, branches, and environmental differences.

## Information Selection

Behavior may use more detail than other templates, but detail must remain causally useful.

Do not reproduce the investigation diary.

Avoid:

- every function encountered while tracing execution;
- unrelated implementation details;
- speculative side theories unsupported by evidence;
- generic technical background;
- recommendations the user did not ask for;
- remediation plans unless they are required to explain existing behavior.

Behavior explains what happens and why.

If the user's primary question becomes what should be changed or which design would be better, use Decision or a separate planning workflow instead.

# Difference Template

Use Difference when the user wants to understand what meaningfully differs between two implementations, revisions, branches, states, or versions.

The comparison may be temporal:

> before → after

or lateral:

> A ↔ B

The reader should finish the answer able to:

- state the meaningful delta in their own words;
- understand how much the difference matters before studying its details;
- visually recognize how the structure or behavior changed;
- compare the important dimensions directly;
- know where the important evidence lives in the code.

Explain semantic differences, not changed lines.

For PRs, branches, commits, and other code changes, organize around meaningful changes rather than modified files.

The Difference template always uses this order:

1. Summary
2. Important consequences
3. Diagram
4. Differences
5. Key code

Do not add generic sections such as "Overview", "Conclusion", "Recommendations", or "Files changed".

Do not turn a Difference explanation into a review or design judgment.

## Summary

Always include `## Summary`.

State the meaningful delta immediately.

Use approximately 1–3 sentences.

Describe what became different at the level the user actually cares about.

For code changes, prefer behavioral, structural, ownership, API, or responsibility changes over diff statistics.

Bad:

> This PR modifies 12 files with 148 additions and 73 deletions.

Better:

> Session refresh moved out of `AuthProvider` and into the shared API client. Expired requests can now refresh and retry transparently instead of immediately forcing logout.

For lateral comparisons, summarize the central distinction:

> Both components display invoice data, but `InvoiceTable` owns fetching and caching while `InvoiceGrid` receives prepared data from its parent.

The Summary should be useful even if the reader stops there.

## Important consequences

Always include `## Important consequences` immediately after the Summary.

This section is an attention triage layer.

Before the reader invests effort understanding the detailed delta, tell them what the difference actually affects.

Prefer approximately 1–3 short bullets.

Good candidates include:

- observable behavior changes;
- responsibilities or ownership moving between components or layers;
- compatibility or caller impact;
- changed data flow;
- changed state ownership;
- new or removed boundaries;
- public API changes;
- meaningful dependency changes;
- changes that remain intentionally local or contained.

Keep this section descriptive.

Valid:

> Existing callers no longer need to handle token refresh explicitly.

Not valid:

> Centralizing token refresh here is a bad architectural choice.

The latter belongs to review or Decision.

If the difference has no meaningful consequences beyond a local implementation detail, say so explicitly:

> No meaningful consequences beyond the local implementation.

Do not invent significance merely to populate this section.

## Diagram

Always include a diagram after Important consequences.

Choose the representation according to the global Diagram Selection rules.

Difference explanations normally use paired or mirrored diagrams.

The two sides should use the same visual grammar so the delta can be recognized by inspection.

For temporal changes:

```text
BEFORE                    AFTER

Component                 Component
   │                         │
   ▼                         ▼
  API                     Cache
   │                         │
   ▼                         ▼
  DB                        API
                              │
                              ▼
                             DB
```

For lateral comparisons:

```text
IMPLEMENTATION A           IMPLEMENTATION B

Component                  Parent
   │                          │
   ▼                          ▼
fetch data                  fetch data
   │                          │
   ▼                          ▼
render                     Component
                              │
                              ▼
                            render
```

Use a small ASCII diagram when the comparison is simple.

For larger structures, prefer a Mermaid flowchart with parallel `subgraph`s.

Do not use Mermaid `gitGraph` merely because the comparison concerns a PR or branch.

Use `gitGraph` only when Git history or branch topology itself is what the user needs to understand.

The diagram should expose the structural or behavioral delta.

Do not reproduce every table row visually.

## Differences

Always include `## Differences`.

This is the centerpiece of the template.

Use a comparison table unless the difference is so small that a table would contain fewer than two meaningful comparison dimensions.

Prefer approximately 3–5 meaningful rows.

Use column names that match the actual comparison.

Examples:

```text
| Aspect | Before | After |
```

```text
| Aspect | `InvoiceTable` | `InvoiceGrid` |
```

```text
| Aspect | `main` | Current branch |
```

Do not mechanically use "Before" and "After" for lateral comparisons.

Choose comparison dimensions according to what actually matters.

Useful dimensions may include:

- behavior;
- ownership;
- responsibilities;
- state;
- data flow;
- API surface;
- dependencies;
- failure handling;
- persistence;
- lifecycle;
- boundaries;
- configuration.

Example:

| Aspect | Before | After |
|---|---|---|
| Refresh ownership | `AuthProvider` | shared API client |
| Expired request | logout | refresh + retry |
| Callers | auth-aware | mostly auth-agnostic |
| Retry logic | duplicated | centralized |

Do not create rows merely because facts are available.

Prefer the few dimensions that reconstruct the meaningful delta.

For PRs and branches, do not organize this section file-by-file.

Bad:

- `auth.ts` changed...
- `client.ts` changed...
- `provider.ts` changed...

Better:

| Aspect | Before | After |
|---|---|---|
| Refresh ownership | provider | API client |
| Failure behavior | logout | refresh + retry |
| Session responsibility | distributed | centralized |

Files are evidence for the delta, not the organizing principle.

## Key code

Always include `## Key code`.

Ground the comparison in the actual implementation.

Target approximately 5 important anchors.

Prefer 3–5 when that is sufficient to prove the important differences.

Use fewer when the delta is genuinely small.

Exceed 5 only when another anchor is necessary to establish a materially important difference.

An anchor may be:

- a changed file;
- function;
- class;
- hook;
- component;
- route;
- configuration entry;
- old/new implementation pair;
- another concrete symbol or location.

Choose anchors that demonstrate the meaningful delta.

Do not list every modified file.

Each anchor should contain:

1. the path or symbol;
2. one short sentence explaining what difference it demonstrates;
3. a tiny fenced snippet from the actual code.

For code changes, prefer a short diff when it communicates the change clearly:

**`src/api/client.ts`**  
Refresh responsibility moved into the shared request layer.

```diff
+ if (response.status === 401) {
+   return refreshAndRetry(request)
+ }
```

For lateral comparisons, paired representative snippets may be more appropriate:

**`InvoiceTable.tsx` vs `InvoiceGrid.tsx`**  
One owns its query while the other receives prepared data.

```tsx
const { data } = useQuery(invoiceQuery)
```

versus:

```tsx
function InvoiceGrid({ invoices }: Props) {
```

### Code snippet rules

Snippets are evidence, not miniature diff reviews.

Normally use approximately 1–4 lines per snippet.

Select the smallest actual fragment that demonstrates the difference.

Prefer:

- changed signatures;
- representative calls;
- central branches;
- ownership-defining declarations;
- configuration differences;
- expressions that expose changed behavior.

Remove irrelevant surrounding boilerplate.

Do not reconstruct code that does not exist.

Do not explain every changed line.

For large diffs, select representative evidence rather than reproducing the patch.

## Information Selection

Investigate as much of both sides as necessary to understand the comparison.

Return only the differences needed to reconstruct the meaningful delta.

Do not confuse:

> everything that changed

with:

> everything the reader needs to understand what changed.

Do not include:

- exhaustive changed-file inventories;
- diff statistics unless explicitly requested;
- chronological narration of commits;
- every mechanical rename or formatting change;
- unchanged implementation details that do not clarify the comparison;
- architectural recommendations;
- maintainability judgments;
- speculative future problems.

Keep the answer descriptive.

The Difference template explains:

> What is different, and what does that difference affect?

Decision or review workflows answer:

> Is that difference good?

## Reuse in specialized workflows

Specialized skills may reuse the Difference response grammar without activating this skill as the primary workflow.

When Difference is embedded inside a larger workflow, use a compact form when appropriate:

1. Summary
2. Important consequences
3. Diagram
4. Differences

`Key code` may be omitted when the surrounding workflow already provides sufficient code evidence or would otherwise repeat the same snippets.

For example, a PR-review Change Map may use this compact form to establish the semantic delta before later architectural or correctness gates evaluate it.

The specialized workflow remains responsible for judgment.

The Difference grammar only establishes what changed and what that change affects.

# Decision Template

Use Decision when the user wants to understand or evaluate a focused engineering choice.

The fundamental question is:

> Why was X designed this way, or should it be designed differently?

Decision has two modes:

- **Reconstructive:** explain why an existing choice was likely made.
- **Evaluative:** judge whether the current approach should be kept, simplified, replaced, or changed.

Both modes use the same reasoning structure.

The reader should finish the answer able to:

- understand the recommendation or reconstructed rationale;
- see which concrete facts drive that conclusion;
- compare the realistic alternatives;
- inspect the strongest evidence in the code;
- know which missing facts or future conditions would change the decision.

Decision is a focused design analysis, not a general architecture review.

Investigate broadly before judging. Answer narrowly afterward.

The amount of investigation required does not determine the length of the final explanation.

The Decision template always uses this order:

1. Answer
2. Diagram
3. Decision factors
4. Options
5. Evidence
6. What would change the decision

## Answer

Always include `## Answer`.

Lead with the conclusion.

For evaluative questions, give a clear recommendation when the evidence supports one.

Prefer conclusions such as:

- keep the current approach;
- simplify it;
- prefer A over B;
- change it, but not yet;
- either approach is reasonable under the current constraints.

Do not hide behind generic statements such as:

> Both approaches have advantages and disadvantages.

when the available evidence supports a stronger judgment.

Briefly state the main reason for the conclusion.

Example:

> **I would simplify this.** The abstraction currently has one implementation, callers do not rely on substitutability, and the extra boundary duplicates a capability the framework already provides.

For reconstructive questions, distinguish known rationale from inference.

Example:

> **The rationale is not documented.** The strongest explanation supported by the code is that the event bus keeps three independently mounted UI surfaces from depending directly on each other.

Never present inferred developer intent as documented fact.

When useful, make the confidence level clear through normal language such as:

- documented;
- strongly supported;
- likely;
- plausible but unverified.

## Diagram

Always include a diagram immediately after the Answer.

Choose the representation according to the global Diagram Selection rules.

For Decision explanations, normally diagram:

> the current design and the recommended or main competing alternative.

For reconstructive questions, diagram:

> the chosen design and the strongest realistic alternative when that contrast helps explain the choice.

Prefer paired or mirrored structures so the architectural difference is immediately visible.

Example:

```text
CURRENT                         SIMPLIFIED

Component                       Component
   │                               │
   ▼                               ▼
Adapter                         Service
   │
   ▼
Service
```

The diagram does not need to include every option discussed later.

Usually show only:

- the current or chosen design;
- the recommended or strongest competing alternative.

The Options table is responsible for presenting the complete set of realistic alternatives.

Use a decision-tree-shaped flowchart only when the choice genuinely depends on a small number of explicit conditions.

Do not force nuanced tradeoffs into artificial yes/no trees.

## Decision factors

Always include `## Decision factors`.

Identify the concrete facts that materially drive the judgment.

Prefer approximately 2–5 factors.

Good decision factors include:

- actual requirements;
- existing implementations;
- number and type of callers;
- ownership boundaries;
- framework or language conventions;
- extension requirements;
- testing needs;
- runtime constraints;
- coupling introduced or removed;
- operational complexity;
- existing duplication;
- current and foreseeable change pressure.

Keep these specific to the codebase and the question.

Bad:

> Abstractions improve maintainability.

Better:

> Only one implementation exists, and all callers already depend on behavior specific to that implementation.

Do not evaluate the design primarily against generic best practices.

Judge the options under the codebase's actual constraints.

The purpose of this section is to expose:

> These are the facts that make the answer lean this way.

This also gives the user concrete assumptions or factors they can correct.

## Options

Always include `## Options`.

Use a compact comparison table.

Include the realistic alternatives relevant to the decision.

Normally include approximately 2–4 options.

The current implementation or status quo counts as an option and should normally be included.

Do not invent weak alternatives merely to make the table larger.

Prefer columns that expose the meaningful tradeoff for the specific decision.

A useful default is:

| Option | What it buys | Cost | Fit here |
|---|---|---|---|
| Current approach | ... | ... | ... |
| Simpler alternative | ... | ... | ... |
| Other realistic option | ... | ... | ... |

`Fit here` should contain an actual judgment rather than another neutral description.

Possible values include:

- Strong
- Reasonable
- Weak
- Best fit
- Only justified if X

Adapt the columns when another comparison communicates the decision more clearly.

The table exists both to support the recommendation and to provide a stable reference surface for follow-up discussion.

A user should be able to say:

> Tell me more about option B.

and have the reference be unambiguous.

After the table, add only the short interpretation needed to explain which differences actually decide the question.

Do not repeat every cell in prose.

## Evidence

Always include `## Evidence`.

Ground the reasoning in the strongest concrete evidence from the codebase.

Prefer approximately 2–4 anchors.

An anchor may be:

- a file;
- function;
- class;
- component;
- hook;
- interface;
- configuration entry;
- call site;
- test;
- documentation or ADR;
- another concrete symbol or repository artifact.

Choose evidence that supports the important decision factors.

Do not list everything inspected during the investigation.

Each code anchor should normally contain:

1. the path or symbol;
2. one short sentence explaining what it proves;
3. one small fenced snippet from the actual code.

Example:

**`src/payments/PaymentProcessor.ts`**  
Defines the abstraction, currently with a single implementation.

```ts
interface PaymentProcessor {
  process(payment: Payment): Promise<void>
}
```

**`src/payments/StripePaymentProcessor.ts`**  
The only concrete implementation in the repository.

```ts
class StripePaymentProcessor implements PaymentProcessor
```

Normally keep code snippets to approximately 1–4 lines.

Use the smallest actual fragment that demonstrates the relevant fact.

For reconstructive decisions, also inspect available rationale sources when useful, including:

- ADRs;
- documentation;
- comments;
- tests;
- commit history;
- PR descriptions or discussions when available.

Clearly distinguish evidence of behavior or structure from evidence of historical intent.

Code can strongly establish what a system does without establishing why its authors chose it.

## What would change the decision

Always include `## What would change the decision`.

State the concrete conditions, missing facts, or future requirements that would materially alter the conclusion.

Examples:

- a second implementation is actually planned;
- runtime implementation selection is required;
- another package consumes this interface as a stable boundary;
- a compatibility constraint exists outside the repository;
- a requirement discussed outside the codebase changes the expected lifecycle;
- the alternative would violate an operational constraint not visible in the code.

This section exposes the boundary conditions of the recommendation.

It is not a generic caveats section.

Use it to make the judgment falsifiable and easy for the user to refine with context the agent may not possess.

Do not invent invisible organizational constraints and treat them as facts.

Instead, state them conditionally:

> This recommendation would change if this interface is intentionally consumed by another package that must remain implementation-independent.

If the user confirms that a condition cannot occur, the recommendation may become stronger.

If the user reveals that a condition is true, reassess the decision using the new information.

If no realistic condition would materially change the conclusion within the requested scope, say so briefly rather than manufacturing one.

## Decision Quality

Decision explanations should be opinionated when the evidence permits, but never more certain than the evidence supports.

Prefer:

> Given the current constraints, B is the better fit because...

over:

> B is a best practice.

Prefer:

> I would remove this abstraction unless a second implementation is a real requirement.

over:

> This abstraction violates YAGNI.

Do not substitute architecture slogans, pattern preferences, or generic best practices for codebase-specific reasoning.

Do not recommend complexity for hypothetical future requirements unless those requirements have credible evidence.

Do not recommend simplification merely because fewer lines or fewer abstractions look cleaner.

Consider the actual cost of change, ownership, coupling, behavior, language/framework conventions, and requirements relevant to the decision.

For reconstructive questions, never invent historical intent.

For evaluative questions, make a recommendation rather than stopping at a neutral list of tradeoffs when the evidence supports one.
