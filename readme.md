
# StonksDB

This repository consists of the back-end for the WIE project of 2021 (second Semester)

## Authors

- [@LucaTaddeo](https://github.com/LucaTaddeo)
- [@alegotta](https://github.com/alegotta)
- [@gavi210](https://github.com/gavi210)
- [@Sebo_the_tramp](https://github.com/Sebo-the-tramp)

## Description

The backend is implemented with the well known javascript runtime NodeJS ("https://nodejs.org/en/"). Some libraries are used to implement at best the architecture: ExpressJS is used to handle api request and create the adequate endpoint routes. In order to make the server a real MVC oriented infrastructure an ORM framework has been utilized: Sequelize. It allows to create object with Javascript and make bidirectional relation with a SQL database which is used in the infrastructure. In order to connect to the database a plugin called "pg" has been utilized. In order to take advantage the connection with the database we leveraged the power of the "pool" connections. Since we aim to get an high number of requests per second it was fundamental for us to get this kind of speedup.
  
## Acknowledgements

- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
- [Standard for endpoints](https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers)
- [Connection to postgres pool](https://node-postgres.com/features/connecting)
- [Sequelize for real ORM](https://sequelize.org/master/index.html)
- [Multiple repository push](https://gist.github.com/rvl/c3f156e117e22a25f242)
- [Swagger implementation](https://blog.logrocket.com/documenting-your-express-api-with-swagger/)

## Demo

Insert gif or link to demo

## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
  
## License

[MIT](https://choosealicense.com/licenses/mit/)

![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

## API

To put the link of postman
  
## Optimizations

Some optimization were made in order to decrease the amount of data in the DB, with the use of a cache method implemented on the stock price as well as on the history part.
  
## Related

The prject is born from a previous Database project that can be found here:

[DATABASE PROJECT UNIBZ](https://github.com/gavi210/DataBase_Final_Project)

## Roadmap

- Finish the project

- Make it the first online peer stock exchange

## Future implementations

Our road map for the future is very loaded in the sense that we have a lot of ideas ad proposal that we would like to develop. Our priority anyhow is to develop a portfolio management system, in which a user can keep track of his/her investments and have an overview of the gains or losses. Our second aim is also to be able to provide different type of assets from crypto to currencies and securities. For this we have to make some deep changes to the database in order to abstract the concept away from just stocks.
If we still have time our goal is to build the FIRST EVER IN THE WORLD peer stock exchange open 24/7. The idea is to make accessible to all our members the opportunity to sell the assets to other registered users, through a peer market exchange.

## Configurations

In order to make everything work, the ```config_example.json``` in the ```./config``` folder has to be copied and renamed to ```config.json``` and the json has to be filled with proper values to access the database.
  
## Run Locally

Clone the project

```bash
  git clone https://github.com/stonksDB/backend
```

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Used By

This project is used by the following companies:

- Us
- _Us but in italics_
