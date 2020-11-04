'use strict';

const colors = require('colors');
const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
};

class Logger {
  constructor(config) {
    this.logger = console || require(config.log.logger);
    this.level = levels[config.log.level];
    this.config = config;
  }

  log(level, ...msg) {
    if (level >= this.level) {
      if (this.config.log.enable && this.config.log.colors) {
        var color = 'magenta';

        switch (level) {
          case levels.info:
            color = 'white';
            break;
          case levels.warn:
            color = 'yellow';
            break;
          case levels.error:
            color = 'red';
            break;
          case levels.debug:
            color = 'blue';
            break;
          case levels.fatal:
            color = 'red';
            break;
          case levels.trace:
            color = 'green';
            break;
          default:
            break;
        }
        this.logger.log(
          '[' + colors[color](this.getLevelString(level)) + '] ',
          ...msg
        );
      } else if (this.config.log.enable) {
        this.logger.log('[' + this.getLevelString(level) + '] ', ...msg);
      }
    }
  }

  info(...msg) {
    this.log(levels.info, ...msg);
  }
  warn(...msg) {
    this.log(levels.warn, ...msg);
  }
  error(...msg) {
    this.log(levels.error, ...msg);
  }
  debug(...msg) {
    this.log(levels.debug, ...msg);
  }
  fatal(...msg) {
    this.log(levels.fatal, ...msg);
  }
  trace(...msg) {
    this.log(levels.trace, ...msg);
  }

  getLevelString(level) {
    switch (level) {
      case levels.info:
        return 'INFO';
      case levels.warn:
        return 'WARN';
      case levels.error:
        return 'ERROR';
      case levels.debug:
        return 'DEBUG';
      case levels.fatal:
        return 'FATAL';
      case levels.trace:
        return 'TRACE';
      default:
        break;
    }
  }
}

var logger;

module.exports = function(config) {
  if (!logger) {
    logger = new Logger(config);
  }

  return logger;
};
