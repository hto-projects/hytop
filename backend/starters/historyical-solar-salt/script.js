// 1st place: Avatar (The Last Airbender)
// 2nd place: Spongebob (Squarepants)
// 3rd place: Fairly Odd Parents
// 4th place: Jimmy Neutron (Boy Genius)
let myShowsRanked = ["Avatar", "Spongebob", "Fairly Odd Parents", "Jimmy Neutron"];

function getShowByRank(rank) {
  if (rank <= 0) {
    alert("Please enter a positive number.");
    return "INVALID";
  }

  let numShows = myShowsRanked.length;
  if (rank > numShows) {
    alert(`Please enter a number less than or equal to ${numShows}`);
    return "INVALID";
  }

  let rankIndex = rank+1;

  let show = myShowsRanked[rankIndex];
  return show;
}

function displayShow() {
  let rankElement = document.querySelector("#rank");
  let rankValueString = rankElement.value;
  let rankValue = Number(rankValueString);

  let show = getShowByRank(rankValue);

  let rankedShowElement = document.querySelector("#ranked-show");
  rankedShowElement.textContent = `${rankValue}: ${show}`;
}
