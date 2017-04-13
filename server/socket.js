var velocity = require('./velocity.js');
var interactions = require('./interactions.js');

module.exports = function(io) {
  
  var lastPlayerId = 0;

  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('addNewPlayer', function() {
      socket.player = socket.player || {};
      socket.player.id = lastPlayerId ++;
      socket.player.lives = 3;
      socket.player.username = socket.player.id; //temporary username, till we implement real usernames
      interactions.spawn(socket.player);
      socket.emit('allPlayers', getAllPlayers());
      socket.broadcast.emit('newPlayer', socket.player);
    });

    socket.on('heartBeat', function(data) {
      if (socket.player) {
        socket.player.mouse = data;
      }
    });

    // socket.on('newSpectator', function() {
    //   socket.emit('allPlayers', getAllPlayers());
    // });
    
    socket.on('joinLobby', function(username) {
      socket.player = {id: lastPlayerId++, ready: false};
      io.emit('renderInfo', getAllPlayers());
    });

    socket.on('playerReady', function() {
  
      socket.player.ready = true;
      var allPlayers = getAllPlayers();
      io.emit('renderInfo', allPlayers);
      // io.emit('playerReady', socket.player.id);
    });

    socket.on('disconnect', function() {
      io.emit('renderInfo', getAllPlayers());
    });
  });

  function getAllPlayers() {
    var players = [];
    // console.log('sockets in server', io.sockets.connected);
    Object.keys(io.sockets.connected).forEach(function(socketID) {
      var player = io.sockets.connected[socketID].player;
      if (player && player.lives > 0) {
        players.push(player);
      }
    });
    
    return players;
  }

  function pulse() {
    var players = getAllPlayers();
    players.forEach( (player) => {
      var checkCollision = interactions.checkPlayerCollision(player, players);
      if (checkCollision) {
        interactions.collision(player, checkCollision);
      }
      interactions.checkWallCollision(player);
      velocity.updatePosition(player, player.mouse);
      var dead = interactions.checkHoleDeath(player);
      if (dead) {
        io.emit('death', player);
      }
    });
    io.emit('pulse', players);
  }

  setInterval(pulse, 10);

};
