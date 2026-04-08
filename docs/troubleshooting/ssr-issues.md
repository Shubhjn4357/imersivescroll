# SSR Issues

If you use immersive scroll in an SSR app, keep browser-only APIs behind a client boundary.

The safest path is:

- Next: use `NextImmersiveScroll` or `withImmersiveClientOnly`
- React SSR hosts: mount the component only after the client is ready
- never access `window` or `document` during module evaluation in shared packages
