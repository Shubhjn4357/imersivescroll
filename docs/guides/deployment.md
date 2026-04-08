# Deployment

Deployment rules are simple:

- build the packages you publish
- pre-extract frames during CI or your asset pipeline
- ship frame folders as static assets
- never try to write to deployed public directories from the browser runtime
- validate the manifest path after CDN rewrites or base-path changes
