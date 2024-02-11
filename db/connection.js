const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'vet',
    port: '3306',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Se conecto a la db correctamente');
});

module.exports = connection;
