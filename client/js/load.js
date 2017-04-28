
var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'})

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
    game.load.spritesheet('hole', 'https://ddu0j6ouvozck.cloudfront.net/explosionSprite.png', 300, 300, 81)
    game.load.spritesheet('playerNotReady', 'https://ddu0j6ouvozck.cloudfront.net/playerNotReady.png', 138, 138, 4)
    game.load.image('playerReady', 'https://ddu0j6ouvozck.cloudfront.net/playerReady.png')
    game.load.image('heart', 'https://ddu0j6ouvozck.cloudfront.net/heartSprite.png')
  },

  create: function () {
    Client.socketConnect()
    setLobbyEventHandlers()

    console.log(window.spectate)
    if (window.spectate) {
      console.log('spectate')
      game.state.start('Spectate')
    };
    loadState.username = localStorage['reduxPersist:user'] ? JSON.parse(localStorage['reduxPersist:user']).displayName : null
    loadState.colorID = localStorage['reduxPersist:user'] ? JSON.parse(localStorage['reduxPersist:user']).avatar || Math.floor((Math.random() * 11)) : Math.floor((Math.random() * 11))
    if (!loadState.username) {
      Client.needUsername();
    }
  },


  update: function () {
    if (loadState.username) {
      console.log('game is starting')
      game.state.start('Lobby')
    }
  }

}
