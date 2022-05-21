const game = {
  time: null,
  actions: [],
  canFire: true,
  canCreateEnemy: true,
  fireSpeed: null,
  score: 0,
  gameover: false,
};

const INPUTS = {
  up: 87,
  down: 83,
  fire: 68,
};

const CONFIG = {
  PLAYER: {
    TOP: 10,
    BOTTOM: 525,
    SPEED: 10,
  },
  ENEMY: {
    TOP: 10,
    BOTTOM: 525,
    LEFT: 0,
    RIGHT: 694,
    POSICAO_Y: 0,
    SCORE: 100,
  },
  SOUNDS: {
    SHOOT: document.getElementById("soundShoot"),
    EXPLOSION: document.getElementById("soundExplosion"),
    GAMEOVER: document.getElementById("soundGameover"),
    LOST: document.getElementById("soundLost"),
    RESCUE: document.getElementById("soundRescue"),
  },
};

let musicBackground = document.getElementById("soundBackground");
musicBackground.addEventListener(
  "ended",
  function () {
    musicBackground.currentTime = 0;
    musicBackground.play();
  },
  false
);
//musicBackground.play();

function start() {
  $("#start").hide();
  setInterval(loop, 30);
  game.gameover = false;
  $("#main-play-area").append("<div id='score'></div>");
}

function loop() {
  if (game.gameover) {
    return;
  }
  updateScenary();
  fireLaser();
  movePLayer();
  moveLaser();
  checkCollisions();
  moveEnemies();
  updateScore();
  createEnemy();
}

function updateScenary() {
  const esquerda = parseInt($("#main-play-area").css("background-position"));
  $("#main-play-area").css("background-position", esquerda - 1);
}

$(document).keydown(function (e) {
  game.actions[e.which] = true;
});

$(document).keyup(function (e) {
  game.actions[e.which] = false;
});

function movePLayer() {
  const playerPositionTop = parseInt($("#player").css("top"));
  if (game.actions[INPUTS.up] && playerPositionTop > CONFIG.PLAYER.TOP) {
    $("#player").css("top", playerPositionTop - CONFIG.PLAYER.SPEED);
  } else if (
    game.actions[INPUTS.down] &&
    playerPositionTop <= CONFIG.PLAYER.BOTTOM
  ) {
    $("#player").css("top", playerPositionTop + CONFIG.PLAYER.SPEED);
  }
}

//funcionalidade de tiro
function fireLaser() {
  if (game.actions[INPUTS.fire] && game.canFire) {
    game.canFire = false;
    const xPosition = parseInt($("#player").css("left"))
    const yPosition = parseInt($("#player").css("top"))
    let laser = createLaserElement(xPosition, yPosition+20);
    $("#main-play-area").append(laser);
    CONFIG.SOUNDS.SHOOT.play();
  }
}

function createLaserElement(xPosition, yPosition) {
  let newLaser = document.createElement('img');
  newLaser.src = './assets/imgs/fire.png';
  newLaser.classList.add('fire');
  newLaser.id = 'fire';
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition}px`;
  return newLaser;
}

function moveLaser() {
  const firePosition = parseInt($("#fire").css("left"));
  if(firePosition >= 900) {
    $("#fire").remove();
    game.canFire = true;
  } else {
    $("#fire").css("left", firePosition + 10);
  }
}

function createEnemy() {
  if(!game.canCreateEnemy){
    return;
  }
  game.canCreateEnemy = false;
  let newAlien = document.createElement('img');
  const aliensImg = ['./assets/imgs/monster-1.png', './assets/imgs/monster-2.png', './assets/imgs/monster-3.png'];
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  const yPosition = parseInt(Math.random() * CONFIG.ENEMY.BOTTOM);
  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transition');
  newAlien.style.left = '800px';
  newAlien.style.top = `${yPosition}px`;
  $("#main-play-area").append(newAlien);

  let expireTime = window.setInterval(createNewEnemy, 5000);
  function createNewEnemy() {
    game.canCreateEnemy = true;
    window.clearInterval(expireTime);
    expireTime = false;
  }
}

function moveEnemies() {
  $(".alien").not(".explosion").each(function () {
    const xPosition = parseInt(this.style.left) - 5;
    this.style.left = `${xPosition}px`;
    if(xPosition <= 0){
      game.gameover = true;
    }
  });
}

function checkCollisions() {
  $(".alien").each(function () {
    $("#fire").collision($(this))
    const collision = $("#fire").collision($(this));
    if(collision.length > 0) {
      game.score += CONFIG.ENEMY.SCORE;
      $(".explosion").remove();
      $(this).removeClass( "alien alien-transition");
      $(this).addClass( "explosion" );
      $(this).attr("src", "./assets/imgs/explosion.png");
    }
  });
}

function updateScore() {
  $("#score").html(
    "<h2> Pontos: " +
      game.score +
      "</h2>"
  );
}