# Examples

This directory contains the runnable reference surfaces for the public package.

- `next-demo/`: the primary home, docs, demo, and playground site. This is the main public-facing editing surface and uses the shared mobile-first shell.
- `react-demo/`: direct React adapter example using the same scene language and public controls hook.
- `solid-demo/`: Solid adapter example.
- `vanilla-demo/`: framework-free usage example.
- `shared/`: shared content, styles, and React components that keep the examples visually aligned.
- `assets/`: source media used to derive the shared `/immersive/scene` frame set.

Start with `pnpm dev:landing` when you want one place to iterate on the docs, demo, and playground together.

Use `pnpm extract "<video-path>"` to rebuild the shared `/immersive/scene` folder across every example app.
