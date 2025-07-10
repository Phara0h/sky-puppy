# Custom Checkers Guide

Sky Puppy's modular architecture allows you to create custom checkers for any type of service or system. This guide shows you how to build your own checkers and integrate them with Sky Puppy.

## Checker Architecture

A Sky Puppy checker is a Node.js module that exports a class with specific methods. The checker is responsible for:

1. **Initialization** - Setting up connections, configurations, etc.
2. **Health Checking** - Performing the actual health check
3. **Cleanup** - Properly closing connections and resources

## Basic Checker Structure

```javascript
class MyCustomChecker {
  constructor(config, service, settings) {
    this.config = config;
    this.service = service;
    this.settings = settings;
  }

  async init() {
    // Initialize connections, validate settings, etc.
  }

  async check() {
    // Perform the health check
    // Return: { code: number, message: string }
  }

  async close() {
    // Clean up resources
  }
}

module.exports = function(config, service, settings) {
  return new MyCustomChecker(config, service, settings);
};
```

## Creating Your First Checker

Let's create a simple checker that monitors a file's existence:

```javascript
const fs = require('fs').promises;
const path = require('path');

class FileChecker {
  constructor(config, service, settings) {
    this.config = config;
    this.service = service;
    this.settings = settings;
    this.filePath = settings.file_path;
  }

  async init() {
    if (!this.filePath) {
      throw new Error('file_path is required for FileChecker');
    }
    
    // Validate that the file path is safe
    if (path.isAbsolute(this.filePath) && !this.filePath.startsWith('/safe/directory')) {
      throw new Error('File path must be within safe directory');
    }
  }

  async check() {
    try {
      await fs.access(this.filePath);
      return {
        code: 200,
        message: `File ${this.filePath} exists`
      };
    } catch (error) {
      return {
        code: 404,
        message: `File ${this.filePath} not found: ${error.message}`
      };
    }
  }

  async close() {
    // No cleanup needed for file operations
  }
}

module.exports = function(config, service, settings) {
  return new FileChecker(config, service, settings);
};
```

## Advanced Checker Example

Here's a more complex checker that monitors a Redis database:

```javascript
const Redis = require('ioredis');

class RedisChecker {
  constructor(config, service, settings) {
    this.config = config;
    this.service = service;
    this.settings = settings;
    this.client = null;
    this.timeout = settings.timeout || 5000;
  }

  async init() {
    if (!this.settings.uri) {
      throw new Error('Redis URI is required');
    }

    this.client = new Redis(this.settings.uri, {
      lazyConnect: true,
      commandTimeout: this.timeout,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });

    // Test the connection
    await this.client.ping();
  }

  async check() {
    try {
      const startTime = Date.now();
      
      // Test basic operations
      await this.client.ping();
      await this.client.set('sky-puppy-test', 'ok', 'EX', 10);
      const result = await this.client.get('sky-puppy-test');
      
      const responseTime = Date.now() - startTime;
      
      if (result === 'ok') {
        return {
          code: 200,
          message: `Redis is responding (${responseTime}ms)`
        };
      } else {
        return {
          code: 500,
          message: 'Redis test operation failed'
        };
      }
    } catch (error) {
      return {
        code: 503,
        message: `Redis connection failed: ${error.message}`
      };
    }
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

module.exports = function(config, service, settings) {
  return new RedisChecker(config, service, settings);
};
```

## Checker Configuration

To use your custom checker, add it to your Sky Puppy configuration:

```json
{
  "checkers": {
    "my-file-checker": {
      "file_path": "/var/log/important.log"
    },
    "my-redis-checker": {
      "uri": "redis://localhost:6379",
      "timeout": 5000,
      "code_messages": {
        "200": "Redis is healthy",
        "503": "Redis connection failed"
      }
    }
  },
  "services": {
    "my-file": {
      "interval": 60,
      "checker": {
        "name": "my-file-checker",
        "settings": {
          "file_path": "/var/log/important.log"
        },
        "code_messages": {
          "200": "File exists and is accessible",
          "404": "File not found"
        }
      }
    },
    "redis-db": {
      "interval": 30,
      "checker": {
        "name": "my-redis-checker",
        "settings": {
          "uri": "redis://localhost:6379",
          "timeout": 5000
        },
        "code_messages": {
          "200": "Redis is responding normally",
          "503": "Redis is unavailable"
        }
      }
    }
  }
}
```

