const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('history', {

        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false.valueOf,
            primaryKey: true
        },
        open: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        high: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        low: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        close: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        volume: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        tableName:"past_values"
    })
}