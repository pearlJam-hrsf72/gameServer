var Client = {};

Client.socketConnect = function() {
  Client.socket = io.connect();
}

var setGameEventHandlers = function() {
  Client.socket.on('newPlayer', function(player) {
    Game.addNewPlayer(player);
  });

  Client.socket.on('allPlayers', function(players) {
    players.forEach((player) => {
      Game.addNewPlayer(player);
    });
  });

  Client.socket.on('pulse', function(players) {
    Game.height = 0;
  	players.forEach( (player) => {
  		Game.updatePlayerPosition(player);
  	})
  })

  Client.socket.on('death', function(player) {
  	Game.death(player);
  })

  Client.socket.on('remove', function(playerId) {
    Game.remove(playerId);
  });

  Client.socket.on('gameOver', function(players) {
    Game.over(players);
  });

};

var setSpectateEventHandlers = function() {
  Client.socket.on('allPlayers', function(players) {
    players.forEach((player) => {
      spectateState.addNewPlayer(player);
    })
  })

  Client.socket.on('pulse', function(players) {
    players.forEach((player) => {
      spectateState.updatePlayerPosition(player);
    })
  })

  Client.socket.on('death', function(player) {
    spectateState.death(player);
  })

  Client.socket.on('remove', function(playerId) {
    spectateState.remove(playerId);
  })

  Client.socket.on('gameOver', function(players) {
    Game.over(players);
  })

}

var removeAllSocketListenersSpectate = function() {
  Client.socket.removeAllListeners('allPlayers');
  Client.socket.removeAllListeners('pulse');
  Client.socket.removeAllListeners('death');
  Client.socket.removeAllListeners('remove');
  Client.socket.removeAllListeners('gameOver');
}

var setLobbyEventHandlers = function() {

  Client.socket.on('playerReady', function(username) {
    console.log('recieved player ready from server');
    lobbyState.playerReady(username);
  });

  /* Add other code */
  Client.socket.on('renderInfo', function(allPlayers) {
    lobbyState.renderServerInfo(allPlayers);
  })
};

var removeAllSocketListeners = function() {
  Client.socket.removeAllListeners('playerJoined');
  Client.socket.removeAllListeners('playerReady');
  Client.socket.removeAllListeners('allPlayersInLobby');
  Client.socket.removeAllListeners('newPlayer');
  Client.socket.removeAllListeners('allPlayers');
  Client.socket.removeAllListeners('remove');
  Client.socket.removeAllListeners('updatePlayer');
};

var removeAllSocketListenersGame = function() {
  Client.socket.removeAllListeners('newPlayer');
  Client.socket.removeAllListeners('allPlayers');
  Client.socket.removeAllListeners('pulse');
  Client.socket.removeAllListeners('death');
  Client.socket.removeAllListeners('remove');
  Client.socket.removeAllListeners('gameOver');
}


Client.disconnect = function() {
  Client.socket.disconnect();
}

Client.askNewPlayer = function() {
  Client.socket.emit('addNewPlayer');
};

Client.heartBeat = function(coordinates) {
  Client.socket.emit('heartBeat', coordinates);
};

Client.joinLobby = function() {
  var messageObj = {username: window.username, serverUrl: window.serverUrl};
  Client.socket.emit('joinLobby', messageObj);
  //Maybe do Clietn.socket.emit('joinLobby', username);
};

Client.ready = function() {
  console.log('player pressed r');
  Client.socket.emit('playerReady');
};

Client.askNewSpectator = function() {
  Client.socket.emit('newSpectator');
};
