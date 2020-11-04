'use strict';
// const path = require('path');
// const url = require('url');
const URL = require('url').URL;
var options = {
  disableRequestLogging: false,
  // logger: {
  //   level: 'error'
  // },
  https: false,
  ip: '0.0.0.0',
  port: 4270,
  log: false
};
const app = require('fastify')(options);

// function response(req, res) {
//   var urlParsed = new URL(
//     `${options.https ? 'https' : 'http'}://${options.ip}:${options.port}${
//       req.raw.url
//     }`
//   );
//
//   if (options.log) {
//     console.log({
//       body: req.body,
//       query: req.query,
//       params: req.params,
//       url: req.req.url,
//       method: req.raw.method,
//       headers: req.headers,
//       // raw: req.raw,
//       id: req.id,
//       ip: req.ip,
//       ips: req.ips,
//       hostname: req.hostname
//     });
//   }
//   res.code(200).send({
//     body: req.body,
//     query: req.query,
//     params: req.params,
//     url: req.req.url,
//     method: req.raw.method,
//     headers: req.headers,
//     // raw: req.raw,
//     id: req.id,
//     ip: req.ip,
//     ips: req.ips,
//     hostname: req.hostname
//   });
// }
function log(req, res) {
  if (options.log) {
    console.log({
      body: req.body,
      query: req.query,
      params: req.params,
      url: req.req.url,
      method: req.raw.method,
      headers: req.headers,
      // raw: req.raw,
      id: req.id,
      ip: req.ip,
      ips: req.ips,
      hostname: req.hostname
    });
  }
}
app.all('/redirect', (req, res) => {
  log(req, res);
  res.redirect(req.query.url);
});

app.all('/redirect/loop/:count', (req, res) => {
  log(req, res);
  res.redirect('/redirect/loop/' + ++req.params.count);
});

app.all('/redirect/loop/', (req, res) => {
  log(req, res);
  res.redirect('/redirect/loop');
});

app.all('/econnreset', (req, res) => {
  log(req, res);
  req.req.socket.destroy();
});

var errorFlipflop = false;

app.all('/error/flipflop', (req, res) => {
  log(req, res);
  if (!errorFlipflop) {
    res.status(500);
    errorFlipflop = true;
    res.send();
  } else {
    errorFlipflop = false;
    res.status(200);
    res.send();
  }
});

var errorInCount = 0;

app.all('/error/in/:num', (req, res) => {
  log(req, res);
  if (++errorInCount >= req.params.num) {
    res.status(500).send();
    errorInCount = 0;
    return;
  }

  res.status(200).send();
});

var successInCount = 0;

app.all('/success/in/:num', (req, res) => {
  log(req, res);
  if (++successInCount >= req.params.num) {
    res.status(200).send();
    successInCount = 0;
    return;
  }

  res.status(500).send();
});

app.all('/error/random', (req, res) => {
  log(req, res);
  res.status(Math.round(Math.random()) > 0 ? 200 : 500);
  res.send();
});

app.all('/wait/random/:start/:end', async (req, res) => {
  log(req, res);
  var seconds = getRandomInt(Number(req.params.start), Number(req.params.end));
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });

  await p;
  res.send();
});

var econnresetFlipflop = false;

app.all('/econnreset/flipflop', (req, res) => {
  log(req, res);
  if (!econnresetFlipflop) {
    req.req.socket.destroy();
    econnresetFlipflop = true;
  } else {
    econnresetFlipflop = false;
    res.send();
  }
});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// app.all('/exit', (req, res) => {
//     process.exit(1);
// });
// app.all(['/'], response);
// app.all(['/:param1'], response);
// app.all(['/:param1/:param2'], response);
// app.all(['/:param1/:param2/:param3'], response);
// app.all(['/:param1/:param2/:param3/:param4'], response);

app.all('/alert/test', (request, res) => {
  console.log(
    `${request.body.embeds[0].title} : ${request.body.embeds[0].description}`
  );
  res.status(200).send();
});

app.listen(options.port, options.ip);
