/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('courses', {
        courseid: {
            type: 'bigserial',
            primaryKey: true,
        },
        coursename: {
            type: 'varchar(250)',
            comment: 'Имя'
        },
        coursehours: {
            type: 'int',
        },
        coursecount:{
          type:'int'
        },
        coursetarget: {
            type:'varchar(500)'
        },
        coursetypes_coursetypeid:{
            type:'int'
        },
        courseprice:{
          type:'numeric(30,2)'
        },
        courseprogrammtarget:{
          type: 'int'
        },
        teacherid:{
            type:'int'
        },
        meta:{
            type:'jsonb'
        },
        img:{
            type:'varchar(250)'
        },
        updateDate:{
            type:'timestamp with time zone',
            default:pgm.func('now()')
        },
        studyType:{
            type:'int',
            default:1
        },
        description:{
            type:'varchar(2500)'
        },
        coursefor:{
            type:'varchar(500)'
        },
        courseTime:{
            type:'int'
        }
    }, {
        ifNotExists: true,
        comment: 'Таблица, где хранится информация о пользователе'
    });
    pgm.sql(`insert into courses (coursename, coursehours, coursetarget, courseprice, courseprogrammtarget, coursetypes_coursetypeid, teachers_teacherid, meta, img)
values  ('Подготовка к ЕГЭ по профильной математике', 1, '1', 1.00, '1', 1, 1, '{"rating": 4.5, "newPrice": 3200, "oldPrice": 8500, "ratingCount": 48, "lessonsCount": 25, "courseBegin": "09.06.2023", "courseEnd": "09.09.2023"}', './img/course1.jpg'),
        ('das', 1, 'das', 0.00, '0', 1, 1, '{"rating": "213", "newPrice": "312", "oldPrice": "321", "ratingCount": "312", "lessonsCount": "123", "courseBegin": "09.06.2023", "courseEnd": "09.09.2023"}', './img/map.png');`)
}