## Custom Status Messages

You can customize the messages returned by your checker for different status codes using the `code_messages` feature:

```json
{
  "services": {
    "my-service": {
      "interval": 30,
      "checker": {
        "name": "request",
        "settings": {
          "uri": "https://api.example.com/health"
        },
        "code_messages": {
          "200": "Service is healthy and responding",
          "500": "Service is experiencing internal errors",
          "503": "Service is temporarily unavailable",
          "404": "Health endpoint not found"
        }
      }
    }
  }
}
```

The `code_messages` object maps HTTP status codes to custom messages. When your checker returns a specific status code, Sky Puppy will use the corresponding message instead of the default one.

> **Note:** The `code_messages` can be defined both globally in the `checkers` section and locally in each service's checker configuration. Local settings override global ones.

## Publishing Your Checker

To make your checker available to others, publish it as an npm package:

1. **Create a package.json**:

```json
{
  "name": "sky-puppy-checker-my-service",
  "version": "1.0.0",
  "description": "Sky Puppy checker for MyService",
  "main": "index.js",
  "keywords": ["sky-puppy", "checker", "health", "monitoring"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "my-service-client": "^1.0.0"
  }
}
```

2. **Create an index.js**:

```javascript
const MyServiceChecker = require('./checker');

module.exports = MyServiceChecker;
```

3. **Publish to npm**:

```bash
npm publish
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully and provide meaningful error messages:

```javascript
async check() {
  try {
    // Your check logic
    return { status: 'healthy', message: 'Service is up' };
  } catch (error) {
    // Log the full error for debugging
    console.error('Checker error:', error);
    
    // Return user-friendly message
    return {
      status: 'down',
      message: `Service unavailable: ${error.message}`
    };
  }
}
```

### 2. Resource Management

Properly manage connections and resources:

```javascript
async init() {
  this.connection = await createConnection(this.settings);
}

async close() {
  if (this.connection) {
    await this.connection.close();
    this.connection = null;
  }
}
```

### 3. Configuration Validation

Validate required settings in the `init()` method:

```javascript
async init() {
  const required = ['host', 'port', 'database'];
  for (const field of required) {
    if (!this.settings[field]) {
      throw new Error(`${field} is required for this checker`);
    }
  }
}
```

### 4. Performance Considerations

- Use timeouts to prevent hanging checks
- Implement connection pooling for database checkers
- Cache results when appropriate
- Use lightweight operations for frequent checks

### 5. Security

- Validate file paths and URLs
- Sanitize user inputs
- Use environment variables for sensitive data
- Implement proper authentication

## Testing Your Checker

Create tests for your checker:

```javascript
const assert = require('assert');
const MyChecker = require('./checker');

describe('MyChecker', () => {
  let checker;

  beforeEach(async () => {
    checker = new MyChecker({}, {}, { uri: 'test-uri' });
    await checker.init();
  });

  afterEach(async () => {
    await checker.close();
  });

  it('should return healthy when service is up', async () => {
    const result = await checker.check();
    assert.strictEqual(result.status, 'healthy');
  });

  it('should return down when service is unavailable', async () => {
    // Mock service to be down
    const result = await checker.check();
    assert.strictEqual(result.status, 'down');
  });
});
```

## Available 3rd Party Checkers

### Database Checkers

- **MongoDB**: [sky-puppy-checker-mongodb](https://github.com/Phara0h/sky-puppy-checker-mongodb)

### Service Checkers

- **Cloudflare Status**: [sky-puppy-checker-cloudflare-status](https://github.com/Phara0h/sky-puppy-checker-cloudflare-status)


## Getting Help

- Check the [checker template](https://github.com/Phara0h/sky-puppy-checker-template) for a complete example
- Join the [Sky Puppy community](https://github.com/Phara0h/sky-puppy/discussions)
- Review existing checkers for patterns and best practices 