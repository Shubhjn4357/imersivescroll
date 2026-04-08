import { spawnSync } from 'node:child_process';

const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm';
const args =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', 'pnpm -r --filter ./packages/* build']
    : ['-r', '--filter', './packages/*', 'build'];

const result = spawnSync(command, args, {
  stdio: 'inherit'
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
