/**
 * LobbyAnswers Object
 * @class
 * @param {string} configPath
 */
function LobbyAnswers(configPath) {
  this.configPath = configPath;
}

/**
 * ConfigAnswers Object
 * @class
 * @param {string} docsPath
 * @param {string} treePath
 * @param {string} port
 */
function ConfigAnswers(docsPath, treePath, port) {
  this.docsPath = docsPath;
  this.treePath = treePath;
  this.port = port;
}

/**
 * ConfigConfirmAnswers Object
 * @class
 * @param {boolean} confirmConfig
 */
function ConfigConfirmAnswers(confirmConfig) {
  this.confirmConfig = confirmConfig;
}

/**
 * ConfirmRunAPIAnswers Object
 * @class
 * @param {boolean} confirmRunServer
 */
function ConfirmRunAPIAnswers(confirmRunServer) {
  this.confirmRunServer = confirmRunServer;
}

/**
 * Questionnaire object constructor.
 * @class
 * @param {LobbyAnswers} lobbyAns
 * @param {ConfigAnswers} configAns
 * @param {ConfigConfirmAnswers} configConfirmAns
 * @param {ConfirmRunAPIAnswers} runApiAns
 */
function Questionnaire(lobbyAns, configAns, configConfirmAns, runApiAns) {
  this.lobby = lobbyAns;
  this.config = configAns || null;
  this.configConfirm = configConfirmAns || null;
  this.runApi = runApiAns || null;
}

module.exports = {
  LobbyAnswers, ConfigAnswers, ConfigConfirmAnswers, ConfirmRunAPIAnswers, Questionnaire
};
