const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const R = require('ramda');
const fastmatter = require('fastmatter');
const htmlFrontmatter = require('html-frontmatter');
const T = require('./questionnaire-types');
const Future = require('fluture');

const readdir = R.curryN(2, fs.readdir);

const constructDemo = R.curry((cwd, base, demo) =>
  Future.node(done => fs.readFile(path.join(cwd, base, 'demos', demo), 'utf8', done))
    .map(demoContent => ({
      name: htmlFrontmatter(demoContent).name,
      path: path.join(base, 'demos', demo)
    }))
);

const parseDemos = (cwd, reqPath) =>
  Future.node(done => fs.readdir(path.join(cwd, reqPath, 'demos'), done))
    .chain(R.compose(Future.parallel(Infinity), R.map(constructDemo(cwd, reqPath))))

const toInfo = fm => ({
  name: fm.attributes.name,
  descr: fm.body
});

const parseReadme = reqPath =>
  Future.node(done => fs.readFile(path.resolve(reqPath, 'readme.md'), 'utf8', done))
    .map(fastmatter).map(toInfo);

const mergeDemosAndReadme =
  R.apply(R.useWith(R.merge, [R.objOf('demos'), R.identity]));

module.exports = {
  generateDirInfo: (cwd, reqPath) =>
    Future.node(readdir(path.join(cwd, reqPath)))
    .chain(R.cond([
      [ R.contains('demos'),
        () => Future.parallel(2, [parseDemos(cwd, reqPath), parseReadme(reqPath)])
          .map(mergeDemosAndReadme) ],
      [ R.T,
        () => parseReadme(reqPath) ]
    ])),

  generateDemo: (cwd, reqPath) =>
    Future.node(done => fs.readFile(path.join(cwd, reqPath), 'utf8', done)),

  runTheApiServer: configPath => {
    var apiSrv = cp.spawn('../bin/ok-doc-backend', ['-c', configPath]);
    apiSrv.stdout.on('data', data => console.log('' + data));
    apiSrv.stderr.on('data', data => console.log('' + data));
    apiSrv.on('close', code => console.log('child process exited with code ' + code));
    return 'Running the server ...';
  },

  /**
   * Saves the output JSON to the file.
   * Logs the message to the console.
   * @param  {T.Questionnaire} questionnaire
   * @return {T.Questionnaire|null}
   */
  saveOutputIfApproved: (questionnaire) => {
    if (questionnaire.configConfirm.confirmConfig) {
      Future.node
      fs.writeFileSync(
        path.resolve(__dirname, '..', questionnaire.lobby.configPath),
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
