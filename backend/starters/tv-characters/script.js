// Take a cast object from the API, and turn it into an HTML element
function objectToHtml(object) {
  let characterElement = document.createElement("div");
  let name = object.character.name;
  let imageObject = object.character.image ?? object.person.image ?? { medium: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg" };
  let image = imageObject.medium;
  
  characterElement.innerHTML = `
<img src="${image}" />
<h3>${name}</h3>
`;

  return characterElement;
}

// Make the request to the API
async function getCharactersForShow() {
  let characters = [];
  let url = `https://api.tvmaze.com/singlesearch/shows?q=Stranger Things&embed=cast`;
  
  try {
    let response = await fetch(url);

    
    let responseJson = await response.json();
    
    characters = responseJson._embedded.cast;
  } catch (e) {
    alert(e);
  }

  return characters;
}

// Load the character data and turn it into HTML
async function loadCharacters() {
  let container = document.querySelector("#character-container");
  container.innerHTML = "";


  
  let characters = await getCharactersForShow();

  characters.forEach(o => {
    let characterElement = objectToHtml(o);
    container.appendChild(characterElement);
  });
}
