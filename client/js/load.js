
var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'})

    game.physics.startSystem(Phaser.Physics.Arcade)
    game.load.image('background', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/board.png')
    game.load.image('0', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/0.png')
    game.load.image('1', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/1.png')
    game.load.image('2', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/2.png')
    game.load.image('3', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/3.png')
    game.load.image('4', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/4.png')
    game.load.image('5', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/5.png')
    game.load.image('6', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/6.png')
    game.load.image('7', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/7.png')
    game.load.image('8', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/8.png')
    game.load.image('9', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/9.png')
    game.load.image('10', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/10.png')
    game.load.image('11', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/11.png')
    game.load.image('vertical', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/rectanglevertical.png')
    game.load.image('horiontal', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/rectangle.png')
    game.load.image('joinAsPlayerButton', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playButton.jpg')
    game.load.image('joinAsSpectatorButton', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/spectateButton.png')
    game.load.spritesheet('hole', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/spritmap.png', 256, 256, 38)
    game.load.spritesheet('playerNotReady', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playerNotReady.png', 138, 138, 4)
    game.load.image('playerReady', 'https://s3-us-west-1.amazonaws.com/pearljamhrsf72/playerReady.png')
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
