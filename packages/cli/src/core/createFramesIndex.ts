import path from 'node:path';
import { writeJson } from '../io/writeJson';

export async function createFramesIndex(
  folderPath: string,
  frameFiles: string[]
): Promise<void> {
  await writeJson(path.join(folderPath, 'frames.json'), {
    frames: frameFiles.map((filePath) => path.basename(filePath))
  });
}
