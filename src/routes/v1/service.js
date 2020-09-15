
module.exports = function(fastify, opts) {
  const stats = opts.stats;
  const healthCheck = opts.healthCheck;

  fastify.get('/service/:name/config', async (req, res) => {

  });

  fastify.put('/service/:name/config', async (req, res) => {
    var service = req.body;
    var name = req.params.name;
    healthCheck.addService(name,service);
    res.status(200).send();
  });

  fastify.delete('/service/:name/config', async (req, res) => {

  });

  fastify.get('/service/:name/status', async (req, res) => {

  });

};
