const container = document.querySelector('.myCourse__container')
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
        for ( const cours of courses ) {
            container.innerHTML += `
                 <div class="myCourse">
          <div class="myCourse__box">
            <h3 class="">${ cours.coursename }</h3>
            <img class = "myCourse__img" src = ${ cours.img }>
          </div>
        </div>
            `
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