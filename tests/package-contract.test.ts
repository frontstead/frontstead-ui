import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("publishes every component source as an explicit subpath", async () => {
  const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")) as {
    exports: Record<string, unknown>;
  };
  const expected = [
    "alert", "alert-dialog", "avatar", "badge", "button", "calendar", "card", "checkbox",
    "command", "date-time-picker", "dialog", "dropdown-menu", "empty", "form-message", "input",
    "label", "native-select", "popover", "scroll-area", "select", "selection-card", "separator",
    "sheet", "skeleton", "spinner", "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip",
  ];

  for (const component of expected) assert.ok(manifest.exports[`./${component}`]);
  for (const owned of ["./cn", "./theme", "./preset.css", "./palette.css"]) {
    assert.ok(manifest.exports[owned]);
  }
});
