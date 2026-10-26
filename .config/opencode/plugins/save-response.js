import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

function textOf(message) {
  if (message.type === "user") return message.text;
  if (message.type !== "assistant") return "";
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}

function timestamp() {
  const digits = new Date().toISOString().replace(/\D/g, "");
  return `${digits.slice(0, 8)}-${digits.slice(8, 17)}`;
}

async function writeUnique(directory, basename, extension, contents) {
  const stem = `${basename}-${timestamp()}`;
  for (let suffix = 0; ; suffix += 1) {
    const path = join(directory, `${stem}${suffix ? `-${suffix}` : ""}.${extension}`);
    try {
      await writeFile(path, contents, { flag: "wx" });
      return path;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
}

async function toHtml(markdown) {
  const directory = await mkdtemp(join(tmpdir(), "save-response-"));
  const source = join(directory, "response.md");
  try {
    await writeFile(source, markdown);
    const { stdout } = await run("code2html", ["--pretty", source], {
      maxBuffer: 10 * 1024 * 1024,
    });
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; form-action 'none'; style-src 'unsafe-inline'">
</head>
<body>
${stdout}
</body>
</html>
`;
  } catch (error) {
    throw new Error(`HTML conversion failed: ${error.message}`, { cause: error });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export function createSaveTool(readSession) {
  return {
    name: "save_response",
    description: "After an explicit user request, save the previous assistant response or visible conversation to the session directory",
    input: {
      type: "object",
      properties: {
        scope: { type: "string", enum: ["response", "conversation"] },
        format: { type: "string", enum: ["markdown", "html"] },
      },
      required: ["scope", "format"],
      additionalProperties: false,
    },
    async execute({ scope, format }, context) {
      const { info, messages, triggerID } = await readSession(context);
      if (info.id !== context.sessionID) throw new Error("Could not read the requested session");
      // Exclude the entire invoking turn, including assistant tool/skill preambles.
      const triggerIndex = messages.findIndex(({ id, type }) => id === triggerID && type === "user");
      if (triggerIndex === -1) throw new Error("Could not locate the save request in session history");
      const prior = messages.slice(0, triggerIndex)
        .map((message) => ({ role: message.type, text: textOf(message) }))
        .filter(({ text }) => text.length > 0);

      let markdown;
      if (scope === "response") {
        markdown = prior.findLast(({ role }) => role === "assistant")?.text;
        if (markdown === undefined) throw new Error("No previous assistant response to save");
      } else {
        if (prior.length === 0) throw new Error("No visible conversation to save");
        markdown = `# Conversation\n\n${prior
          .map(({ role, text }) => `> ${role === "user" ? "User" : "Assistant"}:\n\n${text}`)
          .join("\n\n")}\n`;
      }

      const extension = format === "html" ? "html" : "md";
      const contents = format === "html" ? await toHtml(markdown) : markdown;
      const path = await writeUnique(info.location.directory, scope, extension, contents);
      return { content: `Saved to ${path}` };
    },
  };
}

export async function readHistory(readPage, messageID) {
  const messages = [];
  const cursors = new Set();
  let cursor;
  for (;;) {
    const page = await readPage(cursor);
    messages.push(...page.data);
    if (page.data.some((message) => message.id === messageID) || page.data.length === 0) break;
    cursor = page.cursor.next;
    if (!cursor) break;
    if (cursors.has(cursor)) throw new Error("Session history pagination did not advance");
    cursors.add(cursor);
  }
  return messages;
}

export default {
  id: "save-response",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add(createSaveTool(async (context) => {
        const info = await ctx.session.get({ sessionID: context.sessionID });
        // The executing assistant message may not be durable yet. Capture the
        // invoking user message from the owning server before reading history.
        const recent = await ctx.session.context({ sessionID: context.sessionID });
        const current = recent.findIndex(({ id }) => id === context.messageID);
        const trigger = (current === -1 ? recent : recent.slice(0, current))
          .findLast(({ type }) => type === "user");
        if (!trigger) throw new Error("Could not locate the save request in session context");
        // Use context only for that boundary: it omits compacted history.
        // Read the actual text through the full, paginated public history API.
        // A private connection also supports standalone sessions.
        const messages = await readHistory(async (cursor) => {
          const query = new URLSearchParams({ order: "asc", limit: "200" });
          if (cursor) query.set("cursor", cursor);
          const { stdout } = await run(process.execPath, [
            "api", "GET", `/api/session/${encodeURIComponent(context.sessionID)}/message?${query}`, "--standalone",
          ], { maxBuffer: 64 * 1024 * 1024, timeout: 60000, signal: context.signal });
          return JSON.parse(stdout);
        }, trigger.id);
        return { info, messages, triggerID: trigger.id };
      }));
    });
  },
};
