/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('documents', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        type: {
            type: 'bigint'
        },
        userId: {
            type: 'bigint'
        },
        courseId: {
            type: 'bigint'
        },
        documentPath: {
            type: 'varchar(500)'
        },
        docCreatedAt: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица документов'
    })
}