K# Deployment

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

- `NPM_TOKEN`: npm token with access to publish `immersive-scroll`. Use a "Granular" or "Automation" token from npmjs.com.

### Custom GitHub Token (Optional)

By default, the workflow uses your repository's built-in `GITHUB_TOKEN`. However, if you want the automated release PRs to trigger CI checks, you should provide a custom token:

- `RELEASE_GITHUB_TOKEN`: A Personal Access Token (PAT) with `repo` scopes.

> [!IMPORTANT]
> If you do **not** provide a `RELEASE_GITHUB_TOKEN`, you **must** enable the following setting in your repository:
> **Settings > Actions > General > Workflow permissions > Allow GitHub Actions to create and approve pull requests**.
