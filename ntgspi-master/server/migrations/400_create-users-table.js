/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('users', {
        userId: {
            type: 'bigserial',
            primaryKey: true
        },
        login: {
            type: 'varchar(500)',
        },
        email: {
            type: 'varchar(1000)'
        },
        password: {
            type: 'varchar(100)'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица, где хранится информация о пользователе'
    })
}