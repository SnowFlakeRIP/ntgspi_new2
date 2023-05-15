const button = document.querySelector('#addCourse')
async function createCourse(){
    const courseName = document.querySelector('#courseName').value
    const courseTarget = document.querySelector('#courseTarget').value
    const coursehours = document.querySelector('#courseHours').value
    const courseType = document.querySelector('#courseType').value
    const courseTeacher = document.querySelector('#courseTeacher').value
    const rating = document.querySelector('#rating').value
    const count_rating = document.querySelector('#count_rating').value
    const oldPrice = document.querySelector('#oldPrice').value
    const newPrice = document.querySelector('#newPrice').value
    let img = document.querySelector('#img').value
    console.log(document.querySelector('#img').files)
    img = './img/' + img.substring(12)
    const data = await axios.post('http://195.161.41.245:3001/course',{
        coursename:courseName,
        coursetarget:courseTarget,
        coursetypes_coursetypeid:courseType,
        teachers_teacherid:courseTeacher,
        meta:{
            rating:rating,
            newPrice:newPrice,
            oldPrice:oldPrice,
            ratingCount:count_rating,
            lessonsCount:coursehours
        },
        img:img
    })
    if(data.data.success){
        alert('Успешно')
    }
    else{
        alert('Ошибка')
    }
}

button.onclick = function (){
    createCourse()
}