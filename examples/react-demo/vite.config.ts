import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^immersive-scroll\/next$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/immersive-scroll/src/next.ts',
            import.meta.url
          )
        )
      },
      {
        find: /^immersive-scroll\/solid$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/immersive-scroll/src/solid.ts',
            import.meta.url
          )
        )
      },
      {
        find: /^immersive-scroll\/web$/,
        replacement: fileURLToPath(
          new URL('../../packages/immersive-scroll/src/web.ts', import.meta.url)
        )
      },
      {
        find: /^immersive-scroll$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/immersive-scroll/src/index.ts',
            import.meta.url
          )
        )
      }
    ]
  }
});
