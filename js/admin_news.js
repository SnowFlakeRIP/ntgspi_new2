const news = document.querySelector(`.news`)
const createnews = document.querySelector('#createnews')
async function getNews(){
    try {
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/news/show/all' )

        for ( const newss of response.data.message ) {
            news.innerHTML += `<div class="card" id="news${newss.newsId}" style="width: 18rem;">
  <img src="${ newss.newsPath ?  newss.newsPath : 'https://avatanplus.com/files/resources/mid/577e3ef8cdf33155c525fc0c.png' }" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${ newss.newsTitle }</h5>
    <p class="card-text">${ newss.newsText }</p> 
  </div>
</div>`
            if(!newss.newsPath){
                const news = document.querySelector(`#news${newss.newsId}`)
                news.innerHTML += `<div class="mb-3">
  <label for="formFile" class="form-label">Загрузить файл</label>
  <input class="form-control"  type="file" id="formFile">
</div>`
                news.innerHTML += `<button onclick="save(${newss.newsId})"> Сохранить </button>`
            }
        }
    }
    catch ( e ) {
        console.log( e )

    }
}
getNews()

async function createNews(){
    window.open('./create_news.html')
}
createnews.onclick = function () {
    createNews()
}


async function save(newsId){
    try{
        const token = localStorage.getItem('token-admin')
        const formData = new FormData()
        const image = document.querySelector('#formFile')
        console.log(image.files)
        formData.append("file", image.files[0]);
        formData.append('newsId',newsId)
        const response = await axios.post('https://ntgspi.devsnowflake.ru/api/admin/news/file/add',formData,{
            headers:{
                'Content-Type': 'multipart/form-data',
                'access':token
            }
        })
        console.log(response)
        localStorage.removeItem('newsId')
    }
    catch ( e ) {
        console.log(e)
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./admin_auth.html')
        }
    }
}