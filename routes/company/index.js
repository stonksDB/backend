const companies = require('express').Router();
const baseUrl = "127.0.0.1:5000"
//const baseUrl = "25.68.176.166"

const axios = require('axios')

companies.get("/", getCompany);

async function getCompany(req, res) {

   res.send("ciaoo")

};

module.exports = companies;