const mysql = require('mysql')

module.exports.db = mysql.createPool({
  connectionLimit: 100,
  host: 'mysql',
  user: 'root',
  password: 'psw',
  database: 'myapp',
  multipleStatements: true
})
