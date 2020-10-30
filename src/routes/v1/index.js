module.exports = function (fastify, opts, done) {
  require('./service.js')(fastify, opts);
  require('./config.js')(fastify, opts);
  require('./alerter.js')(fastify, opts);
  done();
};
