import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const result = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
  cwd: new URL("..", import.meta.url),
  encoding: "utf8",
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const [{ files }] = JSON.parse(result.stdout);
const paths = new Set(files.map(({ path }) => path));
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

for (const required of ["LICENSE", "NOTICE", "README.md", "package.json", "preset.css", "palette.css"]) {
  assert.ok(paths.has(required), `tarball is missing ${required}`);
}

for (const target of Object.values(manifest.exports)) {
  const entries = typeof target === "string" ? [target] : Object.values(target);
  for (const entry of entries) {
    assert.ok(paths.has(entry.replace(/^\.\//, "")), `tarball is missing export target ${entry}`);
  }
}

for (const path of paths) {
  const allowed =
    path.startsWith("dist/") ||
    path.startsWith("docs/") ||
    ["LICENSE", "NOTICE", "README.md", "package.json", "preset.css", "palette.css"].includes(path);
  assert.ok(allowed, `tarball contains a non-allowlisted path: ${path}`);
  assert.ok(!path.endsWith(".tsx"), `tarball contains TypeScript source: ${path}`);
  assert.ok(!path.endsWith(".ts") || path.endsWith(".d.ts"), `tarball contains TypeScript source: ${path}`);
  assert.ok(!path.endsWith(".map"), `tarball contains a source map: ${path}`);
  assert.ok(!path.endsWith(".tsbuildinfo") && !path.endsWith("metafile.json"), `tarball contains build metadata: ${path}`);
}

console.log(`Verified ${paths.size} allowlisted tarball files.`);
