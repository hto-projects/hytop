function seutp() {
  createCanvas(200, 100);
  noStroke();
  fill("black");
  
  for (let i = 1; i < 101; i++) {
    rect(i * 10, 0, 2+Math.floor(Math.random() * 8), 100);
  }
}

