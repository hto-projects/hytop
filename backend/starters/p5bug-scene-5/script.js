lert snowflakes = [];

function setup() {
  createCanvas(300, 200);

  for (let i = 0; i < 100; i++) {
    snowflakes.push({
      x: random(-20, width),
      y: random(height),
      size: random(2, 5),
      speed: 1 + Math.random()
    });
  }
}

function draw() {
  fill("black");
  stroke("black");
  rect(1, 1, width-2, height-2);

  fill("gray");
  triangle(0, 175, 120, 50, 240, 175);

  fill("darkgray");
  triangle(120, 175, 210, 100, 300, 175);

  noStroke();
  fill("white");
  for (let i = 0; i < snowflakes.length; i++) {
    ellipse(snowflakes[i].x, snowflakes[i].y, snowflakes[i].size, snowflakes[i].size);
    snowflakes[i].y += snowflakes[i].speed;
    snowflakes[i].x += .2; // Add a slight horizontal movement
    
    if (snowflakes[i].y > height) {
      snowflakes[i].y = 0;
      snowflakes[i].x = random(width);
    }
  }

  fill("white");
  rect(1, 175, 298, 24);

  noFill();
  
  stroke("black");
  rect(1, 1, width-2, height-2);
}
