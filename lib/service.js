const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const R = require('ramda');
const T = require('./questionnaire-types');

module.exports = {
  generateDirInfo: reqPath => ({
    name: 'Lorem...',
    descr: 'Lorem... ' + reqPath,
    demos: []
  }),

  getInfo: path => ({}),

  runTheApiServer: configPath => {
    var apiSrv = cp.spawn('./index.js', ['-c', configPath]);
    apiSrv.stdout.on('data', data => console.log('' + data));
    apiSrv.stderr.on('data', data => console.log('' + data));
    apiSrv.on('close', code => console.log('child process exited with code ' + code));
    return 'Running the server ...';
  },

  /**
   * Saves the output
   * @param  {T.Questionnaire} questionnaire
   * @return {T.Questionnaire|null}
   */
  saveOutputIfApproved: (questionnaire) => {
    if (questionnaire.configConfirm.confirmConfig) {
      fs.writeFileSync(
        path.resolve(__dirname, questionnaire.lobby.configPath),
        JSON.stringify(questionnaire.config, null, 2),
        { encoding: 'utf8' }
      );
      console.log('JSON file has been successfully saved to ' + questionnaire.lobby.configPath);
      return questionnaire;
    } else {
      return null;
    }
  }
}
