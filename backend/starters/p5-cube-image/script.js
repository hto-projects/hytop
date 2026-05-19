const CANVAS_WIDTH = 710;
const CANVAS_HEIGHT = 400;
const BOX_IMAGE_URL = "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250";
const BACKGROUND_IMAGE_URL = "https://64.media.tumblr.com/2df67fe7bdbba84c88cdbbdf84fd2743/tumblr_nqgvxz92HC1s85u2fo1_500.gif";
const BOX_SIZE = 100;
const BOX_ROTATION_SPEED = 0.1;

let img;
let skyImg;
let theta = 0;

async function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);

  img = await loadImage(BOX_IMAGE_URL);
  skyImg = await loadImage(BACKGROUND_IMAGE_URL);
}

function draw() {
  imageMode(CENTER);
  image(skyImg, 0, 0, width, height);
  translate(0, 0, 100);
  push();
  rotateZ(theta * BOX_ROTATION_SPEED);
  rotateX(theta * BOX_ROTATION_SPEED);
  rotateY(theta * BOX_ROTATION_SPEED);
  texture(img);
  box(BOX_SIZE, BOX_SIZE, BOX_SIZE);
  pop();
  theta += 0.05;
}
