module.exports = function(fastify, opts, done) {
  require('./service.js')(fastify, opts);
  require('./alerter.js')(fastify, opts);
  done();
};
