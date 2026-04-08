import { Command } from 'commander';
import { runDoctorFlow } from './commands/doctor';
import { runExtractFlow } from './commands/extract';
import { runHashFlow } from './commands/hash';
import { runManifestFlow } from './commands/manifest';
import { runRepairFlow } from './commands/repair';
import { runValidateFlow } from './commands/validate';

const program = new Command();

program
  .name('immersive-scroll')
  .description('CLI for immersive scroll frame workflows');

program
  .command('extract')
  .argument('<video>')
  .argument('<output-folder>')
  .option('--fps <number>', 'Extraction FPS', (value) => Number(value))
  .option('--format <format>', 'Frame format')
  .option('--quality <number>', 'Frame quality', (value) => Number(value))
  .option('--prefix <string>', 'Frame prefix')
  .option('--overwrite', 'Overwrite output folder')
  .option('--clean', 'Clean output folder first')
  .action((video, outputFolder, options) =>
    runExtractFlow(video, outputFolder, options)
  );

program
  .command('validate')
  .argument('<frames-folder>')
  .action((framesFolder) => runValidateFlow(framesFolder));

program
  .command('repair')
  .argument('<video>')
  .argument('<frames-folder>')
  .option('--fps <number>', 'Extraction FPS', (value) => Number(value))
  .option('--format <format>', 'Frame format')
  .option('--quality <number>', 'Frame quality', (value) => Number(value))
  .action((video, framesFolder, options) =>
    runRepairFlow(video, framesFolder, options)
  );

program
  .command('manifest')
  .argument('<frames-folder>')
  .action((framesFolder) => runManifestFlow(framesFolder));
program
  .command('hash')
  .argument('<video>')
  .action((video) => runHashFlow(video));
program.command('doctor').action(() => runDoctorFlow());

void program.parseAsync(process.argv);
