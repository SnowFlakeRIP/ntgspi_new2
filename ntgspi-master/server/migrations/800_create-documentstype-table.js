/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('documentstype', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        name: {
            type: 'varchar(500)'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица документов'
    })

    pgm.sql(`INSERT INTO documentstype (name) VALUES ('Доп. образование несовершеннолетних'), ('Доп. образование совершеннолетних'), ('Повышение квалификации'), ('Профессиональная переподготовка'), ('Согласие на обработку персональных данных совершеннолетних'), ('Согласие на обработку персональных данных несовершеннолетних'), ('Заявление на КПК и ПП')`)
}
