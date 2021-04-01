var config = require('../../config/config.json')

const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

exports.sequelize = sequelize;

// const { Pool } = require('pg')

// const pool = new Pool({
//     host: config.host,
//     user: config.user,
//     password: config.password,
//     database: config.database,
//     port: 5432,
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// })

// exports.pool = pool;