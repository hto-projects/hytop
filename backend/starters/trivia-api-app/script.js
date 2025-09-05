// For labeling answer options
const ANSWER_LETTERS = "ABCDEFGHIJKLMNOP";

// API returns encoded HTML - this displays it as normal text
function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;

  return txt.value;
}

// Take all the answers in an array, and display them nicely with letters
// Ends up looking like this, e.g. for input ["One", "Two", "Three", "Four"]:
// A. One
// B. Two
// C. Three
// D. Four
function getAnswersText(answersArray) {
  // For the arrow function, a is the answer and i is the index in the array
  return answersArray.map((a, i) => `${ANSWER_LETTERS[i]}. ${a}`).join("\n");
}

// Take a question object, and generate the question text and correct answer
function generateQuestionTextAndAnswer(questionObject) {
  // Combine correct answer with incorrect answers
  let allAnswers = [questionObject.correct_answer, ...questionObject.incorrect_answers];
  // Shuffle answers so the correct answer isn't first every time
  allAnswers.sort(a => Math.random() - 0.5);

  // Find the correct answer
  let correctIndex = allAnswers.indexOf(questionObject.correct_answer);
  // Generate all answers in nice multiple choice display
  let answersText = getAnswersText(allAnswers);

  // Put question and multiple choice options together
  let questionText = `${questionObject.question}

${answersText}
`;

  // Decode that text
  let decodedQuestionText = decodeHtml(questionText);

  // Return the question text, as well as the correct answer
  return {
    questionText: decodedQuestionText,
    correctAnswer: ANSWER_LETTERS[correctIndex]
  };
}

// Attached to button
async function startQuiz() {
  // Set up values for API request
  let numQuestions = 5;
  let difficulty = "easy";

  // Generate API URL based on values
  let url = `https://opentdb.com/api.php?amount=${numQuestions}&difficulty=${difficulty}&type=multiple`;

  // Init response vars
  let response, responseJson;

  try {
    // Make the request
    response = await fetch(url);
    responseJson = await response.json();
  } catch (e) {
    alert(e);
    return;
  }

  // Get the results from the request
  let results = responseJson.results;
  // Initialize score
  let score = 0;

  // Loop through every question in the results
  for (let i = 0; i < results.length; i++) {
    // Get the question text/answer for the current result
    let questionAndAnswer = generateQuestionTextAndAnswer(results[i]);

    // Ask the user the question
    let answer = prompt(questionAndAnswer.questionText);
    if (answer === questionAndAnswer.correctAnswer) {
      // Increment their score if they get it right
      score++;
    }
  }

  // Display results!
  alert(`Final score: ${score} out of ${numQuestions}`);
  alert(`That's ${100*(score/numQuestions)}% correct`);
}
