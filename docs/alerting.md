# Alerting Guide

Sky Puppy provides flexible alerting capabilities to notify you when your services change status. This guide covers setting up alerts for various platforms and best practices for effective monitoring.

## Alert Types

Sky Puppy supports five types of alerts:

- **`down`** - Service is completely unavailable (status code -1)
- **`unhealthy`** - Service is responding but with issues (status code 0)
- **`unhealthy_status`** - Service returned unexpected status code (status code 0)
- **`unhealthy_response_time`** - Service is responding too slowly (status code 0)
- **`healthy`** - Service has recovered and is working normally (status code 1)

> **Note:** The `unhealthy_status` and `unhealthy_response_time` alerts are triggered when the service returns status code 0, indicating a specific type of unhealthy state.

## Basic Alert Configuration

Alerts are configured in the `alerters` section of your Sky Puppy configuration:

```json
{
  "alerters": {
    "my-alerter": {
      "uri": "https://your-webhook-url.com",
      "json": true,
      "method": "POST",
      "body": {
        "message": "{{service_name}} is {{alert_type}}!"
      }
    }
  },
  "services": {
    "my-service": {
      "interval": 30,
      "expected_response_time": 1000,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://myapp.com/health"
        }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "my-alerter",
          "for": 2
        },
        {
          "type": "unhealthy_response_time",
          "alerter": "my-alerter",
          "for": 3
        },
        {
          "type": "unhealthy_status",
          "alerter": "my-alerter",
          "for": 1
        },
        {
          "type": "unhealthy",
          "alerter": "my-alerter",
          "for": 1
        },
        {
          "type": "healthy",
          "alerter": "my-alerter"
        }
      ]
    }
  }
}
```

## Alert Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | required | Alert type: down, unhealthy, unhealthy_status, unhealthy_response_time, healthy |
| `alerter` | string | required | Name of the alerter to use |
| `for` | number | 1 | Number of consecutive failures before alerting |
| `overrides` | object | {} | Override alerter settings for this specific alert |

## Discord Alerts

Discord is one of the most popular platforms for Sky Puppy alerts due to its rich embed support.

### Setting Up Discord Webhooks

1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL

### Basic Discord Alert

