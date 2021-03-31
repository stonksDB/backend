const { models } = require('../../sequelize');

module.exports = async (req, res) => {

  try {

    const stocks = await models.stock.findAll({
      where: {
        mic: req.params.mic
      }
    });

    res.status(200).json(stocks);
  } catch (error) {
    console.log("there was an error", error)
  }


};