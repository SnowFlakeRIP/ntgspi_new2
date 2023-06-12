/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up =  pgm => {
    pgm.addColumns('userdata', {
        passportFrom: {
            type: 'varchar(500)',
        },
        passportReg:{
            type:'varchar(500)',
        },
        snils:{
            type:'varchar(500)',
        }
    }, {
        ifNotExists: true,
    });

};

exports.down = pgm => {
    // pgm.dropColumns('users', [ 'coworkingTestDayUsed' ]);
};
