# Build and verify on the selected machine

## Establish the target and prerequisites

Detect the host OS and CPU (including emulation where relevant), then confirm the **target** OS, architecture, and artifact format when the user has not specified them. Ask one concise question offering the host-native target first. An ARM64 Windows machine does not imply an x64 installer; macOS history does not imply a DMG. Do not promise cross-compilation: native modules, Rust, platform SDKs and signing may require the target host.

Read the chosen release's `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, build docs, root/workspace manifests, lockfile, and `scripts/build-desktop-artifact.ts` before choosing commands. Use that revision's declared Node/package-manager versions. Discover existing `vp`, Node, Rust and required native/packaging tools; explain missing prerequisites and obtain approval before installing system tooling. Do not blindly source another machine's `~/.config/vite-plus/env` or run shell installers copied from historical notes.

Use the repository's dependency installation command in the isolated worktree (originally `vp i`); do not rewrite the lockfile to bypass dependency failures. Follow any setup-in-progress markers before starting a second install. Select environment changes only for your child process or restore the shell afterwards.

## Checks before packaging

- Inspect `git diff --check` and the final diff against the chosen upstream tag, including any semantic port.
- Run the current changed-file checks and focused tests required by repository instructions. At the original base these include `vp run check:changed` and:

  ```text
  vp test run apps/web/src/lib/syntaxHighlighting.test.ts apps/web/src/components/composerCodeBlockHighlight.test.ts scripts/build-desktop-artifact.test.ts
  ```

  Discover adjacent theme/diff tests in the selected release and include relevant ones. Use scoped lint, format and type checks as prescribed there. Report failures by name, including unrelated ones; do not disable tests to make the build pass. Run broader suites only when requested or required by applicable instructions.
- Verify both light and dark syntax registration, theme selection, composer expectations, and worker integration. Test the packaging regressions, including rejection of missing desktop entries. For manually ported logic add focused regression coverage; for palette-only changes use computed colors and a visual pass rather than brittle markup tests.
- Build in a tree without your dev watcher writing the same output directories. Stop only processes you started and tracked, never kill by name/pattern or disrupt the user's running app/server. Interference from a watcher was suspected in an earlier incomplete build, not proven.

Unset inherited `ELECTRON_RUN_AS_NODE` for packaging/tests and launches: it makes Electron behave as Node and can cause misleading cross-architecture failures. Do this in the child environment, or use shell-appropriate temporary cleanup (POSIX `env -u`; PowerShell remove the environment entry and restore it in `finally`). Also inspect inherited development URLs, `NODE_OPTIONS`, and build/signing overrides rather than letting them contaminate a release build. Do not print secret values.

## Package using current scripts

Read CLI help and current script definitions. At the original base the generic entry is `vp run dist:desktop:artifact --help`; it accepts explicit `--platform`, `--arch`, `--target`, `--build-version`, `--output-dir`, and `--keep-stage` options. Revalidate these against the chosen release.

| Confirmed target | Original platform/target values (not defaults) |
| --- | --- |
| macOS | `--platform mac --target dmg` (also emits ZIP); explicit supported architecture |
| Windows | `--platform win --target nsis`; explicit supported architecture |
| Linux | `--platform linux --target AppImage`; confirm format/architecture support |

Use the release version resolved from the selected tag, not a hard-coded `0.1.6` or a possibly stale workspace manifest. The original base contained manifests reporting `0.1.5`; explicit `--build-version 0.1.6` corrected its packaged version. Verify how future tags map to valid build versions rather than stripping arbitrary suffixes.

Write into a unique candidate output directory and retain the stage/logs for payload inspection. Do not overwrite a previously verified artifact. Avoid exposing credentials or publishing builds: no release/upload/install action is authorized by this skill.

## Inspect the artifact, then launch the packaged app

**A green build is not a launch test.** A previous checksum/signature-valid DMG could not start because `./main.cjs` was absent. The saved packaging patch guards against recurrence on macOS; inspect equivalent Windows/Linux payloads too.

1. Confirm artifact existence, target architecture, selected version, and expected contents using platform tools. Inspect `app.asar`/unpacked resources with the repository's installed ASAR tooling. At the original base, essential entries include `apps/desktop/dist-electron/{boot,compileCache,main,preload}.cjs`, the server bundle, web assets and referenced worker bundles. Follow the current Electron `main` and build manifest if upstream reorganizes them. Do not treat old filenames as permanent architecture.
2. Check installer/archive integrity and signatures using host tooling. Local macOS builds use ad-hoc identity `-`, without hardened runtime; this is **not Developer ID signing or Apple notarization**. Verify the actual result, do not infer signing from build configuration. Report Windows unsigned status/SmartScreen implications if applicable; never disable OS security or use secret credentials without authorization.
3. Mount/extract into an owned temporary location without running the installer against the live install. Launch the **packaged executable**, not `vp dev`, a source entry, or only Electron `--version`. If the format cannot be safely unpacked/launched on this host, stop at the verified build and state the remaining target-host test.
4. Before starting it, inspect the selected release's desktop user-data resolution and establish **both** disposable T3 state and disposable Electron profile paths. See isolation below. No existing credentials, projects, conversations, scheduled jobs, or database should be needed. Disable auto-update in the test process using the supported setting (originally `T3CODE_DISABLE_AUTO_UPDATE=1`).
5. Capture process logs and wait for the actual packaged UI and local backend connection to become ready, with bounded deadlines and early-exit handling. Verify no missing-module/worker errors, blank window, backend failure, or premature exit. A sidebar alone is insufficient to prove backend readiness: confirm the local connection's ready state or equivalent health evidence. Do not require a real paid provider turn or sign-in.
6. Check the appearance checklist in `patches.md` in the packaged app, including file Markdown as well as chat, code/diffs, and light mode. Use test-only fixtures or computed-style specimens in the isolated profile when real content is unavailable; distinguish this from exercising actual component states. Import the supplied JSON into **only that disposable profile** if needed for theme-role validation. Record any surface not exercised.
7. Close only the app/backend processes you spawned, by tracked handles/PIDs. Preserve logs, unmount your test mounts and clean only owned disposable paths after inspection. Compute SHA-256 for each delivered artifact with a native tool or standard library, and report its absolute path and verification results. Do not install it or replace the live app automatically.

### User-data isolation is platform-specific

`T3CODE_HOME` isolates backend state but **does not by itself isolate Electron's production profile**. Originally, the production profile was resolved separately as `t3code-v2` beneath Electron's app-data directory, and Windows could migrate legacy `Local State`. A Chromium `--user-data-dir` argument may be overridden by the app's explicit `setPath`; inspect the current source rather than trusting that switch.

- **macOS:** the original app honored a disposable `HOME` for `Library/Application Support/t3code-v2`; set a separate disposable `T3CODE_HOME` too. Confirm that resolution before launch on the selected release.
- **Linux:** inspect Electron/T3 resolution; use disposable `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME` and `T3CODE_HOME` as applicable, while retaining the display/session access needed to launch.
- **Windows:** inspect how Electron resolves app data; a temporary `HOME` alone is not sufficient. Use disposable `USERPROFILE`, `APPDATA`, `LOCALAPPDATA` and `T3CODE_HOME` only after confirming they redirect the selected app's paths. If OS-known-folder resolution still reaches real data, use a sandbox/disposable user or ask for a safe test environment instead of guessing.

Clear inherited dev-server URLs, startup tokens, forced ports and Electron-as-Node settings in the smoke-test child environment. Do not reuse a production connection or running app instance. Confirm the paths are temporary **before launch**; if isolation cannot be established, do not launch and report the blocker. Never test migrations against the live database.
