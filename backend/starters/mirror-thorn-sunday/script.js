function getGrade() {
  let ageElement = document.querySelector("#age-level");
  let ageValue = ageElement.value;

  let gradeEstimation = "";

  if (ageValue < 5) {
    gradeEstimation = "No school";
  } else if (ageValue < 14) {
    gradeEstimation = "Grade School";
  } else {
    gradeEstimation = "High School and beyond";
  }

  alert(`You are in... ${gradeEstimation}!`);
}
