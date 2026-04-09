# Changesets

This directory stores the version metadata used by the release workflow.

## Everyday flow

```bash
pnpm changeset
```

That command creates a markdown file here describing which packages changed and how they should be versioned.

## Release flow

- Changeset files merged into `main` cause the release workflow to open or update a release PR.
- Merging the release PR runs `pnpm release:ci`, which rebuilds the workspace and publishes public packages to npm.
- If your repository blocks pull-request creation from the default GitHub Actions token, add a `RELEASE_GITHUB_TOKEN` secret with a PAT that can create PRs, or enable the repository setting that allows GitHub Actions to create and approve pull requests.

Do not edit `config.json` casually. It controls the shared versioning and publish behavior for the whole monorepo.
