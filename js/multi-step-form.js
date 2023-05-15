
const circles = document.querySelectorAll(".circle"),
  progressBar = document.querySelector(".indicator"),
  buttons__pay = document.querySelectorAll("button");

let currentStep = 1;

const updateSteps = (e) => {
 
  currentStep = e.target.id === "pay__next" ? ++currentStep : --currentStep;


  circles.forEach((circle, index) => {
    circle.classList[`${index < currentStep ? "add" : "remove"}`]("active");
  });

  
  progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;


  if (currentStep === circles.length) {
    buttons__pay[1].disabled = true;
  } else if (currentStep === 1) {
    buttons__pay[0].disabled = true;
  } else {
    buttons__pay.forEach((button) => (button.disabled = false));
  }
};

buttons__pay.forEach((button) => {
  button.addEventListener("click", updateSteps);
});