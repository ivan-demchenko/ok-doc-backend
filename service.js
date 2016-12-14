const fs = require('fs');
const path = require('path');
const R = require('ramda');

module.exports = {

  generateDirInfo: reqPath => ({
    name: 'Lorem...',
    descr: 'Lorem... ' + reqPath,
    demos: []
  }),

  saveOutput: R.curry((outputPath, data) => {
    fs.writeFileSync(
      path.resolve(outputPath), JSON.stringify(data, null, 2), { encoding: 'utf8' }
    );
    return outputPath;
  })

};
