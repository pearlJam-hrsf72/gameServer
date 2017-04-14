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
    
    // socket.on('joinLobby', function(username) {
    //   // TODO: Grab username from client
    //   // emit default username for now
    //   socket.emit('allPlayersInLobby', getAllPlayers());
    //   socket.player = {id: lastPlayerId++};
    //   io.emit('playerJoined', socket.player.id);
    // });

    // socket.on('playerReady', function() {
    //   io.emit('playerReady', socket.player.id);
    // });

    socket.on('disconnect', function() {
      if (socket.player) {
        io.emit('remove', socket.player.id);
      }
    });
  });

  function getAllPlayers() {
    var players = [];
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
