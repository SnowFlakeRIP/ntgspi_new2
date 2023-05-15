/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('emailcodes', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        createdAt: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        },
        codeExpired: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        },
        code: {
            type: 'varchar(4)'
        },
        email: {
            type: 'varchar(1000)'
        },
        used: {
            type: 'boolean',
            default: false
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица, кодами сброса(или чего-нить ещё) отправленные на почту'
    })
}