var express = require("express");
var service = require("./service");
var server = express();

exports.runApi = function (config) {
  server.get('/tree', function (req, res) {
    return res.json(require(config.treePath));
  });
  server.get('/info', function (req, res) {
    return res.json(service.getInfo(req.query.path));
  });
  server.listen(config.port, function () { return console.log('Example app listening on port:' + config.port); });
};
