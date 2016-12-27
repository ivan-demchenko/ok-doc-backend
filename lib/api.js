var express = require("express");
var service = require("./service");
var server = express();

exports.runApi = function (config) {
  server.get('/tree', (req, res) =>
    res.json(require(config.treePath))
  );
  server.get('/info', (req, res) => {
    service.generateDirInfo(req.query.path)
      .fork(
        err => res.status(500).send(err),
        succ => res.json(succ)
      )
  });
  server.listen(config.port, function () { return console.log('Example app listening on port:' + config.port); });
};
