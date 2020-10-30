module.exports = function (fastify, opts) {
  const stats = opts.stats;
  const healthCheck = opts.healthCheck;

  fastify.get('/config', async (req, res) => {
    healthCheck.getConfig();
  });

  fastify.put('/config', async (req, res) => {
    var service = req.body;
    var name = req.params.name;

    healthCheck.addService(name, service);
    res.status(200).send();
  });
};
