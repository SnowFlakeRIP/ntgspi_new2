const button = document.querySelector('#LogOn')
const resetButton = document.querySelector('#resetPas')
checkToken()
async function login() {
    const login = document.querySelector('#login').value
    const password = document.querySelector('#password').value
    if (login.trim() === '') {
        alert('Введите логин или электронную почту')
    } else if (password.trim() === '') {
        alert('Введите пароль')
    } else {
        try {
            const response = await axios.post('http://localhost:3000/check_user/auth', {
                login: login,
                password: password,
            })
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.close()
            window.open('./index.html')
        } catch (err) {
            alert('Произошла ошибка при авторизации попробуйте позже')
        }
    }
}

button.onclick = function () {
    login()
}

async function checkToken(){
    const token = localStorage.getItem('token')
    if(token){
        window.close()
        window.open('./index.html')
    }
}

async function sendResetEmail() {
    try {
        const response = await axios.post('http://localhost:3000/check_user/clearPassword', {
            email: ''
        })
        alert(response.data.message)
    } catch (err) {
        alert('Произошла ошибка при авторизации попробуйте позже')
    }
}

resetButton.onclick = function () {
    sendResetEmail()
}