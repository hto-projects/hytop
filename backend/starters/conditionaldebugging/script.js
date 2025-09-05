function clothing() {
  let tempString = prompt("What is the temperature outside?");
  let temp = Number(tempString);

  if (temp < 60) {
    alert("You should wear a T-shirt.");
  } else {
    alert("You should wear a jacket.");
  }
}

function backgroundChange() {
  let newColor = prompt(
    "What color should the background be? (orange, yellow, green, or cyan)"
  );

  if (newColor === "orange") {
    document.body.style.background = "cyan";
  }

  if (newColor === "yellow") {
    document.body.style.background = "green";
  }

  if (newColor === "green") {
    document.body.style.background = "orange";
  }

  if (newColor === "cyan") {
    document.body.style.background = "yellow";
  }
}

function evidence() {
  alert(
    "In order to see this UFO, you must have the highest level of clearance..."
  );
  let passwordGuess = prompt("What is the secret password?");

  if ((passwordGuess = "therealpassword")) {
    alert("Password correct! Press OK to view the UFO.");
    document.querySelector("#secret-picture").style.display = "block";
  } else {
    alert(
      "Password incorrect... your computer will self-destruct in 10 seconds..."
    );
  }
}

function schoolCheck() {
  let ageString = prompt("How old are you?");
  let age = Number(ageString);

  if (age < 6) {
    alert("You are in college");
  }

  if (age > 5 && age < 19) {
    alert("You are in pre-school");
  }

  if (age > 18) {
    alert("You are in K-12 school");
  }
}
