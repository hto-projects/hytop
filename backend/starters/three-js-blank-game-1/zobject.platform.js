const VERTICAL_TOLERANCE = 0.1; // Adjust as needed for how strict the "standing" requirement is

class Platform {
  constructor(scene, x, y, z, width, height, depth) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.width = width;
      this.height = height;
      this.depth = depth;

      this.ThreeObj = new THREE.Mesh(
        new THREE.BoxGeometry(this.width, this.height, this.depth),
        new THREE.MeshStandardMaterial({ color: PLATFORM_COLOR }),
      );

      this.ThreeObj.position.set(this.x, this.y, this.z);
      this.ThreeObj.receiveShadow = true;
      this.ThreeObj.castShadow = true;
      scene.add(this.ThreeObj);
  }

  get boundingBox() {
    return new THREE.Box3().setFromObject(this.ThreeObj);
  }

  get yTop() {
    return this.boundingBox.max.y - VERTICAL_TOLERANCE;
  }

  intersects(other) {
    const otherBox = new THREE.Box3().setFromObject(other);
    return this.boundingBox.intersectsBox(otherBox);
  }

  intersectsTop(other, prevY) {
    const otherBox = new THREE.Box3().setFromObject(other);
    const platformBox = this.boundingBox;
    const intersects = platformBox.intersectsBox(otherBox);
    if (!intersects) return false;

    // Check if the other object is above the platform and close enough to be considered "standing" on it
    const otherBottomY = otherBox.min.y;
    const platformTopY = platformBox.max.y;
    const inter = otherBottomY <= platformTopY + VERTICAL_TOLERANCE && (prevY > platformTopY || otherBottomY >= platformTopY - VERTICAL_TOLERANCE);
    return inter;
  }
}