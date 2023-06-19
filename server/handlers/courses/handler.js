const {pool} = require('../../dependes')

async function getCourseDetailed (object, info) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const course = await client.query( `select *,to_char("updateDate",'DD.MM.YYYY') as "updateDate2"
                                            from courses c
                                                     inner join teachers t on c.teacherid = t.teacherid
                                                    inner join coursetypes c2 on c2.coursetypeid = c.coursetypes_coursetypeid
                                            where courseid = $1`,[object.courseid] )

        if(course.rows.length > 0){
            data.message = course.rows[0]
            data.statusCode = 200
        }
    }
    catch ( e ) {
        console.log( e )
    }
    finally {
        client.release()
        console.log( `client release()` )
    }
    return data
}

async function getAllCourses (object, info) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const course = await client.query(`SELECT *
                                           FROM courses c
                                                    INNER JOIN teachers t ON c.teacherid = t.teacherid
                                                    INNER JOIN coursetypes c2 on c2.coursetypeid = c.coursetypes_coursetypeid`);
        
        if(course.rows.length > 0){
            data.message = course.rows
            data.statusCode = 200
        }
    }
    catch ( e ) {
        console.log( e )
    }
    finally {
        client.release()
        console.log( `client release()` )
    }
    return data
}


module.exports = {
    getCourseDetailed:  getCourseDetailed,
    getAllCourses:      getAllCourses,
    
}