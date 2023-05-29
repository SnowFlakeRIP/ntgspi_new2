checkToken()
const request = document.querySelector('#createRequest')
async function checkToken () {
    const token = localStorage.getItem( 'token' )
    if ( !token ) {
        window.close()
        window.open( './auth.html' )
    }
}
getSettings()
async function getSettings () {
    try {
        const token = localStorage.getItem( 'token' )
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/user/getUserData', {
            headers:{
                'access':token
            }
        } )
        const coursename = localStorage.getItem('coursename')
        document.querySelector( '#name' ).value = response.data.message.name
        document.querySelector( '#secondname' ).value = response.data.message.lastName
        document.querySelector( '#middlename' ).value = response.data.message.middleName
        document.querySelector( '#email' ).value = response.data.message.email
        document.querySelector( '#phoneNumber' ).value = response.data.message.userPhone
        document.querySelector( '#coursename' ).value = coursename
    }
    catch ( e ) {
        console.log( e )
    }
}

async function createRequest () {
    try {
        const token = localStorage.getItem( 'token' )
        const courseid = localStorage.getItem('courseid')
        const response = await axios.post( 'https://ntgspi.devsnowflake.ru/api/user/joinToCourse',{
            courseId:courseid
        }, {
            headers:{
                'access':token
            }
        } )

        localStorage.removeItem('courseid')
        localStorage.removeItem('coursename')

        alert('Заявка создана')
        window.close()
    }
    catch ( e ) {
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./auth.html')
        }
        console.log( e )
    }
}

request.onclick = function (){
    createRequest()
}