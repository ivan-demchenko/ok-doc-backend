var express = require("express");
var service = require("./service");
var server = express();

exports.runApi = (cwd, port, treePath) => {

  server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "runkit-rate-limit-remaining");
    res.header("Access-Control-Expose-Headers", "tonic-rate-limit-remaining");

    var reqHeaders = req.get("Access-Control-Request-Headers")
    if (reqHeaders) res.header("Access-Control-Allow-Headers", reqHeaders);

    var reqMethods = req.get("Access-Control-Request-Methods")
    if (reqMethods) res.header("Access-Control-Allow-Methods", reqMethods);

    next()
  })

  server.get('/tree', (req, res) =>
    res.json(require(treePath))
  );

  server.get('/info', (req, res) => {
    service.generateDirInfo(cwd, req.query.path)
      .fork(
        err => res.status(500).send(err),
        succ => res.json(succ)
      )
  });

  server.get('/demo', (req, res) => {
    service.generateDemo(cwd, req.query.path)
      .fork(
        err => res.status(500).send(err),
        succ => res.status(200).send(succ)
      )
  })

  server.listen(port, () => console.log('Example app listening on port:' + port));
};
