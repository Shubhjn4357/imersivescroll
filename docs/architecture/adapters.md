# Adapters

Each adapter package maps the same engine contracts into a different host environment.

- React: provider, hooks, components, and composition-friendly overlays.
- Next: client-only wrapper around the React adapter.
- Solid: signal-backed wrapper around the core engine.
- Web: imperative DOM entry point and optional custom element.

When adding a new adapter, keep browser-only behavior inside the adapter and leave config, manifests, and frame math inside `core` or `shared`.
