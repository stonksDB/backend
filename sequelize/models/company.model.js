const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('company', {

        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        },
        company_name: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        logo_url: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        market_cap: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        last_update: {
            type: DataTypes.DATE
        }
    })
}