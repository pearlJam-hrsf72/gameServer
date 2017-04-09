var game = new Phaser.Game(900, 600, Phaser.CANVAS, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');