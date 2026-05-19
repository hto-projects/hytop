function setup() {
  createCanvas(400 400);
  strokeWeight(4);
}

function draw() {
  background(125, 255, 125);

  fill(255, 192, 203);

  // legs
  rect(125, 250, 25, 125);
  rect(250, 250, 25, 125);
  fill(0);
  rect(125, 350, 25, 25);
  rect(250, 350, 25, 25);

  fill(255, 192, 203);

  // body
  ellipse(200, 200, 250, 200);

  // ears
  ellipse(165, 150, 25, 50);
  ellipse(235, 150, 25, 50);

  // face
  circle(200, 200, 125);

  // left eye
  fill(255);
  circle(175, 170, 25);
  fill(0);
  circle(175, 170, 10);

  // right eye
  fill(255);
  circle(225, 170, 25);
  fill(0);
  circle(225, 170, 10);

  // nose
  fill(255, 192, 203);
  ellipse(200, 210, 50, 25);
  fill(0);
  circle(190, 210, 10);
  circle(210, 210, 10);

  // mouth
  noFill();
  arc(200, 225, 50, 50, PI * .25, PI * .75);
}

// credit: https://happycoding.io/tutorials/p5js/calling-functions/pig
