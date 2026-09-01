---
name: pr-review
description: Review a pull request through sequential intent, architecture, and correctness gates. Establish intended behavior, map structural changes, judge whether the architectural direction keeps the system easy to change safely, then pressure-test correctness. Stop early when a gate fails to avoid spending review effort on code that should be substantially changed.
---

# PR Review

Review the pull request through a sequence of gates.

Each gate answers a different question and may stop the review before later, more expensive work is performed.

```text
                PR
                 │
                 ▼
          ┌─────────────┐
          │ INTENT GATE │
          └─────────────┘
                 │
        What are we building?
                 │
                 ▼
          ┌────────────┐
          │ CHANGE MAP │
          └────────────┘
                 │
       What structurally changed?
                 │
                 ▼
       ┌────────────────────┐
       │ ARCHITECTURAL GATE │
       └────────────────────┘
                 │
       Do we want this direction?
                 │
                 ▼
        ┌──────────────────┐
        │ CORRECTNESS GATE │
        └──────────────────┘
                 │
             Does it work?
                 │
                 ▼
               MERGE
```

The stages deliberately occur in this order.

Do not spend significant effort proving an implementation correct if its intent is unresolved or its architectural direction should cause it to be substantially rewritten.

---

# General Principles

Review important things, not everything that can possibly be commented on.

The objective is to maximize important confidence per unit of reviewer attention.

Use deterministic tooling for deterministic questions.

Use AI analysis to reduce the amount of information a human reviewer must reconstruct manually.

Reserve human judgment for decisions that require understanding intent, trade-offs, project direction, and context.

AI is a pressure-tester and scout, not an authority.

Prefer concrete evidence over speculative concerns.

Do not comment merely to demonstrate that a review occurred.

Do not review:

- formatting;
- naming preferences;
- subjective style;
- cosmetic refactoring opportunities;
- issues already adequately enforced by deterministic tooling;
- alternative implementations that are merely preferable;
- generic clean-code advice;
- nits.

If there is nothing important to report, report nothing beyond the gate result.

---

# 1. Intent Gate

The Intent Gate answers:

> **What are we actually trying to build, and does the implementation correspond to that intent?**

It establishes the contract against which the rest of the review operates.

## PR description

Start with the PR description.

The PR description must concisely explain what behavior the author intends to introduce or change.

Do not open the ticket merely to discover what the PR is supposed to do.

If the PR description does not provide sufficiently clear intent, stop the review and say so.

Do not compensate for a missing or vague description by reconstructing intent from the diff or ticket.

The author is responsible for making the PR understandable.

The PR description should be short enough that another developer can quickly understand the intended behavioral change.

Do not require it to duplicate the complete ticket or acceptance criteria.

## Ticket ↔ PR description

If ticket context is available, compare the ticket's intended behavior with the PR description.

The ticket represents the original requested intent.

The PR description represents the author's explicit implementation intent.

A PR may intentionally differ from the ticket.

Detect only material differences such as:

- added behavior;
- removed behavior;
- changed scope;
- different handling of important states;
- changed user-visible workflows;
- changed assumptions explicitly stated by the ticket.

Ignore wording differences and implementation details that do not alter intent.

If material drift exists, surface it and ask whether it was intentional.

For example:

> The ticket limits retry to failed payments, while the PR description also includes partially processed payments. Was this expansion intentional?

Do not assume drift is wrong.

Do not perform a complete acceptance-criteria audit.

Do not act as QA.

Do not require the PR description to repeat the ticket.

If there is no meaningful drift, move on without commenting.

## PR description ↔ implementation

Perform enough inspection of the implementation to determine whether the code actually implements what the PR description claims.

Look for:

- missing pieces of stated behavior;
- behavior implemented differently from what is described;
- unintended additional behavior;
- obvious contradictions between tests, implementation, and stated intent.

This is an alignment check, not yet a deep correctness review.

Do not exhaustively hunt bugs or pressure-test edge cases at this stage.

If the implementation materially differs from the stated intent, stop and surface the mismatch.

If the Intent Gate passes, continue to the Change Map.

---

# 2. Change Map

The Change Map is **not a gate**.

It does not approve or reject anything.

Its purpose is to cheaply establish:

> **What important structural facts changed?**

Create a concise factual map of the implementation before making architectural judgments.

Look for meaningful changes such as:

