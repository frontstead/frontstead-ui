import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const scratch = fileURLToPath(new URL("../.tmp/consumer", import.meta.url));
const packDirectory = fileURLToPath(new URL("../.tmp/pack", import.meta.url));

function run(command: string, args: string[], cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" });
  assert.equal(result.status, 0, `${command} ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}

await rm(new URL("../.tmp", import.meta.url), { recursive: true, force: true });
await mkdir(scratch, { recursive: true });
await mkdir(packDirectory, { recursive: true });

const packOutput = run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", packDirectory]);
const [{ filename }] = JSON.parse(packOutput);
const tarball = `${packDirectory}/${filename}`;

run("npm", ["init", "--yes"], scratch);
run(
  "npm",
  [
    "install",
    "--ignore-scripts",
    tarball,
    "react@19",
    "react-dom@19",
    "tailwindcss@4",
    "@tailwindcss/cli@4",
    "tw-animate-css@^1.4.0",
    "typescript@^5.7.2",
    "@types/react@^19",
    "@types/react-dom@^19",
  ],
  scratch,
);

await writeFile(
  `${scratch}/consumer.mjs`,
  `import { Button } from "@frontstead/ui";\n` +
    `import { cn } from "@frontstead/ui/cn";\n` +
    `import { compileThemeCss } from "@frontstead/ui/theme";\n` +
    `if (typeof Button !== "function" || cn("px-2", "px-4") !== "px-4") process.exit(1);\n` +
    `if (!compileThemeCss({ palette: { primary: "#065f46" } }).includes(".dark")) process.exit(1);\n` +
    `await import.meta.resolve("@frontstead/ui/preset.css");\n` +
    `await import.meta.resolve("@frontstead/ui/palette.css");\n`,
);
await writeFile(
  `${scratch}/consumer.tsx`,
  `import { Button } from "@frontstead/ui/button";\n` +
    `import { defineTheme } from "@frontstead/ui/theme";\n` +
    `const theme = defineTheme({ palette: { primary: "#065f46" } });\n` +
    `export const example = <Button>{theme.palette.primary}</Button>;\n`,
);
await writeFile(
  `${scratch}/tsconfig.json`,
  JSON.stringify({ compilerOptions: { strict: true, noEmit: true, jsx: "react-jsx", module: "esnext", moduleResolution: "bundler", skipLibCheck: true }, include: ["consumer.tsx"] }),
);
await writeFile(
  `${scratch}/input.css`,
  `@import "@frontstead/ui/preset.css";\n` +
    `@import "@frontstead/ui/palette.css";\n` +
    `@source "./consumer.tsx";\n` +
    `@source "./node_modules/@frontstead/ui/dist";\n`,
);

run("node", ["consumer.mjs"], scratch);
run("node", ["node_modules/typescript/bin/tsc", "--project", "tsconfig.json", "--pretty", "false"], scratch);
run("node", ["node_modules/@tailwindcss/cli/dist/index.mjs", "-i", "input.css", "-o", "output.css", "--minify"], scratch);
const css = await readFile(`${scratch}/output.css`, "utf8");
for (const utility of [".bg-primary", ".border-border", ".animate-in"]) {
  assert.ok(css.includes(utility), `compiled consumer CSS is missing ${utility}`);
}
await rm(new URL("../.tmp", import.meta.url), { recursive: true, force: true });
console.log("Fresh consumer resolved runtime, declarations, component subpaths, and compiled Tailwind CSS.");
