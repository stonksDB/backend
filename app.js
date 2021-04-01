const express = require('express')
const app = express()
const routes = require('./routes')

const port = 8082

app.use('/', routes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port} funziona?` )
})