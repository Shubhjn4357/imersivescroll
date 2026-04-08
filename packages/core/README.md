# @immersive-scroll/core

Framework-agnostic immersive engine primitives. Use this package when you need the scene lifecycle, frame manifest handling, progress math, and plugin hooks without committing to a specific UI framework.

## Install

```bash
pnpm add @immersive-scroll/core
```

## What it exports

- `createImmersiveEngine()`: create the headless engine instance.
- `normalizeImmersiveConfig()` and `mergeImmersiveConfig()`: resolve partial config safely.
- `createFrameStore()` and `createScrollStore()`: low-level state stores.
- `validateFrameManifest()` and `validateFrameDirectoryContract()`: manifest and asset integrity helpers.
- Shared types and utilities re-exported from `@immersive-scroll/shared`.

## Minimal example

```ts
import { createImmersiveEngine } from '@immersive-scroll/core';

const engine = createImmersiveEngine({
  config: {
    framesPath: '/immersive/story',
    scrollbar: { enabled: true }
  },
  container: document.querySelector('#scene'),
  targets: {
    canvas: document.querySelector('canvas')
  }
});

await engine.init();
await engine.updateProgress(0.35);
```

## Use this package when

- you are building a custom adapter or wrapper,
- you need plugin or renderer control outside the packaged UI layers,
- or you want runtime logic on the server or in tooling without React, Solid, or custom elements.
