# immersive-scroll

A pnpm monorepo for immersive scroll storytelling, frame-sequence tooling, and cross-framework adapters. The public npm surface is a single package, `immersive-scroll`, which now ships the React runtime, adapter entry points, typed controls helpers, and the CLI used to build frame assets.

## What ships

- `immersive-scroll`: public package with React exports at the root plus `next`, `solid`, and `web` subpath entry points.
- `@immersive-scroll/svg-mask`: standalone package for high-performance scroll-driven SVG reveal effects.
- `immersive-scroll` CLI: bundled frame extraction, validation, repair, manifest, hash, and diagnostics tooling.
- `examples/next-demo`: the primary docs, demo, and playground surface with the shared mobile-first shell.
- Internal workspace packages under `packages/` that keep the engine, adapters, shared types, and CLI implementation organized for future expansion.

More detail for each package lives in [packages/README.md](packages/README.md).

## Quick start

Install the package, then build a frame set:

```bash
pnpm add immersive-scroll gsap
npx immersive-scroll extract ./assets/story.mp4 ./public/immersive/story --clean
```

Inside this repo, the shortest asset path is:

```bash
pnpm extract "./examples/assets/wildrobot.mp4"
```

That wrapper auto-selects `24` or `30` fps, converts to WebP, and rewrites every example app to the shared `/immersive/scene` asset folder.
Long clips are automatically capped to roughly `250` frames, scaled to landing-page dimensions, and tuned for WebP size/quality so a multi-minute source does not explode into thousands of frames.

```tsx
import {
  ImmersiveScrollytelling,
  type ScrollytellingStep
} from 'immersive-scroll';

const narrativeSteps: ScrollytellingStep[] = [
  {
    id: 'hero',
    start: 0.0,
    end: 0.15,
    placement: 'center',
    content: <h1>The Pinnacle of Engineering.</h1>
  },
  {
    id: 'disassembly',
    start: 0.15,
    end: 0.4,
    placement: 'left',
    content: <p>Perfect harmony in every layer.</p>
  }
];

export function HeroStory() {
  return (
    <ImmersiveScrollytelling
      framesPath="/immersive/story"
      steps={narrativeSteps}
    />
  );
}
```

The `ImmersiveScrollytelling` component wraps our core canvas engine with `framer-motion`, giving you an out-of-the-box "Apple-style" presentation. It natively supports opacity mapping and dynamic text positioning synced perfectly to your user's scroll wheel!

### SVG Mask Reveal

For cinematic reveals of foreground layers over background layers (inspired by Lightship RV), use the standalone `@immersive-scroll/svg-mask` package:

```tsx
import { ImmersiveSvgMask } from '@immersive-scroll/svg-mask';

export function RevealSection() {
  return (
    <ImmersiveSvgMask
      scrollDistance={2000}
      background={<div className="bg-static">Static Layer</div>}
      foreground={<div className="fg-premium">Premium Revealed Content</div>}
    />
  );
}
```

The `ImmersiveScrollytelling` component wraps our core canvas engine with `framer-motion`, giving you an out-of-the-box "Apple-style" presentation. It natively supports opacity mapping and dynamic text positioning synced perfectly to your user's scroll wheel! Make sure to install `framer-motion` if you want to use this feature.

Pinned scenes default to a fixed full-screen viewport with an inset media layer. Use `viewportProps` or `mediaProps` only when you need a contained layout, custom offsets, or a different stacking order.

## Local development

```bash
pnpm install
pnpm dev:landing
pnpm ci:verify
```

Useful commands:

```bash
pnpm prepare:example-assets
pnpm extract "./examples/assets/wildrobot.mp4"
pnpm changeset
```

## Repository map

- [packages/](packages/README.md): publishable packages and their source layout.
- [examples/](examples/README.md): Next.js docs/demo/playground plus React, Solid, and vanilla runtime examples.
- [docs/](docs/README.md): written guides, API notes, architecture references, and troubleshooting docs.
- [scripts/](scripts/README.md): workspace build, clean, typecheck, test, and asset preparation scripts.
- [tests/](tests/README.md): unit, integration, e2e, fixtures, and setup coverage.
- [.github/](.github/README.md): GitHub Actions workflows plus release requirements.
- [.changeset/](.changeset/README.md): versioning metadata used by the release workflow.

## Release flow

1. Add a changeset with `pnpm changeset`.
2. Merge the change into `main`.
3. The release workflow opens or updates a version PR.
4. Merging that PR runs the publish job, rebuilds the workspace, and publishes public packages to npm.

The release workflow expects an `NPM_TOKEN` repository secret with publish access to `immersive-scroll`.
