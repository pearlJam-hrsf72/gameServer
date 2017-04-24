var express = require('express');
var path = require('path');
// var cors = require('express-cors');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var velocity = require('./server/velocity.js');
var interactions = require('./server/interactions.js');
var dataBase = require('./server/dataBase.js')


var socketManager = require('./server/socket.js')(io);

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
})

app.options('*', function(req, res, next){
    res.end();
});

app.use('/sockets', express.static(__dirname + '/client/sockets'));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/assets', express.static(path.join(__dirname + '/client/assets')));
app.use('/css', express.static(path.join(__dirname + '/client/css')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/spectate', function(req, res) {
	res.sendFile(__dirname + '/client/spectate.html');
});

// app.get('/client/assets/*', function(req, res) {
//   res.sendFile(__dirname + req.url);
// })

// app.get('/client/socket.io/socket.io.js', function(req, res) {
//   res.sendFile(__dirname + req.url);
// })



server.listen(process.env.PORT || 3005, function() {
  console.log(`gameServer is listening on PORT ${process.env.port || 3005}`);
});