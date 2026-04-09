# Frame Extraction Guide

Use one of these two flows depending on where you are working.

## Repo workflow

The default repo workflow is one command:

```bash
pnpm extract "<video-path>"
```

Example:

```bash
pnpm extract "examples/assets/wildrobot.mp4"
```

That root script:

1. reads the source video fps
2. caps the extraction to roughly `250` frames across the full video duration
3. auto-selects an effective fps, scales oversized footage to landing-page dimensions, and tunes WebP quality automatically
4. converts the sequence to WebP frames
5. rewrites every example app's `public/immersive` folder to `public/immersive/scene`
6. writes `manifest.json`, `frames.json`, and `SOURCE.md`

## Package workflow

If you are using the published package in your own app, run the shipped CLI directly:

```bash
pnpm exec immersive-scroll extract ./assets/story.mp4 ./public/immersive/story --clean
```

That keeps the output deterministic while letting you choose the destination folder yourself. If you do not pass `--fps` or `--quality`, the CLI now auto-optimizes them and caps extraction at `250` frames by default. Use `--max-frames 0` only if you intentionally want no cap.

If you want to restore the stock sample scene, run:

```bash
pnpm prepare:example-assets
```

That downloads the Coverr demo clip, trims it to `examples/assets/scene-source.mp4`, and rebuilds the shared `/immersive/scene` asset set.

Long videos no longer default to thousands of frames, but trimming the source clip is still the best way to keep story pacing tight and asset weight low.
