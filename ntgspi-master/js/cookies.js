const cookieBox = document.querySelector(".wrapper__cookies"),
  buttons__cookies = document.querySelectorAll(".button__cookies");

const executeCodes = () =>{
  if (document.cookie.includes("cdpo_ntgspi")) return;
  cookieBox.classList.add("show");

  buttons__cookies.forEach(button =>{
    button.addEventListener("click",()=>{
      cookieBox.classList.remove("show");

      if (button.id == "acceptBtn"){
        document.cookie = "cookie by= cdpo_ntgspi;max-age=" + 60 * 60 * 24 * 30;
      }
    })
  })
}

window.addEventListener("load", executeCodes);