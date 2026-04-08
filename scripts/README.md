# Scripts

Workspace automation lives here.

- `build-all.mjs`: build all workspace packages and examples.
- `clean-all.mjs`: remove generated output across the workspace.
- `dev-all.mjs`: launch the main development surfaces.
- `generate-barrels.mjs`: regenerate barrel exports when needed.
- `prepare-example-assets.mjs`: download or prepare demo assets and derived frame sequences.
- `run-examples.mjs`: run example-specific tasks.
- `test-all.mjs`: execute the workspace test matrix.
- `typecheck-all.mjs`: execute the workspace typecheck matrix.

The root `package.json` wraps these scripts behind stable commands such as `pnpm build`, `pnpm test`, and `pnpm typecheck`.
