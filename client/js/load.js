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
  update: function() {
    if (loadState.username) {
      game.state.start('Lobby')
    }
  }

}
