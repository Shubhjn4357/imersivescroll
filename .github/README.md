# GitHub automation

This directory contains repository templates and GitHub Actions workflows.

## Workflows

- `workflows/ci.yml`: installs dependencies, then runs typecheck, lint, test, and build on pull requests and pushes to `main`.
- `workflows/release.yml`: uses Changesets to open version PRs and publish public packages to npm after the version PR is merged.

## Required secrets

- `NPM_TOKEN`: npm token with permission to publish `immersive-scroll`.

## Release model

1. Add a changeset in a feature branch.
2. Merge to `main`.
3. The release workflow opens or updates a release PR with version bumps and changelog updates.
4. Merge that PR to publish the package to npm.

The release job also requests `id-token: write` so npm provenance can be attached during publish.
