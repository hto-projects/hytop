async function getHighScores() {
  try {
    const response = await fetch(`/api/fake-api/hackyformer/high-scores?sessionName=${window.sessionName}`);
    const json = await response.json();
    return json;
  } catch (error) {
    alert(error);
  }
}

async function sendHighScore(newScore) {
  try {
    const response = await fetch('/api/fake-api/hackyformer/high-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newScore)
    });
    const json = await response.json();
  } catch (error) {
    alert(error);
  }
}

async function getHighestScore() {
  const topScores = await getTopScores();
  if (topScores.length === 0) {
    return 0;
  } else {
    return topScores[0].score;
  }
}

async function addNewScore(score) {
  const currentHighest = await getHighestScore();

  if (score > currentHighest) {
    alert("NEW HIGH SCORE!!!");
  }

  if (score === currentHighest) {
    alert("You tied for highest score!");
  }
  
  let initials = "";
  while (initials.length !== 3) {
    initials = prompt("You won! Enter your initials (3 characters)");
  }

  console.log(window.sessionName);
  
  await sendHighScore({ initials, score, sessionName: window.sessionName });
  await displayHighScores();
}

async function getTopScores() {
  const currentHighScores = await getHighScores();
  currentHighScores.sort((hs1, hs2) => hs2.score - hs1.score);
  return currentHighScores;
}

async function displayHighScores() {
  const hsTable = document.querySelector("#hs-table");
  const topScores = await getTopScores();
  
  for (let i = 0; i < topScores.length; i++) {
    const currentScore = topScores[i];

    const currentRow = hsTable.children[i];
    if (currentRow) {
      currentRow.querySelector(".initials").textContent = currentScore.initials;
      currentRow.querySelector(".score").textContent = currentScore.score;
    } else {
      const newRow = document.createElement("tr");
      
      const initsCell = document.createElement("td");
      initsCell.classList.add("initials");
      initsCell.textContent = currentScore.initials;
      
      const scoreCell = document.createElement("td");
      scoreCell.classList.add("score");
      scoreCell.textContent = currentScore.score;
      
      newRow.appendChild(initsCell);
      newRow.appendChild(scoreCell);
      hsTable.appendChild(newRow);
    }
  }
}

displayHighScores();

// periodically grab high scores
setInterval(displayHighScores, 5000);
