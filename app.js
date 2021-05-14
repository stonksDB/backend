const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require("body-parser")
// swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
var swaggerJSDoc = require('swagger-jsdoc')

const port = 8082

const specs = swaggerJSDoc(swaggerDocument)

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/api/', routes);

app.use("/", express.static(__dirname + "/site"));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

//app.use(cookieParser())

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})