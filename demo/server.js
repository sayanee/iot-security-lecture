var path = require('path')
var fs = require('fs')
var express = require('express')
var https = require('https')
var os = require('os')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var appInsecure = express()
var appSecure = express()
var appInsecurePort = 80
var appSecurePort = 443

var Gpio
var led

function isMacBook() {
  return os.arch() === 'x64' ? true : false
}

function isRPi() {
  return os.arch() === 'arm' ? true : false
}

function setLED(value){
  if (isRPi()) {
    return led.writeSync(value)
  }
}

if (isRPi()) {
  Gpio = require('onoff').Gpio
  led = new Gpio(18, 'out')
}

if (isMacBook()) {
  appInsecurePort = 4000
  appSecurePort = 5000
} else if(isRPi()) {
  appInsecurePort = 80
  appSecurePort = 443
}

// insecure app
appInsecure.use(bodyParser.urlencoded({
  extended: true
}))
appInsecure.use(express.static(path.join(__dirname + '/public')))
appInsecure.use(cookieParser())

appInsecure.get('/', function(req, res) {
  res.clearCookie('username')
  res.sendFile(path.join(__dirname + '/index.html'))
}).listen(appInsecurePort, function() {
  if (isMacBook()) {
    console.log(new Date() + ' [HTTP] Page served at http://localhost:' + appInsecurePort)
  } else if (isRPi()) {
    console.log(new Date() + ' [HTTP] Page served at http://lamp.local')
  }
})

appInsecure.post('/action', function(req, res) {
  console.log(new Date() + ' [HTTP] ' + req.body.username + ' logged in')
  res.cookie('username', req.body.username);
  res.sendFile(path.join(__dirname + '/action.html'))
})

appInsecure.get('/action', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    res.redirect('/')
  } else {
   res.sendFile(path.join(__dirname + '/action.html'))
  }
})

appInsecure.get('/on', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    console.log(req.cookies, req.cookies.username)
    res.redirect('/')
  } else {
    console.log(new Date() + ' [HTTP] ' + req.cookies.username + ' turned ON the lamp')
    setLED(1)
    res.redirect('/action')
  }
})

appInsecure.get('/off', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    res.redirect('/')
  } else {
    console.log(new Date() + ' [HTTP] ' + req.cookies.username + ' turned OFF the lamp')
    setLED(0)
    res.redirect('/action')
  }
})

// secure app
appSecure.use(bodyParser.urlencoded({
  extended: true
}))
appSecure.use(express.static(path.join(__dirname + '/public')))
appSecure.use(cookieParser())

https.createServer({
  key: fs.readFileSync(path.join(__dirname + '/key.pem')),
  cert: fs.readFileSync(path.join(__dirname + '/cert.pem'))
}, appSecure).listen(appSecurePort, function() {
  if (isMacBook()) {
    console.log(new Date() + ' [HTTPS] Page served at https://localhost:' + appSecurePort)
  } else if (isRPi()) {
    console.log(new Date() + ' [HTTPS] Page served at https://lamp.local')
  }
})

appSecure.get('/', function(req, res) {
  res.clearCookie('username')
  res.sendFile(path.join(__dirname + '/index.html'))
})

appSecure.post('/action', function(req, res) {
  console.log(new Date() + ' [HTTPS] ' + req.body.username + ' logged in')
  res.cookie('username', req.body.username);
  res.sendFile(path.join(__dirname + '/action.html'))
})

appSecure.get('/action', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    res.redirect('/')
  }else{
    res.sendFile(path.join(__dirname + '/action.html'))
  }
})

appSecure.get('/on', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    res.redirect('/index')
  } else{
    console.log(new Date() + ' [HTTPS] ' + req.cookies.username + ' turned ON the lamp')
    setLED(1);
    res.redirect('/action')
  }
})

appSecure.get('/off', function(req, res) {
  if (!req.cookies || !req.cookies.username){
    res.redirect('/index')
  } else{
    console.log(new Date() + ' [HTTPS] ' + req.cookies.username + ' turned OFF the lamp')
    setLED(0);
    res.redirect('/action')
 }
})
