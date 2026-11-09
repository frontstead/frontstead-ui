import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/*.tsx", "src/cn.ts", "src/theme.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: true,
  target: "es2022",
  external: ["react", "react-dom"],
});
