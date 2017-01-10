const T = require('./questionnaire-types');
const path = require('path');


/**
 * Absolutizes filePath
 * @param  {string} filePath
 * @return {string}
 */
const absolutizePath = filePath =>
  path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath)



module.exports = {
  /**
   * Build-up questionnaire
   * @param  {LobbyAnswers} lobby
   * @return {Questionnaire}
   */
  lobby: lobby =>
    new T.Questionnaire
      ( new T.LobbyAnswers
        ( absolutizePath(lobby.configPath)
      )
    ),



  /**
   * Build-up questionnaire
   * @param  {Questionnaire} questionnaire
   * @param  {ConfigAnswers} answers
   * @return {Questionnaire}
   */
  config: questionnaire => answers =>
    new T.Questionnaire
      ( questionnaire.lobby
      , new T.ConfigAnswers
        ( absolutizePath(answers.docsPath)
        , absolutizePath(answers.treePath)
        , answers.port
        )
      ),



  /**
   * Build up questionnaire
   * @param  {Questionnaire} questionnaire
   * @param  {ConfigConfirmAnswers} answers
   * @return {Questionnaire}
   */
  confirmConfig: questionnaire => answer =>
    answer.confirmConfig
      ? new T.Questionnaire
        ( questionnaire.lobby
        , questionnaire.config
        , answer
        )
      : new Promise
        ( (_, rej) => rej(['wrong_config', questionnaire])
        ),



  /**
   * @param  {Questionnaire} questionnaire
   * @param  {ConfirmRunAPIAnswers} answer
   * @return {Promise.<String, [String, T.Questionnaire]> | String}
   */
  confirmRunServer: questionnaire => answer =>
    answer.confirmRunServer
      ? service.runTheApiServer(questionnaire.lobby.configPath)
      : new Promise
        ( (_, rej) => rej(['no_api', questionnaire])
        )
}
