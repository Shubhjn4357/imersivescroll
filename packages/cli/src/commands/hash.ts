import { hashVideoSource } from '../core/hashVideoSource';

export async function runHashFlow(videoPath: string): Promise<void> {
  console.log(await hashVideoSource(videoPath));
}
