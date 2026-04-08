# Packages

This directory contains every publishable package in the monorepo.

- [`shared/`](shared/README.md): shared types, validators, defaults, and small utilities.
- [`core/`](core/README.md): framework-agnostic engine and runtime primitives.
- [`react/`](react/README.md): React components, hooks, scrollbar, and debug UI.
- [`next/`](next/README.md): Next.js client wrappers around the React adapter.
- [`solid/`](solid/README.md): Solid primitives that mirror the shared immersive model.
- [`web/`](web/README.md): DOM API and custom-element registration for framework-free usage.
- [`cli/`](cli/README.md): frame extraction, manifest generation, validation, repair, hashing, and diagnostics.

All packages are versioned through Changesets and published from the root release workflow.
