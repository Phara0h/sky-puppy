const log = require('wog')();
const Alerts = require('./alerts.js');

class HealthCheck {
  constructor(stats, nbars, config) {
    this.checkers = {};
    this.services = {};
    this.alerters = {};
    this.stats = stats;
    this.alerts = new Alerts(stats, config, nbars);
    this.config = config;
    var checkersKeys = Object.keys(config.checkers);
    var servicesKeys = Object.keys(config.services);

    for (var i = 0; i < checkersKeys.length; i++) {
      var checker = {
        ...config.getChecker(checkersKeys[i])
      };

      if (checkersKeys[i] == 'request') {
        this.checkers[checkersKeys[i]] = {
          mod: require('./checkers/request'),
          settings: checker,
          name: checkersKeys[i]
        };
      } else {
        try {
          this.checkers[checkersKeys[i]] = {
            mod: require(checkersKeys[i]),
            settings: checker,
            name: checkersKeys[i]
          };
        } catch (e) {
          log.error(`Failed to load ${checkersKeys[i]}!`, e);
          process.exit();
        }
      }
    }

    for (var i = 0; i < servicesKeys.length; i++) {
      var service = {
        ...config.getService(servicesKeys[i])
      };

      this.startService(servicesKeys[i], service);
    }
  }

  addService(name, service) {
    if (this.services[name]) {
      this.editService(name, service);
    } else {
      log.info(`Adding service ${name} ...`);
      this.config.addService(name, service);
      this.startService(name, service);
    }
  }

  getService(name) {
    return this.config.getService(name);
  }

  getServiceStatus(name) {
    try {
      var status = {};

      switch (this.services[name].status.up) {
        case -1:
          status.status = 'down';
          break;
        case 0:
          status.status = 'unhealthy';
          break;
        case 1:
          status.status = 'healthy';
          break;
        default:
          status.status = 'unknown';
          break;
      }
      status.code = this.services[name].status.code;
      status.time = this.services[name].status.time;
      status.count = this.services[name].status.count;

      return status;
    } catch (e) {
      throw new Error('No service with that name.');
    }
    //return null;
  }

  editService(name, service) {
    log.info(`Updating service ${name} ...`);
    this.deleteService(name);
    this.addService(name, service);
  }

  deleteService(name) {
    if (this.services[name]) {
      log.info(`Deleting service ${name} ...`);
      clearTimeout(this.services[name]._sTimeoutHandler);
      delete this.services[name];
      this.config.deleteService(name);
    }

    return false;
  }

  async startService(name, service) {
    if (!this.services[name]) {
      log.info(`Starting service ${name} ...`);
      var nService = {
        name,
        enabled: service.enabled !== false,
        checker: {},
        config: {
          ...service,
          interval: Math.round((service.interval || 5) * 1000), // default 5 seconds
          expected_status: service.expected_status || 200 // default 200 OK;
        },
        status: {
          up: -2,
          code: 0,
          time: 0,
          count: {
            healthy: 0,
            unhealthy: 0,
            unhealthy_status: 0,
            unhealthy_response_time: 0,
            down: 0
          }
        }
      };
      var checker = this.checkers[nService.config.checker.name];
      var checkerSettings = {};
      var checkerCodeMessages = null;

      if (checker.settings) {
        checkerSettings = {
          ...checker.settings,
          ...nService.config.checker.settings
        };
      } else {
        checkerSettings = {
          ...nService.config.checker.settings
        };
      }

      if (
        checker.settings &&
        checker.settings.code_messages &&
        nService.config.checker.code_messages
      ) {
        checkerCodeMessages = {
          ...checker.settings.code_messages,
          ...nService.config.checker.code_messages
        };
      } else if (nService.config.checker.code_messages) {
        checkerCodeMessages = {
          ...nService.config.checker.code_messages
        };
      } else if (checker.settings && checker.settings.code_messages) {
        checkerCodeMessages = {
          ...checker.settings.code_messages
        };
      }
      nService.code_messages = checkerCodeMessages;
      //log.debug(nService.code_messages);
      nService.checker = await checker.mod(this.config, nService, checkerSettings);
      await nService.checker.init();

      this.services[name] = nService;

      this.services[name]._sTimeoutHandler = setTimeout(() => {
        this._run(this.services[name]);
      }, (nService.config.start_delay || 0) * 1000);
    }
  }

