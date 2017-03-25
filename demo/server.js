var path = require('path')
var fs = require('fs')
var express = require('express')
var https = require('https')

var appInsecure = express()
var appSecure = express()

appInsecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/insecure.html'))
}).listen(80, function() {
  console.log('HTTP page served at http://localhost or http://lamp.local')
})

https.createServer({
  key: fs.readFileSync(path.join(__dirname + '/key.pem')),
  cert: fs.readFileSync(path.join(__dirname + '/cert.pem'))
}, appSecure).listen(443, function() {
  console.log('HTTPS page served at https://localhost or https://lamp.local')
})

appSecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/secure.html'))
})
