module.exports = function (fastify, opts) {
  const stats = opts.stats;
  const healthCheck = opts.healthCheck;

  fastify.put('/alerter/:name', async (req, res) => {
    var alterter = req.body;
    var name = req.params.name;

    healthCheck.alerts.addAlerter(name, alterter);
    res.status(200).send();
  });

  fastify.get('/alerter/:name', async (req, res) => {
    var name = req.params.name;

    res.status(200).send(healthCheck.alerts.getAlerter(name));
  });

  fastify.delete('/alerter/:name', async (req, res) => {
    var name = req.params.name;

    try {
      await healthCheck.alerts.deleteAlerter(name);
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  });
};
