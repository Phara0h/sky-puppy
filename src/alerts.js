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
const log = require('wog')();

class Alerts {
  constructor(stats, config, nbars) {
    this.nbars = nbars;
    this.alerters = {};
    this.alerts_status = {};
    this.alerts = {
      down: {},
      healthy: {},
      unhealthy: {},
      unhealthy_status: {},
      unhealthy_response_time: {}
    };
    this.stats = stats;
    this.config = config;

    var alertersKeys = Object.keys(this.config.alerters);

    for (var i = 0; i < alertersKeys.length; i++) {
      this.startAlerter(alertersKeys[i], {
        ...this.config.getAlerter(alertersKeys[i])
      });
    }
  }

  addAlerter(name, alerter) {
    if (this.alerters[name]) {
      this.editAlerter(name, alerter);
    } else {
      log.info(`Adding alerter ${name} ...`);
      this.config.addAlerter(name, alerter);
      this.startAlerter(name, alerter);
    }
  }

  getAlerter(name) {
    return this.config.getAlerter(name);
  }

  deleteAlerter(name) {
    if (this.alerters[name]) {
      log.info(`Deleting alerter ${name} ...`);

      delete this.alerters[name];
      this.config.deleteAlerter(name);
    }

    return false;
  }

  editAlerter(name, alerter) {
    log.info(`Updating alerter ${name} ...`);
    this.deleteAlerter(name);
    this.addAlerter(name, alerter);
  }

  startAlerter(name, alerter) {
    if (!this.alerters[name]) {
      var nAlerter = {
        name,
        request: {
          ...alerter
        }
      };

      nAlerter.request.method = nAlerter.request.method || 'GET';
      nAlerter.request.timeout = Math.round(
        (nAlerter.request.timeout || 60) * 1000
      );
      nAlerter.request.resolveWithFullResponse = true;
      nAlerter.request.simple = false;

      if (!nAlerter.request.headers) {
        nAlerter.request.headers = {};
      }
      nAlerter.request.headers[
        'User-Agent'
      ] = `Sky-Puppy / ${this.config.skypuppy.version} (Health Check Service)`;

      this.alerters[name] = nAlerter;
    }
  }

  async _checkStatus(alert, service, type) {
    if (service.status.up === type) {
      if (
        this.alerts_status[service.name] != null &&
        this.alerts_status[service.name] === type
      ) {
        return;
      }
      // check if status has changed

      if (!this.alerts[alert.type][service.name]) {
        this.alerts[alert.type][service.name] = {
          status: { ...service.status, count: { ...service.status.count } }
        };

        this.alerts[alert.type][service.name].status.count[alert.type]--;

        // If sky puppy just started and the first status is healthy then don't alert.
        var count = this.alerts[alert.type][service.name].status.count;
        var total =
          count.healthy +
          count.down +
          count.unhealthy +
          count.unhealthy_response_time +
          count.unhealthy_status;

        if (service.status.up === 1 && total === 0) {
          this.alerts[alert.type][service.name].alerted = true;
          log.info(service.name, 'is healthy!');
          return;
        }
      }

      if (
        service.status.count[alert.type] -
          this.alerts[alert.type][service.name].status.count[alert.type] >=
          (alert.for || 1) &&
        !this.alerts[alert.type][service.name].alerted
      ) {
        // Don't alert if skypuppy never alterted about the bad down/unhealthy state.
        if (
          alert.type == 'healthy' &&
          (this.alerts_status[service.name] === 1 ||
            this.alerts_status[service.name] === undefined)
        ) {
          return;
        }
        this.alerts[alert.type][service.name].alerted = true;
        await this._sendAlert(alert, service);
        return;
      }
    } else {
      this.alerts[alert.type][service.name] = null;
    }
  }

  async alert(service) {
    if (service.config.alerts) {
      for (var i = 0; i < service.config.alerts.length; i++) {
        switch (service.config.alerts[i].type) {
          case 'down':
            await this._checkStatus(service.config.alerts[i], service, -1);
            break;
          case 'unhealthy':
          case 'unhealthy_status':
          case 'unhealthy_response_time':
            await this._checkStatus(service.config.alerts[i], service, 0);
            break;
          case 'healthy':
            await this._checkStatus(service.config.alerts[i], service, 1);
            break;
        }
      }
    }
  }

  async _sendAlert(alert, service) {
    if (this.alerters[alert.alerter]) {
      try {
        var overrides = alert.overrides || {};
        var request = { ...this.alerters[alert.alerter].request, ...overrides };

        if (request.body) {
          var messageValue = service.status.message || '';

          if (service.status.message && typeof service.status.message === 'object') {
            messageValue = JSON.stringify(service.status.message, null, 2);
            // If inserting into JSON template, use JSON.stringify to properly escape all control characters
            if (request.json) {
              // JSON.stringify will properly escape all control characters, then remove outer quotes
              messageValue = JSON.stringify(messageValue).slice(1, -1);
            }
          }

          request.body = this.nbars.transform(
            request.json ? JSON.stringify(request.body) : request.body,
            {
              alert_type: alert.type,
              service_name: service.name,
              message: messageValue,
              timestamp: new Date().toISOString(),
              last_unhealthy_total_duration:
                service.status.last_unhealthy_total_duration || 'Unknown',
              last_healthy_total_duration: service.status.last_healthy ?
                (
                  Number(
                    process.hrtime.bigint() - service.status.last_healthy
                  ) / 1000000000
                ).toFixed(2) :
                'Unknown'
            }
          );

          if (request.json) {
            //log.debug(request.body);
            request.body = JSON.parse(request.body);
          }
        }
        //log.log(request.body)
        this.alerts_status[service.name] = service.status.up;

        await fasquest.request(JSON.parse(JSON.stringify(request)));
      } catch (e) {
        log.error(
          `ERROR: Alerter [${alert.alerter}] of type [${alert.type}] could not be reached. Errored with message ${e.err ? e.err.message : e.message}`
        );
      }
    } else {
      log.warn(
        `WARNING: Alerter [${alert.alerter}] of type [${alert.type}] does not exist, but service [${service.name}] is trying to use it!`
      );
    }
  }
}
module.exports = Alerts;
