var spectateState = {};

spectateState.Players = {};
spectateState.boundaries = [];
spectateState.holes = [];
spectateState.text = {};
spectateState.height = 0;
spectateState.hearts = {};

spectateState.init = function() {
  Client.socketConnect();
  spectateState.state.disableVisibilityChange = false;
  setSpectateEventHandlers();
};

spectateState.create = function() {
  game.state.backgroundColor = '#333'
  game.world.setBounds(0, 0, 1900, 1900)

  spectateState.Player = game.add.group();
  spectateState.bound = game.add.group();
  
  spectateState.pulse = setInterval(spectateState.heartBeat, 16)
  Client.askNewSpectator();
};

spectateState.update = function () {
  if (!spectateState.holes.length) {
    if (spectateState.rawHoles) {
      console.log('holes are rendered')
      spectateState.renderHoles(spectateState.rawHoles)
    }
  }
}

spectateState.updatePlayerPosition = function (player) {
  var pastPlayer = spectateState.Players[player.id]
  var text = spectateState.text[player.username]
  var hearts = spectateState.hearts[player.id]
  if (pastPlayer) {
    var tween = spectateState.add.tween(pastPlayer)
    tween.to({x: player.x, y: player.y}, 16)
    tween.start()
    var textTween = spectateState.add.tween(text)
    textTween.to({x: player.x, y: player.y}, 16)
    textTween.start()
    if (player.lives !== hearts.length) {
      var heart = hearts.pop()
      heart.destroy()
    }
    var space = -20 
    for (var i = 0; i < player.lives; i++) {
      var heartTween = spectateState.add.tween(hearts[i])
      heartTween.to({x: player.x + space, y: player.y + 10}, 16)
      heartTween.start()
      space += 20
    }
  }
}

spectateState.addNewPlayer = function (player) {
  spectateState.displayPlayerInfo(player)
  var username = player.id
  if (spectateState.Players[player.id]) {
    spectateState.Players[player.id].destroy()
  }
  spectateState.Players[player.id] = spectateState.Player.create(player.x, player.y, `${player.colorID}`)
  var player = spectateState.Players[player.id]
  player.anchor.x = 0.5
  player.anchor.y = 0.5
  console.log(username, loadState.username)
  console.log(player)
  if (username === loadState.username) {
    game.physics.enable(player)
    game.camera.follow(player)
  }
}

spectateState.remove = function (id) {
  spectateState.Players[id].destroy()
  delete spectateState.Players[id]
}

spectateState.death = function (player) {
  var text = spectateState.text[player.id]
  text.destroy()
  var heart = spectateState.hearts[player.id][0]
  heart.destroy()
  if (player.id === loadState.username) {
    console.log('you lost')
    var gameoverLabel = game.add.text(player.x, player.y, 'spectateState Over', {font: '50px Arial', fill: '#fff'})
  }
  player = spectateState.Players[player.id]
  player.kill()
}

spectateState.displayPlayerInfo = function (player) {
  if (player.username) {
    var username = player.username
    var hearts = spectateState.hearts[player.id]
    if (hearts) {
      hearts.forEach( (heart) => heart.destroy()) 
    }
    if (spectateState.text[username]) {
      spectateState.text[username].destroy()
    }
    spectateState.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#fff' })
    let text = spectateState.text[username]
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5)
    text.anchor.x = 0.5
    text.anchor.y = 0.5
    spectateState.hearts[player.id] = []
    var space = -20
    for (var i = 0; i < player.lives; i++) {
      spectateState.hearts[player.id].push(game.add.sprite(player.x + space, player.y + 10, 'heart'))
      space += 20
    }
  }
}

spectateState.renderHoles = function (holes) {
  spectateState.hole = game.add.group()
  holes.forEach((hole) => {
    spectateState.holes.push(spectateState.hole.create(hole.x, hole.y, 'hole'))
  })
  spectateState.holes.forEach((hole) => {
    hole.anchor.x = 0.5
    hole.animations.add('explode', [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])
    hole.anchor.y = 0.5
    hole.animations.play('explode', 20, true)
  })
}

spectateState.over = function (players) {
  // pass the players object to results to display
  game.state.start('Results', true, false, players)
  Client.disconnect()
  spectateState.Players = {}
  spectateState.boundaries = []
  spectateState.holes = []
  spectateState.text = {}
}
