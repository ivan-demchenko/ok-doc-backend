const T = require('./questionnaire-types');
const path = require('path');

module.exports = {
  /**
   * Build-up questionnaire
   * @param  {LobbyAnswers} lobby
   * @return {Questionnaire}
   */
  lobby: function (lobby) {
    const configPath = path.isAbsolute(lobby.configPath)
      ? lobby.configPath
      : path.resolve(process.cwd(), lobby.configPath);
    return new T.Questionnaire(new T.LobbyAnswers(configPath));
  },



  /**
   * Build-up questionnaire
   * @param  {ConfigAnswers} answers
   * @return {Questionnaire}
   */
  config: function(answers) {
    const docsPath = path.isAbsolute(answers.docsPath)
      ? answers.docsPath
      : path.resolve(process.cwd(), answers.docsPath);
    const treePath = path.isAbsolute(answers.treePath)
      ? answers.treePath
      : path.resolve(process.cwd(), answers.treePath);
    return new T.Questionnaire(questionnaire.lobby, new T.ConfigAnswers(docsPath, treePath, answers.port))
  },



  /**
   * Build up questionnaire
   * @param  {ConfigConfirmAnswers} answers
   * @return {Questionnaire}
   */
  confirmConfig: function(answer) {
    return answer.confirmConfig
      ? new T.Questionnaire(questionnaire.lobby, questionnaire.config, answer)
      : new Promise(function (_, rej) { return rej(['wrong_config', questionnaire]); });
  },



  /**
   * @param  {ConfirmRunAPIAnswers} answer
   * @return {Promise.<String, [String, T.Questionnaire]> | String}
   */
  confirmRunServer: function(answer) {
    return answer.confirmRunServer
      ? service.runTheApiServer(questionnaire.lobby.configPath)
      : new Promise(function (_, rej) { return rej(['no_api', questionnaire]); });
  }
}
