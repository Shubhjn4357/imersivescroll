# Deployment

Deployment rules are simple:

- build the packages you publish
- pre-extract frames during CI or your asset pipeline
- ship frame folders as static assets
- never try to write to deployed public directories from the browser runtime
- validate the manifest path after CDN rewrites or base-path changes

## CI/CD

- GitHub Actions uses `.github/workflows/ci.yml` for verification and `.github/workflows/release.yml` for the Changesets release-PR flow.
- The repository release model is intentionally limited to two workflows: `ci` and `release`.

Required repository secret:

- `NPM_TOKEN`: npm token with access to publish `immersive-scroll` and the `@immersive-scroll/*` packages.
