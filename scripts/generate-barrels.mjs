import fs from 'node:fs';
import path from 'node:path';

const packages = ['shared', 'core', 'react', 'next', 'solid', 'web', 'cli'];

for (const packageName of packages) {
  const indexPath = path.join(process.cwd(), 'packages', packageName, 'src', 'index.ts');
  if (fs.existsSync(indexPath)) {
    console.log(`barrel exists: ${indexPath}`);
  }
}
