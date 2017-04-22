'use strict';

var Game = {};
Game.Players = {};
Game.boundaries = [];
Game.holes = [];
Game.text = {};
Game.height = 0;

Game.init = function () {
  game.state.disableVisibilityChange = false;
  setGameEventHandlers();
};

Game.create = function () {
  Game.add.sprite(0, 0, 'background');
  Game.add.sprite(0, 1152, 'background');
  game.world.setBounds(0, 0, 1900, 1900);
  Client.askNewPlayer();
  Game.cursor = { x: 450, y: 300 };
  Game.Player = game.add.group();
  Game.bound = game.add.group();

  Game.heartBeat();
  Game.pulse = setInterval(Game.heartBeat, 10);
};

Game.update = function () {
  if (!Game.holes.length) {
    if (Game.rawHoles) {
      Game.renderHoles(Game.rawHoles);
    }
  }
  Game.cursor = { x: game.input.activePointer.worldX, y: game.input.activePointer.worldY };
  if (game.input.activePointer.isDown) {
    Game.cursor = { x: game.input.activePointer.worldX, y: game.input.activePointer.worldY };
  }
};

Game.heartBeat = function () {
  Client.heartBeat(Game.cursor);
};

Game.updatePlayerPosition = function (player) {
  var pastPlayer = Game.Players[player.id];
  var text = Game.text[player.username];
  if (pastPlayer) {
    var tween = Game.add.tween(pastPlayer);
    tween.to({ x: player.x, y: player.y }, 16);
    tween.start();
    var textTween = Game.add.tween(text);
    textTween.to({ x: player.x, y: player.y }, 16);
    textTween.start();
  }
};

Game.addNewPlayer = function (player) {
  Game.displayPlayerInfo(player);
  var username = player.id;
  if (Game.Players[player.id]) {
    Game.Players[player.id].destroy();
  }
  Game.Players[player.id] = Game.Player.create(player.x, player.y, 'character');
  var player = Game.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
  if (username === window.username) {
    game.physics.enable(player);
    game.camera.follow(player);
  }
};

Game.remove = function (id) {
  Game.Players[id].destroy();
  delete Game.Players[id];
};

Game.death = function (player) {
  player = Game.Players[player.id];
  player.kill();
};

Game.displayPlayerInfo = function (player) {
  if (player.username) {
    var username = player.username;
    if (Game.text[username]) {
      Game.text[username].destroy();
    }
    Game.text[username] = game.add.text(player.x, player.y, username, { font: '18px Arial', fill: '#000000' });
    // var displayText = player.username + ': ' + player.lives + ' lives';
    // var textHeight = 30 + 30 * Game.height;
    //  Game.height++;
    // var id = player.id;
    // if (Game.text[id]) {
    //  Game.text[id].destroy();
    // }
    // Game.text[id] = game.add.text(760, textHeight, displayText, {font: '18px Arial', fill: '#000000' });
  }
};

Game.renderHoles = function (holes) {
  Game.hole = game.add.group();
  holes.forEach(function (hole) {
    Game.holes.push(Game.hole.create(hole.x, hole.y, 'hole'));
  });
  Game.holes.forEach(function (hole) {
    hole.animations.add('explode');
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 50, true);
  });
};

