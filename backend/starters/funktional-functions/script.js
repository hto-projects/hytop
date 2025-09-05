// Create an audio object - some bass from Bootsy Collins
let bassAudio = new Audio("https://github.com/hytechclub/web-103/raw/main/Assets/bass.mp3");

// Play the audio
function playBass() {
  if (bassAudio.paused) {
    bassAudio.play();
  } else {
    bassAudio.pause();
  }
}

// Helper Function - choose random value from an array
function chooseRandom(values, exclude) {
  // Remove certain value
  let indexToRemove = values.indexOf(exclude);
  if (indexToRemove !== -1) {
    values.splice(indexToRemove, 1);
  }

  // Get random index 
  let randomIndex = Math.floor(Math.random() * values.length);

  // Return random value
  return values[randomIndex];
}

// Grab HTML Elements
let playPauseBassButton = document.querySelector("#play-pause-bass");
let colorSwapperButton = document.querySelector("#color-swapper");
let startCycleButton = document.querySelector("#start-cycle");
let stopCycleButton = document.querySelector("#stop-cycle");
let backgroundFilterDiv = document.querySelector("div.filter");
