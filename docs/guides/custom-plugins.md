# Custom Plugins

A plugin can react to setup, ready, scroll, frame changes, resize, and destroy.

Good plugin patterns:

- push analytics events on section changes
- update decorative DOM layers
- bind progress to CSS custom properties
- register timelines for custom host UI

Avoid mutating unrelated global state inside plugins. Keep cleanup explicit.
