var mysql = require('mysql');

var config = require('../../config/config.json')

var pool  = mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

exports.pool = pool;