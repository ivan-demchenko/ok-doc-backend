#!/usr/bin/env node

const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const service = require('../service');
const questions = require('./questions');
const answers = require('./answers');

/**
 * Lobby questions
 * @param  {Questionnaire} questionnaire
 * @return {Promise.<PrevAnswers>}
 */
function lobby(questionnaire) {
  return inquirer.prompt(questions.lobby(questionnaire))
    .then(answers.lobby);
}

/**
 * @param  {Questionnaire} questionnaire
 * @return {Promise.<Questionnaire>}
 */
function generateConfig(questionnaire) {
  var config = questionnaire.lobby.configPath && fs.existsSync(questionnaire.lobby.configPath)
    ? require(questionnaire.lobby.configPath)
    : {};

  return inquirer.prompt(questions.config(config))
    .then(answers.config(questionnaire));
}

/**
 * @param  {Questionnaire} questionnaire
 * @return {Promise.<Questionnaire>}
 */
function confirnGeneratedConfig(questionnaire) {
  return inquirer.prompt(questions.confirmConfig(questionnaire))
    .then(answers.confirmConfig(questionnaire));
}

/**
 * @param  {Questionnaire} questionnaire
 * @return {Promise.<Questionnaire>}
 */
function runTheServer(questionnaire) {
  return inquirer.prompt(questions.shouldRunTheServer())
  .then(answers.confirmRunServer(questionnaire));
}

var main = function (conf) {
  return lobby(conf)
  .then(generateConfig)
  .then(confirnGeneratedConfig)
  .then(service.saveOutputIfApproved)
  .then(runTheServer)
  .catch(function(err) {
    switch (err[0]) {
      case 'wrong_config':
        return main(err[1]);
      case 'no_api':
        console.error('No problem, you can run it using: ok-doc-backend -c ' + err[1].lobby.configPath);
        return null;
      default:
        console.error(err);
        return null;
    }
  });
};

module.exports = main;
