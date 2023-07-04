const {pool} = require('../../dependes')
const {promises: fsAs} = require('fs');
const fs = require('fs')
const UUID = require('uuid');

async function getCourse(object) {
    const data = {
        message: 'error',
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const courses = await client.query(`SELECT *
                                            FROM courses c
                                                     INNER JOIN coursetypes ct ON ct.coursetypeid = c.coursetypes_coursetypeid
                                                     INNER JOIN teachers t on c.teacherid = t.teacherid`)
        data.message = courses.rows
        data.statusCode = 200
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

async function addCourse(object) {
    let data = {
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const createCourse = await client.query(`INSERT INTO courses (coursename, coursecount, coursetarget,
                                                                      courseprice, courseprogrammtarget,
                                                                      coursetypes_coursetypeid, teacherid,
                                                                      meta, img,"studyType")
                                                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                                                         $9,$10)`, [object.coursename, object.coursecount, object.coursetarget, 0, 0, object.coursetypes_coursetypeid, object.teachers_teacherid, object.meta, object.img,object.studyType])
        if (createCourse.rowCount > 0) {
            data = {
                success: true,
                statusCode: 200
            }
        } else {
            console.log('Не добавилась запись в список курсов')
        }
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

async function loadImage(object) {
    const data = {
        message: 'Не удалось загрузить изображение',
        success: false,
        statusCode: 400
    }
    let l1 = '', l2 = ''
    try {
        const uid = UUID.v4().split('-')
        let mpath = `../../../img/`
        l1 = mpath + uid[0].slice(0, 2);

        if (!fs.existsSync(l1)) {
            fs.mkdirSync(l1);
        }

        l2 = l1 + '/' + uid[1].slice(0, 2);

        if (!fs.existsSync(l2)) {
            fs.mkdirSync(l2);
        }

        mpath = l2 + '/' + uid[4] + `/${object.file[0].filename}`
        await fsAs.writeFile(mpath, object.file[0].data)
        data.message = mpath
        data.statusCode = 200
        data.success = true
    } catch (err) {
        console.log(err)
    }
    return data
}

async function confirmCourseRequest(object) {
    let data = {
        message: 'Не удалось подтвердить заявку на курс. Попробуйте позже',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)
        const changeReqStatus = await client.query(`UPDATE courserequest
                                                    SET "requestConfirm" = 2
                                                    WHERE id = $1 RETURNING "courseId", "userId"`, [object.requestId])
        if (changeReqStatus.rowCount > 0) {
            console.log(`успешно обновили состояние запроса`)
            const result = await client.query(`INSERT INTO courselisteners ("courseId", "userId")
                                               VALUES ($1,
                                                       $2)`, [changeReqStatus.rows[0].courseId, changeReqStatus.rows[0].userId])
            if (result.rowCount > 0) {
                await client.query('COMMIT')
                data = {
                    message: 'Пользователь успешно добавлен к курсу',
                    success: true,
                    statusCode: 200
                }
            } else {
                await client.query(`ROLLBACK`)
                console.log(`Не добавилась запись к courselisteners`)
            }
        } else {
            await client.query(`ROLLBACK`)
            console.log(`Не удалось обновить состояние запроса`)
        }
    } catch (err) {
        await client.query(`ROLLBACK`)
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

module.exports = {
    getCourse: getCourse,
    addCourse: addCourse,
    loadImage: loadImage
}