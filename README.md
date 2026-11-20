# @frontstead/ui

Accessible React 19 primitives plus the shared Tailwind 4 token contract and
build-time theme compiler.

## Install

```sh
npm install @frontstead/ui react react-dom tailwindcss tw-animate-css
```

Import the structural preset and the default palette once in the application CSS:

```css
@import "@frontstead/ui/preset.css";
@import "@frontstead/ui/palette.css";

@source "../node_modules/@frontstead/ui/dist";
```

Then import components from the root or an explicit subpath:

```tsx
import { Button } from "@frontstead/ui/button";
```

Use `compileThemeCss` from `@frontstead/ui/theme` at build time to replace the
default palette with validated application colors. See [DESIGN.md](docs/DESIGN.md).
