async function getDefinition() {
  let input = document.querySelector("input");
  let searchVal = input.value;

  let displayEl = document.querySelector("#display");
  
  try {
    let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchVal}`);
    let arr = await res.json();
    let word = arr[0];
    let meanings = word.meanings;
    let meaning = meanings[0];
    let definitions = meaning.definitions;
    let definitionObj = definitions[0];
    let definition = definitionObj.definition;
    
    displayEl.textContent = definition;
  } catch (e) {
    alert(e);
    return;
  }
}
