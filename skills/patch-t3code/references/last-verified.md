# Last verified custom builds

Paths are local to the build machine, not download URLs. An absent artifact or checksum mismatch is not a usable baseline. Update only the corresponding target after the full verification workflow passes.

| Target | Verified on | Stable tag | Upstream commit | Local artifact | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| macOS arm64 DMG | 2026-11-21 | `v0.1.11` | `59651c1761f6c63e9b6056839067066968e6a406` | `~/Downloads/T3-Code-Gruvcraft-0.1.11.qJ1YoU/T3-Code-0.1.11-arm64.dmg` | `6340e5712b5a8479ebc3e6e5b58a0b5451f33d5cf2f0cb53690e0f303d2063c3` |
| macOS arm64 ZIP | 2026-11-21 | `v0.1.11` | `59651c1761f6c63e9b6056839067066968e6a406` | `~/Downloads/T3-Code-Gruvcraft-0.1.11.qJ1YoU/T3-Code-0.1.11-arm64.zip` | `35ab5bb8f6bacdbcaee70e25c7034cdc75d070bb01024176b60be6961b9bafa6` |

Both bundles passed strict signature and integrity checks and isolated launch. They are ad-hoc signed, not notarized. See `build.log`, `smoke.log`, `zip-smoke.log`, and `SHA256SUMS` in the artifact directory.
