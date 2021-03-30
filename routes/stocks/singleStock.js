const { Pool } = require('pg')

const pool = new Pool()

module.exports = (req, res) => {

  pool.connect((err, client, release) => {

    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      
      var stock = req.params.ticker
      res.status(200).json({ "ticker": stock });
      
    })

  })  
};