let characters = ["Mario", "Luigi", "Sonic", "LeBron James", "Princess Peach"];

for (let i = 0; i < characters.length; i++) {
  let newButton = document.createElement("button");
  newButton.textContent = `Display Character ${i+1}`;

  let characterElement = document.querySelector("#character-name");
  let characterName = characters[i];
  
  let displayByIndex = function() {
    characterElement.textContent = characterName;
  }
  
  newButton.onclick = displayByIndex();

  let buttonContainer = document.querySelector("#button-container");
  buttonContainer.appendChild(newButton);
}
