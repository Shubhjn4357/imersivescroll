# immersive-scroll-video

A pnpm monorepo for immersive scroll storytelling, frame-sequence tooling, and cross-framework adapters. The repository keeps shared contracts, the core engine, UI adapters, examples, and release automation in separate directories so the system can scale without folding everything into one package.

## Workspace packages

- `@immersive-scroll/shared`: shared types, config contracts, validators, and small utilities.
- `@immersive-scroll/core`: framework-agnostic engine, renderer lifecycle, stores, progress control, and plugin orchestration.
- `@immersive-scroll/react`: provider, hooks, components, and packaged scrollbar/debug UI for React.
- `@immersive-scroll/next`: client-only wrappers for using the React adapter inside Next.js.
- `@immersive-scroll/solid`: Solid primitives for immersive scenes.
- `@immersive-scroll/web`: imperative DOM API and custom-element registration.
- `immersive-scroll`: CLI for extracting frames, hashing sources, generating manifests, validating folders, and running environment diagnostics.

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
import { ImmersiveLayer, ImmersiveScroll } from '@immersive-scroll/react';

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

### CLI

```bash
npx immersive-scroll extract ./assets/video.mp4 ./public/immersive/hero --clean
npx immersive-scroll validate ./public/immersive/hero
```

## Release flow

1. Add a changeset with `pnpm changeset`.
2. Merge the change into `main`.
3. The release workflow opens or updates a version PR.
4. Merging that PR runs the publish job, rebuilds the workspace, and publishes public packages to npm.

The publish workflow expects an `NPM_TOKEN` repository secret. Details live in [.github/README.md](.github/README.md).
