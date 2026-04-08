# immersive-scroll-video

A pnpm monorepo for immersive scroll storytelling, frame-sequence tooling, and cross-framework adapters. The public npm surface is a single package, `immersive-scroll`, while the underlying engine and adapter layers stay internal to the workspace.

## Workspace packages

- `immersive-scroll`: public package with React exports at the root and `next`, `solid`, and `web` subpath entry points.
- `@immersive-scroll/shared`: internal shared types, config contracts, validators, and small utilities.
- `@immersive-scroll/core`: internal framework-agnostic engine, renderer lifecycle, stores, progress control, and plugin orchestration.
- `@immersive-scroll/react`: internal React adapter layer used by the public package.
- `@immersive-scroll/next`: internal Next.js client wrapper layer used by the public package.
- `@immersive-scroll/solid`: internal Solid adapter layer used by the public package.
- `@immersive-scroll/web`: internal imperative DOM adapter used by the public package.
- `@immersive-scroll/cli`: internal frame extraction, hashing, manifest, repair, validation, and diagnostics tooling.

More detail for each package lives in [packages/README.md](packages/README.md).

## Repository map

- [packages/](packages/README.md): publishable packages and their source layout.
- [examples/](examples/README.md): Next.js demo plus React, Solid, and vanilla runtime examples.
- [docs/](docs/README.md): written guides, API notes, architecture references, and troubleshooting docs.
- [scripts/](scripts/README.md): workspace build, clean, typecheck, test, and asset preparation scripts.
- [tests/](tests/README.md): unit, integration, e2e, fixtures, and setup coverage.
- [.github/](.github/README.md): GitHub Actions workflows plus release requirements.
- [.changeset/](.changeset/README.md): versioning metadata used by the release workflow.

## Local development

```bash
pnpm install
pnpm ci:verify
```

Useful commands:

```bash
pnpm dev:landing
pnpm prepare:example-assets
pnpm changeset
```

## Quick usage

### React

```tsx
import { ImmersiveLayer, ImmersiveScroll } from 'immersive-scroll';

export function HeroStory() {
  return (
    <ImmersiveScroll
      framesPath="/immersive/hero"
      config={{ scrollbar: { enabled: true, visibilityMode: 'manual' } }}
      overlay={<ImmersiveLayer>Scene chrome</ImmersiveLayer>}
    >
      <section>Foreground story content</section>
    </ImmersiveScroll>
  );
}
```

### Other entry points

```ts
import { NextImmersiveScroll } from 'immersive-scroll/next';
import { ImmersiveScroll as SolidImmersiveScroll } from 'immersive-scroll/solid';
import { createImmersiveInstance } from 'immersive-scroll/web';
```

## Release flow

1. Add a changeset with `pnpm changeset`.
2. Merge the change into `main`.
3. The release workflow opens or updates a version PR.
4. Merging that PR runs the publish job, rebuilds the workspace, and publishes public packages to npm.

The release workflow expects an `NPM_TOKEN` repository secret with publish access to `immersive-scroll`.
