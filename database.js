var pgp = require('pg-promise')();

const dbConfig = process.env.DATABASE_URL; = {
   host: 'localhost',
   port: 5432,
   database: 'projectDB',
   user: 'postgres',
   password: 'password' // Add field for deployment testing
};

var db = pgp(dbConfig);

module.exports = db;
