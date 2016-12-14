#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const api = require('./api');

program
  .version(require('./package.json').version)
  .usage('[options]')
  .option('-e, --generate-config', 'Run interactive config generator')
  .option('-c, --config-file <config/user_config.json>', 'Configuration file with documentation root and path to the tree')
  .option('-r, --docs-root <path/to/docs>', 'The root of the docs')
  .option('-t, --tree-file <path/to/tree.json>', 'Path to the generated tree file')
  .option('-p, --port <3000>', 'Port to bind the server to')
  .parse(process.argv);

if (program.generateConfig) {
  require('./config-generator');
  return;
}

api(program.port, program.docsRoot, program.treeFile);
