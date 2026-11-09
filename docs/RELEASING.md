# Releasing

1. Use the Node version declared in `package.json` and install with `npm ci`.
2. Run `npm test`, `npm run typecheck`, `npm run build`, `npm run tarball:verify`,
   and `npm run consumer:test`.
3. Inspect the version, changelog or release notes, and `npm pack --dry-run`.
4. Publish only after the repository's npm trusted publisher is verified.

The repository intentionally has no publish workflow yet. Never add a token-based
publish secret as a substitute for trusted publishing.
