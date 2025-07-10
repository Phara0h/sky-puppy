const fs = require('fs');
var path = require('path');
var log = require('wog')();

class Config {
  constructor() {
    this.version = require(path.dirname(require.main.filename) +
      '/../package.json').version;
    require('nstats')(null, null, this.version);

    process.title = 'Sky Puppy v' + this.version;
    try {
      this.path =
        path.resolve(process.env.SKY_PUPPY_CONFIG_PATH || './') +
        '/sky-puppy-config.json';
      this.settings = JSON.parse(fs.readFileSync(this.path));
    } catch (e) {
      this.path = path.dirname('./') + '/sky-puppy-config.json';
      this.settings = {};
      console.log(
        'Error loading config. Creating and using default one at ' + this.path
      );
    }
    if (!this.alerters) {
      this.settings.alerters = {};
    }

    if (!this.services) {
      this.settings.services = {};
    }

    if (!this.checkers) {
      this.settings.checkers = {
        request: {}
      };
    }

    this.settings.skypuppy = this.settings.skypuppy || {
      version: this.version
    };

    if (!this.settings.skypuppy.log) {
      this.settings.skypuppy.log = {
        enable: true,
        colors: true,
        level: 'error'
      };
    }

    log = require('wog')(this.settings.skypuppy);

    this.displayTitle();
    this.saveConfig();
  }

  addService(name, service) {
    try {
      this.services[name] = service;
      this.saveConfig();
      return this.services[name];
    } catch (e) {
      return null;
    }
  }

  deleteService(name) {
    if (this.services[name]) {
      delete this.services[name];
      this.saveConfig();
      return true;
    } else {
      throw new Error('No service with that name in config.');
    }
  }

  getService(name) {
    return this.services[name];
  }
  get services() {
    return this.settings.services;
  }

  addAlerter(name, service) {
    try {
      this.alerters[name] = service;
      this.saveConfig();
      return this.alerters[name];
    } catch (e) {
      return null;
    }
  }

  deleteAlerter(name) {
    if (this.alerters[name]) {
      delete this.alerters[name];
      this.saveConfig();
      return true;
    } else {
      throw new Error('No alerter with that name in config.');
    }
  }

  getAlerter(name) {
    return this.alerters[name];
  }

  get alerters() {
    return this.settings.alerters;
  }

  getChecker(name) {
    return this.checkers[name];
  }
  get checkers() {
    return this.settings.checkers;
  }

  get skypuppy() {
    return this.settings.skypuppy;
  }

  saveConfig() {
    log.debug('Saving Config...');
    fs.writeFileSync(this.path, JSON.stringify(this.settings, null, 4));
  }

  displayTitle() {
    var space = ' '.repeat(12 - this.version.length);
    var title = `

        (_      v${this.version + space}_)
         /\\                 /\\
        / \\'._   (\\_/)   _.'/ \\
       /_.''._'--('.')--'_.''._\\
       | \\_ / \`;=/ " \\=;\` \\ _/ |
       \\/  \`\\__|\`\\___/\`|__/\`  \\/
        \`       \\(/|\\)/       \`
  ___  _         "___"
 / __>| |__ _ _  | . \\ _ _  ___  ___  _ _
 \\__ \\| / /| | | |  _/| | || . \\| . \\| | |
 <___/|_\\_\\\`_. | |_|  \`___||  _/|  _/\`_. |
           <___'           |_|  |_|  <___'

    `;

    console.log(title);
  }
}
module.exports = Config;
