const button  = document.querySelector('#sign')

async function sign(){
    try {
        const response = await axios.post( 'http://localhost:3000/check_user/auth',
            {
                login:document.querySelector('#login').value,
                password:document.querySelector('#password').value
            } )

        localStorage.setItem('token-admin',response.data.token)
        window.close()
        window.open('./admin.html')
    }
    catch ( e ) {
        console.log(e)
    }
}
button.onclick = function () {
    sign()
}