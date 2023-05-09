/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('userdata', {
        userDataId: {
            type: 'bigserial',
            primaryKey: true
        },
        userId: {
            type: 'bigint'
        },
        userPhone: {
            type: 'varchar(500)',
            default: null
        },
        passportSerial: {
            type: 'varchar(500)',
            default: null
        },
        passportNumber: {
            type: 'varchar(500)',
            default: null
        },
        lastName: {
            type: 'varchar(500)',
            default: null
        },
        name: {
            type: 'varchar(500)',
            default: null
        },
        middleName: {
            type: 'varchar(500)',
            default: null
        },
        dateBirth: {
            type: 'timestamp with time zone',
        },
        gender:{
            type:'varchar(150)'
        },
        city:{
            type:'varchar(150)'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица документов'
    })
}
