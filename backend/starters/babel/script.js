function getRandomWholeNumber(max) {
  let randomDecimal = Math.random();
  let randomDecimalRange = randomDecimal * max;
  let randomWhole = Math.ceil(randomDecimalRange);

  return randomWhole;
}

function getRandomColor() {
  let randomNumber = getRandomWholeNumber(3);
  let color = "";

  if (randomNumber === 1) {
    color = "yellow";
  } else if (randomNumber === 2) {
    color = "red";
  } else if (randomNumber === 3) {
    color = "blue";
  }

  return color;
}

function generateImage() {
  let container = document.querySelector("#container");
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "1fr 1fr";
  container.style.width = "200px";
  container.style.height = "200px";

  let newCell1 = document.createElement("div");
  newCell1.style.width = "100px";
  newCell1.style.height = "100px";
  newCell1.style.background = getRandomColor();
  container.appendChild(newCell1);

  let newCell2 = document.createElement("div");
  newCell2.style.width = "100px";
  newCell2.style.height = "100px";
  newCell2.style.background = getRandomColor();
  container.appendChild(newCell2);

  let newCell3 = document.createElement("div");
  newCell3.style.width = "100px";
  newCell3.style.height = "100px";
  newCell3.style.background = getRandomColor();
  container.appendChild(newCell3);

  let newCell4 = document.createElement("div");
  newCell4.style.width = "100px";
  newCell4.style.height = "100px";
  newCell4.style.background = getRandomColor();
  container.appendChild(newCell4);
}
