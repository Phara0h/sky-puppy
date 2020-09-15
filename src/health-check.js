const fs = require('fs');
var fasquest = require('fasquest');
const client = {
  https: require('https'),
  http: require('http'),
};
fasquest.agent = {
  http: new client.http.Agent({
    keepAlive: false
  }),
  https: new client.https.Agent({
    keepAlive: false
  })
};

const Config = require('./config.js');
var config = new Config();
const Alerts = require('./alerts.js');

class HealthCheck {
  constructor(stats,nbars) {

    this.services = {};
    this.alerters = {}
    this.stats = stats;
    this.alerts = new Alerts(stats,config,nbars);

    var servicesKeys = Object.keys(config.services);

    for (var i = 0; i < servicesKeys.length; i++) {
      this.addService(servicesKeys[i],{...config.getService(servicesKeys[i])});
    }

  }


  addService(name,service) {
    if(!config.getService(name)) {
      config.addService(name,service);
    }


    var nService = {
      name,
      started: true,
      config: {
        ...service,
        interval: Math.round((service.interval || 5)*1000), // default 5 seconds
        expected_status: service.expected_status || 200, // default 200 OK;
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
    }

    nService.config.request.method = nService.config.request.method || 'GET';
    nService.config.request.timeout = Math.round((nService.config.request.timeout || 60)*1000);
    nService.config.request.resolveWithFullResponse = true;
    nService.config.request.simple = false;

    nService.config.expected_response_time = service.expected_response_time || nService.config.request.timeout;

    if(!nService.config.request.headers) {
      nService.config.request.headers = {};
    }
    nService.config.request.headers['User-Agent'] = `Sky-Puppy / ${config.skypuppy.version} (Health Check Service)`

    this.services[name] = nService;

    setTimeout(()=>{
        this._runCheck(this.services[name]);

    },(nService.config.start_delay || 0)*1000)

  }

  editService(service) {
    // if(!config.services[service.name]) {
    //   this.
    // }
  }

  deleteService(service) {

  }

  getStatus(service) {

  }

  getConfig(service) {

  }

  async _runCheck(service) {
    if(service.started) {
      const startTime = process.hrtime.bigint();
      const oldStatus = service.status.up;
      try {
        var res = await fasquest.request(service.config.request);
        service.status.time = (Number( process.hrtime.bigint() - startTime) / 1000000);
        service.status.code = res.statusCode;
        service.status.up = 1;

        if(service.config.expected_status != service.status.code){
          service.status.up = 0;
          service.status.count.unhealthy_status++;
          console.log(service.name,' Unhealthy status: '+service.status.code);
        }

        if( service.status.time > service.config.expected_response_time) {
          service.status.up = 0;
          service.status.count.unhealthy_response_time++;
          console.log(service.name,' Unhealthy response time: '+service.status.time.toFixed(2) +'ms');
        }

        if(service.status.up > 0) {
          service.status.count.healthy++;
        } else {
          service.status.count.unhealthy++;
        }
      } catch (e) {
          service.status.time = (Number( process.hrtime.bigint() - startTime) / 1000000);
          service.status.count.down++;
          service.status.up = -1;
          service.status.code = 0;
          console.log(service.name,e.err.message);
      }


      if(service.status.last_status == null) {
        service.status.last_status = service.status.up
      }
      if(service.status.up > 0) {
        if(!service.status.last_healthy) {
           service.status.last_healthy = process.hrtime.bigint();
        }
        if(service.status.last_status < 1  && service.status.last_healthy) {
          console.log(service.name,' healthy again!');
          service.status.last_unhealthy_total_duration = (Number(process.hrtime.bigint() - service.status.last_healthy) / 1000000000).toFixed(2)
          service.status.last_healthy = process.hrtime.bigint();
        }
      }
      this.stats.updateService(service.name, service.status)

      this.alerts.alert(service);
      service.status.last_status = service.status.up
      const tout = service.config.interval - (Number( process.hrtime.bigint() - startTime) / 1000000);

      setTimeout(async ()=>{
        this._runCheck(service);
      },tout > 0 ? tout : 0)
    }
  }
}
module.exports = HealthCheck;
