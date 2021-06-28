const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('stock', {

        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        },
        mic: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING(7),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(80)
        },
        type: {
            type: DataTypes.STRING(50)
        },
        regular_market_price: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        volume: {
            type: DataTypes.DOUBLE,
        },
        market_cap: {
            type: DataTypes.INTEGER
        },
        price_last_update: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: 'unknown'
        },
        ratio: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 1.0
        }
    }, {
        tableName:"stocks"
    })
}