// The data array containing mascot objects
let mascots = [
  {
    name: "Tony the Tiger",
    cereal: "Frosted Flakes",
    image: "https://i.pinimg.com/736x/51/4b/c8/514bc836deb22942d7266f23b06497a2.jpg",
    type: "animal",
    description: "Tony began to be humanized in the 1970s; he was given an Italian-American nationality and consumers were briefly introduced to more of Tony's family including Mama Tony, Mrs. Tony, and a daughter, Antoinette."
  },
  {
    name: "Snap, Crackle, and Pop",
    cereal: "Rice Krispies",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c6/Snap_Crackle_Pop_%28old_design%29.jpg",
    type: "person",
    description: "Listen to the fairy song of health, the merry chorus sung by Kellogg's Rice Krispies as they merrily snap, crackle and pop in a bowl of milk. If you've never heard food talking, now is your chance."
  },
  {
    name: "Toucan Sam",
    cereal: "Fruit Loops",
    image: "https://upload.wikimedia.org/wikipedia/en/5/57/Toucan_Sam.png",
    type: "animal",
    description: "He exhibits the ability to smell Froot Loops from great distances and invariably locates a concealed bowl of the cereal while intoning, 'Follow your nose! It always knows!'"
  },
  {
    name: "Lucky the Leprechaun",
    cereal: "Lucky Charms",
    image: "https://i.pinimg.com/originals/1a/3f/ae/1a3faeea4aa678cfa38b717f7f2ea3a0.png",
    type: "person",
    description: "The mascot of Lucky Charms, created in 1963, is Lucky the Leprechaun, also known as Sir Charms, and originally called L.C. Leprechaun."
  },
  {
    name: "Cap'n Crunch",
    cereal: "Cap'n Crunch",
    image: "https://i.etsystatic.com/16943745/r/il/04820c/5284069447/il_570xN.5284069447_1wzx.jpg",
    type: "person",
    description: "According to The Wall Street Journal, Horatio Magellan Crunch captains a ship called the Guppy, and was born on Crunch Island, a magical island off the coast of Ohio and in the Sea of Milk."
  }
];

// A function to create an HTML "card" element from a mascot object
let objectToCard = m => {
  // First create a <div>
  let mascotCard = document.createElement("div");

  // Add all the HTML text to show the image, name, cereal, and description
  let cardHTML = `
    <div>
      <img src="${m.image}">
      <h4>${m.name}</h4>
      <p>${m.cereal}</p>
    </div>
    <div>${m.description}</div>
    `

  // Set the inner HTML of the element
  mascotCard.innerHTML = cardHTML;

  // Flip the card when it is clicked (toggle the .flipped selector)
  mascotCard.addEventListener("click", () => {
    mascotCard.classList.toggle("flipped");
  });

  // Return the HTML
  return mascotCard;
};

// A function to display a given array of mascot objects
function displayCards(mascotsArray) {
  // Convert ALL the mascots from the array into HTML Elements
  let mascotsHtml = mascotsArray.map(objectToCard);

  // Get the containing element
  let container = document.querySelector("#mascot-container");
  container.innerHTML = "";

  // Append each child to the container
  mascotsHtml.forEach(m => container.appendChild(m));
}

// Display the full list to start!
displayCards(mascots);

// A function that displays a filtered list
function filterList() {
  // Get what type of mascot to display
  let type = prompt("What type of mascot do you want to see?");

  // filter the list by type
  let filteredList = mascots.filter(m => m.type === type);

  // display the filtered list
  displayCards(filteredList);
}
