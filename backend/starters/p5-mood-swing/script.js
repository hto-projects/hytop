let isMad = false;

function setup() {
  createCanvas(300, 300);
  textAlign(CENTER, CENTER);
  textSize(144);
}

function draw() {
  if (isMad) {
    background(random(64, 255), 0, 0);
    text("😠", width / 2 + random(-10, 10), height / 2 + random(-10, 10));
  } else {
    background(64);
    text("🙂", width / 2, height / 2);
  }
}

function mousePressed() {
  isMad = !isMad;
}
