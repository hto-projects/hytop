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

// Hook up Bass Button
playPauseBassButton.addEventListener("click", playBass);

// Define a function to change the background to a random color filter
let randomBgFilter = function() {
  let currentColor = backgroundFilterDiv.style.backgroundColor;
  let colors = ["red", "orange", "yellow", "cyan", "green", "purple"];
  let randomColor = chooseRandom(colors, currentColor);
  backgroundFilterDiv.style.backgroundColor = randomColor;
}

// Hook up the "Swap Color" button to call the function
colorSwapperButton.addEventListener("click", randomBgFilter);

// Prepare Interval ID - this will keep track of the currently running function
let cycleIntervalId;

// Start the cycle if there is not one currently running
function startCycle() {
  if (!cycleIntervalId) {
    cycleIntervalId = setInterval(randomBgFilter, 250);
  }
}

// Hook up Start Cycle Button
startCycleButton.addEventListener("click", startCycle);

// Stop any currently running cycle
function stopCycle() {
  clearInterval(cycleIntervalId);
  cycleIntervalId = null;
}

// Hook up Stop Cycle Button
stopCycleButton.addEventListener("click", stopCycle);
