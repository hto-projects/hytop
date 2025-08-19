let metropolis = {
  title: "Metropolis",
  year: 1927,
  image: "https://m.media-amazon.com/images/I/51xSTnAL2BL._AC_UF894,1000_QL80_.jpg"
};

let incredibles = {
  title: "The Incredibles",
  year: "2004",
  image: "https://i.redd.it/fu7381otz0z51.jpg"
}

function displayInfo(movieObject) {
  let displayContainer = document.querySelector("#film-info-display");
  
  displayContainer.innerHTML = `
    <img src="${movieObject.pic}">
    <p>${movieObject.title} (${movieObject.year})</p>
  `;
}

function displayMetro() {
  displayInfo(metropolis);
}

function displayIncredible() {
  displayInfo(incredibles);
}
