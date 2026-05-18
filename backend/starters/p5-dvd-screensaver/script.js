// constants
const BACKGROUND_COLOR = "black";
const IMG_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dvd_logo.svg/1280px-Dvd_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail";
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const IMG_START_X = 100;
const IMG_START_Y = 100;
const IMG_X_SPEED = 3;
const IMG_Y_SPEED = 2;
const IMG_WIDTH = 200;
const IMG_HEIGHT = 100;

// variables
let picture;
let imgX = IMG_START_X;
let imgY = IMG_START_Y;
let imgHeadingRight = true;
let imgHeadingDown = true;

async function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  picture = await loadImage(IMG_URL);
  
}

// draw picture and cover layer
function draw() {
  background(BACKGROUND_COLOR);
  image(picture, imgX, imgY, IMG_WIDTH, IMG_HEIGHT);

  // update horizontal (x) position 
  if (imgHeadingRight) {
    imgX = imgX + IMG_X_SPEED;

    let imgRightEdge = imgX + IMG_WIDTH;
    if (imgRightEdge >= width) {
      imgHeadingRight = false;
    }
  } else {
    imgX = imgX - IMG_X_SPEED;

    let imgLeftEdge = imgX;
    if (imgLeftEdge <= 0) {
      imgHeadingRight = true;
    }
  }

  // update vertical (y) position
  if (imgHeadingDown) {
    imgY = imgY + IMG_Y_SPEED;

    let imgBottomEdge = imgY + IMG_HEIGHT;
    if (imgBottomEdge >= height) {
      imgHeadingDown = false;
    }
  } else {
    imgY = imgY - IMG_Y_SPEED;

    let imgTopEdge = imgY;
    if (imgTopEdge <= 0) {
      imgHeadingDown = true;
    }
  }
}
