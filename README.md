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

## Checkers

##### Test
- [sky-puppy-checker-template](https://github.com/Phara0h/sky-puppy-checker-template) : A Sky Puppy template to use to create your own checkers

##### Databases
- [sky-puppy-checker-mongodb](https://github.com/Phara0h/sky-puppy-checker-mongodb) : A Sky Puppy checker for mongodb

##### HTTP/HTTPS
- request (native)

##### Services
- [sky-puppy-checker-cloudflare-status](https://github.com/Phara0h/sky-puppy-checker-cloudflare-status) : A Sky Puppy checker for checking cloudflarestatus.com api


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
    "version": "1.0.0",
    "log": {
        "enable": true,
        "colors": true,
        "level": "info"
    }
  }
}

```

## Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

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

