const table = document.querySelector('.table')

checkToken()
async function checkToken(){
    const token = localStorage.getItem('token-admin')
    if(!token){
        window.close()
        window.open('./admin_auth.html')
    }
}
getCourses()
async function getCourses(){
    const token = localStorage.getItem('token-admin')
    try{
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/admin/courses', {
            headers:{
                'access':token
            }
        } )
        const courses = response.data.message
        let n = 1
        for ( const cours of courses ) {
            let status = null
            if(cours.isPaid){
                status= `<td>Курс оплачен</td>`
            }
            else{
                status= `<td><a href="#" onclick="submit(${cours.id},${cours.courseprice},${cours.id})" class="btnPay">Подтвердить</a></td>`
            }
            table.innerHTML += `
                 <tr>
              <td>${n}</td>
              <td><img src="img/user1.jpg" alt = "">${cours.name + ' ' + cours.middleName + ' ' + cours.lastName}</td>
              <td>${cours.coursename}</td>
              <td><strong>${cours.courseprice}</strong></td>
              <td>
                <p class="status approved">${cours.isPaid ? 'Успешно' : 'Ожидает оплаты'}</p>
              </td>
              <td>${cours.payDate}</td>
              ${status}
</tr>`

            n++
        }
    }
    catch ( e ) {
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./auth_admin.html')
        }
        console.log(e)
    }
}

async function submit(id){
    const token = localStorage.getItem('token-admin')
    try{
        const response = await axios.post( 'https://ntgspi.devsnowflake.ru/api/admin/course/isPaid',{
            id
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