- modules or features added, removed, or substantially changed;
- new public interfaces or APIs;
- new abstractions;
- abstractions that were bypassed or replaced;
- new dependencies;
- changes in dependency direction;
- changes in state ownership;
- new sources of state;
- changes in data flow;
- responsibilities moved between modules or layers;
- business rules introduced in additional locations;
- important mechanisms that were removed or replaced.

Use surrounding source context when necessary to understand these structural facts.

Prefer answering specific questions over exploring the entire subsystem.

Keep the Change Map descriptive and render the Change Map using the compact form of the Codebase Explanations (`codebase-explanations`) skill's `Difference` template. The compact form of the `Difference` template has the following structure:

1. Summary
2. Important consequences
3. Diagram
4. Differences

Do not recommend changes.

Do not judge whether the architecture is good or bad.

Do not produce:

- SOLID commentary;
- code-smell inventories;
- maintainability scores;
- refactoring suggestions;
- style commentary;
- speculative future problems.

For trivial changes with no meaningful structural consequences, simply state:

> No meaningful structural changes.

Then continue.

---

# 3. Architectural Gate

The Architectural Gate answers:

> **After this PR, is the system still easy to change safely?**

More specifically:

> **Can future behavior still be changed locally, with explicit dependencies and state ownership, without unnecessarily coordinating unrelated parts of the system?**

Use the established intent from the Intent Gate and the factual structural information from the Change Map.

Do not re-review intent.

Do not perform deep correctness analysis here.

The purpose of this gate is to decide whether the structural direction introduced by the PR is one we want future work to build upon.

## Core Principle

Architecture should reduce the amount of the system a developer must understand and coordinate in order to make a safe change.

Prefer designs that keep:

- behavior local;
- state minimal and clearly owned;
- dependencies visible;
- data flow understandable;
- shared surfaces small;
- unrelated features independent.

Be suspicious of changes that increase coordination cost across the system without a concrete benefit.

---

## Preserve Locality

Prefer behavior, state, tests, and implementation details to remain close to the feature or concept that owns them.

Ask:

- Does this change remain mostly understandable within the area it affects?
- Will future changes to this behavior mostly happen in obvious nearby places?
- Did the PR unnecessarily spread one feature across unrelated modules or layers?
- Did something local become global or shared without demonstrated need?

Do not move behavior into shared infrastructure merely because it might later be reused.

Feature autonomy is generally desirable.

Cross-feature coordination should exist because the domain requires it, not because architectural structure prefers it.

---

## Keep State Minimal and Clearly Owned

Every meaningful piece of state should have an obvious owner.

Prefer:

- local state over global state when coordination is unnecessary;
- derived values over additional stored state;
- one source of truth over synchronized copies.

Be suspicious of:

- mirrored state;
- duplicated caches;
- state copied between layers;
- synchronization mechanisms;
- multiple owners of the same information;
- state lifted or centralized merely to make it broadly accessible.

Ask:

> If this value changes, is it obvious where the authoritative change happens?

If not, future modifications are likely to become harder and less safe.

---

## Keep Dependencies Explicit

A developer should be able to understand important relationships by reading the relevant code.

Prefer explicit dependencies and composition over hidden resolution mechanisms.

Hide implementation complexity, but do not hide important dependency relationships.

Be suspicious of unnecessary:

- global state;
- service locators;
- registries;
- ambient dependencies;
- implicit cross-module behavior;
- framework machinery that makes dependency wiring difficult to trace.

Ambient infrastructure such as application-level context may be appropriate when it is genuinely global and idiomatic for the ecosystem.

The question is not whether every dependency is passed manually.

The question is:

> **Can a developer reasonably see what this code depends on and where those dependencies come from?**

---

## Prefer Understandable Data Flow

Important data and control flow should be easy to follow.

Prefer:

- direct flow;
- composition;
- explicit transformations;
- predictable ownership;
- few synchronization points.

Be suspicious of:

- bidirectional synchronization;
- distant side effects;
- hidden mutation;
- callback webs;
- event-driven indirection where direct flow would be clearer;
- multiple competing paths that can modify the same behavior.

Do not introduce indirection merely to satisfy an architectural pattern.

---

## Keep Shared Surfaces Small

Every shared API, exported abstraction, extension point, configuration option, global mechanism, or public contract creates something future code can depend upon.

Prefer small, narrow surfaces.

Shared modules should generally be few, stable, boring, and difficult to couple to accidentally.

Ask:

> Does this new shared surface need to become a contract today?

