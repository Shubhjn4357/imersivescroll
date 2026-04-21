import path from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDirectory = __dirname;

const unitAliasEntries = [
  {
    find: /^@immersive-scroll\/shared$/,
    replacement: path.resolve(rootDirectory, 'packages/shared/src/index.ts')
  },
  {
    find: /^@immersive-scroll\/core$/,
    replacement: path.resolve(rootDirectory, 'packages/core/src/index.ts')
  }
];

const integrationAliasEntries = [
  ...unitAliasEntries,
  {
    find: /^@immersive-scroll\/react$/,
    replacement: path.resolve(rootDirectory, 'packages/react/src/index.ts')
  },
  {
    find: /^@immersive-scroll\/next$/,
    replacement: path.resolve(rootDirectory, 'packages/next/src/index.ts')
  },
  {
    find: /^@immersive-scroll\/solid$/,
    replacement: path.resolve(rootDirectory, 'packages/solid/src/index.ts')
  },
  {
    find: /^@immersive-scroll\/web$/,
    replacement: path.resolve(rootDirectory, 'packages/web/src/index.ts')
  },
  {
    find: /^immersive-scroll\/next$/,
    replacement: path.resolve(
      rootDirectory,
      'packages/immersive-scroll/src/next.ts'
    )
  },
  {
    find: /^immersive-scroll\/solid$/,
    replacement: path.resolve(
      rootDirectory,
      'packages/immersive-scroll/src/solid.ts'
    )
  },
  {
    find: /^immersive-scroll\/web$/,
    replacement: path.resolve(
      rootDirectory,
      'packages/immersive-scroll/src/web.ts'
    )
  },
  {
    find: /^immersive-scroll$/,
    replacement: path.resolve(
      rootDirectory,
      'packages/immersive-scroll/src/index.ts'
    )
  },
  {
    find: /^@immersive-scroll\/svg-mask$/,
    replacement: path.resolve(rootDirectory, 'packages/svg-mask/src/index.ts')
  },
  {
    find: /^@immersive-scroll\/horizontal-scroll$/,
    replacement: path.resolve(
      rootDirectory,
      'packages/horizontal-scroll/src/index.ts'
    )
  }
];

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts']
        },
        resolve: {
          alias: unitAliasEntries
        }
      },
      {
        test: {
          name: 'integration',
          environment: 'jsdom',
          setupFiles: ['tests/setup/setupEnv.ts', 'tests/setup/setupDom.ts'],
          include: [
            'tests/integration/**/*.test.ts',
            'tests/integration/**/*.test.tsx'
          ]
        },
        resolve: {
          alias: integrationAliasEntries
        }
      }
    ]
  }
});
