class Game {
  constructor(htmlDoc) {
    this.document = htmlDoc;
    this.cameraHeight = 3.2;
    this.yaw = 0;
    this.scene = new THREE.Scene();
    this.hudMessage = "";
    this.keysPressed = {};
    this.frameCount = 0;
    this.startTime = Date.now();
    this.gameTimer = TIME_LIMIT;
    this.consumables = [];
    this.enemies = [];
    this.gameOverHit = false;
    this.winHit = false;

    this.world = new World(this.scene, SKY_COLOR, SUN_COLOR, SUN_BRIGHTNESS / 10);

    this.camera = new THREE.PerspectiveCamera(
      85,
      innerWidth / innerHeight,
      0.1,
      2000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.document.body.appendChild(this.renderer.domElement);

    this.player = new Player(this.scene, PLAYER_COLOR);

    this.addCoins();
    this.addEnemies();
    this.addWin();
  }

  addCoins() {
    for (let i = 0; i < COIN_LOCATIONS.length; i++) {
      const coin = new Coin(
        this,
        COIN_LOCATIONS[i].north,
        COIN_LOCATIONS[i].east,
        COIN_LOCATIONS[i].vertical
      );
      this.consumables.push(coin);
    }
  }

  addEnemies() {
    for (let i = 0; i < ENEMY_LOCATIONS.length; i++) {
      const enemy = new Enemy(
        this,
        ENEMY_LOCATIONS[i].north,
        ENEMY_LOCATIONS[i].east,
        ENEMY_LOCATIONS[i].vertical
      );
      this.enemies.push(enemy);
    }
  }

  addWin() {
    const winBox = new Consumable(
      this,
      20,
      -20,
      1,
      () => {
        this.winGame();
      },
      2,
      WIN_BOX_COLOR,
      "box"
    );
    this.consumables.push(winBox);
  }

  addConsumable(northPos = 5, eastPos = 5, verticalPos = 1, onConsume = () => { console.log("CONSUMED"); }, size = 1, color = "white", shape = "sphere") {
    const consumable = new Consumable(this, northPos, eastPos, verticalPos, onConsume, size / 5, color, shape);
    this.consumables.push(consumable);
  }

  winGame() {
    this.finalScore = Number(this.player.score) + Number(this.gameTimer);
    this.document.querySelector(".final-score").innerText = this.finalScore;
    this.winHit = true;
  }

  gameOver(gameOverMessage) {
    this.document.querySelector("#gameovermessage").innerText = gameOverMessage;
    this.gameOverHit = true;
  }

  update() {
    this.document.querySelector("#gameover").style.display = this.gameOverHit
      ? "flex"
      : "none";
    this.document.querySelector("#win").style.display = this.winHit
      ? "flex"
      : "none";

    if (this.gameOverHit || this.winHit) {
      return;
    }

    this.frameCount++;
    const preUpdatePlayerY = this.player.position.y;

    this.player.update(this);

    // CAMERA CONTROLS (arrow keys)
    if (this.keysPressed["arrowleft"]) this.yaw += 0.05;
    if (this.keysPressed["arrowright"]) this.yaw -= 0.05;
    if (this.keysPressed["arrowup"]) this.cameraHeight -= 0.1;
    if (this.keysPressed["arrowdown"]) this.cameraHeight += 0.1;
    this.cameraHeight = Math.max(1, Math.min(5, this.cameraHeight));

    const forward = new THREE.Vector3(
      Math.sin(this.yaw),
      0,
      Math.cos(this.yaw)
    );

    const camOffset = forward
      .clone()
      .multiplyScalar(-5)
      .add(new THREE.Vector3(0, this.cameraHeight, 0));
    this.camera.position.copy(this.player.playerObj.position).add(camOffset);
    this.camera.lookAt(this.player.playerObj.position);

    if (this.player.playerObj.position.x - 2 < -GROUND_SIZE / 2)
      this.player.playerObj.position.x = -GROUND_SIZE / 2 + 2;
    if (this.player.playerObj.position.x + 2 > GROUND_SIZE / 2)
      this.player.playerObj.position.x = GROUND_SIZE / 2 - 2;
    if (this.player.playerObj.position.z - 2 < -GROUND_SIZE / 2)
      this.player.playerObj.position.z = -GROUND_SIZE / 2 + 2;
    if (this.player.playerObj.position.z + 2 > GROUND_SIZE / 2)
      this.player.playerObj.position.z = GROUND_SIZE / 2 - 2;

    for (let i = 0; i < this.world.platforms.length; i++) {
      const platform = this.world.platforms[i];

      if (
        this.player.velY < 0 &&
        platform.intersectsTop(this.player.playerObj, preUpdatePlayerY)
      ) {
        this.player.position.y = platform.yTop;
        this.player.velY = 0;
        this.player.onGround = true;
      }
    }

    this.consumables.forEach((p, i) => {
      p.update();
    });

    this.enemies.forEach((e) => {
      e.update();
    });

    this.gameTimer =
      10 * Number(TIME_LIMIT - (Date.now() - this.startTime) / 1000).toFixed(1);

    if (this.gameTimer <= 0) {
      this.gameOver("Time ran out!");
    }

    this.renderer.render(this.scene, this.camera);
    this.document.querySelectorAll(".score").forEach((el) => {
      el.innerHTML = this.player.score;
    });
    this.document.querySelectorAll(".time").forEach((el) => {
      el.innerHTML = this.gameTimer;
    });

    this.hudMessage = `player position:<br>north: ${this.player.position.x.toFixed(1)}<br>east: ${this.player.position.z.toFixed(1)}<br>vertical: ${this.player.position.y.toFixed(1)}`;

    this.document.getElementById("msg").innerHTML = this.hudMessage;
  }
}
