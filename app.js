const config = require('./config/config.json')
const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const bodyParser = require("body-parser")

const corsOptions = {
  origin: "*", // should be updated with the frontend URL
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}
app.use(cors(corsOptions));

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


app.listen(config.port, () => {
  console.log(`Running app at http://localhost:${config.port}`)
})