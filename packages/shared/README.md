# @immersive-scroll/shared

Shared contracts, constants, validators, and tiny utilities used by every package in the workspace. This is the lowest-level package and the right place for types and validation logic that must stay framework-neutral.

## Install

```bash
pnpm add @immersive-scroll/shared
```

## What it exports

- config types such as `ImmersiveConfig`, `PartialImmersiveConfig`, and `ScrollbarConfig`
- frame and manifest contracts including `ImmersiveFrameManifest`
- default config constants
- validators for config, manifest, and paths
- small utilities like `assert()`, `clamp()`, `debounce()`, `deepMerge()`, `lerp()`, `normalizePath()`, `range()`, `round()`, `safeJsonParse()`, and `toError()`

## Example

```ts
import {
  DEFAULT_IMMERSIVE_CONFIG,
  type ImmersiveFrameManifest,
  validateFrameManifest
} from '@immersive-scroll/shared';
```

## Use this package when

- you are authoring adapters or tooling around immersive manifests,
- you need shared types in app code,
- or you want validation without importing the runtime engine.
