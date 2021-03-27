var mysql = require('../../db/mysql').pool;

module.exports = (req, res) => {

  mysql.getConnection(function (err, conn) {
    conn.query("select * from history", function (err, rows) {
      res.json(rows);
    })
  })

};