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
    "version": "1.0.0"
  }
}

```

## Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v1.1.2](https://github.com/Phara0h/sky-puppy/compare/v1.1.1...v1.1.2)

> 2 November 2020

- 
Added `sky-puppy-checker-cloudflare-status` to the list of checkers
[`6e251c0`](https://github.com/Phara0h/sky-puppy/commit/6e251c0f8d2365add9280d6b847331fdeb2f5cb5)
- 
Added sky-puppy-checker-mongodb to list of checkers
[`d204255`](https://github.com/Phara0h/sky-puppy/commit/d204255d1b1f86183778f872b8e879f746e44f04)

#### [v1.1.1](https://github.com/Phara0h/sky-puppy/compare/v1.1.0...v1.1.1)

> 2 November 2020

- 
Fixed changelog to have full commit message
[`4b1a2e4`](https://github.com/Phara0h/sky-puppy/commit/4b1a2e414739b80903d61383e1c34ab8fc3c8f17)

#### [v1.1.0](https://github.com/Phara0h/sky-puppy/compare/v1.0.2...v1.1.0)

> 2 November 2020

- 
New feature: Messages

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
[`7f27201`](https://github.com/Phara0h/sky-puppy/commit/7f2720100f876e2f10ce6e46ea3a0098c0db83fc)

#### [v1.0.2](https://github.com/Phara0h/sky-puppy/compare/v1.0.1...v1.0.2)

> 30 October 2020

- 
Added sky-puppy-checker-template to tests and readme
[`a927cdf`](https://github.com/Phara0h/sky-puppy/commit/a927cdf104bb2f8acf7baa99485ebd2135d2427c)

#### [v1.0.1](https://github.com/Phara0h/sky-puppy/compare/v1.0.0...v1.0.1)

> 30 October 2020

- 
Fixed bug around checkers name
[`7674805`](https://github.com/Phara0h/sky-puppy/commit/7674805fae0b7e39b56dbbeef18ede9216e22956)

### [v1.0.0](https://github.com/Phara0h/sky-puppy/compare/v0.3.0...v1.0.0)

> 30 October 2020

- 
Added module based checkers! Now you can write custom checkers to check any thing.
[`344b6f0`](https://github.com/Phara0h/sky-puppy/commit/344b6f02dfa4b31d0720b7c047d034a7f118684a)

#### [v0.3.0](https://github.com/Phara0h/sky-puppy/compare/v0.2.1...v0.3.0)

> 30 October 2020

- 
Added endpoints, Added postman docs, Fixed bugs and more!
[`5d614eb`](https://github.com/Phara0h/sky-puppy/commit/5d614eb20b62ba5b616f67aeffddda1bfd5575de)
- 
added process tile
[`f6f9a56`](https://github.com/Phara0h/sky-puppy/commit/f6f9a56b35b31797f9409c97df4c3b3dc5ae5a4b)

#### [v0.2.1](https://github.com/Phara0h/sky-puppy/compare/v0.2.0...v0.2.1)

> 14 September 2020

- 
Update README.nbs
[`505209a`](https://github.com/Phara0h/sky-puppy/commit/505209afdac682daca37284a5f69fd98b14b8145)

#### v0.2.0

> 14 September 2020

- 
init commit config based is done REST endpoints to come
[`b03ca2e`](https://github.com/Phara0h/sky-puppy/commit/b03ca2ee43ac5754f020d1963dcb9e201cd47e0d)
- 
Initial commit
[`b7535a3`](https://github.com/Phara0h/sky-puppy/commit/b7535a3a3990fe081f932dc6e1079a86bdf9842f)

