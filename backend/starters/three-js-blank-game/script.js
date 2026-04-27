let game = new Game(document);



document.addEventListener("keydown", (e) => (game.keysPressed[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (game.keysPressed[e.key.toLowerCase()] = false));

function animate() {
  requestAnimationFrame(animate);
  game.update();

  if (game.gameOverHit || game.winHit) {
    if (game.keysPressed["enter"]) {
      window.location.reload();
    }
  }
}

animate();

window.addEventListener("resize", () => {
  game.camera.aspect = innerWidth / innerHeight;
  game.camera.updateProjectionMatrix();
  game.renderer.setSize(innerWidth, innerHeight);
});
