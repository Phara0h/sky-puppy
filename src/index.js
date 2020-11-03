#!/usr/bin/env node

const nstats = require('nstats')();
const Stats = require('./misc/stats.js');
const stats = new Stats();

async function start() {
  const { NBars } = await import('nbars');
  const HealthCheck = require('./health-check.js');
  const healthCheck = new HealthCheck(stats, NBars);

  const app = require('fastify')({
    logger: false
  });

  app.setErrorHandler(function (error, request, reply) {
    console.error(error);
    reply.code(500).send(
      JSON.stringify({
        type: 'error',
        msg: 'Please report this issue to the site admin'
      })
    );
  });

  app.get('/skypuppy/metrics', (req, res) => {
    res.code(200).send(nstats.toPrometheus());
  });
  app.get('/skypuppy/health', (req, res) =>
    res.code(200).send('All Systems Nominal')
  );

  // nstats
  app.register(nstats.fastify(), {
    ignored_routes: ['/skypuppy/metrics', '/skypuppy/health']
  });

  app.register(require('./routes/v1'), {
    prefix: '/skypuppy/v1',
    stats,
    healthCheck
  });

  app.ready(() => {
    //console.log(app.printRoutes());
  });

  app.listen(
    process.env.SKY_PUPPY_PORT || 8069,
    process.env.SKY_PUPPY_IP || '0.0.0.0'
  );
}
start();
