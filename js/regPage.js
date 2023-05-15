const button = document.querySelector('#registration')
async function registration() {
    const login = document.querySelector('#login').value
    const pas1 = document.querySelector('#pas1').value
    const pas2 = document.querySelector('#pas2').value
    const email = document.querySelector('#email').value
    if (pas1 !== pas2) {
        alert('Пароли не совпадают')
    }
    else if (pas1.trim() === '') {
        alert('Необходимо ввести пароль')
    }
    else if (login.trim() === '') {
        alert('Необходимо ввести логин')
    }
    else if (email.trim() === '') {
        alert('Необходимо ввести электронную почту')
    }
    else {
        try {
            const response = await axios.post('http://195.161.41.245:3001/check_user/register', {
                password: pas1,
                login: login,
                email: email,
            })
            alert(response.data.message)
        } catch (err) {
            console.log(err)
            alert('Регистрация не удалась')
        }
    }
}

button.onclick = function (){
    registration()
}