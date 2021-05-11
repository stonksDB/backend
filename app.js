const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require("body-parser")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
var swaggerJSDoc = require('swagger-jsdoc')

const port = 8082

const specs = swaggerJSDoc(swaggerDocument)

app.use('/api/', routes);

app.use("/", express.static(__dirname + "/site"));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})