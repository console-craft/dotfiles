# Last verified custom builds

Paths are local to the build machine, not download URLs. An absent artifact or checksum mismatch is not a usable baseline. Update only the corresponding target after the full verification workflow passes.

| Target | Verified on | Stable tag | Upstream commit | Local artifact | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| macOS arm64 DMG | 2026-11-21 | `v0.1.11` | `59651c1761f6c63e9b6056839067066968e6a406` | `~/Downloads/T3-Code-Gruvcraft-0.1.11.qJ1YoU/T3-Code-0.1.11-arm64.dmg` | `6340e5712b5a8479ebc3e6e5b58a0b5451f33d5cf2f0cb53690e0f303d2063c3` |
| macOS arm64 ZIP | 2026-11-21 | `v0.1.11` | `59651c1761f6c63e9b6056839067066968e6a406` | `~/Downloads/T3-Code-Gruvcraft-0.1.11.qJ1YoU/T3-Code-0.1.11-arm64.zip` | `35ab5bb8f6bacdbcaee70e25c7034cdc75d070bb01024176b60be6961b9bafa6` |
| Linux x86_64 AppImage | 2026-11-21 | `v0.1.11` | `59651c1761f6c63e9b6056839067066968e6a406` | `~/Downloads/T3-Code-Gruvcraft-0.1.11-linux-x86_64.HuNW9e/T3-Code-0.1.11-x86_64.AppImage` | `3078ec1a1fa0bddcd5fb1d20e84cc3b72e29d50256b6c5de57710475d3dd4a42` |

Both macOS bundles passed strict signature and integrity checks and isolated launch. They are ad-hoc signed, not notarized. See `build.log`, `smoke.log`, `zip-smoke.log`, and `SHA256SUMS` in their artifact directory.

The unsigned Linux AppImage was built in an Ubuntu 24.04 container to satisfy the glibc ceiling. Its payload and isolated launch passed on Fedora, including composer syntax and terminal ANSI in both appearances. See `build-ubuntu.log`, `appimage-smoke.log`, and `SHA256SUMS` in its artifact directory.
