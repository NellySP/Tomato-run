// Canvas

// detta vill vi ha i en klass istället?

// window.onload = function createCanvas() {
let app = new PIXI.Application({
  width: 500,
  height: 500,
});

document.body.appendChild(app.view);

// add container game screen

gameScreen = new PIXI.Container();
gameScreen.visible = true;
app.stage.addChild(gameScreen);

let gameRect = new PIXI.Graphics();
gameRect.drawRect(0, 0, app.view.width, app.view.height);
gameScreen.addChild(gameRect);

// add background image to gameScreen

let backgroundImage = PIXI.Sprite.from('/sprites/frog.jpeg');
backgroundImage.width = app.view.width;
backgroundImage.height = app.view.height;
backgroundImage.x = 0;
backgroundImage.y = 0;
gameScreen.addChild(backgroundImage);

// game over container

endScreen = new PIXI.Container();
endScreen.visible = false;
app.stage.addChild(endScreen);

let endRect = new PIXI.Graphics();
endRect.beginFill(0xff0000);
endRect.drawRect(0, 0, app.view.width, app.view.height);
endScreen.addChild(endRect);

let gameOverText = new PIXI.Text('Game Over');
gameOverText.anchor.set(0.5);
gameOverText.x = app.view.width / 2;
gameOverText.y = app.view.height / 2;
gameOverText.style = new PIXI.TextStyle({
  fontSize: 40,
  fontStyle: 'bold',
});
endScreen.addChild(gameOverText);

// play again text

let playAgainText = new PIXI.Text('Play Again?');
playAgainText.anchor.set(0.5);
playAgainText.x = app.view.width / 2;
playAgainText.y = app.view.height / 3;
endScreen.addChild(playAgainText);

// play again button

let playAgain = new PIXI.Sprite.from('/sprites/sun.svg');
playAgain.anchor.set(0.5);
playAgain.x = app.view.width / 2;
playAgain.y = app.view.height / 5;
playAgain.buttonMode = true;
playAgain.interactive = true;
playAgain.on('click', onClick);
endScreen.addChild(playAgain);

function onClick() {
  location.reload();
}

// endScreen.addChild(button);

// put in loader
// get sprites

app.loader.baseUrl = 'sprites';
app.loader
  .add('tomato', 'hello.svg')
  .add('caterpillar', 'caterpillar.png')
  .add('raindrop', 'raindrop.svg')
  .add('sun', 'sun.svg')
  .add('scarecrow', 'scarecrow.svg')
  .add('tomat', 'mini-tomato.svg');

//  check if everything is done loading

app.loader.onComplete.add(doneLoading);
app.loader.load();
// };

// When everything is done loading, start game (more or less)

function doneLoading() {
  createMonster();
  createPlayer();
  createFood();
  app.ticker.add(gameLoop);
}

function resetGame() {}

// Gameloop

function gameLoop() {
  caterpillar.move();
  scarecrow.move();

  // Player movement

  if (keys['37']) {
    tomato.x -= 5;
  }
  if (keys['38']) {
    tomato.y -= 5;
  }
  if (keys['39']) {
    tomato.x += 5;
  }
  if (keys['40']) {
    tomato.y += 5;
  }

  if (collision(tomato, caterpillar)) {
    endScreen.visible = true;
    gameScreen.visible = false;
  }

  if (collision(tomato, scarecrow)) {
    endScreen.visible = true;
    gameScreen.visible = false;
  }
}

// Collision function

function collision(a, b) {
  let player = a.getBounds();
  let enemy = b.getBounds();

  return (
    player.x + player.width > enemy.x &&
    player.x < enemy.x + enemy.width &&
    player.y + enemy.height > enemy.y &&
    player.y < enemy.y + enemy.height
  );
}

// Player

let tomato;

// Player class

class Player extends PIXI.Sprite {
  constructor(x = 0, y = 0, width, height, texture, name = 'none') {
    super(texture);
    this.anchor.set(0.5);
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
// create player from class, and add to canvas
function createPlayer() {
  tomato = new Player(
    // players position on the canvas
    250,
    250,
    // player size
    100,
    100,
    // load the image
    app.loader.resources['tomato'].texture,
    // name of the figure
    'mr Tomato'
  );

  // add player to canvas

  // app.stage.addChild(tomato);
  gameScreen.addChild(tomato);
}

// Player movement, listen for keypress

function keyDown(e) {
  keys[e.keyCode] = true;
}
function keyUp(e) {
  keys[e.keyCode] = false;
}

let keys = {};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// Monster

let caterpillar;

// Monster class

class Monster extends PIXI.Sprite {
  constructor(x = 0, y = 0, width, height, texture, name = 'none', speed = 5) {
    super(texture);
    this.anchor.set(0.5);
    this.name = name;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // monster movement

  move() {
    this.x = this.x + this.speed;
    if (this.x > app.view.width - this.width / 2 || this.x < this.width / 2) {
      this.speed = -this.speed;
    }
  }
}

// create monster from class, and add to canvas

function createMonster() {
  caterpillar = new Monster(
    // placement on the canvas
    100,
    100,
    // size of the monster
    50,
    50,
    // image
    app.loader.resources['caterpillar'].texture,
    // name
    'Wormy',
    // speed
    3
  );

  scarecrow = new Monster(
    400,
    400,
    100,
    100,
    app.loader.resources['scarecrow'].texture,
    'scary',
    5
  );

  // add monster to canvas

  gameScreen.addChild(caterpillar, scarecrow);
}

// Food/points

class Food extends PIXI.Sprite {
  constructor(x = 0, y = 0, width, height, texture) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

function createFood() {
  raindrop = new Food(
    (Math.random() * app.screen.width) / 2,
    (Math.random() * app.screen.height) / 2,
    50,
    50,
    app.loader.resources['raindrop'].texture
  );

  sun = new Food(
    (Math.random() * app.screen.width) / 2,
    (Math.random() * app.screen.height) / 2,
    50,
    50,
    app.loader.resources['sun'].texture
  );

  gameScreen.addChild(raindrop, sun);
}