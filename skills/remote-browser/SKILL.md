---
name: remote-browser
description: Use when viewing a remote development app in a local browser over SSH or a Tailscale tailnet, especially when localhost URLs, separate API ports, or hot-reload WebSockets prevent direct remote access.
---

# Remote Browser

Make a remote app available in the human's local browser without rewriting its URLs. Prefer SSH local forwarding: browser-side `localhost` means the **browser's machine**, not the development machine.

## Workflow

1. **Locate both ends.** Identify the browser machine, development machine, and where agent commands execute. Typical setup: Mac browser, ThinkPad servers, SSH over Tailscale. Use a confirmed SSH alias or `user@tailnet-host`; ask for the working SSH command if unknown. Tailnet membership does not establish SSH access. If you cannot execute on the browser machine, give the human commands labeled for that machine; do not run them remotely or claim local verification.
2. **Discover the ports.** Inspect the project's run instructions, relevant config, server output, and browser network errors. Record the UI URL and every browser-requested API, redirect/callback, asset, or WebSocket/HMR origin. Forward only necessary ports, not server-to-server databases. Keep scheme, hostname, and port unchanged where hardcoded; `localhost` and `127.0.0.1` are different origins.
3. **Check readiness and conflicts.** Confirm remote listeners and a safe HTTP endpoint on the development machine. If starting the app was requested, use its documented command; otherwise ask before starting services. On the browser machine inspect required ports, e.g. `lsof -nP -iTCP:3000 -sTCP:LISTEN` on macOS. Identify any existing tunnel's destination and ownership before reusing it.
4. **Forward from the browser machine.** Use a dedicated, non-multiplexed SSH process with explicit loopback binds and the same local ports. Keep it running in a terminal or a managed background job whose identity and logs you retain.
5. **Verify from the browser machine.** Test a safe endpoint through each HTTP forward with a bounded timeout. Open the original UI URL in the human's browser (`open 'http://localhost:5173'` on macOS). Confirm API requests and WebSocket/HMR connections in browser network tools when available. For agent-driven browser inspection, use `playwright-cli` on the browser machine; a ThinkPad browser is not evidence of Mac access.
6. **Hand back ownership.** Report the URL, port mappings, tunnel location, exact checks/results, unverified items, and stop instructions. Leave the tunnel alive for the requested inspection; stop only this task's dedicated tunnel when asked or finished.

## Example — run on the Mac

Assume inspection established UI `5173`, API `3000`, and separate HMR `24678`. Replace `thinkpad` with the confirmed SSH destination; include only discovered ports.

```sh
ssh -S none -N -T \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 -o ServerAliveCountMax=3 \
  -L localhost:5173:127.0.0.1:5173 \
  -L localhost:3000:127.0.0.1:3000 \
  -L localhost:24678:127.0.0.1:24678 \
  thinkpad
```

`localhost` binds local loopback addresses; the destination `127.0.0.1` is resolved on the SSH server. Adapt that destination if the service listens only on IPv6 or behind a container-published port. `-S none` avoids sharing a pre-existing SSH master, so cleanup has a dedicated owner. Stop this foreground tunnel with **Ctrl-C**; for a managed job, terminate only its recorded process.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Local port occupied | Do not kill its owner. Another local port works only if all affected browser URLs are configurable; hardcoded `localhost:3000` will not use `13000`. Ask before stopping services or changing configuration. |
| UI loads, API/HMR fails | Inspect actual request URLs; forward missing browser-facing ports. TCP forwarding supports WebSockets without an extra proxy. |
| Tunnel starts, page fails | `ExitOnForwardFailure` checks forwarding setup, not remote service health. Check remote endpoint, then local endpoint, then browser. |
| `localhost` behaves differently from `127.0.0.1` | Inspect IPv4/IPv6 listeners and test with `curl -4` / `curl -6`; verify the family the browser uses reaches this tunnel, not another app. |
| TLS, CORS, OAuth, or custom hostname fails | Tunnels preserve TCP, not certificates or application policy. Diagnose the exact origin/redirect; ask before app, trust-store, hosts-file, or identity-provider changes. |

## Boundaries

- No public binds (`0.0.0.0`, `-g`), Tailscale Funnel, firewall changes, or disabled SSH host-key checks. Tailscale Serve and proxies change origins and are not automatic fallbacks.
- Do not edit source, environment files, SSH config, or install persistent tunnel services automatically.
- Do not stop unknown tunnels, reuse unknown listeners as evidence, or use broad cleanup such as `pkill ssh`. Closing the tunnel must not stop the app servers.
- A remote curl, a local HTTP response, and a verified working browser are distinct evidence. Never report one as another.
