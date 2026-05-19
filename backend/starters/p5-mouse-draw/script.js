let img;

async function setup() {
  let canvas = createCanvas(500, 500);
  canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());

  background(255, 255, 0);
  img = await loadImage("https://cdn.creazilla.com/cliparts/19265/cartoon-brown-mouse-clipart-xl.png");
  imageMode(CENTER);
}

function draw() {
  if (mouseButton.left) {
    image(img, mouseX, mouseY, 100, 100);
  }
}
