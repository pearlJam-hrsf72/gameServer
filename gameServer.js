var express = require('express');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var velocity = require('./server/velocity.js');
var interactions = require('./server/interactions.js');
var dataBase = require('./server/dataBase.js')


var socketManager = require('./server/socket.js')(io);

const defaultCorsHeaders = {
  origin: '*',
  methods: 'GET, POST, PUT, OPTIONS',
  headers: 'content-type, accept',
  age: 10 // Seconds.
};


app.use('/sockets', express.static(__dirname + '/client/sockets'));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/assets', express.static(path.join(__dirname + '/client/assets')));
app.use('/css', express.static(path.join(__dirname + '/client/css')));

app.use(function(req, res, next) {
	if (req.method === 'OPTIONS') {
		console.log(req.headers);
		//need to write the header to be the defaultcorsheader so that the options request will accept the preflight response
		res.header('access-control-allow-origin', defaultCorsHeaders.origin);
		res.header('access-control-allow-methods', defaultCorsHeaders.methods);
		res.header('access-control-allow-header', 'text/javascript');
		res.header('access-control-max-age', defaultCorsHeaders.age);
		console.log(res.headers);
		res.sendStatus(200);
	} else {	
		next();
	}
})

app.get('/', function(req, res) {
  // res.sendFile(__dirname + '/client/index.html');
  // res.header('Access-Control-Allow-Origin', '*');
  console.log('recieved a get request');
  res.send('this is from Jeff');
});

app.get('/spectate', function(req, res) {
	res.sendFile(__dirname + '/client/spectate.html');
});


server.listen(process.env.PORT || 3005, function() {
  console.log(`gameServer is listening on PORT ${process.env.port || 3005}`);
});