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
news()
async function news(){
    try{
        const response = await axios.get('https://ntgspi.devsnowflake.ru/api/news/show/all')
        const news_cont = document.querySelector('.news__container')
        for ( const news of response.data.message ) {
            news_cont.innerHTML += ` <div class="news__box">
        <div class="news__img">
          <img src="${news.newsPath}" alt="news">
        </div>
        <div class="news__text">
          <span>${news.newsDate2}</span>
          <a href="news__details.html" class="news__title">${news.newsTitle}</p>
<!--          <a href="news__details.html">Узнать подробнее</a>-->
        </div>
      </div>`
        }
    }
    catch ( e ) {
        console.log(e)
    }
}

button.onclick = function () {
    downloadPDF()
}