If not, keep the implementation local.

Be especially cautious when a PR turns local implementation details into shared infrastructure.

---

## Let Abstractions Earn Their Existence

Do not reward abstraction merely because it removes duplicate syntax or looks architecturally sophisticated.

An abstraction is valuable when it:

- hides meaningful complexity;
- reduces what callers need to understand;
- represents genuinely shared knowledge;
- isolates change that would otherwise affect many consumers.

Prefer concrete implementations first when the common shape is still uncertain.

Tolerate duplicated mechanics when the alternative would couple concepts that may evolve independently.

Ask:

> **If these implementations diverged tomorrow, would that be a bug?**

If no, duplication may be healthy.

If yes, the code may be duplicating knowledge that should have one authoritative representation.

Repeated syntax is usually cheap.

Repeated business decisions are not.

---

## Centralize Knowledge, Not Incidental Similarity

Business rules and invariants that multiple consumers must agree upon should normally have a clear authoritative source.

Examples include:

- whether an operation is allowed;
- state-transition rules;
- validation semantics;
- domain classifications;
- calculations whose meaning must remain consistent.

Do not force unrelated implementations into the same abstraction merely because their code currently looks similar.

Prefer sharing when the shared thing represents **knowledge**, not just coincidental structure.

A useful test is:

> If these copies diverged, would users observe inconsistent or incorrect behavior?

If yes, the knowledge probably should not be independently duplicated.

---

## Prefer Composition Over Configuration

Prefer assembling concrete pieces over creating generic configurable machinery.

Do not introduce:

- strategy systems;
- plugin architectures;
- extension registries;
- generic option matrices;
- callbacks for hypothetical use cases;

unless real variation already justifies them.

Known near-term variation may justify an extension seam.

Hypothetical future requirements do not.

Design for futures that are visible, not imaginary ones.

---

## Prefer Deleteable and Reversible Structure

Code is easier to evolve when features and mechanisms can be removed without dismantling unrelated infrastructure.

Ask:

- Could this feature still be removed reasonably cleanly?
- Did this PR entangle itself with shared infrastructure?
- Did it create a contract that will become difficult to retract?
- Did it introduce a decision that becomes expensive to reverse once other code depends upon it?

Favor reversible decisions when uncertainty is high.

---

## Respect the Ecosystem's Native Shape

Architecture should fit the language, framework, and existing codebase.

Do not impose a universal architectural template across ecosystems.

React code need not resemble C# code.

C# code need not resemble Python code.

Python code need not resemble React code.

Prefer the idiomatic mechanisms of the ecosystem unless there is a concrete reason to deviate.

For example, explicit dependencies may naturally appear as:

- function arguments;
- closures;
- React props;
- hooks;
- composition;
- context;
- constructor injection;

depending on the ecosystem.

Do not reward architectural consistency across languages when that consistency makes the code less natural, less direct, or harder for developers in that ecosystem to understand.

Ask:

> **Does this solution look like a natural solution in this language and framework, or does it look like an architectural style imported from somewhere else?**

---

## Boundaries Must Pay Rent

Do not create boundaries merely because layered architecture says one should exist.

A useful boundary should accomplish something concrete, such as:

- hide substantial complexity;
- reduce what callers need to know;
- isolate volatile implementation details;
- protect meaningful domain knowledge;
- reduce the blast radius of future change.

Be skeptical of layers that merely forward calls, mirror types, or duplicate interfaces without reducing cognitive load.

A narrow API hiding substantial complexity is valuable.

A chain of shallow abstractions that exposes the same complexity across more files is not.

---

## Prefer Deep Modules Over Shallow Ceremony

A good module may hide substantial implementation complexity behind a small, meaningful interface.

Judge a module by how much complexity it removes from its consumers.

Prefer:

```text
small interface
      ↓
substantial hidden capability
```

over:

```text
many layers
      ↓
many interfaces
      ↓
caller still understands everything
```

Do not introduce interfaces solely for hypothetical replaceability.

An interface, whether formal or implicit, should represent a meaningful contract or hide meaningful complexity.

The public surface of a module is itself an interface even when no language-level `interface` declaration exists.

Hide implementation details.

Do not hide important relationships.

---

## Watch the Trajectory

Do not judge only whether this single PR is tolerable.

Ask:

> **If five more features are implemented using this same pattern, what kind of system do we get?**

A small local compromise may be harmless.

A small new precedent may not be.

