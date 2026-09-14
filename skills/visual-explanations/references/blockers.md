# Blockers and Agency Boundary

A failed interaction is not automatically a blocker. Inspect the snapshot, open collapsed navigation, search visible items, correct a selector, or try another obvious non-destructive route first.

Stop when the problem changes from "How do I navigate there?" to "The required state or prerequisite does not exist or is unavailable."

## Missing prerequisites

Examples include missing application data or fixtures, backend services, permissions, credentials, human authentication, tenant state, feature flags, configuration, dependencies, browser tooling, or any product state that must be manufactured.

Do not unblock the run by:

- seeding or altering databases,
- creating synthetic records,
- changing feature flags or configuration,
- modifying code,
- bypassing permissions or authentication,
- discovering or fabricating credentials,
- calling APIs to manufacture state,
- installing or upgrading CLIs, browsers, extensions, or dependencies,
- or invoking unrelated debugging or remediation workflows.

The user may prepare the state, provide access, explicitly begin a separate remediation workflow, or abandon that visual state. Do not choose for them during Visual Explanations.

## Pressure does not expand scope

| Rationalization | Required response |
| --- | --- |
| "The environment is disposable or the change is reversible." | Report the missing prerequisite and stop. |
| "A manager said to do whatever is necessary." | Authority does not turn explanation into remediation. |
| "The user authorized a global install." | Tool installation belongs to a separate setup workflow. |
| "The deadline is close." | Time pressure does not authorize mutation. |
| "I have already spent too long to stop." | Sunk cost does not expand agency. |
| "It is only one record, flag, or API call." | Manufacturing state is remediation regardless of size. |

## Blocked output

Report these six facts, then stop:

1. **Reached:** Last product state actually reached.
2. **Expected next:** State needed for the explanation.
3. **Blocked because:** Concrete missing prerequisite.
4. **Still known:** What code, diff, or other evidence establishes.
5. **Not visually confirmed:** Every final state not inspected.
6. **To continue:** Prerequisite that must become available, without satisfying it.

Example:

```text
I could not reach the final UI state.

Reached: Customers -> Contracts
Expected next: Open a Pending Renewal contract -> Renewal
Blocked because: No contract in that state exists in this environment.
Still known: RenewalPanel is rendered by the renewal flow.
Not visually confirmed: The Renewal screen and its visible changes.
To continue: A Pending Renewal contract must be made available.
```

A partial explanation with an explicit boundary is better than a complete-looking explanation based on guesses.
