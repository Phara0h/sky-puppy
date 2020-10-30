module.exports = function (fastify, opts) {
  const stats = opts.stats;
  const healthCheck = opts.healthCheck;

  fastify.get('/service/:name', async (req, res) => {
    var name = req.params.name;

    res.status(200).send(healthCheck.getService(name));
  });

  fastify.put('/service/:name', async (req, res) => {
    var service = req.body;
    var name = req.params.name;

    healthCheck.addService(name, service);
    res.status(200).send();
  });

  fastify.delete('/service/:name', async (req, res) => {
    var name = req.params.name;

    try {
      await healthCheck.deleteService(name);
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

  fastify.get('/service/:name/status', async (req, res) => {
    var name = req.params.name;

    res.status(200).send(healthCheck.getServiceStatus(name));
  });

  fastify.get('/services/metrics', (req, res) => {
    res.code(200).send(stats.toPrometheus());
  });
};
