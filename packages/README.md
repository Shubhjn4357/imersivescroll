# Packages

This directory contains the public package plus the internal implementation packages that back it.

- [`immersive-scroll/`](immersive-scroll/README.md): the only public npm package consumers need to install.
- [`shared/`](shared/README.md): internal shared types, validators, defaults, and small utilities.
- [`core/`](core/README.md): internal framework-agnostic engine and runtime primitives.
- [`react/`](react/README.md): internal React components, hooks, scrollbar, and debug UI.
- [`next/`](next/README.md): internal Next.js client wrappers around the React adapter.
- [`solid/`](solid/README.md): internal Solid primitives that mirror the shared immersive model.
- [`web/`](web/README.md): internal DOM API and custom-element registration for framework-free usage.
- [`cli/`](cli/README.md): internal frame extraction, manifest generation, validation, repair, hashing, and diagnostics.

Only `immersive-scroll` is published from the root release workflow. The remaining packages are private workspace modules.
