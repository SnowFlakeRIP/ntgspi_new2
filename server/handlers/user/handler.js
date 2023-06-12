const {pool} = require("../../dependes");

async function setUserData(object, info) {
    let data = {
        message: 'Произошла ошибка про сохранении данных. Попробуйте позже',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        await client.query('begin')
        const result = await client.query( `UPDATE userdata
                                            SET "userPhone" = $1,
                                                "passportSerial" = $2,
                                                "passportNumber" = $3,
                                                "lastName" = $4,
                                                "name" = $5,
                                                "middleName" = $6,
                                                "dateBirth" = $7,
                                                "gender" = $9,
                                                "city" = $10,
                                                "passportFrom" = $11,
                                                "passportReg" = $12,
                                                "snils" = $13
                                            WHERE "userId" = $8`, [
            object.userPhone,
            object.passportSerial,
            object.passportNumber,
            object.lastName,
            object.name,
            object.middleName,
            object.dateBirth,
            info.userId,
            object.gender,
            object.city,
            object.passportFrom,
            object.passportReg,
            object.snils,
        ] )
        if (result.rowCount > 0) {

            const updateUser = await client.query( `update users
                                                    set email = $1
                                                    where "userId" = $2`, [
                object.email,
                info.userId
            ] )

            if(updateUser.rowCount > 0){
                await client.query('commit')

                data = {
                    message: 'Данные успешно сохранены',
                    success: true,
                    statusCode: 200
                }
            }
            else{
                await client.query('rollback')
            }

        } else {
            console.log(`Не удалось обновить userdata`)
            await client.query('rollback')
        }
    } catch (err) {
        console.log(err)
        await client.query('rollback')
    } finally {
        client.release()
    }
    return data
}

async function getUserData(object, info) {
    let data = {
        message: 'Не удалось получить данные пользователя. Попробуйте позже.',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const result = await client.query(`SELECT *,to_char("dateBirth",'YYYY-MM-DD') as "dateBirth2"
                                           FROM userdata
                                                    INNER JOIN users u on userdata."userId" = u."userId"
                                           WHERE u."userId" = $1`, [info.userId])
        if (result.rows.length > 0) {
            data = {
                success: true,
                message: result.rows[0],
                statusCode: 200
            }
        }
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

async function joinToCourse(object, info) {
    let data = {
        message: 'Не удалось присоединиться к курсу. Попробуйте позже',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const userData = await client.query(`SELECT *,
                                                    concat_ws(' ', "lastName", name, "middleName") AS "userFIO",
                                                    email                                          AS "userEmail"
                                             FROM userdata
                                                      INNER JOIN users u on userdata."userId" = u."userId"
                                             WHERE u."userId" = $1`, [info.userId])
        console.log(userData.rows[0])
        if (userData.rows.length > 0) {
            const result = await client.query(`INSERT INTO courserequest ("courseId", "userId")
                                               VALUES ($1, $2)`, [object.courseId, info.userId])
            if (result.rowCount > 0) {
                data = {
                    message: 'Вы успешно записались на курс',
                    success: true,
                    statusCode: 200
                }
            } else {
                console.log(`Не удалось добавить запись в courserequest`)
            }
        } else {
            data = {
                message: 'Вы не зарегистрированы, зарегистрируйтесь и повторите попытку',
                success: false,
                statusCode: 200
            }
        }
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

async function myCourse(object, info) {
    let data = {
        message: 'Не удалось найти курсы. Попробуйте позже',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const result = await client.query(`SELECT *
                                           FROM courselisteners cl
                                                    INNER JOIN courses c ON c.courseid = cl."courseId"
                                                    inner join userdata u on cl."userId" = u."userId"
                                           WHERE cl."userId" = $1`, [info.userId])
        data = {
            message: result.rows,
            success: true,
            statusCode: 200
        }
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

/**
 * Мои заявки
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function getCourseReg (object, user) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'getCourseREg';
    const client = await pool.connect();
    try {
        const result = await client.query( `select *
                                            from courserequest cr
                                                     inner join courses c on cr."courseId" = c.courseid
                                            where "userId" = $1 order by id desc`,[user.userId] )
        data.message = result.rows
        data.statusCode = 200
    }
    catch ( err ) {
        console.log(err)
    }
    finally {
        client.release();
    }
    return data
}

module.exports = {
    setUserData: setUserData,
    getUserData: getUserData,
    joinToCourse:joinToCourse,
    myCourse:    myCourse,
    getCourseReg:getCourseReg,

}