const like = require('express').Router();
const sequelize = require('./../../../sequelize')

/**
 * add to db the new sector liked by the user
 */
like.post('/:ticker', (req, res) => {
  const ticker = req.params.ticker;
  console.log(`Receiving request to insert like for ticker: ${ticker}`);

  // create new tuple
  const new_db_tuple = {
    share_holder_id: req.session.user.share_holder_id,
    ticker: ticker
  };

  // insert in tuple
  sequelize.transaction(async (t) => {
    await sequelize.models.like.create(
      new_db_tuple,
      {transaction: t}
    );
  })
  .then(_ => { return res.sendStatus(200); }) 
  .catch(err => { 

    if (err["name"] == "SequelizeForeignKeyConstraintError") // ticker not defined 
      // handle foreign key constraint
      return res.status(400).send('Invalid Ticker');
    else 
      return res.status(500).send('Error on database update!') 
  });
});

/**
 * remove from db the sector unliked by the user
 */
like.delete('/:ticker', (req, res) => {
  const ticker = req.params.ticker;

  // delete tuple
  sequelize.transaction(async (t) => {
    await sequelize.models.like.destroy(
      {
        where: {
          share_holder_id: req.session.user.share_holder_id,
          ticker: ticker
        }},
      {transaction: t}
    );
  })
  .then(_ => { return res.sendStatus(200); }) 
  .catch(_ => { return res.status(500).send('Error on database update!') }); // if error on updating db
})

module.exports = like;