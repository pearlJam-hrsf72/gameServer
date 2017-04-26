var Game = {}
Game.Players = {}
Game.boundaries = []
Game.holes = []
Game.text = {}
Game.height = 0

Game.init = function () {
  game.state.disableVisibilityChange = false
  setGameEventHandlers()
  game.physics.startSystem(Phaser.Physics.Arcade)
}

Game.create = function () {
  game.state.backgroundColor = '#333'
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
  console.log(player)
  if (username === loadState.username) {
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
    let text = Game.text[username]
    text.anchor.x = 0.5
    text.anchor.y = 0.5
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
