#!/usr/bin/env node

const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const service = require('./service');
const spawn = require('child_process').spawn;

function lobby() {
  return inquirer.prompt([
    { type: 'input',
      name: 'configPath',
      message: 'Please, specify where to store the JSON config file:',
      validate: ans => path.parse(ans).ext !== '.json'
        ? 'It must the path to a .json file'
        : true }
  ]);
}

function config(lobbyAnswers) {
  let config = {};
  if (lobbyAnswers.configPath && fs.existsSync(lobbyAnswers.configPath)) {
    config = require('./' + lobbyAnswers.configPath);
  }
  return inquirer.prompt([
    { type: 'input',
      name: 'docsPath',
      message: 'Please, specify the absolute path to your documenation:',
      default: config.docsPath || '',
      validate: ans => (path.parse(ans).ext
        ? 'It must the path to the directory'
        : true) },
    { type: 'input',
      name: 'treePath',
      message: 'Please, specify the absolute path to the JSON file with the tree:',
      default: config.treePath || '',
      validate: ans => (path.parse(ans).ext !== '.json'
        ? 'It must the path to a .json file'
        : true) },
    { type: 'input',
      name: 'port',
      message: 'Please, the port on which to run the server:',
      default: config.port || '',
      default: '3000' }
  ]).then(as => [lobbyAnswers, as]);
}

function confirm(bothAs) {
  return inquirer.prompt([
    { type: 'confirm',
      name: 'looksGood',
      message: 'Does it look good?\n\n' + JSON.stringify(bothAs[1], null, 2) + '\n',
      default: 'Y' }
  ]).then(as => bothAs.concat(as));
}

function runTheServer(answers) {
  return answers !== null
    ? inquirer.prompt([
        { type: 'confirm',
          name: 'doRun',
          message: 'Should I run the server using the new config?',
          default: 'Y' }
      ]).then(as => {
        if (as.doRun) {
          const srv = spawn('npm', ['run', 'api', '--config-file', answers[0].configPath]);
          srv.stdout.on('data', data => console.log(`${data}`));
          srv.stderr.on('data', data => console.log(`${data}`));
          srv.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          });
          return 'Running the server ...'
        } else {
          return 'Run it like this: npm run api -c <path/to/config.json>';
        }
      })
    : 'Buy';
}

lobby().then(config).then(confirm).then(answers => {
  const configPath = answers[0].configPath;
  const config = answers[1];
  const looksGood = answers[2].looksGood;

  if (looksGood) {
    service.saveOutput(path.resolve(__dirname, configPath), config)
  } else {
    return null;
  }

  return answers;

})
.then(answers => {
  if (answers !== null) {
    console.log('JSON file has been successfully saved to ' + answers[0].configPath);
  }
  return answers;
})
.then(runTheServer)
.then(console.log.bind(console))
.catch(console.error.bind(console));
