---
name: patch-t3code
description: Use when checking for a new stable T3 Code release, building Ovi's customized Gruvcraft desktop app, or restoring its syntax highlighting and terminal ANSI colors after an upstream update.
---

# Patch T3 Code

Keep the app patch small: Gruvcraft syntax for light and dark and the two terminal ANSI palettes. The UI palette and CSS belong to the separate Gruvcraft theme JSON. Preserve the official install, live data, and unrelated work.

## References

- [Patch inventory](references/patches.md): replay, conflicts, and acceptance checks.
- [Build and verification](references/build-and-verify.md): target, packaging, isolated launch, and the [last-verified build record](references/last-verified.md).
- [Gruvcraft theme JSON](../../t3code-gruvcraft.json): resolve from this skill's real dotfiles directory if loaded through a symlink. Import in the disposable profile only during testing.

## Check, build, verify

1. **Check upstream.** On [pingdotgg/t3code](https://github.com/pingdotgg/t3code), **Watch → Custom → Releases** is an optional alert and can include nightlies. Resolve stable independently with `gh api repos/pingdotgg/t3code/releases/latest --jq .tag_name`. Verify the upstream origin and exact tag commit (`git ls-remote <upstream> "refs/tags/<tag>" "refs/tags/<tag>^{}"`; prefer the peeled commit when present). If metadata is unavailable, stop rather than using `main` or claiming a cached tag is latest. Build a different revision only on explicit request.
2. **Decide whether to build.** Compare the requested OS, architecture and format against the last-verified record. If the latest stable tag/commit matches and the recorded artifact still matches its checksum, report it and stop unless explicitly asked to rebuild. A first build or missing artifact needs a build. A GitHub notification, an installed version, and a failed build are not verified baselines. For a check-only request, report the comparison; don't fetch or build.
3. **Protect the checkout.** Prefer the user's path, current project, known worktrees, then `~/Projects/t3code` or `~/Projects/console-craft/t3code`. If absent, ask before cloning the verified upstream into an unused path. Read applicable `AGENTS.md` and build docs. Record HEAD, branch, index, all changes, remotes, and worktrees. Use a new sibling worktree/branch at the verified tag. Never reset, clean, stash, stage, commit, or overwrite existing work automatically.
4. **Apply the minimum.** Check whether upstream supports the intended syntax and ANSI colors without patching. For each still-needed patch, run `git apply --check`, then apply it from the isolated worktree. On failure, a passing reverse check calls for semantic verification before skipping; if neither applies, inspect and port the needed behavior or stop on unexplained conflicts. Keep legacy appearance patches out of modern builds. Only carry the macOS signing fix when needed.
5. **Confirm target and verify.** Confirm OS, architecture, and artifact format if unspecified. Follow the build reference for the selected release. Keep the official updater feed out of the custom build; it would replace that app, not replay patches.
6. **Record and hand back.** Advance the last-verified record only after focused checks, payload/signature checks, and isolated launch all pass. Report the tag/commit, patch status, commands/results, artifact paths, SHA-256, signing/notarization and gaps. If launch was not verified, withhold a ready-to-install claim and do not advance the record. Never install, overwrite the live app, change live settings, or push without permission.
