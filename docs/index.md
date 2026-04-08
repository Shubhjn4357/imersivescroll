# Immersive Scroll Video

Immersive Scroll Video turns a trimmed video clip into a pinned scroll scene with shared adapters for React, Next.js, Solid, and the DOM-first Web runtime.

## Landing Surface

The repo now uses a shared landing definition under `examples/shared/` so the example apps pull from the same story structure instead of maintaining separate hero copy and section layouts in each framework.

- Primary local dev surface: `pnpm dev:landing`
- Shared story data: `examples/shared/landing-content.ts`
- Shared presentation tokens: `examples/shared/landing.css`
- Shared React landing surface for Next and React: `examples/shared/react/ImmersiveLanding.tsx`

## Start Here

- [Installation](./getting-started/installation.md)
- [Quick Start for React](./getting-started/quick-start-react.md)
- [Quick Start for Next.js](./getting-started/quick-start-next.md)
- [Quick Start for Solid](./getting-started/quick-start-solid.md)
- [Quick Start for Vanilla](./getting-started/quick-start-vanilla.md)

## Core Guides

- [Frame Extraction](./guides/frame-extraction.md)
- [Custom Scrollbar](./guides/custom-scrollbar.md)
- [Performance Tuning](./guides/performance-tuning.md)
- [Reduced Motion](./guides/reduced-motion.md)
- [Common Errors](./troubleshooting/common-errors.md)
