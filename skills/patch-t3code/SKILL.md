---
name: patch-t3code
description: Use when updating or rebuilding a locally customized T3 Code desktop app, restoring Ovi's Gruvware appearance after upstream updates, or applying the saved Gruvware source patches on a new machine.
---

# Patch T3 Code

Produce a verified Gruvware desktop build from upstream source. These are compiled source changes, not runtime injection or installed-app edits. Default to the **latest stable GitHub release**, not `main`, unless the user requests another revision.

## References — read before acting

| Reference | Purpose |
| --- | --- |
| [Patch inventory](references/patches.md) | Provenance, required appearance, ordered patches, conflict handling |
| [Build and verification](references/build-and-verify.md) | Target selection, prerequisites, checks, packaging, isolated launch |
| [Theme JSON](references/t3code-gruvware.json) | Optional import through T3 theme settings; separate from source patches |

## Workflow

1. **Find the checkout.** Prefer the user's path, current project, then known worktrees and `~/Projects/t3code`. Historical location: `~/Projects/console-craft/t3code`; neither is guaranteed. On Windows resolve the actual home directory and native paths. Inspect Git remotes and `package.json` to confirm T3 Code. Ask if absent or ambiguous; propose cloning `https://github.com/pingdotgg/t3code.git` into an agreed, unused directory. Do not scan the entire disk.
2. **Inspect and protect.** Read that checkout's applicable `AGENTS.md` and build docs. Record branch, HEAD, tracked/untracked changes, index, and remotes. Never reset, clean, stash, stage, commit, or overwrite existing work automatically. The saved patches are the complete customization baseline; identify any newer local customization before proceeding and ask how to carry it forward.
3. **Resolve the update.** Read upstream's latest stable release metadata, fetch its exact tag from the verified upstream remote, and record its commit. If metadata/network access fails, report it rather than substituting `main` or claiming a cached release is latest. Create a uniquely named sibling worktree/branch at that tag. Leave the original checkout unchanged; use an existing worktree only after verifying its purpose and state.
4. **Apply in order.** Read the inventory; run `git apply --check` then `git apply` for **each** numbered patch, from the isolated checkout using absolute reference paths. Test each against the result of its predecessor. Inspect failures for already-applied, partial, or upstream-replaced behavior; never silently drop hunks.
5. **Confirm the build target.** Detect the host OS/architecture, but confirm the target OS, architecture, and artifact format if unspecified. Do not infer DMG/arm64 from these references. Follow the build reference using the selected release's current tooling.
6. **Verify and hand back.** Run focused checks, build, inspect the packaged payload, and launch the packaged app with disposable data. Report exact release/commit, patch status, target, commands/results, artifact paths, SHA-256, signing/notarization status, and unverified items. If launch is unavailable, call it built but **not launch-verified**. Theme import is allowed in the disposable test profile only. Do not install, replace the live app, change the user's actual settings/themes, or push without permission.

## Common mistakes

- Replaying only the original syntax commit misses later interface and packaging changes.
- The theme JSON does not replace the patches; renaming its file does not rename its internal theme identity.
- A successful package command, checksum, or signature does not prove the app starts.
- Official updates replace the compiled customization; re-run this workflow to rebuild it.
