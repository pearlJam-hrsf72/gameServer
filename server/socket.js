var _ = require('lodash')
var velocity = require('./velocity.js')
var interactions = require('./interactions.js')
var dataBase = require('./dataBase.js')
var eloCalc = require('../libraries/elo.js')
var pulse = require('./pulse.js')

var gameId
var heartbeat
var dbPlayers = []
var gameServerUrl
var guests = true;

const PEARLS_ON_WIN = 80
const PEARLS_ON_LOSE = 20

module.exports = function (io) {
  var lastPlayerId = 0
  const defaultLives = 3

  io.on('connection', function (socket) {
    console.log('Connected.')

    socket.on('needUsername', function() {
      socket.emit('yourUsername', 'Guest ' + lastPlayerId++)
    })

    socket.on('addNewPlayer', function () {
      socket.player = socket.player || {}
      socket.player.username = socket.player.id
      socket.player.lives = defaultLives
      interactions.spawn(socket.player)
      socket.emit('allPlayers', getAllPlayers())
      socket.broadcast.emit('newPlayer', socket.player)
    })

    socket.on('heartBeat', function (data) {
      if (socket.player) {
        socket.player.mouse = data
      }
    })

    socket.on('newSpectator', function () {
      socket.emit('allPlayers', getAllPlayers())
      socket.emit('holes', interactions.holeCenters)
    })


    socket.on('joinLobby', function ({ username, serverUrl, colorID }) {
      var sockets = io.sockets.connected;
      for (var socket in sockets) {
        if (sockets[socket].player && sockets[socket].player.id === username) {
          sockets[socket].disconnect()
        }
      }
      gameServerUrl = serverUrl
      socket.player = {id: username, colorID, ready: false, lives: defaultLives}
      io.emit('renderInfo', getAllPlayers())
    })

    socket.on('playerReady', function () {
      // if (socket.player) {
        socket.player.ready = true
        var allPlayers = getAllPlayers()

        if (allReady(allPlayers)) {
          startGame()
          allPlayers.forEach((player) => {
            id = player.id
            if (!(id.slice(0, 5) === 'Guest')) {
              var usersref = dataBase.ref('users/')
              usersref.orderByChild("displayName").equalTo(id).on("child_added", function(data) {
                dbPlayers.push(data.val())
                if (dbPlayers.length === allPlayers.length) {
                  guests = false;
                  var gamesref = dataBase.ref('games/')
                  gameId = gamesref.push({status: "in-progress", winner: "TBD", players: dbPlayers, spectateUrl: gameServerUrl + 'spectate'})
                }
              })
            }
          })
        }
        io.emit('renderInfo', allPlayers)
      // }
    })

    socket.on('disconnect', function () {
      io.emit('renderInfo', getAllPlayers())
      io.emit('notReady')
    })
  })

  function getAllPlayers () {
    var players = []
    // console.log('sockets in server', io.sockets.connected);
    Object.keys(io.sockets.connected).forEach(function (socketID) {
      var player = io.sockets.connected[socketID].player
      if (player && player.lives > 0) {
        players.push(player)
      }
    })

    return players
  }

  function getAllPlayersAliveOrDead () {
    var players = []
    // console.log('sockets in server', io.sockets.connected);
    Object.keys(io.sockets.connected).forEach(function (socketID) {
      var player = io.sockets.connected[socketID].player
      if (player) {
        players.push(player)
      }
    })

    return players
  }

  function startGame () {
    interactions.createHoles()
    console.log('game is starting');
    heartbeat = setInterval(function() {
      var deaths = pulse(getAllPlayers())
      if (deaths === true) {
        handleGameover()
      } else if (deaths.length) {
        deaths.forEach( (player) => {
          io.emit('death', player)
        })
      }
      io.emit('pulse', getAllPlayers())
    }, 16)
    io.emit('holes', interactions.holeCenters)
  }

  // returns whether the game is over
  // This is true when there is only one player left with more than 1 lives

  // function pulse() {
  //   var players = getAllPlayers();  // only returns alive players

  //   if (gameOver(players)) { //if the game is over

  //     io.emit('gameOver', getAllPlayersAliveOrDead());
  //     clearInterval(heartbeat);
  //     updatePlayerStatsInDatabase();
  //     dbPlayers = [];
  //     interactions.holeCenters = [];
  //   } // end gameOver


  //   players.forEach( (player) => {
  //     var checkCollision = interactions.checkPlayerCollision(player, players);
  //     if (checkCollision) {
  //       interactions.collision(player, checkCollision);
  //     }
  //     interactions.checkWallCollision(player);
  //     velocity.updatePosition(player, player.mouse);
  //     var dead = interactions.checkHoleDeath(player);
  //     if (dead) {
  //       io.emit('death', player);
  //     }
  //   });
  //   io.emit('pulse', players);
  // }
  //returns whether the game is over
  //This is true when there is only one player left with more than 1 lives
  var handleGameover = function() {
    io.emit('gameOver', getAllPlayersAliveOrDead())
    clearInterval(heartbeat)
    if (!guests) {
      updatePlayerStatsInDatabase()
      updateGameStats()
      resolveBets()
    }
    guests = true;
    dbPlayers = []
    interactions.holeCenters = []
    var sockets = io.sockets.sockets
    for (var socket in sockets) {
      sockets[socket].disconnect(true)
    }
  }

  function gameOver(players) {
    var numPlayersAlive = _.reduce(players, (acc, player) => {
      return player.lives > 0 ? acc + 1 : acc
    }, 0)

    if (numPlayersAlive > 1) { // more than one playera alive
      return false
    } else {
      return true
    }
  }

  function allReady (players) {
    var ready = true
    players.forEach((player) => {
      if (!player.ready) {
        ready = false
      }
    })
    return ready && players.length > 1
  }

  function resolveBets () {
    // Grab all bets
    var gameRef = dataBase.ref('games/' + gameId.key)

    // For each bet, get the playerRef and update the players pearls based on
    // if they guessed the winner correctly or not
    gameRef.once('value', function (snapshot) {
      const game = snapshot.val()

      const bets = game.bets
      for (var key in bets) {
        var bet = bets[key]
        if (bet.predictedWinner === game.winner) {
          // Grab the user ref and update the user's pearls
          var usersRef = dataBase.ref(`users/`)
          var query = usersRef.orderByChild('displayName').equalTo(bet.bettorID)
          query.once('value', function (snapshot) {
            var users = snapshot.val()
            var userKey = Object.keys(users)[0]
            var user = users[userKey]
            var userRef = dataBase.ref(`users/` + userKey)

            // User will get 2x their bet value for now
            userRef.update({pearls: user.pearls + 2 * bet.betValue})
          })
        }
      }
    })
  }

  // Update game status and winner on game end
  function updateGameStats () {
    var gamesRef = dataBase.ref(`games/` + gameId.key)
    var winner = getAllPlayers()
    gamesRef.update({winner: winner[0].id, status: 'finished'})
  }

  // Update player stats on game end
  function updatePlayerStatsInDatabase () {
    var allPlayers = getAllPlayersAliveOrDead()

    // If it's a 1v1, we update the ratings of each player, else don't update ratings
    var updateRatings = allPlayers.length === 2
    var winner = getAllPlayers()[0]  // winner is the only one alive
    if (updateRatings) {
      var winnerData = {}
      for (var i = 0; i < dbPlayers.length; i++) {
        if (dbPlayers[i].displayName === winner.id) {
          winnerData = dbPlayers[i]
        }
      }

      var loserData = {}
      for (var i = 0; i < dbPlayers.length; i++) {
        if (dbPlayers[i].displayName !== winner.id) {
          loserData = dbPlayers[i]
        }
      }

      var winnerNewRating = eloCalc.getRatingIfWin(winnerData.rating, loserData.rating)
      var loserNewRating = eloCalc.getRatingIfLose(loserData.rating, winnerData.rating)
    }

    var gamesRef = dataBase.ref(`games/` + gameId.key)
    var usersRef = dataBase.ref(`users/`)

    // Update winner's wins, pearls, rating
    var query = usersRef.orderByChild('displayName').equalTo(winner.id)
    query.once('value', function (snapshot) {
      var users = snapshot.val()
      var userKeys = Object.keys(users)
      var winnerKey = userKeys[0]
      var winner = users[winnerKey]

      var winnerRef = dataBase.ref(`users/` + winnerKey)
      if (updateRatings) {
        winnerRef.update({wins: winner.wins + 1, pearls: winner.pearls + PEARLS_ON_WIN, rating: winnerNewRating})
      } else {
        winnerRef.update({wins: winner.wins + 1, pearls: winner.pearls + PEARLS_ON_WIN})
      }
    })

    // Update all losers' losses, pearls, rating
    var allPlayers = getAllPlayersAliveOrDead()
    for (var i = 0; i < allPlayers.length; i++) {
      // Update all losers in database
      if (allPlayers[i].id !== winner.id) {
        var id = allPlayers[i].id

        var query = usersRef.orderByChild('displayName').equalTo(id)
        query.once('value', function (snapshot) {
          var users = snapshot.val()
          var userKeys = Object.keys(users)
          var userKey = userKeys[0]
          var user = users[userKey]

          var loserRef = dataBase.ref(`users/` + userKey)

          if (updateRatings) {
            loserRef.update({losses: user.losses + 1, pearls: user.pearls + PEARLS_ON_LOSE, rating: loserNewRating})
          } else {
            loserRef.update({losses: user.losses + 1, pearls: user.pearls + PEARLS_ON_LOSE})
          }
        })
      }
    }
  }

  // var doesUserExist = function(username) {
  //   var exists = false
  //   var players = getAllPlayers()
  //   players.forEach( player => {
  //     if (player.id === username) {
  //       exists = true
  //     }
  //   })
  //   return exists
  // }
}
