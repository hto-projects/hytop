let songs = ["Samskeyti (Acoustic)|Sigur Rós", "Baba O'Riley|The Who", "Fast Car|Tracy Chapman", "Hey Ya!|Outkast", "Stand by Me|Ben E. King", "Us|Regina Spektor"];

function fillPlaylist() {
  let button = document.querySelector("#fill-button");
  button.style.display = "none";

  let playlistContainer = document.querySelector("#playlist");

  for (let i = 0; i < songs.length; i++) {
    let currentSong = songs[i];
    let [title, artist] = currentSong.split("|");

    let songRow = document.createElement("div");
    songRow.classList.add("row");

    if (i % 2 == 0) {
      songRow.style.background = "#303933";
    } else {
      songRow.style.background = "#27302b";
    }

    let playBtn = document.createElement("div");
    playBtn.classList.add("col-sm-1");
    playBtn.classList.add("play");
    playBtn.textContent = "ᐅ";

    playBtn.onclick = function () {
      alert(title);
    }

    let trackNum = document.createElement("div");
    trackNum.classList.add("col-sm-1");
    trackNum.textContent = i+1;

    let trackTitle = document.createElement("div");
    trackTitle.classList.add("col-sm-5");
    trackTitle.classList.add("song");
    trackTitle.textContent = title;

    let trackArtist = document.createElement("div");
    trackArtist.classList.add("col-sm-5");
    trackArtist.textContent = artist;

    songRow.appendChild(playBtn);
    songRow.appendChild(trackNum);
    songRow.appendChild(trackTitle);
    songRow.appendChild(trackArtist);

    playlistContainer.appendChild(songRow);
  }
}
