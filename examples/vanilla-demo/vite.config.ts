import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'immersive-scroll': fileURLToPath(
        new URL('../../packages/immersive-scroll/src/index.ts', import.meta.url)
      ),
      'immersive-scroll/next': fileURLToPath(
        new URL('../../packages/immersive-scroll/src/next.ts', import.meta.url)
      ),
      'immersive-scroll/solid': fileURLToPath(
        new URL('../../packages/immersive-scroll/src/solid.ts', import.meta.url)
      ),
      'immersive-scroll/web': fileURLToPath(
        new URL('../../packages/immersive-scroll/src/web.ts', import.meta.url)
      )
    }
  }
});
