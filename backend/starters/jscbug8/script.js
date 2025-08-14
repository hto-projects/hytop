function randomAnswer() {
  let answerRandom = Math.random();
  let answer = "";

  if (answerRandom > .5) {
    answer = "Yes";
  else {
    answer = "No";
  }

  alert("And the answer is...");
  alert(answer);
}