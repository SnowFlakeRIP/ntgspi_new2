/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = pgm => {
    pgm.createTable('news', {
        newsId: {
            type: 'bigserial',
            primaryKey: true
        },
        newsTitle: {
            type: 'varchar(1000)'
        },
        newsText: {
            type: 'text'
        },
        newsPath:{
          type:'varchar(500)'
        },
        newsDate:{
            type:'timestamp with time zone',
            default:pgm.func('now()')
        },
    }, {
        ifNotExists: true,
    })
}
