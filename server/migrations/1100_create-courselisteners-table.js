/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('courselisteners', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        courseId: {
            type: 'bigint'
        },
        userId: {
            type: 'bigint',
            default: null
        },
        isPaid:{
            type:'boolean',
            default:false
        },
        payDate:{
            type:'timestamp with time zone',
            default:pgm.func('now()')
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица документов'
    })
}
