const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('company', {

        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        },     
        name: {
            type: DataTypes.STRING(80)
        },
        sector: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        logo_url: {
            type: DataTypes.STRING(200)
        },
        city: {
            type: DataTypes.STRING(50)
        },
        website: {
            type: DataTypes.STRING(200)
        },
        phone: {
            type: DataTypes.STRING(25)
        },
        state: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        industry_id: {
            type: DataTypes.INTEGER
        },
        currenct: {
            type: DataTypes.STRING(7),
            allowNull: false
        }        
    }, {
        tableName:"companies"
    })
}