Pay particular attention to changes that establish patterns others are likely to copy:

- new shared infrastructure;
- new state ownership patterns;
- new dependency mechanisms;
- new abstraction styles;
- new cross-feature coupling;
- new extension mechanisms.

Architectural review should care more about harmful trajectories than isolated local ugliness.

---

## Architectural Findings

Raise an architectural finding only when the PR creates a meaningful long-term cost or establishes a direction that should not be repeated.

A finding should explain:

1. **What structural decision the PR introduces.**
2. **How that decision increases future change cost, coupling, hidden coordination, or cognitive load.**
3. **Why the issue matters beyond personal preference.**
4. **What architectural property should be preserved instead.**

Prefer concrete consequences.

For example:

> This PR introduces a second owner for retry eligibility in the UI. Future changes to retry rules would now require coordinating the domain logic and the component logic. Keep retry eligibility authoritative in one domain-level location and let the UI consume that decision.

Avoid findings such as:

- "This violates SOLID."
- "Consider adding an abstraction."
- "This isn't clean architecture."
- "This should use dependency injection."
- "This could be more reusable."
- "I prefer a service here."

Architectural vocabulary is not evidence.

Explain the future change cost.

---

## When to Block

Block the PR when the architectural issue is significant enough that allowing the implementation to become precedent would make future changes materially harder or less safe.

Examples include:

- introducing competing sources of truth;
- significant hidden coupling;
- broadly shared abstractions based on speculative reuse;
- duplicated authoritative business knowledge;
- unnecessary global state or coordination mechanisms;
- major new shared surfaces without demonstrated need;
- structural choices that make a feature difficult to change or remove independently;
- importing an architectural style that fights the ecosystem and materially increases complexity.

Do not block because the implementation is imperfect.

Do not demand architectural purity.

Local ugliness can be acceptable when it remains local and easy to replace.

The Architectural Gate protects the **direction of travel**, not aesthetic perfection.

If the implementation should be substantially redesigned, stop the review.

Do not proceed to the Correctness Gate.

---

## Passing the Architectural Gate

The gate passes when the implementation may not be perfect, but:

- its complexity remains appropriately local;
- important dependencies and ownership remain understandable;
- shared contracts are justified and narrow;
- authoritative knowledge is not unnecessarily duplicated;
- abstractions hide real complexity rather than add ceremony;
- the design fits the ecosystem;
- future changes remain reasonably isolated;
- no harmful precedent is being established.

If the gate passes, continue to the Correctness Gate.

Before passing, ask:

> **If someone copies the structural decisions in this PR five times over the next year, will the codebase become easier or harder to understand, change, and delete?**

If the answer is materially harder, identify why before proceeding.

---

# 4. Correctness Gate

The Correctness Gate answers:

> **Given that this is the behavior we intend and an implementation direction we are willing to keep, does it actually work?**

Now pressure-test the implementation deeply.

Try to falsify it.

Focus on:

- incorrect behavior;
- regressions;
- missing or incorrect failure handling;
- race conditions and state bugs;
- invalid assumptions about data or APIs;
- security problems relevant to the change;
- important edge cases;
- incorrect interactions with existing behavior.

Ask questions such as:

- What happens when dependencies fail?
- What happens at boundaries and empty states?
- What happens with unexpected but plausible data?
- Can operations happen twice or race?
- Can state become stale or inconsistent?
- Does existing behavior still work?
- Are error and recovery paths correct?
- Do tests meaningfully exercise the changed behavior?
- Can a realistic input, state, or execution sequence produce an incorrect result?

Prefer findings that can be demonstrated with a concrete failure scenario.

Do not invent hypothetical problems without a plausible path to failure.

Use existing deterministic signals such as:

- tests;
- typechecking;
- builds;
- linters;
- static analysis;

when available.

Do not duplicate deterministic tooling by commenting on issues those tools already adequately enforce unless the issue reveals a genuine behavioral problem.

AI analysis is a correctness pressure-tester, not a correctness verifier.

If no concrete correctness problems are found, do not manufacture findings.

---

# Findings

Every finding must belong to a gate.

Use only the following categories.

## Intent Drift

The PR description materially differs from the linked ticket and the difference should be confirmed as intentional.

## Intent Mismatch

The implementation materially differs from what the PR description claims.

## Architectural Issue

The implementation introduces a structural direction that materially increases future change cost, hidden coordination, coupling, or cognitive load.

Explain the future consequence rather than citing architectural doctrine.

