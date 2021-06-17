const follow = require('express').Router();
const sequelize = require('./../../../sequelize')

/**
 * add to db the new sector followed by the user
 */
follow.post('/:sector', (req, res) => {
  const sector_id = req.params.sector;

  if(sector_id>= 0 && sector_id <= 14) { // check if value meaningful
    // create new tuple
    const new_db_tuple = {
      share_holder_id: req.session.user.share_holder_id,
      sector_id: sector_id
    };

    // insert in tuple
    sequelize.transaction(async (t) => {
      await sequelize.models.follow.create(
        new_db_tuple,
        {transaction: t}
      );
    })
    .then(_ => { return res.sendStatus(200); }) 
    .catch(_ => { return res.status(500).send('Error on database update!') }); // if error on updating db
  }
  else 
    res.sendStatus(400);
})

/**
 * remove from db the sector unfollowed by the user
 */
follow.delete('/:sector', (req, res) => {
  const sector_id = req.params.sector;

  if(sector_id>= 0 && sector_id <= 14) { // check if value meaningful
    // insert in tuple
    sequelize.transaction(async (t) => {
      await sequelize.models.follow.destroy(
        {
          where: {
            share_holder_id: req.session.user.share_holder_id,
            sector_id: sector_id
          }},
        {transaction: t}
      );
    })
    .then(_ => { return res.sendStatus(200); }) 
    .catch(_ => { return res.status(500).send('Error on database update!') }); // if error on updating db
  }
  else 
    res.sendStatus(400);
})

module.exports = follow;