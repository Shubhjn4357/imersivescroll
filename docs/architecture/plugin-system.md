# Plugin System

Plugins receive a typed context with the resolved config, event bus, scroll store, frame store, renderer, and viewport snapshot.

Use plugins for:

- decorative overlays
- extra DOM reactions to progress
- analytics hooks
- timeline registration
- custom section activation

Keep plugins side-effect aware: they should fail clearly and clean up on destroy.
