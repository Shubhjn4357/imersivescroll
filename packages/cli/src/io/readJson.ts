import { readFile } from 'node:fs/promises';

export async function readJson<TValue>(filePath: string): Promise<TValue> {
  return JSON.parse(await readFile(filePath, 'utf8')) as TValue;
}
