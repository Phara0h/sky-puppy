# Fasquest
A fast node request model, works very similar to `request` module but way faster and no dependencies + it works in the browser!

### Install
```
npm install fasquest
```

### Basic Node Example
```js
const Fasquest = require('fasquest');

var options = {
  uri: 'http://127.0.0.1/',
  resolveWithFullResponse: true
}

Fasquest.request(options).then(res=>{
  console.log('hey look I got a response')
})


```

### Basic Web Example
```js
import Fasquest from "fasquest";
var options = {
  uri: 'http://127.0.0.1/',
  resolveWithFullResponse: true
}

await Fasquest.request(options);


```


## Changelog

### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### 0.2.0

> 15 September 2020

