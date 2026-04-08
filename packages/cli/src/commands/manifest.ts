import { loadManifest } from '../manifest/loadManifest';

export async function runManifestFlow(folderPath: string): Promise<void> {
  console.log(JSON.stringify(await loadManifest(folderPath), null, 2));
}
