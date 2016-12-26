#!/usr/bin/env node

const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const service = require('./service');
const validator = require('./user-input-validator');
const T = require('./questionnaire-types');

const questions = {
  /**
   * Generated prompts for lobby
   * @param  {T.Questionnaire} questionnaire
   * @return {inquirer.question}
   */
  lobby: questionnaire => {
    return [
      { type: 'input'
      , name: 'configPath'
      , message: 'Please, specify where to store the JSON config file:'
      , default: (questionnaire ? questionnaire.lobby.configPath : '')
      , validate: validator.isPathToJSON
      }
    ]
  },

  /**
   * Generated prompts for lobby
   * @param  {T.ConfigAnswers} questionnaire
   * @return {inquirer.question}
   */
  config: config => ([
    { type: 'input'
    , name: 'docsPath'
    , message: 'Please, specify the absolute path to your documenation:'
    , default: config.docsPath || ''
    , validate: validator.isAbsPathToDir
    },
    { type: 'input'
    , name: 'treePath'
    , message: 'Please, specify the absolute path to the JSON file with the tree:'
    , default: config.treePath || ''
    , validate: validator.isAbcPathToJSON
    },
    { type: 'input'
    , name: 'port'
    , message: 'Please, specify the port to which the api server should listen to:'
    , default: config.port || '3000'
    }
  ]),

  /**
   * Generated prompts for lobby
   * @param  {T.Questionnaire} questionnaire
   * @return {inquirer.question}
   */
  confirmConfig: questionnaire => ([
    { type: 'confirm'
    , name: 'confirmConfig'
    , message: 'Does it look good?\n\n' + JSON.stringify(questionnaire.config, null, 2) + '\n'
    , default: 'Y'
    }
  ]),

  shouldRunTheServer: () => ([
    { type: 'confirm'
    , name: 'confirmRunServer'
    , message: 'Should I run the server using the newly created config?'
    , default: 'Y' }
  ])
};

/**
 * Lobby questions
 * @param  {T.Questionnaire} questionnaire
 * @return {Promise.<PrevAnswers>}
 */
function lobby(questionnaire) {
  console.log('>>> lobby: ', questionnaire);
  return inquirer
    .prompt(questions.lobby(questionnaire))
    .then(
      /**
       * Build-up questionnaire
       * @param  {T.LobbyAnswers} lobby
       * @return {T.Questionnaire}
       */
      function (lobby) {
        return new T.Questionnaire(lobby);
      }
    );
}

/**
 * @param  {T.Questionnaire} questionnaire
 * @return {Promise.<T.Questionnaire>}
 */
function generateConfig(questionnaire) {
  console.log('>>> generateConfig: ', questionnaire);

  var config = questionnaire.lobby.configPath && fs.existsSync(questionnaire.lobby.configPath)
    ? require(questionnaire.lobby.configPath)
    : {};

  return inquirer
    .prompt(questions.config(config))
    .then(
      /**
       * Build-up questionnaire
       * @param  {T.ConfigAnswers} answers
       * @return {T.Questionnaire}
       */
      function(answers) {
        return new T.Questionnaire(questionnaire.lobby, answers)
      }
    );

}

/**
 * @param  {T.Questionnaire} questionnaire
 * @return {Promise.<T.Questionnaire>}
 */
function confirnGeneratedConfig(questionnaire) {
  return inquirer
    .prompt(questions.confirmConfig(questionnaire))
    .then(
      /**
       * Build up questionnaire
       * @param  {T.ConfigConfirmAnswers} answers
       * @return {T.Questionnaire}
       */
      function(answer) {
        return answer.confirmConfig
          ? new T.Questionnaire(questionnaire.lobby, questionnaire.config, answer)
          : new Promise(function (_, rej) { return rej(['wrong_config', questionnaire]); });
      }
    );
}

/**
 * @param  {T.Questionnaire} questionnaire
 * @return {Promise.<T.Questionnaire>}
 */
function runTheServer(questionnaire) {
  return inquirer
  .prompt(questions.shouldRunTheServer())
  .then(
    /**
     * @param  {T.ConfirmRunAPIAnswers} answer
     * @return {Promise.<String, [String, T.Questionnaire]> | String}
     */
    function(answer) {
      return answer.confirmRunServer
        ? service.runTheApiServer(questionnaire.lobby.configPath)
        : new Promise(function (_, rej) { return rej(['no_api', questionnaire]); });
    }
  );
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
        console.error('No problem, you can run it using: npm run api -c ' + err[1].lobby.configPath);
        return null;
      default:
        console.error(err);
        return null;
    }
  });
};

main(void 0);