## Correctness Issue

There is a plausible bug, regression, unsafe behavior, or other immediate correctness problem.

For correctness findings, explain the concrete failure scenario whenever possible.

Do not disguise stylistic preferences or optional improvements as findings.

---

# Follow-up Reviews

Keep lightweight local review state so follow-up reviews do not require the user to explicitly identify them.

Store review state under:

```text
.git/pr-review/
```

The state is a local review cache, not project knowledge.

Never commit it.

Store only what is necessary to resume the review:

- branch or equivalent local review identity;
- commit SHA last reviewed;
- unresolved findings and their gate;
- brief finding summaries.

Do not store:

- full ticket contents;
- full diffs;
- model reasoning;
- unrelated project information.

## Detect initial vs follow-up review

Before reviewing:

1. Determine the current branch or equivalent local review identity.
2. Look for existing review state.
3. If none exists, perform an initial review.
4. If state exists, verify using git that the previously reviewed commit is still an ancestor of the current HEAD.
5. If it is, treat the review as a follow-up.
6. If it is not, consider the review cache invalid and perform a fresh review.

Do not rely on conversation memory to determine whether a review is initial or follow-up.

Use deterministic git operations for review-state detection.

## Follow-up behavior

For a follow-up review:

- inspect changes since the previously reviewed commit;
- verify previous unresolved findings;
- determine whether those changes invalidate conclusions from later gates;
- re-run only the gates affected by the changes.

Do not restart the entire review unless necessary.

Examples:

- a local correctness fix normally requires re-running only the affected correctness analysis;
- a changed implementation approach may require rebuilding the Change Map and re-running the Architectural Gate;
- changed stated intent requires returning to the Intent Gate;
- a substantial rewrite, large rebase, changed scope, or invalidated assumptions may require a fresh review.

Treat previous review conclusions as cached knowledge.

Invalidate only what the new changes actually invalidate.

After review, update local state to the current HEAD and unresolved findings.

---

# Platform Independence

Do not assume any specific pull request or ticketing provider.

Use local git whenever possible for repository state and follow-up detection.

Use PR and ticket context when it is already available through the current environment or explicitly supplied.

Do not require or assume:

- GitHub;
- GitLab;
- Bitbucket;
- Jira;
- Linear;
- Azure DevOps;
- GitHub Issues;
- any specific provider API.

The review philosophy must remain independent of the tools used to host the repository or track work.

Do not fail the entire review merely because a ticketing integration is unavailable.

If ticket context is unavailable, perform the parts of the Intent Gate that can be established from the PR description and implementation.

---

# Source Navigation

Start from the PR description and changed files.

Use surrounding source context when necessary to answer a specific question.

Do not automatically explore the entire subsystem.

Treat local source navigation as a depth tool, not an entrance ticket.

Before leaving the immediate PR context, have a concrete question such as:

> Who currently owns this state?

> Is this business rule already defined elsewhere?

> Does this module already provide a narrow API for this operation?

> Does this new dependency bypass an existing abstraction?

Prefer targeted investigation over broad codebase archaeology.

---

# Output

Keep review output concise.

Report only information that materially affects one of the gates.

Do not produce commentary for a gate merely to prove that it was performed.

A successful review may look like:

```text
Intent Gate: passed

Change Map:
- Payment retry behavior added to PaymentsTable.
- New retry API operation introduced.
- Retry eligibility remains owned by the payments domain.
- No new shared infrastructure or global state.

Architectural Gate: passed

Correctness Gate: passed
```

If a gate fails, report the relevant findings and stop when continuing would waste review effort.

For example:

```text
Architectural Gate: failed

Architectural Issue:
Retry eligibility is now independently encoded in both the domain layer and PaymentsTable. Future changes to retry rules would require keeping the two implementations synchronized.

The authoritative retry rule should remain in one place and be consumed by the UI.

Correctness review skipped because the implementation direction should change.
```

Do not append:

- optional improvements;
- generic praise;
- nits;
- unrelated observations;
- speculative refactoring ideas.

---

# Review Principle

Evaluate the cheapest broad invalidators before spending attention on narrower expensive questions.

```text
Intent
  ↓
Change Map
  ↓
Architecture
  ↓
Correctness
```

The review should answer four questions:

> **Did we consciously decide what to build?**

> **What structural route did the implementation take?**

> **Is that a route we want the codebase to continue taking?**

> **Does the implementation actually work?**
