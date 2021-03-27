module.exports = (req, res) => {
  stocks = req.params.ticker
  res.status(200).json({ "ticker":stocks });
};