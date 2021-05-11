var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('/stocks to retrive stock information\n/news to retrieve news information!');
});

module.exports = router;