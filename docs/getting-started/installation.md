# Installation

## Prerequisites

- Node.js 20+
- pnpm 9+

## Install the workspace

```bash
pnpm install
pnpm build
```

## Prepare the demo assets

The examples read from a shared `/immersive/scene` folder in each app.

```bash
pnpm extract "examples/assets/wildrobot.mp4"
```

This auto-selects `24` or `30` fps from the source clip, converts the frames to WebP, and rewrites each example app's `public/immersive` folder with a fresh `scene` asset set.

To restore the shorter stock sample clip instead, run:

```bash
pnpm prepare:example-assets
```

That downloads the Coverr source clip, trims it to `examples/assets/scene-source.mp4`, and rebuilds the same `/immersive/scene` output.

## Validate the workspace

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Demo source

- Source clip: https://coverr.co/videos/close-up-of-a-futuristic-woman-with-digital-patterns-on-her-face
- License summary: https://coverr.co/license
