const pdfMakePrinter = require('pdfmake');
const {fonts, pool, writeFile} = require('../../dependes')
const documentsPDF = require('../../documents/create/documentsPDF')
const constants = require("../../constants");
const QRCode = require( "qrcode" );

function docFileFromStream(document, path, isUpload) {
    const chunks = [];
    let result = null;
    return new Promise(function (resolve, reject) {
        try {
            document.on('data', function (chunk) {
                chunks.push(chunk);
            });
            document.on('end', async function () {
                result = Buffer.concat(chunks);
                console.log('end');
                if (isUpload)
                    resolve(result);
                else {
                    console.log('saving file by path');
                    await writeFile(path, result);
                    resolve(result.toString('base64'));
                }
            });
            document.on('error', reject);
            document.end();
        } catch (error) {
            console.log('docFileFromStream ERROR');
            console.log(error);
            reject(null);
        }
    });
}

async function DOPWithLess18(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithLess18])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithLess18, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')               AS "date",
                                                  d.id                                       AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar   AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar    AS "coursePrice",
                                                  c.coursename,
                                                  c.coursehours
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithLess18])
        if (result.rows.length > 0) {
            let pdfDate = {
                docNumber: result.rows[0].docNumber,
                date: result.rows[0].date,
                startCourse: result.rows[0].startCourse,
                endCourse: result.rows[0].endCourse,
                coursePrice: result.rows[0].coursePrice,
                courseName: result.rows[0].coursename,
                courseHours: result.rows[0].coursehours
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.DOPWithLess18(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function DOPWithCustomer(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  CONCAT_WS(' ', ud."lastName", ud.name, ud."middleName") AS "FIO",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.DOPWithCustomer(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function upgradeQualify(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  CONCAT_WS(' ', ud."lastName", ud.name, ud."middleName") AS "FIO",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.upgradeQualify(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function profReset(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  CONCAT_WS(' ', ud."lastName", ud.name, ud."middleName") AS "FIO",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.profReset(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function consentPersonalCustomer(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    console.log('object',object)
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  CONCAT_WS(' ', ud."lastName", ud.name, ud."middleName") AS "FIO",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth",
                                                  ud."passportReg"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.consentPersonalCustomer(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function consentPersonalLess18(object) {
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  CONCAT_WS(' ', ud."lastName", ud.name, ud."middleName") AS "FIO",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.consentPersonalLess18(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function KPKAndPP(object) {
    console.log(object)
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const checkNeedInsert = await client.query(`SELECT *
                                                    FROM documents
                                                    WHERE "courseId" = $1
                                                      AND "userId" = $2
                                                      AND type = $3`, [object.courseId, object.userId, constants.documentType.DOPWithCustomer])
        if (checkNeedInsert.rows.length === 0) {
            const insertToTable = await client.query(`INSERT INTO documents (type, "userId", "courseId")
                                                      VALUES ($1, $2,
                                                              $3)
                                                      RETURNING id`, [constants.documentType.DOPWithCustomer, object.userId, object.courseId])
            if (insertToTable.rows.length > 0) {
                console.log(`Успешно добавили запись в documents`)
            } else {
                console.log(`Добавление записи не удалось. Завершаем работу`)
            }
        }
        const result = await client.query(`SELECT to_char(now(), 'dd.mm.YYYY')                            AS "date",
                                                  d.id                                                    AS "docNumber",
                                                  (c.meta::jsonb ->> 'courseBegin')::varchar              AS "startCourse",
                                                  (c.meta::jsonb ->> 'courseEnd')::varchar                AS "endCourse",
                                                  (c.meta::jsonb ->> 'newPrice')::varchar                 AS "coursePrice",
                                                  c.coursename                                            AS "courseName",
                                                  c.coursehours                                           AS "courseHours",
                                                  ud."passportNumber",
                                                  ud."passportSerial",
                                                  ud."lastName", 
                                                  ud.name, 
                                                  ud."middleName",
                                                  ud."userPhone",
                                                  u.email                                                 AS "userEmail",
                                                  to_char(ud."dateBirth", 'dd.mm.YYYY')                   AS "dateBirth",
                                                  ud."passportFrom",
                                                  ud.snils,
                                                  ud."passportReg"
                                           FROM users u
                                                    INNER JOIN documents d on u."userId" = d."userId"
                                                    INNER JOIN courses c on d."courseId" = c.courseid
                                                    INNER JOIN userdata ud on u."userId" = ud."userId"
                                           WHERE u."userId" = $1
                                             AND c.courseid = $2
                                             AND d.type = $3`, [object.userId, object.courseId, constants.documentType.DOPWithCustomer])
        if (result.rows.length > 0) {
            let pdfDate = {
                ...result.rows[0]
            }
            let doc = printer.createPdfKitDocument(await documentsPDF.KPKAndPP(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}

async function invoicePayment(object) {
    console.log(`фукнция`)
    let data = {
        message: 'error',
        success: false,
        statusCode: 400
    }
    let printer = new pdfMakePrinter(fonts);
    const client = await pool.connect()
    try {
        const result = await client.query( `SELECT ud."lastName", ud.name, ud."middleName"
                                            FROM users u
                                                     INNER JOIN userdata ud on u."userId" = ud."userId"
                                            WHERE u."userId" = $1`, [ object.userId ] )
        if ( result.rows.length > 0 ) {

            let desc = 'Оплата курса';
            let qrData = `ST00012|Name=Филиал РГППУ в г. Нижнем Тагиле|PersonalAcc=40503810262484900001|BankName=ПАО КБ «УБРиР»|BIC=046577795|CorrespAcc=30101810900000000795|PayeeINN=6663019889|KPP=662343001|Purpose=${ desc }|Sum=${ object.amount }|LastName=${ result.rows[0].lastName }|FirstName=${ result.rows[0].name }|MiddleName=${ result.rows[0].middleName }`;
            let qrBase64 = await QRCode.toDataURL( qrData );
            if ( !data.kpp ) {
                data.kpp = '';
            }
            if ( !data.address ) {
                data.address = '';
            }
            let pdfDate = {
                ...result.rows[0],
                ...object,
                qr:qrBase64
            }
            let printer = new pdfMakePrinter( fonts );
            let doc = printer.createPdfKitDocument(await documentsPDF.paymentOrder(pdfDate))
            let docFile = await docFileFromStream(doc, '', true)
            data = {
                message: docFile,
                statusCode: 200,
                success: true
            }
        } else {
            console.log('Не удалось найти информацию по курсам')
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return data
}


module.exports = {
    docFileFromStream: docFileFromStream,
    DOPWithLess18: DOPWithLess18,
    DOPWithCustomer: DOPWithCustomer,
    upgradeQualify: upgradeQualify,
    profReset: profReset,
    consentPersonalCustomer: consentPersonalCustomer,
    consentPersonalLess18: consentPersonalLess18,
    KPKAndPP: KPKAndPP,
    invoicePayment:invoicePayment,

}