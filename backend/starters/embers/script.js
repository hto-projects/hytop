/* eslint-disable */

let emberColor = "orange";
let backgroundColor = "black";
let spinSpeed = .6;
let baseSpeed = .5;
let maxSize = 5;




let embers = []; // array to hold ember objects

function setup() {
  createCanvas(400, 600);
  fill(emberColor);
  noStroke();
}

function draw() {
  background(backgroundColor);
  let t = frameCount / 60; // update time

  // create a random number of embers each frame
  for (let i = 0; i < random(5); i++) {
    embers.push(new ember()); // append ember object
  }

  // loop through embers with a for..of loop
  for (let flake of embers) {
    flake.update(t); // update ember position
    flake.display(); // draw ember
  }
}

// ember class
function ember() {
  // initialize coordinates
  this.posX = 0;
  this.posY = 600 + random(0, 50);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, maxSize);

  // radius of ember spiral
  // chosen so the embers are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = spinSpeed; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size embers fall at slightly different y speeds
    this.posY -= pow(this.size, baseSpeed);

    // delete ember if past end of screen
    if (this.posY < 0) {
      let index = embers.indexOf(this);
      embers.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}
