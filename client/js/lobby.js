var lobbyState = {
  players: {},
  playerNameHeight: 30,

  preload: function() {
  },

  create: function() {
    setLobbyEventHandlers();
    // lobbyState.players = {};

    Client.joinLobby();

    var welcomeLabel = game.add.text(game.world.width /2, 30, 
    "Welcome to Game Server 1", 
      {font: '35px Arial', fill: '#000000' });
    welcomeLabel.anchor.set(0.5);

    var startLabel = game.add.text(game.world.width/2, game.world.height - 20,
      "press the 'R' key when you're ready", 
      {font: '35px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5);
      
    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    rkey.onDown.addOnce(this.ready, this);

  },

  ready: function() {
    // var playerNotReady = Client.playerReadyGroup.children.pop();

    // //add a playerReady button to playerNotReady.y
    // playerReady = game.add.button(120, playerNotReady.y - 20, 'playerReady');
    // Client.playerReadyGroup.add(playerReady);
    Client.ready();
  },

  onPlayerJoin: function(username) {
    var textStyle = {
      font: 'bold 30pt italic'
    }

    var playerReadyGroup = game.add.group();
    var playerName = game.add.text(80, lobbyState.playerNameHeight, username, textStyle);
    var playerNotReady = game.add.sprite(120, lobbyState.playerNameHeight, 'playerNotReady');
    playerNotReady.scale.set(0.5);
    playerNotReady.animations.add('toggle', [0, 1, 2, 3], 12, true);
    playerNotReady.play('toggle');

    
    playerReadyGroup.add(playerName);
    playerReadyGroup.add(playerNotReady);


    Client.playerReadyGroup = playerReadyGroup;
    console.log('playerReadyGroup', playerReadyGroup);


    lobbyState.playerNameHeight += 150;
    
    

    var playerObj = {ready: false, playerReadyGroup: playerReadyGroup};
    lobbyState.players[username] = playerObj;

  },

  playerReady: function(username) {
    console.log('lobbyState')
    lobbyState.players[username].ready = true;
    var allReady = true;
  
    for (player in lobbyState.players) {
      if (player) {
        console.log(`player ${player} ready: `, lobbyState.players[player].ready);
        if (!lobbyState.players[player].ready) {
          allReady = false;
        }
      }
    }
    if (allReady) {
      removeAllSocketListeners();
      lobbyState.players = {};
      game.state.start('Game');
    }
    console.log('allReady: ', allReady);
  },

  update() {
    // console.log('running update for players', lobbyState.players);
    for (playerIndex in lobbyState.players) {
      if (playerIndex) {
        const player = lobbyState.players[playerIndex]
        const playerReadyGroup = player.playerReadyGroup
        if (player.ready && playerReadyGroup.children[1].key === 'playerNotReady') { //update the playerReady group
          console.log('setting into playerReady');
          var playerNotReady = playerReadyGroup.children[1];
          //add a playerReady button to playerNotReady.y
          playerReady = game.add.button(120, playerNotReady.y - 20, 'playerReady');
          playerReadyGroup.children[1] = playerReady;
        }
      }
    }
  }
};