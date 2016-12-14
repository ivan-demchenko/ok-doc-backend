const server = require('express')();
const service = require('./service');

module.exports = (port, docs, tree) => {

  server.get('/tree', (_, res) => res.json(require(tree)))
  server.get('/info', (req, res) => res.json(service(req.query.path)));

  server.listen(port, () => console.log('Example app listening on port 3000!'));
}
