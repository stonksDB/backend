const express = require('express')
const app = express()
const routes = require('./routes')

const port = 3000

app.use('/', routes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers