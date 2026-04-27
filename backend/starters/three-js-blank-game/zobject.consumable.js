class Consumable {
  constructor(game, north, east, vertical, onConsume, size = 0.2, color = "yellow", shape = "sphere") {
    this.player = game.player;
    this.scene = game.scene;
    this.consumed = false;
    this.onConsume = onConsume;
    let geometry;

    if (shape === "box") {
      geometry = new THREE.BoxGeometry(size, size, size);
    } else if (shape === "torus") {
      geometry = new THREE.TorusGeometry(0.4, 0.15, 8, 16);
    } else {
      geometry = new THREE.SphereGeometry(size, 32, 32);
    }

    this.ThreeObj = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color }),
    );
    this.ThreeObj.castShadow = true;
    this.ThreeObj.receiveShadow = true;
    this.ThreeObj.position.set(north, vertical, east);
    this.scene.add(this.ThreeObj);
  }

  update() {
    const myBoundingBox = new THREE.Box3().setFromObject(this.ThreeObj);
    const playerBoundingBox = new THREE.Box3().setFromObject(this.player.playerObj);
    if (!this.consumed && myBoundingBox.intersectsBox(playerBoundingBox)) {
      this.onConsume();
      this.scene.remove(this.ThreeObj);
      this.consumed = true;
    }
  }
}
