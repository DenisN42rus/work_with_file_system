const { program } = require('commander');

program.version('0.0.1')
  .requiredOption('-f, --folder [type]', 'Input sourse folder')
  .option(
    '-o, --output [type]',
    'Input output folder (default: "./dist")',
    './dist',
  )
  .option('-d, --delete', 'Delete source folder');

module.exports = program;