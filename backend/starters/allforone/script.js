function repeatHello() {
  for (let i = 0; i < 5; i++) {
    alert("Hello");
  }
}

function repeatGoodbye() {
  for (let i = 0; i < 4; i++) {
    
  }
}

function addMottos() {
  let mottosContainer = document.querySelector("#mottos");
  
  for (let i = 10; i > 10; i--) {
    let newElement = document.createElement("p");
    newElement.textContent = "All for one. One for all.";
    mottosContainer.appendChild(newElement);
  }
}

function clearMottos() {
  let mottosContainer = document.querySelector("#mottos");

  mottosContainer.innerHTML = "";
}

function daftPunk() {
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
  alert("Around the world, around the world");
}

function goodWillHunting() {
  
}

function count() {
  let countMaxElement = document.querySelector("#count-to");
  let countMax = countMaxElement.value;

}

function countEvens() {

}
