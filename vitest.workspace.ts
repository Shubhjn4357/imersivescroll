import path from 'node:path';
import { defineWorkspace } from 'vitest/config';

const root = __dirname;

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      environment: 'node',
      include: ['tests/unit/**/*.test.ts']
    },
    resolve: {
      alias: {
        '@immersive-scroll/shared': path.resolve(root, 'packages/shared/src/index.ts'),
        '@immersive-scroll/core': path.resolve(root, 'packages/core/src/index.ts')
      }
    }
  },
  {
    test: {
      name: 'integration',
      environment: 'jsdom',
      setupFiles: ['tests/setup/setupEnv.ts', 'tests/setup/setupDom.ts'],
      include: ['tests/integration/**/*.test.ts', 'tests/integration/**/*.test.tsx']
    },
    resolve: {
      alias: {
        '@immersive-scroll/shared': path.resolve(root, 'packages/shared/src/index.ts'),
        '@immersive-scroll/core': path.resolve(root, 'packages/core/src/index.ts'),
        '@immersive-scroll/react': path.resolve(root, 'packages/react/src/index.ts'),
        '@immersive-scroll/next': path.resolve(root, 'packages/next/src/index.ts'),
        '@immersive-scroll/solid': path.resolve(root, 'packages/solid/src/index.ts'),
        '@immersive-scroll/web': path.resolve(root, 'packages/web/src/index.ts')
      }
    }
  }
]);
