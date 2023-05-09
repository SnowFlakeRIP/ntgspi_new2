/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('accesstokens', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        createdAt: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        },
        token: {
            type: 'varchar(5000)'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица, где хранится токены авторизованных пользователей'
    })
}