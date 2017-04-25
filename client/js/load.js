var database = require('../../server/dataBase.js')
let game, localStorage, Phaser // just for less erroring in the code

var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'})
    const uid = JSON.parse(localStorage['reduxPersist:user']).uid
    const avatar = JSON.parse(localStorage['reduxPersist:user']).avatar ? JSON.parse(localStorage['reduxPersist:user']).avatar : null

    game.physics.startSystem(Phaser.Physics.Arcade)

    this.getAvatar(uid, avatar)
    .then((avatarImage) => {
      game.load.image('character', avatarImage)
    })

    game.load.image('background', 'https://ddu0j6ouvozck.cloudfront.net/board.png')
    // game.load.image('character', 'https://ddu0j6ouvozck.cloudfront.net/ball.png')
    game.load.image('character', 'https://ddu0j6ouvozck.cloudfront.net/ball.png')
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
  },

  getAvatar: function (uid, avatar) {
    return new Promise((resolve, reject) => {
      if (!avatar) {
        let randomAvatar = Math.floor((Math.random() * 11))
        resolve(`https://ddu0j6ouvozck.cloudfront.net/${randomAvatar}.png`)
      }
      if (typeof avatar === 'number') {
        resolve(`https://ddu0j6ouvozck.cloudfront.net/${avatar}.png`)
      }
      if (typeof avatar === 'string') {
        this.getAvatarImage(uid)
        .then(avatarImage => {
          resolve(avatarImage)
        })
      }
    })
  },

  getAvatarImage: function (uid) {
    return new Promise((resolve, reject) => {
      database.ref(`users/${uid}.avatarColorID`).once('value')
      .then((snap) => {
        resolve(snap.val())
      })
      .catch(error => console.log('error', error))
    })
  },

  update: function () {
    loadState.username = JSON.parse(localStorage['reduxPersist:user']).displayName
    if (loadState.username) {
      game.state.start('Lobby')
    }
  }

}
