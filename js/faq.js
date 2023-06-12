const buttons = document.querySelector('.buttons')

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
changeButtons()