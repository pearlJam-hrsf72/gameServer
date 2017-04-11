module.exports = function(io) {

  var lastPlayerId = 0;

  io.on('connection', function(socket) {
    console.log('connected');
    socket.on('addNewPlayer', function() {
      socket.player = {
        id: lastPlayerId++,
        x: Math.random() * 200,
        y: Math.random() * 200
      };
      socket.emit('allPlayers', getAllPlayers());
      socket.broadcast.emit('newPlayer', socket.player);

      socket.on('heartBeat', function(data) {
        socket.player.x = data.x;
        socket.player.y = data.y;
        socket.emit('updatePlayer', socket.player);
        socket.broadcast.emit('updatePlayer', socket.player);
      });
    });
    
    socket.on('joinLobby', function(username) {
      // TODO: Grab username from client
      // emit default username for now
      socket.username = 'Eddie';
      io.emit('playerJoined', socket.username);
    });

    socket.on('playerReady', function() {
      io.emit('playerReady', socket.username);
    });

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
      if (player) {
        players.push(player);
      }
    });
    return players;
  }

};
