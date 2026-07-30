let score = 0;
let currentQuestion = -1;

const container = document.querySelector("#container");
const questionText = document.querySelector("#question-text");
const answersContainer = document.querySelector("#answers-container");
const nextBtn = document.querySelector("#next");
const nameContainer = document.querySelector("#name");

function showNextQuestion() {
  document.body.style.color = textColor;
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    document.body.style.background = basicBackground;
    showMessage(
      `<h1>The End!</h1><p>Final Score: <b>${score}</b>/${questions.length} (${100 * (score / questions.length)}%)`,
      () => {
        score = 0;
        currentQuestion = -1;
        showNextQuestion();
      },
      "Replay",
    );
    return;
  }

  document.body.style.background = basicBackground;
  nextBtn.style.opacity = "0";
  const { question, correctAnswer, wrongAnswers } = questions[currentQuestion];
  questionText.innerHTML = `<h1>${currentQuestion + 1}. ${question}</h1>`;

  const possibleAnswers = [...wrongAnswers, correctAnswer];
  shuffle(possibleAnswers);

  answersContainer.innerHTML = "";
  for (let i = 0; i < possibleAnswers.length; i++) {
    const answerBtn = document.createElement("button");
    answerBtn.innerHTML = possibleAnswers[i];
    answerBtn.onclick =
      possibleAnswers[i] === correctAnswer
        ? () => {
            score++;
            document.body.style.background = correctBackground;
            showMessage("<h1>Correct!</h1>");
          }
        : () => {
            document.body.style.background = wrongBackground;
            showMessage(
              `<h1>Incorrect :(</h1><p>(correct answer: ${correctAnswer})</p>`,
            );
          };

    answersContainer.appendChild(answerBtn);
  }
}

function showMessage(msg, onNext = showNextQuestion, txt = "Next") {
  questionText.innerHTML = msg;
  answersContainer.innerHTML = "";
  nextBtn.style.opacity = "1";
  nextBtn.onclick = onNext;
  nextBtn.innerHTML = txt;
}

document.addEventListener("DOMContentLoaded", () => {
  nameContainer.textContent = myName;
});
