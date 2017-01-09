const spawn = require('child_process').spawn;
const joinPath = require('path').join;
const expect = require('chai').expect;

describe('CLI without params', () => {
  it('should output the first question', (done) => {
    const scriptPath = joinPath(__dirname, '../bin/ok-doc-backend');
    const be = spawn(scriptPath, []);
    be.stdout.on('data', (data) => {
      expect(String(data)).to.equal('? Please, specify where to store the JSON config file: () ')
      done();
    });
    be.stderr.on('data', (data) => {
      done(data);
    });
  });
});
