var path = require('path')
var fs = require('fs')
var express = require('express')
var https = require('https')
var os = require('os')

var appInsecure = express()
var appSecure = express()
var appInsecurePort = 80
var appSecurePort = 443

function isMacBook() {
  return os.arch() === 'x64' ? true : false
}

function isRPi() {
  return os.arch() === 'arm' ? true : false
}

if (isMacBook()) {
  appInsecurePort = 4000
  appSecurePort = 5000
} else if(isRPi()) {
  appInsecurePort = 80
  appSecurePort = 443
}

appInsecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
}).listen(appInsecurePort, function() {
  if (isMacBook()) {
    console.log('HTTP page served at http://localhost:' + appInsecurePort)
  } else if (isRPi()) {
    console.log('HTTP page served at http://lamp.local')
  }
})

https.createServer({
  key: fs.readFileSync(path.join(__dirname + '/key.pem')),
  cert: fs.readFileSync(path.join(__dirname + '/cert.pem'))
}, appSecure).listen(appSecurePort, function() {
  if (isMacBook()) {
    console.log('HTTPS page served at https://localhost:' + appSecurePort)
  } else if (isRPi()) {
    console.log('HTTP page served at https://lamp.local')
  }
})

appSecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

appSecure.post('/action', function(req, res) {
  res.sendFile(path.join(__dirname + '/action.html'))
})
