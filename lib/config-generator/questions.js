const validation = require('./user-input-validation');

module.exports = {
  /**
   * Lobby questions
   * @param  {T.Questionnaire} questionnaire
   * @return {inquirer.question}
   */
  lobby: questionnaire => [
    { type: 'input'
    , name: 'configPath'
    , message: 'Please, specify where to store the JSON config file:'
    , default: (questionnaire ? questionnaire.lobby.configPath : '')
    , validate: validation.isPathToJSON
    }
  ],

  /**
   * API server config questions
   * @param  {T.ConfigAnswers} questionnaire
   * @return {inquirer.question}
   */
  config: config => ([
    { type: 'input'
    , name: 'docsPath'
    , message: 'Please, specify the path to your documenation:'
    , default: config.docsPath || ''
    , validate: validation.isPathToDir
    },
    { type: 'input'
    , name: 'treePath'
    , message: 'Please, specify the path to the JSON file with the tree:'
    , default: config.treePath || ''
    , validate: validation.isPathToJSON
    },
    { type: 'input'
    , name: 'port'
    , message: 'Please, specify the port to which the api server should listen to:'
    , default: config.port || '3000'
    }
  ]),

  /**
   * Confirms whether config is correct
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

  /**
   * Confirms whether to run the API server
   * @param  {T.Questionnaire} questionnaire
   * @return {inquirer.question}
   */
  shouldRunTheServer: () => ([
    { type: 'confirm'
    , name: 'confirmRunServer'
    , message: 'Should I run the server using the newly created config?'
    , default: 'Y' }
  ])
};
