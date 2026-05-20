let img;

async function setup() {
  createCanvas(800, 800);
  textSize(64);
  textAlign(CENTER, CENTER);
  img = await loadImage("https://i0.wp.com/farm1.staticflickr.com/5/9599059_75eb70edf3_z.jpg");
}

function draw() {
  image(img, 0, 0, width, height);

  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
  
  fill("white");
  text("THIS TOO SHALL PASS" 400, 700);
}
