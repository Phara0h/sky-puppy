# Sky Puppy
![Sky Puppy](https://i.imgur.com/aqlG9cX.png)

> **Lightning-fast, reliable health monitoring for your services with Prometheus metrics and smart alerting**

[![npm version](https://badge.fury.io/js/sky-puppy.svg)](https://badge.fury.io/js/sky-puppy) [![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0--or--later-green.svg)](https://opensource.org/licenses/GPL-3.0-or-later)

Sky Puppy is a powerful, lightweight health monitoring service that keeps your applications running smoothly. Monitor HTTP endpoints, databases, and custom services with real-time alerts and Prometheus metrics export.

## ✨ Features

- **Lightning Fast**: Built with Fastify for exceptional performance
- **Multiple Checkers**: HTTP/HTTPS, MongoDB, Cloudflare Status, and custom checkers
- **Prometheus Metrics**: Built-in metrics export for monitoring dashboards
- **Smart Alerting**: Discord, Slack, and custom webhook integrations
- **Real-time Monitoring**: Configurable check intervals down to seconds
- **Reliable**: Robust error handling and automatic recovery
- **Easy Configuration**: Simple JSON configuration
- **RESTful API**: Full API for dynamic service management
- **Health Status Tracking**: Detailed uptime and performance metrics

## 🚀 Quick Start

### Installation

```bash
npm install -g sky-puppy
```

### Basic Usage

1. **Create a configuration file** (`sky-puppy-config.json`):

```json
{
  "services": {
    "my-website": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://mywebsite.com/health",
          "timeout": 5,
          "method": "GET"
        }
      }
    }
  }
}
```

2. **Run Sky Puppy**:

```bash
sky-puppy
```

3. **Check your service status**:

```bash
curl http://localhost:8069/skypuppy/v1/service/my-website
```

## 📋 Configuration

Sky Puppy uses a JSON configuration file to define services, checkers, and alerters.

### Service Configuration

```json
{
  "services": {
    "service-name": {
      "interval": 30,                    // Check interval in seconds
      "start_delay": 5,                  // Initial delay before first check
      "expected_status": 200,            // Expected HTTP status code
      "checker": {
        "name": "request",               // Checker type
        "settings": {
          "uri": "https://api.example.com/health",
          "timeout": 5,                  // Request timeout in seconds
          "method": "GET",               // HTTP method
          "headers": {                   // Custom headers
            "Authorization": "Bearer token"
          },
          "body": {                      // Request body (for POST/PUT)
            "test": "data"
          }
        }
      },
      "alerts": [                        // Alert configurations
        {
          "type": "down",
          "alerter": "discord_down"
        },
        {
          "type": "healthy",
          "alerter": "discord_healthy"
        }
      ]
    }
  }
}
```

### Alert Configuration

```json
{
  "alerters": {
    "discord_down": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "🚨 undefined is undefined!",
            "description": "Service was healthy for undefined seconds",
            "color": 14828098,
            "timestamp": "undefined"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    }
  }
}
```

## 🔌 Available Checkers

### Built-in Checkers

- **`request`**: HTTP/HTTPS endpoint monitoring
- **`mongodb`**: MongoDB connection health checks
- **`cloudflare-status`**: Cloudflare service status monitoring

### Custom Checkers

Create your own checkers using the [checker template](https://github.com/Phara0h/sky-puppy-checker-template):

```bash
npm install -g sky-puppy-checker-template
```

## 📊 Monitoring & Metrics

### Health Endpoints

- `GET /skypuppy/health` - Service health status
- `GET /skypuppy/metrics` - Prometheus metrics export

### API Endpoints

- `GET /skypuppy/v1/service/{name}` - Get service status
- `POST /skypuppy/v1/service` - Add new service
- `PUT /skypuppy/v1/service/{name}` - Update service
- `DELETE /skypuppy/v1/service/{name}` - Remove service

### Prometheus Metrics

Sky Puppy exports the following metrics:

- `sky_puppy_service_health_status` - Service health status (0=down, 1=unhealthy, 2=healthy)
- `sky_puppy_service_response_time` - Service response time in milliseconds
- `sky_puppy_service_check_count` - Total number of checks performed

## 🎯 Use Cases

### Web Application Monitoring
```json
{
  "services": {
    "web-app": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://myapp.com/api/health",
          "timeout": 10,
          "method": "GET"
        }
      }
    }
  }
}
```

### Database Health Checks
```json
{
  "services": {
    "mongodb": {
      "interval": 60,
      "checker": {
        "name": "sky-puppy-checker-mongodb",
        "settings": {
          "uri": "mongodb://localhost:27017",
          "database": "myapp"
        }
      }
    }
  }
}
```

### External Service Monitoring
```json
{
  "services": {
    "cloudflare": {
      "interval": 300,
      "checker": {
        "name": "sky-puppy-checker-cloudflare-status",
        "settings": {
          "services": ["cloudflare-dns", "cloudflare-cdn"]
        }
      }
    }
  }
}
```

## 🔧 Advanced Configuration

### Environment Variables

- `SKY_PUPPY_PORT` - Server port (default: 8069)
- `SKY_PUPPY_IP` - Server IP (default: 0.0.0.0)
- `SKY_PUPPY_CONFIG_PATH` - Custom config folder path

### Logging Configuration

```json
{
  "skypuppy": {
    "version": "1.0.0",
    "log": {
      "enable": true,
      "colors": true,
      "level": "info"
    }
  }
}
```

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine
RUN npm install -g sky-puppy
COPY sky-puppy-config.json /app/
WORKDIR /app
EXPOSE 8069
CMD ["sky-puppy"]
```

### Systemd Service

```ini
[Unit]
Description=Sky Puppy Health Monitor
After=network.target

[Service]
Type=simple
User=sky-puppy
WorkingDirectory=/opt/sky-puppy
ExecStart=/usr/bin/sky-puppy
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/Phara0h/sky-puppy.git
cd sky-puppy
npm install
npm test
```

## 📚 Documentation

- [API Reference](https://documenter.getpostman.com/view/208035/TVYKawgU)
- [Configuration Guide](docs/configuration.md)
- [Checker Development](docs/checkers.md)
- [Alerting Setup](docs/alerting.md)

## 📄 License

This project is licensed under the GPL-3.0-or-later License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Fastify](https://fastify.io/) for blazing fast performance
- Prometheus metrics powered by [nstats](https://github.com/Phara0h/nstats)
- Templating with the tiniest and fastest javascript templating engine [nbars](https://github.com/Phara0h/nbars)

---

**Made with ❤️ by the Sky Puppy community**

[Report a Bug](https://github.com/Phara0h/sky-puppy/issues) | [Request a Feature](https://github.com/Phara0h/sky-puppy/issues) | [Star on GitHub](https://github.com/Phara0h/sky-puppy)


## Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v1.4.1](https://github.com/Phara0h/sky-puppy/compare/v1.4.0...v1.4.1)

#####   [`370545f`](https://github.com/Phara0h/sky-puppy/commit/370545f249af288ef411ccd7b9163f0c3f540264)update mdsquash

#### [v1.4.0](https://github.com/Phara0h/sky-puppy/compare/v1.3.8...v1.4.0)

> 10 July 2025

#####   [`596e16d`](https://github.com/Phara0h/sky-puppy/commit/596e16d919295b0321c8460a436ba3ad47764949)Tons of documentation, new website and cleanup

#### [v1.3.8](https://github.com/Phara0h/sky-puppy/compare/v1.3.7...v1.3.8)

> 11 December 2020

#####   [`628dc13`](https://github.com/Phara0h/sky-puppy/commit/628dc135553f811d6ccf565249ce690cb025eb8e)FIxed some bugs, made sky puppy more crash safe and better logging

#### [v1.3.7](https://github.com/Phara0h/sky-puppy/compare/v1.3.6...v1.3.7)

> 18 November 2020

#####   [`0cc7817`](https://github.com/Phara0h/sky-puppy/commit/0cc78172c6f40edb0e50ff3efd33a6becd3b6ec9)Fixed a minor bug, dates should now work in prom.

#### [v1.3.6](https://github.com/Phara0h/sky-puppy/compare/v1.3.5...v1.3.6)

> 17 November 2020

#####   [`61b2674`](https://github.com/Phara0h/sky-puppy/commit/61b267410b7dfcff222ff841b594a659f05ddf5e)Minor debug fix

#### [v1.3.5](https://github.com/Phara0h/sky-puppy/compare/v1.3.4...v1.3.5)

> 17 November 2020

#####   [`ec30c55`](https://github.com/Phara0h/sky-puppy/commit/ec30c55cdaed1a4e7eee81dccef1ae388b92ee8a)Few fixes

- Added date to each prom stats only when it was updated
- Fixed bug with version not showing in prom stats
- Fixed possible bug around alerts

#### [v1.3.4](https://github.com/Phara0h/sky-puppy/compare/v1.3.3...v1.3.4)

> 4 November 2020

#####   [`e196e2b`](https://github.com/Phara0h/sky-puppy/commit/e196e2bf498bc3491f6feac0ac53b692bdd6e502)Fixed bug `Cannot find module` package.json

#### [v1.3.3](https://github.com/Phara0h/sky-puppy/compare/v1.3.2...v1.3.3)

> 4 November 2020

#####   [`9b1b3c0`](https://github.com/Phara0h/sky-puppy/commit/9b1b3c097cc7e4509c860a3160a2dfebbecfc1ba)Fixed bin package bug

#### [v1.3.2](https://github.com/Phara0h/sky-puppy/compare/v1.3.1...v1.3.2)

> 4 November 2020

#####   [`6197717`](https://github.com/Phara0h/sky-puppy/commit/61977172f631ea3517cbf04d3b1056fb6d4e9f38)ETIMEDOUT is now `unhealthy` instead of `down`

#### [v1.3.1](https://github.com/Phara0h/sky-puppy/compare/v1.3.0...v1.3.1)

> 4 November 2020

#####   [`9712744`](https://github.com/Phara0h/sky-puppy/commit/971274485311642389f0ecd0f47dfd3fe044d348)Update changelog-template.hbs

#### [v1.3.0](https://github.com/Phara0h/sky-puppy/compare/v1.2.0...v1.3.0)

> 4 November 2020

#####   [`bd98346`](https://github.com/Phara0h/sky-puppy/commit/bd9834615c809569f714ac4dcc01ab00838f73cf)Fixed bugs and added pretty console logs

- Fixed `last_unhealthy_total_duration` and `last_healthy_total_duration` bug reporting the wrong elapsed time.
- Fixed `healthy` status getting reported even when unhealthy/down has not yet been reported.
- Fixed bug relating to console title displaying config version instead of application version.
- Added new console logs (see sample config for details)
- Added 2 new test-server routes

#### [v1.2.0](https://github.com/Phara0h/sky-puppy/compare/v1.1.2...v1.2.0)

> 3 November 2020

#####   [`6604d77`](https://github.com/Phara0h/sky-puppy/commit/6604d77123392a478df83dc7df6e48ed907edb91)Clean up and more

-  Added skypuppy console log title
- Fixed eslint issues
- Fixed bug that altered on healthy status at start of sky puppy
- Fixed bug if settings field was left out of services checkers

#### [v1.1.2](https://github.com/Phara0h/sky-puppy/compare/v1.1.1...v1.1.2)

> 2 November 2020

#####   [`6e251c0`](https://github.com/Phara0h/sky-puppy/commit/6e251c0f8d2365add9280d6b847331fdeb2f5cb5)Added `sky-puppy-checker-cloudflare-status` to the list of checkers

#####   [`d204255`](https://github.com/Phara0h/sky-puppy/commit/d204255d1b1f86183778f872b8e879f746e44f04)Added sky-puppy-checker-mongodb to list of checkers

#### [v1.1.1](https://github.com/Phara0h/sky-puppy/compare/v1.1.0...v1.1.1)

> 2 November 2020

#####   [`4b1a2e4`](https://github.com/Phara0h/sky-puppy/commit/4b1a2e414739b80903d61383e1c34ab8fc3c8f17)Fixed changelog to have full commit message

#### [v1.1.0](https://github.com/Phara0h/sky-puppy/compare/v1.0.2...v1.1.0)

> 2 November 2020

#####   [`7f27201`](https://github.com/Phara0h/sky-puppy/commit/7f2720100f876e2f10ce6e46ea3a0098c0db83fc)New feature: Messages

* Added the ability to add messages from checkers
* Messages can be accessed in alterters message / viewed in prom
* Added the ability to map codes to messages in a global setting via checkers settings EX:
```json
"sky-puppy-checker-template": {
"foo": "bar",
"code_messages": {
"200": "Override me plz",
"500": "Yikes its down"
}
}
```
* Added the ability to override those code_messages inside each service as well EX:

```json
"checker": {
"name": "sky-puppy-checker-template",
"settings": {
"bar": "test"
},
"code_messages": {
"200": "Yup its up"
}
}
```

#### [v1.0.2](https://github.com/Phara0h/sky-puppy/compare/v1.0.1...v1.0.2)

> 30 October 2020

#####   [`a927cdf`](https://github.com/Phara0h/sky-puppy/commit/a927cdf104bb2f8acf7baa99485ebd2135d2427c)Added sky-puppy-checker-template to tests and readme

#### [v1.0.1](https://github.com/Phara0h/sky-puppy/compare/v1.0.0...v1.0.1)

> 30 October 2020

#####   [`7674805`](https://github.com/Phara0h/sky-puppy/commit/7674805fae0b7e39b56dbbeef18ede9216e22956)Fixed bug around checkers name

### [v1.0.0](https://github.com/Phara0h/sky-puppy/compare/v0.3.0...v1.0.0)

> 30 October 2020

#####   [`344b6f0`](https://github.com/Phara0h/sky-puppy/commit/344b6f02dfa4b31d0720b7c047d034a7f118684a)Added module based checkers! Now you can write custom checkers to check any thing.

#### [v0.3.0](https://github.com/Phara0h/sky-puppy/compare/v0.2.1...v0.3.0)

> 30 October 2020

#####   [`5d614eb`](https://github.com/Phara0h/sky-puppy/commit/5d614eb20b62ba5b616f67aeffddda1bfd5575de)Added endpoints, Added postman docs, Fixed bugs and more!

#####   [`f6f9a56`](https://github.com/Phara0h/sky-puppy/commit/f6f9a56b35b31797f9409c97df4c3b3dc5ae5a4b)added process tile

#### [v0.2.1](https://github.com/Phara0h/sky-puppy/compare/v0.2.0...v0.2.1)

> 14 September 2020

#####   [`505209a`](https://github.com/Phara0h/sky-puppy/commit/505209afdac682daca37284a5f69fd98b14b8145)Update README.nbs

#### v0.2.0

> 14 September 2020

#####   [`b03ca2e`](https://github.com/Phara0h/sky-puppy/commit/b03ca2ee43ac5754f020d1963dcb9e201cd47e0d)init commit config based is done REST endpoints to come

#####   [`b7535a3`](https://github.com/Phara0h/sky-puppy/commit/b7535a3a3990fe081f932dc6e1079a86bdf9842f)Initial commit

