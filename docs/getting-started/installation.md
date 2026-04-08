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

The examples use a real stock clip that is downloaded from the web, trimmed locally, and converted into frame folders.

```bash
pnpm prepare:example-assets
```

This writes a trimmed MP4 to `examples/assets/ocean-scroll-demo.mp4` and frame sequences to each example's `public/immersive/ocean` folder.

## Validate the workspace

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Demo source

- Source clip: https://pixabay.com/videos/ocean-sea-waves-aerial-view-drone-201418/
- License summary: https://pixabay.com/service/license-summary/
