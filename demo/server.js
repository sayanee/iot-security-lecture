var path = require('path')
var fs = require('fs')
var express = require('express')
var https = require('https')

var appInsecure = express()
var appSecure = express()

appInsecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/insecure.html'))
}).listen(4000, function() {
  console.log('HTTP page served at localhost:4000')
})

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, appSecure).listen(5000, function() {
  console.log('HTTPS page served at localhost:5000')
})

appSecure.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/secure.html'))
})
