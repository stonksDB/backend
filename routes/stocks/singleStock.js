var pool = require('../../db/postgres').pool;

module.exports = (req, res) => {

  //import { pool } from ('../../db/postgres')

  pool.connect((err, client, release) => {

    const query = {    
      name: 'fetch-data',
      text: 'SELECT * FROM past_values WHERE ticker = $1',
      values: [ req.params.ticker.toUpperCase() ],
    }

    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(query, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }      

      //var stock = req.params.ticker
      res.status(200).json({ "ticker": result.rows });

    })

  })
};