let cloudY;
let cloudSize;
let cloudSpeed = .5;

function setup() {
  createCanvas(300, 200);
  cloudY = random(0, 100);
  cloudSize = random(20, 50);
}

function draw( {
  background("black");
  noStroke();
  fill("lightgoldenrodyellow");
  ellipse(100, 50, 40, 40);
  
  fill("darkblue");
  rect(-1, 175, 301, 25);

  drawCloud(-cloudSize + ((frameCount*cloudSpeed) % (200+cloudSize*4)), cloudY, cloudSize);
}
