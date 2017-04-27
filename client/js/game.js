var Game = {}
Game.Players = {}
Game.boundaries = []
Game.holes = []
Game.text = {}
Game.height = 0
Game.hearts = {}

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
  Game.pulse = setInterval(Game.heartBeat, 16)
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
  var hearts = Game.hearts[player.id]
  if (pastPlayer) {
    var tween = Game.add.tween(pastPlayer)
    tween.to({x: player.x, y: player.y}, 16)
    tween.start()
    var textTween = Game.add.tween(text)
    textTween.to({x: player.x, y: player.y}, 16)
    textTween.start()
    if (player.lives !== hearts.length) {
      var heart = hearts.pop()
      heart.destroy()
    }
    var space = -20 
    for (var i = 0; i < player.lives; i++) {
      var heartTween = Game.add.tween(hearts[i])
      heartTween.to({x: player.x + space, y: player.y + 10}, 16)
      heartTween.start()
      space += 20
    }
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
  var text = Game.text[player.id]
  text.destroy()
  var heart = Game.hearts[player.id][0]
  heart.destroy()
  if (player.id === loadState.username) {
    console.log('you lost')
    var gameoverLabel = game.add.text(player.x, player.y, 'Game Over', {font: '50px Arial', fill: '#fff'})
  }
  player = Game.Players[player.id]
  player.kill()
}

Game.displayPlayerInfo = function (player) {
  if (player.username) {
    var username = player.username
    var hearts = Game.hearts[player.id]
    if (hearts) {
      hearts.forEach( (heart) => heart.destroy()) 
    }
    if (Game.text[username]) {
      Game.text[username].destroy()
    }
    Game.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#fff' })
    let text = Game.text[username]
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5)
    text.anchor.x = 0.5
    text.anchor.y = 0.5
    Game.hearts[player.id] = []
    var space = -20
    for (var i = 0; i < player.lives; i++) {
      Game.hearts[player.id].push(game.add.sprite(player.x + space, player.y + 10, 'heart'))
      space += 20
    }
  }
}

Game.renderHoles = function (holes) {
  Game.hole = game.add.group()
  holes.forEach((hole) => {
    Game.holes.push(Game.hole.create(hole.x, hole.y, 'hole'))
  })
  Game.holes.forEach((hole) => {
    hole.animations.add('explode', [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])
    hole.anchor.y = 0.5
    hole.anchor.x = 0.5
    hole.animations.play('explode', 20, true)
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
