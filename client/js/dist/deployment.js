var Game = {}
Game.Players = {}
Game.boundaries = []
Game.holes = []
Game.text = {}
Game.height = 0

Game.init = function () {
  game.state.disableVisibilityChange = false
  setGameEventHandlers()
}

Game.create = function () {
  Game.add.sprite(0, 0, 'background')
  Game.add.sprite(0, 1152, 'background')
  game.world.setBounds(0, 0, 1900, 1900)
  Client.askNewPlayer()
  Game.cursor = {x: 450, y: 300}
  Game.Player = game.add.group()
  Game.bound = game.add.group()

  Game.heartBeat()
  Game.pulse = setInterval(Game.heartBeat, 10)
}

Game.update = function () {
  if (!Game.holes.length) {
    if (Game.rawHoles) {
      Game.renderHoles(Game.rawHoles)
    }
  }
  Game.cursor = {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY}
  if (game.input.activePointer.isDown) {
    Game.cursor = {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY}
  }
}

Game.heartBeat = function () {
  Client.heartBeat(Game.cursor)
}

Game.updatePlayerPosition = function (player) {
  var pastPlayer = Game.Players[player.id]
  var text = Game.text[player.username]
  if (pastPlayer) {
    var tween = Game.add.tween(pastPlayer)
    tween.to({x: player.x, y: player.y}, 16)
    tween.start()
    var textTween = Game.add.tween(text)
    textTween.to({x: player.x, y: player.y}, 16)
    textTween.start()
  }
}

Game.addNewPlayer = function (player) {
  Game.displayPlayerInfo(player)
  var username = player.id
  if (Game.Players[player.id]) {
    Game.Players[player.id].destroy()
  }
  Game.Players[player.id] = Game.Player.create(player.x, player.y, `${player.colorID}`)
  var player = Game.Players[player.id]
  player.anchor.x = 0.5
  player.anchor.y = 0.5
  console.log(username, loadState.username)
  if (username === loadState.username) {
    console.log('in the right if statement')
    game.physics.enable(player)
    game.camera.follow(player)
  }
}

Game.remove = function (id) {
  Game.Players[id].destroy()
  delete Game.Players[id]
}

Game.death = function (player) {
  player = Game.Players[player.id]
  player.kill()
}

Game.displayPlayerInfo = function (player) {
  if (player.username) {
    var username = player.username
    if (Game.text[username]) {
      Game.text[username].destroy()
    }
    Game.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#000000' })
    // var displayText = player.username + ': ' + player.lives + ' lives';
    // var textHeight = 30 + 30 * Game.height;
   //  Game.height++;
    // var id = player.id;
    // if (Game.text[id]) {
    //  Game.text[id].destroy();
    // }
    // Game.text[id] = game.add.text(760, textHeight, displayText, {font: '18px Arial', fill: '#000000' });
  }
}

Game.renderHoles = function (holes) {
  Game.hole = game.add.group()
  holes.forEach((hole) => {
    Game.holes.push(Game.hole.create(hole.x, hole.y, 'hole'))
  })
  Game.holes.forEach((hole) => {
    hole.animations.add('explode')
    hole.anchor.y = 0.5
    hole.anchor.x = 0.5
    hole.animations.play('explode', 50, true)
  })
}

Game.over = function (players) {
  // pass the players object to results to display
  game.state.start('Results', true, false, players)
  Client.disconnect()
  Game.Players = {}
  Game.boundaries = []
  Game.holes = []
  Game.text = {}
}

