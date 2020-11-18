class Stats {
  constructor() {
    this.services = [];
  }

  updateService(name, status) {
    for (var i = 0; i < this.services.length; i++) {
      if (this.services[i].name == name) {
        this.services[i].status = status;
        this.services[i].date = Date.now();
        return;
      }
    }
    this.services.push({ name, status, date: Date.now() });
  }

  toPrometheus() {
    var pstring = '';

    for (var i = 0; i < this.services.length; i++) {
      pstring += `sky_puppy_service_status{service="${this.services[i].name}", name="${this.services[i].name}" } ${this.services[i].status.up} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_status_count_total{service="${this.services[i].name}", status="healthy"} ${this.services[i].status.count.healthy} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_status_count_total{service="${this.services[i].name}", status="unhealthy"} ${this.services[i].status.count.unhealthy} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_status_count_total{service="${this.services[i].name}", status="unhealthy_status"} ${this.services[i].status.count.unhealthy_status} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_status_count_total{service="${this.services[i].name}", status="unhealthy_response_time"} ${this.services[i].status.count.unhealthy_response_time} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_status_count_total{service="${this.services[i].name}", status="down"} ${this.services[i].status.count.down} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_response_time{service="${this.services[i].name}", name="${this.services[i].name}"} ${this.services[i].status.time} ${this.services[i].date} \n`;
      pstring += `sky_puppy_service_response_code{service="${this.services[i].name}", message="${this.services[i].status.message}", name="${this.services[i].name}"} ${Number(this.services[i].status.code) || -1} ${this.services[i].date} \n`;
    }
    return pstring;
  }
}
module.exports = Stats;
