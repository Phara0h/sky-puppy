var fasquest = require('fasquest');
const client = {
  https: require('https'),
  http: require('http')
};

fasquest.agent = {
  http: new client.http.Agent({
    keepAlive: false
  }),
  https: new client.https.Agent({
    keepAlive: false
  })
};

class Request {
  constructor(config, service, settings) {
    this.config = config;
    this.service = service;
    this.settings = settings;
  }
  async init() {
    if (this.settings) {
      this.settings.method = this.settings.method || 'GET';
    }
    this.settings.timeout = Math.round((this.settings.timeout || 60) * 1000);
    this.settings.resolveWithFullResponse = true;
    this.settings.simple = false;

    this.service.config.expected_response_time =
      this.service.expected_response_time || this.settings.timeout;

    if (!this.settings.headers) {
      this.settings.headers = {};
    }
    this.settings.headers[
      'User-Agent'
    ] = `Sky-Puppy / ${this.config.skypuppy.version} (Health Check Service)`;
  }

  async check() {
    try {
      var res = await fasquest.request(this.settings);

      return {
        code: res.statusCode
      };
    } catch (e) {
      throw e.err;
    }
  }
}

module.exports = function(config, service, settings) {
  return new Request(config, service, settings);
};