var gameResult = {
  init: function(params) {
    console.log('params', params);

    var winners = _.filter(params, function(player) {
      return player.lives > 0
    })    

    var losers = _.filter(params, function(player) {
      return player.lives === 0;
    })

    var winner = winners[0]
    console.log('winners', winners[0])
    console.log('losers', losers)
     

    //Display the winner
    var nameLabel = game.add.text(game.world.width / 2, 40, `Winner: Player ${winner.id} `,
      {font: '50px Arial', fill: '#000000'});
    nameLabel.anchor.set(0.5); 
  //  console.log('backgroundColor', game.stage.backgroundColor(0xbada55));
   console.log('game stage', game.stage);

   //Dispaly the losers
   this.drawLosers(losers);






    var startLabel = game.add.text(game.world.width/2, game.world.height - 40,
      'Press the "p" key to return to the main menu', 
      {font: '25px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5);


    //add main menu listen input
    var pkey = game.input.keyboard.addKey(Phaser.Keyboard.P)
    pkey.onDown.addOnce(this.toLobby, this);
  },
  
  drawLosers: function(losers) {
    var playerNameHeight =  80;
    _.forEach(losers, (player) => {
        var textStyle = {
          font: 'bold 30pt italic'
        }
        var loserText = game.add.text(80, playerNameHeight, 'Loser', textStyle);
        var playerName = game.add.text(loserText.x + loserText.width + 30, playerNameHeight, player.id, textStyle);
        playerNameHeight += 150;
    })

  },
  preload: function() {
    game.stage.backgroundColor = 0xbada55; 
  },
  
  toLobby: function() {
    game.state.start('Lobby');
  }
  

};
var database = require('../../server/dataBase.js')
// let game, localStorage, Phaser // just for less erroring in the code

var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'})
    // const uid = JSON.parse(localStorage['reduxPersist:user']).uid
    // const avatar = JSON.parse(localStorage['reduxPersist:user']).avatar ? JSON.parse(localStorage['reduxPersist:user']).avatar : null

    // this.getAvatar(uid, avatar)
    // .then((avatarImage) => {
    //   game.load.image('character', avatarImage)
    // })

    // load all images 0 - 11

    game.physics.startSystem(Phaser.Physics.Arcade)
    game.load.image('background', 'https://ddu0j6ouvozck.cloudfront.net/board.png')
    // game.load.image('character', 'https://ddu0j6ouvozck.cloudfront.net/ball.png')
    game.load.image('0', 'https://ddu0j6ouvozck.cloudfront.net/0.png')
    game.load.image('1', 'https://ddu0j6ouvozck.cloudfront.net/1.png')
    game.load.image('2', 'https://ddu0j6ouvozck.cloudfront.net/2.png')
    game.load.image('3', 'https://ddu0j6ouvozck.cloudfront.net/3.png')
    game.load.image('4', 'https://ddu0j6ouvozck.cloudfront.net/4.png')
    game.load.image('5', 'https://ddu0j6ouvozck.cloudfront.net/5.png')
    game.load.image('6', 'https://ddu0j6ouvozck.cloudfront.net/6.png')
    game.load.image('7', 'https://ddu0j6ouvozck.cloudfront.net/7.png')
    game.load.image('8', 'https://ddu0j6ouvozck.cloudfront.net/8.png')
    game.load.image('9', 'https://ddu0j6ouvozck.cloudfront.net/9.png')
    game.load.image('10', 'https://ddu0j6ouvozck.cloudfront.net/10.png')
    game.load.image('11', 'https://ddu0j6ouvozck.cloudfront.net/11.png')

    game.load.image('vertical', 'https://ddu0j6ouvozck.cloudfront.net/rectanglevertical.png')
    game.load.image('horiontal', 'https://ddu0j6ouvozck.cloudfront.net/rectangle.png')
    game.load.image('joinAsPlayerButton', 'https://ddu0j6ouvozck.cloudfront.net/playButton.jpg')
    game.load.image('joinAsSpectatorButton', 'https://ddu0j6ouvozck.cloudfront.net/spectateButton.png')
    game.load.spritesheet('hole', 'https://ddu0j6ouvozck.cloudfront.net/spritmap.png', 256, 256, 38)
    game.load.spritesheet('playerNotReady', 'https://ddu0j6ouvozck.cloudfront.net/playerNotReady.png', 138, 138, 4)
    game.load.image('playerReady', 'https://ddu0j6ouvozck.cloudfront.net/playerReady.png')
  },

  create: function () {
    if (window.spectate) {
      game.state.start('Spectate')
    };
    if (localStorage["reduxPersist:user"]) {
      loadState.username = JSON.parse(localStorage["reduxPersist:user"]).displayName;
    } else {
      loadState.username = prompt('What is your username?')
    }
  },

  // getAvatar: function (uid, avatar) {
  //   return new Promise((resolve, reject) => {
  //     if (!avatar) {
  //       let randomAvatar = Math.floor((Math.random() * 11))
  //       resolve(`https://ddu0j6ouvozck.cloudfront.net/${randomAvatar}.png`)
  //     }
  //     if (typeof avatar === 'number') {
  //       resolve(`https://ddu0j6ouvozck.cloudfront.net/${avatar}.png`)
  //     }
  //     if (typeof avatar === 'string') {
  //       this.getAvatarImage(uid)
  //       .then(avatarImage => {
  //         resolve(avatarImage)
  //       })
  //     }
  //   })
  // },

  // getAvatarImage: function (uid) {
  //   return new Promise((resolve, reject) => {
  //     database.ref(`users/${uid}.avatarColorID`).once('value')
  //     .then((snap) => {
  //       resolve(snap.val())
  //     })
  //     .catch(error => console.log('error', error))
  //   })
  // },

  update: function () {
  loadState.username = JSON.parse(localStorage['reduxPersist:user']).displayName
  loadState.colorID = JSON.parse(localStorage['reduxPersist:user']).avatar || Math.floor((Math.random() * 11))
    if (loadState.username) {
      game.state.start('Lobby')
    }
  }

}

