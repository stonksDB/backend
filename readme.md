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
