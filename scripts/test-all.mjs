import { spawnSync } from 'node:child_process';

const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm';
const args =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', 'pnpm exec vitest run --workspace vitest.workspace.ts']
    : ['exec', 'vitest', 'run', '--workspace', 'vitest.workspace.ts'];

const result = spawnSync(command, args, {
  stdio: 'inherit'
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
