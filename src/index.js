#!/usr/bin/env node

const Config = require('./config.js');
const Stats = require('./misc/stats.js');
const HealthCheck = require('./health-check.js');
const nstats = require('nstats')();
const app = require('fastify')({
  logger: false
});

const NBars = require('nbars/commonjs.js');

async function start() {

  var config = new Config();
  const stats = new Stats();
  const healthCheck = new HealthCheck(stats, NBars, config);


  app.setErrorHandler(function (error, request, reply) {
    console.error(error);
    reply.code(500).send(
      JSON.stringify({
        type: 'error',
        msg: 'Please report this issue to the site admin'
      })
    );
  });
  app.register(require('./routes/v1/config.js'), {
    prefix: '/skypuppy/v1',
    stats,
    healthCheck
  });
  app.register(require('./routes/v1/alerter.js'), {
    prefix: '/skypuppy/v1',
    stats,
    healthCheck
  });

  app.register(require('./routes/v1/service.js'), {
    prefix: '/skypuppy/v1',
    stats,
    healthCheck
  });
  app.get('/skypuppy/metrics', (req, res) => {
    res.code(200).send(nstats.toPrometheus());
  });
  
  app.get('/skypuppy/health', (req, res) => {
    res.code(200).send('All Systems Nominal');
  });

  // nstats
  app.register(nstats.fastify(), {
    ignored_routes: ['/skypuppy/metrics', '/skypuppy/health']
  });

 
  app.ready(() => {
    console.log(app.printRoutes());
  });

  app.listen(
    { port: process.env.SKY_PUPPY_PORT || 8069, host: process.env.SKY_PUPPY_IP || '0.0.0.0' }
  );
}
start();
