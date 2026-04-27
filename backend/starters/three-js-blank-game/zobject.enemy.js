class Enemy {
  constructor(game, north, east, vertical) {
    this.player = game.player;
    this.scene = game.scene;
    this.enemyObj = new THREE.Group();
    this.enemyBody = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.5, 0.6),
      new THREE.MeshStandardMaterial({ color: ENEMY_COLOR }),
    );
    this.enemyBody.castShadow = true;
    
    this.enemyHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshStandardMaterial({ color: ENEMY_COLOR }),
    );

    this.enemyHead.castShadow = true;
    this.enemyHead.position.y = 1.5;
    this.enemyObj.add(this.enemyBody, this.enemyHead);

    this.enemyObj.position.set(north, vertical, east);

    this.target = this.randomTarget(this.player);
    this.scene.add(this.enemyObj);
  }

  randomTarget(near) {
    return new THREE.Vector3(
      near.position.x + Math.random() * 50 - 25,
      Math.random() * 3,
      near.position.z + Math.random() * 50 - 25
    );
  }

  update() {
    const playerPos = game.player.position.clone();
    if (this.enemyObj.position.distanceTo(playerPos) < 10) {
      this.target.copy(playerPos);
    } else if (this.enemyObj.position.distanceTo(this.target) < 1) {
      this.target = this.randomTarget(game.player);
    }
    
    const dir = this.enemyObj.position
      .clone()
      .sub(this.target)
      .normalize()
      .multiplyScalar(-ENEMY_SPEED);
    this.enemyObj.position.add(dir);
    if (this.enemyObj.position.distanceTo(game.player.position) < 1) {
      game.gameOver("A monster got you!");
    }
  }
}