Game.over = function (players) {
  //pass the players object to results to display
  game.state.start('Results', true, false, players);
  Client.disconnect();
  Game.Players = {};
  Game.boundaries = [];
  Game.holes = [];
  Game.text = {};
};
var gameResult = {
  init: function init(params) {
    console.log('params', params);

    var winners = _.filter(params, function (player) {
      return player.lives > 0;
    });

    var losers = _.filter(params, function (player) {
      return player.lives === 0;
    });

    var winner = winners[0];
    console.log('winners', winners[0]);
    console.log('losers', losers);

    //Display the winner
    var nameLabel = game.add.text(game.world.width / 2, 40, 'Winner: Player ' + winner.id + ' ', { font: '50px Arial', fill: '#000000' });
    nameLabel.anchor.set(0.5);
    //  console.log('backgroundColor', game.stage.backgroundColor(0xbada55));
    console.log('game stage', game.stage);

    //Dispaly the losers
    this.drawLosers(losers);

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 40, 'Press the "p" key to return to the main menu', { font: '25px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5);

    //add main menu listen input
    var pkey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pkey.onDown.addOnce(this.toLobby, this);
  },

  drawLosers: function drawLosers(losers) {
    playerNameHeight = 80;
    _.forEach(losers, function (player) {
      var textStyle = {
        font: 'bold 30pt italic'
      };
      var loserText = game.add.text(80, playerNameHeight, 'Loser', textStyle);
      var playerName = game.add.text(loserText.x + loserText.width + 30, playerNameHeight, player.id, textStyle);
      playerNameHeight += 150;
    });
  },
  preload: function preload() {
    game.stage.backgroundColor = 0xbada55;
  },

  toLobby: function toLobby() {
    game.state.start('Lobby');
  }

};
var loadState = {
  preload: function preload() {
    var loadingLabel = game.add.text(80, 150, 'loading...', { font: '40px Courier', fill: '#ffffff' });

    game.physics.startSystem(Phaser.Physics.Arcade);

    game.load.image('background', 'https://pearl-jam-game-server.herokuapp.com/assets/board.png');
    game.load.image('character', 'https://pearl-jam-game-server.herokuapp.com/assets/ball.png');
    game.load.image('vertical', 'https://pearl-jam-game-server.herokuapp.com/assets/rectanglevertical.png');
    game.load.image('horiontal', 'https://pearl-jam-game-server.herokuapp.com/assets/rectangle.png');
    game.load.image('joinAsPlayerButton', 'https://pearl-jam-game-server.herokuapp.com/assets/playButton.jpg');
    game.load.image('joinAsSpectatorButton', 'https://pearl-jam-game-server.herokuapp.com/assets/spectateButton.png');
    game.load.spritesheet('hole', 'https://pearl-jam-game-server.herokuapp.com/assets/spritmap.png', 256, 256, 38);
    game.load.spritesheet('playerNotReady', 'https://pearl-jam-game-server.herokuapp.com/assets/playerNotReady.png', 138, 138, 4);
    game.load.image('playerReady', 'https://pearl-jam-game-server.herokuapp.com/assets/playerReady.png');
  },

  create: function create() {
    if (window.spectate) {
      game.state.start('Spectate');
    };
  },

  update: function update() {
    loadState.username = JSON.parse(localStorage["reduxPersist:user"]).displayName;
    console.log(loadState.username);
    if (loadState.username) {
      console.log('your username is ' + loadState.username);
      game.state.start('Lobby');
    }
  }

};
var lobbyState = {
  playerNameHeight: 30,
  isReady: false,

  preload: function preload() {},

  create: function create() {
    Client.socketConnect();
    setLobbyEventHandlers();
    //Maybe you have to add a username like
    //Client.joinLobby(client.username);
    Client.joinLobby();

    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    rkey.onDown.addOnce(this.ready, this);
  },

  update: function update() {
    if (game.input.activePointer.isDown) {
      this.ready();
    }
  },

  ready: function ready() {
    if (!this.isReady) {
      Client.ready();
    }
    this.isReady = true;
  },

  addStartLabels: function addStartLabels() {
    var welcomeLabel = game.add.text(game.world.width / 2, 30, "Welcome to Game Server 1", { font: '35px Arial', fill: '#000000' });
    welcomeLabel.anchor.set(0.5);

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 20, "press the 'R' key when you're ready", { font: '35px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5);
  },

  renderServerInfo: function renderServerInfo(players) {

    if (this.allReady(players)) {
      removeAllSocketListeners();
      game.state.start('Game');
    }

    //remove all the elements
    game.world.children = [];

    //Add the starting labels
    this.addStartLabels();

    //Draw the players
    playerNameHeight = 30;
    _.forEach(players, function (player) {
      var textStyle = {
        font: 'bold 30pt italic'
      };
      var playerName = game.add.text(80, playerNameHeight, player.id, textStyle);
      if (player.ready) {
        //add the ready symbol
        var playerReady = game.add.button(playerName.x + playerName.width, playerNameHeight, 'playerReady');
      } else {
        //add the not ready symbol
        var playerNotReady = game.add.sprite(playerName.x + playerName.width, playerNameHeight, 'playerNotReady');

        playerNotReady.scale.set(0.5);
        playerNotReady.animations.add('toggle', [0, 1, 2, 3], 12, true);
        playerNotReady.play('toggle');
      }
      playerNameHeight += 150;
    });
  },

  allReady: function allReady(players) {
    return players.reduce(function (acc, curr) {
      return acc && curr.ready;
    }, true);
  }

};
winW = window.innerWidth;
winH = window.innerHeight;

console.log(winW, winH);

var game = new Phaser.Game(winW - 50, winH - 50, Phaser.CANVAS, document.getElementById('game'), null, true);

game.state.add('Load', loadState);
game.state.add('Menu', menuState);
game.state.add('Lobby', lobbyState);
game.state.add('Game', Game);
game.state.add('Spectate', spectateState);
game.state.add('Results', gameResult);
game.state.start('Load');

var menuState = {
  create: function create() {
    Client.socketConnect();

    var nameLabel = game.add.text(80, 80, 'Pearl Jam', { font: '50px Arial', fill: '#000000' });

    var button = game.add.button(0, 200, 'joinAsPlayerButton', menuState.joinAsPlayer, this, 2, 1, 0);
    var button = game.add.button(200, 150, 'joinAsSpectatorButton', menuState.joinAsSpectator, this, 2, 1, 0);
  },

  joinAsPlayer: function joinAsPlayer() {
    game.state.start('Lobby');
  },

  joinAsSpectator: function joinAsSpectator() {
    game.state.start('Spectate');
  }
};
var spectateState = {};

spectateState.Players = {};
spectateState.boundaries = [];
spectateState.holes = [];
spectateState.text = {};

spectateState.init = function () {
  Client.socketConnect();
  spectateState.state.disableVisibilityChange = true;
  setSpectateEventHandlers();
};

spectateState.create = function () {
  spectateState.add.sprite(0, 0, 'background');
  spectateState.Player = game.add.group();
  spectateState.bound = game.add.group();
  spectateState.hole = game.add.group();

  spectateState.holes.push(spectateState.hole.create(375, 375, 'hole'));
  spectateState.holes.forEach(function (hole) {
    hole.animations.add('explode');
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 50, true);
  });

  spectateState.bound.create(750, 0, 'vertical');
  Client.askNewSpectator();
};

spectateState.addNewPlayer = function (player) {
  spectateState.Players[player.id] = spectateState.Player.create(player.x, player.y, 'character');
  var player = spectateState.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
};

spectateState.updatePlayerPosition = function (player) {
  var pastPlayer = spectateState.Players[player.id];
  if (pastPlayer) {
    var tween = spectateState.add.tween(pastPlayer);
    tween.to({ x: player.x, y: player.y }, 10);
    tween.start();
  }
  spectateState.displayPlayerInfo(player);
};

spectateState.remove = function (id) {
  spectateState.playerMap[id].destroy();
  delete spectateState.playerMap[id];
};

spectateState.displayPlayerInfo = function (player) {
  var username = player.username;

  if (spectateState.text[username]) {
    spectateState.text[username].destroy();
  }
  spectateState.text[username] = game.add.text(player.x, player.y, username, { font: '18px Arial', fill: '#000000' });
  var displayText = player.username + ': ' + player.lives + ' lives';
  var textHeight = 30 + 30 * player.id;
  var id = player.id;
  if (spectateState.text[id]) {
    spectateState.text[id].destroy();
  }
  spectateState.text[id] = game.add.text(760, textHeight, displayText, { font: '18px Arial', fill: '#000000' });
};

spectateState.over = function (players) {
  Client.disconnect();
  game.state.start('Results', true, false, players);
  spectateState.Players = {};
  spectateState.boundaries = [];
  spectateState.holes = [];
  spectateState.text = {};
};

spectateState.death = function (player) {
  player = spectateState.Players[player.id];
  player.kill();
};
