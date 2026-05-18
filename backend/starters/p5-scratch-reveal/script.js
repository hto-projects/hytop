// constants
const COVER_COLOR = "red";
const IMG_URL = "https://m.media-amazon.com/images/I/71cRwW1zBOL._AC_UF894,1000_QL80_DpWeblab_.jpg";
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const BRUSH_RADIUS = 100;

// variables
let coverLayer;
let picture;
let maskedPositions = [];

// setup two layers: one for the picture and one for the cover layer
async function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  picture = await loadImage(IMG_URL);
  
  coverLayer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
}

// draw picture and cover layer
function draw() {
  image(picture, 0, 0, width, height);
  coverLayer.background(COVER_COLOR);
  
  // turn on erasing
  coverLayer.erase();

  // for each masked position, erase a circle with the radius
  for (let i = 0; i < maskedPositions.length; i++) {
    coverLayer.circle(maskedPositions[i].x, maskedPositions[i].y, BRUSH_RADIUS);
  }

  // turn off erasing
  coverLayer.noErase();
  
  // draw the cover layer on top of the picture with properly erased areas
  image(coverLayer, 0, 0);
}

// track each pressed mouse position
function onMouse(x, y) {
  maskedPositions.push({ x, y });
}

// when mouse is pressed, add current position to erased regions
function mousePressed() {
  onMouse(mouseX, mouseY);
}

// when mouse is dragged, add current position to erased regions
function mouseDragged() {
  onMouse(mouseX, mouseY);
}
