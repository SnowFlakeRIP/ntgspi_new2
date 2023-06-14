const table = document.querySelector('#table')
checkToken()
getcourses()
async function getcourses(){
    const token = localStorage.getItem('token-admin')
    try{
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/admin/course/req', {
            headers:{
                'access':token
            }
        } )
        console.log(response)
        for ( const item of response.data.message ) {
            const statuses = {
                1:'В обработке',
                2:'Подтверждена',
                3:'Отклонена'
            }
            table.innerHTML += `
          <tbody>
            <tr>
              <td>${item.id}</td>
              <td><img src="img/user1.jpg" alt = "">${item.name} ${item.lastName} ${item.middleName}</td>
              <td>${item.coursename}</td>
              <td><strong>${item.courseprice}</strong></td>
              <td>
                <p class="status in-processing">${statuses[item.requestConfirm]}</p>
              </td>
              <td>
                <a href="#" onclick="approve(${item.id})"  class="crud__btn">Принять заявку</a>
<!--                <a href="#" class="crud__btn">Отклонить заявку</a>-->
              </td>
            </tr>
          </tbody>`
        }
    }
    catch ( e ) {
        console.log(e)
    }
}

async function checkToken(){
    const token = localStorage.getItem('token-admin')
    if(!token){
        window.close()
        window.open('./admin_auth.html')
    }
}

async function approve(requestId){
    const token = localStorage.getItem('token-admin')
    try{
        const response = await axios.post( 'https://ntgspi.devsnowflake.ru/api/admin/req/confirm',{
            requestId
        }, {
            headers:{
                'access':token
            }
        } )
        window.location.reload()
    }
    catch ( e ) {
        console.log(e)
    }
}