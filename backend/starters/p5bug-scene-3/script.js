const STAR_SIZE_MAX = 2; 
const NUM_STARS  50;

function setup() {
  createCanvas(300, 200);
  background("black");
  noStroke();
  fill("lightgoldenrodyellow");
  ellipse(200, 100, 75, 75);

  fill("black");
  ellipse(190, 95, 75, 75);
  
  fill("darkblue");
  rect(-1, 175, 301, 25);

  for (let i = 0; i < NUM_STARS; i++) {
    let x = random(width);
    let y = random(height-25);
    fill("white");
    const starSize = 1 + random(STAR_SIZE_MAX);
    ellipse(x, y, starSize, starSize);
  }
}
