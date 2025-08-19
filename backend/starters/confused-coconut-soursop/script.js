// Helper function to pick a random element from an array
function randomFromArray(items) {
  return items[Math.floor(Math.random()*items.length)];
}

// Use the adviceslip.com API to get a random piece of advice
let getAdvice = async () => {
  let text;

  try {
    // Make the request
    let response = await fetch(`https://api.adviceslip.com/advice`);
    let responseJson = await response.json();

    // Get the advice text
    text = responseJson.slip.advice;    
  } catch (e) {
    throw `Error getting advice: ${e.message}`;
  }

  // Return the advice
  return text;
}

// Use the meowfacts.herokuapp.com API to get a random cat fact
let getCatFact = async () => {
  let text;

  try {
    // Make the request
    let response = await fetch(`https://meowfacts.herokuapp.com/`);
    let responseJson = await response.json();

    // Get the fact
    text = responseJson.data[0] 
  } catch (e) {
    throw `Error getting meow fact: ${e.message}`;
  }

  // Return the fact
  return text;
}

// Use the quote-garden.onrender.com API to get a ranodm quote
let getRandomQuote = async () => {
  let text;

  try {
    // Make the request
    let response = await fetch(`https://quote-garden.onrender.com/api/v3/quotes/random`);
    let responseJson = await response.json();

    // Grab the quote object
    let quoteObject = responseJson.data[0];

    // Form the text into a quote "like this" ~author
    text = `"${quoteObject.quoteText}" ~${quoteObject.quoteAuthor}`;
  } catch (e) {
    throw `Error getting random quote: ${e.message}`;
  }

  // Return the quote text
  return text;
}

// Get a random stoic quote using the API
let getStoicQuote = async () => {
  let text;

  try {
    // Make the request
    let response = await fetch(`https://stoic-quotes.com/api/quote`);
    let responseJson = await response.json();

    // Get the quote text
    text = responseJson.text;
  } catch (e) {
    throw `Error getting stoic quote: ${e.message}`;
  }

  // Return the text
  return text;
}

// Get a random image from the Met
let getMetImage = async () => {
  // Set search term - this is largely irrelevant
  let searchTerm = "cats";

  let imageUrl;

  try {
    // Make the request to search the database
    let searchResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}&hasImages=true`);
    // Get the JSON from the response
    let searchJson = await searchResponse.json();
    // Get the list of objects returned
    let objectIds = searchJson.objectIDs;
    // Pick random object ID (basically a random piece of art)
    let randomObjectId = randomFromArray(objectIds);

    // Make the request to get info about this specific piece
    let objectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectId}`);
    let objectJson = await objectResponse.json();

    // Get the image URL from the response
    imageUrl = objectJson.primaryImageSmall;
  } catch (e) {
    throw `Error getting Met image: ${e.message}`;
  }

  // Return the image
  return imageUrl;
}

// Use the shibe.online API to get a dog pic
let getDogImage = async () => {
  let imageUrl;

  try {
    // Make the request for one dog
    let response = await fetch(`https://shibe.online/api/shibes?count=1`);
    let responseJson = await response.json();

    // Set the image url from the response
    imageUrl = responseJson[0];
  } catch (e) {
    throw `Error getting dog image: ${e.message}`;
  }

  // Return the image
  return imageUrl;
}

// Get the cat image
let getCatImage = async () => {
  return "https://cataas.com/cat";
}

// Put all the text generating functions together in an array
// Note that each function is stored in a variable
let textGenFunctions = [getAdvice, getCatFact, getRandomQuote, getStoicQuote];

// Put all the image gen functions together
let imageGenFunctions = [getMetImage, getDogImage, getCatImage];

/// Get text using a random API
async function getText() {
  // Select a random function from the array
  let textFunc = randomFromArray(textGenFunctions);
  // Get the result from the function
  let result = await textFunc();
  // Return the result
  return result;
}

// Get an image using a random API
async function getImage() {
  // Select a random function from the array
  let imageFunc = randomFromArray(imageGenFunctions);
  // Get the result from the function
  let result = await imageFunc();
  // Return the result
  return result;
}

// Use the textoverimage API to get an image with random text and picture
async function getImageWithText() {
  // Get a random overlay color
  let overlayColor = Math.floor(Math.random()*16777215).toString(16);
  // Set text color to white
  let textColor = "FFFFFFFF";
  // Set text size
  let textSize = 32;

  // Get a random image
  let image = await getImage();

  // Get a random piece of text
  let text = await getText();

  // Build the URL for an image with the given parameters
  let newImageUrl = `https://textoverimage.moesif.com/image?image_url=${image}&overlay_color=${overlayColor}55&text=${text}&text_color=${textColor}&text_size=${textSize}&x_align=center&y_align=center&margin=20`;

  // Return the URL
  return newImageUrl;
}

// Set a new image on the page
async function newRandomImage() {
  // Grab the image element
  let imgElement = document.querySelector("#random-image");

  // Set the image to show the loading indicator
  imgElement.src = "https://cdn.dribbble.com/users/108183/screenshots/5421606/media/3cd434dd9778cc2537d45bc17fa78387.gif";

  let newUrl;
  try {
    // Kick off all the requests, and store the new URL
    newUrl = await getImageWithText();
  } catch (e) {
    // If it fails, set the src to nothign
    imgElement.src = "";
    alert(e);
    return;
  }

  // Set the src to the new URL!
  imgElement.src = newUrl;
}
