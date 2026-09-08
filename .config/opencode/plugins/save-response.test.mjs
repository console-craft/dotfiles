import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

let createPlugin;
let importError;
try {
  ({ default: createPlugin } = await import("./save-response.js"));
} catch (error) {
  importError = error;
}

const directories = [];

test.afterEach(async () => {
  await Promise.all(directories.splice(0).map((path) => rm(path, { recursive: true })));
});

function user(id, text) {
  return {
    info: {
      id,
      sessionID: "session-1",
      role: "user",
      time: { created: 1 },
      agent: "build",
      model: { providerID: "openai", modelID: "test" },
    },
    parts: [{ id: `${id}-text`, sessionID: "session-1", messageID: id, type: "text", text }],
  };
}

function assistant(id, parentID, text) {
  const texts = Array.isArray(text) ? text : [text];
  return {
    info: {
      id,
      sessionID: "session-1",
      role: "assistant",
      time: { created: 2, completed: 3 },
      parentID,
      modelID: "test",
      providerID: "openai",
      mode: "build",
      path: { cwd: "/project", root: "/project" },
      cost: 0,
      tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
      finish: "stop",
    },
    parts: text === undefined
      ? []
      : texts.map((value, index) => ({
          id: `${id}-text-${index}`,
          sessionID: "session-1",
          messageID: id,
          type: "text",
          text: value,
        })),
  };
}

async function setup(messages) {
  assert.ifError(importError);
  assert.equal(typeof createPlugin, "function", "save-response plugin should exist");
  const directory = await mkdtemp(join(tmpdir(), "save-response-test-"));
  directories.push(directory);
  const client = {
    session: {
      messages: async ({ path, query }) => {
        if (path.id !== "session-1" || query.directory !== directory) {
          throw new Error("plugin requested the wrong session");
        }
        return { data: messages };
      },
    },
  };
  const hooks = await createPlugin({ client });
  const context = {
    sessionID: "session-1",
    messageID: "a2",
    agent: "build",
    directory,
    worktree: directory,
    abort: new AbortController().signal,
    metadata() {},
    async ask() {},
  };
  return { directory, save: (args) => hooks.tool.save_response.execute(args, context) };
}

const answer = "# Answer\n\n```js\nconsole.log(\"exact\");\n```";
const conversation = [
  user("u1", "Question"),
  assistant("a1", "u1", answer),
  user("u2", "/save conversation"),
  assistant("a2", "u2"),
];

test("response export preserves exact text and never overwrites an earlier save", async () => {
  const { directory, save } = await setup(conversation);

  await save({ scope: "response", format: "markdown" });
  await save({ scope: "response", format: "markdown" });

  const files = await readdir(directory);
  assert.equal(files.length, 2);
  assert.ok(files.every((name) => /^response-\d{8}-\d{9}(?:-\d+)?\.md$/.test(name)));
  assert.deepEqual(
    await Promise.all(files.map((name) => readFile(join(directory, name), "utf8"))),
    [answer, answer],
  );
});

test("conversation export contains visible roles but excludes the save turn", async () => {
  const { directory, save } = await setup(conversation);

  await save({ scope: "conversation", format: "markdown" });

  const [filename] = await readdir(directory);
  assert.equal(
    await readFile(join(directory, filename), "utf8"),
    `# Conversation\n\n> User:\n\nQuestion\n\n> Assistant:\n\n${answer}\n`,
  );
});

test("response export preserves OpenCode's separator between text parts", async () => {
  const { directory, save } = await setup([
    user("u1", "Question"),
    assistant("a1", "u1", ["First.", "Second."]),
    user("u2", "/save"),
    assistant("a2", "u2"),
  ]);

  await save({ scope: "response", format: "markdown" });

  const [filename] = await readdir(directory);
  assert.equal(await readFile(join(directory, filename), "utf8"), "First.\nSecond.");
});

test("HTML export renders Markdown with code2html --pretty", async () => {
  const { directory, save } = await setup(conversation);

  await save({ scope: "response", format: "html" });

  const [filename] = await readdir(directory);
  assert.match(filename, /^response-\d{8}-\d{9}\.html$/);
  assert.match(await readFile(join(directory, filename), "utf8"), /<h1[^>]*>Answer<\/h1>/);
});

test("HTML export prevents executable raw HTML", async () => {
  const rawScript = "<script>document.body.dataset.executed = 'yes'</script>";
  const { directory, save } = await setup([
    user("u1", "Question"),
    assistant("a1", "u1", rawScript),
    user("u2", "/save html"),
    assistant("a2", "u2"),
  ]);

  await save({ scope: "response", format: "html" });

  const [filename] = await readdir(directory);
  const html = await readFile(join(directory, filename), "utf8");
  const scriptIndex = html.indexOf("<script>");
  const policyIndex = html.indexOf("Content-Security-Policy");
  assert.ok(scriptIndex === -1 || (policyIndex !== -1 && policyIndex < scriptIndex));
});

test("response export fails without creating a file when no earlier response exists", async () => {
  const { directory, save } = await setup([
    user("u2", "/save"),
    assistant("a2", "u2"),
  ]);

  await assert.rejects(save({ scope: "response", format: "markdown" }), /No previous assistant response/);
  assert.deepEqual(await readdir(directory), []);
});
