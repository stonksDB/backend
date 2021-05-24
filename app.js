const config = require('./config/config.json')
const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require("body-parser")

// swagger
/*
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
var swaggerJSDoc = require('swagger-jsdoc')
const specs = swaggerJSDoc(swaggerDocument)
*/


// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/api/', routes);

// shows the stonks Website
app.use("/", express.static(__dirname + "/site")); 

//app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, () => {
  console.log(`Running app at http://localhost:${config.port}`)
})