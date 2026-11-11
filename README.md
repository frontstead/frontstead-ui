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

## Fonts

The preset uses neutral package variables with system fallbacks. Consumers may
set them to any loaded font. To retain a Next.js Geist setup:

```css
:root {
  --frontstead-font-sans: var(--font-geist-sans);
  --frontstead-font-mono: var(--font-geist-mono);
}
```

## Development

Requires Node 20 or newer and npm. Releases use Node 22.14 or newer so npm trusted
publishing can mint provenance without a long-lived token.

```sh
npm install
npm test
npm run typecheck
npm run build
npm run tarball:verify
npm run consumer:test
```

The root barrel intentionally remains the component API. Utilities and theme
tooling use the explicit `@frontstead/ui/cn` and `@frontstead/ui/theme` paths.

## Releases

The manually dispatched `publish.yml` workflow uses npm trusted publishing and
the protected `npm` environment. Run `publish-candidate` first; it publishes the
package's exact version under the `candidate` tag and proves `latest` did not
move. After every private consumer passes against that exact version, run
`promote-latest` to move `latest` to the unchanged candidate and remove the
temporary tag. If npm accepts a publish but registry metadata propagation makes
the run fail afterward, use `verify-candidate`; it performs no mutation and checks
the candidate tag and provenance after the registry settles.

## Migrating From `@frontstead/tokens`

`@frontstead/ui` now owns the token contract. Replace imports mechanically:

```diff
- import { cn } from "@frontstead/tokens";
+ import { cn } from "@frontstead/ui/cn";

- import { compileThemeCss, defineTheme } from "@frontstead/tokens/theme";
+ import { compileThemeCss, defineTheme } from "@frontstead/ui/theme";

- @import "@frontstead/tokens/preset.css";
- @import "@frontstead/tokens/palette.default.css";
+ @import "@frontstead/ui/preset.css";
+ @import "@frontstead/ui/palette.css";
```

`@frontstead/ui/palette.default.css` remains as a compatibility alias. Utilities
and theme helpers are intentionally not added to the root component barrel, which
keeps component-only imports from loading build-time theme dependencies.
