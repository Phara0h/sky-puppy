
module.exports = function(fastify, opts) {
  const stats = opts.stats;
  const healthCheck = opts.healthCheck;

  fastify.put('/alerter/:name', async (req, res) => {
    var alterter = req.body;
    var name = req.params.name;
    healthCheck.alerts.addAlerter(name,alterter);
    res.status(200).send();
  });


};
