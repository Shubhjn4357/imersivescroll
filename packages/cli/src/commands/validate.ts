import { validateExistingFrames } from '../core/validateExistingFrames';

export async function runValidateFlow(folderPath: string): Promise<void> {
  const report = await validateExistingFrames(folderPath);
  console.log(JSON.stringify(report, null, 2));
  if (!report.valid) {
    process.exitCode = 1;
  }
}
