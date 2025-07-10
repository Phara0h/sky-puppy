# Configuration Guide

Sky Puppy uses a JSON configuration file to define all aspects of your monitoring setup. This guide covers all configuration options and provides practical examples.

## Configuration File Location

By default, Sky Puppy looks for `sky-puppy-config.json` in the current working directory. You can specify a custom path using the `SKY_PUPPY_CONFIG_PATH` environment variable.

## Configuration Structure

```json
{
  "skypuppy": {
    // Sky Puppy application settings
  },
  "checkers": {
    // Global checker configurations
  },
  "alerters": {
    // Alert configurations
  },
  "services": {
    // Service monitoring configurations
  }
}
```

## Complete Configuration Example

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
    "request": {},
    "sky-puppy-checker-template": {
      "foo": "bar",
      "code_messages": {
        "200": "Override me plz",
        "500": "Yikes its down"
      }
    }
  },
  "alerters": {
    "discord_down": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "{{service_name}} is {{alert_type}}!",
            "description": "This service was healthy for {{last_healthy_total_duration}} seconds! {{message}}",
            "color": 14828098,
            "footer": {
              "text": ""
            },
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
          "timeout": 10
        },
        "code_messages": {
          "200": "Service is healthy",
          "500": "Service is down"
        }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "discord_down",
          "for": 2
        },
        {
          "type": "unhealthy_response_time",
          "for": 1,
          "alerter": "discord_down"
        },
        {
          "type": "unhealthy_status",
          "for": 4,
          "alerter": "discord_down"
        },
        {
          "type": "healthy",
          "alerter": "discord_down"
        }
      ]
    }
  }
}
```

## Checkers Configuration

The `checkers` section defines global settings for health checkers that can be used across multiple services.

### Global Checker Configuration

```json
{
  "checkers": {
    "request": {
      "timeout": 60,
      "method": "GET"
    },
    "sky-puppy-checker-template": {
      "foo": "bar",
      "code_messages": {
        "200": "Override me plz",
        "500": "Yikes its down"
      }
    }
  }
}
```

### Checker Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | required | Name of the checker to use |
| `settings` | object | {} | Checker-specific settings |
| `code_messages` | object | {} | Custom messages for different status codes |

## Services Configuration

The `services` section defines what you want to monitor. Each service has a unique name and configuration.

### Basic Service Configuration

```json
{
  "services": {
    "my-website": {
      "interval": 30,
      "start_delay": 5,
      "expected_status": 200,
      "expected_response_time": 1000,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://mywebsite.com/health",
          "timeout": 5,
          "method": "GET"
        },
        "code_messages": {
          "200": "Service is healthy",
          "500": "Service is down"
        }
      }
    }
  }
}
```

### Service Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `interval` | number | 5 | Check interval in seconds |
| `start_delay` | number | 0 | Initial delay before first check (seconds) |
| `expected_status` | number | 200 | Expected HTTP status code for success |
| `expected_response_time` | number | timeout | Expected response time in milliseconds |
| `checker` | object | required | Checker configuration |
| `alerts` | array | [] | Alert configurations for this service |

### Advanced Service Configuration

```json
{
  "services": {
    "api-service": {
      "interval": 15,
      "start_delay": 10,
      "expected_status": 200,
      "expected_response_time": 500,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://api.example.com/health",
          "timeout": 10,
          "method": "POST",
          "headers": {
            "Authorization": "Bearer your-token",
            "Content-Type": "application/json"
          },
          "body": {
            "check": "health",
            "timestamp": "{{timestamp}}"
          },
          "json": true
        },
        "code_messages": {
          "200": "API is healthy",
          "500": "API is experiencing errors",
          "503": "API is temporarily unavailable"
        }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "discord_critical",
          "for": 2
        },
        {
          "type": "unhealthy_response_time",
          "alerter": "slack_warning",
          "for": 3
        },
        {
          "type": "unhealthy_status",
          "alerter": "slack_warning",
          "for": 1
        },
        {
          "type": "unhealthy",
          "alerter": "slack_warning",
          "for": 1
        },
        {
          "type": "healthy",
          "alerter": "discord_recovery"
        }
      ]
    }
  }
}
```

## Alerters Configuration

The `alerters` section defines how to send notifications when services change status.

### Basic Discord Alerter

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
            "title": "🚨 {{service_name}} is {{alert_type}}!",
            "description": "Service was healthy for {{last_healthy_total_duration}} seconds",
            "color": 14828098,
            "timestamp": "{{timestamp}}",
            "footer": {
              "text": "Sky Puppy Monitor"
            }
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    }
  }
}
```

