# immersive-scroll

CLI for preparing and validating immersive scroll assets. This package turns source video into deterministic frame folders and manifests that the runtime packages can consume directly.

## Install

```bash
pnpm add immersive-scroll
```

Or run it without adding it to your app:

```bash
npx immersive-scroll --help
```

Inside this monorepo, the simplest example-asset workflow is:

```bash
pnpm extract "<video-path>"
```

That wrapper rebuilds every example app's shared `/public/immersive/scene` folder automatically.

## Commands

- `extract <video> <output-folder>`: extract frames, write a manifest, and generate a frame index.
- `validate <frames-folder>`: validate an existing frame directory and return a machine-readable report.
- `repair <video> <frames-folder>`: regenerate frames for a broken or incomplete folder.
- `manifest <frames-folder>`: print the resolved manifest JSON for a folder.
- `hash <video>`: print the content hash for a source video.
- `doctor`: print Node, platform, temp directory, and `ffmpeg` availability details.

## Examples

```bash
immersive-scroll extract ./assets/story.mp4 ./public/immersive/story --clean
immersive-scroll extract ./assets/story.mp4 ./public/immersive/story --max-frames 180 --clean
immersive-scroll validate ./public/immersive/story
immersive-scroll doctor
```

## Notes

- `ffmpeg-static` is bundled, so the default flow does not require a separately installed system `ffmpeg`.
- Extraction now defaults to roughly `250` frames, auto-lowers fps for long videos, scales oversized footage to landing-page dimensions, and tunes WebP quality automatically.
- The CLI writes manifests that match the contracts exported by `@immersive-scroll/shared`.
- The package is designed for build pipelines and local authoring tools, not browser usage.
