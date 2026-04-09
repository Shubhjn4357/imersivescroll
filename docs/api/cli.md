# CLI API

Installing `immersive-scroll` now ships the CLI as well, so a single package install covers both the runtime and frame tooling.

Commands:

- `npx immersive-scroll extract <video> <output-folder>`
- `npx immersive-scroll validate <frames-folder>`
- `npx immersive-scroll repair <video> <frames-folder>`
- `npx immersive-scroll manifest <frames-folder>`
- `npx immersive-scroll hash <video>`
- `npx immersive-scroll doctor`

Inside this repo there is also a wrapper command:

```bash
pnpm extract "<video-path>"
```

That wrapper auto-selects `24` or `30` fps, converts to WebP, and rewrites each example app to the shared `/immersive/scene` asset folder.

The CLI uses `ffmpeg-static`, so the default flow does not rely on a global `ffmpeg` install.

By default, extraction is capped at `250` frames. The CLI lowers fps to preserve the full video duration inside that budget, auto-tunes WebP quality, and scales oversized footage down to landing-page dimensions. Pass `--max-frames 0` if you explicitly want to remove the cap.