### Slack Alerter

```json
{
  "alerters": {
    "slack_alert": {
      "uri": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
      "json": true,
      "method": "POST",
      "body": {
        "text": "🚨 {{service_name}} is {{alert_type}}!",
        "attachments": [
          {
            "color": "#ff0000",
            "fields": [
              {
                "title": "Service",
                "value": "{{service_name}}",
                "short": true
              },
              {
                "title": "Status",
                "value": "{{alert_type}}",
                "short": true
              },
              {
                "title": "Duration",
                "value": "{{last_healthy_total_duration}} seconds",
                "short": false
              }
            ],
            "timestamp": "{{timestamp}}"
          }
        ]
      }
    }
  }
}
```

### Email Alerter (via SMTP)

```json
{
  "alerters": {
    "email_alert": {
      "uri": "smtp://user:pass@smtp.gmail.com:587",
      "json": false,
      "method": "POST",
      "headers": {
        "From": "sky-puppy@yourdomain.com",
        "To": "admin@yourdomain.com",
        "Subject": "Alert: {{service_name}} is {{alert_type}}"
      },
      "body": "Service {{service_name}} is currently {{alert_type}}. It was healthy for {{last_healthy_total_duration}} seconds."
    }
  }
}
```

### Alerter Template Variables

Sky Puppy provides several template variables for use in alert messages:

| Variable | Description |
|----------|-------------|
| `{{service_name}}` | Name of the service |
| `{{alert_type}}` | Type of alert (down, unhealthy, healthy) |
| `{{timestamp}}` | Current timestamp |
| `{{last_healthy_total_duration}}` | Duration service was healthy (seconds) |
| `{{last_unhealthy_total_duration}}` | Duration service was unhealthy (seconds) |
| `{{response_time}}` | Last response time (milliseconds) |
| `{{status_code}}` | Last HTTP status code |

## Checker Configuration

### HTTP Request Checker

The built-in `request` checker monitors HTTP/HTTPS endpoints.

```json
{
  "checker": {
    "name": "request",
    "settings": {
      "uri": "https://api.example.com/health",
      "timeout": 5,
      "method": "GET",
      "headers": {
        "User-Agent": "Sky-Puppy/1.0"
      },
      "body": {
        "test": "data"
      },
      "json": true,
      "followRedirect": true,
      "validateSSL": true
    }
  }
}
```

### MongoDB Checker

Monitor MongoDB database connections.

```json
{
  "checker": {
    "name": "sky-puppy-checker-mongodb",
    "settings": {
      "uri": "mongodb://localhost:27017",
      "database": "myapp",
      "timeout": 5000
    }
  }
}
```

### Cloudflare Status Checker

Monitor Cloudflare service status.

```json
{
  "checker": {
    "name": "sky-puppy-checker-cloudflare-status",
    "settings": {
      "services": ["cloudflare-dns", "cloudflare-cdn"]
    }
  }
}
```

## Sky Puppy Application Configuration

The `skypuppy` section configures the application itself.

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

### Logging Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | boolean | true | Enable/disable logging |
| `colors` | boolean | true | Enable colored output |
| `level` | string | "info" | Log level (debug, info, warn, error) |

## Environment Variables

Sky Puppy supports several environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `SKY_PUPPY_PORT` | 8069 | Server port |
| `SKY_PUPPY_IP` | 0.0.0.0 | Server IP address |
| `SKY_PUPPY_CONFIG_PATH` | ./sky-puppy-config.json | Path to config file |

## Best Practices

1. **Start with simple configurations** and add complexity gradually
2. **Use meaningful service names** that reflect what you're monitoring
3. **Set appropriate intervals** - don't check too frequently to avoid overwhelming your services
4. **Include timeouts** to prevent hanging requests
5. **Test your alerters** before deploying to production
6. **Use environment variables** for sensitive information like webhook URLs
7. **Monitor the monitor** - ensure Sky Puppy itself is running and healthy 