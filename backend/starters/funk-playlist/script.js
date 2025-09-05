// The array of songs
let songs = [
  {
    title: "Jungle Boogie",
    artist: "Kool & The Gang",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/jungleboogie.mp3"
  },
  {
    title: "After the Storm",
    artist: "Kali Uchis",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/afterthestorm.mp3"
  },
  {
    title: "Back Pocket",
    artist: "Vulfpeck",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/backpocket.mp3"
  },
  {
    title: "Cissy Strut",
    artist: "The Meters",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/cissystrut.mp3"
  },
  {
    title: "Sauna",
    artist: "Vulfpeck",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/sauna.mp3"
  },
  {
    title: "Thank You",
    artist: "Sly & The Family Stone",
    audio: "https://github.com/hytechclub/web-103/raw/main/Assets/thankyou.mp3"
  }
];

// Variable to keep track of which track is currently playing
let currentlyPlaying = -1;

// Grabbing elements from the HTML
let playlistContainer = document.querySelector("#playlist");
let audioElement = document.querySelector("audio");

// Array to be filled with the play buttons for each track
let playBtns = [];

// Loop through every song in the array
for (let i = 0; i < songs.length; i++) {
  // Grab the title, artist, and audio URL for the current song
  let {title, artist, audio} = songs[i];

  // Create a new row foe this song
  let songRow = document.createElement("div");
  songRow.classList.add("row");

  // Alternate between two background colors for the row
  if (i % 2 == 0) {
    songRow.style.background = "#600c48";
  } else {
    songRow.style.background = "#560c48";
  }

  // Create the play button for this song
  let playBtn = document.createElement("div");
  playBtn.classList.add("col-sm-1");
  playBtn.classList.add("play");
  playBtn.textContent = "ᐅ";

  // Hook up the click handler for each play button
  playBtn.onclick = function () {
    playOrStop(i);
  }

  // Add the current play button to the array
  playBtns.push(playBtn);

  // Create the track number element based on current list position
  let trackNum = document.createElement("div");
  trackNum.classList.add("col-sm-1");
  trackNum.textContent = i+1;

  // Create the track title element based on object
  let trackTitle = document.createElement("div");
  trackTitle.classList.add("col-sm-5");
  trackTitle.classList.add("song");
  trackTitle.textContent = title;

  // Create the track artist element based on object
  let trackArtist = document.createElement("div");
  trackArtist.classList.add("col-sm-5");
  trackArtist.textContent = artist;

  // Add all elements as children of the row element
  songRow.appendChild(playBtn);
  songRow.appendChild(trackNum);
  songRow.appendChild(trackTitle);
  songRow.appendChild(trackArtist);

  // Add the row to the container element
  playlistContainer.appendChild(songRow);
}

// A function that sets all play buttons to revert to the play symbol
function clearAllPlaying() {
  // Loop through all buttons
  for (let i = 0; i < playBtns.length; i++) {
    // Set the text content of each button
    playBtns[i].textContent = "ᐅ";
  }
}

// A function to either play or stop a song at the current index
function playOrStop(songsIndex) {
  // Grab the current play button
  let currentPlayButton = playBtns[songsIndex];

  // If this song is already playing...
  if (currentlyPlaying === songsIndex) {
    // Set nothing to be currently playing
    currentlyPlaying = -1;
    audioElement.pause();
    currentPlayButton.textContent = "ᐅ";
  } else {
    // Set the new song to be currently playing
    currentlyPlaying = songsIndex;
    audioElement.src = songs[songsIndex].audio;
    audioElement.play();

    clearAllPlaying();
    currentPlayButton.textContent = "⃞";
  }
}

// Function to handle what happens when one song ends
let songEndHandler = function() {
  // Set the current play button to not be playing
  let currentPlayButton = playBtns[currentlyPlaying];
  currentPlayButton.textContent = "ᐅ";

  // If this is not the last song in the list...
  if (currentlyPlaying !== songs.length) {
    // Play the next song!
    playOrStop(currentlyPlaying+1);
  }
}

// Add a listener to handle the end of songs
audioElement.addEventListener("ended", songEndHandler);