```json
{
  "alerters": {
    "discord_down": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "🚨 Service Alert",
            "description": "{{service_name}} is {{alert_type}}!",
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

### Advanced Discord Alert with Status Colors

```json
{
  "alerters": {
    "discord_critical": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "🚨 {{service_name}} is {{alert_type}}!",
            "description": "Service was healthy for {{last_healthy_total_duration}} seconds before going down.",
            "color": 14828098,
            "fields": [
              {
                "name": "Service",
                "value": "{{service_name}}",
                "inline": true
              },
              {
                "name": "Status",
                "value": "{{alert_type}}",
                "inline": true
              },
              {
                "name": "Response Time",
                "value": "{{response_time}}ms",
                "inline": true
              },
              {
                "name": "Uptime",
                "value": "{{last_healthy_total_duration}} seconds",
                "inline": false
              }
            ],
            "timestamp": "{{timestamp}}",
            "footer": {
              "text": "Sky Puppy Monitor"
            }
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    },
    "discord_recovery": {
      "uri": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
      "json": true,
      "method": "POST",
      "body": {
        "embeds": [
          {
            "title": "✅ {{service_name}} is back online!",
            "description": "Service recovered after {{last_unhealthy_total_duration}} seconds of downtime.",
            "color": 6480450,
            "timestamp": "{{timestamp}}",
            "footer": {
              "text": "Sky Puppy Monitor"
            }
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/3rfFeOu.png"
      }
    }
  }
}
```

## Slack Alerts

Slack provides excellent integration capabilities for team notifications.

### Setting Up Slack Webhooks

1. Go to your Slack workspace settings
2. Navigate to Apps → Custom Integrations → Incoming Webhooks
3. Create a new webhook
4. Copy the webhook URL

### Basic Slack Alert

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

### Slack Alert with Different Colors

```json
{
  "alerters": {
    "slack_critical": {
      "uri": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
      "json": true,
      "method": "POST",
      "body": {
        "text": "🚨 {{service_name}} is {{alert_type}}!",
        "attachments": [
          {
            "color": "#ff0000",
            "title": "Service Down",
            "text": "{{service_name}} is currently unavailable",
            "fields": [
              {
                "title": "Uptime",
                "value": "{{last_healthy_total_duration}} seconds",
                "short": true
              },
              {
                "title": "Response Time",
                "value": "{{response_time}}ms",
                "short": true
              }
            ],
            "timestamp": "{{timestamp}}"
          }
        ]
      }
    },
    "slack_warning": {
      "uri": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
      "json": true,
      "method": "POST",
      "body": {
        "text": "⚠️ {{service_name}} is {{alert_type}}!",
        "attachments": [
          {
            "color": "#ffa500",
            "title": "Service Unhealthy",
            "text": "{{service_name}} is responding but with issues",
            "timestamp": "{{timestamp}}"
          }
        ]
      }
    },
    "slack_recovery": {
      "uri": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
      "json": true,
      "method": "POST",
      "body": {
        "text": "✅ {{service_name}} is back online!",
        "attachments": [
          {
            "color": "#00ff00",
            "title": "Service Recovered",
            "text": "{{service_name}} is now healthy again",
            "fields": [
              {
                "title": "Downtime",
                "value": "{{last_unhealthy_total_duration}} seconds",
                "short": true
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

## Email Alerts

For critical alerts, email notifications can be sent via SMTP.

### SMTP Email Alert

```json
{
  "alerters": {
    "email_critical": {
      "uri": "smtp://user:pass@smtp.gmail.com:587",
      "json": false,
      "method": "POST",
      "headers": {
        "From": "sky-puppy@yourdomain.com",
        "To": "admin@yourdomain.com",
        "Subject": "🚨 ALERT: {{service_name}} is {{alert_type}}"
      },
      "body": "Service {{service_name}} is currently {{alert_type}}.\n\nDetails:\n- Service: {{service_name}}\n- Status: {{alert_type}}\n- Uptime: {{last_healthy_total_duration}} seconds\n- Response Time: {{response_time}}ms\n- Timestamp: {{timestamp}}\n\nPlease investigate immediately."
    }
  }
}
```

## Microsoft Teams Alerts

Microsoft Teams supports webhook notifications for monitoring alerts.

### Teams Webhook Alert

```json
{
  "alerters": {
    "teams_alert": {
      "uri": "https://your-org.webhook.office.com/webhookb2/YOUR_WEBHOOK_URL",
      "json": true,
      "method": "POST",
      "body": {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "{{service_name}} is {{alert_type}}",
        "sections": [
          {
            "activityTitle": "🚨 {{service_name}} is {{alert_type}}!",
            "activitySubtitle": "{{timestamp}}",
            "facts": [
              {
                "name": "Service",
                "value": "{{service_name}}"
              },
              {
                "name": "Status",
                "value": "{{alert_type}}"
              },
              {
                "name": "Uptime",
                "value": "{{last_healthy_total_duration}} seconds"
              },
              {
                "name": "Response Time",
                "value": "{{response_time}}ms"
              }
            ]
          }
        ]
      }
    }
  }
}
```

## PagerDuty Alerts

For critical services, PagerDuty integration can trigger on-call rotations.

### PagerDuty Webhook Alert

```json
{
  "alerters": {
    "pagerduty_critical": {
      "uri": "https://events.pagerduty.com/v2/enqueue",
      "json": true,
      "method": "POST",
      "body": {
        "routing_key": "YOUR_PAGERDUTY_ROUTING_KEY",
        "event_action": "trigger",
        "payload": {
          "summary": "{{service_name}} is {{alert_type}}",
          "severity": "critical",
          "source": "sky-puppy",
          "custom_details": {
            "service": "{{service_name}}",
            "status": "{{alert_type}}",
            "uptime": "{{last_healthy_total_duration}} seconds",
            "response_time": "{{response_time}}ms"
          }
        }
      }
    }
  }
}
```

## Custom Webhook Alerts

For integration with custom systems, you can use generic webhooks.

### Generic Webhook Alert

```json
{
  "alerters": {
    "custom_webhook": {
      "uri": "https://your-api.com/webhooks/monitoring",
      "json": true,
      "method": "POST",
      "headers": {
        "Authorization": "Bearer your-api-token",
        "Content-Type": "application/json"
      },
      "body": {
        "event": "service_status_change",
        "service": "{{service_name}}",
        "status": "{{alert_type}}",
        "timestamp": "{{timestamp}}",
        "uptime": "{{last_healthy_total_duration}}",
        "response_time": "{{response_time}}",
        "environment": "production"
      }
    }
  }
}
```

## Template Variables

Sky Puppy provides several template variables for use in alert messages:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{service_name}}` | Name of the service | "web-frontend" |
| `{{alert_type}}` | Type of alert | "down", "unhealthy", "healthy" |
| `{{timestamp}}` | Current timestamp | "2024-01-15T10:30:00Z" |
| `{{last_healthy_total_duration}}` | Duration service was healthy (seconds) | "3600" |
| `{{last_unhealthy_total_duration}}` | Duration service was unhealthy (seconds) | "300" |
| `{{response_time}}` | Last response time (milliseconds) | "150" |
| `{{status_code}}` | Last HTTP status code | "500" |

## Alert Best Practices

### 1. Use Different Alerters for Different Severities

```json
{
  "services": {
    "critical-service": {
      "alerts": [
        {
          "type": "down",
          "alerter": "pagerduty_critical"
        },
        {
          "type": "unhealthy",
          "alerter": "slack_warning"
        },
        {
          "type": "healthy",
          "alerter": "slack_recovery"
        }
      ]
    }
  }
}
```

### 2. Include Relevant Information

Always include:
- Service name
- Current status
- Duration information
- Response time
- Timestamp

### 3. Use Appropriate Colors and Icons

- 🔴 Red for critical/down alerts
- 🟡 Yellow/Orange for warnings/unhealthy
- 🟢 Green for recovery/healthy

### 4. Avoid Alert Fatigue

- Don't send alerts for every status change
- Use different channels for different severity levels
- Consider implementing alert aggregation

### 5. Test Your Alerts

Before deploying to production:
- Test all alert types
- Verify webhook URLs are correct
- Check that template variables are working
- Ensure proper formatting in your chosen platform

### 6. Use Environment Variables for Sensitive Data

```bash
# Set environment variables
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Use in configuration
{
  "alerters": {
    "discord_alert": {
      "uri": "${DISCORD_WEBHOOK_URL}",
      // ... rest of configuration
    }
  }
}
```

## Troubleshooting Alerts

### Common Issues

1. **Alerts not sending**: Check webhook URLs and network connectivity
2. **Wrong formatting**: Verify JSON structure and template variables
3. **Rate limiting**: Some platforms limit webhook frequency
4. **Authentication**: Ensure API tokens and webhook URLs are correct

### Debugging Tips

1. Check Sky Puppy logs for alert errors
2. Test webhooks manually using curl
3. Verify template variable syntax
4. Check platform-specific webhook documentation

## Alert Aggregation

For high-frequency services, consider implementing alert aggregation to avoid spam:

```json
{
  "alerters": {
    "aggregated_alert": {
      "uri": "https://your-aggregation-service.com/webhook",
      "json": true,
      "method": "POST",
      "body": {
        "service": "{{service_name}}",
        "status": "{{alert_type}}",
        "timestamp": "{{timestamp}}",
        "aggregate": true
      }
    }
  }
}
```

This approach allows you to collect multiple alerts and send them as a single notification, reducing noise while maintaining visibility into service health. 