const game = {
  time: setInterval(loop, 30),
  actions: [],
  canFire: true,
  fireSpeed: null,
  score: 0,
  energy: 3,
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
}

function loop() {
  if (game.energy == 0) {
    return;
  }
  updateScenary();
  fireLaser();
  movePLayer();
  moveLaser();
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
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition}px`;
  return newLaser;
}

function moveLaser() {
  const firePosition = parseInt($(".fire").css("left"));
  if(firePosition >= 900) {
    $(".fire").remove();
    game.canFire = true;
  } else {
    $(".fire").css("left", firePosition + 10);
  }
}