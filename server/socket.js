var  _ = require('lodash');

var velocity = require('./velocity.js');
var interactions = require('./interactions.js');

module.exports = function(io) {
  
  var lastPlayerId = 0;
  const defaultLives = 3;

  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('addNewPlayer', function() {
      console.log('added new player');
      socket.player = socket.player || {};
      socket.player.username = socket.player.id
      socket.player.lives = defaultLives;
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
      console.log('username joined lobby', username);
      socket.player = {id: username || lastPlayerId++, ready: false, lives: defaultLives};
      console.log('all players', getAllPlayers());
      io.emit('renderInfo', getAllPlayers());
    });

    socket.on('playerReady', function() {
  
      socket.player.ready = true;
      var allPlayers = getAllPlayers();
      io.emit('renderInfo', allPlayers);

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

  function getAllPlayersAliveOrDead() {
     var players = [];
    // console.log('sockets in server', io.sockets.connected);
    Object.keys(io.sockets.connected).forEach(function(socketID) {
      var player = io.sockets.connected[socketID].player;
      if (player) {
        players.push(player);
      }
    });
    
    return players; 
  }


  function pulse() {
    var players = getAllPlayers();
    // console.log('players', players);
    if (gameOver(players)) { //if the game is ovve
      io.emit('gameOver', getAllPlayersAliveOrDead());
    } 


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
  //returns whether the game is over
  //This is true when there is only one player left with more than 1 lives
  function gameOver(players) {
    var numPlayersAlive = _.reduce(players, (acc, player) => {
      return player.lives > 0 ? acc + 1 : acc;
    }, 0)

    if (numPlayersAlive > 1) { //more than one playera alive
      return false;
    } else {
      return true;
    }
  }

  setInterval(pulse, 10);

};
