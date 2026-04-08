# @immersive-scroll/next

Client-only wrappers for using immersive scroll inside Next.js applications. This package keeps the integration surface explicit for App Router projects while reusing the React adapter underneath.

## Install

```bash
pnpm add @immersive-scroll/next
```

## Exports

- `NextImmersiveScroll`: client-only alias of the React `ImmersiveScroll` component.
- `NextImmersiveProvider`: client-only alias of the React provider.
- `createImmersiveDynamicComponent()`: helper for dynamic client-only loading.
- `ensureClient()` and `withImmersiveClientOnly()`: guards for client boundaries.

## Quick start

```tsx
'use client';

import { NextImmersiveScroll } from '@immersive-scroll/next';

export default function ProductHero() {
  return (
    <NextImmersiveScroll framesPath="/immersive/hero">
      <section>Story content</section>
    </NextImmersiveScroll>
  );
}
```

## Notes

- Use this package for Next-specific boundaries. For component APIs and hooks, the underlying source of truth is still `@immersive-scroll/react`.
- The package is intended for client components and client-only wrappers, not server rendering.
