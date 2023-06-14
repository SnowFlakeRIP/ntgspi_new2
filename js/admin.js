const button = document.querySelector('#addCourse')
async function createCourse(){
    const token = localStorage.getItem('token-admin')
    const courseName = document.querySelector('#courseName').value
    const coursecount = document.querySelector('#coursecount').value
    const courseType = document.querySelector('#courseType').value
    const studyType = document.querySelector('#studyType').value
    const courseTeacher = document.querySelector('#courseTeacher').value
    const oldPrice = document.querySelector('#oldPrice').value
    const courseTime = document.querySelector('#courseTime').value
    const newPrice = document.querySelector('#newPrice').value
    const description = document.querySelector('#description').value
    const coursefor = document.querySelector('#coursefor').value
    let img = document.querySelector('#img').value
    console.log(document.querySelector('#img').files)
    img = './img/' + img.substring(12)
    const data = await axios.post('https://ntgspi.devsnowflake.ru/api/admin/course',{
        coursename:courseName,
        coursetypes_coursetypeid:courseType,
        teachers_teacherid:courseTeacher,
        studyType:studyType,
        coursecount:coursecount,
        courseTime:courseTime,
        description:description,
        coursefor:coursefor,
        meta:{
            newPrice:newPrice,
            oldPrice:oldPrice,
        },
        img:img
    },{
        headers:{
            'access':token
        }
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