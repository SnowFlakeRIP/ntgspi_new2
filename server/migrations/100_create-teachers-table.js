/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('teachers', {
        teacherid:           {
            type:       'bigserial',
            primaryKey: true,
        },
        teachername:         {
            type: 'varchar(250)',
            comment:'Имя'
        },
        teachersecondname:   {
            type: 'varchar(250)',
            comment:'Фамилия'
        },
        teacherImg:{
            type:'varchar(250)'
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
        comment:'Таблица, где хранится информация о пользователе'
    });
    pgm.sql(`insert into public.teachers ( teachername, teachersecondname, "teacherImg")
values  ('Тамара', 'Юрьевна', './img/teacher1.jpg'),
        ('Елена', 'Анатольевна', './img/teacher5.jpg'),
        ('Наталья ', 'Леонидовна', './img/teacher3.jpg'),
        ('Николай', 'Вадимович', './img/teacher6.jpg'),
        ('Наталья ', 'Ивановна', './img/teacher4.jpg'),
        ('Алена ', 'Юрьевна', './img/teacher2.jpg');`);
}