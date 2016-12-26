var path = require("path");

module.exports = {
  isAbsPathToDir: val =>
    path.parse(val).ext
      ? 'It must the path to a directory, for example, /home/project/docs'
      : !path.isAbsolute(val)
        ? 'Please, specify the absolute path'
        : true,

  isAbcPathToJSON: val =>
    path.parse(val).ext !== '.json'
      ? 'It must the path to a .json file, for example, /home/project/tree.json'
      : !path.isAbsolute(val)
        ? 'Please, specify the absolute path'
        : true,

  isPathToJSON: val =>
    path.parse(val).ext !== '.json'
      ? 'It must the path to a .json file, for example, ./project/tree.json'
      : true
}
