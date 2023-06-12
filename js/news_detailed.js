const news_detailed = document.querySelector('.news-details__group')

async function getNewsDetailed () {
    try {
        const newsId = localStorage.getItem('newsId')
        const response = await axios.post(`https://ntgspi.devsnowflake.ru/api/news/show/detailed`,{
            newsId:newsId
        })
        const data = response.data.message
        news_detailed.innerHTML += `
            <div class="news__details-container grid container">
      <div class="news-details__group">
        <div class="news-details__tag">НОВОСТИ</div>
        <h3 class="news-details__title">${data.newsTitle}</h3>
        <div class="news-details__meta">
            <div class="news-details__data">
              <h3 class="news-details__data-title">${data.newsData2}</h3>
            </div>
        </div>
        <img src="${data.newsPath}" alt="" class="news-details__img">
        <div class="news__description">
          <h3 class="news__description-title">Описание</h3>
          <p class="news__description-details">
           ${data.newsText}
          </p>
        </div>
      </div>
    </div>`
    }
    catch ( e ) {
        console.log( e )
    }
}

getNewsDetailed()