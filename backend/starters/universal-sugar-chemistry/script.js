let picture = document.querySelector("img");

picture.addEventListener("click", => {
  let clip = new Audio("https://github.com/hytechclub/web-103/raw/main/Assets/imwoody.mp3");
  clip.play();
  alert("I'm Woody! Howdy, howdy, howdy.");
});
