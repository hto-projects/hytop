const originalVars = `JUMP_SPEED = 400;
SPEED = 200;
RUN_FPS = 8;
SPIDER_SPEED = 100;
COIN_FPS = 5;
GRAVITY = 1200;
BOUNCE_SPEED = 200;`

const vars = "vars";

function getVars() {
  return JSON.parse(localStorage.getItem(vars)) || originalVars;
}

function setVars(newVars) {
  localStorage.setItem(vars, JSON.stringify(newVars));
}

const varsText = document.querySelector("#vars");
varsText.value = getVars();
sendVars(true);

function resetVars() {
  varsText.value = originalVars;
  sendVars();
}

function sendVars(firstTime) {
  try {
    eval(varsText.value);
    setVars(varsText.value);
    !firstTime && reRunVars();
  } catch (e) {
    alert(e);
  }
}
