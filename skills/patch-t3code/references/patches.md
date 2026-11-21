# Patch inventory and replay

- Upstream: `https://github.com/pingdotgg/t3code.git`.
- Gruvcraft patch base: `v0.1.11`, commit `59651c1761f6c63e9b6056839067066968e6a406`. Resolve the latest stable release each run; applicability to other tags is not assumed.

| Order | Patch | Required result |
| --- | --- | --- |
| 1 | [Gruvcraft syntax](0001-gruvcraft-syntax.patch) | Custom light/dark syntax for the composer, chat, files and diff workers. Preserve stock viewer foregrounds and readable `t3-light` raw diff colors. |
| 2 | [Gruvcraft terminal](0002-gruvcraft-terminal.patch) | Exact custom ANSI colors 0–15 in each appearance. Do not change the terminal theme's default text, background, selection or cursor. |
| 3 | [Local macOS signing](0003-gruvcraft-mac-signing.patch) | Ad-hoc sign the whole local app bundle without enabling hardened runtime. Apply for a local macOS target if upstream still skips the bundle seal; do not change developer-signed builds. |

Use the root [Gruvcraft theme file](../../../t3code-gruvcraft.json) for UI, Markdown, diff tints, and terminal default colors. No source appearance override is needed for those.

## Safe replay

1. Inspect `git status --short -uall`, `git diff --cached --stat`, `git branch --show-current`, `git rev-parse HEAD`, `git remote -v`, and `git worktree list`. Preserve unidentified edits; obtain a decision before trying to fold them into the build.
2. Fetch the resolved stable tag from the verified upstream, not a fork or `main`. Record `git rev-parse "<tag>^{commit}"`, then create a uniquely named sibling worktree/branch at the tag. See the worktree instructions for the platform.
3. For each required patch in order, run `git -C "<worktree>" apply --check "<absolute-patch-path>"`, then `git -C "<worktree>" apply "<absolute-patch-path>"`. Run `git diff --check` on the result. Keep patch LF endings and do not stage or commit the worktree automatically.
4. If forward-check fails, stop before the next patch. A successful `git apply --reverse --check` suggests the patch is already present: verify the expected behavior before skipping. A failed reverse check is not proof of absence. Inspect partial or upstream-equivalent code and port only the missing behavior without regressing upstream fixes. Stop and ask on an unexplained conflict or a change to the approved colors/surfaces. Do not force a patch, leave rejects or overwrite unrelated work.

## Acceptance checks

- Syntax: in both modes inspect chat fences, composer, file preview, and worker-rendered diffs. TypeScript comments are `#7c6f64` light and `#695e55` dark, and dark strings are `#bac584`. Keep `t3-light` raw diff colors and the stock viewer chrome.
- ANSI: test a representative swatch in each appearance and compare the complete mappings in the terminal browser test. Foreground, paper, cursor, selection and scrollbar remain controlled by the imported theme.
- Packaging: check the actual packaged entries and resource seal, then launch in an isolated profile. Never advance last-verified on a signed-but-unlaunchable artifact.

Save a semantic port back into these assets only when the user authorizes a skill/patch refresh, and check that the saved assets replay against a clean copy of the selected tag.
