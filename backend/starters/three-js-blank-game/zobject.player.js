class Player {
  constructor(scene, playerColor) {
    this.scene = scene;
    this.score = 0;
    this.health = 100;
    this.onGround = true;
    this.vel = new THREE.Vector3();
    this.velY = 0;
    
    this.playerObj = new THREE.Group();
    const playerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.5),
      new THREE.MeshStandardMaterial({ color: playerColor }),
    );
    playerBody.position.y = 1.4;
    playerBody.castShadow = true;
    this.playerObj.add(playerBody);
    this.playerBody = playerBody;

    const playerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35),
      new THREE.MeshStandardMaterial({ color: playerColor }),
    );
    playerHead.position.y = 2.2;
    playerHead.castShadow = true;
    this.playerObj.add(playerHead);
    this.playerHead = playerHead;

    const playerLeg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.8, 0.3),
      new THREE.MeshStandardMaterial({ color: playerColor }),
    );
    playerLeg1.position.set(-0.25, .5, 0);
    playerLeg1.castShadow = true;
    this.playerObj.add(playerLeg1);
    this.playerLeg1 = playerLeg1;

    const playerLeg2 = playerLeg1.clone();
    playerLeg2.position.x = 0.25;
    this.playerObj.add(playerLeg2);
    this.playerLeg2 = playerLeg2;

    const playerArm1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.7, 0.2),
      new THREE.MeshStandardMaterial({ color: playerColor }),
    );
    playerArm1.position.set(-0.5, 1.5, 0);
    playerArm1.castShadow = true;
    this.playerObj.add(playerArm1);
    this.playerArm1 = playerArm1;

    const playerArm2 = playerArm1.clone();
    playerArm2.position.x = 0.5;
    this.playerObj.add(playerArm2);
    this.playerArm2 = playerArm2;

    this.playerObj.castShadow = true;
    this.scene.add(this.playerObj);
  }

  runAnimation() {
    this.playerLeg1.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
    this.playerLeg2.rotation.x = Math.sin(Date.now() * 0.01 + Math.PI) * 0.5;
    this.playerArm1.rotation.x = Math.sin(Date.now() * 0.01 + Math.PI);
    this.playerArm2.rotation.x = Math.sin(Date.now() * 0.01);
  }

  stopAnimation() {
    this.playerLeg1.rotation.x = this.playerLeg2.rotation.x = 0;
    this.playerArm1.rotation.x = this.playerArm2.rotation.x = 0;
  }

  get position() {
    return this.playerObj.position;
  }

  update(game) {
    // player faces yaw direction
    this.playerObj.rotation.y = game.yaw;

    const forward = new THREE.Vector3(Math.sin(game.yaw), 0, Math.cos(game.yaw));
    const keys = game.keysPressed;
    let speed = PLAYER_SPEED / 5;
    if (keys["w"]) {
      const nextPos = game.player.position.clone().add(forward.clone().multiplyScalar(speed));
      game.player.position.copy(nextPos);
      if (this.onGround) {
        this.runAnimation();
      }
    } else if (keys["s"]) {
      const nextPos = game.player.position.clone().sub(forward.clone().multiplyScalar(speed));
      game.player.position.copy(nextPos);
      if (this.onGround) {
        this.runAnimation();
      }
    } else {
      this.stopAnimation();
    }

    if (keys[" "] && (ALLOW_REJUMP || this.onGround)) {
      this.velY = JUMP_SPEED;
      this.onGround = false;
    }

    this.velY -= GRAVITY;
    this.position.y += this.velY;

    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velY = 0;
      this.onGround = true;
    }
  }
}
