---
name: sonarqube-verify
description: Validate locally changed source files with the SonarQube MCP server after implementing or modifying code.
---

# SonarQube verification

Use this skill near the end of an implementation turn, after normal project
formatters, linters, type checks, and focused tests have run.

## Goal

Analyze only relevant locally changed source files with the SonarQube MCP
server using the company's connected SonarQube rules.

This is local file analysis. It is not a SonarScanner run, a CI scan, or a
quality-gate lookup.

## Workflow

1. Determine which files were created or modified during the current task.
2. Keep only files supported by the SonarQube MCP analyzer.
3. Exclude generated files, vendored files, build output, lockfiles, and files
   unrelated to the current implementation.
4. Determine the correct SonarQube project key for each file.
5. Call `analyze_code_snippet` once for each selected file:
   - Pass the complete workspace-relative `filePath`.
   - Pass the exact `projectKey`.
   - Pass the appropriate language when the tool requires it.
   - Use the file's normal project scope.
6. Review the returned findings.
7. Fix findings caused by, exposed by, or directly relevant to the current
   change.
8. Re-run analysis only for files changed while fixing findings.
9. Report:
   - files analyzed
   - findings fixed
   - findings intentionally left unchanged, with reasons
   - files skipped, with reasons

## Important constraints

- Analyze complete files, not pasted diff fragments.
- Do not run a full-project scan.
- Do not use server-side issue search to verify local fixes. Server-side issues
  may remain stale until CI performs another analysis.
- Do not repeatedly analyze an unchanged file.
- Do not analyze every changed file blindly. Restrict analysis to supported
  source and configuration files relevant to the task.
- Do not suppress, disable, or ignore a rule merely to make verification pass.
- Do not modify unrelated legacy issues unless they block or directly intersect
  the current change.
- If no project-key mapping is known, ask for or discover the exact project key
  before analyzing files. Never guess from a project display name.
- If SonarQube MCP is unavailable, report that verification could not run rather
  than substituting SonarScanner or disabling TLS verification.

## Supported analysis route

Prefer `analyze_code_snippet` with a workspace-relative `filePath`. The MCP
workspace is mounted at `/app/mcp-workspace`, so file contents do not need to be
copied into the model context.

The tool analyzes the complete file even though its name mentions a snippet.
