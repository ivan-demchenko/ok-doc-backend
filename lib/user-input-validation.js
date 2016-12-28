var path = require("path");

module.exports = {
  isPathToDir: val =>
    path.parse(val).ext
      ? 'It must the path to a directory, for example, /home/project/docs'
      : true,

  isPathToJSON: val =>
    path.parse(val).ext !== '.json'
      ? 'It must the path to a .json file, for example, ./project/tree.json'
      : true
}
