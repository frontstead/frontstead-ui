# Design Contract

`preset.css` owns the structural Tailwind 4 mapping: semantic color names,
radii, fonts, dark-mode selection, and base styles. `src/theme.ts` is the single
source for default light and dark token values. `palette.css` is generated from
that source and checked byte-for-byte in tests and builds.

Application themes provide a required hex `primary`, optional semantic colors,
and an optional safe CSS radius. `compileThemeCss` validates input, emits stable
`:root` and `.dark` blocks, gamut-clamps colors, and selects accessible primary
and accent foregrounds.

Components use semantic classes only. Do not add customer names, assets,
product routes, or deployment-specific copy to this package.
