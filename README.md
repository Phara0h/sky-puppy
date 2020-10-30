# Sky Puppy
A easy to use reliable endpoint coordinator / health checking service with Prometheus export

[Sky Puppy Postman Collection](https://documenter.getpostman.com/view/208035/TVYKawgU)

## Install

```bash
npm install -g sky-puppy
```

## Run

```bash
sky-puppy
```

## Sample Config

Sky Puppy looks for a file called `sky-puppy-config.json` in the folder it is ran at.

```json
{
  "alerters": {
    "discord_down": {
      "uri": "http://discord.com",
      "json": true,
      "method": "PUT",
      "body": {
        "embeds": [
          {
            "title": "undefined is undefined!",
            "description": "This service was healthy for undefined seconds!",
            "color": 14828098,
            "footer": {
              "text": ""
            },
            "timestamp": "undefined"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    },
    "discord_unhealthy": {
      "uri": "http://discord.com",
      "json": true,
      "method": "PUT",
      "body": {
        "embeds": [
          {
            "title": "undefined is undefined!",
            "description": "This service was healthy for undefined seconds!",
            "color": 14852674,
            "footer": {
              "text": ""
            },
            "timestamp": "undefined"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/J5vIVSt.png"
      }
    },
    "discord_healthy": {
      "uri": "http://discord.com",
      "json": true,
      "method": "PUT",
      "body": {
        "embeds": [
          {
            "title": "undefined is undefined!",
            "description": "Carry on, looks like things are back! We were down for undefined seconds.",
            "color": 6480450,
            "footer": {
              "text": ""
            },
            "timestamp": "undefined"
          }
        ],
        "username": "Sky Puppy",
        "avatar_url": "https://i.imgur.com/3rfFeOu.png"
      }
    }
  },
  "services": {
    "your_service": {
      "interval": 3,
      "start_delay": 2,
      "checker": {
          "name": "request",
          "settings": {
            "uri": "http://127.0.0.1/a/cool/endpoint",
            "timeout": 2,
            "json": true,
            "method": "PUT",
            "body": {
              "test": "sweet"
            },
          }
      },
      "alerts": [
        {
          "type": "down",
          "alerter": "discord_down"
        },
        {
          "type": "unhealthy",
          "alerter": "discord_unhealthy"
        },
        {
          "type": "healthy",
          "alerter": "discord_healthy"
        }
      ]
    }
  },
  "skypuppy": {
    "version": "1.0.0"
  }
}

```

## Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v1.0.1](https://github.com/Phara0h/sky-puppy/compare/v1.0.0...v1.0.1)

> 30 October 2020

- Fixed bug around checkers name [`7674805`](https://github.com/Phara0h/sky-puppy/commit/7674805fae0b7e39b56dbbeef18ede9216e22956)

### [v1.0.0](https://github.com/Phara0h/sky-puppy/compare/v0.3.0...v1.0.0)

> 30 October 2020

- Added module based checkers! Now you can write custom checkers to check any thing. [`344b6f0`](https://github.com/Phara0h/sky-puppy/commit/344b6f02dfa4b31d0720b7c047d034a7f118684a)

#### [v0.3.0](https://github.com/Phara0h/sky-puppy/compare/v0.2.1...v0.3.0)

> 30 October 2020

- Added endpoints, Added postman docs, Fixed bugs and more! [`5d614eb`](https://github.com/Phara0h/sky-puppy/commit/5d614eb20b62ba5b616f67aeffddda1bfd5575de)
- added process tile [`f6f9a56`](https://github.com/Phara0h/sky-puppy/commit/f6f9a56b35b31797f9409c97df4c3b3dc5ae5a4b)

#### [v0.2.1](https://github.com/Phara0h/sky-puppy/compare/v0.2.0...v0.2.1)

> 14 September 2020

- Update README.nbs [`505209a`](https://github.com/Phara0h/sky-puppy/commit/505209afdac682daca37284a5f69fd98b14b8145)

#### v0.2.0

> 14 September 2020

- init commit config based is done REST endpoints to come [`b03ca2e`](https://github.com/Phara0h/sky-puppy/commit/b03ca2ee43ac5754f020d1963dcb9e201cd47e0d)
- Initial commit [`b7535a3`](https://github.com/Phara0h/sky-puppy/commit/b7535a3a3990fe081f932dc6e1079a86bdf9842f)

