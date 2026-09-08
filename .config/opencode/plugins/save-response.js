import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { tool } from "@opencode-ai/plugin";

const run = promisify(execFile);

function textOf(message) {
  return message.parts
    .filter((part) => part.type === "text" && !part.synthetic && !part.ignored)
    .map((part) => part.text)
    .join(message.info.role === "user" ? "\n\n" : "\n");
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

export default async ({ client }) => ({
  tool: {
    save_response: tool({
      description: "After an explicit user request, save the previous assistant response or visible conversation to the session directory",
      args: {
        scope: tool.schema.enum(["response", "conversation"]),
        format: tool.schema.enum(["markdown", "html"]),
      },
      async execute({ scope, format }, context) {
        const result = await client.session.messages({
          path: { id: context.sessionID },
          query: { directory: context.directory },
        });
        if (result.error) throw new Error("Could not read session messages");

        const messages = result.data ?? [];
        const currentIndex = messages.findIndex(({ info }) => info.id === context.messageID);
        const current = currentIndex === -1 ? undefined : messages[currentIndex];
        const triggerID = current?.info.parentID
          ?? messages.findLast(({ info }) => info.role === "user")?.info.id;
        const prior = (currentIndex === -1 ? messages : messages.slice(0, currentIndex))
          .filter(({ info }) => info.id !== triggerID)
          .map((message) => ({ role: message.info.role, text: textOf(message) }))
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
        const path = await writeUnique(context.directory, scope, extension, contents);
        return `Saved to ${path}`;
      },
    }),
  },
});
