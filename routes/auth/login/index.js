const auth = require('express').Router();

auth.get("/", (req, res) => {
    res.send("hello from ./login folder");
});

module.exports = auth;