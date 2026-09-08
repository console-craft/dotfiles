---
name: save-response
description: Use when the user explicitly asks to save or export the previous assistant response or visible conversation, including through /save. Never invoke automatically.
disable-model-invocation: true
---

# Save Response

Save exact visible session text through the `save_response` tool. Never reconstruct a response or conversation from model context, because compacted messages may be missing.

## Workflow

1. Map the request to one `scope` and `format` value using the table below.
2. Call `save_response` exactly once.
3. Report the path returned by the tool. If it fails, report the error without creating a substitute export.

## Quick Reference

| Request | `scope` | `format` |
| --- | --- | --- |
| `/save` | `response` | `markdown` |
| `/save html` | `response` | `html` |
| `/save conversation` | `conversation` | `markdown` |
| `/save conversation html` | `conversation` | `html` |

Equivalent natural-language requests use the same mapping, regardless of word order. Do not add custom filenames or other options.

## Example

User: `Save the whole conversation as HTML.`

Call `save_response` with `scope: "conversation"` and `format: "html"`, then return its saved path.

## Common Mistakes

- Do not use `apply_patch`, shell redirection, or model recall to recreate message text.
- Do not include system instructions, tool activity, the triggering save request, or the save confirmation.
- Do not invoke this skill unless the user explicitly requests an export.
