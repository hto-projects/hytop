// Images for different weather codes
// Codes outlined here: https://open-meteo.com/en/docs#weathervariables
let weatherCodeImages = [
  {
    image: "https://i.gifer.com/origin/45/454ba38b4ce5b3fdc8796ed710769e69.gif",
    codes: [0, 1, 2]
  },
  {
    image: "https://j.gifs.com/P1rKVn@large.gif?download=true",
    codes: [3]
  },
  {
    image: "https://media2.giphy.com/media/cIsHRed0PxHhmGx1Gn/giphy.gif",
    codes: [45, 48]
  },
  {
    image: "https://media.tenor.com/GQO_PZDHaR8AAAAC/snow-white.gif",
    codes: [71, 73, 75, 77, 85, 86]
  },
  {
    image: "https://i.pinimg.com/originals/00/f8/6c/00f86cb904ad4608738ebe8fc6f57cb2.gif",
    codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]
  }
];

// Get an image for a given weather code
function getImageUrlForWeatherCode(wc) {
  // Find al objects where the code is present
  let possibleObjects = weatherCodeImages.filter(o => o.codes.includes(wc));
  // Grab the first object in the array
  let firstObj = possibleObjects[0];

  // Return the image property for the object with the code
  return firstObj.image;
}

// Set the background of the page to be an image based on weather code
function setBgFromWeatherCode(wc) {
  // Get the image URL based on the weather code
  let imageUrl = getImageUrlForWeatherCode(wc);
  // Get the background-url property value 
  let backgroundImageValue = `url("${imageUrl}")`;

  // Set the background image
  document.body.style.backgroundImage = backgroundImageValue;
}

// Get data about a certain search location (lat, lng, name)
async function getDataFromSearchLocation(searchLocation) {
  let result;
  
  try {
    // Call the API for the given zip code
    let response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchLocation}&count=1`);
    // Convert the response to JSON
    let responseJson = await response.json();
    // Get the results from the JSON data
    let results = responseJson.results;

    // Get the top result
    result = results[0];
  } catch (e) {
    alert(e);
    return;
  }

  return result;
}

// Get current weather for a given latitude and longitude
async function getWeatherFromLatLng(lat, lng) {
  let currentWeather;

  try {
    // Call the API for the lat and lng
    let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit`);
    // Convert response to JSON
    let responseJson = await response.json();

    // Grab the current weather from the JSON
    currentWeather = responseJson.current_weather;
  } catch (e) {
    alert(e);
    return;
  }

  return currentWeather;
}

// Get the weather!
async function getWeather() {
  // Get the search value from the text box on the page
  let searchLocation = document.querySelector("#search-location").value;

  // Get the data for the search
  let searchData = await getDataFromSearchLocation(searchLocation);

  // Display the location name on the page
  document.querySelector("#name").textContent = searchData.name;

  // Get the current weather based on latitude and longitude from search results
  let currentWeather = await getWeatherFromLatLng(searchData.latitude, searchData.longitude);

  // Display the temperature on the page
  document.querySelector("#temp").textContent = `${currentWeather.temperature}° F`;

  // Set the background image based on the weather code
  setBgFromWeatherCode(currentWeather.weathercode);
}
