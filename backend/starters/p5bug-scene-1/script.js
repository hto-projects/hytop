function setup() {
  createCanvas(300, 200);
}

function draw() {
  background(cyan);
  stroke("black");
  fill("yellow");
  ellipse(300, 0, 50, 50);
  
  fill("lime");
  rect(-1, 175, 301, 25);

  drawTree(20, 170, 80);
  drawTree(90, 177, 70);
  drawTree(120, 177, 70);
  drawTree(250, 163, 59);
  drawTree(194, 172, 90);
}
