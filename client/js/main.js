winW = window.innerWidth;
winH = window.innerHeight;

console.log(winW, winH)

var game = new Phaser.Game(750, 750, Phaser.CANVAS, document.getElementById('game'), null, true);

game.state.add('Boot', bootState);
game.state.add('Load', loadState);
game.state.add('Menu', menuState);

game.state.add('Game', Game);
game.state.add('Spectate', spectateState);
game.state.add('Win', winState);
game.state.add('Lose', loseState);

game.state.start('Boot');