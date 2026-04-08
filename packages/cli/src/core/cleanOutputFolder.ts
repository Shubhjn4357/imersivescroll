import { removeDir } from '../io/removeDir';
import { createOutputFolder } from './createOutputFolder';

export async function cleanOutputFolder(folderPath: string): Promise<void> {
  await removeDir(folderPath);
  await createOutputFolder(folderPath);
}
