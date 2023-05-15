/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('coursetypes', {
        coursetypeid: {
            type: 'bigserial',
            primaryKey: true,
        },
        coursetypename: {
            type: 'varchar(250)',
            comment: 'Имя'
        },
        createdAt: {
            type: 'timestamp with time zone',
            default: pgm.func('now()'),
            comment: 'Дата создания био'
        },
        updatedAt: {
            type: 'timestamp with time zone',
            default: pgm.func('now()'),
            comment: 'Время последнего обновления био'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица, где хранится информация о пользователе'
    });
    pgm.sql(`insert into public.coursetypes (coursetypename)
             values ('Курсы подготовки ЕГЭ'),
                    ('Повышение квалификации'),
                    ('Профессиональная переподготовка');`)
}