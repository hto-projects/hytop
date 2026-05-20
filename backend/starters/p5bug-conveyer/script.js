const IMG_URL = https://static.wikia.nocookie.net/the-soda/images/0/03/Dr_Pepper_Berries_and_Cream_Cans.png/revision/latest?cb=20220212052931";

let picture;

async function setup() {
  createCanvas(500, 250);
  picture = await loadImage(IMG_URL);
}

function draw() {
  background("black");
  image(picture, (frameCount % 700)-200, 10, 200, 230);
}
