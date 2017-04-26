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
  game.physics.startSystem(Phaser.Physics.Arcade);
};

Game.create = function () {
  game.state.backgroundColor = '#333';
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
  Game.Players[player.id] = Game.Player.create(player.x, player.y, '' + player.colorID);
  var player = Game.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
  console.log(username, loadState.username);
  console.log(player);
  if (username === loadState.username) {
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
    var text = Game.text[username];
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
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
    hole.animations.add('explode', [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 20, true);
  });
};

Game.over = function (players) {
  // pass the players object to results to display
  game.state.start('Results', true, false, players);
  Client.disconnect();
  Game.Players = {};
  Game.boundaries = [];
  Game.holes = [];
  Game.text = {};
};

var gameResult = {
  init: function init(params) {
    lobbyState.isReady = false;
    console.log('params', params);

    game.world.setBounds(0, 0, winW - 50, winH - 50);
    // game.stage.backgroundColor = '#333'; 

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
    var nameLabel = game.add.text(game.world.width / 2, 40, 'Winner: Player ' + winner.id + ' ', { font: '50px Arial', fill: '#f001f2' });
    nameLabel.anchor.set(0.5);
    //  console.log('backgroundColor', game.stage.backgroundColor(0xbada55));

    //Dispaly the losers
    this.drawLosers(losers);

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 40, 'click to return to the lobby', { font: '25px Arial', fill: '#f001f2' });
    startLabel.anchor.set(0.5);
  },

  update: function update() {
    if (game.input.activePointer.isDown) {
      game.state.start('Load');
    }
  },

  drawLosers: function drawLosers(losers) {
    var playerNameHeight = 80;
    _.forEach(losers, function (player) {
      var textStyle = {
        font: 'bold 30pt italic',
        fill: '#ffbfda'
      };
      var loserText = game.add.text(80, playerNameHeight, 'Loser', textStyle);
      var playerName = game.add.text(loserText.x + loserText.width + 30, playerNameHeight, player.id, textStyle);
      playerNameHeight += 150;
    });
  },
  toLobby: function toLobby() {
    game.state.start('Lobby');
  }

};

var loadState = {
  preload: function preload() {
    var loadingLabel = game.add.text(80, 150, 'loading...', { font: '40px Courier', fill: '#ffffff' });

    game.load.image('0', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/0.png');
    game.load.image('1', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/1.png');
    game.load.image('2', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/2.png');
    game.load.image('3', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/3.png');
    game.load.image('4', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/4.png');
    game.load.image('5', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/5.png');
    game.load.image('6', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/6.png');
    game.load.image('7', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/7.png');
    game.load.image('8', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/8.png');
    game.load.image('9', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/9.png');
    game.load.image('10', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/10.png');
    game.load.image('11', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/11.png');
    game.load.image('vertical', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/rectanglevertical.png');
    game.load.image('horiontal', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/rectangle.png');
    game.load.image('joinAsPlayerButton', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playButton.jpg');
    game.load.image('joinAsSpectatorButton', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/spectateButton.png');
    game.load.spritesheet('hole', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/explosionSprite.png', 300, 300, 81);
    game.load.spritesheet('playerNotReady', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playerNotReady.png', 138, 138, 4);
    game.load.image('playerReady', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playerReady.png');
  },

  create: function create() {
    Client.socketConnect();
    setLobbyEventHandlers();

    if (window.spectate) {
      game.state.start('Spectate');
    };
    loadState.username = localStorage['reduxPersist:user'] ? JSON.parse(localStorage['reduxPersist:user']).displayName : null;
    loadState.colorID = localStorage['reduxPersist:user'] ? JSON.parse(localStorage['reduxPersist:user']).avatar || Math.floor(Math.random() * 11) : Math.floor(Math.random() * 11);
    if (!loadState.username) {
      Client.needUsername();
    }
  },

  update: function update() {
    if (loadState.username) {
      console.log('game is starting');
      game.state.start('Lobby');
    }
  }

};

var lobbyState = {
  playerNameHeight: 30,
  isReady: false,

  preload: function preload() {},

  create: function create() {
    // Maybe you have to add a username like
    // Client.joinLobby(client.username);
    Client.joinLobby();
    game.state.backgroundColor = '#333';
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
    var welcomeLabel = game.add.text(game.world.width / 2, 50, 'Welcome to Game Server 1', { font: '35px Arial', fill: '#ffbfda' });
    welcomeLabel.anchor.set(0.5);

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 50, "click when you are ready", { font: '35px Arial', fill: '#ffbfda' });
    startLabel.anchor.set(0.5);
  },

  renderServerInfo: function renderServerInfo(players) {
    if (this.allReady(players)) {
      removeAllSocketListeners();
      game.state.start('Game');
    }

    // remove all the elements
    game.world.children = [];

    // Add the starting labels
    this.addStartLabels();

    // Draw the players
    var playerNameHeight = 80;
    _.forEach(players, function (player) {
      var textStyle = {
        font: 'bold 30pt italic',
        fill: '#f001f2'
      };
      var playerName = game.add.text(80, playerNameHeight, player.id, textStyle);
      if (player.ready) {
        // add the ready symbol
        var playerReady = game.add.button(playerName.x + playerName.width, playerNameHeight, 'playerReady');
      } else {
        // add the not ready symbol
        var playerNotReady = game.add.sprite(playerName.x + playerName.width, playerNameHeight, 'playerNotReady');

        playerNotReady.scale.set(0.5);
        playerNotReady.animations.add('toggle', [0, 1, 2, 3], 12, true);
        playerNotReady.play('toggle');
      }
      playerNameHeight += 75;
    });
  },

  allReady: function allReady(players) {
    return players.reduce(function (acc, curr) {
      return acc && curr.ready;
    }, true);
  }

};

var winW = window.innerWidth;
var winH = window.innerHeight;

var game = new Phaser.Game(winW - 50, winH - 50, Phaser.CANVAS, document.getElementById('game'), null, false);

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