  getStatus(service) {}

  getConfig() {
    return this.config;
  }

  _mapMessages(code, message, service) {
    if (service.code_messages) {
      var codes = Object.keys(service.code_messages);

      for (var i = 0; i < codes.length; i++) {
        if (codes[i] == code) {
          return service.code_messages[codes[i]];
        }
      }
    }
    return message || '';
  }

  async _runChecker(service, startTime) {
    try {
      var res = await service.checker.check();

      service.status.time =
        Number(process.hrtime.bigint() - startTime) / 1000000;
      service.status.code = res.code;
      service.status.message = this._mapMessages(
        res.code,
        res.message,
        service
      );
      service.status.up = 1;

      if (service.config.expected_status != service.status.code) {
        service.status.up = 0;
        service.status.count.unhealthy_status++;
        log.warn(service.name, ' Unhealthy status: ' + service.status.code);
      }

      if (service.status.time > service.config.expected_response_time) {
        service.status.up = 0;
        service.status.count.unhealthy_response_time++;
        log.warn(
          service.name,
          ' Unhealthy response time: ' + service.status.time.toFixed(2) + 'ms'
        );
      }

      if (service.status.up > 0) {
        service.status.count.healthy++;
      } else {
        service.status.count.unhealthy++;
      }
    } catch (e) {
      if (e.message.indexOf('ETIMEDOUT') > -1) {
        service.status.time =
          Number(process.hrtime.bigint() - startTime) / 1000000;

        service.status.count.unhealthy++;
        service.status.up = 0;
        service.status.code = 0;

        service.status.message = this._mapMessages(
          service.status.code,
          'Timedout',
          service
        );

        log.info(service.name, ' Unhealthy ETIMEDOUT!');
      } else {
        service.status.time =
          Number(process.hrtime.bigint() - startTime) / 1000000;
        service.status.count.down++;
        service.status.up = -1;
        service.status.code = -1;
        service.status.message = this._mapMessages(
          service.status.code,
          e.message,
          service
        );
        log.info(service.name, ' Down! ', e.message);
      }

      log.debug(service.name, e.message);
    }

    if (service.status.last_status == null) {
      service.status.last_status = service.status.up;
    }

    if (service.status.up > 0) {
      if (!service.status.last_healthy) {
        service.status.last_healthy = process.hrtime.bigint();
      }
      if (service.status.last_status < 1 && service.status.last_healthy) {
        service.status.last_unhealthy_total_duration = (
          Number(process.hrtime.bigint() - service.status.last_unhealthy) /
          1000000000
        ).toFixed(3);
        log.info(
          service.name,
          `healthy again after ${service.status.last_unhealthy_total_duration} second of down time!`
        );
        service.status.last_healthy = process.hrtime.bigint();
      }
    } else if (!service.status.last_unhealthy || (service.status.last_status > 0 && service.status.last_unhealthy)) {
      service.status.last_unhealthy = process.hrtime.bigint();
    }
  }
  async _run(service) {
    if (service && service.enabled) {
      const startTime = process.hrtime.bigint();

      try {
        await this._runChecker(service, startTime);
        this.stats.updateService(service.name, service.status);
        await this.alerts.alert(service);
      } catch (e) {
        log.error(e.message);
      }

      try {
        service.status.last_status = service.status.up;
        const tout =
          service.config.interval -
          Number(process.hrtime.bigint() - startTime) / 1000000;

        if (tout <= 0) {
          log.debug(service.name + ' tout: ' + (tout > 0 ? tout : 0));
        }

        this.services[service.name]._sTimeoutHandler = setTimeout(
          async () => {
            this._run(service);
          },
          tout > 0 ? tout : 0
        );
      } catch (e) {
        log.fatal('Could not run service: ' + (service ? service.name : 'Unknown' + ' e:' + e.message));
      }
    }
  }
}
module.exports = HealthCheck;
