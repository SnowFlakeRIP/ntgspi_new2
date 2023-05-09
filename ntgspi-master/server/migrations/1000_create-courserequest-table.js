/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('courserequest', {
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
        requestConfirm: {
            type: 'boolean',
            default: false
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица документов'
    })
}
