'use strict';
const path = require('path');
const url = require('url');
const URL = require('url').URL;
var options = {
  disableRequestLogging: false,
  logger: {
     level: 'error'
   },
  https: false,
  ip: '0.0.0.0',
  port: 4270,
  log: true
}
const app = require('fastify')(options);

function response(req, res) {
  var urlParsed = new URL(`${options.https ? 'https' : 'http'}://${options.ip}:${options.port}${req.raw.url}`);
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
      hostname: req.hostname,
    });
  }
  res.code(200).send({
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
    hostname: req.hostname,
  });
}

app.all('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

app.all('/redirect/loop/:count', (req, res) => {
  res.redirect('/redirect/loop/' + (++req.params.count));
});

app.all('/redirect/loop/', (req, res) => {
  res.redirect('/redirect/loop')
});

app.all('/econnreset', (req, res) => {
  req.req.socket.destroy();
});

var error_flipflop = false;
app.all('/error/flipflop', (req, res) => {
  if (!error_flipflop) {
    res.status(500);
    error_flipflop = true;
      res.send();
  } else {
    error_flipflop = false;
    res.status(200);
    res.send();
  }
});

app.all('/error/random', (req, res) => {
  res.status(Math.round(Math.random()) > 0 ? 200 : 500);
  res.send()
});

app.all('/wait/random/:start/:end', async (req, res) => {
  var seconds = getRandomInt(Number(req.params.start),Number(req.params.end))
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds*1000);
  });
  await p;
  res.send();
});


app.put('/alert/test', (request, res) => {

  console.log(`${request.body.embeds[0].title} : ${request.body.embeds[0].description}`)
  res.status(200).send()
});

var econnreset_flipflop = false;
app.all('/econnreset/flipflop', (req, res) => {
  if (!econnreset_flipflop) {
    req.req.socket.destroy();
    econnreset_flipflop = true;
  } else {
    econnreset_flipflop = false;
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
app.listen(options.port, options.ip);
