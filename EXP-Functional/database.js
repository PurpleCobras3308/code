var pgp = require('pg-promise')();

const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'projectdb',
   user: 'postgres',
   password: 'password'
};

//Setup for deployment. Comment out above dbConfig
/*const dbConfig = process.env.DATABASE_URL; = {
   host: '',
   port: ,
   database: '',
   user: '',
   password: ''
};*/

var db = pgp(dbConfig);

module.exports = db;
