var lobbyState = {
  playerNameHeight: 30,
  isReady: false,

  preload: function () {
  },

  create: function () {
    // Maybe you have to add a username like
    // Client.joinLobby(client.username);
    Client.joinLobby()
    game.state.backgroundColor = '#333'
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
    var welcomeLabel = game.add.text(game.world.width / 2, 50,
    'Welcome to Game Server 1',
      {font: '35px Arial', fill: '#ffbfda' })
    welcomeLabel.anchor.set(0.5)

    var startLabel = game.add.text(game.world.width / 2, game.world.height - 50,
      "click when you are ready",
      {font: '35px Arial', fill: '#ffbfda' })
    startLabel.anchor.set(0.5)
  },

  renderServerInfo: function (players) {
    if (this.allReady(players) && players.length > 1) {
      removeAllSocketListeners()
      game.state.start('Game')
    }

    // remove all the elements
    game.world.children = []

    // Add the starting labels
    this.addStartLabels()

    // Draw the players
    var playerNameHeight = 80
    _.forEach(players, (player) => {
      var textStyle = {
        font: 'bold 30pt italic',
        fill: '#f001f2'
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
      playerNameHeight += 75
    })
  },

  allReady: function (players) {
    return players.reduce((acc, curr) => {
      return acc && curr.ready
    }, true)
  }

}
