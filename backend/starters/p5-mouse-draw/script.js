let img;

async function setup() {
  noCursor();
  createCanvas(500, 500);
  background(255, 255, 0);
  img = await loadImage("https://cdn.creazilla.com/cliparts/19265/cartoon-brown-mouse-clipart-xl.png");
  imageMode(CENTER);
}

function draw() {
  if (mouseIsPressed) {
    image(img, mouseX, mouseY, 100, 100);
  }
}
