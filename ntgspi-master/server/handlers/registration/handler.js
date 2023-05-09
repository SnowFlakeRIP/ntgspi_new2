const {pool} = require('../../dependes')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

async function registrationUser(object) {
    let data = {
        success: false,
        message: 'Не удалось добавить пользователя',
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const checkHaveAccWithEmail = await client.query(`SELECT *
                                                          FROM users
                                                          WHERE email = $1
                                                             OR login = $1`, [object.email])
        if (checkHaveAccWithEmail.rows.length > 0) {
            data = {
                success: false,
                message: 'Пользователь с такой электронной почтой уже зарегистрирован.',
                statusCode: 200
            }
        } else {
            const checkHaveAccWithLogin = await client.query(`SELECT *
                                                              FROM users
                                                              WHERE login = $1
                                                                 OR email = $1`, [object.login])
            if (checkHaveAccWithLogin.rows.length > 0) {
                data = {
                    success: false,
                    message: 'Пользователь с таким логином уже зарегистрирован, придумайте другой логин.',
                    statusCode: 200
                }
            } else {
                const result = await client.query(`INSERT INTO users (login, email, password)
                                                   VALUES ($1, $2, $3)
                                                   RETURNING "userId"`, [object.login, object.email, object.password])
                if (result.rowCount > 0) {
                    const resInsertUserData = await client.query(`INSERT INTO userdata ("userId") VALUES ($1)`, [ result.rows[0].userId ])
                    if (resInsertUserData.rowCount > 0) {
                        await client.query('COMMIT')
                        data = {
                            success: true,
                            message: 'Пользователь успешно зарегистрирован, перейдите на страницу авторизации для продолжения',
                            statusCode: 200
                        }
                    } else {
                        await client.query(`ROLLBACK`)
                        console.log(`Не добавилась запись в userdata`)
                    }
                } else {
                    await client.query(`ROLLBACK`)
                    console.log('Не удалось добавить запись в users')
                }
            }
        }
    } catch (err) {
        await client.query('ROLLBACK')
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function authorizationUser(object) {
    let data = {
        success: false,
        message: 'error',
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const result = await client.query(`SELECT *
                                           FROM users
                                           WHERE (email = $1 OR login = $1)
                                             AND password = $2`, [object.login, object.password])
        if (result.rows.length > 0) {
            const token = await jwt.sign(result.rows[0], '12345678');
            console.log({token})
            const insertToken = await client.query(`INSERT INTO accesstokens (token)
                                                    VALUES ($1)`, [token])
            if (insertToken.rowCount > 0) {
                data = {
                    success: true,
                    message: 'Вы успешно авторизовались',
                    statusCode: 200,
                    token
                }
            } else {
                console.log('не инсертнулся токен')
            }
        } else {
            data = {
                success: false,
                message: 'Неверный логин/электронная почта или пароль',
                statusCode: 200
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function sendEmailToResetPassword(object) {
    let data = {
        message: 'Не удалось отправить уведомление о сбросе на почту. Попробуйте позже или обратитесь в тех.поддержку',
        success: false,
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const checkUser = await client.query(`SELECT *
                                              FROM users
                                              WHERE email = $1`, [object.email])
        console.log(checkUser.rows.length > 0)
        if (checkUser.rows.length > 0) {
            const code = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
            const expired = Date.now() + 600000
            console.log(expired)
            const result = await client.query(`INSERT INTO emailcodes (code, email, "codeExpired")
                                               VALUES ($1, $2, $3)`, [code, object.email, new Date(expired)])
            if (result.rowCount > 0) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.yandex.ru',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: process.env.HOST_EMAIL,
                        pass: process.env.HOST_PASS,
                    },
                });
                await transporter.sendMail({
                    from: process.env.HOST_EMAIL, // sender address
                    to: checkUser.rows[0].email, // list of receivers
                    subject: 'Российский государственный профессионально-педагогический университет', // Subject line
                    text: `Код для сброса пароля ${code}. Код действителен в течении 10 минут`,
                });
                data = {
                    message: 'Пароль для сброса успешно отправлен',
                    success: true,
                    statusCode: 200
                }
            } else {
                console.log('Не удалось добавить запись в emailcodes. Код не будет отправлен')
            }
        } else {
            data = {
                message: 'Данная электронная почта не зарегистрирована',
                success: false,
                statusCode: 200
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function checkCode(object) {
    let data = {
        success: false,
        message: 'Не удалось сбросить пароль. Попробуйте позже',
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const result = await client.query(`SELECT *
                                           FROM emailcodes
                                           WHERE "codeExpired" > now()
                                             AND email = $1
                                             AND code = $2
                                             AND used = false`, [object.email, object.code])
        if (result.rows.length > 0) {
            const dropCode = await client.query(`UPDATE emailcodes
                                                 SET used = true
                                                 WHERE id = $1` [result.rows[0].id])
            data = {
                success: true,
                message: 'Введите новый пароль:',
                statusCode: 200
            }
        } else {
            data = {
                success: false,
                message: 'Код неверен или просрочен',
                statusCode: 200
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function resetPassword(object) {
    let data = {
        success: false,
        message: 'Не удалось сменить пароль. Попробуйте позже',
        statusCode: 400
    }
    const client = await pool.connect()
    try {
        const result = await client.query(`UPDATE users
                                           SET password = $1
                                           WHERE email = $2`, [object.password, object.email])
        if (result.rowCount > 0) {
            data = {
                success: true,
                message: "Пароль успешно изменён. Перейдите на страницу входа для авторизации",
                statusCode: 200
            }
        } else {
            console.log('Не удалось обновить пароль')
        }
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return data
}

module.exports = {
    registrationUser: registrationUser,
    authorizationUser: authorizationUser,
    sendEmailToResetPassword: sendEmailToResetPassword,
    checkCode: checkCode,
    resetPassword: resetPassword
}