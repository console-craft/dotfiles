import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

let createSaveTool;
let readHistory;
let importError;
try {
  ({ createSaveTool, readHistory } = await import("./save-response.js"));
} catch (error) {
  importError = error;
}

const directories = [];

test.afterEach(async () => {
  await Promise.all(directories.splice(0).map((path) => rm(path, { recursive: true })));
});

function user(id, text) {
  return { id, type: "user", text, time: { created: 1 } };
}

function assistant(id, parentID, text) {
  return {
    id, type: "assistant", time: { created: 2, completed: 3 },
    content: text === undefined ? [] : (Array.isArray(text) ? text : [text])
      .map((text) => ({ type: "text", text })),
  };
}

async function setup(messages) {
  assert.ifError(importError);
  const directory = await mkdtemp(join(tmpdir(), "save-response-test-"));
  directories.push(directory);
  const tool = createSaveTool(async ({ sessionID }) => {
    assert.equal(sessionID, "session-1");
    return { info: { id: sessionID, location: { directory } }, messages, triggerID: "u2" };
  });
  const context = { sessionID: "session-1", messageID: "a2", signal: new AbortController().signal };
  return { directory, save: (args) => tool.execute(args, context) };
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


test("export excludes reasoning, tools, synthetic messages and save-turn preambles", async () => {
  const prior = assistant("a1", "u1", "Visible answer");
  prior.content.push({ type: "reasoning", text: "Private reasoning" }, { type: "tool", name: "read" });
  const { directory, save } = await setup([
    user("u1", "Question"), prior,
    { id: "synthetic", type: "synthetic", text: "Hidden instructions" },
    { id: "compact", type: "compaction", summary: "Summary must not replace history" },
    user("u2", "/save conversation"), assistant("preamble", "u2", "I will save that"),
    assistant("a2", "u2"),
  ]);
  await save({ scope: "conversation", format: "markdown" });
  const [filename] = await readdir(directory);
  assert.equal(await readFile(join(directory, filename), "utf8"),
    "# Conversation\n\n> User:\n\nQuestion\n\n> Assistant:\n\nVisible answer\n");
});

test("missing save request fails without guessing or writing a file", async () => {
  const { directory, save } = await setup([user("u1", "Question"), assistant("a1", "u1", "Answer")]);
  await assert.rejects(save({ scope: "response", format: "markdown" }), /Could not locate the save request/);
  assert.deepEqual(await readdir(directory), []);
});


test("history reads all pages through the active tool message in chronological order", async () => {
  const calls = [];
  const pages = {
    start: { data: [user("u1", "Old question"), assistant("a1", "u1", "Old answer")], cursor: { next: "older" } },
    older: { data: [{ id: "compact", type: "compaction" }, user("u2", "/save")], cursor: { next: "active" } },
    active: { data: [assistant("a2", "u2")], cursor: { next: "unused" } },
  };
  const messages = await readHistory(async cursor => {
    calls.push(cursor); return pages[cursor ?? "start"];
  }, "a2");
  assert.deepEqual(calls, [undefined, "older", "active"]);
  assert.deepEqual(messages.map(x => x.id), ["u1", "a1", "compact", "u2", "a2"]);
});


test("export works while the executing assistant message is not durable yet", async () => {
  const { directory, save } = await setup([user("u1", "Question"), assistant("a1", "u1", "Exact answer"), user("u2", "/save")]);
  await save({ scope: "response", format: "markdown" });
  const [filename] = await readdir(directory);
  assert.equal(await readFile(join(directory, filename), "utf8"), "Exact answer");
});
