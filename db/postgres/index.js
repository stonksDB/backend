var config = require('../../config/config.json')

const { Pool } = require('pg')

const pool = new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: 5432,
    max: 100,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

exports.pool = pool;