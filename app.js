const config = require('./config/config.json')
const express = require('express')
const cors = require('cors')
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

app.use(cors())

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * safe implementation of bodyParser.josn()
 * if error, catch them and doesn't fails
 */
app.use((req, res, next) => {
  bodyParser.json()(req, res, err => {
      if (err) // catches erros - when invalid json input
          return res.status(400).send(`${err}`); // Bad request
      next();
  });
});

app.use('/api/', routes);

// shows the stonks Website
app.use("/", express.static(__dirname + "/site")); 

//app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, () => {
  console.log(`Running app at http://localhost:${config.port}`)
})