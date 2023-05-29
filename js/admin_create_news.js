const newsTitle = document.querySelector('#newsTitle')
const newsText = document.querySelector('#newsText')
const newsDate = document.querySelector('#newsDate')
const createnews = document.querySelector('#createnews')
async function createNews(){
    try{
        const token = localStorage.getItem('token-admin')
        const response = await axios.post('https://ntgspi.devsnowflake.ru/api/admin/course/create',{
                newsTitle:newsTitle.value,
                newsText:newsText.value,
                newsDate:newsDate.value,
        }, {
            headers:{
                'access':token
            }
        })
        console.log(response)
    }
    catch ( e ) {
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./admin_auth.html')
        }
    }
}

createnews.onclick = function () {
    createNews()
}