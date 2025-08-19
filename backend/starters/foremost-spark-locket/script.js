let items = [
  {
    store: "McDonald's",
    name: "McDouble",
    price: 1,
    picture: "mcdouble.jpg"
  },
  {
    store: "McDonald's",
    name: "McNuggets",
    price: 1,
    picture: "mcnuggets.webp"
  },
  {
    store: "McDonald's",
    name: "McFries",
    price: 1,
    picture: "mcfries.jpg"
  },
  {
    store: "Chipotle",
    name: "Burrito",
    price: 8,
    picture: "chipotleburrito.jpg",
  },
  {
    store: "Chipotle",
    name: "Quesadilla",
    price: 5,
    picture: "chipquesa.jpg",
  },
  {
    store: "Chipotle",
    name: "Bowl",
    price: 9,
    picture: "chipbowl.jpg",
  },
  {
    store: "Taco Bell",
    name: "Beefy 5-Layer Burrito",
    price: .89,
    picture: "beefy5.jpg",
  },
  {
    store: "Taco Bell",
    name: "Cheesy Gordita Crunch",
    price: 1.09,
    picture: "gordita.jpg",
  },
  {
    store: "Taco Bell",
    name: "Quesadilla",
    price: 1.29,
    picture: "quesadilla.webp",
  }
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


////////////////////////
// Add New Code Below 
////////////////////////

function getFood() {
  let randomItemIndex = getRandomInt(items.length);
  let item = items[randomItemIndex];

  let foodNameElement = document.querySelector("#food-name");
  let foodNameText = `${item.name} (${item.store})`;
  foodNameElement.textContent = foodNameText;

  let foodPictureElement = document.querySelector("#food-pic");
  let foodPictureUrl = `https://raw.githubusercontent.com/hytechclub/web-103/main/Assets/${item.picture}`;
  foodPictureElement.src = foodPictureUrl;
}

let greekSalad = {
  store: "Panera",
  price: 10,
  picture: "greeksalad.jpg"
};

greekSalad.name = "Greek Salad";
items.push(greekSalad);

let mac = {
  store: "Panera",
  name: "Mac n Cheese",
  price: 7,
  picture: "macncheese.jfif"
};

items.push(mac);

items.push({
  store: "Panera",
  name: "Soup",
  price: 6,
  picture: "panerabread.jpg"
});
