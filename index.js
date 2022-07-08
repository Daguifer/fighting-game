//Guardo el elemento canvas en una variable
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//Asigno el tamaño del canvas
canvas.width = 1024;
canvas.height = 576;

//Relleno el canvas, desde las posiciones 0 a la longitud del mismo
c.fillRect(0, 0, canvas.width, canvas.height);

//Creo la gravedad del canvas
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 610,
    y: 160,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.5,
  framesMax: 6
});

//Creo al jugador
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: 0,
    y: 0,
  },
});

//Creo al enemigo
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: -50,
    y: 0,
  },

  color: "blue",
});

console.log(player);

//Afino la detección de teclas
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

decreaseTimer();

//Creo la función para animar los Sprites
function animate() {
  window.requestAnimationFrame(animate);
  //Limpio el canvas para que se dibujen correctamente
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Implementamos el fondo
  background.update()
  shop.update()

  //Utilizo update en vez de draw para que vaya redibujandose
  player.update();
  enemy.update();

  //Para que no siga caminando solo
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Checkeo si las teclas están pulsadas
  //Update 1: nos quedamos con la ultima tecla pulsada
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //Movimiento del Enemigo/J2
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //Detección de colisión
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //Acabar la partida en base a la vida de los jugadores

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

//Voy a implementar el movimiento con event listeners
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;

    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;

    case "w":
      player.velocity.y = -20;
      break;

    case " ":
      player.attack();
      break;

    //Teclas del Enemigo/J2
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;

    case "ArrowUp":
      enemy.velocity.y = -20;
      break;

    case "ArrowDown":
      enemy.attack();
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    //Teclas del Enemigo/J2
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
  }
});
