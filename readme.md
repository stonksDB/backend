# The project

This project consists of the back-end for the WIE project of 2021 semester n.4

## Configurations

In order to make everything work, the ```config_example.json``` in the ```./config``` folder has to be copied and renamed to ```config.json``` and the json has to be filled with proper values to access the database.

In order to start the web application run from the root folder of the project

    npm start

1. run "npm install"
2. run "npm install -g node-dev"
If it does not work run the following sequence of commands

    npm install -g node-dev
    npm install
    npm start

## End-Points

* /data
* /auth
* /search

### /data

This end-point allows to retrieve data to be shown in the application. It provides information about Stock, News and Companies.

* /data/news?\<filteringParameters>

### /auth

### /search

## Development

Standard for endpoints -> "https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers"
Connection to postgres pool -> "https://node-postgres.com/features/connecting"
Sequelize for real ORM -> "https://sequelize.org/master/index.html"
Multiple repository push -> "https://gist.github.com/rvl/c3f156e117e22a25f242"
Swagger implementation -> "https://blog.logrocket.com/documenting-your-express-api-with-swagger/"

## Backend description

The backend is implemented with the well known javascript runtime NodeJS ("https://nodejs.org/en/"). Some libraries are used to implement at best the architecture: ExpressJS is used to handle api request and create the adequate endpoint routes. In order to make the server a real MVC oriented infrastructure an ORM framework has been utilized: Sequelize. It allows to create object with Javascript and make bidirectional relation with a SQL database which is used in the infrastructure. In order to connect to the database a plugin called "pg" has been utilized. In order to take advantage the connection with the database we leveraged the power of the "pool" connections. Since we aim to get an high number of requests per second it was fundamental for us to get this kind of speedup.

## Future implementations

Our road map for the future is very loaded in the sense that we have a lot of ideas ad proposal that we would like to develop. Our priority anyhow is to develop a portfolio management system, in which a user can keep track of his/her investments and have an overview of the gains or losses. Our second aim is also to be able to provide different type of assets from crypto to currencies and securities. For this we have to make some deep changes to the database in order to abstract the concept away from just stocks.
If we still have time our goal is to build the FIRST EVER IN THE WORLD peer stock exchange open 24/7. The idea is to make accessible to all our members the opportunity to sell the assets to other registered users, through a peer market exchange.
