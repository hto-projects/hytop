// These are the CSS variables that will update the colors for the whole page (in order)
let colorCustomProps = [
  "--main-bg-color",
  "--main-text-color",
  "--secondary-bg-color",
  "--secondary-text-color",
  "--accent-one",
  "--accent-two"
];

// Choose a random item from a list
function chooseRandomFromList(list) {
  return list[Math.floor(Math.random()*list.length)];
}

// Choose a random seed color for the input
function randomizeSeedColor() {
  let seedColorInput = document.querySelector("#seed-color");
  seedColorInput.value = `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

// Choose a random scheme type for the select
function randomizeSchemeType() {
  let schemeTypeInput = document.querySelector("#scheme-type");
  let options = schemeTypeInput.querySelectorAll("option");
  let chosenOption = chooseRandomFromList(options);
  schemeTypeInput.value = chosenOption.value;
}

// Set a new scheme based on the main, secondary, and accent colors
function setNewScheme(mainColor, secondaryColor, accent1, accent2) {
  let root = document.querySelector(':root');
  let colorsInOrder = [
    mainColor.hex.value,
    mainColor.contrast.value,
    secondaryColor.hex.value,
    secondaryColor.contrast.value,
    accent1.hex.value,
    accent2.hex.value
  ];
  
  for (let i = 0; i < colorCustomProps.length; i++) {
    root.style.setProperty(colorCustomProps[i], colorsInOrder[i]);
  }
}

// Grab a new scheme from the API
async function newScheme() {
  let seedColorInput = document.querySelector("#seed-color");
  let hex = seedColorInput.value.replace("#", "");

  
  
  let url = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=quad&count=4`;

  let responseJson;

  try {
    let response = await fetch(url);
    responseJson = await response.json();
  } catch (e) {
    alert(e);
  }

  let colors = responseJson.colors;

  let mainColor = colors[3];
  let secondaryColor = colors[0];
  let accent1 = colors[1];
  let accent2 = colors[2];

  setNewScheme(mainColor, secondaryColor, accent1, accent2);
}

// Randomize the inputs and set the new scheme
async function randomize() {
  randomizeSeedColor();
  
  await newScheme();
}
