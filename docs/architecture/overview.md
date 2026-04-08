# Architecture Overview

The repo is split into explicit layers:

- `shared`: config contracts, validators, utility functions, and manifest types.
- `core`: the framework-agnostic engine, renderers, stores, progress logic, and plugin orchestration.
- `react`, `next`, `solid`, `web`: adapter layers only.
- `cli`: offline frame preparation and diagnostics.

The examples consume the generated public frame folders rather than trying to write to browser-visible public directories at runtime.
