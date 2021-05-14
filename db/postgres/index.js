const config = require('../../config/config.json')
const Sequelize = require('sequelize');

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

module.exports = sequelize;