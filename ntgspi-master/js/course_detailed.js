const main = document.querySelector( '.main' )
checkToken()

async function checkToken () {
    const token = localStorage.getItem( 'token' )
    if ( !token ) {
        window.close()
        window.open( './auth.html' )
    }
}

getCourseInfo()

async function getCourseInfo () {
    try {
        const courseId = localStorage.getItem( 'lastCourse' )
        const token = localStorage.getItem( 'token' )
        const response = await axios.post( 'http://localhost:3000/courses/detailed', {
            courseid:courseId
        }, {
            headers:{
                'access':token
            }
        } )
        const course = response.data.message
        main.innerHTML += `
              <section class="course__details section">
    <div class="details__container grid container">
      <div class="details__group">
        <div class="details__tag">${course.coursetypename}</div>
        <h3 class="details__title">${course.coursename}</h3>
        <div class="details__meta">
          <div class="details__teacher">
            <img src="img/teacher1.jpg" alt="" class="details__teacher-img">

            <div class="details__data">
              <span class="details__subtitle">Преподаватель</span>
              <h3 class="details__data-title">${course.teachername + '' + course.teachersecondname}</h3>
            </div>
          </div>
          <div class="details__update">
            <span class="details__subtitle">Последнее обновление курса</span>
            <h3 class="details__data-title">${course.updateDate2}</h3>
          </div>
          <div class="details__type-of-training">
            <span class="details__subtitle">Тип обучения</span>
            <h3 class="details__data-title">${course.studyType == 1 ? 'Очная' : 'Заочная'}</h3>
          </div>
        </div>
        <img src="img/course1.jpg" alt="" class="details__img">
        <div class="course__description">
          <h3 class="course__description-title">Описание курса</h3>
          <p class="course__description-details">${course.description}</p>
          <div class="description__list">
              <h3 class="description__list-title">Для кого подойдёт курс?</h3>
              <h3 class="details__data-title">${course.coursefor}</h3>
          </div>
        </div>
      </div>
      <div class="course__info">
        <div class="course__info-meta">
          <div class="course__info-prices">
            <span class="new__prices">${course.courseprice}</span>
          </div>
        </div>
          <div class="course__info-content">
            <div class="course__info-group">
              <i class='bx bxs-book-alt course__info-icon'></i>
              <h3 class="course__info-title"><span>Количество занятий:</span> ${course.coursecount}</h3>
            </div>
            <div class="course__info-group">
              <i class='bx bxs-user course__info-icon'></i>
              <h3 class="course__info-title"><span>Количество мест:</span> неограниченно</h3>
            </div>
            <div class="course__info-group">
              <i class='bx bxs-time course__info-icon'></i>
              <h3 class="course__info-title"><span>Длительность:</span>${course.courseTime}</h3>
            </div>
            <div class="course__info-group">
              <i class='bx bx-globe course__info-icon'></i>
              <h3 class="course__info-title"><span>Язык курса:</span> русский</h3>
            </div>
          </div>
          <div class="course__request">
            <a href="#" class="btnOrder" onclick="createOrder(${course.courseid},'${course.coursename}')">ОФОРМИТЬ ЗАКАЗ</a>
          </div>
      </div>

    </div>
  </section>
        `
        console.log( response )
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

function createOrder (courseid,coursename) {
    localStorage.setItem( 'courseid', courseid )
    localStorage.setItem( 'coursename', coursename )
    window.open( './request.html' )
}