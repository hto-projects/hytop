// Create an array of sandwich objects for the menu
let sandwiches = [
  {
    name: "Turkey Sandwich",
    description: "A classic turkey sandwich with lettuce, tomato, and mayo on whole wheat bread.",
    price: 4.99,
    pic: "https://raw.githubusercontent.com/hytechclub/web-103/main/Assets/turkey.png"
  },
  {
    name: "Grilled Cheese Sandwich",
    description: "A comfort food favorite - a grilled cheese sandwich with melted cheddar cheese on white bread.",
    price: 3.99,
    pic: "https://raw.githubusercontent.com/hytechclub/web-103/main/Assets/grilledcheese.jpg"
  },
  {
    name: "BLT Sandwich",
    description: "A classic bacon, lettuce, and tomato sandwich with mayo on toasted bread.",
    price: 5.99,
    pic: "https://raw.githubusercontent.com/hytechclub/web-103/main/Assets/blt.jpg"
  }
];

// Initialize the cart (should start empty)
let cart = [];

// A function that adds a given item to the cart
function addItemToCart(item) {
  // See if this item is already in the cart
  let existingItems = cart.filter(row => item.name === row.name);

  // If there is no existing item...
  if (existingItems.length === 0) {
    // Create a new item
    let newCartItem = {};

    // Set the starter properties for the cart row
    newCartItem.name = item.name;
    newCartItem.price = item.price;
    newCartItem.quantity = 1;

    // Add the new item to the cart
    cart.push(newCartItem);
  } else {
    // Find the existing item
    let existingItem = existingItems[0];

    // Increase the quantity
    existingItem.quantity++;
  }

  // Display the updated cart
  viewCart();
}

// A function that builds the initial menu based on an array of items
function buildMenu(items) {
  // Grab the container from the HTML
  let itemContainer = document.querySelector("#item-container");

  // Loop through each item
  items.forEach(item => {
    // Create a new <div> for the item
    let itemElement = document.createElement("div");

    // Add important information for the menu
    itemElement.innerHTML = `
      <img src="${item.pic}">
      <div>
        <h2>${item.name} <span>+</span></h2>
        <p>${item.description}</p>
      </div>`;

    // Grab the plus button <span> element
    let plusButton = itemElement.querySelector("span");

    // Hook up the plus button so it adds the item on click
    plusButton.addEventListener("click", () => {
      addItemToCart(item);
    });

    // Add the item to the menu container
    itemContainer.appendChild(itemElement);
  });
}

// Update the cart table
function viewCart() {
  // Grab the cart container
  let cartContainer = document.querySelector("#cart-container");

  // Create the basic table and header row
  cartContainer.innerHTML = `
    <table>
      <tr>
        <th>Item</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
      </tr>
    </table>`;

  // Grab the newly-created table from the container
  let cartTable = cartContainer.querySelector("table");

  // Loop through each item in the cart
  cart.forEach(item => {
    // Create a new table row for the cart item
    let itemRow = document.createElement("tr");

    // Format item price
    let itemPrice = item.price.toFixed(2);

    // Calculate item total
    let itemTotal = (itemPrice*item.quantity).toFixed(2);

    // Set the cells of the row
    itemRow.innerHTML = `
      <td>${item.name}</td>
      <td>$${itemPrice}</td>
      <td>${item.quantity}</td>
      <td>$${itemTotal}</td>`;

    // Add the row to the table
    cartTable.appendChild(itemRow);
  });

  // Create the final row with the total
  let finalRow = document.createElement("tr");

  // Calculate the total cost of all items together using reduce
  let grandTotal = cart.reduce((total, next) => {
    let totalForItem = next.price * next.quantity;
    return total + totalForItem;
  }, 0);

  // Add the data to the final row 
  finalRow.innerHTML = `
    <td><strong>Total</strong></td>
    <td></td>
    <td></td>
    <td><strong>$${grandTotal.toFixed(2)}</strong></td>`;

  // Append the final row to the table
  cartTable.appendChild(finalRow);
}

// Build the menu based on the sandwiches array
buildMenu(sandwiches);
