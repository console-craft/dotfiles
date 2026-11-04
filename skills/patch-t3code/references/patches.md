# Patch inventory and replay

## Provenance

- Upstream: `https://github.com/pingdotgg/t3code.git`.
- Original base: `v0.1.6`, commit `2359643cffa6ba9ee84d6f2694b935de54a8013e`.
- Syntax commit: `ef38d339405a792cd86f3a79fce3cd3a0ccbff4b`.
- The other patches preserve subsequent tracked, uncommitted appearance and packaging edits from the original `override` checkout. Together they capture all 18 changed files relative to the base, not just the six committed files.
- These snapshots replay exactly on the original base. Newer releases may require a semantic port; compatibility with future upstream releases is not guaranteed.

## Ordered assets

| Order | Patch | Contents |
| --- | --- | --- |
| 1 | [0001-gruvware-syntax.patch](0001-gruvware-syntax.patch) | Light/dark syntax registration, shared theme selection, worker registration, readable-theme alias, syntax/composer tests (6 files) |
| 2 | [0002-gruvware-appearance.patch](0002-gruvware-appearance.patch) | Dark-only UI palette, Markdown/file previews, project initials, sidebar labels, diff and file-tree styling (10 files) |
| 3 | [0003-desktop-packaging.patch](0003-desktop-packaging.patch) | Local macOS ad-hoc signing, packaged desktop-entry checks, regression tests (2 files) |

Apply all three, including packaging on non-Mac hosts: that patch's macOS behavior is conditional, not a request to build for macOS. Do not add separate cherry-picks of the same changes.

## Update safely

Inspect first: `git status --short -uall`, `git diff --cached --stat`, `git branch --show-current`, `git rev-parse HEAD`, `git remote -v`, and `git worktree list`. Check the full diffs before classifying existing changes; do not assume every dirty file is ours. Fetch rather than `git pull` into the customized branch.

Discover the latest non-draft, non-prerelease release from GitHub's releases API or GitHub CLI, for example `gh api repos/pingdotgg/t3code/releases/latest --jq .tag_name`. Confirm the returned release/tag is the intended stable desktop release. Verify the remote URL before fetching. If `origin` is a fork, use an existing verified upstream remote or the canonical URL explicitly; do not silently rewrite remotes.

The following Git example works in common POSIX shells and PowerShell. Replace every `<...>` with a resolved value, keep paths quoted, and check every command's exit status before the next command. `-C` paths are absolute; the new sibling directory and branch must be unused.

```text
git -C "<checkout>" fetch "<verified-upstream>" tag "<release-tag>"
git -C "<checkout>" rev-parse "<release-tag>^{commit}"
git -C "<checkout>" worktree add -b "<unique-gruvware-branch>" "<new-sibling-worktree>" "<release-tag>"
git -C "<new-sibling-worktree>" apply --check "<references>/0001-gruvware-syntax.patch"
git -C "<new-sibling-worktree>" apply "<references>/0001-gruvware-syntax.patch"
git -C "<new-sibling-worktree>" apply --check "<references>/0002-gruvware-appearance.patch"
git -C "<new-sibling-worktree>" apply "<references>/0002-gruvware-appearance.patch"
git -C "<new-sibling-worktree>" apply --check "<references>/0003-desktop-packaging.patch"
git -C "<new-sibling-worktree>" apply "<references>/0003-desktop-packaging.patch"
git -C "<new-sibling-worktree>" diff --check
```

References are relative to the skill, **not the T3 checkout**. Resolve their absolute paths before changing directories. Preserve patch LF line endings when copying between machines; the skill's `.gitattributes` enforces this on checkout.

### If application fails

1. Stop before applying later patches; inspect the failed patch and current source.
2. Use `git apply --reverse --check "<patch>"` as evidence of an already-applied patch, then verify its intended behavior. A failed reverse check does not prove absence: changes can be partial or refactored.
3. If only part is present, reconcile the missing behavior in the isolated worktree. If upstream moved components or replaced theme APIs, trace current callers and port the same intent, retaining upstream fixes, accessibility, validation, and error handling.
4. Do not force an old file over upstream, use `--reject` and leave unexplained rejects, or skip a patch merely to get a green build. Avoid automatic three-way application: it can modify the index and leave conflicts.
5. Make straightforward equivalent adaptations in the isolated tree; ask if the port would change appearance/behavior or require dropping an override. Record adaptations and remaining gaps. Updating these saved assets requires separate permission; a build request does not authorize editing dotfiles.

Do not rebase the user's dirty branch. A fresh release worktree avoids duplicate application on an already-customized checkout. If local edits include newer customization not captured here, preserve them and resolve scope with the user rather than quietly reverting to this snapshot. Retain the build worktree and logs for inspection; remove only owned disposable resources, and never force-remove a dirty tree.

## Appearance acceptance checklist

Most additional appearance overrides are **dark-only**. Preserve the original light-mode behavior, except the intentional light syntax theme. Some dark overrides deliberately apply across themes; do not scope them only to the imported theme.

| Surface | Expected dark appearance |
| --- | --- |
| Shared syntax | `gruvware-dark`; comments `#695e55`, keywords/functions/operators `#d4be98`, variables `#b2ba8e`, strings `#bac584`, numbers `#d6b37b`, types `#e6d5ae`, punctuation `#eead83` |
| Standard text; targeted grouped project names, PR titles, Side chat and toolbar controls | `#e6d5ae` |
| Working; Markdown list markers and H2 | `#eead83` |
| Done; additions and inline code | `#bac584` |
| Modified indicators; Markdown links and linked-file chips | `#7daea3` |
| Deletions; H3 | `#de9880` |
| H1 / H4–H6 | `#d4a599` / `#d6b37b` |
| Added diff-line background | `#35381f` |
| File-tree hover | `#2a2928` |
| File selected/active lines and annotation/comment area | `#4c4641` |
| Project monograms | Muted per-color mappings in `index.css`, selected through `data-project-monogram` |

Inspect both chat Markdown (`[data-timeline-root] .chat-markdown`) and file Markdown (`.file-markdown-preview.chat-markdown`). Shared syntax selection/registration must reach the worker pool, diffs, file previews, and composer highlighting; Pierre viewer styles use existing `unsafeCSS` paths because document CSS alone cannot reach their shadow roots. Native OS menus are outside this customization.

## Theme import asset

[t3code-gruvware.json](t3code-gruvware.json) is an unchanged export of the supplied `~/Downloads/t3-workcraft.json`, with only its filename renamed. Its internal name remains `Gruvbox Material`, id `ovx-theme-4507abd34286`, version `1`, with a light base, dark variant, and collection metadata.

Offer it for import through the current T3 theme settings; do not import or activate it automatically in the user's profile. It provides editable theme roles, not the syntax/component/viewer source overrides. Neither this JSON nor the original dotfiles Gruvware palette is read by the compiled patches at runtime.
