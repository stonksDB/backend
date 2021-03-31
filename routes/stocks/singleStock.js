var pool = require('../../db/postgres').sequelize;

module.exports = (req, res) => {

  // pool.connect((err, client, release) => {

  //   if (err) {
  //     return console.error('Error acquiring client', err.stack)
  //   }

  //   const query = {
  //     name: 'fetch-past-values',
  //     text: 'SELECT * FROM past_values WHERE ticker = $1',
  //     values: [req.params.ticker.toUpperCase()],
  //   }



  // client.query(query, (err, result) => {
  //   release()
  //   if (err) {
  //     return console.error('Error executing query', err.stack)
  //   }
  //   res.status(200).json({ "past-values": result.rows });
  // })

  // })
};