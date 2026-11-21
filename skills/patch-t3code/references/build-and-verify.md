# Build and verify

## Prepare the selected target

- Confirm OS, CPU architecture, and artifact format. Use the target host or documented native toolchain; don't assume cross-compilation works. Ask before installing missing system tooling.
- Read the selected tag's `AGENTS.md`, build docs, manifests, and `scripts/build-desktop-artifact.ts`. Use its Node and package-manager versions. For `v0.1.11`, install in the isolated worktree with `vp i --frozen-lockfile`; don't rewrite the lockfile to make a patch build.
- Keep dev watchers out of the packaging tree. Stop only your own tracked processes. In each build/test child environment remove inherited `ELECTRON_RUN_AS_NODE`, development URL and `NODE_OPTIONS` overrides, and any signing/notarization settings not authorized for the build. Don't print credential values.

## Run focused checks and package

Run `git diff --check`, inspect the source diff, then run the tag's changed-file and focused checks. At `v0.1.11`:

```sh
vp run check:changed v0.1.11
vp test run apps/web/src/lib/{syntaxHighlighting,diffRendering,readableSyntaxTheme}.test.ts \
  apps/web/src/components/composerCodeBlockHighlight.test.ts \
  apps/web/src/components/ThreadTerminalDrawer.browser.test.tsx \
  scripts/build-desktop-artifact.test.ts
```

Pass the chosen tag to the changed-file check, not a stale `main`. If Chromium is missing, install the matching Playwright revision (at this tag, `vp exec playwright-core install chromium --only-shell` in `scripts/`) and rerun. Report failed checks; don't disable them.

Use `vp run dist:desktop:artifact --help` to confirm current arguments. Apple Silicon example:

```sh
env -u ELECTRON_RUN_AS_NODE -u T3CODE_DESKTOP_UPDATE_REPOSITORY -u GITHUB_REPOSITORY \
  vp run dist:desktop:artifact --platform mac --arch arm64 --target dmg \
  --build-version 0.1.11 --output-dir "$candidate_dir" --keep-stage
```

Use the chosen tag's release version, not a potentially stale workspace version. Create a new candidate directory, retain the build log, and don't overwrite a verified artifact. macOS `dmg` also emits ZIP at `v0.1.11`; for Windows/Linux verify the target and supported architecture in the current builder. Track long-running builds and wait for completion notifications, not polling.

The custom build must **not** have the official updater feed. The two repository overrides in the example can generate `Resources/app-update.yml`; inspect current builder defaults and check the actual output. An official update would replace the patched app. Do not change the stock app, live settings, or GitHub notification settings as part of a build.

## Verify the actual payload and launch

1. Check DMG/ZIP integrity, version and architecture. Mount or extract into an owned temporary location, not `/Applications`. Compute SHA-256 for each delivered artifact. On macOS run `codesign --verify --deep --strict "$app"` and inspect the signature; local identity `-` is ad-hoc, **not** Developer ID or notarization. A modified Electron executable alone can report `Signature=adhoc` with no valid bundle resource seal. Do not override Gatekeeper or change system security.
2. Inspect the candidate's ASAR with the release's tooling. At `v0.1.11` require nonempty `apps/desktop/dist-electron/{boot,compileCache,main,preload}.cjs` and `apps/server/dist/bin.mjs`. Follow the current main field and preload/server paths if they move. A successful builder self-check is not proof that Electron's entries are all present.
3. Before launching, trace Electron user data **and** T3 backend data to distinct disposable paths, not the running install. `T3CODE_HOME` alone does not isolate Electron. On macOS use a disposable `HOME` (profile at `Library/Application Support/t3code-v2` on this tag), separate `T3CODE_HOME`, clean startup environment, `T3CODE_DISABLE_AUTO_UPDATE=true`, and `--use-mock-keychain` **only for the test process**. Confirm the runtime Electron `userData` path before interacting. Do not run the upstream `v0.1.11` smoke script unchanged: it deliberately leaves Electron's `HOME` real. On Linux verify disposable `HOME` and XDG paths; on Windows verify known-folder redirection or use a disposable user/sandbox. If isolation is uncertain, do not launch.
4. Open the **packaged executable** and wait for the renderer and local backend. For `v0.1.11`, copy the repo's `scripts/fixtures/desktop-launch/statev2.sqlite` into disposable `T3CODE_HOME/userdata` and open the seeded thread. In an automated desktop test, the thread can be opened through the app's `#/<environmentId>/<threadId>` route when the sidebar is collapsed. Confirm `serverVersion` at `/.well-known/t3/environment` on the local backend URL from the desktop preload bridge. Use fixtures; don't sign in or start a paid provider turn.
5. Load the unchanged Gruvcraft JSON in the disposable profile and follow the appearance checks in [patches.md](patches.md). Check an actual syntax token and a rendered terminal swatch in both appearances. Report which file/diff/composer checks used real packaged UI versus focused tests and disclose any gaps. Don't present a failed launch as verified even if the bundle signs.
6. Close only tracked test processes and unmount the test volume. Keep checksums and logs with the artifact; clean only paths created for the test. Do not install or publish the candidate.

## Update the last-verified record

Use the target row in [last-verified.md](last-verified.md). Record the stable tag, upstream commit, architecture/format, dated artifact path and SHA-256 only after all required gates pass. Verify the file against the recorded SHA-256 before reusing a row. If the build fails, including failure to launch, leave the previous good record unchanged. An OS upgrade, new computer, moved file, or new artifact format may require a fresh build; a GitHub Releases notification is not build evidence.
