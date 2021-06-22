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
        regular_market_price: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },       
        name: {
            type: DataTypes.STRING(80)
        },
        market_cap: {
            type: DataTypes.INTEGER
        },
        logo_url: {
            type: DataTypes.STRING(200)
        },
        city: {
            type: DataTypes.STRING(50)
        },
        industry_id: {
            type: DataTypes.INTEGER
        },
        website: {
            type: DataTypes.STRING(200)
        },
        phone: {
            type: DataTypes.STRING(25)
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