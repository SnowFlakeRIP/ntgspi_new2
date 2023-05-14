const saveButton = document.querySelector('#save_button')
checkToken()
getSettings()
async function checkToken(){
    const token = localStorage.getItem('token')
    if(!token){
        window.close()
        window.open('./auth.html')
    }
}

async function setUserData(event){
    const userName = document.querySelector('#name').value
    const userSecondName = document.querySelector('#secondname').value
    const userMiddleName = document.querySelector('#middlename').value
    const userDate = document.querySelector('#date').value
    const userGender = document.querySelector('#gender').value
    const userPhone = document.querySelector('#phoneNumber').value
    const userEmail = document.querySelector('#email').value
    const userCity = document.querySelector('#city').value
    const passSerial = document.querySelector('#serial').value
    const passNumber = document.querySelector('#number').value

    const token = localStorage.getItem('token')
    try{
        await axios.post('http://localhost:3000/user/setUserData',{
            userPhone:userPhone,
            passportSerial:passSerial,
            passportNumber:passNumber,
            lastName:userSecondName,
            name:userName,
            middleName:userMiddleName,
            dateBirth:userDate,
            gender:userGender,
            city:userCity,
            email:userEmail
        },{
            headers:{
                'access':token
            }
        })
    }
    catch ( e ) {
        console.log(e)
    }
}

async function getSettings () {
    try {
        const token = localStorage.getItem( 'token' )
        const response = await axios.get( 'http://localhost:3000/user/getUserData', {
            headers:{
                'access':token
            }
        } )
        document.querySelector( '#name' ).value = response.data.message.name
        document.querySelector( '#secondname' ).value = response.data.message.lastName
        document.querySelector( '#middlename' ).value = response.data.message.middleName
        document.querySelector( '#date' ).value = response.data.message.dateBirth2
        document.querySelector( '#gender' ).value = response.data.message.gender
        document.querySelector( '#phoneNumber' ).value = response.data.message.userPhone
        document.querySelector( '#email' ).value = response.data.message.email
        document.querySelector( '#city' ).value = response.data.message.city
        document.querySelector( '#serial' ).value = response.data.message.passportSerial
        document.querySelector( '#number' ).value = response.data.message.passportNumber
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

saveButton.onclick = function (){
  setUserData()
}