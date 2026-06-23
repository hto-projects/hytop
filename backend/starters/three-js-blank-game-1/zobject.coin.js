class Coin extends Consumable {
  constructor(game, north, east, vertical) {
    const onConsume = () => {
      game.player.score += COIN_VALUE;
    };

    super(game, north, east, vertical, onConsume, 0.2, COIN_COLOR, "torus");
  }

  update() {
    super.update();
    this.ThreeObj.rotation.y += (COIN_SPIN / 20);
  }
}
