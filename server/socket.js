var  _ = require('lodash');
var velocity = require('./velocity.js');
var interactions = require('./interactions.js');
var dataBase = require('./dataBase.js');
var eloCalc = require('../libraries/eloCalc.js');

var gameId;
var heartbeat;
var dbPlayers = [];

const PEARLS_ON_WIN = 80;
const PEARLS_ON_LOSE = 20;

module.exports = function(io) {
  
  var lastPlayerId = 0;
  const defaultLives = 3;

  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('addNewPlayer', function() {
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

    socket.on('newSpectator', function() {
      socket.emit('allPlayers', getAllPlayers());
    });
    
    socket.on('joinLobby', function(username) {
      socket.player = {id: username || lastPlayerId++, ready: false, lives: defaultLives};
      io.emit('renderInfo', getAllPlayers());
    });

    socket.on('playerReady', function() {
  
      socket.player.ready = true;
      var allPlayers = getAllPlayers();
    
      if (allReady(allPlayers)) {
        console.log('game is starting');
        // TODO: Save all players data
        allPlayers.forEach((player) => {
          id = player.id;
          var usersref = dataBase.ref('users/');
          usersref.orderByChild("displayName").equalTo(id).on("child_added", function(data) {
            dbPlayers.push(data.val());
            if (dbPlayers.length === allPlayers.length) {
              var gamesref = dataBase.ref('games/');
              gameId = gamesref.push({status: "in-progress", winner: "TBD", players: dbPlayers});
              heartbeat = setInterval(pulse, 10);
            }
          })
        })
      }
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
    var players = getAllPlayers();  // only returns alive players

    if (gameOver(players)) { //if the game is over
      // If only 2 players in the game, update rating
      console.log('>>> dbPlayers: ', dbPlayers);
      var allPlayers = getAllPlayersAliveOrDead();
      var updateRatings = allPlayers.length === 2;
      if (updateRatings) {
        var winnerRef;
        var loserRef;
        var winnerRating;
        var loserRating;
      }       

      // Update winner for this game 
      var gamesRef = dataBase.ref(`games/` + gameId.key);
      var winner = getAllPlayers()[0];
      gamesRef.update({winner: winner.id, status: "finished"});

      io.emit('gameOver', getAllPlayersAliveOrDead());
      clearInterval(heartbeat);

      // Update all players stats: wins, losses, pearls
      var usersRef = dataBase.ref(`users/`);

      var query = usersRef.orderByChild("displayName").equalTo(winner.id);

      var dbPromises = [];

      // Update winner's wins, pearls, rating

      query.once("value", function(snapshot) {
        var users = snapshot.val();
        var userKeys = Object.keys(users);
        var winnerKey = userKeys[0];
        var winner = users[winnerKey];

        // TODO: get loser.rating
        var newRating = eloCalc.getRatingIfWin(winner.rating, loser.rating);
        winnerRef = dataBase.ref(`users/` + winnerKey);
        winnerRef.update({wins: winner.wins + 1, pearls: winner.pearls + PEARLS_ON_WIN, rating: newRating});
      });


      // Update all losers' losses, pearls, rating
      var allPlayers = getAllPlayersAliveOrDead();
      for (var i = 0; i < allPlayers.length; i++) {
        // Update all losers in database
        if (allPlayers[i].id !== winner.id) {
          var id = allPlayers[i].id;
          
          var query = usersRef.orderByChild("displayName").equalTo(id);

          // snapshot returns an object of keys
          query.once("value", function(snapshot) {
            var users = snapshot.val();
            var userKeys = Object.keys(users);
            var userKey = userKeys[0];
            var user = users[userKey];

            loserRef = dataBase.ref(`users/` + userKey);

            loserRating = user.rating

            loserRef.update({losses: user.losses + 1, pearls: user.pearls + PEARLS_ON_LOSE});
          });
        }
      }
      if (updateRatings) {

      }
    } // end gameOver


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


  function allReady(players) {
    var ready = true;
    players.forEach((player) => {
      if (!player.ready) {
        ready = false;
      }
    });
    return ready;
  }

};