var lobbyState = {
  playerNameHeight: 30,
  isReady: false,

  preload: function () {
  },

  create: function () {
    Client.socketConnect()
    setLobbyEventHandlers()
    // Maybe you have to add a username like
    // Client.joinLobby(client.username);
    Client.joinLobby()

    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R)
    rkey.onDown.addOnce(this.ready, this)
  },

  update: function () {
    if (game.input.activePointer.isDown) {
      this.ready()
    }
  },

  ready: function () {
    if (!this.isReady) {
      Client.ready()
    }
    this.isReady = true
  },

  addStartLabels: function () {
    var welcomeLabel = game.add.text(game.world.width / 2, 30,
    'Welcome to Game Server 1',
      {font: '35px Arial', fill: '#000000' })
    welcomeLabel.anchor.set(0.5)

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 20,
      "press the 'R' key when you're ready",
      {font: '35px Arial', fill: '#000000' })
    startLabel.anchor.set(0.5)
  },

  renderServerInfo: function (players) {
    if (this.allReady(players)) {
      removeAllSocketListeners()
      game.state.start('Game')
    }

    // remove all the elements
    game.world.children = []

    // Add the starting labels
    this.addStartLabels()

    // Draw the players
    var playerNameHeight = 30
    _.forEach(players, (player) => {
      var textStyle = {
        font: 'bold 30pt italic'
      }
      var playerName = game.add.text(80, playerNameHeight, player.id, textStyle)
      if (player.ready) { // add the ready symbol
        var playerReady = game.add.button(playerName.x + playerName.width, playerNameHeight, 'playerReady')
      } else { // add the not ready symbol
        var playerNotReady = game.add.sprite(playerName.x + playerName.width, playerNameHeight, 'playerNotReady')

        playerNotReady.scale.set(0.5)
        playerNotReady.animations.add('toggle', [0, 1, 2, 3], 12, true)
        playerNotReady.play('toggle')
      }
      playerNameHeight += 150
    })
  },

  allReady: function (players) {
    return players.reduce((acc, curr) => {
      return acc && curr.ready
    }, true)
  }

}

var winW = window.innerWidth
var winH = window.innerHeight

var game = new Phaser.Game(winW - 50, winH - 50, Phaser.CANVAS, document.getElementById('game'), null, true)

game.state.add('Load', loadState)
game.state.add('Menu', menuState)
game.state.add('Lobby', lobbyState)
game.state.add('Game', Game)
game.state.add('Spectate', spectateState)
game.state.add('Results', gameResult)
game.state.start('Load')

var menuState = {
  create: function() {
    Client.socketConnect();

    var nameLabel = game.add.text(80, 80, 'Pearl Jam',
      {font: '50px Arial', fill: '#000000'});

    var button = game.add.button(0, 200, 'joinAsPlayerButton', menuState.joinAsPlayer, this, 2, 1, 0);
    var button = game.add.button(200, 150, 'joinAsSpectatorButton', menuState.joinAsSpectator, this, 2, 1, 0);
  },

  joinAsPlayer: function() {
    game.state.start('Lobby');
  },

  joinAsSpectator: function() {
    game.state.start('Spectate');
  }
}
var spectateState = {};

spectateState.Players = {};
spectateState.boundaries = [];
spectateState.holes = [];
spectateState.text = {};


spectateState.init = function() {
  Client.socketConnect();
  spectateState.state.disableVisibilityChange = true;
  setSpectateEventHandlers();
};

spectateState.create = function() {
  spectateState.add.sprite(0, 0, 'background');
  spectateState.Player = game.add.group();
  spectateState.bound = game.add.group();
  spectateState.hole = game.add.group();
  
  spectateState.holes.push(spectateState.hole.create(375, 375, 'hole'));
  spectateState.holes.forEach( (hole) => {
    hole.animations.add('explode');
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 50, true);
  });

  spectateState.bound.create(750, 0, 'vertical');
  Client.askNewSpectator();
};

spectateState.addNewPlayer = function(player) {
  spectateState.Players[player.id] = spectateState.Player.create(player.x, player.y, 'character');
  var player = spectateState.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
};

spectateState.updatePlayerPosition = function(player) {
  var pastPlayer = spectateState.Players[player.id];
  if (pastPlayer) {
    var tween = spectateState.add.tween(pastPlayer);
    tween.to({x: player.x, y: player.y}, 10);
    tween.start();
  }
  spectateState.displayPlayerInfo(player);
}

spectateState.remove = function(id) {
  spectateState.playerMap[id].destroy();
  delete spectateState.playerMap[id];
};

spectateState.displayPlayerInfo = function(player) {
  var username = player.username;

  if (spectateState.text[username]) {
    spectateState.text[username].destroy();
  }
  spectateState.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#000000'});
  var displayText = player.username + ': ' + player.lives + ' lives';
  var textHeight = 30 + 30 * player.id;
  var id = player.id;
  if (spectateState.text[id]) {
    spectateState.text[id].destroy();
  }
  spectateState.text[id] = game.add.text(760, textHeight, displayText, {font: '18px Arial', fill: '#000000'});
}

spectateState.over = function(players) {
  Client.disconnect();
  game.state.start('Results', true, false, players);
  spectateState.Players = {};
  spectateState.boundaries = [];
  spectateState.holes = [];
  spectateState.text = {};
}

spectateState.death = function(player) {
  player = spectateState.Players[player.id];
  player.kill();
}

