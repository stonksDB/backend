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
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        last_update: {
            type: DataTypes.DATE
        }
    })
}