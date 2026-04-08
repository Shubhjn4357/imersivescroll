# Tests

The repository test suite is split by responsibility.

- `unit/`: low-level behavior for shared utilities and core runtime primitives.
- `integration/`: framework and adapter coverage.
- `e2e/`: scenario-level tests that exercise real app flows.
- `fixtures/`: static assets and sample inputs used across suites.
- `setup/`: shared test initialization and environment helpers.

Run the full matrix from the repository root with `pnpm test`.
