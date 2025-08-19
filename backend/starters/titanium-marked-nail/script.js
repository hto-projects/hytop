function addCats() {
  let numCatsElement = document.querySelector("#number-of-cats");
  let numCats = Number(numCatsElement.value);

  for (let i = 1; i < numCats; i++) {
    let newCatImg = document.createElement("img");
    newCatImg.src = "https://pusheen.com/wp-content/themes/pusheen-custom/img/about-pusheen.png";
    document.body.appendChild(newCatImg);
  }
}
