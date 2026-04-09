# Scripts

Workspace automation lives here.

- `build-all.mjs`: build all workspace packages and examples.
- `clean-all.mjs`: remove generated output across the workspace.
- `dev-all.mjs`: launch the main development surfaces.
- `extract-video.mjs`: rebuild the shared example `/public/immersive/scene` asset from one local video path.
- `generate-barrels.mjs`: regenerate barrel exports when needed.
- `prepare-example-assets.mjs`: download or prepare demo assets and derived frame sequences.
- `run-examples.mjs`: run example-specific tasks.
- `test-all.mjs`: execute the workspace test matrix.
- `typecheck-all.mjs`: execute the workspace typecheck matrix.

The root `package.json` wraps these scripts behind stable commands such as `pnpm build`, `pnpm test`, and `pnpm typecheck`.

For the shared example asset flow, use:

```bash
pnpm extract "<video-path>"
```

That wrapper reads source fps, auto-selects `24` or `30`, converts the sequence to WebP, and rewrites each example app to `/public/immersive/scene`.
It also caps extraction at roughly `250` frames, keeps the full video duration, and auto-tunes resolution and WebP quality for landing-page usage.
