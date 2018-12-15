var pgp = require('pg-promise')();

// Local Testing
/*const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'projectdb',
   user: 'postgres',
   password: 'password'
};*/

//Deployment
const dbConfig = process.env.DATABASE_URL;

var db = pgp(dbConfig);

module.exports = db;
