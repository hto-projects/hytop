// Function for the "🌌🌌" button
function pickBetweenTwo() {
  // Display welcome message
  alert(
    "Think of a decision you have to make in your life. This should be a decision where there are exactly two options."
  );

  // See what the user is trying to decide
  let conundrum = prompt("What are you trying to choose?");

  // If they didn't enter anything...
  if (conundrum === "") {
    // Fail!
    alert("You did not enter a conundrum! This is inexusable!!");

    // Exit immediately!
    return;
  }

  // Ask the user for two options
  let option1 = prompt("What's one choice you could make?");
  let option2 = prompt("What's another path you could choose?");

  // Think about it...
  alert("Hmmm...");

  // Declare an empty variable
  let decision;

  // Get a random number between 0 and 1
  let randomNumber = Math.random();

  // If the number is greater than .5 (50% chance)...
  if (randomNumber > 0.5) {
    // Choose option 1
    decision = option1;
  } else {
    // Otherwise, choose option 2
    decision = option2;
  }

  // Fill out the end message, using the original conundum and the chosen option
  let endMessage = `In the matter of ${conundrum}, you should choose ${decision}.`;

  // Display the final message!
  alert(endMessage);
}

// Function for the "Help Me Decide" button
function prosCons() {
  // Get the thing the user is trying to decide
  let thingToDo = prompt(
    "What are you trying to decide whether or not you should do?"
  );

  // Display message for pros
  alert("Alright, let's start with the Pros.");

  // Get the first pro
  let pro1 = prompt("Enter Pro 1");

  // Get how important this item is to the user
  let weightPro1String = prompt(
    "How important is that to you on a scale of 1-10?"
  );

  // Convert the input into a numeric value
  let weightPro1 = Number(weightPro1String);

  // Get the second pro + weight
  let pro2 = prompt("Enter Pro 2");
  let weightPro2String = prompt(
    "How important is that to you on a scale of 1-10?"
  );
  let weightPro2 = Number(weightPro2String);

  // Message to start the cons
  alert("Okay, now the Cons.");

  // Get first con + weight
  let con1 = prompt("Enter Con 1");
  let weightCon1String = prompt(
    "How important is that to you on a scale of 1-10?"
  );
  let weightCon1 = Number(weightCon1String);

  // Get second con + weight
  let con2 = prompt("Enter Con 2");
  let weightCon2String = prompt(
    "How important is that to you on a scale of 1-10?"
  );
  let weightCon2 = Number(weightCon2String);

  // Think about it...
  alert("Hmm...");

  // Calculate total value for the Pros
  let proTotal = weightPro1 + weightPro2;

  // Calculate total value for the Cons
  let conTotal = weightCon1 + weightCon2;

  // If the pros outweigh the cons...
  if (proTotal > conTotal) {
    // Display the choice
    alert(`You should DEFINITELY ${thingToDo}.`);
  } else {
    // Display the negative choice
    alert(`You should definitely NOT ${thingToDo}.`);
  }
}
