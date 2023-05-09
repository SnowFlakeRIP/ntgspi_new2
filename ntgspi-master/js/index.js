const button = document.querySelector('#personalPDF')
const buttons = document.querySelector('.buttons')
changeButtons()
async function downloadPDF() {
    const response = await axios.post('')
}

function changeButtons(){
    const token = localStorage.getItem( 'token' )
    if ( !token ) {
        buttons.innerHTML += `
         <a href = "#feedback" class="button button__consultation">КОНСУЛЬТАЦИЯ</a>
          <a href = "auth.html" class="button button__authorization">ВХОД</a>`
    }
    else {
        buttons.innerHTML += `
         <a href = "#feedback" class="button button__consultation">КОНСУЛЬТАЦИЯ</a>
          <a href = "./user.html" class="button button__authorization">ЛИЧНЫЙ КАБИНЕТ</a>`
    }
}

button.onclick = function () {
    downloadPDF()
}