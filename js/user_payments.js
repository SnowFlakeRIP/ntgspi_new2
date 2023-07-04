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
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/user/myCourse', {
            headers:{
                'access':token
            }
        } )
        console.log( response )
        const courses = response.data.message
        let n = 1
        for ( const cours of courses ) {
            let status = null
            if(cours.isPaid){
                status= `<td>Курс оплачен</td>`
            }
            else{
                status= `<td><a href="#" onclick="openPayment(${cours.courseId},${cours.courseprice},${cours.id})" class="btnPay">Оплатить</a></td>`
            }
            table.innerHTML += `
                 <tr>
              <td>${n}</td>
              <td><img src="img/user1.jpg" alt = "">${cours.name + ' ' + cours.lastName  + ' ' +  cours.middleName  }</td>
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
            window.open('./auth.html')
        }
        console.log(e)
    }
}

function openPayment (courseId,amount,paymentNumber) {
    localStorage.setItem('payCourseId',courseId)
    localStorage.setItem('amount',amount)
    localStorage.setItem('paymentNumber',paymentNumber)

    window.open('./payment_document')
}