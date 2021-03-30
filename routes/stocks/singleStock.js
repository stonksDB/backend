var pool = require('../../db/postgres').pool;

//import { pool } from ('../../db/postgres')

module.exports = (req, res) => {

  //import { pool } from ('../../db/postgres')

  pool.connect((err, client, release) => {

    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }      

      //var stock = req.params.ticker
      res.status(200).json({ "ticker": result.rows });

    })

  })
};