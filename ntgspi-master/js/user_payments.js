const table = document.querySelector('.table')
checkToken()
async function checkToken(){
    const token = localStorage.getItem('token')
    if(!token){
        window.close()
        window.open('./auth.html')
    }
}
getUserCourses()
async function getUserCourses(){
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get( 'http://localhost:3000/user/myCourse', {
            headers:{
                'access':token
            }
        } )
        console.log( response )
        const courses = response.data.message
        let n = 1
        for ( const cours of courses ) {
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
              <td>{course.isPaid ? 'Курс оплачен' : 'Ожидает оплаты'}</td>
            </tr>
            `
            n++
        }
    }
    catch ( e ) {
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./auth.html')
        }
        console.log(e)
    }
}