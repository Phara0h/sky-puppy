# Getting Started with Sky Puppy

Welcome to Sky Puppy! This guide will help you get up and running with service monitoring in just a few minutes.

## 🚀 Quick Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Install Sky Puppy

```bash
npm install -g sky-puppy
```

## 📝 Your First Configuration

Create a file called `sky-puppy-config.json` in your project directory:

```json
{
  "skypuppy": {
    "version": "1.3.8",
    "log": {
      "enable": true,
      "colors": true,
      "level": "info"
    }
  },
  "checkers": {
    "request": {}
  },
  "alerters": {
    "discord_alert": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "🚨 {{service_name}} is {{alert_type}}!",
            "description": "Service was healthy for {{last_healthy_total_duration}} seconds",
            "color": 14828098,
            "timestamp": "{{timestamp}}"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    }
  },
  "services": {
    "my-website": {
      "interval": 30,
      "start_delay": 0,
      "expected_response_time": 1000,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://httpbin.org/status/200",
          "timeout": 5,
          "method": "GET"
        },
        "code_messages": {
          "200": "Service is healthy",
          "500": "Service is down"
        }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "discord_alert",
          "for": 2
        },
        {
          "type": "unhealthy_response_time",
          "alerter": "discord_alert",
          "for": 3
        },
        {
          "type": "unhealthy_status",
          "alerter": "discord_alert",
          "for": 1
        },
        {
          "type": "healthy",
          "alerter": "discord_alert"
        }
      ]
    }
  }
}
```

This configuration will:
- Monitor `https://httpbin.org/status/200` every 30 seconds
- Use a 5-second timeout for requests
- Expect response time under 1000ms
- Use the built-in HTTP request checker
- Send Discord alerts for various health states
- Wait for 2 consecutive failures before sending down alerts
- Wait for 3 consecutive slow responses before sending unhealthy_response_time alerts

## ▶️ Start Monitoring

Run Sky Puppy:

```bash
sky-puppy
```

You should see output like:
```
[INFO] Starting Sky Puppy...
[INFO] Starting service my-website ...
[INFO] Service my-website is healthy (200ms)
```

## 🔍 Check Your Service Status

Sky Puppy provides a REST API to check service status:

```bash
# Check all services
curl http://localhost:8069/skypuppy/v1/service

# Check specific service
curl http://localhost:8069/skypuppy/v1/service/my-website
```

## 📊 View Metrics

Sky Puppy exports Prometheus metrics:

```bash
curl http://localhost:8069/skypuppy/metrics
```

## 🔔 Add Alerts

Let's add Discord alerts to get notified when your service goes down:

```json
{
  "alerters": {
    "discord_alert": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "🚨 {{service_name}} is {{alert_type}}!",
            "description": "Service was healthy for {{last_healthy_total_duration}} seconds",
            "color": 14828098,
            "timestamp": "{{timestamp}}"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    }
  },
  "services": {
    "my-website": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://httpbin.org/status/200",
          "timeout": 5,
          "method": "GET"
        }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "discord_alert"
        },
        {
          "type": "healthy",
          "alerter": "discord_alert"
        }
      ]
    }
  }
}
```

## 🎯 Common Use Cases

### Monitor Multiple Services

```json
{
  "services": {
    "web-frontend": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://myapp.com/health",
          "timeout": 10
        }
      }
    },
    "api-backend": {
      "interval": 15,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://api.myapp.com/health",
          "timeout": 5
        }
      }
    },
    "database": {
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

### Monitor with Authentication

```json
{
  "services": {
    "protected-api": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://api.example.com/health",
          "timeout": 10,
          "headers": {
            "Authorization": "Bearer your-api-token"
          }
        }
      }
    }
  }
}
```

### Monitor with Custom Health Checks

```json
{
  "services": {
    "my-app": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://myapp.com/health",
          "method": "POST",
          "body": {
            "check": "database",
            "check": "cache"
          },
          "json": true
        }
      }
    }
  }
}
```

## 🔧 Configuration Options

### Service Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `interval` | number | 5 | Check interval in seconds |
| `start_delay` | number | 0 | Initial delay before first check |
| `expected_status` | number | 200 | Expected HTTP status code |

### Environment Variables

```bash
# Custom port
export SKY_PUPPY_PORT=9000

# Custom config file
export SKY_PUPPY_CONFIG_PATH=/path/to/config.json

# Custom IP
export SKY_PUPPY_IP=127.0.0.1
```

## 🐛 Troubleshooting

### Common Issues

1. **Service not starting**
   - Check your JSON syntax
   - Verify the URI is accessible
   - Check network connectivity

2. **Alerts not sending**
   - Verify webhook URLs
   - Check network connectivity
   - Test webhook manually with curl

3. **High response times**
   - Increase timeout values
   - Check network latency
   - Consider using closer endpoints

### Debug Mode

Enable debug logging:

```json
{
  "skypuppy": {
    "log": {
      "level": "debug"
    }
  }
}
```

## 📚 Next Steps

Now that you have Sky Puppy running, explore these features:

- [Configuration Guide](configuration.md) - Detailed configuration options
- [Alerting Guide](alerting.md) - Set up notifications for various platforms
- [Custom Checkers](checkers.md) - Create checkers for your specific services
- [API Reference](https://documenter.getpostman.com/view/208035/TVYKawgU) - Full API documentation

## 🆘 Need Help?

- Check the [documentation](https://github.com/Phara0h/sky-puppy#readme)
- Join our [Discussions](https://github.com/Phara0h/sky-puppy/discussions)
- Report issues on [GitHub](https://github.com/Phara0h/sky-puppy/issues)

---

Happy monitoring! 🐕✨ 