const {pool} = require('../../dependes')
const {uploadFile,agreementFiles} = require('../../filesystem')
/**
 * Создание новости
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function createNews (object, user, apiRoute, headers) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'createNews';
    const client = await pool.connect();
    try {
        const news = await client.query( `insert into news ("newsTitle", "newsText", "newsDate")
                                          values ($1, $2,
                                                  case
                                                      when $3::timestamp is not null then $3
                                                      else now()::timestamp end)`,
            [
                object.newsTitle,
                object.newsText,
                object.newsDate,
            ]
        )
        if ( news.rowCount > 0 ) {
            data.message = {
                success:true
            }
            data.statusCode = 200
        }
        else {
            console.log( 'ошибка при создании новости' )
        }
    }
    catch ( err ) {
        console.log( err )
    }
    finally {
        client.release();
    }
    return data
}

/**
 * Получение всех новостей
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function showNews (object) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'showNews';
    const client = await pool.connect();
    try {
        const news = await client.query(`select *,to_char("newsDate",'dd-mm-yyyy') as "newsDate2" from news order by "newsDate" desc limit 6`)
        data.message = news.rows
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

/**
 * Получение детальной инфы
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function showNewsDetailed (object) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'showNewsDetailed';
    const client = await pool.connect();
    try {
        const news = await client.query(`select * from news where "newsId" = $1`,[object.newsId])
        if(news.rows.length > 0){
            data.message = news.rows
            data.statusCode = 200
        }
    }
    catch ( err ) {
        console.log(err)
    }
    finally {
        client.release();
    }
    return data
}

/**
 * Обнолвение
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function updateNews (object, user, apiRoute, headers) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'updateNews';
    const client = await pool.connect();
    try {
        const update = await client.query( `update news
                                            set "newsDate"  = $1,
                                                "newsText"  = $2,
                                                "newsTitle" = $3
                                            where "newsId" = $4`,
            [
                object.newsDate,
                object.newsText,
                object.newsTitle,
                object.newsId,
            ]
        )
        if(update.rowCount > 0) {
            data.message = {
                success:true
            }
            data.statusCode = 200
        }
    }
    catch ( err ) {
        console.log( err )
    }
    finally {
        client.release();
    }
    return data
}

/**
 * Удаление
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function removeNews (object, user, apiRoute, headers) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'removeNews';
    const client = await pool.connect();
    try {
        const deleteNews = await client.query( `delete
                                                from news
                                                where "newsId" = $1`, [ object.newsId ] )

        if ( deleteNews.rowCount > 0 ) {
            data.message = {
                success:true
            }
            data.statusCode = 200
        }
    }
    catch ( err ) {
        console.log( err )
    }
    finally {
        client.release();
    }
    return data
}

/**
 * Загрузке фотки
 * @param {Object} object
 * @param {Object} user
 * @param {Object} user.userId
 * @param {String} apiRoute
 * @param {String} headers
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function uploadImage (object) {
    let data = {
        message:   'error',
        statusCode:400,
    };
    const funcName = 'uploadImage';
    const client = await pool.connect();
    let wasBegin = false
    try {
        const upload = uploadFile(agreementFiles,object.file[0])
        if(upload.success){
            await client.query('begin')
            wasBegin = true

            const removeOld = await client.query( `update news
                                                   set "newsPath" = null
                                                   where "newsId" = $1`, [ object.newsId ] )


            const updateNew = await client.query( `update news
                                                   set "newsPath" = $1
                                                   where "newsId" = $2`, [
                upload.path,
                object.newsId
            ] )

            if ( updateNew.rowCount > 0 ) {
                await client.query( 'commit' )
                data.message = {
                    success:true
                }
                data.statusCode = 200
            }
            else {
                await client.query( 'rollback' )
            }

        }
        else {
            console.log(`ОШибка при загрузке фотки`)
            console.log(upload)
        }
    }
    catch ( err ) {
        console.log(err)
        if(wasBegin){
            await client.query('rollback')
        }
    }
    finally {
        client.release();
    }
    return data
}


module.exports = {
    createNews:      createNews,
    showNews:        showNews,
    showNewsDetailed:showNewsDetailed,
    updateNews:      updateNews,
    removeNews:      removeNews,
    uploadImage:     uploadImage,

}